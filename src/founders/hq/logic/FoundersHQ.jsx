/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import HQActions from './10-actions';
import { initialsOf } from '@/founders/auth/accounts';
import {
  KEY,
  PEOPLE,
  COS,
  coOf,
  syncCos,
  CO_OPTS,
  OWNER_OPTS,
  segOf,
  ACCENTS,
  SIDES,
  HUB_OF,
  idb,
  fmtSize,
  STAGES,
  iso,
  plus,
  dayDiff,
  uid,
  INK_C,
  RED,
  AMBER,
  GREEN,
  MUTED,
  DST_LABEL,
  RST,
  HX_DEF,
  RX_DEF,
  goalCalc,
  AI_ON,
  PORTAL_URLS,
  applyAccountNames
} from './core';
import Root from '../view/Root';
import AccountsDialog from '@/founders/auth/AccountsDialog';

/**
 * The whole Founders HQ app: state lives here (the shared data is saved to the API, see
 * 01-state.js and sync/WorkspaceSync.js), renderVals() builds the view model and the generated view renders it.
 */
export default class FoundersHQ extends HQActions {
  static defaultProps = { amountFormat: 'Lakh / Crore', claudeDrafts: AI_ON };

  /**
   * Full view model for <Root>: the shell plus every page's slice. Company tab rows on the listed
   * pages are trimmed to the pinned companies (the rest go into a "more" menu, see capTabs).
   */
  renderVals() {
    const viewModel = this.shellViewModel();
    Object.assign(viewModel, this.weeklyRhythmViewModel(), this.salesViewModel(), this.assistantViewModel());
    ['dl', 'wr', 'tk', 'hr', 'dc', 'rs', 'fn', 'sc', 'ct', 'pp'].forEach(key =>
      this.capTabs(viewModel[key], key)
    );
    return viewModel;
  }

  /**
   * App shell (sidebar, top bar, theme) plus the Home, Tasks, Research, Finance, Hiring, Docs,
   * Vault and company pages. Mixes in the Tasks/Hiring/Docs, Goals/Decisions, Companies and
   * Constitution view models at the end.
   */
  shellViewModel() {
    syncCos(this.state.data);
    const { view, me, data, nr: newRole, ai } = this.state;
    const myProfile = PEOPLE[me];
    // Team tasks are HQ's tasks: every one the founder can see / the ones assigned to or given by them.
    const openTasks = this.tasksAll().filter(task => !task.done);
    const myOpenTasks = openTasks.filter(task => task.mine);
    const goalsAtRisk = data.goals.filter(goal =>
        ['At risk', 'Behind', 'Overdue'].includes(goalCalc(goal, this.tasksAll()).status)
      ).length,
      openDecisions = data.decisions.filter(decision => decision.status === 'Proposed').length;
    const cal = this.calVM(),
      att = this.attVM();
    // Sidebar entries: [page id, default label, badge text].
    const navItems = [
      ['home', 'Today', ''],
      // The view shows the portal store's live count (useOpenTeamTaskCount) once team tasks have loaded.
      ['tasks', 'Tasks', String(myOpenTasks.length)],
      [
        'calendar',
        'Calendar',
        (() => {
          const dueToday = myOpenTasks.filter(task => task.due === iso(new Date())).length;
          return dueToday ? dueToday + ' today' : '';
        })()
      ],
      ['attendance', 'Attendance', att.navN],
      ['goals', 'Goals', goalsAtRisk ? goalsAtRisk + ' at risk' : String(data.goals.length || '')],
      ['decisions', 'Decisions', openDecisions ? openDecisions + ' open' : ''],
      ['pipeline', 'Sales', this._ppN ? this._ppN + ' due' : this._ctN ? this._ctN + ' renewing' : ''],
      ['sync', 'Weekly rhythm', data.syncLive ? 'Live' : this._scOff ? this._scOff + ' off goal' : ''],
      ['research', 'Research', String(data.research.filter(item => item.status !== 'Concluded').length)],
      ['finance', 'Finance', ''],
      ['hiring', 'Hiring', String(data.roles.filter(item => item.stage !== 'Hired').length)],
      [
        'docs',
        'Docs & files',
        String(
          data.pages.filter(page => !page.trashed).length + data.files.filter(file => !file.trashed).length
        )
      ],
      ['vault', 'Vault', this.state.v.key ? 'Unlocked' : 'Locked'],
      [
        'companies',
        'Companies',
        String((data.companies || []).filter(company => company.status !== 'Closed').length)
      ],
      ['constitution', 'Constitution', '']
    ];
    // Sidebar pages come from the user's preferences (order, visibility, custom labels).
    const prefs = this.pf(),
      navCounts = {};
    navItems.forEach(([id, , count]) => (navCounts[id] = count));
    const nav = prefs.pages
      .filter(navPage => navPage.on)
      .map(navPage => [navPage.id, navPage.label || navPage.def, navCounts[navPage.id] || ''])
      .map(([id, label, count]) => ({
        id,
        label,
        count,
        go: () => this.go(id),
        bg: (HUB_OF[view] || view) === id ? 'var(--side2, oklch(0.3 0.025 265))' : 'transparent',
        fg: (HUB_OF[view] || view) === id ? '#fff' : 'oklch(0.85 0.01 265)'
      }));
    // Sidebar sections; pages not listed here go under 'More'.
    const NAV_GROUPS = [
      ['Daily', ['home', 'tasks', 'calendar', 'attendance', 'brief']],
      ['Strategy', ['goals', 'decisions', 'sync']],
      ['Business', ['pipeline', 'finance', 'hiring']],
      ['Knowledge', ['research', 'docs', 'vault', 'constitution']]
    ];
    // The Companies page is opened from the Companies block at the top of the sidebar ("All companies →").
    const SHOWN_IN_COMPANIES_BLOCK = ['companies'];
    const onPages = prefs.pages.filter(navPage => navPage.on),
      groupOf = id => (NAV_GROUPS.find(group => group[1].includes(id)) || ['More'])[0],
      navById = {};
    onPages.forEach((navPage, index) => (navById[navPage.id] = nav[index]));
    const sidebarPages = onPages.filter(navPage => !SHOWN_IN_COMPANIES_BLOCK.includes(navPage.id));
    const navGroups = NAV_GROUPS.map(group => group[0])
      .concat('More')
      .map(title => ({
        title,
        items: sidebarPages.filter(navPage => groupOf(navPage.id) === title).map(navPage => navById[navPage.id])
      }))
      .filter(group => group.items.length)
      .map(group => ({ ...group, pad: '16px' }));
    const ACTIVE = 'var(--side2, oklch(0.3 0.025 265))';
    // Mariox has two portals (internal portal + partner portal), both opened inside HQ on the Mariox page,
    // which also hosts their management pages (Users & roles, Partners) as tabs.
    const trimSlash = url => String(url || '').replace(/\/+$/, '');
    const mxTabBg = tab => (view === 'summary' && (this.state.mxTab || '/') === tab ? ACTIVE : 'transparent');
    const coNav = COS.filter(company => company.pin)
      .slice(0, 10)
      .map(company => {
        const isMariox = company.id === 'mariox';
        return {
          ...company,
          hasPartner: false,
          portals: isMariox,
          soon: !isMariox && !company.href,
          live: !isMariox && !!company.href,
          go: () => this.go('co', { coView: company.id }),
          navBg: view === 'co' && this.state.coView === company.id ? ACTIVE : 'transparent',
          goMx: () => this.go('summary', { mxTab: '/' }),
          goMxInternal: () => this.go('summary', { mxTab: '/mariox' }),
          goMxPartners: () => this.go('summary', { mxTab: '/partners' }),
          goMxUsers: () => this.go('summary', { mxTab: '/users' }),
          goMxPartnerAdmin: () => this.go('summary', { mxTab: '/partner-admin' }),
          mxBg: mxTabBg('/'),
          mxInternalBg: mxTabBg('/mariox'),
          mxPartnersBg: mxTabBg('/partners'),
          mxUsersBg: mxTabBg('/users'),
          mxPartnerAdminBg: mxTabBg('/partner-admin'),
          internalUrl: company.href || PORTAL_URLS.internal,
          partnersUrl: company.partnerHref || PORTAL_URLS.partners,
          usersUrl: trimSlash(company.href || PORTAL_URLS.internal) + '/users',
          partnerAdminUrl: trimSlash(company.partnerHref || PORTAL_URLS.partners) + '/partners'
        };
      });
    const now = new Date();
    const hour = now.getHours();
    // Top-bar breadcrumb per view; custom page labels from the preferences override these.
    const crumbMap = {
      summary: 'Companies · Mariox',
      brief: 'Today',
      pipeline: 'Sales · Pipeline',
      contracts: 'Sales · Contracts',
      customers: 'Sales · Customers',
      scorecard: 'Weekly rhythm · Scorecard',
      review: 'Weekly rhythm · Review',
      sync: "Weekly rhythm · Founders' sync",
      companies: 'Companies',
      constitution: 'Constitution',
      settings: 'Settings',
      home: 'Today',
      goals: 'Goals',
      decisions: 'Decisions',
      tasks: 'Tasks',
      calendar: 'Calendar',
      attendance: 'Attendance',
      research: 'Research',
      finance: 'Finance',
      hiring: 'Hiring',
      docs: 'Docs & files',
      vault: 'Vault',
      co: coOf(this.state.coView).name
    };
    const byDue = (a, b) => ((a.due || '9999') < (b.due || '9999') ? -1 : 1);

    const finByCo = {};
    COS.forEach(company => (finByCo[company.id] = this.calc(this.finOf(company.id))));
    const openRoles = data.roles.filter(role => role.stage !== 'Hired');


    // Research
    const researchFilter = this.state.rx || RX_DEF,
      researchQuery = (researchFilter.q || '').trim().toLowerCase();
    const setResearchFilter = patch => this.setState({ rx: { ...this.state.rx, ...patch } });
    const formatResearchDate = isoDate =>
      isoDate
        ? new Date(isoDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : '';
    const researchTimeAgo = timestamp => {
      if (!timestamp) return '';
      const minutes = Math.round((Date.now() - timestamp) / 60000);
      if (minutes < 1) return 'just now';
      if (minutes < 60) return minutes + ' min ago';
      const hours = Math.round(minutes / 60);
      if (hours < 24) return hours + 'h ago';
      const days = Math.round(hours / 24);
      return days < 30
        ? days + 'd ago'
        : new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };
    // Older research items keep sources as newline-separated text; newer ones use `srcs` objects.
    const sourcesOf = research =>
      research.srcs ||
      (research.sources || '')
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => ({ id: line, text: line, note: '' }));
    const isStale = research =>
      research.status !== 'Concluded' &&
      research.status !== 'Parked' &&
      Date.now() - (research.updated || 0) > 14 * 864e5;
    const isLate = research =>
      research.status !== 'Concluded' &&
      research.status !== 'Parked' &&
      research.due &&
      dayDiff(research.due) < 0;
    // The 'when' filter and the summary tiles share these buckets.
    const researchMatchesWhen = (research, when) =>
      when === 'any'
        ? true
        : when === 'late'
          ? isLate(research)
          : when === 'week'
            ? research.status !== 'Concluded' &&
              research.due &&
              dayDiff(research.due) >= 0 &&
              dayDiff(research.due) <= 7
            : when === 'stale'
              ? isStale(research)
              : when === 'recent'
                ? Date.now() - (research.updated || 0) < 7 * 864e5
                : when === 'noconc'
                  ? research.status === 'Concluded' && !(research.decision || '').trim()
                  : when === 'nosrc'
                    ? !sourcesOf(research).length
                    : true;
    const allTags = [...new Set(data.research.flatMap(research => research.tags || []))].sort();
    const companyResearch = data.research.filter(
      research => researchFilter.co === 'any' || research.co === researchFilter.co
    );
    const filteredResearch = companyResearch.filter(
      research =>
        (researchFilter.status === 'any' || research.status === researchFilter.status) &&
        (researchFilter.owner === 'any' || research.owner === researchFilter.owner) &&
        (researchFilter.pri === 'any' || (research.pri || 'Medium') === researchFilter.pri) &&
        (researchFilter.tag === 'any' || (research.tags || []).includes(researchFilter.tag)) &&
        researchMatchesWhen(research, researchFilter.when) &&
        (!researchQuery ||
          [
            research.title,
            research.question,
            research.hypo,
            research.findings,
            research.decision,
            research.sources,
            ...(research.tags || []),
            ...sourcesOf(research).map(source => source.text + ' ' + (source.note || '')),
            ...(research.comments || []).map(comment => comment.text)
          ]
            .join(' ')
            .toLowerCase()
            .includes(researchQuery))
    );
    const RESEARCH_PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };
    const compareResearch =
      {
        updated: (a, b) => (b.updated || 0) - (a.updated || 0),
        newest: (a, b) => (b.created || b.updated || 0) - (a.created || a.updated || 0),
        due: (a, b) => (a.due || '9999').localeCompare(b.due || '9999'),
        pri: (a, b) =>
          RESEARCH_PRIORITY_RANK[a.pri || 'Medium'] - RESEARCH_PRIORITY_RANK[b.pri || 'Medium'] ||
          (b.updated || 0) - (a.updated || 0),
        name: (a, b) => (a.title || '').localeCompare(b.title || '')
      }[researchFilter.sort] || (() => 0);
    const PRI_C = { High: 'oklch(0.6 0.2 25)', Medium: 'oklch(0.75 0.14 70)', Low: 'oklch(0.75 0.01 265)' };
    const buildResearchRow = research => {
      const company = coOf(research.co),
        owner = PEOPLE[research.owner] || PEOPLE.both,
        status = RST[research.status] || RST.Open,
        late = isLate(research),
        stale = isStale(research),
        sourceCount = sourcesOf(research).length,
        taskCount = this.tasksAll().filter(task => task.res === research.id).length;
      return {
        id: research.id,
        title: research.title || 'Untitled research',
        titleColor: research.title ? INK_C : 'oklch(0.65 0.01 265)',
        question: research.question || '',
        hasQ: !!(research.question || '').trim(),
        conc: research.decision || '',
        hasConc: research.status === 'Concluded' && !!(research.decision || '').trim(),
        stLabel: research.status,
        stTint: status.tint,
        stInk: status.ink,
        stDot: status.dot,
        coName: company.name,
        coTint: company.tint,
        coInk: company.ink,
        ini: owner.ini,
        pbg: owner.bg,
        pname: owner.first,
        pri: research.pri || 'Medium',
        priDot: PRI_C[research.pri || 'Medium'],
        tags: (research.tags || []).map(tag => ({ t: tag })),
        hasTags: !!(research.tags || []).length,
        when: late
          ? 'Answer by ' + formatResearchDate(research.due) + ' · late'
          : research.due && research.status !== 'Concluded'
            ? 'Answer by ' + formatResearchDate(research.due)
            : 'Updated ' + researchTimeAgo(research.updated),
        whenColor: late ? RED : MUTED,
        whenW: late ? '600' : '400',
        stale,
        meta: [
          sourceCount ? sourceCount + (sourceCount === 1 ? ' source' : ' sources') : 'No sources',
          taskCount ? taskCount + (taskCount === 1 ? ' task' : ' tasks') : '',
          research.decId ? 'Logged as decision' : ''
        ]
          .filter(Boolean)
          .join(' · '),
        selBg: this.state.sel === research.id ? 'color-mix(in oklch, var(--acc) 6%, #fff)' : '#fff',
        go: () =>
          this.setState({
            sel: research.id,
            rcdraft: '',
            rtag: '',
            hx: {
              ...HX_DEF,
              view: localStorage.getItem(KEY + '-hview') || 'board',
              sort: localStorage.getItem(KEY + '-hsort') || 'due'
            },
            hcdraft: '',
            hcf: 'active',
            hsk: '',
            ai: { busy: false, note: '', err: false }
          })
      };
    };
    const groupDef =
      {
        status: {
          f: research => research.status,
          opts: ['In progress', 'Open', 'Parked', 'Concluded'].map(value => [value, value, RST[value].dot])
        },
        company: {
          f: research => research.co,
          opts: CO_OPTS.map(([value, label]) => [value, label, coOf(value).bg || 'oklch(0.6 0.01 265)'])
        },
        owner: {
          f: research => research.owner,
          opts: OWNER_OPTS.map(([value, label]) => [
            value,
            label === 'Both' ? PEOPLE.both.name : label,
            PEOPLE[value].bg
          ])
        },
        priority: {
          f: research => research.pri || 'Medium',
          opts: ['High', 'Medium', 'Low'].map(value => [value, value + ' priority', PRI_C[value]])
        },
        none: { f: () => 'all', opts: [['all', 'All research', 'oklch(0.6 0.01 265)']] }
      }[researchFilter.group] || null;
    const researchGroups = groupDef.opts
      .map(([value, label, dot]) => {
        const groupItems = filteredResearch
            .filter(research => groupDef.f(research) === value)
            .sort(compareResearch),
          groupKey = 'r:' + researchFilter.group + ':' + value,
          isOpen = !(this.state.dgcol || {})[groupKey];
        return {
          label,
          dot,
          n: groupItems.length,
          count: groupItems.length + (groupItems.length === 1 ? ' item' : ' items'),
          open: isOpen,
          caret: isOpen ? '▼' : '▶',
          showHead: researchFilter.group !== 'none',
          toggle: () =>
            this.setState({
              dgcol: { ...this.state.dgcol, [groupKey]: !(this.state.dgcol || {})[groupKey] }
            }),
          rows: groupItems.map(buildResearchRow)
        };
      })
      .filter(group => group.n);
    const researchTiles = [
      [
        'In progress',
        'status',
        'In progress',
        RST['In progress'].dot,
        companyResearch.filter(research => research.status === 'In progress').length,
        'Being researched now'
      ],
      [
        'Open',
        'status',
        'Not started',
        RST.Open.dot,
        companyResearch.filter(research => research.status === 'Open').length,
        'Questions nobody has started'
      ],
      [
        'late',
        'when',
        'Past answer-by date',
        RED,
        companyResearch.filter(isLate).length,
        'Should already have an answer'
      ],
      [
        'stale',
        'when',
        'Stale (14+ days)',
        'oklch(0.6 0.1 300)',
        companyResearch.filter(isStale).length,
        'Not updated in 2 weeks'
      ],
      [
        'Concluded',
        'status',
        'Concluded',
        RST.Concluded.dot,
        companyResearch.filter(research => research.status === 'Concluded').length,
        'Answered'
      ]
    ].map(([value, key, label, dot, count, tip]) => {
      const isActive = researchFilter[key] === value;
      return {
        label,
        dot,
        n: String(count),
        tip,
        color: value === 'late' && count ? RED : INK_C,
        bg: isActive ? 'color-mix(in oklch, var(--acc) 6%, #fff)' : '#fff',
        bd: isActive ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.915 0.006 85)',
        go: () =>
          setResearchFilter(
            key === 'status'
              ? { status: isActive ? 'any' : value, when: 'any' }
              : { when: isActive ? 'any' : value, status: 'any' }
          )
      };
    });
    const researchSelect = (filterKey, defaultValue, opts) => {
      const isActive = researchFilter[filterKey] !== defaultValue;
      return {
        value: researchFilter[filterKey],
        onChange: e => {
          setResearchFilter({ [filterKey]: e.target.value });
          if (filterKey === 'sort' || filterKey === 'group')
            localStorage.setItem(KEY + '-r' + filterKey, e.target.value);
        },
        opts: opts.map(([value, label]) => ({ v: value, l: label })),
        bg: isActive ? 'color-mix(in oklch, var(--acc) 8%, #fff)' : '#fff',
        bd: isActive ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.9 0.006 85)',
        fg: isActive ? 'var(--acc2, oklch(0.42 0.17 265))' : 'oklch(0.35 0.012 265)'
      };
    };
    const researchAnyFilter =
      researchFilter.status !== 'any' ||
      researchFilter.owner !== 'any' ||
      researchFilter.pri !== 'any' ||
      researchFilter.tag !== 'any' ||
      researchFilter.when !== 'any' ||
      !!researchQuery;
    const researchAsText = research =>
      [
        (research.title || 'Untitled research') +
          ' [' +
          research.status +
          ' · ' +
          coOf(research.co).name +
          ']',
        research.question ? 'Question: ' + research.question : '',
        research.hypo ? 'Our hunch: ' + research.hypo : '',
        research.findings ? 'Findings:\n' + research.findings : '',
        sourcesOf(research).length
          ? 'Sources:\n' +
            sourcesOf(research)
              .map(source => '- ' + source.text + (source.note ? ' (' + source.note + ')' : ''))
              .join('\n')
          : '',
        research.decision ? 'Conclusion: ' + research.decision : ''
      ]
        .filter(Boolean)
        .join('\n');
    const selectedResearch = data.research.find(research => research.id === this.state.sel);
    const researchView = {
      sub:
        data.research.filter(research => research.status !== 'Concluded' && research.status !== 'Parked')
          .length +
        ' open questions · ' +
        data.research.filter(research => research.status === 'Concluded').length +
        ' answered',
      add: () => {
        const id = uid();
        this.upd(draft => {
          draft.research.unshift({
            id,
            title: '',
            co: researchFilter.co !== 'any' ? researchFilter.co : 'mariox',
            owner: me,
            status: 'Open',
            pri: 'Medium',
            due: '',
            tags: [],
            question: '',
            hypo: '',
            findings: '',
            srcs: [],
            sources: '',
            decision: '',
            confidence: '',
            comments: [],
            log: [{ at: Date.now(), by: me, text: 'Started this research' }],
            created: Date.now(),
            updated: Date.now()
          });
        });
        this._focus = { sel: '[data-rtitle]' };
        this.setState({ sel: id, rx: { ...this.state.rx, status: 'any', when: 'any', q: '' } });
      },
      q: researchFilter.q,
      onQ: e => setResearchFilter({ q: e.target.value }),
      tiles: researchTiles,
      coTabs: [['any', 'All'], ...CO_OPTS].map(([value, label]) => {
        const company = coOf(value),
          isActive = researchFilter.co === value;
        return {
          label,
          n: String(
            data.research.filter(
              research =>
                (value === 'any' || research.co === value) &&
                research.status !== 'Concluded' &&
                research.status !== 'Parked'
            ).length
          ),
          hasTile: !!company.bg && value !== 'any',
          tile: company.bg || '',
          ini: company.ini || '',
          fg: isActive ? INK_C : MUTED,
          bd: isActive ? INK_C : 'transparent',
          go: () => setResearchFilter({ co: value })
        };
      }),
      filters: [
        researchSelect('status', 'any', [
          ['any', 'Any status'],
          ['Open', 'Status: Not started'],
          ['In progress', 'Status: In progress'],
          ['Concluded', 'Status: Concluded'],
          ['Parked', 'Status: Parked']
        ]),
        researchSelect('owner', 'any', [
          ['any', 'Any owner'],
          ['rahul', 'Owner: ' + PEOPLE.rahul.first],
          ['saswat', 'Owner: ' + PEOPLE.saswat.first],
          ['both', 'Owner: Both']
        ]),
        researchSelect('pri', 'any', [
          ['any', 'Any priority'],
          ['High', 'Priority: High'],
          ['Medium', 'Priority: Medium'],
          ['Low', 'Priority: Low']
        ]),
        researchSelect('tag', 'any', [
          ['any', allTags.length ? 'Any tag' : 'No tags yet'],
          ...allTags.map(tag => [tag, 'Tag: ' + tag])
        ]),
        researchSelect('when', 'any', [
          ['any', 'Any time'],
          ['late', 'Past answer-by date'],
          ['week', 'Answer due in 7 days'],
          ['stale', 'Stale (14+ days)'],
          ['recent', 'Updated in last 7 days'],
          ['noconc', 'Concluded, no conclusion written'],
          ['nosrc', 'No sources yet']
        ])
      ],
      viewSel: [
        researchSelect('group', '__', [
          ['status', 'Group: Status'],
          ['company', 'Group: Company'],
          ['owner', 'Group: Owner'],
          ['priority', 'Group: Priority'],
          ['none', 'No grouping']
        ]),
        researchSelect('sort', '__', [
          ['updated', 'Sort: Recently updated'],
          ['newest', 'Sort: Newest first'],
          ['due', 'Sort: Answer-by date'],
          ['pri', 'Sort: Priority'],
          ['name', 'Sort: Name A–Z']
        ])
      ].map(filter => ({ ...filter, bg: '#fff', bd: 'oklch(0.9 0.006 85)', fg: 'oklch(0.35 0.012 265)' })),
      viewSeg: segOf(
        [
          ['list', 'List'],
          ['cards', 'Cards']
        ],
        researchFilter.view,
        value => {
          localStorage.setItem(KEY + '-rview', value);
          setResearchFilter({ view: value });
        }
      ),
      isList: researchFilter.view !== 'cards',
      isCards: researchFilter.view === 'cards',
      anyFilter: researchAnyFilter,
      clear: () =>
        setResearchFilter({ status: 'any', owner: 'any', pri: 'any', tag: 'any', when: 'any', q: '' }),
      groups: researchGroups,
      cards: filteredResearch.slice().sort(compareResearch).map(buildResearchRow),
      shown:
        filteredResearch.length +
        (filteredResearch.length === 1 ? ' item' : ' items') +
        (researchAnyFilter ? ' match' : ''),
      copyList: () => {
        if (navigator.clipboard)
          navigator.clipboard.writeText(
            filteredResearch.slice().sort(compareResearch).map(researchAsText).join('\n\n')
          );
        this.toastMsg('Copied ' + filteredResearch.length + ' research items');
      },
      empty: !filteredResearch.length,
      emptyTitle: data.research.length ? 'Nothing matches these filters' : 'No research yet',
      emptyFilter: !!data.research.length && researchAnyFilter,
      has: !!selectedResearch,
      cur: {},
      aiOn: this.props.claudeDrafts ?? true
    };
    // Research detail panel for the selected item (state.sel).
    if (selectedResearch) {
      const research = selectedResearch,
        id = research.id,
        status = RST[research.status] || RST.Open,
        sourceList = sourcesOf(research),
        navOrder =
          researchFilter.view === 'cards'
            ? researchView.cards.map(card => card.id)
            : researchGroups.flatMap(group => group.rows.map(card => card.id)),
        navIndex = navOrder.indexOf(id),
        prevId = navIndex > 0 ? navOrder[navIndex - 1] : null,
        nextId = navIndex > -1 && navIndex < navOrder.length - 1 ? navOrder[navIndex + 1] : null;
      const updateResearch = mutate =>
        this.upd(draft => {
          const stored = draft.research.find(item => item.id === id);
          if (stored) {
            mutate(stored, draft);
            stored.updated = Date.now();
          }
        });
      const setField = (field, value) =>
        updateResearch(stored => {
          const prev = stored[field];
          stored[field] = value;
          if (field === 'status' && prev !== value)
            stored.log = [
              ...(stored.log || []),
              { at: Date.now(), by: me, text: 'Status: ' + prev + ' → ' + value }
            ];
        });
      // Normalises the sources to `srcs` objects (with stable ids) before applying `mutate`.
      const updateSources = mutate =>
        updateResearch(stored => {
          const list = sourcesOf(stored).map(source => ({
            ...source,
            id: source.id && source.id.length < 12 ? source.id : uid()
          }));
          mutate(list);
          stored.srcs = list;
          stored.sources = '';
        });
      const postC = () => {
        const text = (this.state.rcdraft || '').trim();
        if (!text) return;
        updateResearch(stored => {
          stored.comments = [...(stored.comments || []), { id: uid(), by: me, text, at: Date.now() }];
        });
        this.setState({ rcdraft: '' });
      };
      const addTag = () => {
        const tag = (this.state.rtag || '').trim().replace(/^#/, '');
        if (!tag) return;
        updateResearch(stored => {
          stored.tags = [...new Set([...(stored.tags || []), tag])];
        });
        this.setState({ rtag: '' });
      };
      // Team tasks made from this research (workspace ttLinks).
      const followUps = this.tasksAll().filter(task => task.res === id),
        linkedDecision = research.decId && data.decisions.find(decision => decision.id === research.decId);
      Object.assign(researchView, {
        cur: {
          id,
          title: research.title,
          question: research.question || '',
          hypo: research.hypo || '',
          findings: research.findings || '',
          decision: research.decision || '',
          due: research.due || ''
        },
        stLabel: research.status,
        stTint: status.tint,
        stInk: status.ink,
        stDot: status.dot,
        coName: coOf(research.co).name,
        coTint: coOf(research.co).tint,
        coInk: coOf(research.co).ink,
        onTitle: e => setField('title', e.target.value.replace(/\n/g, ' ')),
        onQuestion: e => setField('question', e.target.value),
        onHypo: e => setField('hypo', e.target.value),
        onFindings: e => setField('findings', e.target.value),
        onDecision: e => setField('decision', e.target.value),
        onDue: e => setField('due', e.target.value),
        dueColor: isLate(research) ? RED : INK_C,
        lateHint: isLate(research) ? 'Late by ' + -dayDiff(research.due) + 'd' : '',
        hasLate: isLate(research),
        stSeg: segOf(
          [
            ['Open', 'Not started'],
            ['In progress', 'In progress'],
            ['Concluded', 'Concluded'],
            ['Parked', 'Parked']
          ],
          research.status,
          value => setField('status', value)
        ),
        coSeg: segOf(CO_OPTS, research.co, value => setField('co', value)),
        ownerSeg: segOf(OWNER_OPTS, research.owner, value => setField('owner', value)),
        priSeg: segOf(
          [
            ['High', 'High'],
            ['Medium', 'Medium'],
            ['Low', 'Low']
          ],
          research.pri || 'Medium',
          value => setField('pri', value)
        ),
        confSeg: segOf(
          [
            ['Low', 'Low'],
            ['Medium', 'Medium'],
            ['High', 'High']
          ],
          research.confidence || '',
          value => setField('confidence', research.confidence === value ? '' : value)
        ),
        tags: (research.tags || []).map(tag => ({
          t: tag,
          remove: () =>
            updateResearch(stored => {
              stored.tags = (stored.tags || []).filter(existing => existing !== tag);
            })
        })),
        tagDraft: this.state.rtag || '',
        onTag: e => this.setState({ rtag: e.target.value }),
        onTagKey: e => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
          }
        },
        addTag,
        tagSugg: allTags
          .filter(tag => !(research.tags || []).includes(tag))
          .slice(0, 6)
          .map(tag => ({
            t: tag,
            go: () =>
              updateResearch(stored => {
                stored.tags = [...new Set([...(stored.tags || []), tag])];
              })
          })),
        hasSugg: allTags.some(tag => !(research.tags || []).includes(tag)),
        srcs: sourceList.map((source, index) => {
          const isUrl = /^https?:\/\//i.test(source.text || '');
          return {
            text: source.text,
            note: source.note || '',
            isUrl,
            href: isUrl ? source.text : '',
            num: String(index + 1),
            onText: e => {
              const value = e.target.value;
              updateSources(list => {
                list[index].text = value;
              });
            },
            onNote: e => {
              const value = e.target.value;
              updateSources(list => {
                list[index].note = value;
              });
            },
            remove: () =>
              updateSources(list => {
                list.splice(index, 1);
              })
          };
        }),
        hasSrcs: !!sourceList.length,
        noSrcs: !sourceList.length,
        srcInfo: sourceList.length
          ? sourceList.length + (sourceList.length === 1 ? ' source' : ' sources')
          : '',
        addSrc: () => {
          updateSources(list => {
            list.push({ id: uid(), text: '', note: '' });
          });
          this._focus = { sel: '[data-srci="' + (sourceList.length + 1) + '"]' };
        },
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
            due: task.due ? formatResearchDate(task.due) : 'No date',
            toggle: () => this.toggleTask(task),
            open: () => this.openTask(task.id)
          };
        }),
        hasFols: !!followUps.length,
        noFols: !followUps.length,
        folInfo: followUps.length
          ? followUps.filter(task => task.done).length + ' of ' + followUps.length + ' done'
          : '',
        // A follow-up team task for me about this research.
        addFol: () => this.makeTeamTask({
          title: 'Research: ' + (research.title || 'follow-up'),
          co: research.co,
          due: research.due || plus(7),
          pri: research.pri || 'Medium',
          notes: research.question || '',
          from: 'the research “' + (research.title || 'Untitled research') + '”',
        }, { res: id }),
        hasDec: !!linkedDecision,
        noDec: !linkedDecision,
        decLabel: linkedDecision
          ? linkedDecision.status === 'Decided'
            ? 'Decision: decided'
            : 'Decision: ' + (DST_LABEL[linkedDecision.status] || linkedDecision.status)
          : '',
        openDec: () => linkedDecision && this.go('decisions', { dopen: linkedDecision.id, sel: null }),
        logDec: () => {
          const decisionId = uid();
          this.upd(draft => {
            draft.decisions.unshift({
              id: decisionId,
              title: research.title || research.question || 'Decision from research',
              co: research.co,
              by: research.owner,
              status: (research.decision || '').trim() ? 'Decided' : 'Proposed',
              impact: research.pri || 'Medium',
              due: research.due || '',
              context: [research.question, research.findings ? 'Findings:\n' + research.findings : '']
                .filter(Boolean)
                .join('\n\n'),
              options: '',
              opts: [],
              chosen: '',
              outcome: research.decision || '',
              revisit: '',
              comments: [],
              log: [{ at: Date.now(), by: me, text: 'Created from research' }],
              created: Date.now(),
              decidedAt: (research.decision || '').trim() ? Date.now() : null
            });
            const stored = draft.research.find(item => item.id === id);
            if (stored) stored.decId = decisionId;
          });
          this.toastMsg('Logged in Decisions');
        },
        comments: (research.comments || []).map(comment => {
          const author = PEOPLE[comment.by] || PEOPLE.both;
          return {
            ini: author.ini,
            bg: author.bg,
            name: author.first,
            text: comment.text,
            when: researchTimeAgo(comment.at),
            remove: () =>
              updateResearch(stored => {
                stored.comments = (stored.comments || []).filter(item => item.id !== comment.id);
              })
          };
        }),
        cdraft: this.state.rcdraft || '',
        onC: e => this.setState({ rcdraft: e.target.value }),
        postC,
        onCKey: e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postC();
          }
        },
        log: [...(research.log || [])].reverse().map(entry => ({
          text: entry.text,
          who: (PEOPLE[entry.by] || PEOPLE.both).first,
          when: researchTimeAgo(entry.at)
        })),
        hasLog: !!(research.log || []).length,
        updated:
          'Updated ' +
          researchTimeAgo(research.updated) +
          (research.created
            ? ' · started ' +
              new Date(research.created).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            : ''),
        isConc: research.status === 'Concluded',
        notConc: research.status !== 'Concluded',
        conclude: () => {
          setField('status', 'Concluded');
          if (!(research.decision || '').trim()) {
            this._focus = { sel: '[data-rconc]' };
            this.toastMsg('Concluded. Write the answer below.');
          } else this.toastMsg('Marked concluded');
        },
        reopen: () => {
          setField('status', 'In progress');
          this.toastMsg('Reopened');
        },
        dup: () => {
          const newId = uid(),
            copy = JSON.parse(JSON.stringify(research));
          Object.assign(copy, {
            id: newId,
            title: (research.title || 'Untitled research') + ' (copy)',
            status: 'Open',
            decId: '',
            comments: [],
            created: Date.now(),
            updated: Date.now(),
            log: [{ at: Date.now(), by: me, text: 'Copied from another research page' }]
          });
          this.upd(draft => {
            const index = draft.research.findIndex(item => item.id === id);
            draft.research.splice(index + 1, 0, copy);
          });
          this.setState({ sel: newId });
          this.toastMsg('Copy created and opened');
        },
        copy: () => {
          if (navigator.clipboard) navigator.clipboard.writeText(researchAsText(research));
          this.toastMsg('Research copied as text');
        },
        remove: () => {
          const index = data.research.findIndex(item => item.id === id),
            backup = JSON.parse(JSON.stringify(research));
          this.upd(draft => {
            draft.research = draft.research.filter(item => item.id !== id);
          });
          this.setState({ sel: null });
          this.toastMsg('Deleted “' + (research.title || 'Untitled research') + '”', () =>
            this.upd(draft => {
              if (!draft.research.some(item => item.id === id))
                draft.research.splice(Math.min(index, draft.research.length), 0, backup);
            })
          );
        },
        prev: () => prevId && this.setState({ sel: prevId, rcdraft: '' }),
        next: () => nextId && this.setState({ sel: nextId, rcdraft: '' }),
        prevOp: prevId ? '1' : '0.4',
        nextOp: nextId ? '1' : '0.4',
        noPrev: !prevId,
        noNext: !nextId,
        close: () => this.setState({ sel: null }),
        draft: () => this.draft(research),
        draftLabel: ai.busy ? 'Drafting…' : 'Draft findings with Claude',
        draftOp: ai.busy ? '0.6' : '1',
        aiNote: ai.note || 'Uses the question above. Adds to Findings.',
        aiColor: ai.err ? RED : MUTED
      });
    }

    // Finance
    const finCompany = this.state.fco || 'combined',
      scenario = this.state.fsc,
      horizon = this.state.fhz || 12,
      finItems = data.finItems || [];
    const setScenario = patch => this.setState({ fsc: { ...this.state.fsc, ...patch } });
    const finCos = finCompany === 'combined' ? COS : COS.filter(company => company.id === finCompany);
    const coFinances = finCos.map(company => ({ c: company, f: this.finOf(company.id) }));
    const formatFinDate = isoDate =>
      isoDate
        ? new Date(isoDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : '';
    const monthKey = date => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    const monthLabel = (offset, options) =>
      new Date(now.getFullYear(), now.getMonth() + offset, 1).toLocaleDateString(
        'en-IN',
        options || { month: 'short', year: '2-digit' }
      );
    // The "What if" planner is active when any scenario control differs from the plan.
    const scenarioOn =
      scenario.grow !== null || !!scenario.costPct || scenario.hires || !!scenario.oneAmt || !!scenario.raise;
    /**
     * Month-by-month cash projection over the chosen horizon. With `useScenario`, applies the What-if
     * growth/cost changes, open-role salaries from their join-by month, and one-off cash in/out.
     * `out` is the first month where cash goes negative (null if never).
     */
    const projectCash = useScenario => {
      let cash = coFinances.reduce((sum, entry) => sum + (entry.f.cash || 0), 0);
      const rows = [];
      let cashOutAt = null;
      for (let monthIndex = 0; monthIndex < horizon; monthIndex++) {
        let rev = 0,
          cost = 0;
        coFinances.forEach(({ c: company, f: fin }) => {
          const growth = (useScenario && scenario.grow !== null ? scenario.grow : fin.growth || 0) / 100,
            costGrowth = (fin.costGrowth || 0) / 100;
          rev += (fin.rev || 0) * Math.pow(1 + growth, monthIndex);
          cost +=
            (fin.cost || 0) *
            Math.pow(1 + costGrowth, monthIndex) *
            (useScenario ? 1 + (scenario.costPct || 0) / 100 : 1);
          if (useScenario && scenario.hires)
            data.roles
              .filter(role => role.co === company.id && role.stage !== 'Hired' && role.budget)
              .forEach(role => {
                const startsIn = role.due
                  ? Math.max(
                      0,
                      (new Date(role.due).getFullYear() - now.getFullYear()) * 12 +
                        new Date(role.due).getMonth() -
                        now.getMonth()
                    )
                  : 0;
                if (monthIndex >= startsIn) cost += role.budget;
              });
        });
        let once = 0;
        if (useScenario && scenario.oneAmt && monthIndex === scenario.oneM - 1) once -= scenario.oneAmt;
        if (useScenario && scenario.raise && monthIndex === scenario.raiseM - 1) once += scenario.raise;
        const net = rev - cost;
        cash += net + once;
        if (cashOutAt === null && cash < 0) cashOutAt = monthIndex;
        rows.push({ i: monthIndex, rev, cost, net, once, cash });
      }
      return { rows, out: cashOutAt };
    };
    const basePlan = projectCash(false),
      scenarioPlan = projectCash(true),
      shownPlan = scenarioOn ? scenarioPlan : basePlan;
    const finTotals = coFinances.reduce(
        (sum, { f: fin }) => ({
          cash: sum.cash + (fin.cash || 0),
          rev: sum.rev + (fin.rev || 0),
          cost: sum.cost + (fin.cost || 0)
        }),
        { cash: 0, rev: 0, cost: 0 }
      ),
      finNet = finTotals.rev - finTotals.cost;
    const runwayMonths = finNet >= 0 ? null : finTotals.cash / -finNet;
    const cashOutText = plan =>
      plan.out === null
        ? 'Not within ' + horizon + ' months'
        : monthLabel(plan.out, { month: 'short', year: 'numeric' });
    const receivables = finItems.filter(
        item => item.kind === 'recv' && finCos.some(company => company.id === item.co)
      ),
      payables = finItems.filter(
        item => item.kind === 'pay' && finCos.some(company => company.id === item.co)
      );
    const overdueOf = list => list.filter(item => !item.paid && item.due && dayDiff(item.due) < 0);
    const sumAmounts = list => list.reduce((sum, item) => sum + (item.amount || 0), 0);
    const recvOpen = receivables.filter(item => !item.paid),
      recvOver = overdueOf(receivables),
      paySoon = payables.filter(item => !item.paid && item.due && dayDiff(item.due) <= 7);
    // Warnings shown at the top of Finance: short runway, costs outgrowing revenue,
    // client concentration, stale numbers, overdue invoices and bills due soon.
    const alerts = [];
    coFinances.forEach(({ c: company, f: fin }) => {
      const stats = this.calc(fin);
      if (stats.months !== null && stats.months < 6)
        alerts.push({
          lvl: 'red',
          text:
            company.name +
            ' has about ' +
            stats.months.toFixed(1) +
            ' months of cash left at the current burn.'
        });
      else if (stats.months !== null && stats.months < 12)
        alerts.push({
          lvl: 'amber',
          text:
            company.name +
            ' has ' +
            stats.months.toFixed(1) +
            ' months of runway. Plan the next 6 months now.'
        });
      if ((fin.costGrowth || 0) > (fin.growth || 0) && fin.cost)
        alerts.push({
          lvl: 'amber',
          text:
            company.name +
            ': costs are planned to grow faster than revenue (' +
            (fin.costGrowth || 0) +
            '% vs ' +
            (fin.growth || 0) +
            '% a month).'
        });
      const revLines = finItems.filter(item => item.kind === 'rev' && item.co === company.id),
        totalRev = sumAmounts(revLines),
        topClient = revLines.slice().sort((a, b) => (b.amount || 0) - (a.amount || 0))[0];
      if (topClient && totalRev && topClient.amount / totalRev > 0.4 && revLines.length > 1)
        alerts.push({
          lvl: 'amber',
          text:
            company.name +
            ': ' +
            Math.round((topClient.amount / totalRev) * 100) +
            '% of revenue comes from ' +
            (topClient.name || 'one client') +
            '. That is a concentration risk.'
        });
      if (!fin.updated || Date.now() - fin.updated > 30 * 864e5) {
        if (fin.cash || fin.rev || fin.cost)
          alerts.push({
            lvl: 'grey',
            text: company.name + ' numbers have not been updated in over 30 days.'
          });
      }
    });
    if (recvOver.length)
      alerts.push({
        lvl: 'red',
        text:
          this.money(sumAmounts(recvOver)) +
          ' is overdue from ' +
          recvOver.length +
          (recvOver.length === 1 ? ' invoice' : ' invoices') +
          '. Follow up to collect.'
      });
    if (paySoon.length)
      alerts.push({
        lvl: 'amber',
        text:
          paySoon.length +
          (paySoon.length === 1 ? ' bill' : ' bills') +
          ' (' +
          this.money(sumAmounts(paySoon)) +
          ') due within 7 days.'
      });
    const ALERT_COLORS = {
      red: ['oklch(0.97 0.02 25)', 'oklch(0.88 0.06 25)', 'oklch(0.45 0.17 25)'],
      amber: ['oklch(0.975 0.03 80)', 'oklch(0.88 0.07 80)', 'oklch(0.45 0.11 65)'],
      grey: ['oklch(0.975 0.003 265)', 'oklch(0.9 0.006 265)', 'oklch(0.42 0.012 265)']
    };
    const updateFin = (co, field, value) =>
      this.upd(draft => {
        draft.fin[co] = { ...(draft.fin[co] || {}), [field]: value, updated: Date.now() };
      });
    const updateItem = (id, field, value) =>
      this.upd(draft => {
        const stored = (draft.finItems || []).find(item => item.id === id);
        if (stored) stored[field] = value;
      });
    const addItem = (kind, extra) => {
      const id = uid(),
        co = finCompany !== 'combined' ? finCompany : (this.state.fadd || {})[kind] || 'mariox';
      this.upd(draft => {
        draft.finItems = [
          ...(draft.finItems || []),
          {
            id,
            kind,
            co,
            name: '',
            cat: kind === 'cost' ? 'Salaries' : kind === 'rev' ? 'Retainer' : '',
            amount: 0,
            due: kind === 'recv' || kind === 'pay' ? plus(30) : '',
            paid: false,
            created: Date.now(),
            ...(extra || {})
          }
        ];
      });
      this._focus = { sel: '[data-fi="' + id + '"]' };
    };
    const deleteItem = id => {
      const removed = finItems.find(item => item.id === id);
      this.upd(draft => {
        draft.finItems = (draft.finItems || []).filter(item => item.id !== id);
      });
      this.toastMsg('Removed ' + (removed && removed.name ? '“' + removed.name + '”' : 'line'), () =>
        this.upd(draft => {
          draft.finItems = [...(draft.finItems || []), removed];
        })
      );
    };
    const finQuery = (this.state.fq || '').trim().toLowerCase(),
      finCategory = this.state.fcat || 'any';
    const CATS = {
      rev: ['Retainer', 'Project', 'Subscription', 'Other'],
      cost: [
        'Salaries',
        'Rent & office',
        'Software & tools',
        'Marketing',
        'Contractors',
        'Taxes & fees',
        'Other'
      ]
    };
    const companyOptions = () =>
      CO_OPTS.filter(option => option[0] !== 'all').map(([value, label]) => ({ v: value, l: label }));
    const buildFinLine = item => {
      const company = coOf(item.co),
        isOverdue = !item.paid && item.due && dayDiff(item.due) < 0,
        daysLeft = dayDiff(item.due);
      return {
        id: item.id,
        name: item.name || '',
        amount: item.amount ? String(item.amount) : '',
        amtTxt: this.money(item.amount || 0),
        cat: item.cat || '',
        co: item.co,
        coName: company.name,
        coTint: company.tint,
        coInk: company.ink,
        showCo: finCompany === 'combined',
        coOpts: companyOptions(),
        cats: (CATS[item.kind] || []).map(cat => ({ v: cat, l: cat })),
        due: item.due || '',
        paid: !!item.paid,
        notPaid: !item.paid,
        dueTxt: item.paid
          ? 'Paid ' + (item.paidAt ? formatFinDate(iso(new Date(item.paidAt))) : '')
          : !item.due
            ? 'No date'
            : isOverdue
              ? formatFinDate(item.due) + ' · ' + -daysLeft + 'd late'
              : daysLeft === 0
                ? 'Due today'
                : 'Due ' + formatFinDate(item.due),
        dueColor: item.paid
          ? 'oklch(0.45 0.12 150)'
          : isOverdue
            ? RED
            : daysLeft !== null && daysLeft <= 7
              ? AMBER
              : MUTED,
        rowOp: item.paid ? '0.6' : '1',
        pct: '',
        onName: e => updateItem(item.id, 'name', e.target.value),
        onAmt: e => updateItem(item.id, 'amount', Number(e.target.value) || 0),
        onCat: e => updateItem(item.id, 'cat', e.target.value),
        onCo: e => updateItem(item.id, 'co', e.target.value),
        onDue: e => updateItem(item.id, 'due', e.target.value),
        markPaid: () => {
          const amt = item.amount || 0,
            sign = item.kind === 'recv' ? 1 : -1,
            prevCash = (data.fin[item.co] || {}).cash || 0;
          this.upd(draft => {
            const stored = (draft.finItems || []).find(line => line.id === item.id);
            if (stored) {
              stored.paid = true;
              stored.paidAt = Date.now();
            }
            draft.fin[item.co] = {
              ...(draft.fin[item.co] || {}),
              cash: prevCash + sign * amt,
              updated: Date.now()
            };
          });
          this.toastMsg(
            (item.kind === 'recv' ? 'Received ' : 'Paid ') + this.money(amt) + ' · cash updated',
            () =>
              this.upd(draft => {
                const stored = (draft.finItems || []).find(line => line.id === item.id);
                if (stored) {
                  stored.paid = false;
                  stored.paidAt = null;
                }
                draft.fin[item.co] = { ...(draft.fin[item.co] || {}), cash: prevCash };
              })
          );
        },
        unpay: () => updateItem(item.id, 'paid', false),
        remove: () => deleteItem(item.id)
      };
    };
    const listOf = kind => {
      const kindItems = finItems.filter(
          item => item.kind === kind && finCos.some(company => company.id === item.co)
        ),
        kindTotal = sumAmounts(kindItems);
      const matching = kindItems.filter(
        item =>
          (!finQuery || ((item.name || '') + ' ' + (item.cat || '')).toLowerCase().includes(finQuery)) &&
          (kind === 'recv' || kind === 'pay' || finCategory === 'any' || item.cat === finCategory)
      );
      const visibleItems =
        kind === 'recv' || kind === 'pay'
          ? matching.filter(item =>
              this.state.frf === 'all'
                ? true
                : this.state.frf === 'paid'
                  ? item.paid
                  : this.state.frf === 'overdue'
                    ? !item.paid && item.due && dayDiff(item.due) < 0
                    : this.state.frf === 'soon'
                      ? !item.paid && item.due && dayDiff(item.due) >= 0 && dayDiff(item.due) <= 30
                      : !item.paid
            )
          : matching;
      const rows = visibleItems
        .slice()
        .sort((a, b) =>
          kind === 'recv' || kind === 'pay'
            ? a.paid - b.paid || (a.due || '9999').localeCompare(b.due || '9999')
            : (b.amount || 0) - (a.amount || 0)
        )
        .map(item => ({
          ...buildFinLine(item),
          pct:
            kindTotal && (kind === 'rev' || kind === 'cost')
              ? Math.round(((item.amount || 0) / kindTotal) * 100) + '%'
              : '',
          bar: kindTotal ? Math.round(((item.amount || 0) / kindTotal) * 100) + '%' : '0%'
        }));
      const cats = (CATS[kind] || [])
        .map(cat => {
          const sum = sumAmounts(kindItems.filter(item => item.cat === cat));
          return {
            label: cat,
            amt: this.money(sum),
            w: kindTotal ? Math.round((sum / kindTotal) * 100) + '%' : '0%',
            pct: kindTotal ? Math.round((sum / kindTotal) * 100) + '%' : '',
            has: sum > 0
          };
        })
        .filter(item => item.has);
      return {
        rows,
        empty: !rows.length,
        total: this.money(kindTotal),
        count: String(kindItems.length),
        cats,
        hasCats: !!cats.length,
        addCo: (this.state.fadd || {})[kind] || 'mariox',
        onAddCo: e => this.setState({ fadd: { ...(this.state.fadd || {}), [kind]: e.target.value } }),
        coOpts: companyOptions(),
        showAddCo: finCompany === 'combined',
        add: () => addItem(kind)
      };
    };
    // Recorded actuals for the last six months (all shown companies summed).
    const actualMonths = [-5, -4, -3, -2, -1, 0].map(offset => {
      const date = new Date(now.getFullYear(), now.getMonth() + offset, 1),
        key = monthKey(date);
      const values = coFinances.map(
        ({ c: company }) => ((data.fin[company.id] || {}).actuals || {})[key] || {}
      );
      const sum = values.reduce(
        (a, value) => ({
          rev: a.rev + (value.rev || 0),
          cost: a.cost + (value.cost || 0),
          cash: a.cash + (value.cash || 0),
          any: a.any || value.rev != null || value.cost != null
        }),
        { rev: 0, cost: 0, cash: 0, any: false }
      );
      return { k: key, d: date, s: sum };
    });
    const actualsMax = Math.max(1, ...actualMonths.map(month => Math.max(month.s.rev, month.s.cost)));
    const setActual = (monthKey, field, value) =>
      this.upd(draft => {
        const finEntry = (draft.fin[finCompany] = { ...(draft.fin[finCompany] || {}) });
        finEntry.actuals = { ...(finEntry.actuals || {}) };
        finEntry.actuals[monthKey] = {
          ...(finEntry.actuals[monthKey] || {}),
          [field]: value === '' ? null : Number(value) || 0
        };
        finEntry.updated = Date.now();
      });
    const cashMax = Math.max(
      1,
      ...shownPlan.rows.map(row => Math.abs(row.cash)),
      ...(scenarioOn ? basePlan.rows.map(row => Math.abs(row.cash)) : [])
    );
    const rangeSlider = (field, min, max, step, value, format) => ({
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(value),
      txt: format(value),
      onChange: e => setScenario({ [field]: Number(e.target.value) })
    });
    const summaryTxt = () =>
      [
        'Finance summary · ' +
          (finCompany === 'combined' ? 'All companies' : coOf(finCompany).full) +
          ' · ' +
          now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        'Cash: ' + this.money(finTotals.cash),
        'Revenue / month: ' + this.money(finTotals.rev),
        'Costs / month: ' + this.money(finTotals.cost),
        (finNet >= 0 ? 'Profit / month: ' : 'Burn / month: ') + this.money(Math.abs(finNet)),
        'Runway: ' + (runwayMonths === null ? 'Profitable' : runwayMonths.toFixed(1) + ' months'),
        'Money owed to us: ' +
          this.money(sumAmounts(recvOpen)) +
          (recvOver.length ? ' (' + this.money(sumAmounts(recvOver)) + ' overdue)' : ''),
        alerts.length ? '\nWatch-outs:\n' + alerts.map(a => '- ' + a.text).join('\n') : ''
      ].join('\n');
    const financeView = {
      coTabs: [['combined', 'All companies'], ...COS.map(company => [company.id, company.name])].map(
        ([value, label]) => {
          const company = coOf(value),
            isActive = finCompany === value;
          return {
            label,
            hasTile: value !== 'combined',
            tile: company.bg || '',
            ini: company.ini || '',
            fg: isActive ? INK_C : MUTED,
            bd: isActive ? INK_C : 'transparent',
            go: () => this.setState({ fco: value })
          };
        }
      ),
      isCombined: finCompany === 'combined',
      isSingle: finCompany !== 'combined',
      alerts: alerts.map(a => ({
        text: a.text,
        bg: ALERT_COLORS[a.lvl][0],
        bd: ALERT_COLORS[a.lvl][1],
        fg: ALERT_COLORS[a.lvl][2]
      })),
      hasAlerts: !!alerts.length,
      kpis: [
        {
          label: 'Cash in bank',
          value: this.money(finTotals.cash),
          sub: 'Across ' + coFinances.length + (coFinances.length === 1 ? ' company' : ' companies'),
          color: INK_C
        },
        {
          label: 'Revenue / month',
          value: this.money(finTotals.rev),
          sub: 'Income each month',
          color: INK_C
        },
        {
          label: 'Costs / month',
          value: this.money(finTotals.cost),
          sub: 'Spending each month',
          color: INK_C
        },
        {
          label: finNet >= 0 ? 'Profit / month' : 'Burn / month',
          value: this.money(Math.abs(finNet)),
          sub: finNet >= 0 ? 'Making money' : 'Losing money each month',
          color: finNet < 0 ? RED : GREEN
        },
        {
          label: 'Runway',
          value:
            runwayMonths === null
              ? finTotals.rev || finTotals.cost
                ? 'Profitable'
                : '—'
              : runwayMonths.toFixed(1) + ' months',
          sub:
            runwayMonths === null
              ? 'Cash is not going down'
              : 'Cash lasts until ' +
                new Date(now.getFullYear(), now.getMonth() + Math.floor(runwayMonths), 1).toLocaleDateString(
                  'en-IN',
                  { month: 'short', year: 'numeric' }
                ),
          color: runwayMonths === null ? GREEN : runwayMonths < 6 ? RED : runwayMonths < 12 ? AMBER : GREEN
        },
        {
          label: 'Owed to us',
          value: this.money(sumAmounts(recvOpen)),
          sub: recvOver.length
            ? this.money(sumAmounts(recvOver)) + ' overdue'
            : recvOpen.length + ' unpaid invoices',
          color: recvOver.length ? RED : INK_C
        }
      ],
      cos: coFinances.map(({ c: company, f: fin }) => {
        const stats = this.calc(fin),
          raw = data.fin[company.id] || {};
        const finField = (key, label, help, locked, lockTxt) => ({
          label,
          help,
          locked: !!locked,
          open: !locked,
          lockTxt: lockTxt || '',
          value: raw[key] ? String(raw[key]) : '',
          shown: this.money(fin[key] || 0),
          onChange: e => updateFin(company.id, key, Number(e.target.value) || 0)
        });
        return {
          id: company.id,
          name: company.full,
          ini: company.ini,
          bg: company.bg,
          net: this.money(stats.net),
          netColor: stats.empty ? MUTED : stats.net < 0 ? RED : GREEN,
          netLabel: stats.net >= 0 ? 'Profit / month' : 'Burn / month',
          runway: stats.runway,
          runColor: stats.runColor,
          updated: raw.updated
            ? 'Updated ' +
              new Date(raw.updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
            : 'Not updated yet',
          fields: [
            finField('cash', 'Cash in bank (₹)', 'Total in all bank accounts today'),
            finField(
              'rev',
              'Revenue / month (₹)',
              'Average money coming in',
              fin.revFrom,
              'From ' + fin.revFrom + ' revenue lines below'
            ),
            finField(
              'cost',
              'Costs / month (₹)',
              'Average money going out',
              fin.costFrom,
              'From ' + fin.costFrom + ' cost lines below'
            )
          ],
          pcts: [
            {
              label: 'Revenue growth % / month',
              value: raw.growth ? String(raw.growth) : '',
              onChange: e => updateFin(company.id, 'growth', Number(e.target.value) || 0)
            },
            {
              label: 'Cost growth % / month',
              value: raw.costGrowth ? String(raw.costGrowth) : '',
              onChange: e => updateFin(company.id, 'costGrowth', Number(e.target.value) || 0)
            }
          ],
          snapshot: () => {
            const thisMonth = monthKey(now);
            this.upd(draft => {
              const finEntry = (draft.fin[company.id] = { ...(draft.fin[company.id] || {}) });
              finEntry.actuals = {
                ...(finEntry.actuals || {}),
                [thisMonth]: { rev: fin.rev || 0, cost: fin.cost || 0, cash: fin.cash || 0 }
              };
              finEntry.updated = Date.now();
            });
            this.toastMsg(
              'Saved as ' +
                now.toLocaleDateString('en-IN', { month: 'long' }) +
                ' actuals for ' +
                company.name
            );
          }
        };
      }),
      hzSeg: segOf(
        [
          [6, '6 mo'],
          [12, '12 mo'],
          [18, '18 mo'],
          [24, '24 mo']
        ],
        horizon,
        value => this.setState({ fhz: value })
      ),
      viewSeg: segOf(
        [
          ['chart', 'Chart'],
          ['table', 'Table']
        ],
        this.state.fview,
        value => this.setState({ fview: value })
      ),
      isChart: this.state.fview !== 'table',
      isTable: this.state.fview === 'table',
      outLabel:
        shownPlan.out === null
          ? 'Cash stays positive for the next ' + horizon + ' months'
          : 'Cash runs out in ' + cashOutText(shownPlan),
      outColor: shownPlan.out === null ? 'oklch(0.45 0.12 150)' : RED,
      endCash:
        'Cash after ' + horizon + ' months: ' + this.money(shownPlan.rows[shownPlan.rows.length - 1].cash),
      bars: shownPlan.rows.map((row, index) => {
        const baseRow = basePlan.rows[index];
        return {
          label: monthLabel(index, { month: 'short' }),
          yr:
            index === 0 || new Date(now.getFullYear(), now.getMonth() + index, 1).getMonth() === 0
              ? monthLabel(index, { year: 'numeric' })
              : '',
          h: Math.round((Math.abs(row.cash) / cashMax) * 100) + '%',
          bg: row.cash < 0 ? 'oklch(0.65 0.18 25)' : 'var(--acc, oklch(0.5 0.17 265))',
          bh: Math.round((Math.abs(baseRow.cash) / cashMax) * 100) + '%',
          showBase: scenarioOn,
          tip:
            monthLabel(index, { month: 'long', year: 'numeric' }) +
            ': cash ' +
            this.money(row.cash) +
            (scenarioOn ? ' (base plan ' + this.money(baseRow.cash) + ')' : '') +
            (row.once ? ' · one-off ' + this.money(row.once) : '')
        };
      }),
      rows: shownPlan.rows.map((row, index) => ({
        month: monthLabel(index, { month: 'short', year: 'numeric' }),
        rev: this.money(row.rev),
        cost: this.money(row.cost),
        net: this.money(row.net),
        netColor: row.net < 0 ? RED : 'inherit',
        once: row.once ? this.money(row.once) : '',
        cash: this.money(row.cash),
        cashColor: row.cash < 0 ? RED : 'inherit'
      })),
      scOn: scenarioOn,
      sc: {
        grow: rangeSlider(
          'grow',
          -10,
          20,
          0.5,
          scenario.grow === null
            ? coFinances.length === 1
              ? coFinances[0].f.growth || 0
              : 0
            : scenario.grow,
          value =>
            (scenario.grow === null ? 'Plan (' : '') +
            (value > 0 ? '+' : '') +
            value +
            '% a month' +
            (scenario.grow === null ? ')' : '')
        ),
        cost: rangeSlider('costPct', -50, 100, 5, scenario.costPct || 0, value =>
          value === 0 ? 'No change' : (value > 0 ? '+' : '') + value + '% on all costs'
        ),
        hiresOn: scenario.hires,
        hiresMark: scenario.hires ? '✓' : '',
        hiresBg: scenario.hires ? 'var(--acc, oklch(0.5 0.17 265))' : '#fff',
        hiresBd: scenario.hires ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.78 0.01 265)',
        toggleHires: () => setScenario({ hires: !scenario.hires }),
        hiresInfo: (() => {
          const roles = data.roles.filter(
            role => role.stage !== 'Hired' && role.budget && finCos.some(company => company.id === role.co)
          );
          return roles.length
            ? roles.length +
                ' open roles · ' +
                this.money(sumAmounts(roles.map(role => ({ amount: role.budget })))) +
                ' / month from their start date'
            : 'No open roles with a budget on the Hiring page';
        })(),
        oneAmt: scenario.oneAmt ? String(scenario.oneAmt) : '',
        onOneAmt: e => setScenario({ oneAmt: Number(e.target.value) || 0 }),
        oneM: String(scenario.oneM),
        onOneM: e => setScenario({ oneM: Number(e.target.value) }),
        raise: scenario.raise ? String(scenario.raise) : '',
        onRaise: e => setScenario({ raise: Number(e.target.value) || 0 }),
        raiseM: String(scenario.raiseM),
        onRaiseM: e => setScenario({ raiseM: Number(e.target.value) }),
        monthOpts: Array.from({ length: horizon }, (_, index) => ({
          v: String(index + 1),
          l: monthLabel(index, { month: 'short', year: 'numeric' })
        })),
        useGrow: () =>
          setScenario({
            grow:
              scenario.grow === null
                ? coFinances.length === 1
                  ? coFinances[0].f.growth || 0
                  : 0
                : scenario.grow
          }),
        reset: () =>
          this.setState({
            fsc: { grow: null, costPct: 0, hires: false, oneAmt: 0, oneM: 3, raise: 0, raiseM: 6 }
          }),
        compare: scenarioOn
          ? 'Base plan: ' + cashOutText(basePlan) + ' → With changes: ' + cashOutText(scenarioPlan)
          : 'Move a slider to see how runway changes.',
        endDiff: scenarioOn
          ? 'Cash after ' +
            horizon +
            ' months: ' +
            this.money(basePlan.rows[basePlan.rows.length - 1].cash) +
            ' → ' +
            this.money(scenarioPlan.rows[scenarioPlan.rows.length - 1].cash)
          : ''
      },
      q: this.state.fq || '',
      onQ: e => this.setState({ fq: e.target.value }),
      catSel: {
        value: finCategory,
        onChange: e => this.setState({ fcat: e.target.value }),
        opts: [
          { v: 'any', l: 'All categories' },
          ...[...new Set([...CATS.rev, ...CATS.cost])].map(cat => ({ v: cat, l: cat }))
        ]
      },
      rev: listOf('rev'),
      cost: listOf('cost'),
      recv: listOf('recv'),
      pay: listOf('pay'),
      rfSeg: segOf(
        [
          ['open', 'Unpaid'],
          ['overdue', 'Overdue'],
          ['soon', 'Due in 30 days'],
          ['paid', 'Paid'],
          ['all', 'All']
        ],
        this.state.frf || 'open',
        value => this.setState({ frf: value })
      ),
      recvOpenTxt: this.money(sumAmounts(recvOpen)) + ' unpaid',
      payOpenTxt: this.money(sumAmounts(payables.filter(item => !item.paid))) + ' unpaid',
      act: actualMonths.map(month => {
        const ownActuals =
          finCompany !== 'combined' ? ((data.fin[finCompany] || {}).actuals || {})[month.k] || {} : null;
        return {
          label: month.d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          short: month.d.toLocaleDateString('en-IN', { month: 'short' }),
          rev: ownActuals ? (ownActuals.rev != null ? String(ownActuals.rev) : '') : '',
          cost: ownActuals ? (ownActuals.cost != null ? String(ownActuals.cost) : '') : '',
          cash: ownActuals ? (ownActuals.cash != null ? String(ownActuals.cash) : '') : '',
          revT: month.s.any ? this.money(month.s.rev) : '—',
          costT: month.s.any ? this.money(month.s.cost) : '—',
          cashT: month.s.cash ? this.money(month.s.cash) : '—',
          netT: month.s.any ? this.money(month.s.rev - month.s.cost) : '—',
          netC: month.s.rev - month.s.cost < 0 ? RED : 'inherit',
          rh: Math.round((month.s.rev / actualsMax) * 100) + '%',
          ch: Math.round((month.s.cost / actualsMax) * 100) + '%',
          tip:
            month.d.toLocaleDateString('en-IN', { month: 'long' }) +
            ': revenue ' +
            this.money(month.s.rev) +
            ', costs ' +
            this.money(month.s.cost),
          onRev: e => setActual(month.k, 'rev', e.target.value),
          onCost: e => setActual(month.k, 'cost', e.target.value),
          onCash: e => setActual(month.k, 'cash', e.target.value)
        };
      }),
      hasAct: actualMonths.some(month => month.s.any),
      copy: () => {
        if (navigator.clipboard) navigator.clipboard.writeText(summaryTxt());
        this.toastMsg('Finance summary copied');
      },
      csv: () => {
        const lines = [['Month', 'Revenue', 'Costs', 'Net', 'One-off', 'Cash at month end'].join(',')].concat(
          shownPlan.rows.map((row, index) =>
            [
              monthLabel(index, { month: 'short', year: 'numeric' }),
              Math.round(row.rev),
              Math.round(row.cost),
              Math.round(row.net),
              Math.round(row.once),
              Math.round(row.cash)
            ].join(',')
          )
        );
        const blob = new Blob([lines.join('\n')], { type: 'text/csv' }),
          a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'cash-projection-' + (finCompany === 'combined' ? 'all' : finCompany) + '.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        this.toastMsg('Projection downloaded as CSV');
      },
      tabs: [],
      projCo: finCompany
    };

    // Hiring
    const hiringView = {
      kpis: [
        { label: 'Open roles', value: String(openRoles.length) },
        {
          label: 'Interviewing or offer',
          value: String(
            data.roles.filter(role => role.stage === 'Interviewing' || role.stage === 'Offer').length
          )
        },
        {
          label: 'Added cost / month if all hired',
          value: this.money(openRoles.reduce((sum, role) => sum + (role.budget || 0), 0))
        }
      ],
      cols: STAGES.map((stage, stageIndex) => {
        const items = data.roles.filter(role => role.stage === stage);
        return {
          label: stage,
          n: String(items.length),
          items: items.map(role => {
            const company = coOf(role.co),
              daysLeft = dayDiff(role.due);
            const move = direction => () =>
              this.upd(draft => {
                const stored = draft.roles.find(item => item.id === role.id);
                stored.stage = STAGES[Math.max(0, Math.min(4, stageIndex + direction))];
              });
            return {
              role: role.role,
              coName: company.name,
              coTint: company.tint,
              coInk: company.ink,
              owner: (PEOPLE[role.owner] || PEOPLE.both).first,
              budget: role.budget ? this.money(role.budget) + ' / mo' : 'Budget not set',
              due: role.due
                ? 'Join by ' +
                  new Date(role.due + 'T00:00:00').toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })
                : 'No date',
              dueColor: daysLeft !== null && daysLeft < 0 && stage !== 'Hired' ? RED : MUTED,
              back: move(-1),
              fwd: move(1),
              backOp: stageIndex === 0 ? '0.35' : '1',
              fwdOp: stageIndex === 4 ? '0.35' : '1',
              remove: () =>
                this.upd(draft => {
                  draft.roles = draft.roles.filter(item => item.id !== role.id);
                })
            };
          })
        };
      })
    };
    const setNewRoleField = field => e => this.setState({ nr: { ...newRole, [field]: e.target.value } });

    // Docs
    const { docTab, dq, fileCo } = this.state;
    const currentPage =
      data.pages.find(page => page.id === this.state.page) ||
      [...data.pages].sort((a, b) => b.updated - a.updated)[0];
    const setPageField = (field, value) =>
      this.upd(draft => {
        const stored = draft.pages.find(item => item.id === currentPage.id);
        stored[field] = value;
        stored.updated = Date.now();
      });
    const docQuery = dq.trim().toLowerCase();
    const docsView = {
      tabs: segOf(
        [
          ['pages', 'Pages'],
          ['files', 'Files']
        ],
        docTab,
        value => this.setState({ docTab: value })
      ),
      isPages: docTab === 'pages',
      isFiles: docTab === 'files',
      note: this.state.docNote,
      hasNote: !!this.state.docNote,
      onImport: e => this.importNotion(e),
      onUpload: e => this.upload(e),
      addPage: () => {
        const id = uid();
        this.upd(draft => {
          draft.pages.push({ id, title: '', co: 'all', body: '', updated: Date.now() });
        });
        this.setState({ page: id, dq: '' });
      },
      q: dq,
      onQ: e => this.setState({ dq: e.target.value }),
      pages: [...data.pages]
        .filter(page => !docQuery || (page.title + ' ' + page.body).toLowerCase().includes(docQuery))
        .sort((a, b) => b.updated - a.updated)
        .map(page => {
          const company = coOf(page.co),
            isCurrent = currentPage && page.id === currentPage.id;
          return {
            title: page.title || 'Untitled',
            coName: company.name,
            coTint: company.tint,
            coInk: company.ink,
            when: new Date(page.updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            bg: isCurrent ? 'oklch(0.975 0.01 265)' : '#fff',
            sh: isCurrent ? 'inset 3px 0 0 var(--acc, oklch(0.5 0.17 265))' : 'none',
            go: () => this.setState({ page: page.id })
          };
        }),
      noPages: !data.pages.length,
      hasPage: !!currentPage,
      cur: currentPage || {},
      onTitle: e => setPageField('title', e.target.value),
      onBody: e => setPageField('body', e.target.value),
      coSeg: currentPage ? segOf(CO_OPTS, currentPage.co, value => setPageField('co', value)) : [],
      updated: currentPage
        ? 'Edited ' +
          new Date(currentPage.updated).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit'
          })
        : '',
      removePage: () => {
        if (currentPage && confirm('Delete this page?')) {
          this.upd(draft => {
            draft.pages = draft.pages.filter(item => item.id !== currentPage.id);
          });
          this.setState({ page: null });
        }
      },
      fileCoSeg: segOf([['any', 'All'], ...CO_OPTS], fileCo, value => this.setState({ fileCo: value })),
      files: data.files
        .filter(file => fileCo === 'any' || file.co === fileCo)
        .sort((a, b) => b.added - a.added)
        .map(file => ({
          name: file.name,
          ext: (file.name.split('.').pop() || 'file').slice(0, 4).toUpperCase(),
          meta:
            fmtSize(file.size) +
            ' · ' +
            new Date(file.added).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) +
            ' · ' +
            ((PEOPLE[file.by] || {}).first || ''),
          coSeg: segOf(CO_OPTS, file.co, coId =>
            this.upd(draft => {
              draft.files.find(item => item.id === file.id).co = coId;
            })
          ),
          open: () => this.download(file),
          remove: () => {
            if (confirm('Delete ' + file.name + '?')) {
              idb('readwrite', store => store.delete(file.id)).catch(() => {});
              this.upd(draft => {
                draft.files = draft.files.filter(item => item.id !== file.id);
              });
              setTimeout(() => this.refreshEst(), 300);
            }
          }
        })),
      storage: (this.state.est ? this.state.est + '. ' : '') + 'Files are stored in this browser only.'
    };
    docsView.noFiles = !docsView.files.length;

    // Vault
    const vault = this.state.v,
      exists = !!vault.sealed;
    const vaultQuery = vault.q.trim().toLowerCase();
    const setFormField = field => e => this.setV({ f: { ...vault.f, [field]: e.target.value } });
    const vaultView = {
      isSetup: !exists && !vault.key,
      isLocked: exists && !vault.key,
      isOpen: !!vault.key,
      pw: vault.pw,
      pw2: vault.pw2,
      err: vault.err,
      hasErr: !!vault.err,
      onPw: e => this.setV({ pw: e.target.value, err: '' }),
      onPw2: e => this.setV({ pw2: e.target.value, err: '' }),
      create: () => this.vCreate(),
      onSetupKey: e => {
        if (e.key === 'Enter') this.vCreate();
      },
      unlock: () => this.vUnlock(),
      onUnlockKey: e => {
        if (e.key === 'Enter') this.vUnlock();
      },
      unlockLabel: vault.busy ? 'Unlocking…' : 'Unlock',
      lock: () => this.setV({ key: null, salt: null, items: [], adding: false, shown: {}, pw: '' }),
      startAdd: () =>
        this.setV({
          adding: true,
          editId: null,
          f: { name: '', url: '', user: '', pass: '', notes: '', co: 'mariox' }
        }),
      cancel: () => this.setV({ adding: false, editId: null }),
      adding: vault.adding,
      formTitle: vault.editId ? 'Edit credential' : 'New credential',
      f: vault.f,
      onF: {
        name: setFormField('name'),
        url: setFormField('url'),
        user: setFormField('user'),
        pass: setFormField('pass'),
        notes: setFormField('notes')
      },
      coSeg: segOf(CO_OPTS, vault.f.co, coId => this.setV({ f: { ...vault.f, co: coId } })),
      gen: () => {
        const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*?';
        const randomValues = crypto.getRandomValues(new Uint32Array(18));
        this.setV({
          f: { ...vault.f, pass: [...randomValues].map(rand => charset[rand % charset.length]).join('') }
        });
      },
      save: () => {
        if (!(vault.f.name || '').trim()) return;
        const item = { ...vault.f, id: vault.editId || uid(), updated: Date.now() };
        const items = vault.editId
          ? vault.items.map(entry => (entry.id === vault.editId ? item : entry))
          : [...vault.items, item];
        this.vPut(items);
        this.setV({ adding: false, editId: null });
      },
      q: vault.q,
      onQ: e => this.setV({ q: e.target.value }),
      filterSeg: segOf([['any', 'All'], ...CO_OPTS], vault.co, coId => this.setV({ co: coId })),
      copied: vault.copied,
      hasCopied: !!vault.copied,
      items: vault.items
        .filter(
          entry =>
            (vault.co === 'any' || entry.co === vault.co) &&
            (!vaultQuery ||
              (entry.name + ' ' + entry.url + ' ' + entry.user + ' ' + entry.notes)
                .toLowerCase()
                .includes(vaultQuery))
        )
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(entry => {
          const company = coOf(entry.co),
            isShown = !!vault.shown[entry.id];
          return {
            name: entry.name,
            url: entry.url,
            hasUrl: !!entry.url,
            user: entry.user || '—',
            coName: company.name,
            coTint: company.tint,
            coInk: company.ink,
            notes: entry.notes,
            hasNotes: !!entry.notes,
            passShown: isShown ? entry.pass : '••••••••••',
            toggleLabel: isShown ? 'Hide' : 'Show',
            toggle: () => this.setV({ shown: { ...vault.shown, [entry.id]: !isShown } }),
            copyPass: () => this.vCopy(entry.pass, 'Password'),
            copyUser: () => this.vCopy(entry.user, 'Username'),
            edit: () => this.setV({ adding: true, editId: entry.id, f: { ...entry } }),
            remove: () => {
              if (confirm('Delete ' + entry.name + '?'))
                this.vPut(vault.items.filter(existing => existing.id !== entry.id));
            }
          };
        })
    };
    vaultView.empty = !vaultView.items.length;

    // Company placeholder
    const viewedCo = coOf(this.state.coView);
    const viewedCoFin = finByCo[viewedCo.id] || this.calc({});
    // Open team tasks of the company shown on the company page.
    const coTasks = openTasks.filter(task => task.co === viewedCo.id).sort(byDue);

    prefs.pages.forEach(navPage => {
      if (navPage.label) crumbMap[navPage.id] = navPage.label;
    });
    const accent = ACCENTS.find(a => a[0] === prefs.acc) || ACCENTS[0],
      sidebarTheme = SIDES.find(side => side[0] === prefs.side) || SIDES[0];
    this._zoom = Number(prefs.size) || 1;
    const appName = (prefs.name || '').trim() || 'Founders HQ';
    // CSS variables for the chosen accent and sidebar colour.
    const theme = {
      acc: accent[2],
      acc2: accent[3],
      side: 'oklch(0.21 ' + sidebarTheme[3] + ' ' + sidebarTheme[2] + ')',
      side2: 'oklch(0.3 ' + (sidebarTheme[3] + 0.005) + ' ' + sidebarTheme[2] + ')',
      side3: 'oklch(0.27 ' + sidebarTheme[3] + ' ' + sidebarTheme[2] + ')',
      zoom: String(this._zoom),
      name: appName,
      sub: prefs.sub || '',
      ini:
        appName
          .split(/\s+/)
          .filter(Boolean)
          .map(word => word[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'HQ'
    };
    const goCompanies = () => this.go('companies');
    return {
      goCompanies,
      coTotal: 'All companies (' + COS.length + ') →',
      theme,
      sx: this.settingsVM(prefs, view),
      isSettings: view === 'settings',
      goSettings: () => this.go('settings'),
      setNavBg: view === 'settings' ? 'var(--side2, oklch(0.3 0.025 265))' : 'transparent',
      nav,
      navGroups,
      coNav,
      openAccounts: () => this.setState({ accountsOpen: true }),
      signOut: () => this.signOut(),
      me: myProfile,
      pt: this.partnerVM(),
      cal,
      att,
      isCal: view === 'calendar',
      isAtt: view === 'attendance',
      crumb: crumbMap[view],
      todayLabel: now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      isHome: view === 'home',
      isTasks: view === 'tasks',
      isResearch: view === 'research',
      isFinance: view === 'finance',
      isHiring: view === 'hiring',
      isCo: view === 'co',
      isDocs: view === 'docs',
      isVault: view === 'vault',
      dc: docsView,
      vt: vaultView,
      greeting:
        (hour < 12 ? 'Good morning, ' : hour < 17 ? 'Good afternoon, ' : 'Good evening, ') + myProfile.first,
      goTasks: () => this.goTasks(),
      rs: researchView,
      fn: financeView,
      hr: hiringView,
      nr: {
        ...newRole,
        onRole: setNewRoleField('role'),
        coSeg: segOf(
          CO_OPTS.filter(option => option[0] !== 'all'),
          newRole.co,
          coId => this.setState({ nr: { ...newRole, co: coId } })
        ),
        ownerSeg: segOf(OWNER_OPTS.slice(0, 2), newRole.owner, owner =>
          this.setState({ nr: { ...newRole, owner } })
        ),
        onCo: setNewRoleField('co'),
        onOwner: setNewRoleField('owner'),
        onBudget: setNewRoleField('budget'),
        onDue: setNewRoleField('due'),
        add: () => this.addRole(),
        onKey: e => {
          if (e.key === 'Enter') this.addRole();
        }
      },
      ...this.tasksHiringDocsViewModel(),
      ...this.goalsDecisionsReviewViewModel(),
      ...this.companiesViewModel(),
      ...this.constitutionViewModel(),
      co: {
        name: viewedCo.name,
        ini: viewedCo.ini,
        bg: viewedCo.bg,
        tasks: coTasks.map(task => this.taskRow(task)),
        noTasks: !coTasks.length,
        goTasks: () => this.goTasks(viewedCo.id),
        stats: [
          {
            label: 'Runway',
            value: viewedCoFin.runway,
            go: () => this.go('finance', { projCo: viewedCo.id })
          },
          {
            label: 'Open roles',
            value: String(openRoles.filter(role => role.co === viewedCo.id).length),
            go: () => this.go('hiring')
          },
          {
            label: 'Research items',
            value: String(data.research.filter(item => item.co === viewedCo.id).length),
            go: () => this.go('research')
          }
        ]
      }
    };
  }

  /** Saves pending edits, then signs out (the session must still be valid for the last save). */
  async signOut() {
    await this._sync.flush();
    this.props.onSignOut();
  }

  closeAccounts = () => this.setState({ accountsOpen: false });

  /** Account names label the two seats everywhere in HQ, so re-render after they change. */
  accountsChanged = users => {
    applyAccountNames(users);
    this.forceUpdate();
  };

  render() {
    return (
      <>
        <Root vm={this.renderVals()} />
        {this.state.accountsOpen && (
          <AccountsDialog currentAccountId={this.props.account.id} onClose={this.closeAccounts} onAccountsChanged={this.accountsChanged} />
        )}
      </>
    );
  }
}
