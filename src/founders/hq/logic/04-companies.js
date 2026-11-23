/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import HQDocEditor from './03-doc-editor';
import { PEOPLE, MEMBERS, memberOpts, allAgreed, teamLine, ALL_FOUNDERS, ALLCOS, coColors, ensureCos, OWNER_OPTS, segOf, iso, plus, uid, INK_C, MUTED, CN_CATS, XCH, XAUTH_DEF, XmigrateCons, CO_STATUS, COUNTRIES, ENTITIES, AI_ON } from './core';

/** Fill colour for a setup-progress percentage (grey when nothing is applied). */
const progressColor = pct =>
  pct === null ? 'oklch(0.75 0.01 265)'
    : pct >= 100 ? 'oklch(0.55 0.14 150)'
      : pct >= 50 ? 'oklch(0.7 0.14 75)'
        : 'oklch(0.62 0.17 25)';

/** Short country codes shown on company cards. */
const COUNTRY_CODES = { India: 'IN', USA: 'US', UAE: 'AE', UK: 'UK', Singapore: 'SG', Other: '—' };

/** Swatch hues offered when creating or recolouring a company. */
const HUES = [265, 160, 55, 25, 300, 210, 120, 340, 85, 190];

const FULL_DATE = { day: 'numeric', month: 'short', year: 'numeric' };

/** All steps of a playbook, flattened across its sections. */
const stepsOf = playbook => (playbook.sections || []).flatMap(section => section.steps || []);

/** Turns a company name into a URL-safe id. */
/** Company id from its name: lowercase words joined by '-', at most 36 characters (team tasks accept ids up to 40). */
const slugify = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 36).replace(/-$/, '');

export default class HQCompanies extends HQDocEditor {
  /** View model for the Companies page, the company drawer and the legacy constitution tabs (playbooks, rollout, history). */
  companiesViewModel() {
    const { me, data } = this.state;
    const constitution = data.constitution || { articles: [], playbooks: [], log: [] };
    const companies = data.companies || [];

    /** "just now" / "5 min ago" / "3h ago" / "2d ago", then a full date after 30 days. */
    const relativeTime = ms => {
      if (!ms) return '';
      const minutes = Math.round((Date.now() - ms) / 60000);
      if (minutes < 60) return minutes < 1 ? 'just now' : minutes + ' min ago';
      const hours = Math.round(minutes / 60);
      if (hours < 24) return hours + 'h ago';
      const days = Math.round(hours / 24);
      return days < 30 ? days + 'd ago' : new Date(ms).toLocaleDateString('en-IN', FULL_DATE);
    };
    // Constitution history keeps the latest 300 entries, newest first.
    const logConstitution = (draft, text) => {
      draft.constitution.log = [{ at: Date.now(), by: me, text }, ...(draft.constitution.log || [])].slice(0, 300);
    };
    const updateConstitution = fn => this.upd(draft => {
      ensureCos(draft);
      fn(draft.constitution, draft);
    });

    /** Progress of one company through one playbook; steps marked N/A are left out. Null when not applied. */
    const runProgress = (company, playbook) => {
      const run = (company.runs || {})[playbook.id];
      if (!run) return null;
      const steps = stepsOf(playbook).filter(step => !(run.na || {})[step.id]);
      const doneCount = steps.filter(step => (run.done || {})[step.id]).length;
      return {
        done: doneCount,
        total: steps.length,
        pct: steps.length ? Math.round(doneCount / steps.length * 100) : 100,
        mustLeft: steps.filter(step => step.must && !(run.done || {})[step.id]).length,
      };
    };
    /** Combined progress of a company across every playbook applied to it. Null when none are applied. */
    const companyProgress = company => {
      const runs = constitution.playbooks.map(playbook => runProgress(company, playbook)).filter(Boolean);
      if (!runs.length) return null;
      const done = runs.reduce((sum, run) => sum + run.done, 0);
      const total = runs.reduce((sum, run) => sum + run.total, 0);
      return { pct: total ? Math.round(done / total * 100) : 100, n: runs.length, done, total };
    };

    const updateCompany = (id, fn) => this.upd(draft => {
      ensureCos(draft);
      const company = draft.companies.find(item => item.id === id);
      if (company) fn(company, draft);
    });
    const applyPlaybook = (companyId, playbookId) => updateCompany(companyId, (company, draft) => {
      company.runs = { ...(company.runs || {}) };
      if (!company.runs[playbookId]) {
        company.runs[playbookId] = { started: Date.now(), done: {}, na: {} };
        const playbook = draft.constitution.playbooks.find(item => item.id === playbookId);
        logConstitution(draft, 'Applied “' + (playbook ? playbook.name : 'playbook') + '” to ' + company.name);
      }
    });
    // Ticking any step moves an "Idea" company to "Setting up".
    const toggleStepDone = (companyId, playbookId, stepId) => updateCompany(companyId, company => {
      company.runs = { ...(company.runs || {}) };
      const run = company.runs[playbookId] = { started: Date.now(), done: {}, na: {}, ...(company.runs[playbookId] || {}) };
      run.done = { ...(run.done || {}) };
      if (run.done[stepId]) delete run.done[stepId];
      else run.done[stepId] = { at: Date.now(), by: me };
      if (company.status === 'Idea') company.status = 'Setting up';
    });
    const toggleStepNotApplicable = (companyId, playbookId, stepId) => updateCompany(companyId, company => {
      const run = (company.runs || {})[playbookId];
      if (!run) return;
      run.na = { ...(run.na || {}) };
      if (run.na[stepId]) delete run.na[stepId];
      else run.na[stepId] = 1;
    });
    // Custom colours saved on the company win over the ones derived from its hue.
    const companyColors = company => ({
      ...coColors(company.hue || 200),
      ...(company.bg ? { bg: company.bg, tint: company.tint, ink: company.ink } : {}),
    });

    // ---- Companies page ----
    const companyFilters = this.state.cmx;
    const companyQuery = (companyFilters.q || '').trim().toLowerCase();
    const setCompanyFilters = patch => this.setState({ cmx: { ...this.state.cmx, ...patch } });
    const industries = [...new Set(companies.map(company => company.industry).filter(Boolean))].sort();
    const setupStateOf = company => {
      const progress = companyProgress(company);
      return !progress ? 'none' : progress.pct >= 100 ? 'done' : 'inprog';
    };
    const visibleCompanies = companies.filter(company =>
      (companyFilters.status === 'any' ? company.status !== 'Closed' : companyFilters.status === 'all' ? true : company.status === companyFilters.status)
      && (companyFilters.country === 'any' || company.country === companyFilters.country)
      && (companyFilters.industry === 'any' || company.industry === companyFilters.industry)
      && (companyFilters.owner === 'any' || company.owner === companyFilters.owner)
      && (companyFilters.setup === 'any' || setupStateOf(company) === companyFilters.setup)
      && (!companyQuery || [company.name, company.full, company.legal, company.industry, company.country, company.entity, company.notes].join(' ').toLowerCase().includes(companyQuery)));
    const sortCompanies = {
      name: (a, b) => (a.name || '').localeCompare(b.name || ''),
      newest: (a, b) => (b.created || 0) - (a.created || 0),
      progress: (a, b) => ((companyProgress(a) || { pct: -1 }).pct) - ((companyProgress(b) || { pct: -1 }).pct),
      status: (a, b) => Object.keys(CO_STATUS).indexOf(a.status) - Object.keys(CO_STATUS).indexOf(b.status),
    }[companyFilters.sort] || (() => 0);
    // Open team tasks of the company (every one the founder can see).
    const openTasks = this.tasksAll().filter(task => !task.done);
    const openTaskCount = company => openTasks.filter(task => task.co === company.id).length;

    const companyCard = company => {
      const colors = companyColors(company);
      const progress = companyProgress(company);
      const finance = this.finOf(company.id);
      const financeCalc = this.calc(finance);
      const owner = PEOPLE[company.owner] || PEOPLE.both;
      return {
        id: company.id,
        name: company.name || 'Untitled',
        full: company.legal || company.full || '',
        ini: company.ini || (company.name || '?')[0],
        bg: colors.bg,
        tint: colors.tint,
        ink: colors.ink,
        status: company.status || 'Active',
        stDot: CO_STATUS[company.status] || MUTED,
        cc: COUNTRY_CODES[company.country] || '—',
        country: company.country || '',
        entity: company.entity || '',
        industry: company.industry || 'No industry',
        owner: owner.first,
        oini: owner.ini,
        obg: owner.bg,
        pct: progress ? progress.pct + '%' : 'No playbooks',
        w: progress ? progress.pct + '%' : '0%',
        pcol: progressColor(progress ? progress.pct : null),
        setupTxt: progress
          ? progress.done + ' of ' + progress.total + ' steps · ' + progress.n + (progress.n === 1 ? ' playbook' : ' playbooks')
          : 'No setup playbook applied',
        tasks: openTaskCount(company) + ' open tasks',
        cash: finance.cash ? this.money(finance.cash) : '—',
        runway: financeCalc.runway,
        runColor: financeCalc.runColor,
        pin: company.pin ? '★' : '☆',
        pinC: company.pin ? 'oklch(0.7 0.15 75)' : 'oklch(0.75 0.01 265)',
        togglePin: () => updateCompany(company.id, draftCompany => { draftCompany.pin = !draftCompany.pin; }),
        open: () => this.setState({ cmOpen: company.id }),
        selBg: this.state.cmOpen === company.id ? 'color-mix(in oklch, var(--acc) 6%, #fff)' : '#fff',
      };
    };
    /** A filter <select>, highlighted while it is set to something other than its default. */
    const filterSelect = (key, defaultValue, options) => {
      const active = companyFilters[key] !== defaultValue;
      return {
        value: companyFilters[key],
        onChange: e => setCompanyFilters({ [key]: e.target.value }),
        opts: options.map(([v, l]) => ({ v, l })),
        bg: active ? 'color-mix(in oklch, var(--acc) 8%, #fff)' : '#fff',
        bd: active ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.9 0.006 85)',
        fg: active ? 'var(--acc2, oklch(0.42 0.17 265))' : 'oklch(0.35 0.012 265)',
      };
    };
    const liveCompanies = companies.filter(company => company.status !== 'Closed');
    const progressList = liveCompanies.map(companyProgress).filter(Boolean);

    // Summary tiles double as quick filters: [value, filter key, label, dot colour, count].
    const tiles = [
      ['any', 'status', 'Companies', 'oklch(0.6 0.13 255)', liveCompanies.length],
      ['Active', 'status', 'Active', CO_STATUS.Active, companies.filter(company => company.status === 'Active').length],
      ['Setting up', 'status', 'Setting up', CO_STATUS['Setting up'], companies.filter(company => company.status === 'Setting up').length],
      ['Idea', 'status', 'Ideas', CO_STATUS.Idea, companies.filter(company => company.status === 'Idea').length],
      ['none', 'setup', 'No playbook yet', 'oklch(0.62 0.17 25)', liveCompanies.filter(company => !companyProgress(company)).length],
    ].map(([value, key, label, dot, count]) => {
      const active = key === 'status' ? companyFilters.status === value && value !== 'any' : companyFilters.setup === value;
      return {
        label,
        dot,
        n: String(count),
        bg: active ? 'color-mix(in oklch, var(--acc) 6%, #fff)' : '#fff',
        bd: active ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.915 0.006 85)',
        go: () => setCompanyFilters(key === 'status' ? { status: active ? 'any' : value, setup: 'any' } : { setup: active ? 'any' : value }),
      };
    });
    const newCompany = this.state.cmNew;
    const averageSetup = progressList.length
      ? Math.round(progressList.reduce((sum, progress) => sum + progress.pct, 0) / progressList.length)
      : 0;
    const companiesView = {
      sub: liveCompanies.length + ' companies · average setup ' + averageSetup + '% complete',
      tiles,
      q: companyFilters.q,
      onQ: e => setCompanyFilters({ q: e.target.value }),
      filters: [
        filterSelect('status', 'any', [['any', 'Open companies'], ['all', 'All incl. closed'], ...Object.keys(CO_STATUS).map(status => [status, 'Status: ' + status])]),
        filterSelect('country', 'any', [['any', 'Any country'], ...COUNTRIES.map(country => [country, country])]),
        filterSelect('industry', 'any', [['any', industries.length ? 'Any industry' : 'No industries yet'], ...industries.map(industry => [industry, industry])]),
        filterSelect('owner', 'any', [['any', 'Any owner'], ...memberOpts().map(([id, label]) => [id, 'Owner: ' + label])]),
        filterSelect('setup', 'any', [['any', 'Any setup'], ['none', 'No playbook yet'], ['inprog', 'Setup in progress'], ['done', 'Setup complete']]),
      ],
      sortSel: {
        value: companyFilters.sort,
        onChange: e => setCompanyFilters({ sort: e.target.value }),
        opts: [['name', 'Sort: Name A–Z'], ['newest', 'Sort: Newest'], ['progress', 'Sort: Least set up first'], ['status', 'Sort: Status']].map(([v, l]) => ({ v, l })),
      },
      viewSeg: segOf([['grid', 'Cards'], ['table', 'Table']], companyFilters.view, view => setCompanyFilters({ view })),
      isGrid: companyFilters.view !== 'table',
      isTable: companyFilters.view === 'table',
      anyFilter: companyFilters.status !== 'any' || companyFilters.country !== 'any' || companyFilters.industry !== 'any'
        || companyFilters.owner !== 'any' || companyFilters.setup !== 'any' || !!companyQuery,
      clear: () => setCompanyFilters({ status: 'any', country: 'any', industry: 'any', owner: 'any', setup: 'any', q: '' }),
      list: visibleCompanies.slice().sort(sortCompanies).map(companyCard),
      empty: !visibleCompanies.length,
      shown: visibleCompanies.length + (visibleCompanies.length === 1 ? ' company' : ' companies'),
      // New companies start with every playbook for India or any country pre-selected.
      add: () => this.setState({
        cmNew: {
          name: '',
          country: 'India',
          entity: 'Private Limited',
          industry: '',
          owner: 'both',
          status: 'Setting up',
          hue: HUES[companies.length % HUES.length],
          pbs: constitution.playbooks.filter(playbook => playbook.country === 'India' || playbook.country === 'Any').map(playbook => playbook.id),
        },
      }),
      hasNew: !!newCompany,
      copy: () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(visibleCompanies
            .map(company => '- ' + company.name + ' (' + (company.country || '') + ', ' + (company.status || '') + ', setup ' + ((companyProgress(company) || { pct: 0 }).pct) + '%)')
            .join('\n'));
        }
        this.toastMsg('Copied ' + visibleCompanies.length + ' companies');
      },
    };

    // ---- "New company" dialog ----
    if (newCompany) {
      const setNewCompany = patch => this.setState({ cmNew: { ...this.state.cmNew, ...patch } });
      const createCompany = () => {
        const name = (newCompany.name || '').trim();
        if (!name) return;
        let id = slugify(name) || uid();
        if (companies.some(company => company.id === id)) id += '-' + uid().slice(0, 3);
        this.upd(draft => {
          ensureCos(draft);
          draft.companies.push({
            id,
            name: name.length > 14 ? name.split(/\s+/)[0] : name,
            full: name,
            legal: name,
            ini: name[0].toUpperCase(),
            hue: newCompany.hue,
            ...coColors(newCompany.hue),
            status: newCompany.status,
            country: newCompany.country,
            entity: newCompany.entity,
            industry: newCompany.industry,
            owner: newCompany.owner,
            // Only the first eight companies are pinned to the sidebar automatically.
            pin: companies.filter(company => company.pin).length < 8,
            created: Date.now(),
            runs: Object.fromEntries(newCompany.pbs.map(playbookId => [playbookId, { started: Date.now(), done: {}, na: {} }])),
          });
          draft.fin[id] = draft.fin[id] || { cash: 0, rev: 0, cost: 0, growth: 0 };
          logConstitution(draft, 'Added company ' + name + ' with ' + newCompany.pbs.length + ' playbooks');
        });
        this.setState({ cmNew: null, cmOpen: id });
        this.toastMsg(name + ' added');
      };
      Object.assign(companiesView, {
        nw: {
          name: newCompany.name,
          onName: e => setNewCompany({ name: e.target.value }),
          industry: newCompany.industry,
          onInd: e => setNewCompany({ industry: e.target.value }),
          countryOpts: COUNTRIES.map(country => ({ v: country, l: country })),
          country: newCompany.country,
          // Changing country resets the entity type and the suggested playbooks.
          onCountry: e => {
            const country = e.target.value;
            setNewCompany({
              country,
              entity: (ENTITIES[country] || ['Company'])[0],
              pbs: constitution.playbooks.filter(playbook => playbook.country === country || playbook.country === 'Any').map(playbook => playbook.id),
            });
          },
          entityOpts: (ENTITIES[newCompany.country] || ['Company']).map(entity => ({ v: entity, l: entity })),
          entity: newCompany.entity,
          onEntity: e => setNewCompany({ entity: e.target.value }),
          ownerSeg: segOf(OWNER_OPTS, newCompany.owner, owner => setNewCompany({ owner })),
          statusSeg: segOf([['Idea', 'Idea'], ['Setting up', 'Setting up'], ['Active', 'Active']], newCompany.status, status => setNewCompany({ status })),
          hues: HUES.map(hue => ({
            sw: 'oklch(0.6 0.15 ' + hue + ')',
            ring: newCompany.hue === hue ? '0 0 0 2px #fff, 0 0 0 4px oklch(0.23 0.015 265)' : 'none',
            go: () => setNewCompany({ hue }),
          })),
          pbs: constitution.playbooks.map(playbook => {
            const selected = newCompany.pbs.includes(playbook.id);
            return {
              name: playbook.name,
              meta: playbook.country + ' · ' + stepsOf(playbook).length + ' steps',
              mark: selected ? '✓' : '',
              bg: selected ? 'var(--acc, oklch(0.5 0.17 265))' : '#fff',
              bd: selected ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.78 0.01 265)',
              go: () => setNewCompany({ pbs: selected ? newCompany.pbs.filter(id => id !== playbook.id) : [...newCompany.pbs, playbook.id] }),
            };
          }),
          preview: (newCompany.name || 'New company').trim(),
          ini: ((newCompany.name || 'N').trim()[0] || 'N').toUpperCase(),
          bg: 'oklch(0.6 0.15 ' + newCompany.hue + ')',
          canCreate: !!(newCompany.name || '').trim(),
          op: (newCompany.name || '').trim() ? '1' : '0.5',
          cancel: () => this.setState({ cmNew: null }),
          create: createCompany,
        },
      });
    }

    // ---- Company drawer ----
    const openCompany = companies.find(company => company.id === this.state.cmOpen);
    let companyPanel = { close: () => this.setState({ cmOpen: null }) };
    if (openCompany) {
      const company = openCompany;
      const id = company.id;
      const colors = companyColors(company);
      const progress = companyProgress(company);
      const setField = (key, value) => updateCompany(id, draftCompany => {
        draftCompany[key] = value;
        if (key === 'hue') Object.assign(draftCompany, coColors(value));
      });
      const field = (key, label, placeholder, type) => ({
        label,
        ph: placeholder || '',
        type: type || 'text',
        value: company[key] || '',
        onChange: e => setField(key, e.target.value),
      });
      // Mariox has two portals; every other company has one.
      const portalFields = id === 'mariox'
        ? [field('href', 'Internal portal link', 'https://portal.mariox.in'), field('partnerHref', 'Partner portal link', 'https://partners.mariox.in/admin')]
        : [field('href', 'Portal link', 'https://')];

      /** One applied playbook in the drawer, with its collapsible checklist. */
      const runRow = playbook => {
        const runStats = runProgress(company, playbook);
        const run = company.runs[playbook.id];
        const collapseKey = 'run:' + playbook.id;
        const isOpen = !!(this.state.dgcol || {})[collapseKey];
        const stepRow = step => {
          const doneMark = (run.done || {})[step.id];
          const notApplicable = (run.na || {})[step.id];
          return {
            text: step.text,
            mark: doneMark ? '✓' : '',
            bg: doneMark ? 'oklch(0.55 0.14 150)' : '#fff',
            bd: doneMark ? 'oklch(0.55 0.14 150)' : 'oklch(0.75 0.01 265)',
            deco: doneMark || notApplicable ? 'line-through' : 'none',
            col: doneMark || notApplicable ? MUTED : INK_C,
            tick: () => toggleStepDone(id, playbook.id, step.id),
            meta: doneMark
              ? 'Done by ' + (PEOPLE[doneMark.by] || PEOPLE.both).first + ' · ' + relativeTime(doneMark.at)
              : notApplicable ? 'Not applicable' : (step.must ? 'Required' : 'Optional'),
            naLbl: notApplicable ? 'Undo N/A' : 'N/A',
            na: () => toggleStepNotApplicable(id, playbook.id, step.id),
          };
        };
        return {
          name: playbook.name,
          pct: runStats.pct + '%',
          w: runStats.pct + '%',
          pcol: progressColor(runStats.pct),
          txt: runStats.done + '/' + runStats.total + (runStats.mustLeft ? ' · ' + runStats.mustLeft + ' required left' : ''),
          caret: isOpen ? '▼' : '▶',
          open: isOpen,
          toggle: () => this.setState({ dgcol: { ...(this.state.dgcol || {}), [collapseKey]: !isOpen } }),
          secs: playbook.sections.map(section => ({ title: section.title, steps: section.steps.map(stepRow) })),
          openPb: () => this.go('constitution', { cnTab: 'playbooks', cnPb: playbook.id, cnCo: id, cmOpen: null }),
          remove: () => {
            if (confirm('Remove “' + playbook.name + '” and its ticks from ' + company.name + '?')) {
              updateCompany(id, draftCompany => {
                const remainingRuns = { ...(draftCompany.runs || {}) };
                delete remainingRuns[playbook.id];
                draftCompany.runs = remainingRuns;
              });
            }
          },
        };
      };

      companyPanel = {
        id,
        name: company.name,
        full: company.legal || company.full || '',
        ini: company.ini,
        bg: colors.bg,
        tint: colors.tint,
        ink: colors.ink,
        onName: e => setField('name', e.target.value),
        onIni: e => setField('ini', (e.target.value || '').slice(0, 2).toUpperCase()),
        iniVal: company.ini || '',
        statusSeg: segOf(Object.keys(CO_STATUS).map(status => [status, status]), company.status || 'Active', status => setField('status', status)),
        ownerSeg: segOf(OWNER_OPTS, company.owner || 'both', owner => setField('owner', owner)),
        countryOpts: COUNTRIES.map(country => ({ v: country, l: country })),
        country: company.country || 'India',
        onCountry: e => setField('country', e.target.value),
        // Keep the saved entity in the list even if it is not standard for the country.
        entityOpts: [...new Set([...(ENTITIES[company.country] || []), company.entity].filter(Boolean))].map(entity => ({ v: entity, l: entity })),
        entity: company.entity || '',
        onEntity: e => setField('entity', e.target.value),
        fields: [
          field('legal', 'Legal name', 'e.g. Mariox Software Pvt Ltd'),
          field('industry', 'Industry', 'e.g. HR tech'),
          field('regNo', 'Registration no. (CIN / EIN)', ''),
          field('taxId', 'Tax ID (GST / VAT)', ''),
          field('incDate', 'Incorporated on', '', 'date'),
          field('website', 'Website', 'https://'),
          ...portalFields,
          field('bank', 'Bank', 'e.g. HDFC current a/c'),
        ],
        hues: HUES.map(hue => ({
          sw: 'oklch(0.6 0.15 ' + hue + ')',
          ring: (company.hue || 0) === hue ? '0 0 0 2px #fff, 0 0 0 4px oklch(0.23 0.015 265)' : 'none',
          go: () => setField('hue', hue),
        })),
        notes: company.notes || '',
        onNotes: e => setField('notes', e.target.value),
        pin: company.pin ? '★ Pinned to sidebar' : '☆ Pin to sidebar',
        togglePin: () => setField('pin', !company.pin),
        pct: progress ? progress.pct + '%' : '0%',
        w: progress ? progress.pct + '%' : '0%',
        pcol: progressColor(progress ? progress.pct : null),
        setupTxt: progress ? progress.done + ' of ' + progress.total + ' setup steps done' : 'No playbooks applied yet',
        runs: constitution.playbooks.filter(playbook => (company.runs || {})[playbook.id]).map(runRow),
        hasRuns: constitution.playbooks.some(playbook => (company.runs || {})[playbook.id]),
        applyV: '',
        applyOpts: [
          { v: '', l: '+ Apply a playbook…' },
          ...constitution.playbooks.filter(playbook => !(company.runs || {})[playbook.id]).map(playbook => ({ v: playbook.id, l: playbook.name })),
        ],
        onApply: e => {
          if (e.target.value) {
            applyPlaybook(id, e.target.value);
            this.toastMsg('Playbook applied');
          }
        },
        isLive: !!company.href,
        href: company.href || '',
        goTasks: () => { this.setState({ cmOpen: null }); this.goTasks(id); },
        goFin: () => this.go('finance', { fco: id, cmOpen: null }),
        goDocs: () => this.go('docs', { fileCo: id, docTab: 'home', cmOpen: null }),
        stats: [
          { l: 'Open tasks', v: String(openTaskCount(company)) },
          { l: 'Cash', v: this.finOf(id).cash ? this.money(this.finOf(id).cash) : '—' },
          { l: 'Runway', v: this.calc(this.finOf(id)).runway },
          { l: 'Open roles', v: String(data.roles.filter(role => role.co === id && role.stage !== 'Hired').length) },
        ],
        created: company.created ? 'Added ' + new Date(company.created).toLocaleDateString('en-IN', FULL_DATE) : '',
        archive: () => {
          setField('status', 'Closed');
          this.toastMsg(company.name + ' marked Closed. It is hidden from menus.');
        },
        // Deleting keeps a snapshot so the toast's undo can put the company back in place.
        remove: () => {
          if (!confirm('Delete ' + company.name + ' from the portal? Tasks and docs stay, but lose their company label.')) return;
          const snapshot = JSON.parse(JSON.stringify(company));
          const position = companies.findIndex(item => item.id === id);
          this.upd(draft => { draft.companies = draft.companies.filter(item => item.id !== id); });
          this.setState({ cmOpen: null });
          this.toastMsg('Deleted ' + company.name, () => this.upd(draft => { draft.companies.splice(position, 0, snapshot); }));
        },
        close: () => this.setState({ cmOpen: null }),
      };
    }

    // ---- Constitution: principles, playbooks, rollout and history ----
    const constitutionTab = this.state.cnTab;
    const constitutionQuery = (this.state.cnq || '').trim().toLowerCase();
    const category = this.state.cncat;
    const visibleArticles = constitution.articles.filter(article =>
      (category === 'any' || article.cat === category)
      && (!constitutionQuery || (article.title + ' ' + article.text).toLowerCase().includes(constitutionQuery)));
    /** Ratified once every current founder / co-founder agreed. */
    const signedByBoth = article => allAgreed(article.sign);
    const updateArticle = (articleId, fn) => updateConstitution((draftConstitution, draft) => {
      const article = draftConstitution.articles.find(item => item.id === articleId);
      if (article) fn(article, draftConstitution, draft);
    });
    const visiblePlaybooks = constitution.playbooks.filter(playbook =>
      (category === 'any' || playbook.cat === category)
      && (this.state.cnCountry === 'any' || playbook.country === this.state.cnCountry)
      && (!constitutionQuery || (playbook.name + ' ' + (playbook.desc || '') + ' ' + stepsOf(playbook).map(step => step.text).join(' ')).toLowerCase().includes(constitutionQuery)));
    const selectedPlaybook = constitution.playbooks.find(playbook => playbook.id === this.state.cnPb) || visiblePlaybooks[0] || null;
    const selectedCompany = companies.find(company => company.id === this.state.cnCo) || null;
    const isEditing = this.state.cnEdit;
    const updateSelectedPlaybook = fn => selectedPlaybook && updateConstitution((draftConstitution, draft) => {
      const playbook = draftConstitution.playbooks.find(item => item.id === selectedPlaybook.id);
      if (playbook) fn(playbook, draftConstitution, draft);
    });

    /** One article on the Principles tab. Editing its wording clears every signature. */
    const articleRow = article => {
      const articleIndex = constitution.articles.indexOf(article);
      const signers = article.sign || [];
      return {
        id: article.id,
        num: 'Article ' + (articleIndex + 1),
        title: article.title,
        text: article.text,
        cat: article.cat,
        catOpts: CN_CATS.map(cat => ({ v: cat, l: cat })),
        onTitle: e => updateArticle(article.id, draftArticle => { draftArticle.title = e.target.value; draftArticle.updated = Date.now(); draftArticle.sign = []; }),
        onText: e => updateArticle(article.id, draftArticle => { draftArticle.text = e.target.value; draftArticle.updated = Date.now(); draftArticle.sign = []; }),
        onCat: e => updateArticle(article.id, draftArticle => { draftArticle.cat = e.target.value; }),
        mustLbl: article.must ? 'Rule' : 'Guideline',
        mustBg: article.must ? 'oklch(0.95 0.035 25)' : 'oklch(0.95 0.005 265)',
        mustFg: article.must ? 'oklch(0.48 0.17 25)' : 'oklch(0.42 0.012 265)',
        toggleMust: () => updateArticle(article.id, draftArticle => { draftArticle.must = !draftArticle.must; }),
        signs: MEMBERS.map(personId => {
          const agreed = signers.includes(personId);
          return {
            label: (agreed ? '✓ ' : '') + PEOPLE[personId].first + (agreed ? ' agreed' : ' to agree'),
            bg: agreed ? 'oklch(0.95 0.05 150)' : '#fff',
            fg: agreed ? 'oklch(0.38 0.1 150)' : 'oklch(0.45 0.012 265)',
            bd: agreed ? 'oklch(0.82 0.07 150)' : 'oklch(0.88 0.008 85)',
            go: () => updateArticle(article.id, (draftArticle, draftConstitution, draft) => {
              draftArticle.sign = agreed ? (draftArticle.sign || []).filter(signer => signer !== personId) : [...(draftArticle.sign || []), personId];
              if (!agreed) logConstitution(draft, PEOPLE[personId].first + ' agreed to “' + draftArticle.title + '”');
            }),
          };
        }),
        ratified: signedByBoth(article),
        needsSign: !signedByBoth(article),
        when: 'Updated ' + relativeTime(article.updated),
        up: () => articleIndex > 0 && updateConstitution(draftConstitution => {
          const list = draftConstitution.articles;
          [list[articleIndex - 1], list[articleIndex]] = [list[articleIndex], list[articleIndex - 1]];
        }),
        down: () => articleIndex < constitution.articles.length - 1 && updateConstitution(draftConstitution => {
          const list = draftConstitution.articles;
          [list[articleIndex + 1], list[articleIndex]] = [list[articleIndex], list[articleIndex + 1]];
        }),
        remove: () => {
          const snapshot = JSON.parse(JSON.stringify(article));
          updateConstitution((draftConstitution, draft) => {
            draftConstitution.articles = draftConstitution.articles.filter(item => item.id !== article.id);
            logConstitution(draft, 'Removed article “' + article.title + '”');
          });
          this.toastMsg('Article removed', () => updateConstitution(draftConstitution => { draftConstitution.articles.splice(articleIndex, 0, snapshot); }));
        },
      };
    };
    /** One playbook in the left-hand list, with how many companies use it and their average progress. */
    const playbookListItem = playbook => {
      const appliedCompanies = companies.filter(company => (company.runs || {})[playbook.id]);
      const averagePct = appliedCompanies.length
        ? Math.round(appliedCompanies.reduce((sum, company) => sum + runProgress(company, playbook).pct, 0) / appliedCompanies.length)
        : null;
      const isSelected = selectedPlaybook && selectedPlaybook.id === playbook.id;
      return {
        name: playbook.name,
        meta: playbook.cat + ' · ' + playbook.country + ' · ' + stepsOf(playbook).length + ' steps',
        usage: appliedCompanies.length
          ? appliedCompanies.length + (appliedCompanies.length === 1 ? ' company · ' : ' companies · ') + averagePct + '% avg'
          : 'Not used yet',
        bg: isSelected ? 'color-mix(in oklch, var(--acc) 7%, #fff)' : '#fff',
        sh: isSelected ? 'inset 3px 0 0 var(--acc, oklch(0.5 0.17 265))' : 'none',
        go: () => this.setState({ cnPb: playbook.id }),
      };
    };

    const constitutionView = {
      tabs: [
        ['principles', 'Principles', constitution.articles.length],
        ['playbooks', 'Playbooks', constitution.playbooks.length],
        ['rollout', 'Rollout', companies.filter(company => company.status !== 'Closed').length],
        ['history', 'History', (constitution.log || []).length],
      ].map(([value, label, count]) => {
        const active = constitutionTab === value;
        return { label, n: String(count), fg: active ? INK_C : MUTED, bd: active ? INK_C : 'transparent', go: () => this.setState({ cnTab: value }) };
      }),
      isPrinciples: constitutionTab === 'principles',
      isPlaybooks: constitutionTab === 'playbooks',
      isRollout: constitutionTab === 'rollout',
      isHistory: constitutionTab === 'history',
      sub: constitution.articles.length + ' articles · ' + constitution.articles.filter(signedByBoth).length + ' agreed by all founders · ' + constitution.playbooks.length + ' playbooks',
      q: this.state.cnq,
      onQ: e => this.setState({ cnq: e.target.value }),
      catSel: {
        value: category,
        onChange: e => this.setState({ cncat: e.target.value }),
        opts: [{ v: 'any', l: 'All categories' }, ...CN_CATS.map(cat => ({ v: cat, l: cat }))],
      },
      countrySel: {
        value: this.state.cnCountry,
        onChange: e => this.setState({ cnCountry: e.target.value }),
        opts: [
          { v: 'any', l: 'Any country' },
          { v: 'Any', l: 'All companies (global)' },
          ...COUNTRIES.filter(country => country !== 'Other').map(country => ({ v: country, l: country })),
        ],
      },
      editSeg: segOf([[false, 'Use'], [true, 'Edit']], isEditing, editing => this.setState({ cnEdit: editing })),
      isEdit: isEditing,
      notEdit: !isEditing,
      arts: visibleArticles.map(articleRow),
      noArts: !visibleArticles.length,
      addArt: () => {
        const articleId = uid();
        updateConstitution((draftConstitution, draft) => {
          draftConstitution.articles.push({ id: articleId, cat: category !== 'any' ? category : 'Other', title: '', text: '', must: true, sign: [], updated: Date.now() });
          logConstitution(draft, 'Added a new article');
        });
        this.setState({ cnEdit: true });
        this._focus = { sel: '[data-art="' + articleId + '"]' };
      },
      copyArts: () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText('FOUNDERS\' CONSTITUTION\n\n' + constitution.articles
            .map((article, position) => 'Article ' + (position + 1) + ' · ' + article.title + (article.must ? '' : ' (guideline)') + '\n' + article.text)
            .join('\n\n'));
        }
        this.toastMsg('Constitution copied as text');
      },
      pbList: visiblePlaybooks.map(playbookListItem),
      noPbs: !visiblePlaybooks.length,
      hasPB: !!selectedPlaybook,
      addPb: () => {
        const playbookId = uid();
        updateConstitution((draftConstitution, draft) => {
          draftConstitution.playbooks.push({
            id: playbookId,
            name: 'New playbook',
            cat: category !== 'any' ? category : 'Other',
            country: 'Any',
            desc: '',
            sections: [{ id: uid(), title: 'Steps', steps: [{ id: uid(), text: '', owner: 'both', days: 0, must: true, help: '' }] }],
          });
          logConstitution(draft, 'Created a new playbook');
        });
        this.setState({ cnPb: playbookId, cnEdit: true, cnTab: 'playbooks' });
      },
    };

    // ---- Selected playbook (editor and checklist for the picked company) ----
    if (selectedPlaybook) {
      const playbook = selectedPlaybook;
      const run = selectedCompany ? (selectedCompany.runs || {})[playbook.id] : null;
      const progress = selectedCompany ? runProgress(selectedCompany, playbook) : null;

      const stepRow = (step, sectionIndex, stepIndex) => {
        const doneMark = run && (run.done || {})[step.id];
        const notApplicable = run && (run.na || {})[step.id];
        const owner = PEOPLE[step.owner];
        const updateStep = fn => updateSelectedPlaybook(draftPlaybook => fn(draftPlaybook.sections[sectionIndex].steps[stepIndex]));
        return {
          id: step.id,
          text: step.text,
          onText: e => updateStep(draftStep => { draftStep.text = e.target.value; }),
          help: step.help || '',
          hasHelp: !!step.help,
          onHelp: e => updateStep(draftStep => { draftStep.help = e.target.value; }),
          days: step.days ? String(step.days) : '',
          onDays: e => updateStep(draftStep => { draftStep.days = Number(e.target.value) || 0; }),
          daysTxt: step.days ? '~' + step.days + 'd' : '',
          owner: step.owner,
          ownerOpts: [...memberOpts(), ['team', 'Team']].map(([v, l]) => ({ v, l })),
          onOwner: e => updateStep(draftStep => { draftStep.owner = e.target.value; }),
          ownerTxt: owner ? owner.first : step.owner === 'team' ? 'Team' : ALL_FOUNDERS,
          mustLbl: step.must ? 'Required' : 'Optional',
          mustFg: step.must ? 'oklch(0.48 0.17 25)' : 'oklch(0.52 0.012 265)',
          toggleMust: () => updateStep(draftStep => { draftStep.must = !step.must; }),
          canTick: !!run,
          mark: doneMark ? '✓' : '',
          cbg: doneMark ? 'oklch(0.55 0.14 150)' : '#fff',
          cbd: doneMark ? 'oklch(0.55 0.14 150)' : 'oklch(0.72 0.01 265)',
          deco: doneMark || notApplicable ? 'line-through' : 'none',
          col: doneMark || notApplicable ? MUTED : INK_C,
          tick: () => selectedCompany && toggleStepDone(selectedCompany.id, playbook.id, step.id),
          doneTxt: doneMark ? (PEOPLE[doneMark.by] || PEOPLE.both).first + ' · ' + relativeTime(doneMark.at) : '',
          hasDone: !!doneMark,
          naLbl: notApplicable ? 'Undo N/A' : 'N/A',
          na: () => selectedCompany && toggleStepNotApplicable(selectedCompany.id, playbook.id, step.id),
          up: () => stepIndex > 0 && updateSelectedPlaybook(draftPlaybook => {
            const steps = draftPlaybook.sections[sectionIndex].steps;
            [steps[stepIndex - 1], steps[stepIndex]] = [steps[stepIndex], steps[stepIndex - 1]];
          }),
          remove: () => updateSelectedPlaybook(draftPlaybook => { draftPlaybook.sections[sectionIndex].steps.splice(stepIndex, 1); }),
          // Turns the step into a team task for the current founder.
          makeTask: () => this.makeTeamTask({
            title: step.text,
            co: selectedCompany ? selectedCompany.id : 'mariox',
            due: step.days ? plus(step.days) : plus(7),
            pri: step.must ? 'High' : 'Medium',
            notes: step.help || '',
            from: 'the playbook “' + playbook.name + '”',
          }, { pb: playbook.id }),
        };
      };
      const sectionRow = (section, sectionIndex) => ({
        id: section.id,
        title: section.title,
        onTitle: e => updateSelectedPlaybook(draftPlaybook => { draftPlaybook.sections[sectionIndex].title = e.target.value; }),
        n: section.steps.length + ' steps',
        removeSec: () => updateSelectedPlaybook(draftPlaybook => { draftPlaybook.sections.splice(sectionIndex, 1); }),
        addStep: () => {
          const stepId = uid();
          updateSelectedPlaybook(draftPlaybook => {
            draftPlaybook.sections[sectionIndex].steps.push({ id: stepId, text: '', owner: 'both', days: 0, must: true, help: '' });
          });
          this._focus = { sel: '[data-step="' + stepId + '"]' };
        },
        steps: section.steps.map((step, stepIndex) => stepRow(step, sectionIndex, stepIndex)),
      });

      Object.assign(constitutionView, {
        pb: {
          name: playbook.name,
          desc: playbook.desc || '',
          onName: e => updateSelectedPlaybook(draftPlaybook => { draftPlaybook.name = e.target.value; }),
          onDesc: e => updateSelectedPlaybook(draftPlaybook => { draftPlaybook.desc = e.target.value; }),
          cat: playbook.cat,
          catOpts: CN_CATS.map(cat => ({ v: cat, l: cat })),
          onCat: e => updateSelectedPlaybook(draftPlaybook => { draftPlaybook.cat = e.target.value; }),
          country: playbook.country,
          countryOpts: ['Any', ...COUNTRIES].map(country => ({ v: country, l: country === 'Any' ? 'Any country' : country })),
          onCountry: e => updateSelectedPlaybook(draftPlaybook => { draftPlaybook.country = e.target.value; }),
          meta: playbook.cat + ' · ' + (playbook.country === 'Any' ? 'All countries' : playbook.country) + ' · ' + stepsOf(playbook).length
            + ' steps · ~' + stepsOf(playbook).reduce((sum, step) => sum + (Number(step.days) || 0), 0) + ' days of work',
          coOpts: [
            { v: '', l: 'Pick a company to tick steps…' },
            ...companies.filter(company => company.status !== 'Closed').map(company => ({
              v: company.id,
              l: company.name + ((company.runs || {})[playbook.id] ? ' · ' + runProgress(company, playbook).pct + '%' : ' · not applied'),
            })),
          ],
          co: selectedCompany ? selectedCompany.id : '',
          onCo: e => this.setState({ cnCo: e.target.value }),
          hasCo: !!selectedCompany,
          hasRun: !!run,
          needApply: !!selectedCompany && !run,
          apply: () => selectedCompany && applyPlaybook(selectedCompany.id, playbook.id),
          coName: selectedCompany ? selectedCompany.name : '',
          pct: progress ? progress.pct + '%' : '0%',
          w: progress ? progress.pct + '%' : '0%',
          pcol: progressColor(progress ? progress.pct : null),
          prog: progress
            ? progress.done + ' of ' + progress.total + ' done' + (progress.mustLeft ? ' · ' + progress.mustLeft + ' required steps left' : ' · all required steps done')
            : '',
          secs: playbook.sections.map(sectionRow),
          addSec: () => updateSelectedPlaybook(draftPlaybook => { draftPlaybook.sections.push({ id: uid(), title: 'New section', steps: [] }); }),
          // Duplicate with fresh ids for the playbook, its sections and its steps.
          dup: () => {
            const newId = uid();
            const copy = JSON.parse(JSON.stringify(playbook));
            copy.id = newId;
            copy.name = playbook.name + ' (copy)';
            copy.sections.forEach(section => {
              section.id = uid();
              section.steps.forEach(step => { step.id = uid(); });
            });
            updateConstitution((draftConstitution, draft) => {
              draftConstitution.playbooks.push(copy);
              logConstitution(draft, 'Duplicated playbook “' + playbook.name + '”');
            });
            this.setState({ cnPb: newId });
            this.toastMsg('Playbook copied');
          },
          copy: () => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(playbook.name + '\n' + (playbook.desc ? playbook.desc + '\n' : '') + playbook.sections
                .map(section => '\n' + section.title + '\n' + section.steps
                  .map(step => '[' + (run && (run.done || {})[step.id] ? 'x' : ' ') + '] ' + step.text)
                  .join('\n'))
                .join('\n'));
            }
            this.toastMsg('Checklist copied');
          },
          remove: () => {
            const usedBy = companies.filter(company => (company.runs || {})[playbook.id]).length;
            if (!confirm('Delete playbook “' + playbook.name + '”?' + (usedBy ? ' It is used by ' + usedBy + ' companies; their ticks for it will be hidden.' : ''))) return;
            updateConstitution((draftConstitution, draft) => {
              draftConstitution.playbooks = draftConstitution.playbooks.filter(item => item.id !== playbook.id);
              logConstitution(draft, 'Deleted playbook “' + playbook.name + '”');
            });
            this.setState({ cnPb: null });
          },
          // Applies the playbook to every open company in a matching country that does not have it yet.
          applyAll: () => {
            const companyIds = companies
              .filter(company => company.status !== 'Closed' && !(company.runs || {})[playbook.id] && (playbook.country === 'Any' || company.country === playbook.country))
              .map(company => company.id);
            if (!companyIds.length) {
              this.toastMsg('Every matching company already has this playbook');
              return;
            }
            this.upd(draft => {
              draft.companies.forEach(company => {
                if (companyIds.includes(company.id)) {
                  company.runs = { ...(company.runs || {}), [playbook.id]: { started: Date.now(), done: {}, na: {} } };
                }
              });
              logConstitution(draft, 'Applied “' + playbook.name + '” to ' + companyIds.length + ' companies');
            });
            this.toastMsg('Applied to ' + companyIds.length + ' companies');
          },
        },
      });
    }

    // ---- Rollout grid: open companies × playbooks ----
    const rolloutCompanies = companies.filter(company =>
      company.status !== 'Closed'
      && (!constitutionQuery || (company.name + ' ' + (company.country || '')).toLowerCase().includes(constitutionQuery)));
    const rolloutPlaybooks = constitution.playbooks.filter(playbook => category === 'any' || playbook.cat === category);
    constitutionView.rcols = rolloutPlaybooks.map(playbook => ({
      name: playbook.name.replace('Company formation · ', 'Formation · '),
      go: () => this.setState({ cnTab: 'playbooks', cnPb: playbook.id }),
    }));
    constitutionView.rgrid = 'minmax(160px,220px) repeat(' + Math.max(1, rolloutPlaybooks.length) + ', minmax(96px,1fr)) 80px';
    constitutionView.rrows = rolloutCompanies.map(company => {
      const colors = companyColors(company);
      const progress = companyProgress(company);
      return {
        name: company.name,
        ini: company.ini,
        bg: colors.bg,
        sub: (company.country || '') + ' · ' + (company.status || ''),
        total: progress ? progress.pct + '%' : '—',
        tcol: progressColor(progress ? progress.pct : null),
        open: () => this.go('companies', { cmOpen: company.id }),
        cells: rolloutPlaybooks.map(playbook => {
          const cellProgress = runProgress(company, playbook);
          return {
            has: !!cellProgress,
            none: !cellProgress,
            txt: cellProgress ? cellProgress.pct + '%' : '',
            bg: cellProgress
              ? (cellProgress.pct >= 100 ? 'oklch(0.94 0.05 150)' : cellProgress.pct >= 50 ? 'oklch(0.96 0.05 80)' : 'oklch(0.96 0.03 25)')
              : 'transparent',
            fg: progressColor(cellProgress ? cellProgress.pct : null),
            go: () => this.setState({ cnTab: 'playbooks', cnPb: playbook.id, cnCo: company.id }),
            apply: () => applyPlaybook(company.id, playbook.id),
          };
        }),
      };
    });
    constitutionView.noRows = !rolloutCompanies.length;
    constitutionView.log = (constitution.log || []).map(entry => ({
      text: entry.text,
      who: (PEOPLE[entry.by] || PEOPLE.both).first,
      when: relativeTime(entry.at),
    }));
    constitutionView.noLog = !(constitution.log || []).length;

    return {
      cm: companiesView,
      cp: companyPanel,
      hasCP: !!openCompany,
      cn: constitutionView,
      isCompanies: this.state.view === 'companies',
      isSummary: this.state.view === 'summary',
      aiOn: AI_ON,
      // Mariox portal page open inside HQ: app 'internal' | 'partner' and that portal's own path.
      mxApp: this.state.mxApp || 'internal',
      mxPath: this.state.mxPath || '',
      // Created once so the setter keeps the same identity across renders (pages report moves made inside them).
      setMxPath: this._setMxPath || (this._setMxPath = path => this.state.mxPath !== path && this.setState({ mxPath: path })),
      isConstitution: this.state.view === 'constitution',
    };
  }

  /** Asks the AI assistant a question about the constitution and stores the answer (latest 50 kept). */
  async cxAsk() {
    const question = (this.state.cxq || '').trim();
    if (!question || this.state.cxbusy) return;
    if (!window.claude || !window.claude.complete) {
      this.setState({ cxnote: 'The assistant is not available in this browser.' });
      return;
    }
    const constitution = this.state.data.constitution || {};
    const rules = constitution.rules || [];
    const authority = { ...XAUTH_DEF, ...(constitution.authority || {}) };
    const ruleCode = ruleId => (rules.find(rule => rule.id === ruleId) || {}).code || '';

    // Each rule becomes one line stating clearly whether it is binding.
    const ruleLine = rule => rule.code + ' | '
      + (rule.status === 'Active'
        ? (rule.kind === 'Mandatory' ? 'APPROVED, mandatory' : 'APPROVED, recommended')
        : rule.status === 'Archived' ? 'ARCHIVED, no longer applies' : 'NOT APPROVED YET (' + rule.status + ')')
      + ' | L' + rule.level + ' | ' + (XCH.find(chapter => chapter[0] === rule.ch) || XCH[0])[2] + ' | ' + rule.title + ': ' + rule.text;
    const pendingAmendments = (constitution.amendments || [])
      .filter(amendment => amendment.status === 'Pending')
      .map(amendment => 'PENDING AMENDMENT (' + amendment.type + (amendment.ruleId ? ' of ' + ruleCode(amendment.ruleId) : '') + '): ' + amendment.title + ': ' + amendment.text);
    // Active exceptions: approved by all founders, not revoked and not expired.
    const activeExceptions = (constitution.exceptions || [])
      .filter(exception => !exception.revoked
        && allAgreed(exception.appr)
        && (!exception.until || exception.until >= iso(new Date())))
      .map(exception => 'ACTIVE EXCEPTION to ' + ruleCode(exception.ruleId)
        + ' for ' + ((ALLCOS.find(company => company.id === exception.co) || {}).name || exception.co)
        + ' until ' + exception.until + ': ' + exception.reason);

    const promptText = [
      'You are the Constitution assistant inside Founders HQ, the internal governance system of ' + teamLine() + '. They run Mariox Software, HROO, Arth and future companies, mainly in India.',
      'Answer the question using ONLY the material below. Never invent a policy. Never present a draft, pending or archived rule as approved.',
      'Write 2 to 6 short lines. Start every line with exactly one of these labels followed by a colon:',
      'APPROVED RULE: an active mandatory rule applies (cite its ID, e.g. FIN-001)',
      'RECOMMENDED PRACTICE: an active recommended rule applies (cite its ID)',
      'PENDING PROPOSAL: only a draft or pending rule or a pending amendment covers it, so it is not binding yet (cite it)',
      'MISSING RULE: nothing covers this; say what the founders need to decide',
      'Plain text only. No markdown, no bullets, no headings.',
      '',
      'AUTHORITY: Level 1 limit is ' + authority.limit + ' rupees per spend or commitment; above it needs all founders. Emergency authority: ' + authority.emergency + ' Founder absence: ' + authority.absence,
      'Responsibility matrix: ' + (authority.matrix || []).map(row => row.area + ' = ' + row.who + ' (Level ' + row.lvl + ')').join('; '),
      '',
      'RULES:',
      ...rules.map(ruleLine),
      ...pendingAmendments,
      ...activeExceptions,
      '',
      'Question from ' + (PEOPLE[this.state.me] || PEOPLE.both).first + ': ' + question,
    ].join('\n');

    this.setState({ cxbusy: true, cxnote: 'Reading the constitution…' });
    try {
      const answer = await window.claude.complete(promptText);
      this.upd(draft => {
        ensureCos(draft);
        XmigrateCons(draft.constitution);
        draft.constitution.asks = [
          { id: uid(), q: question, a: String(answer || '').trim(), by: this.state.me, at: Date.now() },
          ...(draft.constitution.asks || []),
        ].slice(0, 50);
      });
      this.setState({ cxbusy: false, cxq: '', cxnote: '' });
    } catch {
      this.setState({ cxbusy: false, cxnote: 'Could not get an answer. Try again.' });
    }
  }
}
