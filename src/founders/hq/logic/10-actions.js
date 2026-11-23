/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import HQTasksHiringDocs from './09-tasks-hiring-docs';
import { fetchVault, saveVault } from '@/founders/api/vault';
import { fetchSummary } from '@/founders/summary/api/summary';
import { createTeamTask, openNewTeamTaskHere } from '../teamTasks/hqTeamTasks';
import { setTasksCompany } from '../teamTasks/portalBridge';
import { useStore } from '@/store';
import { PEOPLE, PORTAL_URLS, COS, coOf, deriveKey, seal, unseal, idb, parseCSV, toIso, guessCo, fmtSize, iso, dayDiff, uid, RED, AMBER, GREEN, MUTED, mdToBlocks } from './core';

export default class HQActions extends HQTasksHiringDocs {
  /**
   * View model for the Calendar page: a Monday-first month grid of the founder's due team tasks (assigned
   * to or given by them) plus the selected-day panel; "+ New task" opens the full form for that day.
   */
  calVM() {
    const state = this.state, update = patch => this.setState(patch), today = iso(new Date());
    const selectedDay = state.calSel || today, companyFilter = state.calCo || 'all';

    // Month grid: blank cells before the 1st (Monday-first), then enough whole weeks to cover the month.
    const [year, month] = (state.calM || today.slice(0, 7)).split('-').map(Number), monthIndex = month - 1;
    const leadingDays = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const weekCount = Math.ceil((leadingDays + new Date(year, monthIndex + 1, 0).getDate()) / 7);

    const matchesCompany = task => companyFilter === 'all' || task.co === companyFilter;
    // Team tasks assigned to or given by me (done ones struck through). None until they have loaded.
    const myDated = this.myTasks().filter(task => task.due);
    const datedTasks = myDated.filter(matchesCompany), tasksByDay = {};
    datedTasks.forEach(task => (tasksByDay[task.due] = tasksByDay[task.due] || []).push(task));
    // Within a day: open tasks first, then by priority (unknown priority counts as Medium).
    const priorityRank = { High: 0, Medium: 1, Low: 2 };
    Object.values(tasksByDay).forEach(dayTasks => dayTasks.sort((first, second) =>
      (first.done - second.done) || ((priorityRank[first.pri] ?? 1) - (priorityRank[second.pri] ?? 1))));

    // Opens the task's drawer right on the Calendar (TaskModalHost hosts it).
    const openTask = task => event => { if (event) event.stopPropagation(); this.setState({ pop: null }); useStore.getState().openTeamTaskDrawer(task.id); };

    const days = Array.from({ length: weekCount * 7 }, (_, cellIndex) => {
      const date = new Date(year, monthIndex, 1 - leadingDays + cellIndex), dayKey = iso(date), dayTasks = tasksByDay[dayKey] || [];
      const inMonth = date.getMonth() === monthIndex, isToday = dayKey === today, isSelected = dayKey === selectedDay;
      const overdueCount = dayKey < today ? dayTasks.filter(task => !task.done).length : 0;
      return {
        n: String(date.getDate()),
        hasMore: dayTasks.length > 3,
        more: '+' + (dayTasks.length - 3) + ' more',
        hasOver: !!overdueCount,
        over: overdueCount + ' late',
        overTip: overdueCount + ' overdue',
        chips: dayTasks.slice(0, 3).map(task => {
          const company = coOf(task.co);
          return {
            title: task.title || 'Untitled task',
            dot: company.bg || 'oklch(0.6 0.02 265)',
            bg: task.done ? 'oklch(0.965 0.003 85)' : company.tint,
            fg: task.done ? 'oklch(0.6 0.01 265)' : company.ink,
            deco: task.done ? 'line-through' : 'none',
            open: openTask(task),
            isTeam: true,
            who: task.team.who,
          };
        }),
        bg: isSelected ? 'color-mix(in oklch, var(--acc, oklch(0.5 0.17 265)) 6%, #fff)' : inMonth ? '#fff' : 'oklch(0.985 0.003 85)',
        ring: isSelected ? 'inset 0 0 0 2px var(--acc, oklch(0.5 0.17 265))' : 'none',
        numBg: isToday ? 'var(--acc, oklch(0.5 0.17 265))' : 'transparent',
        numFg: isToday ? '#fff' : inMonth ? 'oklch(0.3 0.015 265)' : 'oklch(0.68 0.01 265)',
        pick: () => update({ calSel: dayKey }),
      };
    });

    const monthKey = year + '-' + String(month).padStart(2, '0');
    const monthTasks = datedTasks.filter(task => task.due.slice(0, 7) === monthKey);
    const overdueInMonth = monthTasks.filter(task => !task.done && task.due < today).length;
    const shiftMonth = delta => { const date = new Date(year, monthIndex + delta, 1); update({ calM: iso(date).slice(0, 7) }); };

    const selectedDate = new Date(selectedDay + 'T00:00:00');
    const selectedTasks = tasksByDay[selectedDay] || [];

    const pinnedCompanies = COS.filter(company => company.pin).slice(0, 10);

    return {
      sub: monthTasks.length + (monthTasks.length === 1 ? ' task' : ' tasks') + ' due in '
        + new Date(year, monthIndex, 1).toLocaleDateString('en-IN', { month: 'long' })
        + (overdueInMonth ? ' · ' + overdueInMonth + ' overdue' : '') + ' · pick a day, then + New task',
      month: new Date(year, monthIndex, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      wd: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      days,
      prev: () => shiftMonth(-1),
      next: () => shiftMonth(1),
      today: () => update({ calM: null, calSel: today }),
      coTabs: [{ id: 'all', name: 'All companies' }, ...pinnedCompanies].map(company => {
        const active = companyFilter === company.id;
        return {
          label: company.name,
          hasTile: company.id !== 'all',
          tile: company.bg,
          ini: company.ini,
          n: String(myDated.filter(task => !task.done && (company.id === 'all' || task.co === company.id)).length),
          fg: active ? 'oklch(0.23 0.015 265)' : 'oklch(0.52 0.012 265)',
          bd: active ? 'var(--acc, oklch(0.5 0.17 265))' : 'transparent',
          go: () => update({ calCo: company.id }),
        };
      }),
      selLabel: selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
      selCount: selectedTasks.length ? selectedTasks.length + (selectedTasks.length === 1 ? ' task' : ' tasks') + ' due' : 'No tasks due',
      selEmpty: !selectedTasks.length,
      selTasks: selectedTasks.map(task => ({
        title: task.title,
        meta: [coOf(task.co).name, task.team.who, task.pri, task.status].filter(Boolean).join(' · '),
        deco: task.done ? 'line-through' : 'none',
        fg: task.done ? 'oklch(0.6 0.01 265)' : 'oklch(0.23 0.015 265)',
        mark: task.done ? '✓' : '',
        checkBg: task.done ? 'oklch(0.55 0.14 150)' : '#fff',
        checkBd: task.done ? 'oklch(0.55 0.14 150)' : 'oklch(0.75 0.01 265)',
        checkTip: task.done ? 'Open it to reopen' : task.canStatus ? 'Mark as done' : 'Open in Tasks',
        // Tick = done; a task that can't be ticked here (done already, or not mine to change) opens on the Calendar.
        toggle: event => {
          if (event) event.stopPropagation();
          if (task.done || !task.canStatus) openTask(task)(); else this.toggleTask(task);
        },
        open: openTask(task),
        isTeam: true,
        who: '',
      })),
      // The full "New task" form, over the Calendar, for the selected day and company.
      newTask: () => openNewTeamTaskHere({ co: companyFilter, due: selectedDay }),
    };
  }

  /**
   * View model for the Attendance page's HQ chrome: the company switcher and the sidebar "N in" badge.
   * Mariox (the only connected company) shows the internal portal's Attendance page (attendance/
   * AttendanceHost); other companies show a "not connected yet" note. The badge here comes from the
   * portal's founder summary (loadAttendance); the view prefers the portal store's count once loaded.
   */
  attVM() {
    const state = this.state, update = patch => this.setState(patch);
    const companyFilter = state.attCo || 'all';
    const team = state.attTeam;
    const people = (team && team.people) || [];
    const presentToday = people.filter(person => person && person.checkInAt).length;
    const pinnedCompanies = COS.filter(company => company.pin).slice(0, 10), isConnected = id => id === 'mariox', mariox = coOf('mariox');
    const navN = people.length ? presentToday + ' in' : '';
    const coTabs = [{ id: 'all', name: 'All companies' }, ...pinnedCompanies].map(company => {
      const active = companyFilter === company.id, connected = company.id === 'all' || isConnected(company.id);
      return {
        id: company.id,
        label: company.name,
        hasTile: company.id !== 'all',
        tile: company.bg,
        ini: company.ini,
        connected,
        n: connected ? navN : 'Not connected',
        fg: active ? 'oklch(0.23 0.015 265)' : 'oklch(0.52 0.012 265)',
        bd: active ? 'var(--acc, oklch(0.5 0.17 265))' : 'transparent',
        go: () => update({ attCo: company.id }),
      };
    });
    const unconnectedNames = pinnedCompanies.filter(company => !isConnected(company.id)).map(company => company.name).join(' and ');
    const base = { href: mariox.href || PORTAL_URLS.internal, navN, coTabs };
    if (companyFilter !== 'all' && !isConnected(companyFilter)) {
      const companyName = coOf(companyFilter).name;
      return {
        ...base, off: true, on: false,
        offTitle: companyName + ' attendance isn’t connected yet',
        offText: 'Attendance comes from each company’s CEO portal. Once the ' + companyName + ' portal is live, its team’s check-ins show up here.',
      };
    }
    return { ...base, off: false, on: true, note: companyFilter === 'all' && unconnectedNames ? 'Showing Mariox · ' + unconnectedNames + ' not connected yet' : '' };
  }

  /** Loads today's Mariox team check-ins (internal portal founder summary) into state.attTeam. */
  async loadAttendance() {
    try {
      const summary = await fetchSummary('mariox');
      this.setState({ attTeam: (summary && summary.team) || { people: [] }, attErr: null });
    } catch (error) {
      // Keep the last good list; only show the error when there is nothing to show.
      this.setState({ attErr: error.message || 'The internal portal didn’t respond.' });
    }
  }

  /** Shows how much browser storage the app uses. */
  refreshEst() {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => this.setState({ est: fmtSize(estimate.usage || 0) + ' used in this browser' }));
    }
  }
  /** Merges a patch into the vault state. */
  setV(patch) { this.setState(prev => ({ v: { ...prev.v, ...patch } })); }
  /** Shows a message in state[stateKey] and clears it after 3.5 s. */
  flash(stateKey, message) {
    this.setState({ [stateKey]: message });
    clearTimeout(this['_t' + stateKey]);
    this['_t' + stateKey] = setTimeout(() => this.setState({ [stateKey]: '' }), 3500);
  }

  /** Imports Notion exports: CSV databases become team tasks (assigned to me), Markdown/text files become pages. */
  async importNotion(event) {
    const files = [...event.target.files]; event.target.value = '';
    let pageCount = 0;
    const newPages = [], newTasks = [];
    for (const file of files) {
      const text = await file.text();
      if (/\.csv$/i.test(file.name)) {
        const rows = parseCSV(text); if (rows.length < 2) continue;
        const headers = rows[0].map(header => header.trim().toLowerCase());
        /** Index of the first column whose header equals or contains one of the keys (-1 if none). */
        const findColumn = (...keys) => headers.findIndex(header => keys.some(key => header === key || header.includes(key)));
        let titleCol = findColumn('name', 'title', 'task'); if (titleCol < 0) titleCol = 0;
        let dueCol = headers.findIndex(header => /due|deadline|end/.test(header));
        if (dueCol < 0) dueCol = headers.findIndex(header => header.includes('date') && !header.includes('start'));
        const statusCol = findColumn('status', 'done', 'complete');
        const priorityCol = findColumn('priority'), companyCol = findColumn('company', 'project', 'workspace');
        rows.slice(1).forEach(row => {
          const title = (row[titleCol] || '').trim(); if (!title) return;
          const priorityText = (priorityCol >= 0 ? row[priorityCol] : '').toLowerCase();
          const statusText = statusCol >= 0 ? row[statusCol] || '' : '';
          newTasks.push({
            title,
            co: companyCol >= 0 ? guessCo(row[companyCol]) : guessCo(file.name),
            due: dueCol >= 0 ? toIso(row[dueCol]) : '',
            pri: priorityText.includes('high') || priorityText.includes('urgent') || priorityText === 'p1' || priorityText === 'p0' ? 'High' : priorityText.includes('low') || priorityText === 'p3' ? 'Low' : 'Medium',
            status: /done|complete|yes|true|closed/i.test(statusText) ? 'Done'
              : /progress|doing|started/i.test(statusText) && !/not started/i.test(statusText) ? 'In progress' : 'To do',
            from: 'a Notion import (' + file.name + ')',
          });
        });
      } else {
        const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
        // Notion appends a 32-hex-char id to exported file names; a leading "# " line wins as the title.
        let title = file.name.replace(/\.(md|markdown|txt)$/i, '').replace(/\s[0-9a-f]{32}$/i, '').trim();
        if (/^#\s+/.test(lines[0] || '')) { title = lines.shift().replace(/^#\s+/, '').trim(); }
        newPages.push({ id: uid(), title, co: guessCo(title + ' ' + file.name), parent: null, blocks: mdToBlocks(lines.join('\n')), created: Date.now(), updated: Date.now() });
        pageCount++;
      }
    }
    this.upd(data => { data.pages.push(...newPages); });
    if (newPages[0]) this.setState({ page: newPages[0].id, docTab: 'page' });
    // Rows of a CSV database become team tasks assigned to me, one request each.
    let taskCount = 0, failed = 0;
    for (const task of newTasks) {
      try { await createTeamTask(task); taskCount++; } catch { failed++; }
    }
    this.flash('docNote', `Imported ${pageCount} page${pageCount === 1 ? '' : 's'} and ${taskCount} task${taskCount === 1 ? '' : 's'} from Notion.`
      + (taskCount ? ' Tasks are on the Tasks page.' : '') + (failed ? ` ${failed} task${failed === 1 ? '' : 's'} couldn’t be created.` : ''));
  }

  /** Stores uploaded files in IndexedDB and their metadata in the app data. */
  async upload(event, extra) {
    const files = [...(event.target.files || [])];
    try { event.target.value = ''; } catch { /* some inputs reject resetting the value */ }
    const fileMetas = [];
    if (!files.length) return;
    const co = (extra && extra.co) || (this.state.fileCo === 'any' ? 'all' : this.state.fileCo);
    try {
      for (const file of files) {
        const id = uid();
        await idb('readwrite', store => store.put(file, id));
        fileMetas.push({ id, name: file.name, size: file.size, type: file.type, co, added: Date.now(), by: this.state.me, ...(extra && extra.page ? { page: extra.page } : {}) });
      }
    }
    catch { this.flash('docNote', 'Upload failed: browser storage is full or blocked.'); return; }
    this.upd(data => { data.files.push(...fileMetas); });
    this.flash('docNote', `Uploaded ${fileMetas.length} file${fileMetas.length === 1 ? '' : 's'}.`); this.refreshEst();
  }
  /** Loads a file's blob once and keeps an object URL for its thumbnail. */
  loadThumb(file) {
    this._th = this._th || {};
    if (this._th[file.id]) return;
    this._th[file.id] = 1;
    idb('readonly', store => store.get(file.id))
      .then(blob => { if (blob) this.setState(prev => ({ thumbs: { ...prev.thumbs, [file.id]: URL.createObjectURL(blob) } })); })
      .catch(() => {});
  }
  async previewFile(file) {
    const blob = await idb('readonly', store => store.get(file.id));
    if (!blob) { this.toastMsg('This file is not stored in this browser'); return; }
    window.open(URL.createObjectURL(blob), '_blank');
  }
  async download(file) {
    const blob = await idb('readonly', store => store.get(file.id));
    if (!blob) { this.flash('docNote', 'This file is not stored in this browser.'); return; }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = file.name;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  /** Creates a new, empty vault protected by the master password. */
  async vCreate() {
    const { pw, pw2 } = this.state.v;
    if (pw.length < 8) return this.setV({ err: 'Use at least 8 characters.' });
    if (pw !== pw2) return this.setV({ err: 'The two passwords don\'t match.' });
    this.setV({ busy: true, err: '' });
    try {
      // The other founder may have created the vault since this page loaded: unlock that one instead.
      const existing = await fetchVault();
      if (existing) return this.setV({ sealed: existing, pw: '', pw2: '', busy: false, err: 'A vault already exists. Unlock it with its master password.' });
      const salt = crypto.getRandomValues(new Uint8Array(16)); const key = await deriveKey(pw, salt);
      const sealed = await saveVault(await seal(key, salt, []));
      this.setV({ key, salt, items: [], sealed, pw: '', pw2: '', err: '', busy: false });
    } catch (error) { this.setV({ err: error.message, busy: false }); }
  }
  /** Decrypts the newest stored vault (it is shared by both founders) with the typed master password. */
  async vUnlock() {
    this.setV({ busy: true, err: '' });
    let sealed;
    try { sealed = await fetchVault(); } catch (error) { return this.setV({ err: error.message, busy: false }); }
    try {
      const { key, salt, items } = await unseal(this.state.v.pw, sealed);
      this.setV({ key, salt, items, sealed, pw: '', busy: false });
    } catch { this.setV({ err: 'Wrong master password.', busy: false }); }
  }
  /** Shows `items` at once, then stores them sealed; puts the previous items back if the save fails. */
  async vPut(items) {
    const { key, salt, items: previous } = this.state.v;
    this.setV({ items });
    try {
      this.setV({ sealed: await saveVault(await seal(key, salt, items)) });
    } catch (error) {
      this.setV({ items: previous });
      if (error.status !== 401) this.toastMsg('Couldn’t save the vault: ' + error.message);
    }
  }
  vCopy(text, label) {
    if (navigator.clipboard) navigator.clipboard.writeText(text || '');
    this.setV({ copied: label + ' copied' });
    clearTimeout(this._vc); this._vc = setTimeout(() => this.setV({ copied: '' }), 2500);
  }

  /**
   * Applies `mutate` to a deep copy of the data, sets state and queues a save to the server.
   * `_pend` holds the newest copy so several upd() calls before a re-render build on each other.
   */
  upd(mutate) {
    const data = JSON.parse(JSON.stringify(this._pend || this.state.data));
    mutate(data);
    this._sync.queue(data);
    this._pend = data;
    this.setState({ data }, () => { if (this._pend === data) this._pend = null; });
  }
  go(view, extra) {
    if (view === 'brief') view = 'home';
    this.setState({ view, ...(extra || {}) });
    window.scrollTo(0, 0);
  }
  /** Formats rupees: Lakh / Crore style (₹4.5 L, ₹1.25 Cr) by default, or plain en-IN grouping. */
  money(amount) {
    const useLakhCrore = (this.pf().money || this.props.amountFormat || 'Lakh / Crore') === 'Lakh / Crore';
    const isNegative = amount < 0, absolute = Math.abs(Math.round(amount || 0));
    let text;
    if (useLakhCrore && absolute >= 1e7) text = '₹' + (absolute / 1e7).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
    else if (useLakhCrore && absolute >= 1e5) text = '₹' + (absolute / 1e5).toFixed(1).replace(/\.0$/, '') + ' L';
    else text = '₹' + absolute.toLocaleString('en-IN');
    return (isNegative ? '−' : '') + text;
  }
  /** A company's finance figures; itemised revenue / cost entries, when present, replace the manual totals. */
  finOf(co) {
    const figures = (this.state.data.fin || {})[co] || {}, items = (this.state.data.finItems || []).filter(item => item.co === co);
    const revenueItems = items.filter(item => item.kind === 'rev'), costItems = items.filter(item => item.kind === 'cost');
    return {
      ...figures,
      rev: revenueItems.length ? revenueItems.reduce((sum, item) => sum + (item.amount || 0), 0) : (figures.rev || 0),
      cost: costItems.length ? costItems.reduce((sum, item) => sum + (item.amount || 0), 0) : (figures.cost || 0),
      revFrom: revenueItems.length,
      costFrom: costItems.length,
    };
  }
  /** Monthly net and runway (under 6 months red, under 12 amber). */
  calc(figures) {
    const net = (figures.rev || 0) - (figures.cost || 0);
    const empty = !figures.cash && !figures.rev && !figures.cost;
    let runway = 'Add figures', runColor = MUTED, months = null;
    if (!empty) {
      if (net >= 0) { runway = 'Profitable'; runColor = GREEN; }
      else { months = (figures.cash || 0) / -net; runway = months.toFixed(1) + ' mo'; runColor = months < 6 ? RED : months < 12 ? AMBER : GREEN; }
    }
    return { net, runway, runColor, months, empty };
  }
  /** HQ → Tasks on one company's tab ('all' / nothing = every company). */
  goTasks(co) {
    setTasksCompany(co || 'all');
    this.go('tasks');
  }
  /** Display fields and actions for one team task row (company page). */
  taskRow(task) {
    const company = coOf(task.co), daysUntilDue = dayDiff(task.due);
    let dueLabel = 'No date', dueColor = MUTED;
    if (daysUntilDue !== null) {
      if (daysUntilDue < 0) { dueLabel = 'Overdue ' + -daysUntilDue + 'd'; dueColor = RED; }
      else if (daysUntilDue === 0) { dueLabel = 'Today'; dueColor = AMBER; }
      else if (daysUntilDue === 1) { dueLabel = 'Tomorrow'; dueColor = AMBER; }
      else if (daysUntilDue < 7) dueLabel = new Date(task.due + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long' });
      else dueLabel = new Date(task.due + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (task.done) dueColor = MUTED;
    }
    return {
      title: task.title, coName: company.name, coTint: company.tint, coInk: company.ink, who: task.team.who,
      dueLabel, dueColor, pri: task.pri, priColor: task.pri === 'High' ? RED : task.pri === 'Medium' ? AMBER : MUTED,
      mark: task.done ? '✓' : '', checkBg: task.done ? GREEN : '#fff', checkBorder: task.done ? GREEN : 'oklch(0.78 0.01 265)',
      deco: task.done ? 'line-through' : 'none', titleColor: task.done ? MUTED : 'oklch(0.23 0.015 265)',
      toggle: () => this.toggleTask(task),
      open: () => this.openTask(task.id),
    };
  }
  addRole() {
    const draft = this.state.nr; if (!draft.role.trim()) return;
    this.upd(data => { data.roles.push({ id: uid(), role: draft.role.trim(), co: draft.co, owner: draft.owner, budget: Number(draft.budget) || 0, due: draft.due, stage: 'Planned' }); });
    this.setState({ nr: { ...draft, role: '', budget: '' } });
  }
  /** Asks Claude (when available in the page) to draft findings for a research item and appends them. */
  async draft(research) {
    if (this.state.ai.busy) return;
    if (!research.question.trim()) { this.setState({ ai: { busy: false, note: 'Write the question first.', err: true } }); return; }
    if (!window.claude || !window.claude.complete) { this.setState({ ai: { busy: false, note: 'Claude drafting is not available in this browser.', err: true } }); return; }
    this.setState({ ai: { busy: true, note: 'Drafting…', err: false } });
    const company = coOf(research.co);
    const prompt = `You are a research analyst for the founders of ${company.id === 'all' ? 'a group of Indian companies (Mariox Software, HROO, Arth)' : company.full}, based in India. Research question: "${research.question}". Write concise findings as plain text: key facts and figures, options, risks, and a recommendation. Use short lines starting with "- ". Use ₹ for money. No markdown headers. Under 250 words.`;
    try {
      const findings = await window.claude.complete(prompt);
      this.upd(data => {
        const stored = data.research.find(candidate => candidate.id === research.id);
        stored.findings = (stored.findings ? stored.findings + '\n\n' : '') + findings.trim();
        stored.updated = Date.now();
        if (stored.status === 'Open') stored.status = 'In progress';
      });
      this.setState({ ai: { busy: false, note: 'Added to findings. Based on Claude\'s general knowledge; verify figures before deciding.', err: false } });
    } catch { this.setState({ ai: { busy: false, note: 'Draft failed. Try again.', err: true } }); }
  }
}
