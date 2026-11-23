import { fetchWorkspace, saveWorkspace } from '@/founders/api/workspace';

const SAVE_DELAY_MS = 600;
const RETRY_DELAY_MS = 5000;
const POLL_INTERVAL_MS = 30000;

/** Network trouble, rate limits and server errors are worth retrying; a rejected body is not. */
const isRetryable = (error) => error.status === 0 || error.status === 429 || error.status >= 500;

/**
 * Keeps HQ's shared workspace in step with the server copy (optimistic concurrency, see API.md):
 *
 * - queue(data) saves the newest data after a short pause, so a burst of edits is one PUT;
 * - a 409 means another founder saved first: their copy wins and is handed to onConflict;
 * - while there are no unsaved edits, the server is polled (tab visible only) and newer copies
 *   are handed to onRemoteChange.
 */
export default class WorkspaceSync {
  pending = null; // newest data not yet sent
  saving = null; // promise of the PUT in flight
  failing = false;
  stopped = false;

  constructor({ version, onRemoteChange, onConflict, onSaveError }) {
    this.version = version;
    this.onRemoteChange = onRemoteChange;
    this.onConflict = onConflict;
    this.onSaveError = onSaveError;
  }

  get hasUnsavedChanges() {
    return Boolean(this.pending || this.saving);
  }

  start() {
    this.pollTimer = setInterval(() => this.poll(), POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  stop() {
    this.stopped = true;
    clearTimeout(this.saveTimer);
    clearInterval(this.pollTimer);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  queue(data) {
    this.pending = data;
    this.scheduleSave(SAVE_DELAY_MS);
  }

  /** Sends unsaved data now; resolves once everything queued so far has been answered. */
  async flush() {
    clearTimeout(this.saveTimer);
    if (this.saving) {
      await this.saving;
      return this.flush();
    }
    if (!this.pending || this.stopped) return;
    const data = this.pending;
    this.pending = null;
    this.saving = this.save(data);
    try {
      await this.saving;
    } finally {
      this.saving = null;
    }
    if (this.pending && !this.failing) this.scheduleSave(SAVE_DELAY_MS);
  }

  /** Asks the server for a newer copy, unless local edits are on their way (they win or get a 409). */
  async poll() {
    if (this.stopped || this.polling || this.hasUnsavedChanges || document.visibilityState !== 'visible') return;
    this.polling = true;
    try {
      const remote = await fetchWorkspace();
      if (!this.stopped && !this.hasUnsavedChanges && remote.data && remote.version > this.version) {
        this.version = remote.version;
        this.onRemoteChange(remote);
      }
    } catch {
      // Try again at the next poll; a 401 has already ended the session.
    } finally {
      this.polling = false;
    }
  }

  async save(data) {
    try {
      const saved = await saveWorkspace(data, this.version);
      this.version = saved.version;
      this.failing = false;
    } catch (error) {
      if (error.status === 409 && error.details) {
        this.version = error.details.version;
        this.pending = null; // edits made on the older copy are dropped with it
        this.onConflict(error.details);
        return;
      }
      if (error.status === 401) return;
      this.pending = this.pending || data;
      if (!this.failing) this.onSaveError(error);
      this.failing = true;
      if (isRetryable(error)) this.scheduleSave(RETRY_DELAY_MS);
    }
  }

  scheduleSave(delay) {
    clearTimeout(this.saveTimer);
    if (!this.stopped) this.saveTimer = setTimeout(() => this.flush(), delay);
  }

  handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') this.flush();
    else this.poll();
  };

  handleBeforeUnload = (event) => {
    if (!this.hasUnsavedChanges) return;
    this.flush();
    event.preventDefault(); // ask before leaving while a save is still pending
  };
}
