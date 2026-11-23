/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import React from 'react';
import { KEY, PEOPLE, COS, coOf, segOf, ACCENTS, SIDES, SIZES, PAGE_DEF, PF_DEF, PARTNER_DEF, PARTNER_ROWS, iso, uid, act, HX_DEF, RX_DEF, DX_DEF, parseQuick, normRv, load } from './core';
import { savePrefs } from '@/founders/api/workspace';
import WorkspaceSync from '../sync/WorkspaceSync';
import { TEAM_TASK_VIEWS, TEAM_TASKS_REFRESH_MS, createTeamTask, openTeamTaskInHQ, reloadTeamTasks, toggleTeamTask, watchTeamTasks } from '../teamTasks/hqTeamTasks';
import { setTeamTaskCompanies } from '../teamTasks/portalBridge';
import { LEAD_VIEWS, LEADS_REFRESH_MS, reloadLeads, watchLeads } from '../leads/hqLeads';

const PREFS_SAVE_DELAY_MS = 600;

/** Popover ids anchored to on-screen positions; these close when anything scrolls. */
const SCROLL_CLOSED_POPOVER = /^(p?st|p?co|p?dp|dp|p?ow|p?pr|pgl|pwt|prp|ra|pa|f|v|g):/;

/**
 * Props (from FoundersHQApp): `account` (signed-in user), `workspace` ({ data, version } from the API),
 * `prefs` (this user's saved preferences), `vault` (sealed vault or null), `onSignOut`.
 */
export default class HQState extends React.Component {
  // Per-screen UI state. Keys keep their prototype names because the other logic files and views read them.
  // `me` is the signed-in account's seat; `prefs` is keyed by seat like the prototype, holding only "me".
  state = {
    prefs: { [this.props.account.seat]: this.props.prefs || {} },
    view: (this.props.prefs && this.props.prefs.start) || 'home',
    coView: null, me: this.props.account.seat, data: load(this.props.workspace.data),
    nr: { role: '', co: 'mariox', owner: 'rahul', budget: '', due: '' },
    sel: null, ai: { busy: false, note: '', err: false },
    projCo: 'combined', fco: 'combined', fhz: 12, fview: 'chart',
    fsc: { grow: null, costPct: 0, hires: false, oneAmt: 0, oneM: 3, raise: 0, raiseM: 6 }, fq: '', fcat: 'any',
    frf: 'open', fadd: {},
    cmd: { open: false, q: '', idx: 0 }, gopen: null, gf: { status: 'any', owner: 'any', when: 'any', q: '' },
    gsort: localStorage.getItem(KEY + '-gsort') || 'target',
    ggroup: localStorage.getItem(KEY + '-ggroup') || 'company',
    gview: localStorage.getItem(KEY + '-gview') || 'cards', gupd: { val: '', note: '' },
    dopen: null, dfilter: 'all', dco: 'any', dq: '',
    gco: 'any', wk: 0, wrBusy: false, wrNote: '', wrCopied: false,
    bday: null, pop: null, popXY: null, gcol: { 'status:Done': true }, fresh: [], peek: null, slash: null,
    fb: null, exp: {},
    dx: {
      ...DX_DEF,
      sort: localStorage.getItem(KEY + '-dsort') || 'newest',
      group: localStorage.getItem(KEY + '-dgroup') || 'status',
    },
    dgcol: {}, dcdraft: '',
    wrf: { co: 'any', who: 'all' },
    cmx: {
      q: '', status: 'any', country: 'any', industry: 'any', owner: 'any', setup: 'any', sort: 'name', view: 'grid',
    },
    cmOpen: null, cmNew: null, cnTab: 'overview', cxr: null, cxch: 'all', cxf: null, cxa: null, cxaf: 'open',
    cxe: null, cxef: 'active', cxv: null, cxvt: 'company', cxvv: 'board', cxchk: null, cxq: '', cxbusy: false,
    cxnote: '', cxdn: '', cxdu: '', cxcm: {}, cnq: '', cncat: 'any', cnPb: null, cnCo: '', cnEdit: false,
    cnCountry: 'any',
    rx: {
      ...RX_DEF,
      sort: localStorage.getItem(KEY + '-rsort') || 'updated',
      group: localStorage.getItem(KEY + '-rgroup') || 'status',
      view: localStorage.getItem(KEY + '-rview') || 'list',
    },
    rcdraft: '', rtag: '',
    hx: {
      ...HX_DEF,
      view: localStorage.getItem(KEY + '-hview') || 'board',
      sort: localStorage.getItem(KEY + '-hsort') || 'due',
    },
    hcdraft: '', hcf: 'active', hsk: '',
    docTab: 'home', page: null,
    // eslint-disable-next-line no-dupe-keys -- duplicate kept from the prototype; the later value wins
    dq: '',
    docNote: '', fileCo: 'any', est: '',
    dfx: {
      kind: 'all', owner: 'any', tag: 'any', status: 'any', ftype: 'any', sort: 'edited',
      view: localStorage.getItem(KEY + '-dview') || 'grid',
    },
    fsel: {}, thumbs: {}, ptag: '', drag: false,
    // Sales leads (internal portal, see leads/hqLeads): HQ's only sales pipeline; never part of `data`
    // (the founders' old deals stay in `data.deals`, unused).
    leads: [],
    // Team tasks (internal portal, see teamTasks/hqTeamTasks): HQ's only tasks; never part of `data`
    // (the workspace keeps just `ttLinks`, what each task was made from).
    teamTasks: [],
    v: {
      pw: '', pw2: '', err: '', busy: false, key: null, salt: null, items: [], adding: false, sealed: this.props.vault,
      editId: null, f: {}, q: '', co: 'any', shown: {}, copied: '',
    },
  };

  componentDidMount() {
    this._sync = new WorkspaceSync({
      version: this.props.workspace.version,
      onRemoteChange: remote => this.showServerWorkspace(remote),
      onConflict: remote => {
        this.showServerWorkspace(remote);
        this.toastMsg('Updated by ' + ((remote.updatedBy && remote.updatedBy.name) || 'the other founder') + ' — showing the latest');
      },
      onSaveError: error => this.toastMsg('Couldn’t save your changes: ' + error.message),
    });
    this._sync.start();

    // Attendance: today's Mariox check-ins from the internal portal, refreshed every 2 minutes.
    this.loadAttendance();
    this._attTimer = setInterval(() => this.loadAttendance(), 2 * 60 * 1000);
    // Sales leads (internal portal): follow the portal store; re-read while a page that shows them is open.
    this._leadsUnwatch = watchLeads(leads => this.setState({ leads }));
    reloadLeads();
    this._leadsTimer = setInterval(() => {
      if (LEAD_VIEWS.includes(this.state.view) && !document.hidden) reloadLeads();
    }, LEADS_REFRESH_MS);
    // Team tasks (internal portal): follow the portal store; re-read while a page that shows them is open.
    setTeamTaskCompanies(COS);
    this._ttUnwatch = watchTeamTasks(teamTasks => this.setState({ teamTasks }));
    reloadTeamTasks();
    this._ttTimer = setInterval(() => {
      if (TEAM_TASK_VIEWS.includes(this.state.view) && !document.hidden) reloadTeamTasks();
    }, TEAM_TASKS_REFRESH_MS);
    this.refreshEst();
    this.autosize();

    this._onScroll = () => {
      if (this.state.pop && SCROLL_CLOSED_POPOVER.test(this.state.pop)) this.setState({ pop: null });
    };
    window.addEventListener('scroll', this._onScroll, true);

    // Escape closes the top-most layer: command palette, then popovers/slash menu, then side panels.
    this._onEsc = event => {
      if (event.key !== 'Escape') return;
      if (this.state.cmd.open) {
        this.setState({ cmd: { open: false, q: '', idx: 0 } });
        return;
      }
      if (this.state.pop || this.state.slash) {
        this.setState({ pop: null, slash: null });
        return;
      }
      if (this.state.dopen) this.setState({ dopen: null });
      else if (this.state.sel && this.state.view === 'research') this.setState({ sel: null });
      else if (this.state.gopen) this.setState({ gopen: null });
      else if (this.state.peek) this.setState({ peek: null });
    };
    window.addEventListener('keydown', this._onEsc);

    // Cmd/Ctrl+K opens the command palette.
    this._onK = event => {
      if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'K')) {
        event.preventDefault();
        this.openCmd();
      }
    };
    window.addEventListener('keydown', this._onK);
  }

  componentWillUnmount() {
    this._sync.flush();
    this._sync.stop();
    if (this._prefsTimer) {
      clearTimeout(this._prefsTimer);
      this.savePrefsNow();
    }
    clearInterval(this._attTimer);
    clearInterval(this._leadsTimer);
    clearInterval(this._ttTimer);
    if (this._ttUnwatch) this._ttUnwatch();
    if (this._leadsUnwatch) this._leadsUnwatch();
    window.removeEventListener('scroll', this._onScroll, true);
    window.removeEventListener('keydown', this._onEsc);
    window.removeEventListener('keydown', this._onK);
  }

  componentDidUpdate(_prevProps, prevState) {
    // Opening a page that shows leads re-reads them (Sales → Pipeline does so itself).
    if (prevState && prevState.view !== this.state.view && LEAD_VIEWS.includes(this.state.view) && this.state.view !== 'pipeline') reloadLeads();
    // Opening a page that shows team tasks re-reads them.
    if (prevState && prevState.view !== this.state.view && TEAM_TASK_VIEWS.includes(this.state.view)) reloadTeamTasks();
    // Team task forms and chips offer HQ's active companies (incl. ones the founders added).
    if (prevState && prevState.data !== this.state.data) setTeamTaskCompanies(COS);
    // Apply a focus request queued in this._focus ({ sel, pos }) once the DOM has updated.
    if (this._focus) {
      const request = this._focus;
      this._focus = null;
      requestAnimationFrame(() => {
        const element = document.querySelector(request.sel);
        if (!element) return;
        element.focus();
        if (request.pos != null && element.setSelectionRange) {
          const caret = request.pos === 'end' ? element.value.length : request.pos;
          element.setSelectionRange(caret, caret);
        }
      });
    }
    this.autosize();
  }

  /** Grow textareas to fit their content in browsers without CSS `field-sizing: content`. */
  autosize() {
    if (this._fs === undefined) this._fs = !!(window.CSS && CSS.supports && CSS.supports('field-sizing', 'content'));
    if (this._fs) return;
    document.querySelectorAll('textarea[data-bid]').forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  }

  /** Current user's preferences merged over defaults; `pages` lists every known page in the user's order. */
  pf() {
    const saved = (this.state.prefs || {})[this.state.me] || {};
    const prefs = { ...PF_DEF, ...saved };
    const savedPages = (saved.pages || []).filter(page => PAGE_DEF.some(def => def[0] === page.id));
    // Insert pages the user has never arranged right after their predecessor in PAGE_DEF.
    const pages = [...savedPages];
    PAGE_DEF.forEach((def, defIndex) => {
      if (pages.some(page => page.id === def[0])) return;
      const prevAt = defIndex ? pages.findIndex(page => page.id === PAGE_DEF[defIndex - 1][0]) : -1;
      pages.splice(prevAt + 1, 0, { id: def[0], label: '', on: true });
    });
    prefs.pages = pages.map(page => ({ ...page, def: PAGE_DEF.find(def => def[0] === page.id)[1] }));
    return prefs;
  }

  /** Replaces the on-screen data with a copy from the server (the other founder's latest save). */
  showServerWorkspace(remote) {
    this._pend = null;
    this.setState({ data: load(remote.data) });
  }

  /** Merge `patch` into the current user's saved preferences. */
  setPf(patch) {
    const allPrefs = { ...(this.state.prefs || {}) }, me = this.state.me;
    allPrefs[me] = { ...(allPrefs[me] || {}), ...patch };
    this.setState({ prefs: allPrefs });
    this.savePrefsSoon();
  }

  /** Saves the current user's preferences after a short pause (typing a name is one save, not one per key). */
  savePrefsSoon() {
    clearTimeout(this._prefsTimer);
    this._prefsTimer = setTimeout(() => this.savePrefsNow(), PREFS_SAVE_DELAY_MS);
  }

  savePrefsNow() {
    this._prefsTimer = null;
    savePrefs((this.state.prefs || {})[this.state.me] || {}).catch(error => {
      if (error.status !== 401) this.toastMsg('Couldn’t save your settings: ' + error.message);
    });
  }

  /** View model for the Settings screen. */
  settingsVM(pf, _view) {
    const ring = selected => selected ? '0 0 0 2px #fff, 0 0 0 4px oklch(0.23 0.015 265)' : 'none';
    const setPages = mutate => {
      const pages = pf.pages.map(page => ({ id: page.id, label: page.label, on: page.on }));
      mutate(pages);
      this.setPf({ pages });
    };
    const lastPage = pf.pages.length - 1;
    return {
      accents: ACCENTS.map(([id, label, color]) => ({
        label, sw: color, ring: ring(pf.acc === id), go: () => this.setPf({ acc: id }),
      })),
      sides: SIDES.map(([id, label, hue, chroma]) => ({
        label, sw: 'oklch(0.21 ' + chroma + ' ' + hue + ')', ring: ring(pf.side === id), go: () => this.setPf({ side: id }),
      })),
      sizeSeg: segOf(SIZES, pf.size, size => this.setPf({ size })),
      name: pf.name, onName: event => this.setPf({ name: event.target.value }),
      sub: pf.sub, onSub: event => this.setPf({ sub: event.target.value }),
      pages: pf.pages.map((page, index) => ({
        label: page.label, def: page.def, locked: page.id === 'home', canHide: page.id !== 'home',
        onLabel: event => setPages(pages => { pages[index].label = event.target.value; }),
        on: page.on, mark: page.on ? '✓' : '',
        boxBg: page.on ? 'var(--acc, oklch(0.5 0.17 265))' : '#fff',
        boxBd: page.on ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.78 0.01 265)',
        rowOp: page.on ? '1' : '0.55',
        toggle: () => page.id !== 'home' && setPages(pages => { pages[index].on = !pages[index].on; }),
        up: () => index > 0 && setPages(pages => { [pages[index - 1], pages[index]] = [pages[index], pages[index - 1]]; }),
        down: () => index < lastPage && setPages(pages => { [pages[index + 1], pages[index]] = [pages[index], pages[index + 1]]; }),
        upOp: index > 0 ? '1' : '0.3', downOp: index < lastPage ? '1' : '0.3',
      })),
      startOpts: pf.pages.filter(page => page.on).map(page => ({ v: page.id, l: page.label || page.def })),
      start: pf.start, onStart: event => this.setPf({ start: event.target.value }),
      moneySeg: segOf(
        [['Lakh / Crore', '₹12.5 L / ₹1.2 Cr'], ['Full rupees', '₹12,50,000']],
        pf.money || this.props.amountFormat || 'Lakh / Crore', money => this.setPf({ money })),
      reset: () => {
        if (!confirm('Reset all your settings to the default look?')) return;
        const allPrefs = { ...(this.state.prefs || {}) };
        delete allPrefs[this.state.me];
        this.setState({ prefs: allPrefs }, () => this.savePrefsNow());
        this.toastMsg('Settings reset to default');
      },
      who: (PEOPLE[this.state.me] || PEOPLE.rahul).first,
    };
  }

  /** Show a toast for 7 seconds, optionally with an action button (`label`, 'Undo' by default). */
  toastMsg(text, undo, label) {
    clearTimeout(this._tt);
    this._undo = undo || null;
    this.setState({ toast: text, toastLabel: label || 'Undo' });
    this._tt = setTimeout(() => {
      this._undo = null;
      this.setState({ toast: null });
    }, 7000);
  }

  /** Partner-programme link and counts, with defaults filled in. */
  partner() {
    const stored = this.state.data.partner || {};
    return { url: stored.url || '', at: stored.at || 0, n: { ...PARTNER_DEF, ...(stored.n || {}) } };
  }

  partnerVM() {
    const partner = this.partner(), total = Object.values(partner.n).reduce((sum, count) => sum + (+count || 0), 0);
    // Normalise the stored record, apply the change, then stamp the update time.
    const setPartner = mutate => this.upd(data => {
      const current = data.partner || {};
      data.partner = { url: current.url || '', n: { ...PARTNER_DEF, ...(current.n || {}) } };
      mutate(data.partner);
      data.partner.at = Date.now();
    });
    return {
      isOpen: !!this.state.ptOpen,
      open: () => this.setState({ ptOpen: true }),
      close: () => this.setState({ ptOpen: false }),
      total: String(total), hasN: total > 0,
      updated: partner.at
        ? 'Numbers updated ' + new Date(partner.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : 'No numbers entered yet',
      url: partner.url, hasUrl: !!partner.url,
      onUrl: event => {
        const url = event.target.value.trim();
        // Add https:// to bare hosts, but leave full URLs and local .html files alone.
        setPartner(record => { record.url = url && !/^https?:\/\//.test(url) && !/\.html$/.test(url) ? 'https://' + url : url; });
      },
      rows: PARTNER_ROWS.map(([field, label]) => ({
        label, v: String(partner.n[field]),
        color: +partner.n[field] ? 'oklch(0.55 0.18 40)' : 'oklch(0.23 0.015 265)',
        on: event => setPartner(record => { record.n[field] = Math.max(0, parseInt(event.target.value, 10) || 0); }),
      })),
    };
  }

  // ─── Team tasks (HQ's only tasks; see teamTasks/hqTeamTasks) ──────────────────────────────────

  /**
   * Every team task the founder can see, in HQ's task shape, plus what each was made from in HQ
   * (workspace `ttLinks`: goal, dec, ctId, deal, res, pb …). Cached per team-task list / links.
   */
  tasksAll() {
    const list = this.state.teamTasks, links = this.state.data.ttLinks;
    if (this._ttCache && this._ttCache.list === list && this._ttCache.links === links) return this._ttCache.out;
    const out = (list || []).map(task => (links && links[task.id] ? { ...links[task.id], ...task } : task));
    this._ttCache = { list, links, out };
    return out;
  }

  /** Team tasks assigned to or given by the signed-in founder. */
  myTasks() {
    return this.tasksAll().filter(task => task.mine);
  }

  /** Open a team task's drawer in HQ → Tasks. */
  openTask(id) {
    openTeamTaskInHQ(this, id);
  }

  /** Tick a team task done (opens it when it can't be ticked here). */
  toggleTask(task) {
    toggleTeamTask(this, task);
  }

  /** Link a team task to an HQ record (`field` goal | dec | …), or unlink it with ''. Kept in the workspace. */
  setTaskLink(id, field, value) {
    this.upd(data => {
      const links = { ...(data.ttLinks || {}) };
      const next = { ...(links[id] || {}) };
      if (value) next[field] = value; else delete next[field];
      if (Object.keys(next).length) links[id] = next; else delete links[id];
      data.ttLinks = links;
    });
  }

  /**
   * Create a team task for the signed-in founder from HQ ("Make it a task", Add a task …).
   * `fields`: { title, co, due, pri, notes, from } (see createTeamTask); `link`: what it was made from
   * ({ dec: id } …, saved in the workspace's ttLinks). `open`: show its drawer in Tasks afterwards.
   * Resolves the new task id, or null when it couldn't be created (a toast says why).
   */
  async makeTeamTask(fields, link, { open = false } = {}) {
    let saved;
    try {
      saved = await createTeamTask(fields);
    } catch (error) {
      this.toastMsg('Couldn’t create the task: ' + ((error && error.message) || 'try again'));
      return null;
    }
    const me = this.state.me;
    this.upd(data => {
      if (link && Object.keys(link).length) data.ttLinks = { ...(data.ttLinks || {}), [saved.id]: link };
      act(data, me, 'added team task “' + saved.title + '”', fields.co);
    });
    if (open) this.openTask(saved.id);
    else this.toastMsg('Task created for you in ' + coOf(saved.co).name + ' · ' + saved.id, () => this.openTask(saved.id), 'Open');
    return saved.id;
  }

  openCmd() {
    this._focus = { sel: '[data-cmd]' };
    this.setState({ cmd: { open: true, q: '', idx: 0 }, pop: null });
  }

  /**
   * Create a team task for me from quick-add text (see parseQuick: #company, !priority, a due date).
   * Resolves the new id, or null when there is no title or it couldn't be created.
   */
  async quickAdd(text, extra, options) {
    const parsed = parseQuick(text);
    if (!parsed.title) return null;
    const co = parsed.co || (extra && extra.co) || 'mariox';
    const link = extra && extra.goal ? { goal: extra.goal } : null;
    return this.makeTeamTask({ title: parsed.title, co, due: parsed.due || '', pri: parsed.pri || 'Medium', from: (extra && extra.from) || '' }, link, options);
  }

  /** Create a goal (optionally from a template) due at the end of this quarter, and open it. */
  newGoal(co, tpl) {
    tpl = tpl || {};
    const now = new Date();
    const quarterEnd = iso(new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0));
    const id = uid(), me = this.state.me;
    const company = co && co !== 'any' ? co : (this.state.gco !== 'any' ? this.state.gco : 'mariox');
    this.upd(data => {
      data.goals.push({
        id, title: tpl.title || '', co: company, owner: me, start: iso(new Date()), target: quarterEnd,
        measure: tpl.measure || 'tasks', current: 0, goalVal: 0, unit: tpl.unit || '', notes: '',
        checkins: [], created: Date.now(),
      });
    });
    this._focus = { sel: '[data-gid="' + id + '"]' };
    // Keep the company filter unless it would hide the new goal.
    this.go('goals', { gopen: id, gco: this.state.gco === 'any' || this.state.gco === company ? this.state.gco : 'any' });
    return id;
  }

  /** Log a new decision and open it; with a title it is also posted to the activity feed. */
  newDecision(title) {
    const id = uid(), me = this.state.me;
    this.upd(data => {
      data.decisions.unshift({
        id, title: title || '', co: (this.state.dx && this.state.dx.co !== 'any') ? this.state.dx.co : 'mariox',
        by: 'both', status: 'Proposed', impact: 'Medium', due: '', context: '', options: '', opts: [],
        chosen: '', outcome: '', revisit: '', comments: [],
        log: [{ at: Date.now(), by: me, text: 'Logged this decision' }], created: Date.now(), decidedAt: null,
      });
      if (title) act(data, me, 'raised a decision: “' + title + '”', 'all');
    });
    if (!title) this._focus = { sel: '[data-did="' + id + '"]' };
    this.go('decisions', { dopen: id, dx: { ...this.state.dx, status: 'all', when: 'any', q: '' } });
  }

  /** Ask Claude to draft the weekly review summary from `facts` and store it under review `key`. */
  async draftReview(facts, key) {
    if (this.state.wrBusy) return;
    if (!window.claude || !window.claude.complete) {
      this.setState({ wrNote: 'Claude drafting is not available in this browser.' });
      return;
    }
    this.setState({ wrBusy: true, wrNote: 'Drafting…' });
    try {
      const draft = await window.claude.complete('You write a weekly review for two co-founders (Rahul Garg, founder; Saswat Sahu, co-founder) running Mariox Software, HROO and Arth in India. Using only the facts below, write a short review in plain text: 3-5 lines of wins, 2-4 lines of misses or risks, and 3 priorities for next week. Lines start with "- ". Group under the plain headings Wins, Misses, Next week. No markdown symbols other than "- ". Under 200 words.\n\nFACTS:\n' + facts);
      this.upd(data => { data.reviews[key] = { ...normRv(data.reviews[key]), summary: draft.trim() }; });
      this.setState({ wrBusy: false, wrNote: 'Draft added. Edit it as you like; it saves automatically.' });
    } catch {
      this.setState({ wrBusy: false, wrNote: 'Draft failed. Try again.' });
    }
  }
}
