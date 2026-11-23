/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import HQAssistant from './08-assistant';
import { initialsOf } from '@/founders/auth/accounts';
import {
  KEY,
  PEOPLE,
  memberOpts,
  othersOf,
  personOf,
  ALL_FOUNDERS,
  GEN,
  coOf,
  CO_OPTS,
  OWNER_OPTS,
  segOf,
  DEPTS,
  DEPT_OF,
  idb,
  fmtSize,
  STATUS,
  STAGES,
  iso,
  plus,
  dayDiff,
  uid,
  INK_C,
  RED,
  AMBER,
  MUTED,
  GST,
  HX_DEF,
  CSTAGES,
  CST,
  STG,
  goalCalc,
  DOC_TPL,
  FTYPES,
  ftypeOf,
  FT_C,
  blocksToMd
} from './core';

export default class HQTasksHiringDocs extends HQAssistant {
  /**
   * View model for the My tasks, Hiring and Docs pages: `tk`/`tp` (the founders' own task list + task
   * page, data.tasks), `hr`/`pk` (hiring board + role panel) and `dc` (docs and files), plus the shared
   * popover and toast. (HQ's Team tasks come from the internal portal: see teamTasks/ and TasksHub.)
   */
  tasksHiringDocsViewModel() {
    const { me, data, tf: taskFilter, pop } = this.state;
    // My tasks (the founders' own tasks, data.tasks)
    const now = new Date();
    const freshIds = this.state.fresh,
      tgroup = this.state.tgroup,
      tsort = this.state.tsort,
      tview = this.state.tview;
    // Popover menus registered while building the view, keyed by popover id; the one matching
    // `state.pop` is rendered by the view.
    const menus = {},
      titles = {};
    /**
     * Click handler that toggles popover `popKey` and places it under the clicked element (or above it
     * when close to the bottom of the window). Coordinates are divided by the app's CSS zoom.
     */
    const openAt = popKey => e => {
      const zoom = this._zoom || 1,
        rawRect = e.currentTarget.getBoundingClientRect(),
        rect = { left: rawRect.left / zoom, top: rawRect.top / zoom, bottom: rawRect.bottom / zoom },
        viewportHeight = window.innerHeight / zoom,
        openUpward = rect.bottom > viewportHeight - 280;
      this.setState({
        pop: this.state.pop === popKey ? null : popKey,
        popXY: {
          x: Math.max(8, Math.min(rect.left, window.innerWidth / zoom - 240)),
          top: openUpward ? 'auto' : rect.bottom + 4 + 'px',
          bottom: openUpward ? viewportHeight - rect.top + 4 + 'px' : 'auto'
        }
      });
    };
    const items = (opts, current, onPick) =>
      opts.map(([value, label, dot, desc]) => ({
        label,
        desc: desc || '',
        hasDesc: !!desc,
        dot: dot || '',
        hasDot: !!dot,
        mark: current === value ? '✓' : '',
        bg: current === value ? 'oklch(0.97 0.012 265)' : 'transparent',
        go: () => {
          this.setState({ pop: null });
          onPick(value);
        }
      }));
    /** Registers a popover menu and returns the click handler that opens it. */
    const registerMenu = (menuKey, title, opts, current, onPick) => {
      menus[menuKey] = items(opts, current, onPick);
      titles[menuKey] = title;
      return openAt(menuKey);
    };
    const ST_OPTS = [
      ['Not started', 'Not started', STATUS['Not started'].dot, "Haven't begun yet"],
      ['In progress', 'In progress', STATUS['In progress'].dot, 'Someone is working on it'],
      ['Done', 'Done', STATUS['Done'].dot, 'Finished']
    ];
    const PRI_DOT = { High: 'oklch(0.6 0.2 25)', Medium: 'oklch(0.75 0.14 70)', Low: 'oklch(0.75 0.01 265)' };
    const PRI_OPTS = [
      ['High', 'High', PRI_DOT.High, 'Do this first'],
      ['Medium', 'Medium', PRI_DOT.Medium],
      ['Low', 'Low', PRI_DOT.Low, 'When there is time']
    ];
    // Every founder / co-founder, then 'both' (All founders).
    const TEAM_OPTS = memberOpts();
    const popPosition = this.state.popXY || { x: 0, top: '0px', bottom: 'auto' };
    const query = (taskFilter.q || '').trim().toLowerCase();
    // Filtering by one founder also shows the tasks all founders share (owner 'both').
    const inTeam = task =>
      taskFilter.owner === 'all' ||
      task.owner === taskFilter.owner ||
      (taskFilter.owner !== 'both' && task.owner === 'both');
    const baseTasks = data.tasks.filter(
      task =>
        (taskFilter.co === 'any' || task.co === taskFilter.co) &&
        inTeam(task) &&
        (!query || (task.title + ' ' + (task.notes || '')).toLowerCase().includes(query))
    );
    const dueMatches = (task, dueFilter) => {
      const daysLeft = dayDiff(task.due);
      if (dueFilter === 'overdue') return !task.done && daysLeft !== null && daysLeft < 0;
      if (dueFilter === 'today') return daysLeft === 0;
      if (dueFilter === 'week') return daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
      if (dueFilter === 'nodate') return !task.due;
      return true;
    };
    const myId = this.state.me,
      quickView = taskFilter.qv || 'all';
    // "<name>'s tasks" for every other founder / co-founder (their own and the shared ones), then "Shared".
    const personViews = Object.fromEntries(othersOf(myId).map(personId => [
      'p:' + personId,
      [personOf(personId).first + "'s tasks", task => task.owner === personId || task.owner === 'both']
    ]));
    const QUICK_VIEWS = {
      all: ['All tasks', () => true],
      mine: ['My tasks', task => task.owner === myId || task.owner === 'both'],
      ...personViews,
      shared: ['Shared', task => task.owner === 'both'],
      waiting: ['Waiting on others', task => !task.done && !!task.waiting],
      nodate: ['No due date', task => !task.done && !task.due],
      recurring: ['Recurring', task => !!task.repeat && task.repeat !== 'none']
    };
    // Tasks created in this session stay visible even when they don't match the filters.
    const visible = baseTasks.filter(
      task =>
        freshIds.includes(task.id) ||
        ((QUICK_VIEWS[quickView] || QUICK_VIEWS.all)[1](task) &&
          (taskFilter.status === 'any' || task.status === taskFilter.status) &&
          (taskFilter.pri === 'any' || task.pri === taskFilter.pri) &&
          (taskFilter.due === 'any' || dueMatches(task, taskFilter.due)))
    );
    const setTaskField = (id, field, value) => this.setMyTask(id, field, value);
    const formatDate = isoDate => {
      if (!isoDate) return '';
      const date = new Date(isoDate + 'T00:00:00');
      return date.toLocaleDateString(
        'en-IN',
        date.getFullYear() === now.getFullYear()
          ? { day: 'numeric', month: 'short' }
          : { day: 'numeric', month: 'short', year: 'numeric' }
      );
    };
    const taskActionOptions = task => [
      ['open', 'Open task page', '', 'See details, sub-tasks, notes'],
      ['done', task.done ? 'Mark as not done' : 'Mark as done', STATUS['Done'].dot],
      ['start', 'Move to In progress', STATUS['In progress'].dot],
      ['tmr', 'Due tomorrow', '', 'Push the due date to tomorrow'],
      ['nw', 'Due next week', '', 'Push the due date 7 days'],
      ['clr', 'Remove due date'],
      ['dup', 'Duplicate', '', 'Makes a copy with the same details'],
      ['copy', 'Copy as text', '', 'Paste into WhatsApp, email, Slack'],
      ['del', 'Delete task', RED, 'You can undo right after']
    ];
    // Optional table columns come from the user's preferences.
    const columnPrefs = this.pf().cols,
      visibleColumns = { ...columnPrefs, dates: !!(columnPrefs.start || columnPrefs.due) },
      gridCols = [
        '24px',
        '30px',
        'minmax(240px,1fr)',
        visibleColumns.status && '136px',
        visibleColumns.dept && '150px',
        visibleColumns.co && '108px',
        visibleColumns.team && '118px',
        visibleColumns.dates && '170px',
        visibleColumns.pri && '92px',
        '40px'
      ]
        .filter(Boolean)
        .join(' ');
    const selectedIds = this.state.tsel || [],
      openDatePicker = e => {
        try {
          e.currentTarget.showPicker();
        } catch {
          /* showPicker() is unsupported in some browsers */
        }
      };
    /** View model for one task row (list view) or card (board view). */
    const buildTaskRow = task => {
      const company = coOf(task.co),
        owner = PEOPLE[task.owner] || PEOPLE.both,
        status = STATUS[task.status] || STATUS['Not started'],
        id = task.id,
        daysLeft = dayDiff(task.due);
      const overdue = !task.done && daysLeft !== null && daysLeft < 0,
        soon = !task.done && (daysLeft === 0 || daysLeft === 1);
      const dueText = !task.due
        ? 'Add date'
        : daysLeft === 0
          ? 'Today'
          : daysLeft === 1
            ? 'Tomorrow'
            : formatDate(task.due) + (overdue ? ' · late' : '');
      const subs = task.subs || [],
        linkedGoal = task.goal ? data.goals.find(goal => goal.id === task.goal) : null;
      const isSel = selectedIds.includes(id),
        hasRepeat = !!task.repeat && task.repeat !== 'none';
      return {
        cs: visibleColumns,
        gridCols,
        id,
        title: task.title,
        pick: openDatePicker,
        selMark: isSel ? '✓' : '',
        selBg: isSel ? 'oklch(0.5 0.17 265)' : '#fff',
        selBd: isSel ? 'oklch(0.5 0.17 265)' : 'oklch(0.82 0.01 265)',
        selOp: isSel || selectedIds.length ? '1' : '0.4',
        selToggle: () =>
          this.setState({
            tsel: isSel ? selectedIds.filter(selected => selected !== id) : [...selectedIds, id]
          }),
        rowBg: isSel ? 'oklch(0.97 0.015 265)' : overdue ? 'oklch(0.985 0.012 25)' : 'transparent',
        rowEdge: overdue ? 'inset 3px 0 0 oklch(0.6 0.19 25)' : 'none',
        hasMeta: (!task.done && !!task.waiting) || hasRepeat || !!linkedGoal || !!subs.length,
        repeatShort: { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' }[task.repeat] || '',
        showStart: !!visibleColumns.start && !!task.start,
        dueShow: !task.due
          ? '—'
          : daysLeft === 0
            ? 'Today'
            : daysLeft === 1
              ? 'Tomorrow'
              : formatDate(task.due) + (overdue ? ' · ' + -daysLeft + 'd late' : ''),
        titleOr: task.title || 'Untitled task',
        hasSub: !!subs.length,
        hasWait: !task.done && !!task.waiting,
        waitLabel: 'Waiting: ' + ((PEOPLE[task.waiting] || {}).first || ''),
        hasRepeat: !!task.repeat && task.repeat !== 'none',
        repeatLabel: 'Repeats ' + (task.repeat || ''),
        hasGoal: !!linkedGoal,
        goalLabel: linkedGoal ? 'Goal: ' + (linkedGoal.title || 'Untitled') : '',
        goalShort: linkedGoal ? linkedGoal.title || 'Goal' : '',
        subInfo: subs.filter(sub => sub.done).length + '/' + subs.length,
        deco: task.done ? 'line-through' : 'none',
        titleColor: task.done ? MUTED : 'oklch(0.23 0.015 265)',
        mark: task.done ? '✓' : '',
        checkBg: task.done ? 'oklch(0.55 0.14 150)' : '#fff',
        checkBorder: task.done ? 'oklch(0.55 0.14 150)' : 'oklch(0.75 0.01 265)',
        checkTip: task.done ? 'Mark as not done' : 'Mark as done',
        toggle: () => setTaskField(id, 'status', task.done ? 'Not started' : 'Done'),
        onTitle: e => setTaskField(id, 'title', e.target.value),
        onKey: e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.newMyTask({ status: task.status, co: task.co, owner: task.owner });
          }
        },
        openTask: () => this.setState({ tpeek: id, pop: null }),
        actions: registerMenu('ra:' + id, 'Task actions', taskActionOptions(task), '', value =>
          this.myTaskAct(id, value)
        ),
        st: {
          label: task.status,
          tint: status.tint,
          ink: status.ink,
          dot: status.dot,
          bd: status.bd,
          toggle: registerMenu('st:' + id, 'Status', ST_OPTS, task.status, value =>
            setTaskField(id, 'status', value)
          )
        },
        dp: (() => {
          const deptKey = task.dept || (task.co === 'all' ? 'founder' : ''),
            dept = DEPT_OF[deptKey];
          return {
            label: dept ? dept.label : 'Set department',
            tint: dept ? dept.tint : 'oklch(0.97 0.003 265)',
            ink: dept ? dept.ink : 'oklch(0.6 0.01 265)',
            synced: !!dept && deptKey !== 'founder' && task.co === 'mariox',
            tip:
              dept && deptKey !== 'founder' && task.co === 'mariox'
                ? 'Shows in the Mariox portal for ' +
                  dept.label +
                  (task.extBy ? ' · last updated there by ' + task.extBy : '')
                : 'Change department',
            toggle: registerMenu(
              'dp:' + id,
              'Department',
              DEPTS.map(([value, label, hue]) => [value, label, 'oklch(0.62 0.13 ' + hue + ')']),
              deptKey,
              value => setTaskField(id, 'dept', value)
            )
          };
        })(),
        co: {
          label: company.name,
          tint: company.tint,
          ink: company.ink,
          toggle: registerMenu(
            'co:' + id,
            'Company',
            CO_OPTS.map(([value, label]) => [value, label, coOf(value).bg || 'oklch(0.6 0.01 265)']),
            task.co,
            value => setTaskField(id, 'co', value)
          )
        },
        own: {
          label: owner.first,
          ini: owner.ini,
          bg: owner.bg,
          toggle: registerMenu('ow:' + id, "Who's doing it", TEAM_OPTS, task.owner, value =>
            setTaskField(id, 'owner', value)
          )
        },
        pr: {
          label: task.pri,
          dot: PRI_DOT[task.pri] || PRI_DOT.Medium,
          toggle: registerMenu('pr:' + id, 'Priority', PRI_OPTS, task.pri, value =>
            setTaskField(id, 'pri', value)
          )
        },
        start: task.start || '',
        onStart: e => setTaskField(id, 'start', e.target.value),
        startText: task.start ? formatDate(task.start) : 'Add date',
        startColor: task.start ? 'oklch(0.3 0.012 265)' : 'oklch(0.72 0.01 265)',
        startWeight: '400',
        due: task.due || '',
        onDue: e => setTaskField(id, 'due', e.target.value),
        dueText,
        dueCard: task.due
          ? 'Due ' + (daysLeft === 0 ? 'today' : daysLeft === 1 ? 'tomorrow' : formatDate(task.due))
          : 'No due date',
        dueColor: overdue
          ? RED
          : soon
            ? 'oklch(0.5 0.13 60)'
            : task.due
              ? 'oklch(0.3 0.012 265)'
              : 'oklch(0.72 0.01 265)',
        dueWeight: overdue || soon ? '600' : '400'
      };
    };
    const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };
    const compareTasks =
      {
        due: (a, b) => (a.due || '9999').localeCompare(b.due || '9999'),
        start: (a, b) => (a.start || '9999').localeCompare(b.start || '9999'),
        priority: (a, b) =>
          (PRIORITY_RANK[a.pri] ?? 1) - (PRIORITY_RANK[b.pri] ?? 1) ||
          (a.due || '9999').localeCompare(b.due || '9999'),
        name: (a, b) => (a.title || '').localeCompare(b.title || ''),
        newest: (a, b) => (b.created || 0) - (a.created || 0)
      }[tsort] || (() => 0);
    // Tasks created in this session stay on top in creation order; the rest use the chosen sort.
    const orderTasks = (a, b) => {
      const freshA = freshIds.indexOf(a.id),
        freshB = freshIds.indexOf(b.id);
      if (freshA > -1 || freshB > -1) return (freshA < 0 ? 1e9 : freshA) - (freshB < 0 ? 1e9 : freshB);
      return compareTasks(a, b);
    };
    // How the task list is grouped (state.tgroup).
    const groupDef =
      {
        status: {
          field: 'status',
          opts: ['In progress', 'Not started', 'Done'].map(value => [value, value, STATUS[value].dot]),
          keepEmpty: true
        },
        company: {
          field: 'co',
          opts: CO_OPTS.map(([value, label]) => [value, label, coOf(value).bg || 'oklch(0.6 0.01 265)'])
        },
        owner: { field: 'owner', opts: TEAM_OPTS },
        priority: {
          field: 'pri',
          opts: PRI_OPTS.map(([value, label, dot]) => [value, label, dot]),
          keepEmpty: false
        },
        none: { field: null, opts: [['all', 'All tasks', 'oklch(0.6 0.01 265)']], keepEmpty: true }
      }[tgroup] || null;
    const collapsedGroups = this.state.gcol;
    // Empty groups are only kept when no filter is active (and always on the board).
    const groups = groupDef.opts
      .map(([value, label, dot]) => {
        const groupTasks = visible
            .filter(task => !groupDef.field || task[groupDef.field] === value)
            .sort(orderTasks),
          groupKey = tgroup + ':' + value;
        const forced = groupDef.field === 'status' && taskFilter.status === value;
        const isOpen = forced || !collapsedGroups[groupKey];
        return {
          label,
          dot,
          count: groupTasks.length + (groupTasks.length === 1 ? ' task' : ' tasks'),
          open: isOpen,
          caret: isOpen ? '▼' : '▶',
          empty: !groupTasks.length,
          n: groupTasks.length,
          toggle: () =>
            this.setState({ gcol: { ...collapsedGroups, [groupKey]: !collapsedGroups[groupKey] } }),
          add: () => this.newMyTask(groupDef.field ? { [groupDef.field]: value } : {}),
          rows: groupTasks.map(buildTaskRow)
        };
      })
      .filter(
        group =>
          group.n ||
          tview === 'board' ||
          (groupDef.keepEmpty &&
            !(
              taskFilter.owner !== 'all' ||
              taskFilter.status !== 'any' ||
              taskFilter.pri !== 'any' ||
              taskFilter.due !== 'any' ||
              (taskFilter.q || '').trim() ||
              taskFilter.co !== 'any'
            ))
      );
    const openTasks = baseTasks.filter(task => !task.done);
    // Summary tiles: [filter value, label, dot colour, count, filter key, tooltip].
    const tileDef = [
      [
        'overdue',
        'Overdue',
        RED,
        openTasks.filter(task => dueMatches(task, 'overdue')).length,
        'due',
        'Open tasks past their due date'
      ],
      [
        'today',
        'Due today',
        'oklch(0.72 0.15 65)',
        openTasks.filter(task => dueMatches(task, 'today')).length,
        'due',
        'Open tasks due today'
      ],
      [
        'week',
        'Due in 7 days',
        'oklch(0.6 0.13 265)',
        openTasks.filter(task => dueMatches(task, 'week')).length,
        'due',
        'Open tasks due in the next 7 days'
      ],
      [
        'In progress',
        'In progress',
        STATUS['In progress'].dot,
        baseTasks.filter(task => task.status === 'In progress').length,
        'status',
        'Tasks someone is working on'
      ],
      [
        'Done',
        'Done this week',
        STATUS['Done'].dot,
        baseTasks.filter(
          task => task.status === 'Done' && task.doneAt && Date.now() - task.doneAt < 7 * 864e5
        ).length,
        'status',
        'Tasks finished in the last 7 days (click to see all done)'
      ]
    ];
    const tiles = tileDef.map(([value, label, dot, count, key, tip]) => {
      const isActive = taskFilter[key] === value;
      return {
        label,
        dot,
        n: String(count),
        tip: tip + (isActive ? ' (click again to clear)' : ''),
        color: value === 'overdue' && count ? RED : 'oklch(0.23 0.015 265)',
        bg: isActive ? 'oklch(0.97 0.015 265)' : '#fff',
        bd: isActive ? 'oklch(0.55 0.15 265)' : 'oklch(0.915 0.006 85)',
        go: () =>
          this.setState({
            tf: {
              ...taskFilter,
              [key]: isActive ? 'any' : value,
              ...(key === 'due' && !isActive && taskFilter.status === 'Done' ? { status: 'any' } : {}),
              ...(key === 'status' && !isActive ? { due: 'any' } : {})
            },
            fresh: []
          })
      };
    });
    /** Filter chip that opens a menu and writes the picked value into `state.tf`. */
    const filterButton = (menuKey, name, current, anyVal, opts, label) => {
      const isActive = current !== anyVal;
      return {
        label: isActive ? name + ': ' + label : name,
        bg: isActive ? 'oklch(0.96 0.025 265)' : '#fff',
        bd: isActive ? 'oklch(0.8 0.06 265)' : 'oklch(0.9 0.006 85)',
        fg: isActive ? 'oklch(0.38 0.14 265)' : 'oklch(0.35 0.012 265)',
        go: registerMenu(menuKey, name, opts, current, value =>
          this.setState({ tf: { ...this.state.tf, [menuKey.slice(2)]: value }, fresh: [] })
        )
      };
    };
    const teamOpts = [
      ['all', 'Everyone', '', 'All tasks'],
      ...memberOpts(false).map(option => [...option, 'Includes shared tasks']),
      ['both', ALL_FOUNDERS, PEOPLE.both.bg, 'Shared tasks only']
    ];
    const dueOpts = [
      ['any', 'Any time'],
      ['overdue', 'Overdue', RED],
      ['today', 'Due today', 'oklch(0.72 0.15 65)'],
      ['week', 'Due in next 7 days', 'oklch(0.6 0.13 265)'],
      ['nodate', 'No due date', 'oklch(0.8 0.01 265)']
    ];
    const labelOf = (opts, value) => (opts.find(option => option[0] === value) || [undefined, ''])[1];
    const filters = [
      filterButton('f:owner', 'Team', taskFilter.owner, 'all', teamOpts, labelOf(teamOpts, taskFilter.owner)),
      filterButton(
        'f:status',
        'Status',
        taskFilter.status,
        'any',
        [['any', 'Any status'], ...ST_OPTS],
        taskFilter.status
      ),
      filterButton(
        'f:pri',
        'Priority',
        taskFilter.pri,
        'any',
        [['any', 'Any priority'], ...PRI_OPTS],
        taskFilter.pri
      ),
      filterButton('f:due', 'Due', taskFilter.due, 'any', dueOpts, labelOf(dueOpts, taskFilter.due))
    ];
    const GROUPS = [
      ['status', 'Status'],
      ['company', 'Company'],
      ['owner', 'Team'],
      ['priority', 'Priority'],
      ['none', 'No grouping']
    ];
    const SORTS = [
      ['due', 'Due date (soonest first)'],
      ['start', 'Start date'],
      ['priority', 'Priority (high first)'],
      ['name', 'Name (A to Z)'],
      ['newest', 'Newest first']
    ];
    // View preferences are remembered per browser.
    const setViewPref = (prefKey, value) => {
      localStorage.setItem(KEY + '-' + prefKey, value);
      this.setState({ [prefKey]: value });
    };
    const viewOpts = [
      {
        label: 'Group by: ' + labelOf(GROUPS, tgroup),
        bg: '#fff',
        bd: 'oklch(0.9 0.006 85)',
        fg: 'oklch(0.35 0.012 265)',
        go: registerMenu('v:group', 'Group tasks by', GROUPS, tgroup, value => setViewPref('tgroup', value))
      },
      {
        label: 'Sort: ' + labelOf(SORTS, tsort).replace(/ \(.*\)/, ''),
        bg: '#fff',
        bd: 'oklch(0.9 0.006 85)',
        fg: 'oklch(0.35 0.012 265)',
        go: registerMenu('v:sort', 'Sort tasks by', SORTS, tsort, value => setViewPref('tsort', value))
      }
    ];
    const anyFilter =
      (taskFilter.qv && taskFilter.qv !== 'all') ||
      taskFilter.owner !== 'all' ||
      taskFilter.status !== 'any' ||
      taskFilter.pri !== 'any' ||
      taskFilter.due !== 'any' ||
      !!query;
    const openTasksAllCompanies = data.tasks.filter(task => !task.done && inTeam(task));
    const tasksView = {
      sub:
        openTasks.length +
        ' open · ' +
        openTasks.filter(task => dueMatches(task, 'overdue')).length +
        ' overdue',
      add: () => this.newMyTask({}),
      groups,
      tiles,
      filters,
      viewOpts,
      anyFilter,
      cs: visibleColumns,
      gridCols,
      empty: !visible.length && anyFilter,
      isList: tview !== 'board',
      isBoard: tview === 'board',
      viewSeg: segOf(
        [
          ['list', 'List'],
          ['board', 'Board']
        ],
        tview,
        value => setViewPref('tview', value)
      ),
      q: taskFilter.q || '',
      onQ: e => this.setState({ tf: { ...this.state.tf, q: e.target.value } }),
      clear: () =>
        this.setState({
          tf: { ...taskFilter, owner: 'all', status: 'any', pri: 'any', due: 'any', q: '', qv: 'all' },
          fresh: []
        }),
      quick: Object.keys(QUICK_VIEWS).map(viewKey => {
        const isActive = quickView === viewKey,
          count = baseTasks.filter(
            task =>
              (viewKey === 'all' || viewKey === 'recurring' || viewKey === 'mine' || viewKey === 'other'
                ? !task.done
                : true) && QUICK_VIEWS[viewKey][1](task)
          ).length;
        return {
          label: QUICK_VIEWS[viewKey][0],
          n: String(count),
          bg: isActive ? 'oklch(0.23 0.015 265)' : '#fff',
          fg: isActive ? '#fff' : 'oklch(0.35 0.012 265)',
          bd: isActive ? 'oklch(0.23 0.015 265)' : 'oklch(0.9 0.006 85)',
          go: () => this.setState({ tf: { ...this.state.tf, qv: viewKey }, fresh: [], tsel: [] })
        };
      }),
      hasSel: !!selectedIds.length,
      selN: selectedIds.length + ' selected',
      selClear: () => this.setState({ tsel: [] }),
      allMark:
        selectedIds.length && selectedIds.length >= visible.length ? '✓' : selectedIds.length ? '–' : '',
      allBg: selectedIds.length ? 'oklch(0.5 0.17 265)' : '#fff',
      allBd: selectedIds.length ? 'oklch(0.5 0.17 265)' : 'oklch(0.82 0.01 265)',
      selAll: () => this.setState({ tsel: selectedIds.length ? [] : visible.map(task => task.id) }),
      bulk: (() => {
        const applyToSelected = (field, value) => {
          selectedIds.forEach(id => this.setMyTask(id, field, value));
        };
        const isoInDays = days => {
          const date = new Date();
          date.setDate(date.getDate() + days);
          return iso(date);
        };
        return [
          {
            label: 'Status',
            go: registerMenu('b:st', 'Set status for ' + selectedIds.length, ST_OPTS, '', value =>
              applyToSelected('status', value)
            )
          },
          {
            label: "Who's doing it",
            go: registerMenu('b:ow', 'Assign ' + selectedIds.length + ' tasks to', TEAM_OPTS, '', value =>
              applyToSelected('owner', value)
            )
          },
          {
            label: 'Priority',
            go: registerMenu('b:pr', 'Set priority', PRI_OPTS, '', value => applyToSelected('pri', value))
          },
          {
            label: 'Due date',
            go: registerMenu(
              'b:due',
              'Set due date',
              [
                ['0', 'Today'],
                ['1', 'Tomorrow'],
                ['7', 'In a week'],
                ['clr', 'Remove due date']
              ],
              '',
              value => applyToSelected('due', value === 'clr' ? '' : isoInDays(+value))
            )
          },
          {
            label: 'Repeat',
            go: registerMenu(
              'b:rep',
              'Repeat',
              [
                ['none', 'Does not repeat'],
                ['daily', 'Every day'],
                ['weekly', 'Every week'],
                ['monthly', 'Every month']
              ],
              '',
              value => applyToSelected('repeat', value)
            )
          }
        ];
      })(),
      bulkDel: () => {
        if (!confirm('Delete ' + selectedIds.length + ' tasks? This cannot be undone.')) return;
        const ids = selectedIds.slice();
        this.upd(draft => {
          draft.tasks = draft.tasks.filter(task => !ids.includes(task.id));
        });
        this.setState({ tsel: [] });
      },
      pick: e => {
        try {
          e.currentTarget.showPicker();
        } catch {
          /* showPicker() is unsupported in some browsers */
        }
      },
      coTabs: [['any', 'All'], ...CO_OPTS].map(([value, label]) => {
        const company = coOf(value),
          isActive = taskFilter.co === value;
        return {
          label,
          n: String(openTasksAllCompanies.filter(task => value === 'any' || task.co === value).length),
          hasTile: !!company.bg && value !== 'any',
          tile: company.bg || '',
          ini: company.ini || '',
          fg: isActive ? 'oklch(0.23 0.015 265)' : MUTED,
          bd: isActive ? 'oklch(0.23 0.015 265)' : 'transparent',
          go: () => this.setState({ tf: { ...taskFilter, co: value }, fresh: [] })
        };
      }),
      menuOpen: !!(pop && menus[pop]),
      menu: menus[pop] || [],
      menuTitle: titles[pop] || '',
      hasMenuTitle: !!titles[pop],
      popX: popPosition.x + 'px',
      popTop: popPosition.top,
      popBottom: popPosition.bottom
    };
    // Task detail panel (opened with state.tpeek).
    const peekTask = data.tasks.find(task => task.id === this.state.tpeek);
    let taskPanel = { close: () => this.setState({ tpeek: null }) };
    if (peekTask) {
      const id = peekTask.id,
        company = coOf(peekTask.co),
        owner = PEOPLE[peekTask.owner] || PEOPLE.both,
        status = STATUS[peekTask.status] || STATUS['Not started'],
        docId = 'task:' + id,
        daysLeft = dayDiff(peekTask.due);
      const overdue = !peekTask.done && daysLeft !== null && daysLeft < 0;
      const subtasks = peekTask.subs || [],
        doneCount = subtasks.filter(sub => sub.done).length;
      /** Applies `mutate` to the open task inside a data update. */
      const updatePeekTask = mutate =>
        this.upd(draft => {
          const stored = draft.tasks.find(item => item.id === id);
          if (stored) mutate(stored);
        });
      const setSubField = (subId, field, value) =>
        updatePeekTask(stored => {
          const sub = (stored.subs || []).find(item => item.id === subId);
          if (sub) sub[field] = value;
        });
      const addSub = after => {
        const subId = uid();
        updatePeekTask(stored => {
          stored.subs = stored.subs || [];
          const insertAt = after ? stored.subs.findIndex(item => item.id === after) : -1;
          stored.subs.splice(insertAt > -1 ? insertAt + 1 : stored.subs.length, 0, {
            id: subId,
            title: '',
            done: false,
            due: ''
          });
        });
        this._focus = { sel: '[data-sid="' + subId + '"]' };
      };
      const delSub = subId =>
        updatePeekTask(stored => {
          stored.subs = (stored.subs || []).filter(item => item.id !== subId);
        });
      const postComment = () => {
        const text = (this.state.cdraft || '').trim();
        if (!text) return;
        updatePeekTask(stored => {
          stored.comments = [...(stored.comments || []), { id: uid(), by: me, text, at: Date.now() }];
        });
        this.setState({ cdraft: '' });
      };
      const doc = this.getDoc(docId);
      const navList = groups.flatMap(group => group.rows.map(row => row.id)),
        navIndex = navList.indexOf(id),
        navPrev = navIndex > 0 ? navList[navIndex - 1] : null,
        navNext = navIndex > -1 && navIndex < navList.length - 1 ? navList[navIndex + 1] : null;
      taskPanel = {
        title: peekTask.title,
        onTitle: e => setTaskField(id, 'title', e.target.value.replace(/\n/g, ' ')),
        onTitleKey: e => {
          if (
            e.key === 'Enter' ||
            (e.key === 'ArrowDown' && e.target.selectionStart === e.target.value.length)
          ) {
            e.preventDefault();
            const firstBlock = doc.blocks.find(block => block.type !== 'divider');
            if (firstBlock) {
              this.focusBlock(firstBlock.id, 0);
              this.forceUpdate();
            }
          }
        },
        st: {
          label: peekTask.status,
          tint: status.tint,
          ink: status.ink,
          dot: status.dot,
          bd: status.bd,
          toggle: registerMenu('pst:' + id, 'Status', ST_OPTS, peekTask.status, value =>
            setTaskField(id, 'status', value)
          )
        },
        co: {
          label: company.name,
          tint: company.tint,
          ink: company.ink,
          toggle: registerMenu(
            'pco:' + id,
            'Company',
            CO_OPTS.map(([value, label]) => [value, label, coOf(value).bg || 'oklch(0.6 0.01 265)']),
            peekTask.co,
            value => setTaskField(id, 'co', value)
          )
        },
        own: {
          label: owner.first,
          ini: owner.ini,
          bg: owner.bg,
          toggle: registerMenu('pow:' + id, "Who's doing it", TEAM_OPTS, peekTask.owner, value =>
            setTaskField(id, 'owner', value)
          )
        },
        pr: {
          label: peekTask.pri,
          dot: PRI_DOT[peekTask.pri] || PRI_DOT.Medium,
          toggle: registerMenu('ppr:' + id, 'Priority', PRI_OPTS, peekTask.pri, value =>
            setTaskField(id, 'pri', value)
          )
        },
        goal: (() => {
          const goalChoices = data.goals.filter(goal => goal.co === peekTask.co || goal.id === peekTask.goal),
            linkedGoal = data.goals.find(goal => goal.id === peekTask.goal);
          return {
            label: linkedGoal
              ? linkedGoal.title || 'Untitled goal'
              : goalChoices.length
                ? 'Link to a goal'
                : 'No goals for ' + company.name + ' yet',
            color: linkedGoal ? INK_C : 'oklch(0.65 0.01 265)',
            toggle: registerMenu(
              'pgl:' + id,
              'Counts towards goal',
              [
                ['', 'No goal'],
                ...goalChoices.map(goal => [
                  goal.id,
                  goal.title || 'Untitled goal',
                  GST[goalCalc(goal, data.tasks).status].dot
                ])
              ],
              peekTask.goal || '',
              value => setTaskField(id, 'goal', value)
            )
          };
        })(),
        wait: {
          label: peekTask.waiting
            ? (PEOPLE[peekTask.waiting] || {}).first + ' (needs to reply / act)'
            : 'Nobody',
          color: peekTask.waiting ? 'oklch(0.45 0.11 65)' : 'oklch(0.65 0.01 265)',
          toggle: registerMenu(
            'pwt:' + id,
            'Waiting on',
            [
              ['', 'Nobody'],
              ...memberOpts(false).map(([personId, first, bg]) => [personId, first, bg, 'Shows in ' + first + '’s Today'])
            ],
            peekTask.waiting || '',
            value => setTaskField(id, 'waiting', value)
          )
        },
        rep: {
          label:
            { weekly: 'Every week', monthly: 'Every month', daily: 'Every day' }[peekTask.repeat] ||
            'Does not repeat',
          color: peekTask.repeat && peekTask.repeat !== 'none' ? INK_C : 'oklch(0.65 0.01 265)',
          toggle: registerMenu(
            'prp:' + id,
            'Repeat',
            [
              ['none', 'Does not repeat'],
              ['daily', 'Every day'],
              ['weekly', 'Every week', '', 'Next copy is created when you mark it Done'],
              ['monthly', 'Every month']
            ],
            peekTask.repeat || 'none',
            value => setTaskField(id, 'repeat', value)
          )
        },
        start: peekTask.start || '',
        onStart: e => setTaskField(id, 'start', e.target.value),
        startColor: peekTask.start ? 'oklch(0.25 0.012 265)' : 'oklch(0.7 0.01 265)',
        due: peekTask.due || '',
        onDue: e => setTaskField(id, 'due', e.target.value),
        dueColor: overdue ? RED : peekTask.due ? 'oklch(0.25 0.012 265)' : 'oklch(0.7 0.01 265)',
        dueWeight: overdue ? '600' : '400',
        subInfo: subtasks.length ? doneCount + ' of ' + subtasks.length + ' done' : '',
        hasSubs: !!subtasks.length,
        noSubs: !subtasks.length,
        subPct: (subtasks.length ? Math.round((doneCount / subtasks.length) * 100) : 0) + '%',
        addSub: () => addSub(null),
        subs: subtasks.map(sub => {
          const subDaysLeft = dayDiff(sub.due),
            subOverdue = !sub.done && subDaysLeft !== null && subDaysLeft < 0;
          return {
            id: sub.id,
            title: sub.title,
            onTitle: e => setSubField(sub.id, 'title', e.target.value),
            onKey: e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSub(sub.id);
              } else if (e.key === 'Backspace' && !sub.title) {
                e.preventDefault();
                const subIndex = subtasks.findIndex(item => item.id === sub.id);
                delSub(sub.id);
                if (subtasks[subIndex - 1])
                  this._focus = { sel: '[data-sid="' + subtasks[subIndex - 1].id + '"]', pos: 'end' };
              }
            },
            due: sub.due || '',
            onDue: e => setSubField(sub.id, 'due', e.target.value),
            dueColor: subOverdue ? RED : sub.due ? 'oklch(0.3 0.012 265)' : 'oklch(0.72 0.01 265)',
            mark: sub.done ? '✓' : '',
            checkBg: sub.done ? 'oklch(0.55 0.14 150)' : '#fff',
            checkBorder: sub.done ? 'oklch(0.55 0.14 150)' : 'oklch(0.75 0.01 265)',
            deco: sub.done ? 'line-through' : 'none',
            color: sub.done ? MUTED : 'oklch(0.23 0.015 265)',
            toggle: () => setSubField(sub.id, 'done', !sub.done),
            remove: () => delSub(sub.id)
          };
        }),
        blocks: this.blocksVM(docId, doc.blocks),
        addBlockEnd: () => this.addBlockEnd(docId),
        comments: (peekTask.comments || []).map(comment => {
          const author = PEOPLE[comment.by] || PEOPLE.both;
          return {
            ini: author.ini,
            bg: author.bg,
            name: author.first,
            text: comment.text,
            when: new Date(comment.at).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: 'numeric',
              minute: '2-digit'
            }),
            remove: () =>
              updatePeekTask(stored => {
                stored.comments = (stored.comments || []).filter(item => item.id !== comment.id);
              })
          };
        }),
        cdraft: this.state.cdraft || '',
        onC: e => this.setState({ cdraft: e.target.value }),
        postC: postComment,
        onCKey: e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postComment();
          }
        },
        created: peekTask.created
          ? 'Created ' +
            new Date(peekTask.created).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: 'numeric',
              minute: '2-digit'
            })
          : '',
        close: () => this.setState({ tpeek: null, pop: null }),
        remove: () => this.delMyTask(id),
        markDone: () => this.myTaskAct(id, 'done'),
        dup: () => this.myTaskAct(id, 'dup'),
        doneLabel: peekTask.done ? '↺ Reopen' : '✓ Mark done',
        doneTip: peekTask.done ? 'Move back to Not started' : 'Mark this task as finished',
        doneBg: peekTask.done ? '#fff' : 'oklch(0.55 0.14 150)',
        doneFg: peekTask.done ? 'oklch(0.35 0.012 265)' : '#fff',
        doneBd: peekTask.done ? 'oklch(0.9 0.006 85)' : 'oklch(0.55 0.14 150)',
        more: registerMenu(
          'pa:' + id,
          'More actions',
          taskActionOptions(peekTask).filter(option => !['open', 'done', 'dup', 'del'].includes(option[0])),
          '',
          value => this.myTaskAct(id, value)
        ),
        noPrev: !navPrev,
        noNext: !navNext,
        prevOp: navPrev ? '1' : '0.4',
        nextOp: navNext ? '1' : '0.4',
        prev: () => navPrev && this.setState({ tpeek: navPrev, pop: null }),
        next: () => navNext && this.setState({ tpeek: navNext, pop: null })
      };
      this._tpPrev = taskPanel.prev;
      this._tpNext = taskPanel.next;
    }
    tasksView.menuOpen = !!(pop && menus[pop]);
    tasksView.menu = menus[pop] || [];
    tasksView.menuTitle = titles[pop] || '';
    tasksView.hasMenuTitle = !!titles[pop];

    // Hiring
    const hireFilter = this.state.hx || HX_DEF,
      hireQuery = (hireFilter.q || '').trim().toLowerCase(),
      setHireFilter = patch => this.setState({ hx: { ...this.state.hx, ...patch } });
    const hiringTimeAgo = timestamp => {
      if (!timestamp) return '';
      const minutes = Math.round((Date.now() - timestamp) / 60000);
      if (minutes < 60) return minutes < 1 ? 'just now' : minutes + ' min ago';
      const hours = Math.round(minutes / 60);
      if (hours < 24) return hours + 'h ago';
      const days = Math.round(hours / 24);
      return days < 30
        ? days + 'd ago'
        : new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };
    const isRoleLate = role => role.stage !== 'Hired' && role.due && dayDiff(role.due) < 0;
    const countHired = role => (role.cands || []).filter(cand => cand.stage === 'Hired').length;
    const countActive = role =>
      (role.cands || []).filter(cand => cand.stage !== 'Rejected' && cand.stage !== 'Hired').length;
    // The 'when' filter and the summary tiles share these buckets.
    const roleMatchesWhen = (role, when) =>
      when === 'any'
        ? true
        : when === 'late'
          ? isRoleLate(role)
          : when === 'soon'
            ? role.stage !== 'Hired' && role.due && dayDiff(role.due) >= 0 && dayDiff(role.due) <= 30
            : when === 'nobudget'
              ? !role.budget
              : when === 'nocand'
                ? role.stage !== 'Hired' && role.stage !== 'Planned' && !countActive(role)
                : when === 'quarter'
                  ? role.stage === 'Hired' && role.hiredAt && Date.now() - role.hiredAt < 92 * 864e5
                  : true;
    const companyRoles = data.roles.filter(role => hireFilter.co === 'any' || role.co === hireFilter.co);
    const filteredRoles = companyRoles.filter(
      role =>
        (hireFilter.owner === 'any' || role.owner === hireFilter.owner) &&
        (hireFilter.pri === 'any' || (role.pri || 'Normal') === hireFilter.pri) &&
        (hireFilter.type === 'any' || (role.type || 'Full-time') === hireFilter.type) &&
        (hireFilter.loc === 'any' || (role.loc || 'Office') === hireFilter.loc) &&
        roleMatchesWhen(role, hireFilter.when) &&
        (!hireQuery ||
          [
            role.role,
            role.notes,
            role.summary,
            ...(role.must || []),
            ...(role.nice || []),
            ...(role.cands || []).map(cand => cand.name + ' ' + (cand.notes || ''))
          ]
            .join(' ')
            .toLowerCase()
            .includes(hireQuery))
    );
    const HIRE_PRIORITY_RANK = { Urgent: 0, Normal: 1, Later: 2 },
      HIRE_PRIORITY_DOT = {
        Urgent: 'oklch(0.6 0.2 25)',
        Normal: 'oklch(0.75 0.14 70)',
        Later: 'oklch(0.75 0.01 265)'
      };
    const compareRoles =
      {
        due: (a, b) => (a.due || '9999').localeCompare(b.due || '9999'),
        pri: (a, b) =>
          HIRE_PRIORITY_RANK[a.pri || 'Normal'] - HIRE_PRIORITY_RANK[b.pri || 'Normal'] ||
          (a.due || '9999').localeCompare(b.due || '9999'),
        budget: (a, b) => (b.budget || 0) - (a.budget || 0),
        newest: (a, b) => (b.created || 0) - (a.created || 0),
        name: (a, b) => (a.role || '').localeCompare(b.role || '')
      }[hireFilter.sort] || (() => 0);
    /** Moves a role one stage forward (+1) or back (-1) and records it in the role's log. */
    const moveStage = (id, direction) =>
      this.upd(draft => {
        const stored = draft.roles.find(item => item.id === id);
        if (!stored) return;
        const stageIndex = STAGES.indexOf(stored.stage),
          nextStage = STAGES[Math.max(0, Math.min(STAGES.length - 1, stageIndex + direction))];
        if (nextStage !== stored.stage) {
          stored.log = [
            ...(stored.log || []),
            { at: Date.now(), by: me, text: 'Stage: ' + stored.stage + ' → ' + nextStage }
          ];
          stored.stage = nextStage;
          if (nextStage === 'Hired') stored.hiredAt = Date.now();
        }
      });
    const buildRoleCard = role => {
      const company = coOf(role.co),
        daysLeft = dayDiff(role.due),
        late = isRoleLate(role),
        stageIndex = STAGES.indexOf(role.stage),
        heads = role.heads || 1,
        hiredCount = countHired(role),
        activeCount = countActive(role);
      return {
        id: role.id,
        role: role.role || 'Untitled role',
        titleColor: role.role ? INK_C : 'oklch(0.65 0.01 265)',
        coName: company.name,
        coTint: company.tint,
        coInk: company.ink,
        owner: (PEOPLE[role.owner] || PEOPLE.both).first,
        ini: (PEOPLE[role.owner] || PEOPLE.both).ini,
        pbg: (PEOPLE[role.owner] || PEOPLE.both).bg,
        stage: role.stage,
        stDot: STG[role.stage] || MUTED,
        pri: role.pri || 'Normal',
        priDot: HIRE_PRIORITY_DOT[role.pri || 'Normal'],
        isUrgent: (role.pri || 'Normal') === 'Urgent',
        type: (role.type || 'Full-time') + ' · ' + (role.loc || 'Office'),
        budget: role.budget ? this.money(role.budget) + ' / mo' : 'No budget',
        budgetColor: role.budget ? INK_C : AMBER,
        due: role.due
          ? late
            ? 'Join by ' + formatDate(role.due) + ' · late'
            : 'Join by ' + formatDate(role.due)
          : 'No join date',
        dueColor: late ? RED : daysLeft !== null && daysLeft <= 14 && role.stage !== 'Hired' ? AMBER : MUTED,
        heads: heads > 1 ? hiredCount + ' / ' + heads + ' hired' : '',
        hasHeads: heads > 1,
        cand: activeCount
          ? activeCount + (activeCount === 1 ? ' candidate' : ' candidates')
          : role.stage === 'Planned' || role.stage === 'Hired'
            ? ''
            : 'No candidates yet',
        candColor: activeCount ? 'oklch(0.42 0.012 265)' : AMBER,
        hasCand: !!activeCount || (role.stage !== 'Planned' && role.stage !== 'Hired'),
        selBg: this.state.peek === role.id ? 'color-mix(in oklch, var(--acc) 6%, #fff)' : '#fff',
        open: () => this.setState({ peek: role.id, hcdraft: '', hsk: '' }),
        back: () => moveStage(role.id, -1),
        fwd: () => moveStage(role.id, 1),
        backOp: stageIndex <= 0 ? '0.3' : '1',
        fwdOp: stageIndex >= STAGES.length - 1 ? '0.3' : '1'
      };
    };
    const hiringTiles = [
      [
        'open',
        'Open roles',
        'oklch(0.6 0.13 255)',
        companyRoles.filter(role => role.stage !== 'Hired').length,
        'Not hired yet'
      ],
      [
        'late',
        'Past join-by date',
        RED,
        companyRoles.filter(isRoleLate).length,
        'Should already have joined'
      ],
      [
        'nocand',
        'No candidates',
        AMBER,
        companyRoles.filter(role => roleMatchesWhen(role, 'nocand')).length,
        'Sourcing or later, but nobody in the pipeline'
      ],
      [
        'soon',
        'Joining in 30 days',
        'oklch(0.75 0.15 70)',
        companyRoles.filter(role => roleMatchesWhen(role, 'soon')).length,
        'Join-by date within a month'
      ],
      [
        'quarter',
        'Hired (90 days)',
        STG.Hired,
        companyRoles.filter(role => roleMatchesWhen(role, 'quarter')).length,
        'Hired in the last 3 months'
      ]
    ].map(([value, label, dot, count, tip]) => {
      const isActive = hireFilter.when === value || (value === 'open' && hireFilter.when === 'open');
      return {
        label,
        dot,
        n: String(count),
        tip,
        color: value === 'late' && count ? RED : INK_C,
        bg: isActive ? 'color-mix(in oklch, var(--acc) 6%, #fff)' : '#fff',
        bd: isActive ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.915 0.006 85)',
        go: () => setHireFilter({ when: isActive ? 'any' : value })
      };
    });
    const hiringSelect = (filterKey, defaultValue, opts, persist) => {
      const isActive = hireFilter[filterKey] !== defaultValue;
      return {
        value: hireFilter[filterKey],
        onChange: e => {
          setHireFilter({ [filterKey]: e.target.value });
          if (persist) localStorage.setItem(KEY + '-h' + filterKey, e.target.value);
        },
        opts: opts.map(([value, label]) => ({ v: value, l: label })),
        bg: isActive ? 'color-mix(in oklch, var(--acc) 8%, #fff)' : '#fff',
        bd: isActive ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.9 0.006 85)',
        fg: isActive ? 'var(--acc2, oklch(0.42 0.17 265))' : 'oklch(0.35 0.012 265)'
      };
    };
    const hiringAnyFilter =
      hireFilter.owner !== 'any' ||
      hireFilter.pri !== 'any' ||
      hireFilter.type !== 'any' ||
      hireFilter.loc !== 'any' ||
      hireFilter.when !== 'any' ||
      !!hireQuery;
    const openRoles = companyRoles.filter(role => role.stage !== 'Hired');
    const roleAsText = role =>
      [
        (role.role || 'Untitled role') + ' · ' + coOf(role.co).full,
        (role.type || 'Full-time') +
          ' · ' +
          (role.loc || 'Office') +
          ((role.heads || 1) > 1 ? ' · ' + role.heads + ' openings' : ''),
        role.budget ? 'Budget: ' + this.money(role.budget) + ' / month' : '',
        role.due ? 'Join by: ' + formatDate(role.due) : '',
        role.summary ? '\nAbout the role:\n' + role.summary : '',
        (role.must || []).length ? '\nMust have:\n' + role.must.map(line => '- ' + line).join('\n') : '',
        (role.nice || []).length ? '\nNice to have:\n' + role.nice.map(line => '- ' + line).join('\n') : ''
      ]
        .filter(Boolean)
        .join('\n');
    const shownRoles =
      hireFilter.when === 'open' ? filteredRoles.filter(role => role.stage !== 'Hired') : filteredRoles;
    const hiringView = {
      add: () => this.newRole('Planned'),
      sub:
        openRoles.length +
        ' open roles · ' +
        this.money(openRoles.reduce((sum, role) => sum + (role.budget || 0) * (role.heads || 1), 0)) +
        ' / month added if all are hired',
      tiles: hiringTiles,
      q: hireFilter.q || '',
      onQ: e => setHireFilter({ q: e.target.value }),
      coTabs: [['any', 'All'], ...CO_OPTS.filter(option => option[0] !== 'all')].map(([value, label]) => {
        const company = coOf(value),
          isActive = hireFilter.co === value;
        return {
          label,
          n: String(
            data.roles.filter(role => (value === 'any' || role.co === value) && role.stage !== 'Hired').length
          ),
          hasTile: !!company.bg && value !== 'any',
          tile: company.bg || '',
          ini: company.ini || '',
          fg: isActive ? INK_C : MUTED,
          bd: isActive ? INK_C : 'transparent',
          go: () => setHireFilter({ co: value })
        };
      }),
      filters: [
        hiringSelect('owner', 'any', [
          ['any', 'Any hiring manager'],
          ...memberOpts().map(([personId, label]) => [personId, 'Manager: ' + label])
        ]),
        hiringSelect('pri', 'any', [
          ['any', 'Any priority'],
          ['Urgent', 'Priority: Urgent'],
          ['Normal', 'Priority: Normal'],
          ['Later', 'Priority: Later']
        ]),
        hiringSelect('type', 'any', [
          ['any', 'Any type'],
          ['Full-time', 'Full-time'],
          ['Part-time', 'Part-time'],
          ['Contract', 'Contract'],
          ['Intern', 'Intern']
        ]),
        hiringSelect('loc', 'any', [
          ['any', 'Any location'],
          ['Office', 'In office'],
          ['Remote', 'Remote'],
          ['Hybrid', 'Hybrid']
        ]),
        hiringSelect('when', 'any', [
          ['any', 'Any time'],
          ['open', 'Open roles only'],
          ['late', 'Past join-by date'],
          ['soon', 'Joining in 30 days'],
          ['nocand', 'No candidates yet'],
          ['nobudget', 'No budget set'],
          ['quarter', 'Hired in last 90 days']
        ])
      ],
      sortSel: [
        hiringSelect(
          'sort',
          '__',
          [
            ['due', 'Sort: Join-by date'],
            ['pri', 'Sort: Priority'],
            ['budget', 'Sort: Budget (high first)'],
            ['newest', 'Sort: Newest first'],
            ['name', 'Sort: Name A–Z']
          ],
          true
        )
      ].map(filter => ({ ...filter, bg: '#fff', bd: 'oklch(0.9 0.006 85)', fg: 'oklch(0.35 0.012 265)' })),
      viewSeg: segOf(
        [
          ['board', 'Board'],
          ['list', 'List']
        ],
        hireFilter.view,
        value => {
          localStorage.setItem(KEY + '-hview', value);
          setHireFilter({ view: value });
        }
      ),
      isBoard: hireFilter.view !== 'list',
      isList: hireFilter.view === 'list',
      anyFilter: hiringAnyFilter,
      clear: () => setHireFilter({ owner: 'any', pri: 'any', type: 'any', loc: 'any', when: 'any', q: '' }),
      shown:
        shownRoles.length +
        (shownRoles.length === 1 ? ' role' : ' roles') +
        (hiringAnyFilter ? ' match' : ''),
      cols: STAGES.map(stage => {
        const stageRoles = shownRoles.filter(role => role.stage === stage).sort(compareRoles);
        return {
          label: stage,
          dot: STG[stage],
          n: String(stageRoles.length),
          cost: stageRoles.length
            ? this.money(stageRoles.reduce((sum, role) => sum + (role.budget || 0) * (role.heads || 1), 0)) +
              ' / mo'
            : '',
          add: () => this.newRole(stage),
          items: stageRoles.map(buildRoleCard),
          empty: !stageRoles.length
        };
      }),
      list: shownRoles.slice().sort(compareRoles).map(buildRoleCard),
      empty: !shownRoles.length,
      emptyTitle: data.roles.length ? 'No roles match these filters' : 'No roles planned yet',
      emptyFilter: !!data.roles.length && hiringAnyFilter,
      copyList: () => {
        if (navigator.clipboard)
          navigator.clipboard.writeText(
            shownRoles
              .slice()
              .sort(compareRoles)
              .map(
                role =>
                  '- ' +
                  (role.role || 'Untitled role') +
                  ' (' +
                  coOf(role.co).name +
                  ', ' +
                  role.stage +
                  (role.due ? ', join by ' + formatDate(role.due) : '') +
                  (role.budget ? ', ' + this.money(role.budget) + '/mo' : '') +
                  ')'
              )
              .join('\n')
          );
        this.toastMsg('Copied ' + shownRoles.length + ' roles');
      }
    };
    // Role detail panel (opened with state.peek).
    const peekRole = data.roles.find(role => role.id === this.state.peek);
    let rolePanel = { close: () => this.setState({ peek: null }) };
    if (peekRole) {
      const role = peekRole,
        id = role.id,
        navOrder =
          hireFilter.view === 'list'
            ? hiringView.list.map(card => card.id)
            : hiringView.cols.flatMap(column => column.items.map(card => card.id)),
        navIndex = navOrder.indexOf(id),
        prevId = navIndex > 0 ? navOrder[navIndex - 1] : null,
        nextId = navIndex > -1 && navIndex < navOrder.length - 1 ? navOrder[navIndex + 1] : null;
      const updateRole = mutate =>
        this.upd(draft => {
          const stored = draft.roles.find(item => item.id === id);
          if (stored) mutate(stored, draft);
        });
      const setField = (field, value) =>
        updateRole(stored => {
          const prev = stored[field];
          stored[field] = value;
          if (field === 'stage' && prev !== value) {
            stored.log = [
              ...(stored.log || []),
              { at: Date.now(), by: me, text: 'Stage: ' + prev + ' → ' + value }
            ];
            if (value === 'Hired') stored.hiredAt = Date.now();
          }
        });
      const candidates = role.cands || [],
        candFilter = this.state.hcf || 'active';
      const visibleCands = candidates.filter(cand =>
        candFilter === 'all'
          ? true
          : candFilter === 'active'
            ? cand.stage !== 'Rejected' && cand.stage !== 'Hired'
            : cand.stage === candFilter
      );
      // Changing a candidate's stage is logged; once enough candidates are Hired to fill every
      // opening, the role itself is marked Hired.
      const setCandField = (candId, field, value) =>
        updateRole(stored => {
          const cand = (stored.cands || []).find(item => item.id === candId);
          if (!cand) return;
          const prev = cand[field];
          cand[field] = value;
          if (field === 'stage' && prev !== value) {
            stored.log = [
              ...(stored.log || []),
              { at: Date.now(), by: me, text: (cand.name || 'Candidate') + ': ' + prev + ' → ' + value }
            ];
            if (value === 'Hired') {
              const hiredCount = (stored.cands || []).filter(item => item.stage === 'Hired').length;
              if (hiredCount >= (stored.heads || 1) && stored.stage !== 'Hired') {
                stored.stage = 'Hired';
                stored.hiredAt = Date.now();
                stored.log.push({ at: Date.now(), by: me, text: 'All openings filled. Role marked Hired' });
              }
            }
          }
        });
      const addList = (field, text) => {
        const trimmed = (text || '').trim();
        if (!trimmed) return;
        updateRole(stored => {
          stored[field] = [...(stored[field] || []), trimmed];
        });
      };
      const postC = () => {
        const text = (this.state.hcdraft || '').trim();
        if (!text) return;
        updateRole(stored => {
          stored.comments = [...(stored.comments || []), { id: uid(), by: me, text, at: Date.now() }];
        });
        this.setState({ hcdraft: '' });
      };
      // Team tasks made from this role (workspace ttLinks).
      const followUps = this.tasksAll().filter(task => task.role === id),
        steps = role.steps || [];
      const SOURCES = ['LinkedIn', 'Naukri', 'Referral', 'Agency', 'Careers page', 'Campus', 'Other'];
      rolePanel = {
        id,
        role: role.role,
        onRole: e => setField('role', e.target.value),
        coName: coOf(role.co).name,
        coTint: coOf(role.co).tint,
        coInk: coOf(role.co).ink,
        stage: role.stage,
        stDot: STG[role.stage] || MUTED,
        stageSeg: segOf(
          STAGES.map(stage => [stage, stage]),
          role.stage,
          value => setField('stage', value)
        ),
        coSeg: segOf(
          CO_OPTS.filter(option => option[0] !== 'all'),
          role.co,
          value => setField('co', value)
        ),
        ownerSeg: segOf(OWNER_OPTS, role.owner, value => setField('owner', value)),
        priSeg: segOf(
          [
            ['Urgent', 'Urgent'],
            ['Normal', 'Normal'],
            ['Later', 'Later']
          ],
          role.pri || 'Normal',
          value => setField('pri', value)
        ),
        typeSeg: segOf(
          [
            ['Full-time', 'Full-time'],
            ['Part-time', 'Part-time'],
            ['Contract', 'Contract'],
            ['Intern', 'Intern']
          ],
          role.type || 'Full-time',
          value => setField('type', value)
        ),
        locSeg: segOf(
          [
            ['Office', 'Office'],
            ['Remote', 'Remote'],
            ['Hybrid', 'Hybrid']
          ],
          role.loc || 'Office',
          value => setField('loc', value)
        ),
        heads: String(role.heads || 1),
        onHeads: e => setField('heads', Math.max(1, Number(e.target.value) || 1)),
        headsInfo: countHired(role) + ' of ' + (role.heads || 1) + ' filled',
        budget: role.budget ? String(role.budget) : '',
        onBudget: e => setField('budget', Number(e.target.value) || 0),
        budgetInfo: role.budget
          ? this.money(role.budget * 12) +
            ' a year' +
            ((role.heads || 1) > 1
              ? ' each · ' + this.money(role.budget * (role.heads || 1)) + ' / mo total'
              : '')
          : 'Shows in the Finance "What if" planner',
        due: role.due || '',
        onDue: e => setField('due', e.target.value),
        dueColor: isRoleLate(role) ? RED : INK_C,
        lateHint: isRoleLate(role) ? 'Late by ' + -dayDiff(role.due) + 'd' : '',
        hasLate: isRoleLate(role),
        sources: SOURCES.map(source => {
          const isActive = (role.sources || []).includes(source);
          return {
            label: source,
            bg: isActive ? 'color-mix(in oklch, var(--acc) 10%, #fff)' : '#fff',
            bd: isActive ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.88 0.008 85)',
            fg: isActive ? 'var(--acc2, oklch(0.42 0.17 265))' : 'oklch(0.42 0.012 265)',
            mark: isActive ? '✓ ' : '',
            go: () =>
              updateRole(stored => {
                stored.sources = isActive
                  ? (stored.sources || []).filter(item => item !== source)
                  : [...(stored.sources || []), source];
              })
          };
        }),
        summary: role.summary || role.notes || '',
        onSummary: e =>
          updateRole(stored => {
            stored.summary = e.target.value;
            stored.notes = '';
          }),
        must: (role.must || []).map((skill, index) => ({
          t: skill,
          remove: () =>
            updateRole(stored => {
              stored.must = (stored.must || []).filter((_, otherIndex) => otherIndex !== index);
            })
        })),
        nice: (role.nice || []).map((skill, index) => ({
          t: skill,
          remove: () =>
            updateRole(stored => {
              stored.nice = (stored.nice || []).filter((_, otherIndex) => otherIndex !== index);
            })
        })),
        skDraft: this.state.hsk || '',
        onSk: e => this.setState({ hsk: e.target.value }),
        addMust: () => {
          addList('must', this.state.hsk);
          this.setState({ hsk: '' });
        },
        addNice: () => {
          addList('nice', this.state.hsk);
          this.setState({ hsk: '' });
        },
        onSkKey: e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addList('must', this.state.hsk);
            this.setState({ hsk: '' });
          }
        },
        candSeg: segOf(
          [['active', 'Active'], ...CSTAGES.map(stage => [stage, stage]), ['all', 'All']],
          candFilter,
          value => this.setState({ hcf: value })
        ),
        funnel: CSTAGES.filter(stage => stage !== 'Rejected').map(stage => {
          const count = candidates.filter(cand => cand.stage === stage).length;
          return { label: stage, n: String(count), dot: CST[stage] };
        }),
        rejN: candidates.filter(cand => cand.stage === 'Rejected').length + ' rejected',
        cands: visibleCands.map(cand => ({
          id: cand.id,
          name: cand.name || '',
          onName: e => setCandField(cand.id, 'name', e.target.value),
          stage: cand.stage,
          dot: CST[cand.stage] || MUTED,
          stOpts: CSTAGES.map(stage => ({ v: stage, l: stage })),
          onStage: e => setCandField(cand.id, 'stage', e.target.value),
          src: cand.source || '',
          srcOpts: [{ v: '', l: 'Source…' }, ...SOURCES.map(source => ({ v: source, l: source }))],
          onSrc: e => setCandField(cand.id, 'source', e.target.value),
          stars: [1, 2, 3, 4, 5].map(star => ({
            ch: star <= (cand.rating || 0) ? '★' : '☆',
            col: star <= (cand.rating || 0) ? 'oklch(0.7 0.15 75)' : 'oklch(0.8 0.01 265)',
            go: () => setCandField(cand.id, 'rating', cand.rating === star ? 0 : star)
          })),
          ctc: cand.ctc ? String(cand.ctc) : '',
          onCtc: e => setCandField(cand.id, 'ctc', Number(e.target.value) || 0),
          overBudget: !!(cand.ctc && role.budget && cand.ctc > role.budget),
          overTxt:
            cand.ctc && role.budget && cand.ctc > role.budget
              ? 'Over budget by ' + this.money(cand.ctc - role.budget)
              : '',
          link: cand.link || '',
          onLink: e => setCandField(cand.id, 'link', e.target.value),
          hasLink: /^https?:\/\//i.test(cand.link || ''),
          notes: cand.notes || '',
          onNotes: e => setCandField(cand.id, 'notes', e.target.value),
          op: cand.stage === 'Rejected' ? '0.6' : '1',
          remove: () => {
            const snapshot = JSON.parse(JSON.stringify(cand));
            updateRole(stored => {
              stored.cands = (stored.cands || []).filter(item => item.id !== cand.id);
            });
            this.toastMsg('Removed ' + (cand.name || 'candidate'), () =>
              updateRole(stored => {
                stored.cands = [...(stored.cands || []), snapshot];
              })
            );
          }
        })),
        hasCands: !!visibleCands.length,
        noCands: !visibleCands.length,
        candInfo: candidates.length ? countActive(role) + ' active · ' + candidates.length + ' total' : '',
        addCand: () => {
          const candId = uid();
          updateRole(stored => {
            stored.cands = [
              ...(stored.cands || []),
              {
                id: candId,
                name: '',
                stage: 'Applied',
                source: '',
                rating: 0,
                ctc: 0,
                link: '',
                notes: '',
                added: Date.now()
              }
            ];
            if (stored.stage === 'Planned') {
              stored.stage = 'Sourcing';
            }
          });
          this.setState({ hcf: 'active' });
          this._focus = { sel: '[data-cid="' + candId + '"]' };
        },
        steps: steps.map((step, index) => ({
          text: step.text,
          onText: e =>
            updateRole(stored => {
              stored.steps[index].text = e.target.value;
            }),
          remove: () =>
            updateRole(stored => {
              stored.steps = stored.steps.filter((_, otherIndex) => otherIndex !== index);
            }),
          up: () =>
            index > 0 &&
            updateRole(stored => {
              [stored.steps[index - 1], stored.steps[index]] = [stored.steps[index], stored.steps[index - 1]];
            }),
          n: String(index + 1)
        })),
        addStep: () =>
          updateRole(stored => {
            stored.steps = [...(stored.steps || []), { id: uid(), text: '' }];
          }),
        fols: followUps.map(task => {
          return {
            title: task.title || 'Untitled task',
            deco: task.done ? 'line-through' : 'none',
            color: task.done ? MUTED : INK_C,
            mark: task.done ? '✓' : '',
            checkBg: task.done ? 'oklch(0.55 0.14 150)' : '#fff',
            checkBorder: task.done ? 'oklch(0.55 0.14 150)' : 'oklch(0.75 0.01 265)',
            ini: initialsOf(task.assignee || '?'),
            bg: 'oklch(0.55 0.1 265)',
            due: task.due ? formatDate(task.due) : 'No date',
            toggle: () => this.toggleTask(task),
            open: () => this.openTask(task.id)
          };
        }),
        hasFols: !!followUps.length,
        noFols: !followUps.length,
        folInfo: followUps.length
          ? followUps.filter(task => task.done).length + ' of ' + followUps.length + ' done'
          : '',
        // A team task for me about this role, due in a week.
        addFol: () => this.makeTeamTask({
          title: 'Hiring: ' + (role.role || 'role'),
          co: role.co,
          due: plus(7),
          pri: role.pri === 'Urgent' ? 'High' : 'Medium',
          from: 'the hiring role “' + (role.role || 'Untitled role') + '”',
        }, { role: id }),
        comments: (role.comments || []).map(comment => {
          const author = PEOPLE[comment.by] || PEOPLE.both;
          return {
            ini: author.ini,
            bg: author.bg,
            name: author.first,
            text: comment.text,
            when: hiringTimeAgo(comment.at),
            remove: () =>
              updateRole(stored => {
                stored.comments = (stored.comments || []).filter(item => item.id !== comment.id);
              })
          };
        }),
        cdraft: this.state.hcdraft || '',
        onC: e => this.setState({ hcdraft: e.target.value }),
        postC,
        onCKey: e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postC();
          }
        },
        log: [...(role.log || [])].reverse().map(entry => ({
          text: entry.text,
          who: (PEOPLE[entry.by] || PEOPLE.both).first,
          when: hiringTimeAgo(entry.at)
        })),
        hasLog: !!(role.log || []).length,
        meta: role.created
          ? 'Created ' +
            new Date(role.created).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          : '',
        isHired: role.stage === 'Hired',
        notHired: role.stage !== 'Hired',
        nextLabel:
          role.stage === 'Hired'
            ? ''
            : '→ Move to ' + STAGES[Math.min(STAGES.length - 1, STAGES.indexOf(role.stage) + 1)],
        advance: () => {
          moveStage(id, 1);
          this.toastMsg('Moved to ' + STAGES[Math.min(STAGES.length - 1, STAGES.indexOf(role.stage) + 1)]);
        },
        reopen: () => setField('stage', 'Offer'),
        dup: () => {
          const newId = uid(),
            copy = JSON.parse(JSON.stringify(role));
          Object.assign(copy, {
            id: newId,
            role: (role.role || 'Untitled role') + ' (copy)',
            stage: 'Planned',
            cands: [],
            comments: [],
            hiredAt: null,
            created: Date.now(),
            log: [{ at: Date.now(), by: me, text: 'Copied from another role' }]
          });
          this.upd(draft => {
            const index = draft.roles.findIndex(item => item.id === id);
            draft.roles.splice(index + 1, 0, copy);
          });
          this.setState({ peek: newId });
          this.toastMsg('Copy created and opened');
        },
        copyJD: () => {
          if (navigator.clipboard) navigator.clipboard.writeText(roleAsText(role));
          this.toastMsg('Job post copied. Paste into LinkedIn or Naukri.');
        },
        remove: () => {
          const index = data.roles.findIndex(item => item.id === id),
            snapshot = JSON.parse(JSON.stringify(role));
          this.upd(draft => {
            draft.roles = draft.roles.filter(item => item.id !== id);
          });
          this.setState({ peek: null });
          this.toastMsg('Deleted “' + (role.role || 'Untitled role') + '”', () =>
            this.upd(draft => {
              if (!draft.roles.some(item => item.id === id))
                draft.roles.splice(Math.min(index, draft.roles.length), 0, snapshot);
            })
          );
        },
        prev: () => prevId && this.setState({ peek: prevId, hcdraft: '' }),
        next: () => nextId && this.setState({ peek: nextId, hcdraft: '' }),
        prevOp: prevId ? '1' : '0.4',
        nextOp: nextId ? '1' : '0.4',
        noPrev: !prevId,
        noNext: !nextId,
        close: () => this.setState({ peek: null })
      };
    }
    // Docs
    const allPages = data.pages,
      pages = allPages.filter(page => !page.trashed),
      expanded = this.state.exp,
      docQuery = this.state.dq.trim().toLowerCase(),
      docFilter = this.state.dfx,
      docTab = this.state.docTab || 'home';
    const setDocFilter = patch => this.setState({ dfx: { ...this.state.dfx, ...patch } });
    const docTimeAgo = timestamp => {
      if (!timestamp) return '';
      const minutes = Math.round((Date.now() - timestamp) / 60000);
      if (minutes < 60) return minutes < 1 ? 'just now' : minutes + ' min ago';
      const hours = Math.round(minutes / 60);
      if (hours < 24) return hours + 'h ago';
      const days = Math.round(hours / 24);
      return days < 30
        ? days + 'd ago'
        : new Date(timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
    };
    const childPages = parentId =>
      pages
        .filter(page => (page.parent || null) === parentId)
        .sort((a, b) => (a.created || 0) - (b.created || 0));
    const currentPage = pages.find(page => page.id === this.state.page) || null;
    const onPageTab = docTab === 'page' && !!currentPage;
    /** Ids of a page and all of its nested sub-pages. */
    const descendantIds = rootId => {
      const ids = new Set([rootId]);
      let grow = true;
      while (grow) {
        grow = false;
        allPages.forEach(page => {
          if (page.parent && ids.has(page.parent) && !ids.has(page.id)) {
            ids.add(page.id);
            grow = true;
          }
        });
      }
      return ids;
    };
    const isStarred = page => (page.star || []).includes(me);
    const pageText = page => (page.blocks || []).map(block => block.text || '').join(' ');
    const treeNode = (page, depth) => {
      const childCount = childPages(page.id).length,
        isCurrent = onPageTab && page.id === currentPage.id;
      return {
        title: page.title || 'Untitled',
        pad: depth * 14 + 'px',
        caret: childCount ? (expanded[page.id] ? '▾' : '▸') : '',
        fw: isCurrent ? '600' : '500',
        fg: isCurrent ? 'oklch(0.2 0.015 265)' : 'oklch(0.36 0.012 265)',
        bg: isCurrent ? 'oklch(0.92 0.008 85)' : 'transparent',
        star: isStarred(page) ? '★' : '',
        toggleExp: () => this.setState(prev => ({ exp: { ...prev.exp, [page.id]: !prev.exp[page.id] } })),
        go: () => this.setState({ page: page.id, docTab: 'page' }),
        addSub: () => this.addPage(page.id)
      };
    };
    // Flattened sidebar tree: children are listed only under expanded pages.
    const tree = [];
    {
      const walk = (parentId, depth) =>
        childPages(parentId).forEach(page => {
          tree.push(treeNode(page, depth));
          if (expanded[page.id]) walk(page.id, depth + 1);
        });
      walk(null, 0);
    }
    const liveFiles = data.files.filter(file => !file.trashed);
    const fileCompany = this.state.fileCo;
    const pageMatches = page =>
      (fileCompany === 'any' || page.co === fileCompany) &&
      (docFilter.owner === 'any' || (page.by || 'both') === docFilter.owner) &&
      (docFilter.tag === 'any' || (page.tags || []).includes(docFilter.tag)) &&
      (docFilter.status === 'any' || (page.status || 'Draft') === docFilter.status) &&
      (!docQuery ||
        ((page.title || '') + ' ' + pageText(page) + ' ' + (page.tags || []).join(' '))
          .toLowerCase()
          .includes(docQuery));
    const fileMatches = file =>
      (fileCompany === 'any' || file.co === fileCompany) &&
      (docFilter.owner === 'any' || file.by === docFilter.owner) &&
      (docFilter.ftype === 'any' || ftypeOf(file.name) === docFilter.ftype) &&
      (docFilter.tag === 'any' || (file.tags || []).includes(docFilter.tag)) &&
      (!docQuery || ((file.name || '') + ' ' + (file.tags || []).join(' ')).toLowerCase().includes(docQuery));
    const allTags = [
      ...new Set([...pages.flatMap(page => page.tags || []), ...liveFiles.flatMap(file => file.tags || [])])
    ].sort();
    const pageCard = page => {
      const company = coOf(page.co),
        author = PEOPLE[page.by] || PEOPLE.both,
        words = pageText(page).split(/\s+/).filter(Boolean).length;
      const previewText = pageText(page).slice(0, 140);
      return {
        kind: 'Page',
        isPage: true,
        isFile: false,
        id: page.id,
        title: page.title || 'Untitled',
        titleColor: page.title ? INK_C : 'oklch(0.6 0.01 265)',
        preview: previewText || 'Empty page',
        coName: company.name,
        coTint: company.tint,
        coInk: company.ink,
        who: author.first,
        ini: author.ini,
        pbg: author.bg,
        when: 'Edited ' + docTimeAgo(page.updated),
        sortT: page.updated || 0,
        name: (page.title || '').toLowerCase(),
        size: words,
        meta: words + (words === 1 ? ' word' : ' words'),
        status: page.status || 'Draft',
        stBg:
          (page.status || 'Draft') === 'Final'
            ? 'oklch(0.94 0.05 150)'
            : (page.status || 'Draft') === 'In review'
              ? 'oklch(0.95 0.05 80)'
              : 'oklch(0.95 0.004 265)',
        stFg:
          (page.status || 'Draft') === 'Final'
            ? 'oklch(0.38 0.1 150)'
            : (page.status || 'Draft') === 'In review'
              ? 'oklch(0.45 0.11 65)'
              : 'oklch(0.42 0.012 265)',
        star: isStarred(page) ? '★' : '☆',
        starC: isStarred(page) ? 'oklch(0.7 0.15 75)' : 'oklch(0.75 0.01 265)',
        toggleStar: () =>
          this.upd(draft => {
            const stored = draft.pages.find(item => item.id === page.id);
            if (stored)
              stored.star = isStarred(page)
                ? (stored.star || []).filter(person => person !== me)
                : [...(stored.star || []), me];
          }),
        tags: (page.tags || []).map(tag => ({ t: tag })),
        icon: '¶',
        iconBg: 'oklch(0.95 0.005 85)',
        iconFg: 'oklch(0.35 0.012 265)',
        hasThumb: false,
        thumb: '',
        sel: false,
        selMark: '',
        selBg: '#fff',
        selBd: 'oklch(0.8 0.01 265)',
        toggleSel: () => {},
        go: () => this.setState({ page: page.id, docTab: 'page' })
      };
    };
    const fileSelection = this.state.fsel || {};
    const fileCard = file => {
      const company = coOf(file.co),
        author = PEOPLE[file.by] || PEOPLE.both,
        fileType = ftypeOf(file.name),
        typeColors = FT_C[fileType],
        isImage = fileType === 'img' && !/svg$/i.test(file.name);
      if (isImage) this.loadThumb(file);
      const thumbUrl = (this.state.thumbs || {})[file.id],
        isSelected = !!fileSelection[file.id],
        linkedPage = file.page && pages.find(page => page.id === file.page);
      return {
        kind: 'File',
        isPage: false,
        isFile: true,
        id: file.id,
        title: file.name,
        name: (file.name || '').toLowerCase(),
        titleColor: INK_C,
        preview: '',
        coName: company.name,
        coTint: company.tint,
        coInk: company.ink,
        co: file.co,
        coOpts: CO_OPTS.map(([value, label]) => ({ v: value, l: label })),
        who: author.first,
        ini: author.ini,
        pbg: author.bg,
        when: 'Added ' + docTimeAgo(file.added),
        sortT: file.added || 0,
        size: file.size || 0,
        meta:
          fmtSize(file.size || 0) + (linkedPage ? ' · in “' + (linkedPage.title || 'Untitled') + '”' : ''),
        ext: (file.name.split('.').pop() || 'file').slice(0, 4).toUpperCase(),
        icon: (file.name.split('.').pop() || 'file').slice(0, 4).toUpperCase(),
        iconBg: typeColors[0],
        iconFg: typeColors[1],
        hasThumb: !!thumbUrl,
        thumb: thumbUrl || '',
        noThumb: !thumbUrl,
        canPreview: fileType === 'img' || fileType === 'pdf' || /txt$/i.test(file.name),
        tags: (file.tags || []).map(tag => ({ t: tag })),
        star: '',
        starC: '',
        status: '',
        stBg: '',
        stFg: '',
        sel: isSelected,
        selMark: isSelected ? '✓' : '',
        selBg: isSelected ? 'var(--acc, oklch(0.5 0.17 265))' : '#fff',
        selBd: isSelected ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.78 0.01 265)',
        toggleSel: () => this.setState({ fsel: { ...fileSelection, [file.id]: !isSelected } }),
        rename: file.name,
        onRename: e => {
          const value = e.target.value;
          this.upd(draft => {
            const stored = draft.files.find(item => item.id === file.id);
            if (stored) stored.name = value;
          });
        },
        onCo: e => {
          const value = e.target.value;
          this.upd(draft => {
            const stored = draft.files.find(item => item.id === file.id);
            if (stored) stored.co = value;
          });
        },
        pageOpts: [
          { v: '', l: 'Not attached' },
          ...pages.map(page => ({ v: page.id, l: page.title || 'Untitled' }))
        ],
        page: file.page || '',
        onPage: e => {
          const value = e.target.value;
          this.upd(draft => {
            const stored = draft.files.find(item => item.id === file.id);
            if (stored) stored.page = value;
          });
        },
        go: () => this.previewFile(file),
        open: () => this.download(file),
        preview2: () => this.previewFile(file),
        remove: () => {
          this.upd(draft => {
            const stored = draft.files.find(item => item.id === file.id);
            if (stored) stored.trashed = Date.now();
          });
          this.toastMsg('Moved “' + file.name + '” to Trash', () =>
            this.upd(draft => {
              const stored = draft.files.find(item => item.id === file.id);
              if (stored) delete stored.trashed;
            })
          );
        }
      };
    };
    const compareItems =
      {
        edited: (a, b) => b.sortT - a.sortT,
        oldest: (a, b) => a.sortT - b.sortT,
        name: (a, b) => a.name.localeCompare(b.name),
        size: (a, b) => b.size - a.size
      }[docFilter.sort] || ((a, b) => b.sortT - a.sortT);
    const homeItems = [
      ...(docFilter.kind !== 'files' ? pages.filter(pageMatches).map(pageCard) : []),
      ...(docFilter.kind !== 'pages' ? liveFiles.filter(fileMatches).map(fileCard) : [])
    ].sort(compareItems);
    const starred = pages.filter(isStarred).map(pageCard);
    const fileList = liveFiles.filter(fileMatches).map(fileCard).sort(compareItems);
    const selIds = Object.keys(fileSelection).filter(
      fileId => fileSelection[fileId] && liveFiles.some(file => file.id === fileId)
    );
    const trashedPages = allPages.filter(
        page =>
          page.trashed &&
          !(page.parent && allPages.find(candidate => candidate.id === page.parent && candidate.trashed))
      ),
      trashedFiles = data.files.filter(file => file.trashed);
    const purgeFile = fileId => {
      idb('readwrite', store => store.delete(fileId)).catch(() => {});
    };
    const docSelect = (filterKey, defaultValue, opts, _persist) => {
      const isActive = docFilter[filterKey] !== defaultValue;
      return {
        value: docFilter[filterKey],
        onChange: e => {
          setDocFilter({ [filterKey]: e.target.value });
        },
        opts: opts.map(([value, label]) => ({ v: value, l: label })),
        bg: isActive ? 'color-mix(in oklch, var(--acc) 8%, #fff)' : '#fff',
        bd: isActive ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.9 0.006 85)',
        fg: isActive ? 'var(--acc2, oklch(0.42 0.17 265))' : 'oklch(0.35 0.012 265)'
      };
    };
    const docAnyFilter =
      docFilter.owner !== 'any' ||
      docFilter.tag !== 'any' ||
      docFilter.status !== 'any' ||
      docFilter.ftype !== 'any' ||
      docFilter.kind !== 'all' ||
      !!docQuery;
    // Breadcrumb trail from the top-level page down to the current page's parent.
    const breadcrumbs = [];
    if (currentPage) {
      let ancestor = pages.find(page => page.id === currentPage.parent);
      while (ancestor) {
        const crumb = ancestor;
        breadcrumbs.unshift({
          title: ancestor.title || 'Untitled',
          go: () => this.setState({ page: crumb.id, docTab: 'page' })
        });
        ancestor = pages.find(page => page.id === ancestor.parent);
      }
    }
    const blocks = currentPage ? this.blocksVM(currentPage.id, currentPage.blocks) : [];
    const pageCompany = currentPage ? coOf(currentPage.co) : GEN;
    const words = currentPage ? pageText(currentPage).split(/\s+/).filter(Boolean).length : 0;
    const setPageField = (field, value) =>
      currentPage &&
      this.updPage(currentPage.id, stored => {
        stored[field] = value;
      });
    const addPageTag = () => {
      const tag = (this.state.ptag || '').trim().replace(/^#/, '');
      if (!tag || !currentPage) return;
      setPageField('tags', [...new Set([...(currentPage.tags || []), tag])]);
      this.setState({ ptag: '' });
    };
    /** Moves a page and its sub-pages to Trash, with an undo toast. */
    const trashPage = page => {
      const ids = descendantIds(page.id),
        trashedAt = Date.now();
      this.upd(draft => {
        draft.pages.forEach(item => {
          if (ids.has(item.id)) item.trashed = trashedAt;
        });
      });
      this.setState({ page: page.parent || null, docTab: page.parent ? 'page' : 'home' });
      this.toastMsg(
        'Moved “' +
          (page.title || 'Untitled') +
          '” to Trash' +
          (ids.size > 1 ? ' with ' + (ids.size - 1) + ' inside' : ''),
        () => {
          this.upd(draft => {
            draft.pages.forEach(item => {
              if (ids.has(item.id) && item.trashed === trashedAt) delete item.trashed;
            });
          });
          this.setState({ page: page.id, docTab: 'page' });
        }
      );
    };
    const toc = currentPage
      ? (currentPage.blocks || [])
          .filter(block => /^h[123]$/.test(block.type) && (block.text || '').trim())
          .map(block => ({
            text: block.text,
            pad: block.type === 'h1' ? '0px' : block.type === 'h2' ? '12px' : '24px',
            fw: block.type === 'h1' ? '600' : '500',
            go: () => {
              this.focusBlock(block.id, 'end');
              this.forceUpdate();
            }
          }))
      : [];
    const attached = currentPage ? liveFiles.filter(file => file.page === currentPage.id).map(fileCard) : [];
    const docSegment = (opts, current, onPick) => segOf(opts, current, onPick);
    const docsView = {
      note: this.state.docNote,
      hasNote: !!this.state.docNote,
      onImport: e => this.importNotion(e),
      onUpload: e => this.upload(e),
      q: this.state.dq,
      onQ: e =>
        this.setState({
          dq: e.target.value,
          docTab: docTab === 'page' || docTab === 'trash' ? 'home' : docTab
        }),
      tree,
      addPage: () => this.addPage(null),
      goFiles: () => this.setState({ docTab: 'files' }),
      goHome: () => this.setState({ docTab: 'home' }),
      goTrash: () => this.setState({ docTab: 'trash' }),
      goStar: () => this.setState({ docTab: 'home', dfx: { ...docFilter, kind: 'pages' } }),
      homeBg: docTab === 'home' ? 'oklch(0.92 0.008 85)' : 'transparent',
      filesBg: docTab === 'files' ? 'oklch(0.92 0.008 85)' : 'transparent',
      trashBg: docTab === 'trash' ? 'oklch(0.92 0.008 85)' : 'transparent',
      fileCount: String(liveFiles.length),
      pageCount: String(pages.length),
      trashCount: String(trashedPages.length + trashedFiles.length),
      hasTrash: !!(trashedPages.length + trashedFiles.length),
      isHome: docTab === 'home' || (docTab === 'page' && !currentPage),
      isPage: onPageTab,
      isFiles: docTab === 'files',
      isTrash: docTab === 'trash',
      isEmpty: false,
      tpls: DOC_TPL.map(template => ({
        name: template[0],
        desc: template[1],
        go: () => this.addPage(null, template)
      })),
      starred,
      hasStarred: !!starred.length,
      coTabs: [['any', 'All'], ...CO_OPTS].map(([value, label]) => {
        const company = coOf(value),
          isActive = fileCompany === value;
        return {
          label,
          hasTile: !!company.bg && value !== 'any',
          tile: company.bg || '',
          ini: company.ini || '',
          fg: isActive ? INK_C : MUTED,
          bd: isActive ? INK_C : 'transparent',
          go: () => this.setState({ fileCo: value, fsel: {} })
        };
      }),
      kindSeg: docSegment(
        [
          ['all', 'Everything'],
          ['pages', 'Pages'],
          ['files', 'Files']
        ],
        docFilter.kind,
        value => setDocFilter({ kind: value })
      ),
      viewSeg: docSegment(
        [
          ['grid', 'Grid'],
          ['list', 'List']
        ],
        docFilter.view,
        value => {
          localStorage.setItem(KEY + '-dview', value);
          setDocFilter({ view: value });
        }
      ),
      isGrid: docFilter.view !== 'list',
      isList: docFilter.view === 'list',
      filters: [
        docSelect('owner', 'any', [
          ['any', 'Anyone'],
          ...memberOpts(false).map(([personId, label]) => [personId, 'By ' + label])
        ]),
        docSelect('status', 'any', [
          ['any', 'Any status'],
          ['Draft', 'Draft'],
          ['In review', 'In review'],
          ['Final', 'Final']
        ]),
        docSelect('tag', 'any', [
          ['any', allTags.length ? 'Any tag' : 'No tags yet'],
          ...allTags.map(tag => [tag, '#' + tag])
        ]),
        docSelect('ftype', 'any', [
          ['any', 'Any file type'],
          ...FTYPES.map(tag => [tag[0], tag[1]]),
          ['other', 'Other']
        ])
      ],
      sortSel: {
        value: docFilter.sort,
        onChange: e => setDocFilter({ sort: e.target.value }),
        opts: [
          ['edited', 'Newest first'],
          ['oldest', 'Oldest first'],
          ['name', 'Name A–Z'],
          ['size', 'Largest first']
        ].map(([value, label]) => ({ v: value, l: label }))
      },
      anyFilter: docAnyFilter,
      clear: () => {
        setDocFilter({ owner: 'any', tag: 'any', status: 'any', ftype: 'any', kind: 'all' });
        this.setState({ dq: '' });
      },
      items: homeItems,
      noItems: !homeItems.length,
      shown: homeItems.length + (homeItems.length === 1 ? ' item' : ' items'),
      searching: !!docQuery,
      searchTxt: 'Results for “' + this.state.dq + '”',
      files: fileList,
      noFiles: !fileList.length,
      fileShown:
        fileList.length +
        (fileList.length === 1 ? ' file' : ' files') +
        ' · ' +
        fmtSize(fileList.reduce((sum, file) => sum + (file.size || 0), 0)),
      hasSel: !!selIds.length,
      selTxt: selIds.length + ' selected',
      allSel: () => this.setState({ fsel: Object.fromEntries(fileList.map(file => [file.id, true])) }),
      noneSel: () => this.setState({ fsel: {} }),
      bulkDl: () =>
        selIds.forEach(id => {
          const file = liveFiles.find(item => item.id === id);
          if (file) this.download(file);
        }),
      bulkCoOpts: [
        { v: '', l: 'Move to company…' },
        ...CO_OPTS.map(([value, label]) => ({ v: value, l: label }))
      ],
      bulkCo: e => {
        const value = e.target.value;
        if (!value) return;
        this.upd(draft => {
          draft.files.forEach(file => {
            if (selIds.includes(file.id)) file.co = value;
          });
        });
        this.toastMsg('Moved ' + selIds.length + ' files to ' + coOf(value).name);
      },
      bulkDel: () => {
        const trashedAt = Date.now();
        this.upd(draft => {
          draft.files.forEach(file => {
            if (selIds.includes(file.id)) file.trashed = trashedAt;
          });
        });
        this.setState({ fsel: {} });
        this.toastMsg('Moved ' + selIds.length + ' files to Trash', () =>
          this.upd(draft => {
            draft.files.forEach(file => {
              if (file.trashed === trashedAt) delete file.trashed;
            });
          })
        );
      },
      dragBg: this.state.drag ? 'color-mix(in oklch, var(--acc) 8%, #fff)' : 'oklch(0.985 0.003 85)',
      dragBd: this.state.drag ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.85 0.008 85)',
      onDragOver: e => {
        e.preventDefault();
        if (!this.state.drag) this.setState({ drag: true });
      },
      onDragLeave: () => this.setState({ drag: false }),
      onDrop: e => {
        e.preventDefault();
        this.setState({ drag: false });
        this.upload({ target: { files: e.dataTransfer.files } });
      },
      trash: [
        ...trashedPages.map(page => {
          const nestedCount = descendantIds(page.id).size - 1;
          return {
            title: page.title || 'Untitled',
            kind: 'Page' + (nestedCount ? ' + ' + nestedCount + ' inside' : ''),
            when: 'Deleted ' + docTimeAgo(page.trashed),
            restore: () => {
              const ids = descendantIds(page.id);
              this.upd(draft => {
                draft.pages.forEach(item => {
                  if (ids.has(item.id)) delete item.trashed;
                  const parent = draft.pages.find(candidate => candidate.id === item.parent);
                  if (item.id === page.id && parent && parent.trashed) item.parent = null;
                });
              });
              this.toastMsg('Restored “' + (page.title || 'Untitled') + '”');
            },
            purge: () => {
              if (!confirm('Delete this page forever? This cannot be undone.')) return;
              const ids = descendantIds(page.id);
              this.upd(draft => {
                draft.pages = draft.pages.filter(item => !ids.has(item.id));
              });
            }
          };
        }),
        ...trashedFiles.map(file => ({
          title: file.name,
          kind: 'File · ' + fmtSize(file.size || 0),
          when: 'Deleted ' + docTimeAgo(file.trashed),
          restore: () => {
            this.upd(draft => {
              const stored = draft.files.find(item => item.id === file.id);
              if (stored) delete stored.trashed;
            });
            this.toastMsg('Restored “' + file.name + '”');
          },
          purge: () => {
            if (!confirm('Delete ' + file.name + ' forever?')) return;
            purgeFile(file.id);
            this.upd(draft => {
              draft.files = draft.files.filter(item => item.id !== file.id);
            });
            setTimeout(() => this.refreshEst(), 300);
          }
        }))
      ],
      noTrash: !(trashedPages.length + trashedFiles.length),
      emptyTrash: () => {
        if (!confirm('Delete everything in Trash forever?')) return;
        trashedFiles.forEach(file => purgeFile(file.id));
        const ids = new Set();
        allPages
          .filter(page => page.trashed)
          .forEach(page => descendantIds(page.id).forEach(descId => ids.add(descId)));
        this.upd(draft => {
          draft.pages = draft.pages.filter(page => !ids.has(page.id));
          draft.files = draft.files.filter(file => !file.trashed);
        });
        this.toastMsg('Trash emptied');
        setTimeout(() => this.refreshEst(), 300);
      },
      title: currentPage ? currentPage.title : '',
      onTitle: e => {
        const title = e.target.value;
        this.updPage(currentPage.id, stored => {
          stored.title = title;
        });
      },
      onTitleKey: e => {
        if ((e.key === 'Enter' || e.key === 'ArrowDown') && currentPage) {
          e.preventDefault();
          const firstBlock = currentPage.blocks.find(block => block.type !== 'divider');
          if (firstBlock) {
            this.focusBlock(firstBlock.id, 0);
            this.forceUpdate();
          }
        }
      },
      path: breadcrumbs,
      hasPath: !!breadcrumbs.length,
      pco: currentPage ? currentPage.co : '',
      pcoOpts: CO_OPTS.map(([value, label]) => ({ v: value, l: label })),
      onPco: e => setPageField('co', e.target.value),
      pcoTint: pageCompany.tint,
      pcoInk: pageCompany.ink,
      pstSeg: currentPage
        ? docSegment(
            [
              ['Draft', 'Draft'],
              ['In review', 'In review'],
              ['Final', 'Final']
            ],
            currentPage.status || 'Draft',
            value => setPageField('status', value)
          )
        : [],
      pbySeg: currentPage
        ? docSegment(
            memberOpts().map(([personId, label]) => [personId, label]),
            currentPage.by || 'both',
            value => setPageField('by', value)
          )
        : [],
      ptags: currentPage
        ? (currentPage.tags || []).map(tag => ({
            t: tag,
            remove: () =>
              setPageField(
                'tags',
                (currentPage.tags || []).filter(existing => existing !== tag)
              )
          }))
        : [],
      ptag: this.state.ptag || '',
      onPtag: e => this.setState({ ptag: e.target.value }),
      onPtagKey: e => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          addPageTag();
        }
      },
      ptagSugg: currentPage
        ? allTags
            .filter(tag => !(currentPage.tags || []).includes(tag))
            .slice(0, 5)
            .map(tag => ({ t: tag, go: () => setPageField('tags', [...(currentPage.tags || []), tag]) }))
        : [],
      pstar: currentPage && isStarred(currentPage) ? '★ Starred' : '☆ Star',
      pstarC: currentPage && isStarred(currentPage) ? 'oklch(0.55 0.15 75)' : 'oklch(0.35 0.012 265)',
      toggleStar: () =>
        currentPage &&
        this.upd(draft => {
          const stored = draft.pages.find(item => item.id === currentPage.id);
          if (stored)
            stored.star = isStarred(currentPage)
              ? (stored.star || []).filter(person => person !== me)
              : [...(stored.star || []), me];
        }),
      dupPage: () => {
        if (!currentPage) return;
        const newId = uid();
        this.upd(draft => {
          draft.pages.push({
            ...JSON.parse(JSON.stringify(currentPage)),
            id: newId,
            title: (currentPage.title || 'Untitled') + ' (copy)',
            star: [],
            blocks: (currentPage.blocks || []).map(block => ({ ...block, id: uid() })),
            created: Date.now(),
            updated: Date.now()
          });
        });
        this.setState({ page: newId });
        this.toastMsg('Copy created and opened');
      },
      copyPage: () => {
        if (!currentPage) return;
        if (navigator.clipboard)
          navigator.clipboard.writeText(
            (currentPage.title ? '# ' + currentPage.title + '\n\n' : '') + blocksToMd(currentPage.blocks)
          );
        this.toastMsg('Page copied as text');
      },
      dlPage: () => {
        if (!currentPage) return;
        const blob = new Blob(
            [(currentPage.title ? '# ' + currentPage.title + '\n\n' : '') + blocksToMd(currentPage.blocks)],
            { type: 'text/markdown' }
          ),
          link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = (currentPage.title || 'page').replace(/[^\w\- ]+/g, '').trim() + '.md';
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      moveOpts: currentPage
        ? [
            { v: '', l: 'Top level' },
            ...pages
              .filter(page => !descendantIds(currentPage.id).has(page.id))
              .map(page => ({ v: page.id, l: page.title || 'Untitled' }))
          ]
        : [],
      moveVal: currentPage ? currentPage.parent || '' : '',
      onMove: e => {
        const parentId = e.target.value || null;
        setPageField('parent', parentId);
        if (parentId) this.setState(prev => ({ exp: { ...prev.exp, [parentId]: true } }));
        this.toastMsg(
          parentId
            ? 'Moved inside “' + ((pages.find(page => page.id === parentId) || {}).title || 'Untitled') + '”'
            : 'Moved to top level'
        );
      },
      stats:
        words +
        (words === 1 ? ' word' : ' words') +
        ' · ' +
        Math.max(1, Math.round(words / 200)) +
        ' min read',
      updated: currentPage ? 'Edited ' + docTimeAgo(currentPage.updated) : '',
      created:
        currentPage && currentPage.created
          ? 'Created ' +
            new Date(currentPage.created).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          : '',
      toc,
      hasToc: toc.length > 1,
      attached,
      hasAttached: !!attached.length,
      onAttach: e => currentPage && this.upload(e, { page: currentPage.id, co: currentPage.co }),
      blocks,
      addBlockEnd: () => currentPage && this.addBlockEnd(currentPage.id),
      subs: currentPage
        ? childPages(currentPage.id).map(page => ({
            title: page.title || 'Untitled',
            go: () => this.setState(prev => ({ page: page.id, exp: { ...prev.exp, [currentPage.id]: true } }))
          }))
        : [],
      addSub: () => currentPage && this.addPage(currentPage.id),
      removePage: () => currentPage && trashPage(currentPage),
      storage: (this.state.est ? this.state.est + '. ' : '') + 'Files are stored in this browser only.'
    };
    docsView.hasSubs = !!docsView.subs.length;
    return {
      popOpen: !!pop,
      closePop: () => this.setState({ pop: null }),
      tk: tasksView,
      tp: taskPanel,
      hasTPeek: !!peekTask,
      toastOn: !!this.state.toast,
      toastText: this.state.toast || '',
      toastLabel: this.state.toastLabel || 'Undo',
      toastCanUndo: !!this._undo,
      toastUndo: () => {
        const undo = this._undo;
        this._undo = null;
        clearTimeout(this._tt);
        this.setState({ toast: null });
        if (undo) undo();
      },
      toastClose: () => {
        this._undo = null;
        clearTimeout(this._tt);
        this.setState({ toast: null });
      },
      hr: hiringView,
      pk: rolePanel,
      hasPeek: !!peekRole,
      dc: docsView
    };
  }
}
