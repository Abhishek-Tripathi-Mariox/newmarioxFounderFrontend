/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import HQCompanies from './04-companies';
import { PEOPLE, MEMBERS, memberOpts, allAgreed, othersOf, namesOf, ALL_FOUNDERS, COS, coColors, ensureCos, segOf, iso, plus, dayDiff, uid, INK_C, RED, AMBER, GREEN, MUTED, XCH, XAUTH_DEF, XMATTERS, XCST, XPST, XCFLD, XPFLD, XRST, XSTL, XLVL, XEXC, XAITAG, CX_HUES, XfmtL, XfmtIso, XnextCode, XmigrateCons, COUNTRIES, ENTITIES, AI_ON } from './core';

/**
 * The founders and co-founders whose joint approval makes rules, amendments and exceptions binding: every
 * current HQ member (the live list from core, kept up to date by applyAccountNames).
 */
const FOUNDERS = MEMBERS;

/** Tag colours [background, text] for the "Waiting for you" list on the overview. */
const TODO_TAG_COLORS = {
  AMENDMENT: ['oklch(0.95 0.03 265)', 'oklch(0.42 0.13 265)'],
  PROPOSAL: ['oklch(0.95 0.04 300)', 'oklch(0.42 0.13 300)'],
  EXCEPTION: ['oklch(0.96 0.05 85)', 'oklch(0.45 0.12 65)'],
  EXPIRING: ['oklch(0.95 0.035 25)', 'oklch(0.48 0.17 25)'],
  RULE: ['oklch(0.95 0.005 265)', 'oklch(0.4 0.012 265)'],
};

/** Amendment type badges: [label, background, text]. */
const AMENDMENT_TYPES = {
  change: ['Change', 'oklch(0.95 0.03 265)', 'oklch(0.42 0.13 265)'],
  new: ['New rule', 'oklch(0.95 0.05 150)', 'oklch(0.4 0.11 150)'],
  repeal: ['Repeal', 'oklch(0.95 0.035 25)', 'oklch(0.48 0.17 25)'],
};

/** Amendment status badges: [label, background, text]. */
const AMENDMENT_STATUSES = {
  Pending: ['Waiting for approval', 'oklch(0.96 0.05 85)', 'oklch(0.45 0.12 65)'],
  Approved: ['Approved', 'oklch(0.95 0.05 150)', 'oklch(0.4 0.11 150)'],
  Rejected: ['Rejected', 'oklch(0.95 0.035 25)', 'oklch(0.48 0.17 25)'],
  Withdrawn: ['Withdrawn', 'oklch(0.95 0.005 265)', 'oklch(0.45 0.012 265)'],
};

/** Authority-check result colours per level: [background, text]. */
const LEVEL_COLORS = {
  1: ['oklch(0.96 0.04 150)', 'oklch(0.42 0.12 150)'],
  2: ['oklch(0.965 0.05 85)', 'oklch(0.48 0.12 65)'],
  3: ['oklch(0.96 0.03 25)', 'oklch(0.5 0.17 25)'],
};

/** "1.4" -> "1.5": every approved amendment bumps the minor version. */
const bumpVersion = version => {
  const [major, minor] = String(version || '1.0').split('.').map(part => parseInt(part, 10) || 0);
  return major + '.' + (minor + 1);
};

/** Two-digit chapter number, e.g. "03". */
const padNumber = position => String(position + 1).padStart(2, '0');

/** Options for a chapter <select>: "01 · Philosophy", … */
const chapterOptions = () => XCH.map((chapter, position) => [chapter[0], padNumber(position) + ' · ' + chapter[2]]);

/** Splits an AI answer into lines and pulls out the leading label (APPROVED RULE, MISSING RULE, …). */
const parseAnswer = text => String(text || '')
  .split('\n')
  .map(line => line.replace(/\*\*/g, '').replace(/^\s*[-*•]\s*/, '').trim())
  .filter(Boolean)
  .map(line => {
    const match = line.match(/^(APPROVED RULE|RECOMMENDED PRACTICE|PENDING PROPOSAL|MISSING RULE)S?\s*[:\-–]\s*/i);
    if (!match) return { hasTag: false, tag: '', text: line, bg: '', fg: '' };
    const tag = match[1].toUpperCase();
    return { hasTag: true, tag, text: line.slice(match[0].length), bg: XAITAG[tag][0], fg: XAITAG[tag][1] };
  });

export default class HQConstitution extends HQCompanies {
  /** View model for the Founders' Constitution page (`vm.cx`): rules, ventures, authority, amendments, exceptions, AI and history. */
  constitutionViewModel() {
    const state = this.state;
    const { me, data } = state;
    const constitution = data.constitution || {};
    const allCompanies = data.companies || [];
    const openCompanies = allCompanies.filter(company => company.status !== 'Closed');

    // Older saved data has no rules yet: migrate it once, after this render.
    if (!constitution.rules && !this._cxMig) {
      this._cxMig = true;
      setTimeout(() => this.upd(draft => {
        ensureCos(draft);
        XmigrateCons(draft.constitution);
      }), 0);
    }

    const rules = constitution.rules || [];
    const amendments = constitution.amendments || [];
    const exceptions = constitution.exceptions || [];
    const ventures = constitution.ventures || [];
    const asks = constitution.asks || [];
    const authority = { ...XAUTH_DEF, ...(constitution.authority || {}) };

    const patchState = patch => this.setState(patch);
    const person = id => PEOPLE[id] || PEOPLE.both;
    /** "Asha", "Asha and Ben", …: everyone who still has to approve after me. */
    const othersTxt = namesOf(othersOf(me)) || 'Another founder';
    const othersVerb = verb => othersTxt + ' ' + verb + (othersOf(me).length === 1 ? 's' : '');
    const updateConstitution = fn => this.upd(draft => {
      ensureCos(draft);
      XmigrateCons(draft.constitution);
      fn(draft.constitution, draft);
    });
    // History keeps the latest 300 entries, newest first.
    const logChange = (draftConstitution, text) => {
      draftConstitution.log = [{ at: Date.now(), by: me, text }, ...(draftConstitution.log || [])].slice(0, 300);
    };
    const today = iso(new Date());
    const approvedByBoth = approvers => allAgreed(approvers);

    /** "just now" / "5 min ago" / "3h ago" / "2d ago", then a date after 30 days. */
    const relativeTime = ms => {
      if (!ms) return '';
      const minutes = Math.round((Date.now() - ms) / 60000);
      if (minutes < 60) return minutes < 1 ? 'just now' : minutes + ' min ago';
      const hours = Math.round(minutes / 60);
      if (hours < 24) return hours + 'h ago';
      const days = Math.round(hours / 24);
      return days < 30 ? days + 'd ago' : XfmtL(ms);
    };
    const chapterOf = id => XCH.find(chapter => chapter[0] === id) || XCH[0];
    const chapterNumber = id => String(XCH.indexOf(chapterOf(id)) + 1).padStart(2, '0');
    const ruleById = id => rules.find(rule => rule.id === id);

    /** Founder initials dots showing who has approved. */
    const signatureDots = approvers => FOUNDERS.map(founder => {
      const approved = (approvers || []).includes(founder);
      return {
        ini: person(founder).ini,
        bg: approved ? person(founder).bg : '#fff',
        fg: approved ? '#fff' : 'oklch(0.6 0.01 265)',
        bd: approved ? person(founder).bg : 'oklch(0.85 0.008 85)',
        tip: person(founder).first + (approved ? ' approved' : ' has not approved'),
      };
    });
    /** Styling for an approve button: green once approved, accent when the viewer can click it. */
    const approvalPill = (approved, isMine, canAct, label) => ({
      label,
      bg: approved ? 'oklch(0.95 0.05 150)' : canAct ? '#fff' : 'oklch(0.97 0.004 85)',
      fg: approved ? 'oklch(0.38 0.1 150)' : canAct ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.5 0.012 265)',
      bd: approved ? 'oklch(0.82 0.07 150)' : canAct ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.9 0.006 85)',
      dis: !canAct,
      cur: canAct ? 'pointer' : 'default',
    });
    /** An exception is Active only once all founders approve it, until it is revoked or its end date passes. */
    const exceptionStatus = exception =>
      exception.revoked ? 'Revoked'
        : !approvedByBoth(exception.appr) ? 'Pending'
          : (exception.until && exception.until < today) ? 'Expired'
            : 'Active';
    const companyName = id => (allCompanies.find(company => company.id === id) || {}).name || '—';
    const ownerLabel = owner => owner === 'both' ? ALL_FOUNDERS : owner === 'team' ? 'Company owner' : person(owner).first;
    // A rule's scope is either 'all' or an array of company ids.
    const scopeLabel = rule => !Array.isArray(rule.scope)
      ? 'All companies'
      : rule.scope.length ? rule.scope.map(companyName).join(', ') : 'No companies yet';

    /** Adds the current founder's approval. Draft -> Pending; once both approve the rule becomes Active with a first version. */
    const signRule = (draftConstitution, rule) => {
      rule.sign = [...new Set([...(rule.sign || []), me])];
      if (rule.status === 'Draft') rule.status = 'Pending';
      if (approvedByBoth(rule.sign)) {
        rule.status = 'Active';
        if (!rule.effective) rule.effective = today;
        if (!(rule.versions || []).length) {
          rule.versions = [{ v: rule.v || 1, title: rule.title, text: rule.text, at: Date.now(), by: rule.by || me, reason: 'Approved by all founders' }];
        }
        logChange(draftConstitution, rule.code + ' “' + rule.title + '” is now active');
      } else {
        logChange(draftConstitution, person(me).first + ' approved ' + rule.code + ' “' + rule.title + '”');
      }
    };

    /** Puts an approved amendment into effect (new rule, new version, or repeal) and bumps the constitution version. */
    const applyAmendment = (draftConstitution, amendment) => {
      amendment.status = 'Approved';
      amendment.decidedAt = Date.now();
      if (amendment.type === 'new') {
        const rule = {
          id: uid(),
          code: XnextCode(draftConstitution.rules, amendment.ch),
          ch: amendment.ch,
          title: amendment.title,
          text: amendment.text,
          kind: 'Mandatory',
          level: 1,
          scope: 'all',
          owner: 'both',
          effective: amendment.eff || today,
          status: 'Active',
          sign: [...FOUNDERS],
          v: 1,
          versions: [{ v: 1, title: amendment.title, text: amendment.text, at: Date.now(), by: amendment.by, reason: amendment.reason }],
          docs: [],
          by: amendment.by,
          created: Date.now(),
        };
        draftConstitution.rules.push(rule);
        amendment.ruleId = rule.id;
      } else {
        const rule = draftConstitution.rules.find(item => item.id === amendment.ruleId);
        if (rule) {
          if (amendment.type === 'repeal') {
            rule.status = 'Archived';
            rule.archivedAt = Date.now();
            rule.archReason = amendment.reason;
          } else {
            rule.v = (rule.v || 1) + 1;
            rule.title = amendment.title;
            rule.text = amendment.text;
            rule.effective = amendment.eff || today;
            rule.versions = [...(rule.versions || []), { v: rule.v, title: amendment.title, text: amendment.text, at: Date.now(), by: amendment.by, reason: amendment.reason }];
          }
        }
      }
      draftConstitution.version = bumpVersion(draftConstitution.version);
      logChange(draftConstitution, 'Amendment approved by all founders. Constitution is now version ' + draftConstitution.version);
    };

    // The old "principles" tab now lands on the overview.
    const tab = state.cnTab === 'principles' ? 'overview' : state.cnTab;
    const draftCount = rules.filter(rule => rule.status === 'Draft').length;
    const activeRules = rules.filter(rule => rule.status === 'Active');
    const pendingCount = rules.filter(rule => rule.status === 'Pending').length;
    const openAmendments = amendments.filter(amendment => amendment.status === 'Pending');
    const activeExceptions = exceptions.filter(exception => exceptionStatus(exception) === 'Active');
    // Every superseded rule version plus every repealed rule.
    const archivedCount = rules.reduce((sum, rule) => sum + Math.max(0, (rule.versions || []).length - 1), 0)
      + rules.filter(rule => rule.status === 'Archived').length;
    const newAmendment = () => patchState({ cxa: { type: 'change', ruleId: '', title: '', text: '', reason: '', eff: today, ch: 'phi', err: '' } });

    const view = {
      version: constitution.version || '1.0',
      meFirst: person(me).first,
      reviewed: constitution.reviewedAt ? XfmtL(constitution.reviewedAt) : '—',
      sub: activeRules.length + (activeRules.length === 1 ? ' active rule · ' : ' active rules · ') + pendingCount + ' awaiting approval · '
        + openCompanies.length + (openCompanies.length === 1 ? ' company' : ' companies') + ' governed',
      goAi: () => patchState({ cnTab: 'ai' }),
      newAmd: newAmendment,
      markReviewed: () => {
        updateConstitution(draftConstitution => {
          draftConstitution.reviewedAt = Date.now();
          logChange(draftConstitution, person(me).first + ' reviewed the constitution');
        });
        this.toastMsg('Marked as reviewed today');
      },
      // Plain-text export: every chapter that has non-archived rules.
      copyAll: () => {
        const chapterText = (chapter, position) => {
          const chapterRules = rules.filter(rule => rule.ch === chapter[0] && rule.status !== 'Archived');
          return chapterRules.length
            ? '\n' + padNumber(position) + ' ' + chapter[2].toUpperCase() + '\n' + chapterRules
              .map(rule => rule.code + ' · ' + rule.title + ' (' + rule.kind + (rule.status === 'Active' ? '' : ', ' + XSTL[rule.status].toLowerCase()) + ')\n' + rule.text)
              .join('\n\n')
            : '';
        };
        const text = 'THE FOUNDERS\' CONSTITUTION · Version ' + (constitution.version || '1.0') + '\nHow We Build. How We Operate. How We Grow.\n'
          + XCH.map(chapterText).filter(Boolean).join('\n');
        if (navigator.clipboard) navigator.clipboard.writeText(text);
        this.toastMsg('Constitution copied as text');
      },
      showFilters: tab === 'playbooks' || tab === 'rollout',
      isOverview: tab === 'overview',
      isRules: tab === 'rules',
      isVen: tab === 'ventures',
      isAuth: tab === 'authority',
      isAmd: tab === 'amend',
      isExc: tab === 'exceptions',
      isAi: tab === 'ai',
    };

    const rulesAwaitingMe = rules.filter(rule => rule.status === 'Pending' && !(rule.sign || []).includes(me));
    const amendmentsAwaitingMe = openAmendments.filter(amendment => !(amendment.appr || []).includes(me));
    const exceptionsAwaitingMe = exceptions.filter(exception => exceptionStatus(exception) === 'Pending' && !(exception.appr || []).includes(me));

    // Tabs: [value, label, count, items waiting for me].
    view.tabs = [
      ['overview', 'Overview', 0, 0],
      ['rules', 'Rules', rules.filter(rule => rule.status !== 'Archived').length, rulesAwaitingMe.length],
      ['ventures', 'New ventures', ventures.length, 0],
      ['authority', 'Authority', 0, 0],
      ['amend', 'Amendments', openAmendments.length, amendmentsAwaitingMe.length],
      ['exceptions', 'Exceptions', activeExceptions.length, exceptionsAwaitingMe.length],
      ['playbooks', 'Playbooks', (constitution.playbooks || []).length, 0],
      ['rollout', 'Rollout', 0, 0],
      ...(AI_ON ? [['ai', 'Ask AI', 0, 0]] : []),
      ['history', 'History', 0, 0],
    ].map(([value, label, count, waiting]) => {
      const active = tab === value;
      return {
        label,
        hasN: !!(count || waiting),
        n: waiting ? waiting + ' for you' : String(count),
        nBg: waiting ? 'oklch(0.95 0.06 85)' : 'oklch(0.95 0.005 85)',
        nFg: waiting ? 'oklch(0.45 0.12 65)' : 'oklch(0.45 0.012 265)',
        fg: active ? INK_C : MUTED,
        bd: active ? INK_C : 'transparent',
        go: () => patchState({ cnTab: value }),
      };
    });

    // ---- Overview ----
    view.founders = FOUNDERS.map(founder => {
      const waiting = rules.filter(rule => rule.status === 'Pending' && !(rule.sign || []).includes(founder)).length
        + openAmendments.filter(amendment => !(amendment.appr || []).includes(founder)).length;
      return {
        ini: person(founder).ini,
        bg: person(founder).bg,
        name: person(founder).name,
        role: person(founder).role,
        st: waiting ? waiting + ' awaiting approval' : 'Up to date',
        stBg: waiting ? 'oklch(0.85 0.1 85 / 0.25)' : 'oklch(0.75 0.12 150 / 0.25)',
        stFg: waiting ? 'oklch(0.9 0.09 85)' : 'oklch(0.88 0.1 150)',
      };
    });
    /** Returns a handler that opens the Rules tab with the given filters. */
    const openRulesWith = filterPatch => () => patchState({ cnTab: 'rules', cxch: 'all', cxf: { q: '', status: 'any', kind: 'any', level: 'any', co: 'any', ...filterPatch } });
    const expiringSoon = activeExceptions.filter(exception => exception.until && dayDiff(exception.until) <= 14);
    // Stat tiles: [label, value, hint, colour, click handler].
    view.stats = [
      ['Drafts', draftCount, 'Not yet submitted', INK_C, openRulesWith({ status: 'Draft' })],
      ['Active rules', activeRules.length, activeRules.filter(rule => rule.kind === 'Mandatory').length + ' mandatory', 'oklch(0.45 0.12 150)', openRulesWith({ status: 'Active' })],
      ['Pending approvals', pendingCount, rulesAwaitingMe.length ? rulesAwaitingMe.length + ' waiting for you' : 'Rules awaiting sign-off', pendingCount ? 'oklch(0.5 0.13 65)' : INK_C, openRulesWith({ status: 'Pending' })],
      ['Open amendments', openAmendments.length, amendmentsAwaitingMe.length ? amendmentsAwaitingMe.length + ' waiting for you' : 'Proposed changes', INK_C, () => patchState({ cnTab: 'amend', cxaf: 'open' })],
      ['Active exceptions', activeExceptions.length, expiringSoon.length ? expiringSoon.length + ' expiring in 14 days' : 'Approved deviations', INK_C, () => patchState({ cnTab: 'exceptions', cxef: 'active' })],
      ['Archived versions', archivedCount, 'Kept in history', INK_C, () => patchState({ cnTab: 'history' })],
    ].map(([l, value, h, c, go]) => ({ l, v: String(value), h, c, go }));

    // "Waiting for you" list: [tag, text, meta, click handler], in this priority order.
    const todo = [];
    amendmentsAwaitingMe.forEach(amendment => {
      const rule = ruleById(amendment.ruleId);
      todo.push(['AMENDMENT', (rule ? rule.code + ' · ' : '') + (amendment.title || (rule && rule.title) || 'Amendment'), 'by ' + person(amendment.by).first, () => patchState({ cnTab: 'amend', cxaf: 'open' })]);
    });
    // Proposals sitting at their approval gate that I have not approved yet.
    ventures
      .filter(venture => venture.stage === (venture.type === 'product' ? 4 : 3) && !(venture.appr || []).includes(me))
      .forEach(venture => todo.push(['PROPOSAL', venture.name || 'Untitled proposal', 'needs approval', () => patchState({ cnTab: 'ventures', cxvt: venture.type, cxv: venture.id })]));
    exceptionsAwaitingMe.forEach(exception => todo.push(['EXCEPTION', ((ruleById(exception.ruleId) || {}).code || '') + ' for ' + companyName(exception.co), 'by ' + person(exception.by).first, () => patchState({ cnTab: 'exceptions', cxef: 'pending' })]));
    expiringSoon.forEach(exception => todo.push(['EXPIRING', ((ruleById(exception.ruleId) || {}).code || '') + ' exception for ' + companyName(exception.co), XfmtIso(exception.until), () => patchState({ cnTab: 'exceptions', cxef: 'active' })]));
    rulesAwaitingMe.forEach(rule => todo.push(['RULE', rule.code + ' · ' + rule.title, chapterOf(rule.ch)[2], () => patchState({ cnTab: 'rules', cxr: rule.id })]));
    view.todo = todo.slice(0, 8).map(([tag, text, meta, go]) => ({ tag, text, meta, go, bg: TODO_TAG_COLORS[tag][0], fg: TODO_TAG_COLORS[tag][1] }));
    view.todoN = todo.length ? todo.length + (todo.length === 1 ? ' item' : ' items') : '';
    view.noTodo = !todo.length;
    view.moreTodo = todo.length > 8;
    view.moreTodoTxt = 'See all ' + rulesAwaitingMe.length + ' rules waiting for you →';
    view.goTodoAll = openRulesWith({ status: 'Pending' });

    // The three levels: [level, key, name, purpose, example, background, text colour]. Level 3 counts playbooks too.
    view.levels = [
      [1, 'L1', 'Founders\' Constitution', 'Permanent rules for the entire group', 'Every company must maintain financial discipline.', 'oklch(0.94 0.04 265)', 'oklch(0.42 0.15 265)'],
      [2, 'L2', 'Group Policies', 'Finance, hiring, legal, technology, etc.', 'Every company submits a monthly financial report by the fifth working day.', 'oklch(0.94 0.04 190)', 'oklch(0.4 0.09 190)'],
      [3, 'L3', 'Company Playbooks', 'Practical processes for Mariox, HROO, Arth, etc.', 'Mariox finance follows its own monthly reporting process.', 'oklch(0.95 0.05 80)', 'oklch(0.45 0.12 65)'],
    ].map(([level, k, name, purpose, ex, bg, fg]) => ({
      k,
      name,
      purpose,
      ex,
      bg,
      fg,
      n: level === 3
        ? String((constitution.playbooks || []).length + rules.filter(rule => rule.level === 3).length)
        : String(rules.filter(rule => rule.level === level && rule.status !== 'Archived').length),
      go: level === 3 ? () => patchState({ cnTab: 'playbooks' }) : openRulesWith({ level: String(level) }),
    }));
    view.chapters = XCH.map(([id, code, name, desc], position) => {
      const chapterRules = rules.filter(rule => rule.ch === id && rule.status !== 'Archived');
      const activeCount = chapterRules.filter(rule => rule.status === 'Active').length;
      const pendingInChapter = chapterRules.filter(rule => rule.status === 'Pending').length;
      const divisor = chapterRules.length || 1;
      return {
        num: padNumber(position),
        code,
        name,
        desc,
        wA: (activeCount / divisor * 100) + '%',
        wP: (pendingInChapter / divisor * 100) + '%',
        meta: chapterRules.length ? activeCount + ' of ' + chapterRules.length + ' active' : 'No rules yet',
        go: () => patchState({ cnTab: 'rules', cxch: id }),
      };
    });
    view.layers = [
      ['Layer 1', 'Constitution', 'How we should operate', 'Read the rules', 'oklch(0.96 0.025 265)', 'oklch(0.45 0.15 265)', openRulesWith({})],
      ['Layer 2', 'Founder management', 'What we plan, decide and execute', 'Open Decisions', 'oklch(0.96 0.025 190)', 'oklch(0.42 0.09 190)', () => this.go('decisions')],
      ['Layer 3', 'Company operations', 'How each company executes its work', 'Open Companies', 'oklch(0.965 0.035 80)', 'oklch(0.45 0.12 65)', () => this.go('companies')],
    ].map(([k, name, desc, cta, bg, fg, go]) => ({ k, name, desc, cta, bg, fg, go }));

    // ---- Rules ----
    const ruleFilters = { q: '', status: 'any', kind: 'any', level: 'any', co: 'any', ...(state.cxf || {}) };
    const setRuleFilters = patch => patchState({ cxf: { ...ruleFilters, ...patch } });
    const chapterFilter = state.cxch || 'all';
    const ruleQuery = ruleFilters.q.trim().toLowerCase();
    const visibleRules = rules.filter(rule =>
      (chapterFilter === 'all' || rule.ch === chapterFilter)
      && (ruleFilters.status === 'any' ? rule.status !== 'Archived' : ruleFilters.status === 'all' || rule.status === ruleFilters.status)
      && (ruleFilters.kind === 'any' || rule.kind === ruleFilters.kind)
      && (ruleFilters.level === 'any' || String(rule.level) === ruleFilters.level)
      && (ruleFilters.co === 'any' || !Array.isArray(rule.scope) || rule.scope.includes(ruleFilters.co))
      && (!ruleQuery || (rule.code + ' ' + rule.title + ' ' + rule.text).toLowerCase().includes(ruleQuery)));
    const selectField = (value, onChange, options) => ({ value, onChange, opts: options.map(([v, l]) => ({ v, l })) });
    view.rf = {
      q: ruleFilters.q,
      onQ: e => setRuleFilters({ q: e.target.value }),
      status: selectField(ruleFilters.status, e => setRuleFilters({ status: e.target.value }), [['any', 'Current rules'], ['Draft', 'Drafts'], ['Pending', 'Pending approval'], ['Active', 'Active'], ['Archived', 'Archived'], ['all', 'Everything']]),
      kind: selectField(ruleFilters.kind, e => setRuleFilters({ kind: e.target.value }), [['any', 'Mandatory + recommended'], ['Mandatory', 'Mandatory'], ['Recommended', 'Recommended']]),
      level: selectField(ruleFilters.level, e => setRuleFilters({ level: e.target.value }), [['any', 'All levels'], ['1', 'L1 · Constitution'], ['2', 'L2 · Group policy'], ['3', 'L3 · Playbook']]),
      co: selectField(ruleFilters.co, e => setRuleFilters({ co: e.target.value }), [['any', 'Any company'], ...openCompanies.map(company => [company.id, 'Applies to ' + company.name])]),
      any: !!(ruleFilters.q || ruleFilters.status !== 'any' || ruleFilters.kind !== 'any' || ruleFilters.level !== 'any' || ruleFilters.co !== 'any'),
      clear: () => patchState({ cxf: null }),
    };
    const ruleRow = rule => {
      const statusColors = XRST[rule.status] || XRST.Draft;
      const exceptionCount = exceptions.filter(exception => exception.ruleId === rule.id && exceptionStatus(exception) === 'Active').length;
      return {
        code: rule.code,
        title: rule.title || 'Untitled rule',
        text: rule.text || 'No explanation yet.',
        kind: rule.kind,
        kBg: rule.kind === 'Mandatory' ? 'oklch(0.95 0.035 25)' : 'oklch(0.95 0.03 230)',
        kFg: rule.kind === 'Mandatory' ? 'oklch(0.48 0.17 25)' : 'oklch(0.42 0.1 230)',
        lvl: XLVL[rule.level] || XLVL[1],
        scope: scopeLabel(rule),
        owner: ownerLabel(rule.owner),
        hasExc: !!exceptionCount,
        exc: exceptionCount + (exceptionCount === 1 ? ' exception' : ' exceptions'),
        hasV: (rule.v || 1) > 1,
        ver: 'v' + (rule.v || 1),
        st: XSTL[rule.status],
        sBg: statusColors[0],
        sFg: statusColors[1],
        signs: signatureDots(rule.sign),
        sh: state.cxr === rule.id ? '0 0 0 2px var(--acc, oklch(0.5 0.17 265))' : 'none',
        open: () => patchState({ cxr: rule.id }),
      };
    };
    // With "all chapters" the list is grouped by chapter; otherwise it is one flat group.
    view.rgroups = chapterFilter === 'all'
      ? XCH
        .map((chapter, position) => ({ chapter, position, chapterRules: visibleRules.filter(rule => rule.ch === chapter[0]) }))
        .filter(group => group.chapterRules.length)
        .map(group => ({
          showHead: true,
          num: padNumber(group.position),
          name: group.chapter[2],
          n: group.chapterRules.length + (group.chapterRules.length === 1 ? ' rule' : ' rules'),
          go: () => patchState({ cxch: group.chapter[0] }),
          rules: group.chapterRules.map(ruleRow),
        }))
      : [{ showHead: false, rules: visibleRules.map(ruleRow) }];
    view.noRules = !visibleRules.length;
    view.shown = visibleRules.length + (visibleRules.length === 1 ? ' rule' : ' rules') + (view.rf.any ? ' match' : '');
    view.chNav = [
      { id: 'all', num: '', name: 'All chapters', n: rules.filter(rule => rule.status !== 'Archived').length, hasPend: false },
      ...XCH.map((chapter, position) => {
        const chapterRules = rules.filter(rule => rule.ch === chapter[0] && rule.status !== 'Archived');
        return {
          id: chapter[0],
          num: padNumber(position),
          name: chapter[2],
          n: chapterRules.length,
          hasPend: chapterRules.some(rule => rule.status === 'Pending' && !(rule.sign || []).includes(me)),
        };
      }),
    ].map(item => {
      const active = chapterFilter === item.id;
      return {
        ...item,
        n: String(item.n),
        bg: active ? 'color-mix(in oklch, var(--acc) 7%, #fff)' : '#fff',
        sh: active ? 'inset 3px 0 0 var(--acc, oklch(0.5 0.17 265))' : 'none',
        fw: active ? '700' : '500',
        go: () => patchState({ cxch: item.id }),
      };
    });
    view.hasCh = chapterFilter !== 'all';
    view.ch = { num: chapterNumber(chapterFilter), name: chapterOf(chapterFilter)[2], desc: chapterOf(chapterFilter)[3] };
    const bulkApprovable = visibleRules.filter(rule => rule.status === 'Pending' && !(rule.sign || []).includes(me));
    view.canBulk = !!bulkApprovable.length;
    view.bulkN = String(bulkApprovable.length);
    view.bulkApprove = () => {
      if (!confirm('Approve ' + bulkApprovable.length + ' rules as ' + person(me).first + '? Each becomes active once ' + othersVerb('also approve') + '.')) return;
      const ids = bulkApprovable.map(rule => rule.id);
      updateConstitution(draftConstitution => {
        draftConstitution.rules.forEach(rule => {
          if (ids.includes(rule.id)) signRule(draftConstitution, rule);
        });
      });
      this.toastMsg('Approved ' + ids.length + ' rules');
    };
    view.addRule = () => {
      const id = uid();
      const ch = chapterFilter === 'all' ? 'phi' : chapterFilter;
      updateConstitution(draftConstitution => {
        draftConstitution.rules.push({
          id,
          code: XnextCode(draftConstitution.rules, ch),
          ch,
          title: '',
          text: '',
          kind: 'Mandatory',
          level: 1,
          scope: 'all',
          owner: 'both',
          effective: '',
          status: 'Draft',
          sign: [],
          v: 1,
          versions: [],
          docs: [],
          by: me,
          created: Date.now(),
        });
        logChange(draftConstitution, person(me).first + ' started a new draft rule');
      });
      patchState({ cxr: id });
      this._focus = { sel: '[data-rule="' + id + '"]' };
    };

    // ---- Rule drawer ----
    const selectedRule = ruleById(state.cxr);
    view.hasR = !!selectedRule;
    view.R = { close: () => patchState({ cxr: null }) };
    if (selectedRule) {
      const position = visibleRules.findIndex(rule => rule.id === selectedRule.id);
      const statusColors = XRST[selectedRule.status] || XRST.Draft;
      const updateSelectedRule = fn => updateConstitution((draftConstitution, draft) => {
        const rule = draftConstitution.rules.find(item => item.id === selectedRule.id);
        if (rule) fn(rule, draftConstitution, draft);
      });
      // Only drafts and pending rules can be edited in place; active rules change through amendments.
      const editable = selectedRule.status === 'Draft' || selectedRule.status === 'Pending';
      const pendingAmendment = openAmendments.find(amendment => amendment.ruleId === selectedRule.id);
      // Editing a pending rule withdraws any approvals it already had.
      const editField = key => e => updateSelectedRule(rule => {
        rule[key] = e.target.value;
        if (rule.status === 'Pending' && (rule.sign || []).length) rule.sign = [];
      });
      Object.assign(view.R, {
        id: selectedRule.id,
        code: selectedRule.code,
        st: XSTL[selectedRule.status],
        sBg: statusColors[0],
        sFg: statusColors[1],
        chName: chapterNumber(selectedRule.ch) + ' · ' + chapterOf(selectedRule.ch)[2],
        ver: 'Version ' + (selectedRule.v || 1) + (selectedRule.effective ? ' · effective ' + XfmtIso(selectedRule.effective) : ''),
        prev: () => position > 0 && patchState({ cxr: visibleRules[position - 1].id }),
        next: () => position >= 0 && position < visibleRules.length - 1 && patchState({ cxr: visibleRules[position + 1].id }),
        editable,
        locked: !editable,
        isPend: selectedRule.status === 'Pending',
        isDraft: selectedRule.status === 'Draft',
        isActive: selectedRule.status === 'Active',
        title: selectedRule.title,
        text: selectedRule.text,
        onTitle: editField('title'),
        onText: editField('text'),
        hasPendAmd: !!pendingAmendment,
        pendAmd: pendingAmendment
          ? 'A ' + (pendingAmendment.type === 'repeal' ? 'repeal' : 'change') + ' proposed by ' + person(pendingAmendment.by).first + ' is waiting for review in Amendments.'
          : '',
        propose: () => patchState({ cxa: { type: 'change', ruleId: selectedRule.id, title: selectedRule.title, text: selectedRule.text, reason: '', eff: today, ch: selectedRule.ch, err: '' } }),
        repeal: () => patchState({ cxa: { type: 'repeal', ruleId: selectedRule.id, title: selectedRule.title, text: selectedRule.text, reason: '', eff: today, ch: selectedRule.ch, err: '' } }),
        reqExc: () => patchState({ cxe: { ruleId: selectedRule.id, co: '', reason: '', until: plus(30), err: '' } }),
        apprTxt: selectedRule.status === 'Active' ? 'Approved by all founders'
          : selectedRule.status === 'Archived' ? 'Repealed'
            : (selectedRule.sign || []).filter(signer => FOUNDERS.includes(signer)).length + ' of ' + FOUNDERS.length + ' approved',
        signs: FOUNDERS.map(founder => {
          const approved = (selectedRule.sign || []).includes(founder);
          const isMine = founder === me;
          const canAct = isMine && editable;
          const label = approved
            ? '✓ ' + person(founder).first + ' approved'
            : isMine ? (selectedRule.status === 'Draft' ? 'Approve and submit' : 'Approve as ' + person(founder).first) : 'Waiting for ' + person(founder).first;
          return {
            ...approvalPill(approved, isMine, canAct, label),
            go: () => canAct && updateSelectedRule((rule, draftConstitution) => {
              if (approved) {
                rule.sign = rule.sign.filter(signer => signer !== me);
                logChange(draftConstitution, person(me).first + ' withdrew approval of ' + rule.code);
              } else {
                signRule(draftConstitution, rule);
              }
            }),
          };
        }),
        submit: () => {
          if (!(selectedRule.title || '').trim()) {
            this.toastMsg('Give the rule a title first');
            return;
          }
          updateSelectedRule((rule, draftConstitution) => signRule(draftConstitution, rule));
          this.toastMsg('Sent to ' + othersTxt + ' for approval');
        },
        // Moving a draft to another chapter gives it that chapter's next code.
        ch: selectField(selectedRule.ch, e => updateSelectedRule((rule, draftConstitution) => {
          rule.ch = e.target.value;
          if (rule.status === 'Draft') rule.code = XnextCode(draftConstitution.rules.filter(item => item.id !== rule.id), rule.ch);
        }), chapterOptions()),
        kindSeg: segOf([['Mandatory', 'Mandatory'], ['Recommended', 'Recommended']], selectedRule.kind, kind => updateSelectedRule((rule, draftConstitution) => {
          rule.kind = kind;
          logChange(draftConstitution, rule.code + ' set to ' + kind.toLowerCase());
        })),
        lvlSeg: segOf([[1, 'L1 Constitution'], [2, 'L2 Group policy'], [3, 'L3 Playbook']], selectedRule.level, level => updateSelectedRule(rule => { rule.level = level; })),
        scopeSeg: segOf([['all', 'All companies'], ['sel', 'Selected']], Array.isArray(selectedRule.scope) ? 'sel' : 'all', scope => updateSelectedRule(rule => {
          rule.scope = scope === 'all' ? 'all' : (Array.isArray(rule.scope) ? rule.scope : []);
        })),
        isSel: Array.isArray(selectedRule.scope),
        cos: openCompanies.map(company => {
          const inScope = Array.isArray(selectedRule.scope) && selectedRule.scope.includes(company.id);
          return {
            name: company.name,
            bg: inScope ? 'color-mix(in oklch, var(--acc) 10%, #fff)' : '#fff',
            fg: inScope ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.45 0.012 265)',
            bd: inScope ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.88 0.008 85)',
            go: () => updateSelectedRule(rule => {
              const scope = Array.isArray(rule.scope) ? rule.scope : [];
              rule.scope = inScope ? scope.filter(id => id !== company.id) : [...scope, company.id];
            }),
          };
        }),
        owner: selectField(selectedRule.owner, e => updateSelectedRule(rule => { rule.owner = e.target.value; }), [['both', ALL_FOUNDERS], ...memberOpts(false).map(([id, label]) => [id, label]), ['team', 'Company owner']]),
        eff: selectedRule.effective || '',
        onEff: e => updateSelectedRule(rule => { rule.effective = e.target.value; }),
        docs: (selectedRule.docs || []).map((doc, docIndex) => ({
          name: doc.name,
          url: doc.url,
          remove: () => updateSelectedRule(rule => { rule.docs.splice(docIndex, 1); }),
        })),
        docName: state.cxdn || '',
        docUrl: state.cxdu || '',
        onDocName: e => patchState({ cxdn: e.target.value }),
        onDocUrl: e => patchState({ cxdu: e.target.value }),
        // Links without a scheme get https://; a name with no link points to "#".
        addDoc: () => {
          const docName = (state.cxdn || '').trim();
          const docUrl = (state.cxdu || '').trim();
          if (!docName && !docUrl) return;
          const url = docUrl ? (/^https?:\/\//.test(docUrl) ? docUrl : 'https://' + docUrl) : '#';
          updateSelectedRule(rule => { rule.docs = [...(rule.docs || []), { name: docName || docUrl, url }]; });
          patchState({ cxdn: '', cxdu: '' });
        },
        excs: exceptions.filter(exception => exception.ruleId === selectedRule.id).map(exception => {
          const status = exceptionStatus(exception);
          return { co: companyName(exception.co), reason: exception.reason, st: status, sFg: XEXC[status][1] };
        }),
        // Newest version first; the top one is "current" while the rule is active.
        versions: [...(selectedRule.versions || [])].reverse().map((version, versionIndex) => ({
          head: 'v' + version.v + (versionIndex === 0 && selectedRule.status === 'Active' ? ' · current' : ''),
          meta: person(version.by).first + ' · ' + XfmtL(version.at),
          title: version.title,
          text: version.text,
          reason: version.reason || '',
          hasReason: !!version.reason,
          dot: versionIndex === 0 && selectedRule.status === 'Active' ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.8 0.01 265)',
        })),
        canDelete: selectedRule.status === 'Draft',
        remove: () => {
          if (!confirm('Delete draft ' + selectedRule.code + '?')) return;
          updateConstitution(draftConstitution => {
            draftConstitution.rules = draftConstitution.rules.filter(item => item.id !== selectedRule.id);
            logChange(draftConstitution, 'Deleted draft ' + selectedRule.code);
          });
          patchState({ cxr: null });
        },
      });
      view.R.hasExc = !!view.R.excs.length;
      view.R.hasVer = !!view.R.versions.length;
    }

    // ---- Amendments ----
    const amendmentFilter = state.cxaf || 'open';
    view.amdSteps = [
      'Founder proposes a change',
      'Reason for change is recorded',
      'The other founders review it',
      'Approval is obtained',
      'New version becomes effective',
      'Previous version stays in history',
    ].map((text, position) => ({ n: String(position + 1), t: text }));
    view.amdSeg = segOf([['open', 'Open · ' + openAmendments.length], ['approved', 'Approved'], ['closed', 'Rejected or withdrawn'], ['all', 'All']], amendmentFilter, filter => patchState({ cxaf: filter }));
    const updateAmendment = (id, fn) => updateConstitution(draftConstitution => {
      const amendment = draftConstitution.amendments.find(item => item.id === id);
      if (amendment) fn(amendment, draftConstitution);
    });
    const commentDrafts = state.cxcm || {};
    const visibleAmendments = amendments
      .filter(amendment => amendmentFilter === 'all' || (amendmentFilter === 'open' ? amendment.status === 'Pending'
        : amendmentFilter === 'approved' ? amendment.status === 'Approved'
          : ['Rejected', 'Withdrawn'].includes(amendment.status)))
      .slice()
      .sort((a, b) => b.at - a.at);
    view.amds = visibleAmendments.map(amendment => {
      const rule = ruleById(amendment.ruleId);
      const typeBadge = AMENDMENT_TYPES[amendment.type] || AMENDMENT_TYPES.change;
      const statusBadge = AMENDMENT_STATUSES[amendment.status] || AMENDMENT_STATUSES.Pending;
      const isOpen = amendment.status === 'Pending';
      const postComment = () => {
        const text = (commentDrafts[amendment.id] || '').trim();
        if (!text) return;
        updateAmendment(amendment.id, draftAmendment => {
          draftAmendment.comments = [...(draftAmendment.comments || []), { by: me, text, at: Date.now() }];
        });
        patchState({ cxcm: { ...commentDrafts, [amendment.id]: '' } });
      };
      const previousVersion = amendment.old ? amendment.old.v : 1;
      return {
        type: typeBadge[0],
        tBg: typeBadge[1],
        tFg: typeBadge[2],
        st: statusBadge[0],
        sBg: statusBadge[1],
        sFg: statusBadge[2],
        code: rule ? rule.code : 'NEW',
        title: amendment.type === 'new' ? amendment.title : (rule ? rule.title : amendment.title),
        reason: amendment.reason,
        meta: 'Proposed by ' + person(amendment.by).first + ' · ' + relativeTime(amendment.at)
          + (amendment.type === 'new' ? ' · ' + chapterOf(amendment.ch)[2] : '')
          + (amendment.eff ? ' · effective ' + XfmtIso(amendment.eff) : '')
          + (amendment.decidedAt ? ' · closed ' + XfmtL(amendment.decidedAt) : ''),
        hasOld: amendment.type !== 'new' && !!amendment.old,
        oldLbl: amendment.type === 'repeal' ? 'WILL BE ARCHIVED · v' + previousVersion : 'CURRENT · v' + previousVersion,
        oldTitle: amendment.old ? amendment.old.title : '',
        oldText: amendment.old ? amendment.old.text : '',
        hasNew: amendment.type !== 'repeal',
        newTitle: amendment.title,
        newText: amendment.text,
        comments: (amendment.comments || []).map(comment => ({ who: person(comment.by).first, when: relativeTime(comment.at), text: comment.text })),
        signs: FOUNDERS.map(founder => {
          const approved = (amendment.appr || []).includes(founder);
          return {
            label: approved ? '✓ ' + person(founder).first : person(founder).first + ' · ' + (isOpen ? 'waiting' : 'did not approve'),
            bg: approved ? 'oklch(0.95 0.05 150)' : '#fff',
            fg: approved ? 'oklch(0.38 0.1 150)' : 'oklch(0.5 0.012 265)',
            bd: approved ? 'oklch(0.82 0.07 150)' : 'oklch(0.88 0.008 85)',
          };
        }),
        isOpen,
        canApprove: isOpen && !(amendment.appr || []).includes(me),
        canWithdraw: isOpen && amendment.by === me,
        hasRule: !!rule,
        openRule: () => rule && patchState({ cxr: rule.id }),
        draft: commentDrafts[amendment.id] || '',
        onDraft: e => patchState({ cxcm: { ...commentDrafts, [amendment.id]: e.target.value } }),
        onKey: e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            postComment();
          }
        },
        // The second approval puts the amendment into effect straight away.
        approve: () => {
          updateAmendment(amendment.id, (draftAmendment, draftConstitution) => {
            draftAmendment.appr = [...new Set([...(draftAmendment.appr || []), me])];
            if (approvedByBoth(draftAmendment.appr)) applyAmendment(draftConstitution, draftAmendment);
            else logChange(draftConstitution, person(me).first + ' approved an amendment');
          });
          this.toastMsg(approvedByBoth([...(amendment.appr || []), me]) ? 'Approved. The new version is in effect.' : 'Approved');
        },
        reject: () => {
          const why = prompt('Why are you rejecting it? (optional)');
          if (why === null) return;
          updateAmendment(amendment.id, (draftAmendment, draftConstitution) => {
            draftAmendment.status = 'Rejected';
            draftAmendment.decidedAt = Date.now();
            if (why.trim()) draftAmendment.comments = [...(draftAmendment.comments || []), { by: me, text: 'Rejected: ' + why.trim(), at: Date.now() }];
            logChange(draftConstitution, person(me).first + ' rejected an amendment');
          });
        },
        withdraw: () => updateAmendment(amendment.id, (draftAmendment, draftConstitution) => {
          draftAmendment.status = 'Withdrawn';
          draftAmendment.decidedAt = Date.now();
          logChange(draftConstitution, person(me).first + ' withdrew an amendment');
        }),
      };
    });
    view.noAmds = !visibleAmendments.length;
    view.noAmdTxt = amendmentFilter === 'open' ? 'No open amendments. Propose one from any active rule.' : 'Nothing here yet.';

    // ---- "Propose an amendment" dialog ----
    const amendmentDraft = state.cxa;
    view.hasA = !!amendmentDraft;
    if (amendmentDraft) {
      const patchAmendmentDraft = patch => patchState({ cxa: { ...amendmentDraft, ...patch, err: '' } });
      const targetRule = ruleById(amendmentDraft.ruleId);
      view.A = {
        otherTxt: othersVerb('review') + ' it. It takes effect only when all founders approve, and the current version stays in history.',
        typeSeg: segOf([['change', 'Change a rule'], ['new', 'New rule'], ['repeal', 'Repeal a rule']], amendmentDraft.type, type => patchAmendmentDraft(type === 'new' ? { type, ruleId: '', title: '', text: '' } : { type })),
        needRule: amendmentDraft.type !== 'new',
        isNew: amendmentDraft.type === 'new',
        hasText: amendmentDraft.type !== 'repeal',
        // Picking a rule pre-fills its current wording.
        rule: selectField(amendmentDraft.ruleId || '', e => {
          const pickedRule = ruleById(e.target.value);
          patchAmendmentDraft({ ruleId: e.target.value, title: pickedRule ? pickedRule.title : '', text: pickedRule ? pickedRule.text : '' });
        }, [['', 'Pick an active rule…'], ...activeRules.map(rule => [rule.id, rule.code + ' · ' + rule.title])]),
        ch: selectField(amendmentDraft.ch || 'phi', e => patchAmendmentDraft({ ch: e.target.value }), chapterOptions()),
        title: amendmentDraft.title || '',
        onTitle: e => patchAmendmentDraft({ title: e.target.value }),
        text: amendmentDraft.text || '',
        onText: e => patchAmendmentDraft({ text: e.target.value }),
        reason: amendmentDraft.reason || '',
        onReason: e => patchAmendmentDraft({ reason: e.target.value }),
        eff: amendmentDraft.eff || '',
        onEff: e => patchAmendmentDraft({ eff: e.target.value }),
        err: amendmentDraft.err || '',
        close: () => patchState({ cxa: null }),
        // The proposer's approval is recorded straight away; the other founders' complete it.
        submit: () => {
          const fail = message => patchState({ cxa: { ...amendmentDraft, err: message } });
          if (amendmentDraft.type !== 'new' && !targetRule) return fail('Pick the rule.');
          if (amendmentDraft.type !== 'repeal' && !(amendmentDraft.title || '').trim()) return fail('Add a title.');
          if (amendmentDraft.type === 'change' && targetRule && targetRule.title === amendmentDraft.title && targetRule.text === amendmentDraft.text) return fail('The wording has not changed yet.');
          if (!(amendmentDraft.reason || '').trim()) return fail('Record the reason for the change.');
          updateConstitution(draftConstitution => {
            draftConstitution.amendments = [...(draftConstitution.amendments || []), {
              id: uid(),
              type: amendmentDraft.type,
              ruleId: amendmentDraft.ruleId || '',
              ch: amendmentDraft.ch || 'phi',
              title: (amendmentDraft.title || '').trim(),
              text: (amendmentDraft.text || '').trim(),
              reason: amendmentDraft.reason.trim(),
              eff: amendmentDraft.eff || today,
              by: me,
              at: Date.now(),
              appr: [me],
              status: 'Pending',
              comments: [],
              old: targetRule ? { v: targetRule.v || 1, title: targetRule.title, text: targetRule.text } : null,
            }];
            logChange(draftConstitution, person(me).first + ' proposed '
              + (amendmentDraft.type === 'new' ? 'a new rule' : amendmentDraft.type === 'repeal' ? 'repealing ' + targetRule.code : 'a change to ' + targetRule.code));
          });
          patchState({ cxa: null, cxr: null, cnTab: 'amend', cxaf: 'open' });
          this.toastMsg('Sent to ' + othersTxt + ' for review');
        },
      };
    }

    // ---- Exceptions ----
    const exceptionFilter = state.cxef || 'active';
    view.excSeg = segOf([['active', 'Active'], ['pending', 'Pending'], ['ended', 'Expired or revoked'], ['all', 'All']], exceptionFilter, filter => patchState({ cxef: filter }));
    const visibleExceptions = exceptions
      .filter(exception => {
        const status = exceptionStatus(exception);
        return exceptionFilter === 'all' || (exceptionFilter === 'active' ? status === 'Active'
          : exceptionFilter === 'pending' ? status === 'Pending'
            : status === 'Expired' || status === 'Revoked');
      })
      .slice()
      .sort((a, b) => (a.until || '') < (b.until || '') ? -1 : 1);
    const updateException = (id, fn) => updateConstitution(draftConstitution => {
      const exception = draftConstitution.exceptions.find(item => item.id === id);
      if (exception) fn(exception, draftConstitution);
    });
    view.excs = visibleExceptions.map(exception => {
      const rule = ruleById(exception.ruleId);
      const company = allCompanies.find(item => item.id === exception.co);
      const status = exceptionStatus(exception);
      const daysLeft = dayDiff(exception.until);
      return {
        code: rule ? rule.code : '',
        rule: rule ? rule.title : 'Deleted rule',
        openRule: () => rule && patchState({ cxr: rule.id }),
        co: company ? company.name : '—',
        coIni: company ? company.ini : '?',
        coBg: company ? company.bg : 'oklch(0.7 0.01 265)',
        reason: exception.reason,
        by: person(exception.by).first,
        until: XfmtIso(exception.until),
        left: status === 'Active' ? (daysLeft === 0 ? 'ends today' : daysLeft + ' days left')
          : status === 'Expired' ? 'ended ' + (-daysLeft) + 'd ago'
            : '',
        leftC: status === 'Active' && daysLeft <= 14 ? AMBER : MUTED,
        signs: signatureDots(exception.appr),
        st: status,
        sBg: XEXC[status][0],
        sFg: XEXC[status][1],
        canApprove: status === 'Pending' && !(exception.appr || []).includes(me),
        approve: () => updateException(exception.id, (draftException, draftConstitution) => {
          draftException.appr = [...new Set([...(draftException.appr || []), me])];
          logChange(draftConstitution, person(me).first + ' approved an exception for ' + companyName(draftException.co));
        }),
        canExtend: status === 'Active' || status === 'Expired',
        // Extends by 30 days from the current end date, or from today if it already ended.
        extend: () => updateException(exception.id, (draftException, draftConstitution) => {
          const base = draftException.until && draftException.until > today ? new Date(draftException.until + 'T00:00:00') : new Date();
          base.setDate(base.getDate() + 30);
          draftException.until = iso(base);
          logChange(draftConstitution, 'Exception for ' + companyName(draftException.co) + ' extended to ' + draftException.until);
        }),
        canRevoke: status === 'Active' || status === 'Pending',
        revokeLbl: status === 'Pending' ? 'Cancel' : 'Revoke',
        revoke: () => {
          if (!confirm('End this exception now?')) return;
          updateException(exception.id, (draftException, draftConstitution) => {
            draftException.revoked = Date.now();
            logChange(draftConstitution, 'Exception for ' + companyName(draftException.co) + ' ended');
          });
        },
      };
    });
    view.noExc = !visibleExceptions.length;
    const newException = () => patchState({ cxe: { ruleId: '', co: '', reason: '', until: plus(30), err: '' } });
    view.newExc = newException;

    // ---- "Request an exception" dialog ----
    const exceptionDraft = state.cxe;
    view.hasE = !!exceptionDraft;
    if (exceptionDraft) {
      const patchExceptionDraft = patch => patchState({ cxe: { ...exceptionDraft, ...patch, err: '' } });
      view.E = {
        otherTxt: 'Becomes active when ' + othersVerb('also approve') + '.',
        rule: selectField(exceptionDraft.ruleId, e => patchExceptionDraft({ ruleId: e.target.value }), [['', 'Pick a rule…'], ...activeRules.map(rule => [rule.id, rule.code + ' · ' + rule.title])]),
        co: selectField(exceptionDraft.co, e => patchExceptionDraft({ co: e.target.value }), [['', 'Pick a company…'], ...openCompanies.map(company => [company.id, company.name])]),
        reason: exceptionDraft.reason,
        onReason: e => patchExceptionDraft({ reason: e.target.value }),
        until: exceptionDraft.until,
        onUntil: e => patchExceptionDraft({ until: e.target.value }),
        err: exceptionDraft.err || '',
        close: () => patchState({ cxe: null }),
        submit: () => {
          const fail = message => patchState({ cxe: { ...exceptionDraft, err: message } });
          if (!exceptionDraft.ruleId) return fail('Pick the rule.');
          if (!exceptionDraft.co) return fail('Pick the company.');
          if (!(exceptionDraft.reason || '').trim()) return fail('Explain the reason.');
          if (!exceptionDraft.until || exceptionDraft.until <= today) return fail('Pick an expiry date in the future.');
          updateConstitution(draftConstitution => {
            draftConstitution.exceptions = [...(draftConstitution.exceptions || []), {
              id: uid(),
              ruleId: exceptionDraft.ruleId,
              co: exceptionDraft.co,
              reason: exceptionDraft.reason.trim(),
              until: exceptionDraft.until,
              by: me,
              at: Date.now(),
              appr: [me],
            }];
            logChange(draftConstitution, person(me).first + ' requested an exception for ' + companyName(exceptionDraft.co));
          });
          patchState({ cxe: null, cnTab: 'exceptions', cxef: 'pending' });
          this.toastMsg('Sent to ' + othersTxt + ' for approval');
        },
      };
    }

    // ---- New ventures (company and product proposals) ----
    const ventureType = state.cxvt || 'company';
    const isProduct = ventureType === 'product';
    const stages = isProduct ? XPST : XCST;
    const ventureView = state.cxvv || 'board';
    const fieldsOf = venture => venture.type === 'product' ? XPFLD : XCFLD;
    // Proposals cannot pass this stage until the brief is complete and all founders approve.
    const gateStageIndex = venture => venture.type === 'product' ? 4 : 3;
    /** Share of the brief that is filled in; the name counts as one extra field. */
    const venturePct = venture => {
      const fields = fieldsOf(venture);
      const filled = fields.filter(([key]) => ((venture.f || {})[key] || '').trim()).length + ((venture.name || '').trim() ? 1 : 0);
      return Math.round(filled / (fields.length + 1) * 100);
    };
    /** What is still missing before the proposal may pass its gate ('' when nothing is). */
    const gateMessage = venture => {
      const missing = [];
      if (venturePct(venture) < 100) missing.push('fill in every field');
      if (!approvedByBoth(venture.appr)) missing.push('get approval from all founders');
      return missing.length
        ? 'Before moving past ' + (venture.type === 'product' ? XPST : XCST)[gateStageIndex(venture)][0] + ': ' + missing.join(' and ') + '.'
        : '';
    };
    const canReachStage = (venture, stageIndex) => stageIndex <= gateStageIndex(venture) || !gateMessage(venture);
    /** Card flag: the review verdict, "waiting for approval" at the gate, or days spent in the current stage. */
    const ventureFlag = venture => {
      if (venture.verdict) {
        const color = ['Stop', 'Discontinue'].includes(venture.verdict) ? RED
          : ['Continue', 'Invest more', 'Improve'].includes(venture.verdict) ? GREEN
            : AMBER;
        return [venture.verdict, color];
      }
      if (venture.stage === gateStageIndex(venture) && !approvedByBoth(venture.appr)) return ['Waiting for approval', AMBER];
      const days = Math.floor((Date.now() - (venture.stageAt || venture.at)) / 864e5);
      return [days ? days + 'd in this stage' : 'Moved today', MUTED];
    };
    const ventureCard = venture => {
      const pct = venturePct(venture);
      const [flag, flagC] = ventureFlag(venture);
      return {
        name: venture.name || 'Untitled proposal',
        meta: ownerLabel(venture.owner) + (venture.type === 'product' && venture.co ? ' · ' + companyName(venture.co) : ''),
        pct: pct + '%',
        w: pct + '%',
        pc: pct >= 100 ? GREEN : pct >= 50 ? AMBER : 'oklch(0.6 0.12 25)',
        flag,
        flagC,
        hasFlag: true,
        stage: (venture.type === 'product' ? XPST : XCST)[venture.stage][0],
        open: () => patchState({ cxv: venture.id }),
      };
    };
    const typeVentures = ventures.filter(venture => venture.type === ventureType);
    view.vtSeg = segOf([
      ['company', 'New companies · ' + ventures.filter(venture => venture.type === 'company').length],
      ['product', 'New products · ' + ventures.filter(venture => venture.type === 'product').length],
    ], ventureType, type => patchState({ cxvt: type }));
    view.vvSeg = segOf([['board', 'Board'], ['list', 'List']], ventureView, mode => patchState({ cxvv: mode }));
    view.vtLbl = isProduct ? 'product' : 'company';
    view.isProd = isProduct;
    view.vBoard = ventureView === 'board';
    view.vList = ventureView === 'list';
    view.noVen = !typeVentures.length;
    const ventureRule = rules.find(rule => rule.ch === (isProduct ? 'prd' : 'cre') && rule.status !== 'Archived');
    view.vRule = {
      code: ventureRule ? ventureRule.code : '',
      text: isProduct
        ? 'Build fast, validate early, invest based on evidence. Every product passes 10 stages; it cannot reach MVP until the brief is complete and all founders approve.'
        : (ventureRule ? ventureRule.text : ''),
      open: () => ventureRule && patchState({ cxr: ventureRule.id }),
    };
    // Board columns are tinted from blue (first stage) towards green (last).
    view.vStages = stages.map(([name, q], stageIndex) => {
      const items = typeVentures.filter(venture => venture.stage === stageIndex);
      return {
        n: String(stageIndex + 1),
        name,
        q,
        col: 'oklch(0.68 0.13 ' + Math.round(265 - stageIndex * (110 / (stages.length - 1))) + ')',
        count: String(items.length),
        items: items.map(ventureCard),
      };
    });
    view.vRows = typeVentures.slice().sort((a, b) => b.stage - a.stage).map(ventureCard);
    view.prodRules = rules
      .filter(rule => rule.ch === 'prd' && rule.status !== 'Archived')
      .map(rule => ({ code: rule.code, title: rule.title, open: () => patchState({ cxr: rule.id }) }));
    view.newVen = () => {
      const id = uid();
      updateConstitution(draftConstitution => {
        draftConstitution.ventures = [...(draftConstitution.ventures || []), {
          id,
          type: ventureType,
          name: '',
          f: {},
          stage: 0,
          stageAt: Date.now(),
          owner: me,
          by: me,
          at: Date.now(),
          appr: [],
          co: isProduct ? ((openCompanies[0] || {}).id || '') : '',
          rev: {},
          verdict: '',
        }];
        logChange(draftConstitution, person(me).first + ' started a new ' + ventureType + ' proposal');
      });
      patchState({ cxv: id });
    };

    // ---- Venture drawer ----
    const selectedVenture = ventures.find(venture => venture.id === state.cxv);
    view.hasV = !!selectedVenture;
    view.V = { close: () => patchState({ cxv: null }) };
    if (selectedVenture) {
      const isProductVenture = selectedVenture.type === 'product';
      const stageList = isProductVenture ? XPST : XCST;
      const gateIndex = gateStageIndex(selectedVenture);
      const updateVenture = fn => updateConstitution(draftConstitution => {
        const venture = draftConstitution.ventures.find(item => item.id === selectedVenture.id);
        if (venture) fn(venture, draftConstitution);
      });
      const gateWarning = selectedVenture.stage === gateIndex ? gateMessage(selectedVenture) : '';
      const goStage = stageIndex => {
        if (!canReachStage(selectedVenture, stageIndex)) {
          this.toastMsg(gateMessage(selectedVenture));
          return;
        }
        updateVenture((venture, draftConstitution) => {
          venture.stage = stageIndex;
          venture.stageAt = Date.now();
          logChange(draftConstitution, (venture.name || 'Proposal') + ' moved to ' + stageList[stageIndex][0]);
        });
      };
      const createdCompany = selectedVenture.coId && allCompanies.find(company => company.id === selectedVenture.coId);

      /** Creates the company from an approved proposal, with the legal playbooks for its market's country applied. */
      const createCompany = () => {
        const name = (selectedVenture.name || '').trim();
        if (!name) {
          this.toastMsg('Give the company a name first');
          return;
        }
        let id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || uid();
        if (allCompanies.some(company => company.id === id)) id += '-' + uid().slice(0, 3);
        const market = ((selectedVenture.f || {}).market || '').toLowerCase();
        const country = COUNTRIES.find(item => item !== 'Other' && market.includes(item.toLowerCase())) || 'India';
        const hue = CX_HUES[allCompanies.length % CX_HUES.length];
        this.upd(draft => {
          ensureCos(draft);
          XmigrateCons(draft.constitution);
          const runs = {};
          (draft.constitution.playbooks || [])
            .filter(playbook => playbook.cat === 'Legal' && playbook.country === country)
            .forEach(playbook => { runs[playbook.id] = { started: Date.now(), done: {}, na: {} }; });
          draft.companies.push({
            id,
            name: name.length > 14 ? name.split(/\s+/)[0] : name,
            full: name,
            legal: name,
            ini: name[0].toUpperCase(),
            hue,
            ...coColors(hue),
            status: 'Setting up',
            country,
            entity: (ENTITIES[country] || [''])[0],
            industry: '',
            owner: selectedVenture.owner || 'both',
            pin: false,
            created: Date.now(),
            runs,
          });
          const venture = draft.constitution.ventures.find(item => item.id === selectedVenture.id);
          if (venture) venture.coId = id;
          logChange(draft.constitution, name + ' created from its approved proposal');
        });
        this.toastMsg(name + ' added to Companies with its ' + country + ' formation playbook');
      };

      Object.assign(view.V, {
        name: selectedVenture.name || '',
        namePh: isProductVenture ? 'Product name' : 'Proposed company name',
        onName: e => updateVenture(venture => { venture.name = e.target.value; }),
        isProd: isProductVenture,
        typeLbl: isProductVenture ? 'PRODUCT PROPOSAL' : 'COMPANY PROPOSAL',
        formTitle: isProductVenture ? 'Product brief' : 'Mandatory company proposal',
        pct: venturePct(selectedVenture) + '%',
        steps: stageList.map(([name, q], stageIndex) => ({
          n: String(stageIndex + 1),
          name,
          q,
          bar: stageIndex < selectedVenture.stage ? 'oklch(0.58 0.13 150)'
            : stageIndex === selectedVenture.stage ? 'var(--acc, oklch(0.5 0.17 265))'
              : 'oklch(0.92 0.005 85)',
          fg: stageIndex === selectedVenture.stage ? INK_C : MUTED,
          fw: stageIndex === selectedVenture.stage ? '700' : '500',
          go: () => goStage(stageIndex),
        })),
        fields: fieldsOf(selectedVenture).map(([key, label, hint]) => ({
          label,
          hint,
          v: (selectedVenture.f || {})[key] || '',
          empty: !((selectedVenture.f || {})[key] || '').trim(),
          on: e => updateVenture(venture => { venture.f = { ...(venture.f || {}), [key]: e.target.value }; }),
        })),
        stageN: String(selectedVenture.stage + 1),
        stageT: String(stageList.length),
        stageName: stageList[selectedVenture.stage][0],
        stageQ: stageList[selectedVenture.stage][1],
        owner: selectField(selectedVenture.owner, e => updateVenture(venture => { venture.owner = e.target.value; }), memberOpts().map(([id, label]) => [id, label])),
        co: selectField(selectedVenture.co || '', e => updateVenture(venture => { venture.co = e.target.value; }), [['', 'Pick a company…'], ...openCompanies.map(company => [company.id, company.name])]),
        signs: FOUNDERS.map(founder => {
          const approved = (selectedVenture.appr || []).includes(founder);
          const isMine = founder === me;
          const label = approved ? '✓ ' + person(founder).first + ' approved' : isMine ? 'Approve as ' + person(founder).first : 'Waiting for ' + person(founder).first;
          return {
            ...approvalPill(approved, isMine, isMine, label),
            go: () => isMine && updateVenture((venture, draftConstitution) => {
              venture.appr = approved ? (venture.appr || []).filter(approver => approver !== me) : [...(venture.appr || []), me];
              logChange(draftConstitution, person(me).first + (approved ? ' withdrew approval of ' : ' approved ') + (venture.name || 'a proposal'));
            }),
          };
        }),
        hasGate: !!gateWarning,
        gate: gateWarning,
        canBack: selectedVenture.stage > 0,
        back: () => goStage(selectedVenture.stage - 1),
        canNext: selectedVenture.stage < stageList.length - 1,
        nextLbl: selectedVenture.stage < stageList.length - 1 ? 'Move to ' + stageList[selectedVenture.stage + 1][0] + ' →' : '',
        nextOp: gateWarning ? '0.5' : '1',
        next: () => goStage(selectedVenture.stage + 1),
        isReview: selectedVenture.stage === stageList.length - 1,
        checks: [['d30', '30-day review'], ['d60', '60-day review'], ['d90', '90-day review']].map(([key, label]) => ({
          l: label,
          v: (selectedVenture.rev || {})[key] || '',
          on: e => updateVenture(venture => { venture.rev = { ...(venture.rev || {}), [key]: e.target.value }; }),
        })),
        // Clicking the current verdict again clears it.
        verdicts: (isProductVenture ? ['Improve', 'Pivot', 'Discontinue'] : ['Continue', 'Pivot', 'Invest more', 'Stop']).map(verdict => {
          const chosen = selectedVenture.verdict === verdict;
          return {
            label: verdict,
            bg: chosen ? INK_C : '#fff',
            fg: chosen ? '#fff' : INK_C,
            bd: chosen ? INK_C : 'oklch(0.88 0.008 85)',
            go: () => updateVenture((venture, draftConstitution) => {
              venture.verdict = chosen ? '' : verdict;
              if (!chosen) logChange(draftConstitution, 'Review decision for ' + (venture.name || 'proposal') + ': ' + verdict);
            }),
          };
        }),
        canCreate: !isProductVenture && !createdCompany && selectedVenture.stage > gateIndex,
        createLbl: 'Create ' + ((selectedVenture.name || '').trim() || 'the company') + ' in Companies',
        hasCreated: !!createdCompany,
        coName: createdCompany ? createdCompany.name : '',
        openCo: () => this.go('companies', { cmOpen: selectedVenture.coId, cxv: null }),
        create: createCompany,
        meta: 'Started by ' + person(selectedVenture.by).first + ' · ' + XfmtL(selectedVenture.at),
        remove: () => {
          if (!confirm('Delete this proposal?')) return;
          updateConstitution(draftConstitution => {
            draftConstitution.ventures = draftConstitution.ventures.filter(item => item.id !== selectedVenture.id);
            logChange(draftConstitution, 'Deleted proposal ' + (selectedVenture.name || ''));
          });
          patchState({ cxv: null });
        },
      });
    }

    // ---- Authority ----
    // Saved authority settings are merged over a fresh copy of the defaults before editing.
    const updateAuthority = fn => updateConstitution(draftConstitution => {
      draftConstitution.authority = { ...JSON.parse(JSON.stringify(XAUTH_DEF)), ...(draftConstitution.authority || {}) };
      fn(draftConstitution.authority);
    });
    view.authLv = [
      [1, 'Independent authority', 'Routine operational decisions made by the responsible founder or delegated manager within approved budgets and limits.', ['Spends within budget and limit', 'Hiring within approved headcount', 'Day-to-day operations'], 'oklch(0.55 0.13 150)'],
      [2, 'Joint approval', 'New company launches, major investments, borrowing, ownership changes, large commitments and strategic pivots.', ['New companies', 'Major investments', 'Borrowing', 'Ownership changes', 'Strategic pivots'], 'oklch(0.62 0.14 70)'],
      [3, 'Reserved matters', 'Matters requiring formal approval under shareholder agreements, board rules or applicable law. No founder should assume unilateral authority over these matters.', ['Shareholder agreement matters', 'Board resolutions', 'Statutory approvals'], 'oklch(0.55 0.17 25)'],
    ].map(([level, name, text, examples, col]) => ({ n: String(level), name, text, ex: examples.map(example => ({ t: example })), col }));

    // "Can I decide this alone?" checker: the level is the matter's own level, raised to 2 above the spending limit.
    const check = { who: me, matter: 'ops', amt: '', ...(state.cxchk || {}) };
    const setCheck = patch => patchState({ cxchk: { ...check, ...patch } });
    const matter = XMATTERS.find(item => item[0] === check.matter) || XMATTERS[0];
    const amount = Number(check.amt) || 0;
    const limit = Number(authority.limit) || 0;
    const level = Math.max(matter[2], amount > limit ? 2 : 1);
    view.chk = {
      who: segOf(memberOpts(false), check.who, who => setCheck({ who })),
      matter: selectField(check.matter, e => setCheck({ matter: e.target.value }), XMATTERS.map(item => [item[0], item[1]])),
      amt: check.amt,
      onAmt: e => setCheck({ amt: e.target.value }),
      lvl: 'LEVEL ' + level,
      bg: LEVEL_COLORS[level][0],
      fg: LEVEL_COLORS[level][1],
      head: level === 1 ? person(check.who).first + ' can decide this alone'
        : level === 2 ? 'Needs all founders: ' + namesOf(FOUNDERS)
          : 'Reserved matter. Formal approval needed',
      text: level === 1
        ? 'Within approved budgets and the ' + this.money(limit) + ' Level 1 limit. Record it in Decisions if it affects strategy, money, people or product.'
        : level === 2
          ? (amount > limit && matter[2] < 2 ? 'The amount is above the ' + this.money(limit) + ' Level 1 limit. ' : '') + 'All founders approve it, and it is logged in Decisions.'
          : 'Needs formal approval under the shareholder agreement, board rules or applicable law. No founder decides alone. Check with your CA or lawyer.',
      needLog: level >= 2,
      log: () => this.go('decisions'),
    };
    view.auth = {
      limit: String(authority.limit),
      onLimit: e => updateAuthority(draftAuthority => { draftAuthority.limit = Number(e.target.value) || 0; }),
      limitTxt: 'Anything above ' + this.money(limit) + ' needs all founders.',
      emergency: authority.emergency,
      onEmergency: e => updateAuthority(draftAuthority => { draftAuthority.emergency = e.target.value; }),
      absence: authority.absence,
      onAbsence: e => updateAuthority(draftAuthority => { draftAuthority.absence = e.target.value; }),
      addRow: () => updateAuthority(draftAuthority => { draftAuthority.matrix = [...(draftAuthority.matrix || []), { id: uid(), area: '', who: '', lvl: 1 }]; }),
      // Responsibility matrix rows.
      rows: (authority.matrix || []).map((row, rowIndex) => ({
        area: row.area,
        who: row.who,
        onArea: e => updateAuthority(draftAuthority => { draftAuthority.matrix[rowIndex].area = e.target.value; }),
        onWho: e => updateAuthority(draftAuthority => { draftAuthority.matrix[rowIndex].who = e.target.value; }),
        lvl: selectField(String(row.lvl), e => updateAuthority(draftAuthority => { draftAuthority.matrix[rowIndex].lvl = Number(e.target.value); }), [['1', 'L1 · Independent'], ['2', 'L2 · Joint'], ['3', 'L3 · Reserved']]),
        remove: () => updateAuthority(draftAuthority => { draftAuthority.matrix.splice(rowIndex, 1); }),
      })),
    };

    // ---- Ask AI ----
    view.ai = {
      q: state.cxq || '',
      onQ: e => patchState({ cxq: e.target.value }),
      onKey: e => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          this.cxAsk();
        }
      },
      ask: () => this.cxAsk(),
      btn: state.cxbusy ? 'Thinking…' : 'Ask',
      note: state.cxnote || (state.cxbusy ? '' : '⌘ + Enter to ask'),
      sugg: [
        'Can we start a new AI product under Mariox without creating a separate company?',
        'Can we invest ₹50 lakh in a new product?',
        'What is our process for launching a new company?',
        'Who has authority to approve new hiring?',
        'Can a co-founder independently approve this expense?',
        'What is our process for entering the USA market?',
      ].map(suggestion => ({ t: suggestion, go: () => patchState({ cxq: suggestion }) })),
      legend: Object.entries(XAITAG).map(([tag, colors]) => ({ tag, bg: colors[0], fg: colors[1], d: colors[2] })),
      items: asks.map(ask => {
        const lines = parseAnswer(ask.a);
        return {
          q: ask.q,
          ini: person(ask.by).ini,
          bg: person(ask.by).bg,
          when: relativeTime(ask.at),
          lines,
          missing: lines.some(line => line.tag === 'MISSING RULE'),
          remove: () => updateConstitution(draftConstitution => { draftConstitution.asks = draftConstitution.asks.filter(item => item.id !== ask.id); }),
          copy: () => {
            if (navigator.clipboard) navigator.clipboard.writeText(ask.q + '\n\n' + ask.a);
            this.toastMsg('Answer copied');
          },
          // Opens a "new rule" amendment when the AI found no rule covering the question.
          draftRule: () => patchState({ cxa: { type: 'new', ruleId: '', ch: 'phi', title: '', text: '', reason: 'No rule covered this question: ' + ask.q, eff: today, err: '' } }),
        };
      }),
    };

    // ---- History: superseded versions and repealed rules, newest first ----
    const archived = [
      ...rules.flatMap(rule => (rule.versions || []).slice(0, -1).map(version => ({ code: rule.code, v: 'v' + version.v, title: version.title, at: version.at, id: rule.id }))),
      ...rules.filter(rule => rule.status === 'Archived').map(rule => ({ code: rule.code, v: 'repealed', title: rule.title, at: rule.archivedAt || 0, id: rule.id })),
    ].sort((a, b) => b.at - a.at);
    view.archive = archived.map(entry => ({
      code: entry.code,
      v: entry.v,
      title: entry.title,
      when: entry.at ? XfmtL(entry.at) : '',
      open: () => patchState({ cxr: entry.id }),
    }));
    view.hasArch = !!archived.length;
    view.archN = String(archived.length);
    return { cx: view };
  }

  /**
   * Keeps a section's company tabs short: when there are more than six company tabs, only pinned
   * companies (top five) and the selected one stay visible; the rest move into a "find" box (`coMore`).
   */
  capTabs(viewModel, key) {
    if (!viewModel || !Array.isArray(viewModel.coTabs)) return;
    const allTabs = viewModel.coTabs;
    const isCompanyTab = tab => COS.some(company => company.name === tab.label);
    const companyTabs = allTabs.filter(isCompanyTab);
    if (companyTabs.length <= 6) {
      viewModel.coMore = { has: false, id: '', opts: [], ph: '', on: () => {} };
      return;
    }
    const pinnedNames = COS.filter(company => company.pin).slice(0, 5).map(company => company.name);
    // The selected tab is the one drawn in ink colour.
    const visibleTabs = allTabs.filter(tab => !isCompanyTab(tab) || pinnedNames.includes(tab.label) || tab.fg === INK_C);
    const hiddenTabs = allTabs.filter(tab => !visibleTabs.includes(tab));
    viewModel.coTabs = visibleTabs;
    viewModel.coMore = {
      has: !!hiddenTabs.length,
      id: 'com-' + key,
      opts: hiddenTabs.map(tab => ({ l: tab.label })),
      ph: 'Find among ' + hiddenTabs.length + ' more companies…',
      // Choosing a name from the datalist opens that company's tab and clears the box.
      on: e => {
        const typed = e.target.value.trim().toLowerCase();
        const match = hiddenTabs.find(tab => tab.label.toLowerCase() === typed);
        if (match) {
          e.target.value = '';
          e.target.blur();
          match.go();
        }
      },
    };
  }
}
