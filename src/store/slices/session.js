import { api, ApiError, onExpired, refreshSession, setAccessToken } from '@/api/client';
import { loadAll, reload } from '@/api/loaders';
import { firstAllowedTarget, pidOf } from '@/domain/permissions';
import { liveBase } from '@/domain/live';
import { emptyData, initialUiState } from '../initialState';
import { currentPath, navigate } from '../navigation';
import { serverNow } from '@/lib/clock';
import { LOGIN_PATH, audienceMismatch, isPortalPath, landingFor, leaveTo, nextFromLocation } from '@/lib/sso';

/**
 * Session: restore on page load, sign in / out, and load all data from the API.
 *   boot: 'pending' | 'ready' | 'error' — App shows a splash until it isn't 'pending'.
 *   me:   the signed-in principal from the API ({id, role, pid, perms…}).
 *   auth: { uid } — kept for existing selectors (authUser, sessionUser).
 *
 * One sign-in for every area (docs/SSO.md): after sign-in the user lands on `?next=` or their
 * `home`; when that is Partners / Founders HQ (or the user has no portal access) the browser goes
 * there with a full page load and the portal's data is never loaded.
 */
export const createSessionSlice = (set, get) => ({
  boot: 'pending',
  bootError: '',
  me: null,
  auth: null,

  /** Load everything the signed-in user may see. */
  async bootstrap() {
    const me = get().me;
    const data = await loadAll(me);
    set({ ...data, boot: 'ready', bootError: '' });
  },

  /** Re-fetch some domains: get().resync(['delivery']) — used after writes with wide side effects. */
  async resync(names) {
    const data = await reload(get().me, names);
    set(data);
  },

  /**
   * On page load (on a portal path): use the refresh cookie to restore the session, then bootstrap.
   * Someone without portal access (a partner) goes to their home instead; on /login a signed-in
   * user is sent on as if they had just signed in.
   */
  async restoreSession() {
    onExpired(() => get().endSession('Your session expired — sign in again'));
    const s = await refreshSession();
    if (!s) return set({ boot: 'ready' });
    const onLogin = currentPath() === LOGIN_PATH;
    const dest = onLogin || (s.user.apps && s.user.apps.portal === false) ? landingFor(s.user, onLogin ? nextFromLocation() : null) : null;
    if (dest && !isPortalPath(dest)) return leaveTo(dest, { replace: true });
    try {
      await get().startSession(s.user, { landing: onLogin, next: dest });
    } catch (e) {
      set({ boot: 'error', bootError: e.message });
    }
  },

  /**
   * Shared by login + restore: store the principal, load data, then route — to `next` (a portal
   * path), else the first allowed page (`landing`), else stay where we are if still allowed.
   */
  async startSession(me, { landing, next = null }) {
    const sup = me.role && me.role.id === 'r-super';
    set({ me, auth: { uid: me.id, at: serverNow() }, viewAs: sup ? null : me.id, boot: 'pending' });
    await get().bootstrap();
    if (next) {
      navigate(next);
      get().fixAccess();
    } else if (landing) {
      const hit = sup ? { path: '/live' } : firstAllowedTarget(get()) || { path: '/live' };
      if (hit.tab) set((s) => ({ pj: { ...s.pj, tab: hit.tab, selP: null, selM: null } }));
      navigate(hit.path);
    } else {
      get().fixAccess();
    }
  },

  /**
   * After a successful sign-in (login / accept-invite): go to `?next=` or the user's home. Returns
   * true when that is outside the portal (the page is unloading), false once the portal is ready.
   * Throws when the portal data fails to load.
   */
  async enter(user) {
    const dest = landingFor(user, nextFromLocation());
    if (dest && !isPortalPath(dest)) {
      leaveTo(dest);
      return true;
    }
    await get().startSession(user, { landing: true, next: dest });
    return false;
  },

  /** Sign in. Returns an error message, or undefined on success. */
  async login(email, pw, audience = null) {
    let res;
    try {
      res = await api.post('/auth/login', { email: (email || '').trim(), password: pw || '' });
    } catch (e) {
      return e instanceof ApiError ? e.message : 'Sign-in failed — try again';
    }
    // Signed in through the wrong box (e.g. a partner under "Founder"): end that session at once,
    // before any data loads or the workday starts, and say which box to use.
    const mismatch = audienceMismatch(res.user, audience);
    if (mismatch) {
      await api.post('/auth/logout').catch(() => {});
      return mismatch;
    }
    setAccessToken(res.accessToken);
    try {
      if (await get().enter(res.user)) return undefined;
    } catch (e) {
      set({ boot: 'error', bootError: e.message });
      return e.message;
    }
    get().flash(`Welcome, ${res.user.name.split(' ')[0]}`);
    // Logging in starts the workday for staff — only on the first sign-in of the day. Someone who
    // already ended their shift today (or is still checked in) is not checked in again.
    const pid = res.user.role.id === 'r-super' ? null : pidOf(res.user);
    const a = pid && liveBase(get().live).att[pid];
    if (pid && res.user.role.id !== 'r-client' && !a && get().checkIn) await get().checkIn(pid);
    else if (pid && a && a.out) get().flash("Today's shift has ended · see you tomorrow");
    return undefined;
  },

  /**
   * Accept an invite with the one-time token from the admin's link: sets the password, activates the
   * account and signs in. Returns an error message or undefined.
   */
  async acceptInvite(email, token, password) {
    let res;
    try {
      res = await api.post('/auth/accept-invite', { email, token, password });
    } catch (e) {
      return e instanceof ApiError ? e.message : 'Couldn’t set your password — try again';
    }
    if (res && res.accessToken) {
      setAccessToken(res.accessToken);
      try {
        if (await get().enter(res.user)) return undefined;
      } catch (e) {
        set({ boot: 'error', bootError: e.message });
        return e.message;
      }
      get().flash(`Welcome, ${res.user.name.split(' ')[0]} — your account is ready`);
    } else {
      navigate(LOGIN_PATH);
      get().flash('Password set — sign in to continue');
    }
    return undefined;
  },

  /** Set a new password with a reset link's token, then send the user to sign in. */
  async resetPassword(email, token, password) {
    try {
      await api.post('/auth/reset-password', { email, token, password });
    } catch (e) {
      return e instanceof ApiError ? e.message : 'Couldn’t reset your password — try again';
    }
    navigate(LOGIN_PATH);
    get().flash('Password updated — sign in with your new password');
    return undefined;
  },

  /** Sign out. Staff still checked in must submit the end-of-shift report first (original rule). */
  /**
   * Sign out of this device. Attendance is not touched: someone who is checked in stays checked in
   * (their shift, break and running timer carry on) — they check out / end their shift separately.
   */
  async logout() {
    const S = get();
    const me = S.me;
    let note;
    if (me && me.role.id !== 'r-super' && me.role.id !== 'r-client') {
      const a = liveBase(S.live).att[pidOf(me)];
      if (a && !a.out) note = 'Logged out · your shift is still running — use End shift when you finish for the day';
    }
    await get().endSession(note);
  },

  /** Clear the session locally and on the server; wipe all loaded data from memory. */
  async endSession(message) {
    try { await api.post('/auth/logout'); } catch { /* already signed out */ }
    setAccessToken(null);
    set({ ...emptyData(), ...initialUiState(), me: null, auth: null, boot: 'ready' });
    navigate(LOGIN_PATH);
    if (message) get().flash(message);
  },
});
