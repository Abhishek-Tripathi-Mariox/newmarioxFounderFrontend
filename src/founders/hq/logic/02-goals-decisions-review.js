/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import HQState from './01-state';
import { setTeamTaskDue } from '../teamTasks/hqTeamTasks';
import { newLeadInHQ } from '../leads/hqLeads';
import { STATUS_HUE as TEAM_STATUS_HUE } from '@/features/team-tasks/model';
import { initialsOf } from '@/founders/auth/accounts';
import { KEY, PEOPLE, COS, coOf, CO_OPTS, OWNER_OPTS, segOf, STATUS, iso, plus, dayDiff, uid, INK_C, RED, AMBER, MUTED, act, GST, DST, DST_LABEL, IMPACT, DX_DEF, goalCalc, parseQuick, normRv, AI_ON } from './core';

/*
 * View model for the Today brief, Goals (list + peek panel + popover menus), Decisions (list + panel),
 * the Weekly review and the ⌘K command bar. The class method at the bottom wires the section builders
 * together; each builder receives the component (`hq`) and the shared render context (`ctx`).
 */

const DAY_MS = 864e5;

/** Goal statuses that count as "needs attention". */
const NEEDS_ATTENTION = ['At risk', 'Behind', 'Overdue'];

/** Sort order for "Needs attention first". */
const GOAL_STATUS_RANK = { Overdue: 0, Behind: 1, 'At risk': 2, 'Not started': 3, 'In progress': 4, 'On track': 5, Achieved: 6 };

/** [id, label, default title, "measure|unit"] for the "Start from" menu. */
const GOAL_TEMPLATES = [
  ['blank', 'Blank goal', '', ''],
  ['rev', 'Revenue target', 'Reach monthly revenue of ₹', 'number|₹'],
  ['clients', 'Win new clients', 'Sign new clients', 'number|clients'],
  ['hires', 'Hiring target', 'Hire team members', 'number|hires'],
  ['launch', 'Launch something', 'Launch ', 'tasks|'],
];

const GOAL_TILE_TIPS = {
  any: 'Every goal',
  track: 'Progress is keeping up with time',
  attention: 'At risk or behind pace',
  overdue: 'Target date passed',
  achieved: 'Reached 100%',
};

const GOAL_WHEN_OPTIONS = [['any', 'Any time'], ['month', 'Due this month'], ['quarter', 'Due this quarter'], ['later', 'Due later'], ['nodate', 'No target date']];
const GOAL_GROUP_OPTIONS = [['company', 'Company'], ['status', 'Status'], ['owner', 'Owner'], ['none', 'No grouping']];
const GOAL_SORT_OPTIONS = [
  ['target', 'Target date (soonest)'],
  ['attention', 'Needs attention first'],
  ['low', 'Progress (lowest first)'],
  ['high', 'Progress (highest first)'],
  ['newest', 'Newest first'],
  ['name', 'Name (A to Z)'],
];

const IMPACT_RANK = { High: 0, Medium: 1, Low: 2 };

/** Pages offered under "Go to" in the command bar. */
const NAV_TARGETS = [
  ['home', 'Today'], ['brief', 'Chief of staff'], ['tasks', 'Tasks'], ['calendar', 'Calendar'], ['attendance', 'Attendance'],
  ['goals', 'Goals'], ['decisions', 'Decisions'], ['review', 'Weekly review'], ['scorecard', 'Scorecard'], ['sync', 'Founders\' sync'],
  ['pipeline', 'Sales pipeline'], ['research', 'Research'], ['finance', 'Finance'], ['contracts', 'Contracts'], ['hiring', 'Hiring'],
  ['docs', 'Docs & files'], ['vault', 'Vault'], ['companies', 'Companies'], ['constitution', 'Constitution'],
];

// ─── Small formatting helpers ──────────────────────────────────────────────────────────────────

/** "12 Mar" for an ISO date string, '' when empty. */
const formatShortDate = isoDate => isoDate
  ? new Date(isoDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  : '';

/** "12 Mar 2026" for a timestamp. */
const formatLongDate = timestamp => new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/** "just now", "5 min ago", "3h ago", "yesterday", "4 days ago". */
const timeAgo = timestamp => {
  const minutes = Math.round((Date.now() - timestamp) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return minutes + ' min ago';
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.round(hours / 24);
  return days === 1 ? 'yesterday' : days + ' days ago';
};

/** Short due label for a task: "No date", "3d late", "Today", "Tomorrow" or a date. */
const taskDueText = task => {
  const daysUntil = dayDiff(task.due);
  return !task.due ? 'No date'
    : daysUntil < 0 ? -daysUntil + 'd late'
      : daysUntil === 0 ? 'Today'
        : daysUntil === 1 ? 'Tomorrow'
          : formatShortDate(task.due);
};

/** Red when an open task is late, amber when due today/tomorrow, muted otherwise. */
const taskDueColor = task => {
  const daysUntil = dayDiff(task.due);
  return !task.done && daysUntil !== null && daysUntil < 0 ? RED
    : daysUntil === 0 || daysUntil === 1 ? 'oklch(0.5 0.13 60)'
      : MUTED;
};

/** Collapses a goal status into the buckets used by the status tiles and grouping. */
const goalBucket = status => status === 'On track' || status === 'In progress' ? 'track'
  : status === 'At risk' || status === 'Behind' ? 'attention'
    : status === 'Overdue' ? 'overdue'
      : status === 'Achieved' ? 'achieved'
        : 'notstarted';

const updateGoalField = (hq, goalId, field, value) => hq.upd(draft => {
  const goal = draft.goals.find(g => g.id === goalId);
  if (goal) goal[field] = value;
});

// ─── Popover menus (shared by the goals toolbar and the goal peek) ─────────────────────────────

/**
 * Registry of popover menus. `register` stores a menu's rows and title under `menuKey` and returns
 * the click handler that toggles it; the popover itself is rendered from `items[pop]` / `titles[pop]`.
 */
function createMenuRegistry(hq) {
  const items = {};
  const titles = {};

  // Opens below the clicked element, or above it when it sits near the bottom of the viewport.
  const opener = menuKey => event => {
    const zoom = hq._zoom || 1;
    const rawRect = event.currentTarget.getBoundingClientRect();
    const rect = { left: rawRect.left / zoom, top: rawRect.top / zoom, bottom: rawRect.bottom / zoom };
    const viewportHeight = window.innerHeight / zoom;
    const openUpwards = rect.bottom > viewportHeight - 300;
    hq.setState({
      pop: hq.state.pop === menuKey ? null : menuKey,
      popXY: {
        x: Math.max(8, Math.min(rect.left, window.innerWidth / zoom - 260)),
        top: openUpwards ? 'auto' : (rect.bottom + 4) + 'px',
        bottom: openUpwards ? (viewportHeight - rect.top + 4) + 'px' : 'auto',
      },
    });
  };

  /** options: [value, label, dot?, description?] */
  const register = (menuKey, title, options, current, onPick) => {
    items[menuKey] = options.map(([value, label, dot, desc]) => ({
      label,
      desc: desc || '',
      hasDesc: !!desc,
      dot: dot || '',
      hasDot: !!dot,
      mark: current === value ? '✓' : '',
      bg: current === value ? 'oklch(0.97 0.012 265)' : 'transparent',
      go: () => { hq.setState({ pop: null }); onPick(value); },
    }));
    titles[menuKey] = title;
    return opener(menuKey);
  };

  return { items, titles, register };
}

// ─── Today brief ───────────────────────────────────────────────────────────────────────────────

function buildBriefVM(hq, ctx) {
  const { data, me, now, myOpen, goalStats, taskItem } = ctx;

  // Team tasks assigned to or given by me: overdue ones I was given count as overdue, ones I gave that are
  // late are "waiting on <person>", and everything assigned to me by someone else is "waiting on you".
  // Before they load (or if they can't), there are none.
  const late = t => t.due && dayDiff(t.due) < 0;
  const byDue = (a, b) => a.due.localeCompare(b.due);
  const overdue = myOpen.filter(t => t.team.toMe && late(t)).sort(byDue);
  const dueToday = myOpen.filter(t => t.due && dayDiff(t.due) === 0);
  const waitingOnMe = myOpen.filter(t => t.team.toMe && !t.team.byMe);
  const waitingOnTeam = myOpen.filter(t => !t.team.toMe && late(t)).sort(byDue);
  // Proposed decisions, plus "Revisit" ones whose revisit date has arrived.
  const decisionsToMake = data.decisions.filter(d => d.status === 'Proposed' || (d.status === 'Revisit' && d.revisit && dayDiff(d.revisit) <= 0));
  const riskyGoals = data.goals.filter(g => NEEDS_ATTENTION.includes(goalStats[g.id].status));
  // Sales leads I own whose next follow-up is due today or late (portal leads, see leads/hqLeads).
  const leadsDue = hq.leadsAll().filter(l => l.open && l.seat === me && l.nextDate && dayDiff(l.nextDate) <= 0)
    .sort((a, b) => (a.nextAt || 0) - (b.nextAt || 0));

  /** One brief section: shows up to 5 items with a "See all" link. */
  const section = (label, dot, color, list, toItem, more) => ({
    label,
    dot,
    color,
    n: String(list.length),
    items: list.slice(0, 5).map(toItem),
    hasMore: list.length > 5,
    moreLabel: 'See all ' + list.length + ' →',
    more,
  });

  const decisionItem = decision => {
    const company = coOf(decision.co);
    return {
      title: decision.title || 'Untitled decision',
      chip: company.name,
      tint: company.tint,
      ink: company.ink,
      meta: decision.status === 'Revisit' ? 'Revisit due' : 'Proposed ' + timeAgo(decision.created),
      metaColor: MUTED,
      go: () => hq.go('decisions', { dopen: decision.id, dfilter: 'all' }),
    };
  };

  const goalItem = goal => {
    const company = coOf(goal.co), stats = goalStats[goal.id];
    return {
      title: goal.title || 'Untitled goal',
      chip: company.name,
      tint: company.tint,
      ink: company.ink,
      meta: stats.status + ' · ' + stats.pct + '%',
      metaColor: GST[stats.status].ink,
      go: () => hq.go('goals', { gopen: goal.id, gco: 'any' }),
    };
  };

  const leadItem = lead => {
    const company = coOf(lead.co), days = dayDiff(lead.nextDate);
    return {
      title: (lead.next || 'Follow up') + ' · ' + lead.name,
      chip: company.name,
      tint: company.tint,
      ink: company.ink,
      meta: days === 0 ? 'Follow-up today' : 'Follow-up ' + -days + 'd late',
      metaColor: days < 0 ? RED : AMBER,
      go: () => hq.openLead(lead.id),
    };
  };

  const sections = [
    section('Overdue', RED, RED, overdue, taskItem, () => hq.goTasks()),
    section('Due today', 'oklch(0.75 0.15 70)', 'oklch(0.45 0.11 65)', dueToday, taskItem, () => hq.goTasks()),
    section('Waiting on you', 'oklch(0.6 0.17 255)', 'oklch(0.4 0.14 255)', waitingOnMe,
      t => ({ ...taskItem(t), who: '', meta: 'from ' + t.team.otherFirst, metaColor: MUTED }),
      () => hq.goTasks()),
    section('Lead follow-ups', 'oklch(0.62 0.1 190)', 'oklch(0.4 0.09 190)', leadsDue, leadItem, () => hq.go('pipeline')),
    section('Decisions to make', 'oklch(0.75 0.15 70)', 'oklch(0.45 0.11 65)', decisionsToMake, decisionItem,
      () => hq.go('decisions', { dfilter: 'Proposed' })),
    section('Goals needing attention', RED, RED, riskyGoals, goalItem,
      () => hq.go('goals', { gco: 'any' })),
    section('Waiting on your team', RED, RED, waitingOnTeam,
      t => ({ ...taskItem(t), who: '', meta: 'waiting on ' + t.team.otherFirst, metaColor: RED }),
      () => hq.goTasks()),
  ].filter(s => s.items.length);

  const attentionCount = overdue.length + dueToday.length + waitingOnMe.length + leadsDue.length + decisionsToMake.length + riskyGoals.length + waitingOnTeam.length;

  // Seven-day strip starting today; clicking a day lists what is due that day.
  const nextSevenDays = [];
  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + offset);
    nextSevenDays.push(iso(date));
  }
  const selectedDay = hq.state.bday;
  const week = nextSevenDays.map((isoDay, offset) => {
    const dueTasks = myOpen.filter(t => t.due === isoDay), isSelected = selectedDay === isoDay, date = new Date(isoDay + 'T00:00:00');
    return {
      dow: offset === 0 ? 'Today' : date.toLocaleDateString('en-IN', { weekday: 'short' }),
      num: String(date.getDate()),
      n: dueTasks.length ? dueTasks.length + (dueTasks.length === 1 ? ' task' : ' tasks') : '',
      nColor: offset === 0 && dueTasks.length ? 'oklch(0.45 0.11 65)' : 'oklch(0.45 0.14 265)',
      fg: offset === 0 ? 'oklch(0.45 0.15 265)' : INK_C,
      bg: isSelected ? 'oklch(0.97 0.015 265)' : offset === 0 ? 'oklch(0.985 0.006 265)' : '#fff',
      bd: isSelected ? 'oklch(0.55 0.15 265)' : 'oklch(0.92 0.005 85)',
      tip: dueTasks.map(t => t.title).join(', ') || 'Nothing due',
      go: () => hq.setState({ bday: isSelected ? null : isoDay }),
    };
  });
  const selectedDayTasks = selectedDay ? myOpen.filter(t => t.due === selectedDay) : [];

  const feed = (data.activity || []).slice(0, 8).map(entry => {
    const person = PEOPLE[entry.by] || PEOPLE.both;
    return { ini: person.ini, bg: person.bg, name: entry.by === me ? 'You' : person.first, text: entry.text, when: timeAgo(entry.at) };
  });

  const companyCards = COS.map(company => buildCompanyCard(hq, ctx, company));

  return {
    sub: overdue.length + ' overdue · ' + dueToday.length + ' due today · ' + waitingOnMe.length + ' waiting on you',
    sections,
    allClear: !sections.length,
    count: String(attentionCount),
    countBg: attentionCount ? 'oklch(0.95 0.035 25)' : 'oklch(0.94 0.05 150)',
    countFg: attentionCount ? RED : 'oklch(0.4 0.1 150)',
    week,
    hasDay: !!selectedDay,
    dayLabel: selectedDay ? 'Due ' + new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }) : '',
    dayItems: selectedDayTasks.map(taskItem),
    dayEmpty: !selectedDayTasks.length,
    feed,
    noFeed: !feed.length,
    cos: companyCards,
  };
}

/** Per-company health card on the Today page (cash, runway, open team tasks of the company, goals, roles). */
function buildCompanyCard(hq, ctx, company) {
  const { data, allOpen, goalStats } = ctx;
  const finRecord = data.fin[company.id] || {}, fin = hq.calc(finRecord);
  const companyOpen = allOpen.filter(t => t.co === company.id);
  const companyOverdue = companyOpen.filter(t => t.due && dayDiff(t.due) < 0);
  const companyGoals = data.goals.filter(g => g.co === company.id);
  const avgGoalPct = companyGoals.length ? Math.round(companyGoals.reduce((sum, g) => sum + goalStats[g.id].pct, 0) / companyGoals.length) : null;
  const openRoles = data.roles.filter(r => r.co === company.id && r.stage !== 'Hired').length;
  const riskyGoalCount = companyGoals.filter(g => NEEDS_ATTENTION.includes(goalStats[g.id].status)).length;

  const issues = [];
  if (companyOverdue.length) issues.push(companyOverdue.length + ' overdue');
  if (riskyGoalCount) issues.push(riskyGoalCount + ' goal' + (riskyGoalCount > 1 ? 's' : '') + ' at risk');
  if (fin.months !== null && fin.months < 6) issues.push('runway under 6 months');
  const health = issues.length ? issues.join(' · ')
    : companyOpen.length || companyGoals.length || !fin.empty ? 'On track' : 'Nothing tracked yet';
  const healthColor = issues.length
    ? (companyOverdue.length || (fin.months !== null && fin.months < 6) ? RED : 'oklch(0.6 0.13 65)')
    : companyOpen.length || companyGoals.length ? 'oklch(0.5 0.13 150)' : MUTED;

  // Mariox only: total of the partner-portal request counters.
  const partnerRequestsStat = () => {
    const partnerCounts = hq.partner().n;
    const total = Object.values(partnerCounts).reduce((sum, count) => sum + (+count || 0), 0);
    return { label: 'Partner requests', value: String(total), color: total ? 'oklch(0.55 0.18 40)' : INK_C, go: () => hq.setState({ ptOpen: true }) };
  };

  return {
    ...company,
    live: !!company.live,
    soon: !company.live,
    health,
    healthColor,
    stats: [
      { label: 'Cash', value: fin.empty ? '—' : hq.money(finRecord.cash || 0), color: INK_C, go: () => hq.go('finance', { projCo: company.id }) },
      { label: 'Runway', value: fin.empty ? '—' : fin.runway, color: fin.empty ? MUTED : fin.runColor, go: () => hq.go('finance', { projCo: company.id }) },
      {
        label: 'Net / month',
        value: fin.empty ? '—' : hq.money(fin.net),
        color: fin.empty ? MUTED : fin.net < 0 ? RED : 'oklch(0.45 0.12 150)',
        go: () => hq.go('finance', { projCo: company.id }),
      },
      {
        label: 'Open tasks',
        value: String(companyOpen.length) + (companyOverdue.length ? ' · ' + companyOverdue.length + ' late' : ''),
        color: companyOverdue.length ? RED : INK_C,
        go: () => hq.goTasks(company.id),
      },
      { label: 'Goals', value: avgGoalPct === null ? '—' : avgGoalPct + '%', color: avgGoalPct === null ? MUTED : INK_C, go: () => hq.go('goals', { gco: company.id }) },
      ...(company.id === 'mariox' ? [partnerRequestsStat()] : []),
      { label: 'Open roles', value: String(openRoles), color: INK_C, go: () => hq.go('hiring') },
    ],
    goals: companyGoals.slice(0, 3).map(goal => {
      const stats = goalStats[goal.id];
      return {
        title: goal.title || 'Untitled goal',
        pct: stats.pct + '%',
        pctText: stats.pct + '%',
        color: GST[stats.status].dot,
        go: () => hq.go('goals', { gopen: goal.id, gco: company.id }),
      };
    }),
    noGoals: !companyGoals.length,
    addGoal: () => hq.newGoal(company.id),
    goTasks: () => hq.goTasks(company.id),
    go: () => hq.go('co', { coView: company.id }),
  };
}

// ─── Goals list ────────────────────────────────────────────────────────────────────────────────

function buildGoalsListVM(hq, ctx, menus) {
  const { data, now, goalStats, monthEnd, quarterEnd } = ctx;
  const companyFilter = hq.state.gco, filters = hq.state.gf;

  /** Target date label; the year is shown only when it differs from the current one. */
  const formatTargetDate = isoDate => isoDate
    ? new Date(isoDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: new Date(isoDate).getFullYear() === now.getFullYear() ? undefined : 'numeric' })
    : '';
  const dueWindowOf = goal => !goal.target ? 'nodate' : goal.target <= monthEnd ? 'month' : goal.target <= quarterEnd ? 'quarter' : 'later';
  const bucketOf = goal => goalBucket(goalStats[goal.id].status);

  // Everything except the status filter applies to the tile counts; the status filter only to what is shown.
  const query = (filters.q || '').trim().toLowerCase();
  const goalsInScope = data.goals.filter(goal =>
    (companyFilter === 'any' || goal.co === companyFilter)
    && (filters.owner === 'any' || goal.owner === filters.owner)
    && (filters.when === 'any' || dueWindowOf(goal) === filters.when || (filters.when === 'quarter' && dueWindowOf(goal) === 'month'))
    && (!query || ((goal.title || '') + ' ' + (goal.notes || '')).toLowerCase().includes(query)));
  const visibleGoals = goalsInScope.filter(goal => filters.status === 'any' || bucketOf(goal) === filters.status);

  const compareGoals = {
    target: (a, b) => (a.target || '9999').localeCompare(b.target || '9999'),
    attention: (a, b) => GOAL_STATUS_RANK[goalStats[a.id].status] - GOAL_STATUS_RANK[goalStats[b.id].status],
    low: (a, b) => goalStats[a.id].pct - goalStats[b.id].pct,
    high: (a, b) => goalStats[b.id].pct - goalStats[a.id].pct,
    newest: (a, b) => (b.created || 0) - (a.created || 0),
    name: (a, b) => (a.title || '').localeCompare(b.title || ''),
  }[hq.state.gsort] || (() => 0);

  const goalCard = goal => {
    const stats = goalStats[goal.id], company = coOf(goal.co), owner = PEOPLE[goal.owner] || PEOPLE.both;
    const statusStyle = GST[stats.status], daysLeft = stats.daysLeft;
    const nextTasks = stats.linked.filter(t => !t.done).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999')).slice(0, 2);
    return {
      id: goal.id,
      titleOr: goal.title || 'Untitled goal',
      titleColor: goal.title ? INK_C : 'oklch(0.62 0.01 265)',
      coName: company.name,
      coTint: company.tint,
      coInk: company.ink,
      ownerIni: owner.ini,
      ownerBg: owner.bg,
      stLabel: stats.status,
      stTint: statusStyle.tint,
      stInk: statusStyle.ink,
      stDot: statusStyle.dot,
      pct: stats.pct + '%',
      hasExp: stats.exp !== null && stats.status !== 'Achieved',
      expPos: (stats.exp || 0) + '%',
      basis: stats.basis,
      explain: stats.explain,
      dueText: !goal.target ? 'No target date'
        : stats.status === 'Achieved' ? 'Due ' + formatTargetDate(goal.target)
          : daysLeft < 0 ? -daysLeft + ' days overdue'
            : daysLeft === 0 ? 'Due today'
              : daysLeft + ' days left · ' + formatTargetDate(goal.target),
      dueColor: !goal.target ? 'oklch(0.65 0.01 265)'
        : daysLeft < 0 && stats.status !== 'Achieved' ? RED
          : daysLeft !== null && daysLeft <= 7 && stats.status !== 'Achieved' ? 'oklch(0.5 0.13 60)'
            : 'oklch(0.4 0.012 265)',
      hasNext: !!nextTasks.length,
      next: nextTasks.map(t => ({ title: t.title || 'Untitled task', due: taskDueText(t), dueColor: taskDueColor(t) })),
      open: () => hq.setState({ gopen: goal.id, pop: null, gupd: { val: '', note: '' } }),
    };
  };

  // Group definitions: each has a predicate (`test`) and, for company groups, the company preset for "+ Add".
  const grouping = hq.state.ggroup;
  const groupDefs = grouping === 'company'
    ? COS.map(company => ({ key: company.id, label: company.full, hasTile: true, tile: company.bg, ini: company.ini, hasDot: false, dot: '', test: g => g.co === company.id, preset: company.id }))
    : grouping === 'status'
      ? [
        ['attention', 'Needs attention', GST.Behind.dot],
        ['overdue', 'Overdue', GST.Overdue.dot],
        ['track', 'On track', GST['On track'].dot],
        ['notstarted', 'Not started', GST['Not started'].dot],
        ['achieved', 'Achieved', GST.Achieved.dot],
      ].map(([bucket, label, dot]) => ({ key: bucket, label, hasTile: false, hasDot: true, dot, tile: '', ini: '', test: g => bucketOf(g) === bucket }))
      : grouping === 'owner'
        ? OWNER_OPTS.map(([ownerId, label]) => ({ key: ownerId, label: label === 'Both' ? PEOPLE.both.name : label, hasTile: false, hasDot: true, dot: PEOPLE[ownerId].bg, tile: '', ini: '', test: g => g.owner === ownerId }))
        : [{ key: 'all', label: '', hasTile: false, hasDot: false, dot: '', tile: '', ini: '', test: () => true }];

  const goalGroups = groupDefs
    .map(def => {
      const items = visibleGoals.filter(def.test).sort(compareGoals);
      const avgPct = items.length ? Math.round(items.reduce((sum, g) => sum + goalStats[g.id].pct, 0) / items.length) : 0;
      return {
        label: def.label,
        hasTile: def.hasTile,
        tile: def.tile,
        ini: def.ini,
        hasDot: def.hasDot,
        dot: def.dot,
        showHead: grouping !== 'none',
        n: items.length,
        meta: items.length ? items.length + (items.length === 1 ? ' goal' : ' goals') + ' · ' + avgPct + '% average' : 'No goals yet',
        items: items.map(goalCard),
        empty: !items.length,
        emptyText: grouping === 'company' ? '+ Set a goal for ' + def.label : '+ Add a goal',
        add: () => hq.newGoal(def.preset || (companyFilter !== 'any' ? companyFilter : 'mariox')),
      };
    })
    // Empty company groups stay visible (as an "add" prompt) only when nothing but the company is filtered.
    .filter(group => group.n || (grouping === 'company' && filters.status === 'any' && !query && filters.owner === 'any' && filters.when === 'any'
      && (companyFilter === 'any' || groupDefs.find(def => def.label === group.label && def.preset === companyFilter))));

  // Templates
  const templateMenuOptions = () => GOAL_TEMPLATES.map(([templateId, label]) => [
    templateId,
    label,
    '',
    templateId === 'blank' ? 'Progress from linked tasks'
      : GOAL_TEMPLATES.find(t => t[0] === templateId)[3].startsWith('number') ? 'Track a number'
        : 'Progress from linked tasks',
  ]);
  const startFromTemplate = (templateId, companyId) => {
    const template = GOAL_TEMPLATES.find(t => t[0] === templateId);
    const [measure, unit] = (template[3] || 'tasks|').split('|');
    hq.newGoal(companyId, templateId === 'blank' ? {} : { title: template[2], measure, unit });
  };

  const statusTileDefs = [
    ['any', 'All goals', 'oklch(0.55 0.02 265)', goalsInScope.length],
    ['track', 'On track', GST['On track'].dot, goalsInScope.filter(g => bucketOf(g) === 'track').length],
    ['attention', 'Needs attention', GST.Behind.dot, goalsInScope.filter(g => bucketOf(g) === 'attention').length],
    ['overdue', 'Overdue', GST.Overdue.dot, goalsInScope.filter(g => bucketOf(g) === 'overdue').length],
    ['achieved', 'Achieved', GST.Achieved.dot, goalsInScope.filter(g => bucketOf(g) === 'achieved').length],
  ];

  /** Toolbar filter pill that opens a popover menu. Menu keys look like 'g:owner' (filter field after 'g:'). */
  const filterButton = (menuKey, name, current, anyValue, options) => {
    const isActive = current !== anyValue;
    const currentLabel = (options.find(o => o[0] === current) || [undefined, ''])[1];
    return {
      label: isActive ? name + ': ' + currentLabel : name,
      bg: isActive ? 'oklch(0.96 0.025 265)' : '#fff',
      bd: isActive ? 'oklch(0.8 0.06 265)' : 'oklch(0.9 0.006 85)',
      fg: isActive ? 'oklch(0.38 0.14 265)' : 'oklch(0.35 0.012 265)',
      go: menus.register(menuKey, name, options, current,
        value => menuKey === 'g:co' ? hq.setState({ gco: value }) : hq.setState({ gf: { ...hq.state.gf, [menuKey.slice(2)]: value } })),
    };
  };
  const companyOptions = [['any', 'All companies'], ...COS.map(c => [c.id, c.full, c.bg])];
  const ownerOptions = [['any', 'Anyone'], ['rahul', PEOPLE.rahul.first, PEOPLE.rahul.bg], ['saswat', PEOPLE.saswat.first, PEOPLE.saswat.bg], ['both', 'Both', PEOPLE.both.bg]];

  /** View preferences (group / sort / layout) persist in localStorage. */
  const savePref = (stateKey, value) => {
    localStorage.setItem(KEY + '-' + stateKey, value);
    hq.setState({ [stateKey]: value });
  };
  const hasAnyFilter = companyFilter !== 'any' || filters.status !== 'any' || filters.owner !== 'any' || filters.when !== 'any' || !!query;

  return {
    newMenu: menus.register('g:new', 'Start from', templateMenuOptions(), '', templateId => startFromTemplate(templateId, companyFilter !== 'any' ? companyFilter : 'mariox')),
    templates: GOAL_TEMPLATES.map(([templateId, label]) => ({ label, go: () => startFromTemplate(templateId, companyFilter !== 'any' ? companyFilter : 'mariox') })),
    tiles: statusTileDefs.map(([bucket, label, dot, count]) => {
      const isActive = filters.status === bucket;
      return {
        label,
        dot,
        n: String(count),
        tip: GOAL_TILE_TIPS[bucket],
        color: (bucket === 'overdue' || bucket === 'attention') && count ? RED : INK_C,
        bg: isActive ? 'oklch(0.97 0.015 265)' : '#fff',
        bd: isActive ? 'oklch(0.55 0.15 265)' : 'oklch(0.915 0.006 85)',
        go: () => hq.setState({ gf: { ...filters, status: isActive && bucket !== 'any' ? 'any' : bucket } }),
      };
    }),
    filters: [
      filterButton('g:co', 'Company', companyFilter, 'any', companyOptions),
      filterButton('g:owner', 'Owner', filters.owner, 'any', ownerOptions),
      filterButton('g:when', 'Due', filters.when, 'any', GOAL_WHEN_OPTIONS),
    ],
    viewOpts: [
      {
        label: 'Group: ' + GOAL_GROUP_OPTIONS.find(o => o[0] === grouping)[1],
        bg: '#fff',
        bd: 'oklch(0.9 0.006 85)',
        fg: 'oklch(0.35 0.012 265)',
        go: menus.register('g:group', 'Group goals by', GOAL_GROUP_OPTIONS, grouping, value => savePref('ggroup', value)),
      },
      {
        label: 'Sort: ' + GOAL_SORT_OPTIONS.find(o => o[0] === hq.state.gsort)[1].replace(/ \(.*\)/, ''),
        bg: '#fff',
        bd: 'oklch(0.9 0.006 85)',
        fg: 'oklch(0.35 0.012 265)',
        go: menus.register('g:sort', 'Sort goals by', GOAL_SORT_OPTIONS, hq.state.gsort, value => savePref('gsort', value)),
      },
    ],
    viewSeg: segOf([['cards', 'Cards'], ['list', 'List']], hq.state.gview, value => savePref('gview', value)),
    isCards: hq.state.gview !== 'list',
    isList: hq.state.gview === 'list',
    q: filters.q || '',
    onQ: e => hq.setState({ gf: { ...hq.state.gf, q: e.target.value } }),
    anyFilter: hasAnyFilter,
    clear: () => hq.setState({ gco: 'any', gf: { status: 'any', owner: 'any', when: 'any', q: '' } }),
    groups: data.goals.length ? goalGroups : [],
    empty: !data.goals.length,
    noResults: !!data.goals.length && !visibleGoals.length,
  };
}

// ─── Goal peek panel ───────────────────────────────────────────────────────────────────────────

function buildGoalPeekVM(hq, ctx, menus, goal) {
  const { me, now, goalStats, openTask, monthEnd, quarterEnd } = ctx;
  const stats = goalStats[goal.id], company = coOf(goal.co), statusStyle = GST[stats.status], daysLeft = stats.daysLeft;
  const goalId = goal.id, pageId = 'goal:' + goalId, doc = hq.getDoc(pageId), updateDraft = hq.state.gupd;
  const setField = (field, value) => updateGoalField(hq, goalId, field, value);

  /** Posts a check-in: a new number (for number goals) and/or a note. */
  const postUpdate = () => {
    const isNumber = goal.measure === 'number';
    const value = updateDraft.val === '' ? null : Number(updateDraft.val);
    const note = (updateDraft.note || '').trim();
    if ((isNumber ? value === null : true) && !note) return;
    hq.upd(draft => {
      const target = draft.goals.find(g => g.id === goalId);
      if (!target) return;
      if (isNumber && value !== null) target.current = value;
      target.checkins = [...(target.checkins || []), { id: uid(), at: Date.now(), by: me, value: isNumber ? value : null, note }];
      act(draft, me,
        'posted an update on goal “' + (target.title || 'Untitled') + '”'
          + (isNumber && value !== null ? ': now ' + value.toLocaleString('en-IN') + (target.unit ? ' ' + target.unit : '') : ''),
        target.co);
    });
    hq.setState({ gupd: { val: '', note: '' } });
  };

  // Open team tasks of the same company that could be linked to this goal.
  const linkCandidates = ctx.tasks.filter(t => !t.done && t.goal !== goalId && t.co === goal.co);
  const isoDaysFromNow = days => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return iso(date);
  };

  const linkedTaskRow = task => {
    return {
      title: task.title || 'Untitled task',
      open: () => openTask(task.id),
      toggle: () => hq.toggleTask(task),
      mark: task.done ? '✓' : '',
      checkBg: task.done ? 'oklch(0.55 0.14 150)' : '#fff',
      checkBorder: task.done ? 'oklch(0.55 0.14 150)' : 'oklch(0.75 0.01 265)',
      deco: task.done ? 'line-through' : 'none',
      color: task.done ? MUTED : INK_C,
      ownerBg: 'oklch(0.55 0.1 265)',
      ownerIni: initialsOf(task.assignee || '?'),
      dueText: taskDueText(task),
      dueColor: taskDueColor(task),
      unlink: () => hq.setTaskLink(task.id, 'goal', ''),
    };
  };

  const checkinRow = checkin => {
    const author = PEOPLE[checkin.by] || PEOPLE.both;
    const hasValue = checkin.value !== null && checkin.value !== undefined;
    return {
      ini: author.ini,
      bg: author.bg,
      name: author.first,
      when: timeAgo(checkin.at),
      text: (hasValue ? 'Updated to ' + Number(checkin.value).toLocaleString('en-IN') + (goal.unit ? ' ' + goal.unit : '') + (checkin.note ? '. ' : '') : '') + (checkin.note || ''),
      remove: () => hq.upd(draft => {
        const target = draft.goals.find(g => g.id === goalId);
        target.checkins = (target.checkins || []).filter(c => c.id !== checkin.id);
      }),
    };
  };

  // "Make it a task": a team task for me in the goal's company, linked to the goal.
  const addTask = () => hq.makeTeamTask(
    { title: 'Next step: ' + (goal.title || 'goal'), co: goal.co, due: goal.target || '', pri: 'Medium', from: 'the goal “' + (goal.title || 'Untitled goal') + '”' },
    { goal: goalId },
  );

  const removeGoal = () => {
    if (confirm('Delete this goal? Linked tasks stay.')) {
      hq.upd(draft => {
        draft.goals = draft.goals.filter(g => g.id !== goalId);
        Object.values(draft.ttLinks || {}).forEach(link => { if (link.goal === goalId) delete link.goal; });
      });
      hq.setState({ gopen: null });
    }
  };

  return {
    id: goalId,
    title: goal.title || '',
    onTitle: e => setField('title', e.target.value.replace(/\n/g, ' ')),
    coName: company.name,
    coTint: company.tint,
    coInk: company.ink,
    stLabel: stats.status,
    stTint: statusStyle.tint,
    stInk: statusStyle.ink,
    stDot: statusStyle.dot,
    pct: stats.pct + '%',
    hasExp: stats.exp !== null && stats.status !== 'Achieved',
    expPos: (stats.exp || 0) + '%',
    basis: stats.basis,
    explain: stats.explain,
    dueText: !goal.target ? 'No target date' : daysLeft < 0 ? -daysLeft + ' days overdue' : daysLeft === 0 ? 'Due today' : daysLeft + ' days left',
    dueColor: !goal.target ? MUTED : daysLeft < 0 && stats.status !== 'Achieved' ? RED : 'oklch(0.35 0.012 265)',
    coSeg: segOf(CO_OPTS.filter(o => o[0] !== 'all'), goal.co, value => setField('co', value)),
    ownerSeg: segOf(OWNER_OPTS, goal.owner, value => setField('owner', value)),
    start: goal.start || '',
    onStart: e => setField('start', e.target.value),
    target: goal.target || '',
    onTarget: e => setField('target', e.target.value),
    quickDates: [['End of month', monthEnd], ['End of quarter', quarterEnd], ['In 90 days', isoDaysFromNow(90)]]
      .map(([label, isoDate]) => ({ label, go: () => setField('target', isoDate) })),
    measureSeg: segOf([['tasks', 'Linked tasks'], ['number', 'A number']], goal.measure || 'tasks', value => setField('measure', value)),
    isNumber: goal.measure === 'number',
    measureHelp: goal.measure === 'number'
      ? 'Progress = current ÷ target. Post updates below as the number moves.'
      : 'Progress = share of linked tasks marked Done.',
    current: goal.current ? String(goal.current) : '',
    onCurrent: e => setField('current', Number(e.target.value) || 0),
    goalVal: goal.goalVal ? String(goal.goalVal) : '',
    onGoalVal: e => setField('goalVal', Number(e.target.value) || 0),
    unit: goal.unit || '',
    onUnit: e => setField('unit', e.target.value),
    linkInfo: stats.linked.length ? stats.doneN + ' of ' + stats.linked.length + ' done' : '',
    // Open tasks first, then by due date (sorts the linked list in place, as before).
    tasks: stats.linked
      .sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0) || (a.due || '9999').localeCompare(b.due || '9999'))
      .map(linkedTaskRow),
    noTasks: !stats.linked.length,
    noTasksText: goal.measure === 'number'
      ? 'Optional: add the tasks that will move this number.'
      : 'Break the goal into tasks. Progress fills in as they get done.',
    addTask,
    linkMenu: menus.register(
      'g:link:' + goalId,
      linkCandidates.length ? 'Link an open ' + company.name + ' task' : 'No other open tasks for ' + company.name,
      linkCandidates.length
        ? linkCandidates.map(t => [t.id, t.title || 'Untitled task', (STATUS[t.status] || STATUS['Not started']).dot, t.goal ? 'Moves it from another goal' : ''])
        : [['', 'Create one with + New task']],
      '',
      taskId => taskId && hq.setTaskLink(taskId, 'goal', goalId)),
    updVal: updateDraft.val,
    onUpdVal: e => hq.setState({ gupd: { ...hq.state.gupd, val: e.target.value } }),
    updNote: updateDraft.note,
    onUpdNote: e => hq.setState({ gupd: { ...hq.state.gupd, note: e.target.value } }),
    onUpdKey: e => { if (e.key === 'Enter') { e.preventDefault(); postUpdate(); } },
    postUpd: postUpdate,
    checkins: (goal.checkins || []).slice().reverse().map(checkinRow),
    noCheckins: !(goal.checkins || []).length,
    blocks: hq.blocksVM(pageId, doc.blocks),
    addBlockEnd: () => hq.addBlockEnd(pageId),
    created: 'Created ' + new Date(goal.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    close: () => hq.setState({ gopen: null, pop: null }),
    remove: removeGoal,
  };
}

// ─── Decisions ─────────────────────────────────────────────────────────────────────────────────

function buildDecisionsVM(hq, ctx) {
  const { data, me } = ctx;
  const filters = hq.state.dx || DX_DEF, query = (filters.q || '').trim().toLowerCase();
  const patchFilters = patch => hq.setState({ dx: { ...hq.state.dx, ...patch } });

  const updateDecision = (id, mutate) => hq.upd(draft => {
    const decision = draft.decisions.find(d => d.id === id);
    if (decision) mutate(decision, draft);
  });
  /** Sets one field; status changes are also written to the decision's log (and the activity feed when decided). */
  const setDecisionField = (id, field, value) => updateDecision(id, (decision, draft) => {
    const previous = decision[field];
    decision[field] = value;
    if (field === 'status' && previous !== value) {
      decision.log = [...(decision.log || []), { at: Date.now(), by: me, text: 'Status: ' + (DST_LABEL[previous] || previous) + ' → ' + (DST_LABEL[value] || value) }];
      if (value === 'Decided') {
        decision.decidedAt = Date.now();
        act(draft, me, 'marked decided: “' + (decision.title || 'Untitled') + '”', decision.co);
      }
    }
  });

  const followUpsOf = id => ctx.tasks.filter(t => t.dec === id);
  const isPastDecideBy = d => d.status === 'Proposed' && d.due && dayDiff(d.due) < 0;
  const isDueForRevisit = d => d.status !== 'Dropped' && ((d.status === 'Revisit') || (d.revisit && dayDiff(d.revisit) <= 7));
  const withinLast30Days = timestamp => timestamp && Date.now() - timestamp < 30 * DAY_MS;
  const matchesWhen = (d, when) => when === 'any' ? true
    : when === 'overdue' ? isPastDecideBy(d)
      : when === 'week' ? d.status === 'Proposed' && d.due && dayDiff(d.due) >= 0 && dayDiff(d.due) <= 7
        : when === 'revisit' ? isDueForRevisit(d)
          : when === 'logged30' ? withinLast30Days(d.created)
            : when === 'decided30' ? d.status === 'Decided' && withinLast30Days(d.decidedAt)
              : when === 'nofollow' ? d.status === 'Decided' && !followUpsOf(d.id).length
                : true;
  const searchableText = d => [
    d.title, d.context, d.options, d.outcome,
    ...(d.opts || []).map(o => o.text + ' ' + (o.notes || '')),
    ...(d.comments || []).map(c => c.text),
  ].join(' ').toLowerCase();

  // The company tab scopes the tile counts; the other filters narrow the list.
  const decisionsInCompany = data.decisions.filter(d => (filters.co === 'any' || d.co === filters.co));
  const visibleDecisions = decisionsInCompany.filter(d =>
    (filters.status === 'all' || d.status === filters.status)
    && (filters.by === 'any' || d.by === filters.by)
    && (filters.impact === 'any' || (d.impact || 'Medium') === filters.impact)
    && matchesWhen(d, filters.when)
    && (!query || searchableText(d).includes(query)));

  const compareDecisions = {
    newest: (a, b) => (b.created || 0) - (a.created || 0),
    oldest: (a, b) => (a.created || 0) - (b.created || 0),
    due: (a, b) => (a.due || '9999').localeCompare(b.due || '9999'),
    decided: (a, b) => (b.decidedAt || 0) - (a.decidedAt || 0),
    impact: (a, b) => (IMPACT_RANK[a.impact || 'Medium']) - (IMPACT_RANK[b.impact || 'Medium']) || (b.created || 0) - (a.created || 0),
    name: (a, b) => (a.title || '').localeCompare(b.title || ''),
  }[filters.sort] || (() => 0);

  const decisionRow = d => {
    const company = coOf(d.co), owner = PEOPLE[d.by] || PEOPLE.both, statusStyle = DST[d.status] || DST.Proposed, impact = IMPACT[d.impact || 'Medium'];
    const followUps = followUpsOf(d.id), followUpsDone = followUps.filter(t => t.done).length;
    const isLate = isPastDecideBy(d), daysUntilDue = dayDiff(d.due);
    const dateText = d.status === 'Decided' && d.decidedAt ? 'Decided ' + formatShortDate(iso(new Date(d.decidedAt)))
      : d.status === 'Revisit' || (d.revisit && d.status !== 'Proposed') ? (d.revisit ? 'Revisit ' + formatShortDate(d.revisit) : 'Revisit')
        : d.due ? (isLate ? 'Decide by ' + formatShortDate(d.due) + ' · late' : daysUntilDue === 0 ? 'Decide today' : 'Decide by ' + formatShortDate(d.due))
          : 'Logged ' + timeAgo(d.created);
    const commentCount = (d.comments || []).length;
    return {
      id: d.id,
      titleOr: d.title || 'Untitled decision',
      titleColor: d.title ? INK_C : 'oklch(0.65 0.01 265)',
      stLabel: DST_LABEL[d.status] || d.status,
      stTint: statusStyle.tint,
      stInk: statusStyle.ink,
      stDot: statusStyle.dot,
      impLabel: (d.impact || 'Medium') + ' impact',
      impTint: impact.tint,
      impInk: impact.ink,
      coName: company.name,
      coTint: company.tint,
      coInk: company.ink,
      byIni: owner.ini,
      byBg: owner.bg,
      byName: owner.first,
      dateText,
      dateColor: isLate ? RED : 'oklch(0.52 0.012 265)',
      dateWeight: isLate ? '600' : '400',
      hasFol: !!followUps.length,
      folText: followUpsDone + '/' + followUps.length + ' follow-ups',
      hasCm: !!commentCount,
      cmText: commentCount + (commentCount === 1 ? ' comment' : ' comments'),
      hasSummary: d.status === 'Decided' && !!d.outcome,
      summary: d.outcome || '',
      selBg: hq.state.dopen === d.id ? 'color-mix(in oklch, var(--acc) 6%, #fff)' : '#fff',
      go: () => hq.setState({ dopen: d.id, dcdraft: '' }),
    };
  };

  // groupOf: decision → group value; options: [value, label, dot].
  const groupDef = {
    status: {
      groupOf: d => d.status,
      options: [['Proposed', DST_LABEL.Proposed, DST.Proposed.dot], ['Revisit', 'Revisit', DST.Revisit.dot], ['Decided', 'Decided', DST.Decided.dot], ['Dropped', 'Not doing', DST.Dropped.dot]],
    },
    company: { groupOf: d => d.co, options: CO_OPTS.map(([coId, label]) => [coId, label, coOf(coId).bg || 'oklch(0.6 0.01 265)']) },
    owner: { groupOf: d => d.by, options: OWNER_OPTS.map(([ownerId, label]) => [ownerId, label === 'Both' ? PEOPLE.both.name : label, PEOPLE[ownerId].bg]) },
    impact: {
      groupOf: d => d.impact || 'Medium',
      options: [['High', 'High impact', IMPACT.High.dot], ['Medium', 'Medium impact', IMPACT.Medium.dot], ['Low', 'Low impact', IMPACT.Low.dot]],
    },
    none: { groupOf: () => 'all', options: [['all', 'All decisions', 'oklch(0.6 0.01 265)']] },
  }[filters.group] || null;

  const decisionGroups = groupDef.options
    .map(([value, label, dot]) => {
      const groupDecisions = visibleDecisions.filter(d => groupDef.groupOf(d) === value).sort(compareDecisions);
      const collapseKey = filters.group + ':' + value, isOpen = !hq.state.dgcol[collapseKey];
      return {
        label,
        dot,
        n: groupDecisions.length,
        count: groupDecisions.length + (groupDecisions.length === 1 ? ' decision' : ' decisions'),
        open: isOpen,
        caret: isOpen ? '▼' : '▶',
        showHead: filters.group !== 'none',
        toggle: () => hq.setState({ dgcol: { ...hq.state.dgcol, [collapseKey]: !hq.state.dgcol[collapseKey] } }),
        rows: groupDecisions.map(decisionRow),
      };
    })
    .filter(group => group.n);

  // [value, filter field it sets, label, dot, count, tooltip]
  const tiles = [
    ['Proposed', 'status', 'Needs a decision', DST.Proposed.dot, decisionsInCompany.filter(d => d.status === 'Proposed').length, 'Open questions waiting for you two'],
    ['overdue', 'when', 'Past decide-by date', RED, decisionsInCompany.filter(isPastDecideBy).length, 'Should already have been decided'],
    ['revisit', 'when', 'Due for revisit', DST.Revisit.dot, decisionsInCompany.filter(isDueForRevisit).length, 'Marked Revisit, or revisit date within 7 days'],
    ['Decided', 'status', 'Decided', DST.Decided.dot, decisionsInCompany.filter(d => d.status === 'Decided').length, 'All settled decisions'],
    ['decided30', 'when', 'Decided last 30 days', 'oklch(0.6 0.13 265)', decisionsInCompany.filter(d => d.status === 'Decided' && withinLast30Days(d.decidedAt)).length, 'Recently settled'],
  ].map(([value, field, label, dot, count, tip]) => {
    const isActive = filters[field] === value;
    return {
      label,
      dot,
      n: String(count),
      tip,
      color: value === 'overdue' && count ? RED : INK_C,
      bg: isActive ? 'color-mix(in oklch, var(--acc) 6%, #fff)' : '#fff',
      bd: isActive ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.915 0.006 85)',
      // A status tile clears the "when" filter and vice versa; clicking an active tile resets it.
      go: () => patchFilters(field === 'status' ? { status: isActive ? 'all' : value, when: 'any' } : { when: isActive ? 'any' : value, status: 'all' }),
    };
  });

  /** <select> filter; group and sort choices are remembered in localStorage. */
  const filterSelect = (field, defaultValue, options) => {
    const isActive = filters[field] !== defaultValue;
    return {
      value: filters[field],
      onChange: e => {
        patchFilters({ [field]: e.target.value });
        if (field === 'sort' || field === 'group') localStorage.setItem(KEY + '-d' + field, e.target.value);
      },
      opts: options.map(([value, label]) => ({ v: value, l: label })),
      bg: isActive ? 'color-mix(in oklch, var(--acc) 8%, #fff)' : '#fff',
      bd: isActive ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.9 0.006 85)',
      fg: isActive ? 'var(--acc2, oklch(0.42 0.17 265))' : 'oklch(0.35 0.012 265)',
    };
  };
  const hasAnyFilter = filters.status !== 'all' || filters.by !== 'any' || filters.impact !== 'any' || filters.when !== 'any' || !!query;

  /** Plain-text export of one decision (used by "Copy" and "Copy list"). */
  const decisionAsText = d => [
    (d.title || 'Untitled decision') + ' [' + (DST_LABEL[d.status] || d.status) + ' · ' + coOf(d.co).name + ' · ' + (d.impact || 'Medium') + ' impact]',
    d.context ? 'Context: ' + d.context : '',
    (d.opts || []).length ? 'Options: ' + d.opts.map(o => (o.id === d.chosen ? '✓ ' : '') + o.text).join(' / ') : '',
    d.outcome ? 'Decision: ' + d.outcome : '',
  ].filter(Boolean).join('\n');

  const list = {
    sub: data.decisions.filter(d => d.status === 'Proposed').length + ' waiting for a decision · ' + data.decisions.filter(d => d.status === 'Decided').length + ' decided',
    add: () => hq.newDecision(''),
    q: filters.q || '',
    onQ: e => patchFilters({ q: e.target.value }),
    tiles,
    coTabs: [['any', 'All'], ...CO_OPTS].map(([coId, label]) => {
      const company = coOf(coId), isActive = filters.co === coId;
      return {
        label,
        n: String(data.decisions.filter(d => (coId === 'any' || d.co === coId) && d.status === 'Proposed').length),
        hasTile: !!company.bg && coId !== 'any',
        tile: company.bg || '',
        ini: company.ini || '',
        fg: isActive ? INK_C : MUTED,
        bd: isActive ? INK_C : 'transparent',
        go: () => patchFilters({ co: coId }),
      };
    }),
    filters: [
      filterSelect('status', 'all', [['all', 'Any status'], ['Proposed', 'Status: Needs decision'], ['Decided', 'Status: Decided'], ['Revisit', 'Status: Revisit'], ['Dropped', 'Status: Not doing']]),
      filterSelect('by', 'any', [['any', 'Any owner'], ['rahul', 'Owner: ' + PEOPLE.rahul.first], ['saswat', 'Owner: ' + PEOPLE.saswat.first], ['both', 'Owner: Both']]),
      filterSelect('impact', 'any', [['any', 'Any impact'], ['High', 'Impact: High'], ['Medium', 'Impact: Medium'], ['Low', 'Impact: Low']]),
      filterSelect('when', 'any', [
        ['any', 'Any time'], ['overdue', 'Past decide-by date'], ['week', 'Decide in next 7 days'], ['revisit', 'Due for revisit'],
        ['logged30', 'Logged in last 30 days'], ['decided30', 'Decided in last 30 days'], ['nofollow', 'Decided, no follow-up yet'],
      ]),
    ],
    // '__' as the default means these selects never render as "active".
    viewSel: [
      filterSelect('group', '__', [['status', 'Group: Status'], ['company', 'Group: Company'], ['owner', 'Group: Owner'], ['impact', 'Group: Impact'], ['none', 'No grouping']]),
      filterSelect('sort', '__', [
        ['newest', 'Sort: Newest first'], ['oldest', 'Sort: Oldest first'], ['due', 'Sort: Decide-by date'],
        ['decided', 'Sort: Recently decided'], ['impact', 'Sort: Impact'], ['name', 'Sort: Name A–Z'],
      ]),
    ].map(select => ({ ...select, bg: '#fff', bd: 'oklch(0.9 0.006 85)', fg: 'oklch(0.35 0.012 265)' })),
    anyFilter: hasAnyFilter,
    clear: () => patchFilters({ status: 'all', by: 'any', impact: 'any', when: 'any', q: '' }),
    groups: decisionGroups,
    shown: visibleDecisions.length + (visibleDecisions.length === 1 ? ' decision' : ' decisions') + (hasAnyFilter ? ' match' : ''),
    copyList: () => {
      if (navigator.clipboard) navigator.clipboard.writeText(visibleDecisions.sort(compareDecisions).map(decisionAsText).join('\n\n'));
      hq.toastMsg('Copied ' + visibleDecisions.length + ' decisions as text');
    },
    empty: !visibleDecisions.length,
    emptyTitle: data.decisions.length ? 'No decisions match these filters' : 'No decisions logged yet',
    emptyFilter: !!data.decisions.length && hasAnyFilter,
  };

  const openDecision = data.decisions.find(d => d.id === hq.state.dopen);
  const panel = openDecision
    ? buildDecisionPanelVM(hq, ctx, openDecision, { decisionGroups, followUpsOf, isPastDecideBy, updateDecision, setDecisionField, decisionAsText })
    : { close: () => hq.setState({ dopen: null }) };
  list.dp = panel;
  list.hasDP = !!openDecision;
  return list;
}

function buildDecisionPanelVM(hq, ctx, decision, helpers) {
  const { me } = ctx;
  const { decisionGroups, followUpsOf, isPastDecideBy, updateDecision, setDecisionField, decisionAsText } = helpers;
  const id = decision.id, statusStyle = DST[decision.status] || DST.Proposed, followUps = followUpsOf(id), isLate = isPastDecideBy(decision);

  // Prev / next follow the order of the visible list.
  const rowOrder = decisionGroups.flatMap(g => g.rows.map(r => r.id)), position = rowOrder.indexOf(id);
  const prevId = position > 0 ? rowOrder[position - 1] : null;
  const nextId = position > -1 && position < rowOrder.length - 1 ? rowOrder[position + 1] : null;
  const setField = (field, value) => setDecisionField(id, field, value);

  const postComment = () => {
    const text = (hq.state.dcdraft || '').trim();
    if (!text) return;
    updateDecision(id, target => { target.comments = [...(target.comments || []), { id: uid(), by: me, text, at: Date.now() }]; });
    hq.setState({ dcdraft: '' });
  };

  // "Make it a task": a follow-up team task for me in the decision's company, due in a week.
  const addFollowUp = () => hq.makeTeamTask(
    {
      title: 'Follow up: ' + (decision.title || 'decision'), co: decision.co, due: plus(7), pri: decision.impact === 'High' ? 'High' : 'Medium',
      notes: decision.outcome || '', from: 'the decision “' + (decision.title || 'Untitled decision') + '”',
    },
    { dec: id },
  );

  /** Deletes with an "Undo" toast that puts the snapshot back at its old position. */
  const deleteDecision = () => {
    const originalIndex = ctx.data.decisions.findIndex(d => d.id === id), snapshot = JSON.parse(JSON.stringify(decision));
    hq.upd(draft => { draft.decisions = draft.decisions.filter(d => d.id !== id); });
    hq.setState({ dopen: null });
    hq.toastMsg('Deleted “' + (decision.title || 'Untitled decision') + '”', () => hq.upd(draft => {
      if (!draft.decisions.some(d => d.id === id)) draft.decisions.splice(Math.min(originalIndex, draft.decisions.length), 0, snapshot);
    }));
  };

  /** Copies the decision as a fresh proposal (new option ids, no votes/comments) right after the original. */
  const duplicateDecision = () => {
    const copyId = uid(), copy = JSON.parse(JSON.stringify(decision));
    Object.assign(copy, {
      id: copyId,
      title: (decision.title || 'Untitled decision') + ' (copy)',
      status: 'Proposed',
      decidedAt: null,
      chosen: '',
      comments: [],
      created: Date.now(),
      log: [{ at: Date.now(), by: me, text: 'Copied from another decision' }],
    });
    copy.opts = (copy.opts || []).map(o => ({ ...o, id: uid(), votes: [] }));
    hq.upd(draft => {
      const index = draft.decisions.findIndex(d => d.id === id);
      draft.decisions.splice(index + 1, 0, copy);
    });
    hq.setState({ dopen: copyId });
    hq.toastMsg('Copy created and opened');
  };

  const options = decision.opts || [];
  const updateOption = (optionId, mutate) => updateDecision(id, target => {
    const option = target.opts.find(o => o.id === optionId);
    if (option) mutate(option);
  });

  const optionCard = (option, i) => {
    const isChosen = decision.chosen === option.id;
    const letter = String.fromCharCode(65 + i);
    const voteButton = personId => {
      const hasVoted = (option.votes || []).includes(personId), person = PEOPLE[personId];
      return {
        label: person.first,
        ini: person.ini,
        bg: hasVoted ? person.bg : '#fff',
        fg: hasVoted ? '#fff' : 'oklch(0.45 0.012 265)',
        bd: hasVoted ? person.bg : 'oklch(0.88 0.008 85)',
        mark: hasVoted ? '✓ ' : '',
        tip: hasVoted ? person.first + ' prefers this. Click to remove' : 'Mark that ' + person.first + ' prefers this',
        toggle: () => updateDecision(id, target => {
          const targetOption = target.opts.find(o => o.id === option.id);
          if (!targetOption) return;
          targetOption.votes = hasVoted ? (targetOption.votes || []).filter(v => v !== personId) : [...(targetOption.votes || []), personId];
        }),
      };
    };
    // Choosing an option marks the decision Decided and pre-fills the outcome; choosing it again un-chooses it.
    const choose = () => {
      updateDecision(id, (target, draft) => {
        const previousStatus = target.status;
        target.chosen = isChosen ? '' : option.id;
        if (!isChosen) {
          if (!(target.outcome || '').trim()) target.outcome = 'We chose: ' + (option.text || 'Option ' + letter) + '.\nWhy: ';
          if (previousStatus !== 'Decided') {
            target.status = 'Decided';
            target.decidedAt = Date.now();
            target.log = [...(target.log || []), { at: Date.now(), by: me, text: 'Chose option ' + letter + ' and marked Decided' }];
            act(draft, me, 'marked decided: “' + (target.title || 'Untitled') + '”', target.co);
          }
        }
      });
      if (!isChosen) {
        hq._focus = { sel: '[data-dout]', pos: 'end' };
        hq.toastMsg('Marked decided. Add the reason below.');
      }
    };
    return {
      id: option.id,
      letter,
      text: option.text,
      notes: option.notes || '',
      chosen: isChosen,
      notChosen: !isChosen,
      onText: e => updateOption(option.id, target => { target.text = e.target.value; }),
      onNotes: e => updateOption(option.id, target => { target.notes = e.target.value; }),
      onKey: e => { if (e.key === 'Enter') { e.preventDefault(); panel.addOpt(); } },
      bd: isChosen ? 'oklch(0.58 0.14 150)' : 'oklch(0.9 0.006 85)',
      bg: isChosen ? 'oklch(0.975 0.02 150)' : '#fff',
      badgeBg: isChosen ? 'oklch(0.55 0.14 150)' : 'oklch(0.95 0.005 85)',
      badgeFg: isChosen ? '#fff' : 'oklch(0.4 0.012 265)',
      votes: ['rahul', 'saswat'].map(voteButton),
      choose,
      chooseLabel: isChosen ? '✓ Chosen' : 'Choose this',
      remove: () => updateDecision(id, target => {
        target.opts = target.opts.filter(o => o.id !== option.id);
        if (target.chosen === option.id) target.chosen = '';
      }),
    };
  };

  const followUpRow = task => {
    const daysUntilDue = dayDiff(task.due);
    return {
      title: task.title || 'Untitled task',
      deco: task.done ? 'line-through' : 'none',
      color: task.done ? MUTED : INK_C,
      mark: task.done ? '✓' : '',
      checkBg: task.done ? 'oklch(0.55 0.14 150)' : '#fff',
      checkBorder: task.done ? 'oklch(0.55 0.14 150)' : 'oklch(0.75 0.01 265)',
      ini: initialsOf(task.assignee || '?'),
      bg: 'oklch(0.55 0.1 265)',
      due: task.due ? (daysUntilDue < 0 && !task.done ? formatShortDate(task.due) + ' · late' : formatShortDate(task.due)) : 'No date',
      dueColor: daysUntilDue < 0 && !task.done ? RED : MUTED,
      toggle: () => hq.toggleTask(task),
      open: () => hq.openTask(task.id),
    };
  };

  const commentRow = comment => {
    const author = PEOPLE[comment.by] || PEOPLE.both;
    return {
      ini: author.ini,
      bg: author.bg,
      name: author.first,
      text: comment.text,
      when: timeAgo(comment.at),
      remove: () => updateDecision(id, target => { target.comments = (target.comments || []).filter(c => c.id !== comment.id); }),
    };
  };

  const missingReason = decision.status === 'Decided' && !(decision.outcome || '').trim();

  const panel = {
    id,
    title: decision.title,
    onTitle: e => setField('title', e.target.value.replace(/\n/g, ' ')),
    stLabel: DST_LABEL[decision.status] || decision.status,
    stTint: statusStyle.tint,
    stInk: statusStyle.ink,
    stDot: statusStyle.dot,
    coName: coOf(decision.co).name,
    coTint: coOf(decision.co).tint,
    coInk: coOf(decision.co).ink,
    statusSeg: segOf([['Proposed', 'Needs decision'], ['Decided', 'Decided'], ['Revisit', 'Revisit'], ['Dropped', 'Not doing']], decision.status, value => setField('status', value)),
    coSeg: segOf(CO_OPTS, decision.co, value => setField('co', value)),
    bySeg: segOf(OWNER_OPTS, decision.by, value => setField('by', value)),
    impSeg: segOf([['High', 'High'], ['Medium', 'Medium'], ['Low', 'Low']], decision.impact || 'Medium', value => setField('impact', value)),
    due: decision.due || '',
    onDue: e => setField('due', e.target.value),
    dueColor: isLate ? RED : INK_C,
    dueHint: isLate ? 'Late by ' + (-dayDiff(decision.due)) + (dayDiff(decision.due) === -1 ? ' day' : ' days') : '',
    hasDueHint: isLate,
    revisit: decision.revisit || '',
    onRevisit: e => setField('revisit', e.target.value),
    context: decision.context || '',
    onContext: e => setField('context', e.target.value),
    // Older decisions kept their options as free text.
    hasLegacy: !!(decision.options || '').trim(),
    options: decision.options || '',
    onOptions: e => setField('options', e.target.value),
    opts: options.map(optionCard),
    hasOpts: !!options.length,
    noOpts: !options.length,
    addOpt: () => {
      const optionId = uid();
      updateDecision(id, target => { target.opts = [...(target.opts || []), { id: optionId, text: '', notes: '', votes: [] }]; });
      hq._focus = { sel: '[data-oid="' + optionId + '"]' };
    },
    outcome: decision.outcome || '',
    onOutcome: e => setField('outcome', e.target.value),
    outcomeHint: missingReason ? 'Decided, but no reason written yet. Future you will want this.' : '',
    hasOutcomeHint: missingReason,
    fols: followUps.map(followUpRow),
    hasFols: !!followUps.length,
    noFols: !followUps.length,
    folInfo: followUps.length ? followUps.filter(t => t.done).length + ' of ' + followUps.length + ' done' : '',
    addFol: addFollowUp,
    comments: (decision.comments || []).map(commentRow),
    cdraft: hq.state.dcdraft || '',
    onC: e => hq.setState({ dcdraft: e.target.value }),
    postC: postComment,
    onCKey: e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment(); } },
    log: [...(decision.log || [])].reverse().map(entry => ({ text: entry.text, who: (PEOPLE[entry.by] || PEOPLE.both).first, when: timeAgo(entry.at) })),
    hasLog: !!(decision.log || []).length,
    created: 'Logged ' + formatLongDate(decision.created || Date.now()) + (decision.decidedAt && decision.status === 'Decided' ? ' · decided ' + formatLongDate(decision.decidedAt) : ''),
    isDecided: decision.status === 'Decided',
    notDecided: decision.status !== 'Decided',
    markDecided: () => {
      setField('status', 'Decided');
      if (!(decision.outcome || '').trim()) {
        hq._focus = { sel: '[data-dout]' };
        hq.toastMsg('Marked decided. Add the reason below.');
      } else hq.toastMsg('Marked decided');
    },
    reopen: () => { setField('status', 'Proposed'); hq.toastMsg('Reopened as Needs decision'); },
    dup: duplicateDecision,
    remove: deleteDecision,
    copy: () => {
      if (navigator.clipboard) navigator.clipboard.writeText(decisionAsText(decision));
      hq.toastMsg('Decision copied as text');
    },
    prev: () => prevId && hq.setState({ dopen: prevId, dcdraft: '' }),
    next: () => nextId && hq.setState({ dopen: nextId, dcdraft: '' }),
    noPrev: !prevId,
    noNext: !nextId,
    prevOp: prevId ? '1' : '0.4',
    nextOp: nextId ? '1' : '0.4',
    close: () => hq.setState({ dopen: null }),
  };
  return panel;
}

// ─── Weekly review ─────────────────────────────────────────────────────────────────────────────

function buildWeeklyReviewVM(hq, ctx) {
  const { data, me, now, goalStats, taskItem } = ctx;
  const weekOffset = hq.state.wk; // 0 = this week, -1 = last week, …
  const reviewFilter = hq.state.wrf || { co: 'any', who: 'all' };

  // Company / person filter. Shared ("both") items count for either founder. Team tasks: mine = assigned
  // to / given by me; the other founder's = assigned to / given by someone with their account name.
  const isFoundersTask = (t, who) => (who === me ? t.mine : !!PEOPLE[who] && [t.assignee, t.giver].includes(PEOPLE[who].name));
  const taskInScope = t => (reviewFilter.co === 'any' || t.co === reviewFilter.co) && (reviewFilter.who === 'all' || isFoundersTask(t, reviewFilter.who));
  const decisionInScope = d => (reviewFilter.co === 'any' || d.co === reviewFilter.co) && (reviewFilter.who === 'all' || d.by === reviewFilter.who || d.by === 'both');
  const goalInScope = g => (reviewFilter.co === 'any' || g.co === reviewFilter.co) && (reviewFilter.who === 'all' || g.owner === reviewFilter.who || g.owner === 'both');
  const tasks = ctx.tasks.filter(taskInScope), decisions = data.decisions.filter(decisionInScope), goals = data.goals.filter(goalInScope);

  const dayStart = isoDate => isoDate ? new Date(isoDate + 'T00:00:00').getTime() : 0;
  const mondayOf = offset => {
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + offset * 7);
    return monday;
  };
  const todayStart = new Date(iso(now) + 'T00:00:00').getTime();

  /**
   * Counts for one week. A task "slipped" when it was due that week (before today) and was either
   * not done or finished after its due date.
   */
  const weekStats = offset => {
    const monday = mondayOf(offset), start = monday.getTime(), end = start + 7 * DAY_MS;
    const inRange = timestamp => timestamp && timestamp >= start && timestamp < end;
    const done = tasks.filter(t => t.done && inRange(t.doneAt));
    const slipped = tasks.filter(t => t.due && dayStart(t.due) >= start && dayStart(t.due) < end && dayStart(t.due) < todayStart
      && (!t.done || (t.doneAt && t.doneAt >= dayStart(t.due) + DAY_MS)));
    return { monday, start, end, inRange, done, slipped, created: tasks.filter(t => inRange(t.created)), decided: decisions.filter(d => inRange(d.decidedAt)) };
  };

  const thisWeek = weekStats(weekOffset), lastWeek = weekStats(weekOffset - 1);
  const monday = thisWeek.monday, weekEnd = thisWeek.end, reviewKey = iso(monday);
  const { done, slipped, created, decided } = thisWeek;
  const comingUpFrom = Math.max(weekEnd, todayStart);
  const comingUp = tasks
    .filter(t => !t.done && t.due && dayStart(t.due) >= (weekOffset === 0 ? todayStart : weekEnd) && dayStart(t.due) < comingUpFrom + 7 * DAY_MS)
    .sort((a, b) => a.due.localeCompare(b.due));
  const pendingDecisions = decisions.filter(d => d.status === 'Proposed');
  const riskyGoals = goals.filter(g => NEEDS_ATTENTION.includes(goalStats[g.id].status));
  const onTrackGoals = goals.filter(g => ['On track', 'Achieved'].includes(goalStats[g.id].status));

  const formatWeekRange = weekMonday => {
    const sunday = new Date(weekMonday.getTime() + 6 * DAY_MS);
    return weekMonday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' – ' + sunday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };
  const weekLabel = formatWeekRange(monday);
  /** Completed ÷ (completed + slipped-and-not-completed), as a percentage; null when nothing was due. */
  const onTimeRate = stats => {
    const total = stats.done.length + stats.slipped.filter(t => !stats.done.includes(t)).length;
    return total ? Math.round(stats.done.length / total * 100) : null;
  };

  const review = normRv(data.reviews[reviewKey]);
  const setReviewField = (field, value) => hq.upd(draft => { draft.reviews[reviewKey] = { ...normRv(draft.reviews[reviewKey]), [field]: value }; });

  const decisionItem = d => {
    const company = coOf(d.co);
    return {
      title: d.title || 'Untitled',
      chip: company.name,
      tint: company.tint,
      ink: company.ink,
      meta: d.status === 'Proposed' ? (d.due ? 'Decide by ' + formatShortDate(d.due) : timeAgo(d.created)) : (d.outcome || '').slice(0, 40),
      metaColor: MUTED,
      go: () => hq.go('decisions', { dopen: d.id }),
    };
  };
  const goalItem = g => {
    const company = coOf(g.co), stats = goalStats[g.id];
    return {
      title: g.title || 'Untitled goal',
      chip: company.name,
      tint: company.tint,
      ink: company.ink,
      meta: stats.pct + '% · ' + stats.status,
      metaColor: stats.status === 'At risk' ? AMBER : RED,
      go: () => hq.go('goals', { gopen: g.id }),
    };
  };
  /** A list card; shows the first 12 items. */
  const listSection = (id, label, dot, items, toItem, emptyText, help) => ({
    id,
    label,
    dot,
    help,
    n: String(items.length),
    items: items.slice(0, 12).map(toItem),
    more: items.length > 12 ? '+ ' + (items.length - 12) + ' more' : '',
    hasMore: items.length > 12,
    empty: !items.length,
    emptyText,
  });
  const slippedItem = t => ({
    ...taskItem(t),
    meta: t.done ? 'done late' : (-dayDiff(t.due)) + 'd late',
    metaColor: t.done ? MUTED : RED,
    hasActs: !t.done,
    push: () => setTeamTaskDue(hq, t, plus(7)).then(ok => ok && hq.toastMsg('Moved to next week')),
    finish: () => hq.toggleTask(t),
  });

  /** "▲ 3 vs last week", green when the change is in the good direction. */
  const weekDelta = (current, previous, higherIsBetter) => {
    const change = current - previous;
    if (!change) return { txt: 'same as last week', col: MUTED };
    const isGood = higherIsBetter ? change > 0 : change < 0;
    return { txt: (change > 0 ? '▲ ' : '▼ ') + Math.abs(change) + ' vs last week', col: isGood ? 'oklch(0.45 0.12 150)' : RED };
  };
  const rate = onTimeRate(thisWeek), previousRate = onTimeRate(lastWeek);
  const kpi = (label, value, delta, color, tip, go) => ({ label, value, dtxt: delta.txt, dcol: delta.col, color, tip, go: go || (() => {}) });
  const scrollToList = id => () => {
    const element = document.querySelector('[data-wr="' + id + '"]');
    const scroller = document.scrollingElement;
    if (element && scroller) scroller.scrollTo({ top: element.getBoundingClientRect().top + scroller.scrollTop - 80, behavior: 'smooth' });
  };

  // Six-week trend ending with the selected week.
  const trendWeeks = [-5, -4, -3, -2, -1, 0].map(o => weekStats(weekOffset + o));
  const trendMax = Math.max(1, ...trendWeeks.map(s => Math.max(s.done.length, s.slipped.length)));

  // Consecutive completed reviews, counting back from this week (or last week if this one isn't done).
  const reviewDone = !!review.done;
  let streak = 0;
  for (let offset = weekOffset - (reviewDone ? 0 : 1); offset > weekOffset - 60; offset--) {
    const pastReview = normRv(data.reviews[iso(mondayOf(offset))]);
    if (pastReview.done) streak++;
    else break;
  }

  const priorities = [0, 1, 2].map(i => (review.pri || [])[i] || { text: '', task: '' });
  const stepsFilled = [
    !!(review.scores && (review.scores.rahul || review.scores.saswat)),
    !!(review.wins || '').trim(),
    !!(review.misses || '').trim(),
    !!(review.learned || '').trim(),
    priorities.some(p => (p.text || '').trim()),
  ].filter(Boolean).length;
  const statusText = review.done ? 'Review complete' : stepsFilled ? 'In progress · ' + stepsFilled + ' of 5 steps' : 'Not started';

  // Due date for tasks created from next week's priorities: the first Friday after this week (and after today).
  const nextFriday = (() => {
    const friday = new Date(Math.max(weekEnd, todayStart + DAY_MS));
    const daysToAdd = (5 - ((friday.getDay() + 7) % 7) + 7) % 7;
    friday.setDate(friday.getDate() + daysToAdd);
    return iso(friday);
  })();

  // Plain-text summary of the week handed to the "Draft notes with Claude" prompt.
  const facts = [
    'Week: ' + weekLabel + (reviewFilter.co !== 'any' ? ' · company ' + coOf(reviewFilter.co).name : '') + (reviewFilter.who !== 'all' ? ' · person ' + PEOPLE[reviewFilter.who].first : ''),
    'Completed (' + done.length + '): ' + done.map(t => t.title + ' [' + coOf(t.co).name + ']').join('; '),
    'Slipped (' + slipped.length + '): ' + slipped.map(t => t.title + ' [' + coOf(t.co).name + ', due ' + t.due + ']').join('; '),
    'New tasks: ' + created.length,
    'Decisions made: ' + decided.map(d => d.title + ' -> ' + (d.outcome || '')).join('; '),
    'Still to decide: ' + pendingDecisions.map(d => d.title).join('; '),
    'Goals: ' + goals.map(g => (g.title || 'Untitled') + ' [' + coOf(g.co).name + '] ' + goalStats[g.id].pct + '% ' + goalStats[g.id].status).join('; '),
    'Due next: ' + comingUp.slice(0, 12).map(t => t.title + ' (' + t.due + ')').join('; '),
  ].join('\n');

  const reviewAsText = () => [
    'Weekly review: ' + weekLabel + (reviewFilter.co !== 'any' ? ' (' + coOf(reviewFilter.co).full + ')' : ''),
    review.scores && (review.scores.rahul || review.scores.saswat)
      ? 'Week rating: ' + ['rahul', 'saswat'].filter(p => review.scores[p]).map(p => PEOPLE[p].first + ' ' + review.scores[p] + '/5').join(', ')
      : '',
    'Completed ' + done.length + ' · Slipped ' + slipped.length + ' · New ' + created.length + ' · Decisions ' + decided.length + (rate !== null ? ' · On-time rate ' + rate + '%' : ''),
    review.wins ? 'WINS\n' + review.wins : '',
    review.misses ? 'MISSES\n' + review.misses : '',
    review.learned ? 'WHAT WE LEARNED\n' + review.learned : '',
    priorities.some(p => p.text) ? 'TOP 3 FOR NEXT WEEK\n' + priorities.filter(p => p.text).map((p, i) => (i + 1) + '. ' + p.text).join('\n') : '',
    review.summary ? 'NOTES\n' + review.summary : '',
    'COMPLETED\n' + (done.map(t => '- ' + t.title + ' (' + coOf(t.co).name + ')').join('\n') || '- none'),
    'SLIPPED\n' + (slipped.map(t => '- ' + t.title + ' (' + coOf(t.co).name + ')').join('\n') || '- none'),
    decided.length ? 'DECISIONS\n' + decided.map(d => '- ' + d.title + ': ' + (d.outcome || '')).join('\n') : '',
  ].filter(Boolean).join('\n\n');

  const priorityRow = (priority, i) => {
    // Links made before team tasks (old founders' task ids) no longer match any task.
    const linkedTask = priority.task && ctx.tasks.find(t => t.id === priority.task);
    /** Creates a high-priority team task for me due next Friday and links it to this priority slot. */
    const makeTask = async () => {
      if (!(priority.text || '').trim()) return;
      const taskId = await hq.makeTeamTask({
        title: priority.text.trim(), co: reviewFilter.co !== 'any' ? reviewFilter.co : 'mariox', due: nextFriday, pri: 'High',
        from: 'the weekly review (' + weekLabel + ')',
      });
      if (!taskId) return;
      hq.upd(draft => {
        const stored = normRv(draft.reviews[reviewKey]);
        const nextPriorities = [0, 1, 2].map(j => ({ ...((stored.pri || [])[j] || { text: '', task: '' }) }));
        nextPriorities[i].task = taskId;
        draft.reviews[reviewKey] = { ...stored, pri: nextPriorities };
      });
    };
    return {
      n: String(i + 1),
      text: priority.text || '',
      onText: e => {
        const nextPriorities = [0, 1, 2].map(j => ({ ...priorities[j] }));
        nextPriorities[i].text = e.target.value;
        setReviewField('pri', nextPriorities);
      },
      hasTask: !!linkedTask,
      noTask: !linkedTask,
      canMake: !linkedTask && !!(priority.text || '').trim(),
      taskLabel: linkedTask ? (linkedTask.done ? '✓ Task done' : 'Task · due ' + formatShortDate(linkedTask.due)) : '',
      openTask: () => linkedTask && hq.openTask(linkedTask.id),
      make: makeTask,
    };
  };

  const scoreRow = personId => {
    const score = (review.scores || {})[personId] || 0;
    return {
      name: PEOPLE[personId].first,
      ini: PEOPLE[personId].ini,
      bg: PEOPLE[personId].bg,
      opts: [1, 2, 3, 4, 5].map(value => ({
        n: String(value),
        bg: score === value ? 'var(--acc, oklch(0.5 0.17 265))' : '#fff',
        fg: score === value ? '#fff' : 'oklch(0.35 0.012 265)',
        bd: score === value ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.88 0.008 85)',
        // Clicking the current score clears it.
        go: () => setReviewField('scores', { ...(review.scores || {}), [personId]: score === value ? 0 : value }),
      })),
      word: ['', 'Rough', 'Meh', 'Okay', 'Good', 'Great'][score] || 'Not rated',
    };
  };

  const historyRow = offset => {
    const weekMonday = mondayOf(offset), pastReview = normRv(data.reviews[iso(weekMonday)]), stats = weekStats(offset), isSelected = offset === weekOffset;
    return {
      label: formatWeekRange(weekMonday),
      sub: stats.done.length + ' done · ' + stats.slipped.length + ' slipped',
      st: pastReview.done ? 'Complete' : (pastReview.wins || pastReview.misses || pastReview.summary || pastReview.learned) ? 'Started' : 'Not done',
      stBg: pastReview.done ? 'oklch(0.95 0.05 150)' : (pastReview.wins || pastReview.misses || pastReview.summary) ? 'oklch(0.96 0.04 80)' : 'oklch(0.96 0.004 265)',
      stFg: pastReview.done ? 'oklch(0.38 0.1 150)' : (pastReview.wins || pastReview.misses || pastReview.summary) ? 'oklch(0.45 0.11 65)' : MUTED,
      bg: isSelected ? 'color-mix(in oklch, var(--acc) 7%, #fff)' : '#fff',
      go: () => hq.setState({ wk: offset }),
    };
  };

  return {
    label: weekLabel,
    rangeSub: weekOffset === 0 ? 'This week' : weekOffset === -1 ? 'Last week' : (-weekOffset) + ' weeks ago',
    prev: () => hq.setState({ wk: weekOffset - 1 }),
    next: () => weekOffset < 0 && hq.setState({ wk: weekOffset + 1 }),
    nextOp: weekOffset < 0 ? '1' : '0.35',
    notNow: weekOffset !== 0,
    toNow: () => hq.setState({ wk: 0 }),
    pickDate: reviewKey,
    // Jump to the week containing the picked date (never into the future).
    onPick: e => {
      if (!e.target.value) return;
      const picked = new Date(e.target.value + 'T00:00:00'), thisMonday = mondayOf(0);
      picked.setDate(picked.getDate() - ((picked.getDay() + 6) % 7));
      const offset = Math.round((picked - thisMonday) / (7 * DAY_MS));
      hq.setState({ wk: Math.min(0, offset) });
    },
    coTabs: [['any', 'All companies'], ...CO_OPTS].map(([coId, label]) => {
      const company = coOf(coId), isActive = reviewFilter.co === coId;
      return {
        label,
        hasTile: !!company.bg && coId !== 'any',
        tile: company.bg || '',
        ini: company.ini || '',
        fg: isActive ? INK_C : MUTED,
        bd: isActive ? INK_C : 'transparent',
        go: () => hq.setState({ wrf: { ...reviewFilter, co: coId } }),
      };
    }),
    whoSeg: segOf([['all', 'Everyone'], ['rahul', PEOPLE.rahul.first], ['saswat', PEOPLE.saswat.first]], reviewFilter.who, value => hq.setState({ wrf: { ...reviewFilter, who: value } })),
    anyF: reviewFilter.co !== 'any' || reviewFilter.who !== 'all',
    clearF: () => hq.setState({ wrf: { co: 'any', who: 'all' } }),
    status: statusText,
    stBg: review.done ? 'oklch(0.95 0.05 150)' : stepsFilled ? 'oklch(0.96 0.04 80)' : 'oklch(0.96 0.004 265)',
    stFg: review.done ? 'oklch(0.38 0.1 150)' : stepsFilled ? 'oklch(0.45 0.11 65)' : 'oklch(0.42 0.012 265)',
    doneMeta: review.done
      ? 'Completed by ' + (PEOPLE[review.doneBy] || PEOPLE.both).first + ' · ' + timeAgo(review.doneAt)
      : 'Go through the 5 steps below, then mark the review complete.',
    streak: streak ? streak + (streak === 1 ? ' week' : ' weeks') + ' in a row reviewed' : 'No review streak yet',
    hasStreak: !!streak,
    isDone: reviewDone,
    notDone: !reviewDone,
    complete: () => {
      hq.upd(draft => { draft.reviews[reviewKey] = { ...normRv(draft.reviews[reviewKey]), done: true, doneAt: Date.now(), doneBy: me }; });
      hq.toastMsg('Review marked complete');
    },
    reopen: () => setReviewField('done', false),
    kpis: [
      kpi('Completed', String(done.length), weekDelta(done.length, lastWeek.done.length, true), 'oklch(0.45 0.12 150)', 'Tasks finished this week', scrollToList('done')),
      kpi('Slipped', String(slipped.length), weekDelta(slipped.length, lastWeek.slipped.length, false), slipped.length ? RED : INK_C, 'Due this week, not done on time', scrollToList('slipped')),
      kpi('On-time rate', rate === null ? '—' : rate + '%',
        rate === null || previousRate === null ? { txt: 'nothing due', col: MUTED } : weekDelta(rate, previousRate, true),
        INK_C, 'Completed ÷ (completed + slipped)'),
      kpi('New tasks', String(created.length), weekDelta(created.length, lastWeek.created.length, true), INK_C, 'Tasks added this week'),
      kpi('Decisions made', String(decided.length), weekDelta(decided.length, lastWeek.decided.length, true), INK_C, 'Marked decided this week', scrollToList('decided')),
      kpi('Goals on track', goals.length ? onTrackGoals.length + ' / ' + goals.length : '—',
        { txt: riskyGoals.length ? riskyGoals.length + ' need attention' : 'all good', col: riskyGoals.length ? AMBER : MUTED },
        INK_C, 'On track or achieved', scrollToList('goals')),
    ],
    trend: trendWeeks.map((stats, i) => ({
      label: i === 5 ? 'This' : stats.monday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      dH: Math.round(stats.done.length / trendMax * 100) + '%',
      sH: Math.round(stats.slipped.length / trendMax * 100) + '%',
      dN: String(stats.done.length),
      sN: String(stats.slipped.length),
      fw: i === 5 ? '700' : '500',
      go: () => hq.setState({ wk: weekOffset + i - 5 }),
      tip: formatWeekRange(stats.monday) + ': ' + stats.done.length + ' done, ' + stats.slipped.length + ' slipped',
    })),
    people: ['rahul', 'saswat', 'both'].map(personId => {
      const person = PEOPLE[personId];
      const doneCount = done.filter(t => t.owner === personId).length, slippedCount = slipped.filter(t => t.owner === personId).length;
      const barTotal = Math.max(1, done.length);
      return {
        name: personId === 'both' ? 'Shared' : person.first,
        ini: person.ini,
        bg: person.bg,
        done: doneCount + ' done',
        slip: slippedCount ? slippedCount + ' slipped' : '',
        hasSlip: !!slippedCount,
        w: Math.round(doneCount / barTotal * 100) + '%',
      };
    }),
    scores: ['rahul', 'saswat'].map(scoreRow),
    wins: review.wins || '',
    onWins: e => setReviewField('wins', e.target.value),
    misses: review.misses || '',
    onMisses: e => setReviewField('misses', e.target.value),
    learned: review.learned || '',
    onLearned: e => setReviewField('learned', e.target.value),
    winsHint: done.length ? 'Tip: ' + done.length + ' tasks were completed. Click to add them.' : '',
    hasWinsHint: !!done.length && !(review.wins || '').trim(),
    fillWins: () => setReviewField('wins', done.map(t => '- ' + t.title).join('\n')),
    missHint: slipped.length ? slipped.length + ' tasks slipped. Click to add them.' : '',
    hasMissHint: !!slipped.length && !(review.misses || '').trim(),
    fillMisses: () => setReviewField('misses', slipped.map(t => '- ' + t.title + ' (due ' + formatShortDate(t.due) + ')').join('\n')),
    pri: priorities.map(priorityRow),
    summary: review.summary || '',
    onSummary: e => setReviewField('summary', e.target.value),
    aiOn: hq.props.claudeDrafts ?? true,
    draft: () => hq.draftReview(facts, reviewKey),
    draftLabel: hq.state.wrBusy ? 'Drafting…' : 'Draft notes with Claude',
    note: hq.state.wrNote,
    hasNote: !!hq.state.wrNote,
    rows: COS.filter(c => reviewFilter.co === 'any' || c.id === reviewFilter.co).map(company => {
      const companyGoals = goals.filter(g => g.co === company.id), slippedCount = slipped.filter(t => t.co === company.id).length;
      return {
        name: company.full,
        tile: company.bg,
        ini: company.ini,
        done: String(done.filter(t => t.co === company.id).length),
        slipped: String(slippedCount),
        slipColor: slippedCount ? RED : MUTED,
        open: String(tasks.filter(t => !t.done && t.co === company.id).length),
        goals: companyGoals.length ? Math.round(companyGoals.reduce((sum, g) => sum + goalStats[g.id].pct, 0) / companyGoals.length) + '%' : '—',
        decs: String(decided.filter(d => d.co === company.id).length),
        go: () => hq.setState({ wrf: { ...reviewFilter, co: company.id } }),
      };
    }),
    lists: [
      listSection('done', 'Completed', 'oklch(0.58 0.14 150)', done,
        t => ({ ...taskItem(t), meta: t.doneAt ? new Date(t.doneAt).toLocaleDateString('en-IN', { weekday: 'short' }) : '', metaColor: MUTED, hasActs: false }),
        'Nothing completed this week yet.', 'Finished this week'),
      listSection('slipped', 'Slipped', RED, slipped, slippedItem, 'Nothing slipped. Nice.', 'Push to next week or mark done right here'),
      listSection('decided', 'Decisions made', 'oklch(0.58 0.14 150)', decided, d => ({ ...decisionItem(d), hasActs: false }), 'No decisions marked decided this week.', 'Settled this week'),
      listSection('pending', 'Still to decide', 'oklch(0.75 0.15 70)', pendingDecisions, d => ({ ...decisionItem(d), hasActs: false }), 'No open questions.', 'Bring these to the founders sync'),
      listSection('goals', 'Goals needing attention', AMBER, riskyGoals, g => ({ ...goalItem(g), hasActs: false }), 'All goals on track.', 'At risk, behind or overdue'),
      listSection('next', 'Coming up next 7 days', 'oklch(0.6 0.17 255)', comingUp, t => ({ ...taskItem(t), hasActs: false }), 'Nothing scheduled.', 'Open tasks due soon'),
    ],
    history: [0, -1, -2, -3, -4, -5, -6, -7].map(historyRow),
    copyLabel: hq.state.wrCopied ? 'Copied ✓' : 'Copy as text',
    copy: () => {
      if (navigator.clipboard) navigator.clipboard.writeText(reviewAsText());
      hq.setState({ wrCopied: true });
      clearTimeout(hq._wc);
      hq._wc = setTimeout(() => hq.setState({ wrCopied: false }), 2000);
    },
    print: () => window.print(),
  };
}

// ─── Command bar (⌘K) ──────────────────────────────────────────────────────────────────────────

function buildCommandBarVM(hq, ctx) {
  const { data, goalStats, openTask } = ctx;
  const cmd = hq.state.cmd;
  const query = cmd.q.trim(), queryLower = query.toLowerCase(), parsed = query ? parseQuick(query) : null;

  // Chips preview what the quick-add parser understood (company, priority, due date). The task is a team task for me.
  const chips = [];
  if (parsed && parsed.title) {
    if (parsed.co) chips.push({ label: coOf(parsed.co).name, bg: coOf(parsed.co).tint, fg: coOf(parsed.co).ink });
    if (parsed.pri) chips.push({ label: parsed.pri + ' priority', bg: 'oklch(0.96 0.03 30)', fg: 'oklch(0.5 0.15 30)' });
    if (parsed.due) {
      chips.push({
        label: 'Due ' + new Date(parsed.due + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        bg: 'oklch(0.95 0.04 80)',
        fg: 'oklch(0.45 0.1 65)',
      });
    }
  }

  const closeBar = () => hq.setState({ cmd: { open: false, q: '', idx: 0 } });
  const rows = [];
  const addHeading = label => rows.push({ isHead: true, isItem: false, label });
  const addItem = (icon, iconBg, iconFg, label, sub, hint, run) => rows.push({ isHead: false, isItem: true, icon, iconBg, iconFg, label, sub: sub || '', hasSub: !!sub, hint: hint || '', run });
  const openCompany = company => {
    closeBar();
    if (company.live) window.location.href = company.href;
    else hq.go('co', { coView: company.id });
  };

  if (!query) {
    addHeading('Create');
    addItem('+', 'var(--acc, oklch(0.5 0.17 265))', '#fff', 'New task', 'Or just start typing: “Send proposal to Infosys fri #mariox !high”', 'type', () => { hq._focus = { sel: '[data-cmd]' }; });
    addItem('◎', 'oklch(0.95 0.03 300)', 'oklch(0.42 0.12 300)', 'New goal', '', '', () => { closeBar(); hq.newGoal(); });
    addItem('?', 'oklch(0.95 0.06 80)', 'oklch(0.45 0.11 65)', 'Log a decision', '', '', () => { closeBar(); hq.newDecision(''); });
    addItem('₹', 'oklch(0.95 0.04 190)', 'oklch(0.4 0.09 190)', 'New lead', 'Sales pipeline · assign it to you or the sales team', '', () => { closeBar(); newLeadInHQ(hq); });
    addItem('¶', 'oklch(0.95 0.005 85)', 'oklch(0.35 0.012 265)', 'New doc page', '', '', () => { closeBar(); hq.go('docs'); hq.addPage(null); });
    addHeading('Go to');
    NAV_TARGETS.forEach(([page, label]) => addItem('→', 'oklch(0.95 0.005 85)', 'oklch(0.35 0.012 265)', label, '', '', () => { closeBar(); hq.go(page); }));
    COS.forEach(company => addItem(company.ini, company.bg, '#fff', company.full + (company.live ? ' portal' : ''), company.live ? 'Opens the team portal' : 'Founder view', '', () => openCompany(company)));
  } else {
    if (AI_ON) {
      addHeading('Ask AI');
      addItem('✦', 'oklch(0.24 0.035 265)', '#fff', 'Ask Founders AI: ' + query, 'Answers from all your portal data', '', () => { closeBar(); hq.aiSend(query); });
    }
    addHeading('Create');
    if (parsed.title) {
      addItem('+', 'var(--acc, oklch(0.5 0.17 265))', '#fff', 'Add task: ' + parsed.title,
        ['Team task for me', parsed.co ? coOf(parsed.co).name : 'Mariox', parsed.pri || 'Medium', parsed.due ? 'due ' + formatShortDate(parsed.due) : 'no date'].join(' · '),
        'Enter', () => { closeBar(); hq.quickAdd(query, { from: 'the command bar' }); });
    }
    if (parsed.title) {
      addItem('+', 'oklch(0.95 0.005 85)', 'oklch(0.35 0.012 265)', 'Add task and open it', 'Write details, assign it, add files', '', () => {
        closeBar();
        hq.quickAdd(query, { from: 'the command bar' }, { open: true });
      });
    }
    addItem('?', 'oklch(0.95 0.06 80)', 'oklch(0.45 0.11 65)', 'Log decision: ' + query, '', '', () => { closeBar(); hq.newDecision(query); });
    addItem('₹', 'oklch(0.95 0.04 190)', 'oklch(0.4 0.09 190)', 'New lead: ' + query, 'Sales pipeline · client company', '', () => { closeBar(); newLeadInHQ(hq, { client: query }); });

    // Search results (open tasks first).
    const taskMatches = ctx.tasks.filter(t => (t.title || '').toLowerCase().includes(queryLower)).sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0)).slice(0, 6);
    const pageMatches = data.pages.filter(page => !page.trashed && ((page.title || '') + ' ' + (page.blocks || []).map(b => b.text).join(' ')).toLowerCase().includes(queryLower)).slice(0, 4);
    const goalMatches = data.goals.filter(g => (g.title || '').toLowerCase().includes(queryLower)).slice(0, 3);
    const decisionMatches = data.decisions.filter(d => [d.title, d.outcome].join(' ').toLowerCase().includes(queryLower)).slice(0, 3);
    const researchMatches = data.research.filter(r => [r.title, r.question].join(' ').toLowerCase().includes(queryLower)).slice(0, 3);
    const leadMatches = hq.leadsAll().filter(l => [l.name, l.contact, l.email, l.id].join(' ').toLowerCase().includes(queryLower))
      .sort((a, b) => (b.open - a.open) || (b.value - a.value)).slice(0, 4);
    const navMatches = NAV_TARGETS.filter(([, label]) => label.toLowerCase().includes(queryLower));
    const companyMatches = COS.filter(c => c.full.toLowerCase().includes(queryLower));

    if (taskMatches.length) {
      addHeading('Tasks');
      taskMatches.forEach(t => {
        const company = coOf(t.co);
        addItem(t.done ? '✓' : '○', company.tint, company.ink, t.title || 'Untitled task', company.name + ' · ' + t.status + (t.due ? ' · due ' + formatShortDate(t.due) : ''), '', () => openTask(t.id));
      });
    }
    if (goalMatches.length) {
      addHeading('Goals');
      goalMatches.forEach(g => addItem('◎', 'oklch(0.95 0.03 300)', 'oklch(0.42 0.12 300)', g.title, coOf(g.co).name + ' · ' + goalStats[g.id].pct + '% · ' + goalStats[g.id].status, '',
        () => { closeBar(); hq.go('goals', { gopen: g.id, gco: 'any' }); }));
    }
    if (decisionMatches.length) {
      addHeading('Decisions');
      decisionMatches.forEach(d => addItem('?', 'oklch(0.95 0.06 80)', 'oklch(0.45 0.11 65)', d.title || 'Untitled', coOf(d.co).name + ' · ' + d.status, '',
        () => { closeBar(); hq.go('decisions', { dopen: d.id, dfilter: 'all' }); }));
    }
    if (leadMatches.length) {
      addHeading('Leads');
      leadMatches.forEach(l => addItem('₹', 'oklch(0.95 0.04 190)', 'oklch(0.4 0.09 190)', l.name, coOf(l.co).name + ' · ' + l.stage + ' · ' + l.owner + (l.value ? ' · ' + hq.money(l.value) : ''), '',
        () => { closeBar(); hq.openLead(l.id); }));
    }
    if (pageMatches.length) {
      addHeading('Docs');
      pageMatches.forEach(page => addItem('¶', 'oklch(0.95 0.005 85)', 'oklch(0.35 0.012 265)', page.title || 'Untitled', coOf(page.co).name, '',
        () => { closeBar(); hq.go('docs', { page: page.id, docTab: 'page' }); }));
    }
    if (researchMatches.length) {
      addHeading('Research');
      researchMatches.forEach(r => addItem('⌕', 'oklch(0.95 0.005 85)', 'oklch(0.35 0.012 265)', r.title || 'Untitled research', coOf(r.co).name + ' · ' + r.status, '',
        () => { closeBar(); hq.go('research', { sel: r.id }); }));
    }
    if (navMatches.length || companyMatches.length) {
      addHeading('Go to');
      navMatches.forEach(([page, label]) => addItem('→', 'oklch(0.95 0.005 85)', 'oklch(0.35 0.012 265)', label, '', '', () => { closeBar(); hq.go(page); }));
      companyMatches.forEach(company => addItem(company.ini, company.bg, '#fff', company.full, '', '', () => openCompany(company)));
    }
  }

  // Keyboard highlight: only item rows are selectable.
  const selectable = rows.filter(r => r.isItem), activeIndex = Math.min(cmd.idx, Math.max(0, selectable.length - 1));
  selectable.forEach((row, i) => {
    row.bg = i === activeIndex ? 'oklch(0.96 0.012 265)' : 'transparent';
    row.hover = () => { if (hq.state.cmd.idx !== i) hq.setState({ cmd: { ...hq.state.cmd, idx: i } }); };
  });

  return {
    open: cmd.open,
    q: cmd.q,
    items: rows,
    chips,
    hasChips: !!chips.length,
    kbd: /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K',
    openIt: () => hq.openCmd(),
    close: closeBar,
    onQ: e => hq.setState({ cmd: { ...hq.state.cmd, q: e.target.value, idx: 0 } }),
    onKey: e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        hq.setState({ cmd: { ...cmd, idx: Math.min(activeIndex + 1, selectable.length - 1) } });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        hq.setState({ cmd: { ...cmd, idx: Math.max(activeIndex - 1, 0) } });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectable[activeIndex]) selectable[activeIndex].run();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeBar();
      }
    },
  };
}

export default class HQGoalsDecisionsReview extends HQState {
  /** View model for the Today brief, Goals, Decisions, Weekly review and the command bar. */
  goalsDecisionsReviewViewModel() {
    const { data, me, view } = this.state;
    const now = new Date();
    const other = me === 'rahul' ? 'saswat' : 'rahul';
    // Team tasks are HQ's only tasks: every one the founder can see, and the ones assigned to / given by them.
    const tasks = this.tasksAll();
    const allOpen = tasks.filter(t => !t.done);
    const myOpen = allOpen.filter(t => t.mine);
    const openTask = id => { this.setState({ cmd: { open: false, q: '', idx: 0 } }); this.openTask(id); };

    // Progress / status of every goal, computed once per render.
    const goalStats = {};
    data.goals.forEach(goal => { goalStats[goal.id] = goalCalc(goal, tasks); });

    /** Standard team task row used across the brief and the weekly review: opens its drawer in Tasks. */
    const taskItem = task => {
      const company = coOf(task.co);
      return {
        title: task.title || 'Untitled task',
        chip: company.name,
        tint: company.tint,
        ink: company.ink,
        meta: taskDueText(task),
        metaColor: taskDueColor(task),
        go: () => openTask(task.id),
        dot: 'oklch(0.62 0.15 ' + (TEAM_STATUS_HUE[task.status] ?? 265) + ')',
        isTeam: true,
        who: task.team.who,
      };
    };

    const ctx = { data, me, other, now, tasks, allOpen, myOpen, openTask, goalStats, taskItem };
    const br = buildBriefVM(this, ctx);

    // Goals: list, peek panel and the popover menus both of them register.
    const quarterEnd = iso(new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0));
    const monthEnd = iso(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    const goalCtx = { ...ctx, monthEnd, quarterEnd };
    const pop = this.state.pop;
    const popPosition = this.state.popXY || { x: 0, top: '0px', bottom: 'auto' };
    const menus = createMenuRegistry(this);
    const gl = buildGoalsListVM(this, goalCtx, menus);
    const peekGoal = data.goals.find(g => g.id === this.state.gopen);
    const gp = peekGoal ? buildGoalPeekVM(this, goalCtx, menus, peekGoal) : { close: () => this.setState({ gopen: null }) };
    const gx = {
      menuOpen: !!(pop && menus.items[pop]),
      menu: menus.items[pop] || [],
      menuTitle: menus.titles[pop] || '',
      hasMenuTitle: !!menus.titles[pop],
      popX: popPosition.x + 'px',
      popTop: popPosition.top,
      popBottom: popPosition.bottom,
    };

    const dl = buildDecisionsVM(this, ctx);
    const wr = buildWeeklyReviewVM(this, ctx);
    const cmd = buildCommandBarVM(this, ctx);

    return {
      br,
      gl,
      gp,
      gx,
      hasGPeek: !!peekGoal,
      dl,
      wr,
      cmd,
      isGoals: view === 'goals',
      isDecisions: view === 'decisions',
      isReview: view === 'review',
      goReview: () => this.go('review'),
    };
  }
}
