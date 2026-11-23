/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import HQWeeklyRhythm from './06-weekly-rhythm';
import { PEOPLE, COS, coOf, segOf, PARTNER_DEF, PARTNER_ROWS, iso, plus, dayDiff, uid, INK_C, RED, AMBER, GREEN, MUTED, act, goalCalc, CT_TYPES, CT_ST, AI_ON } from './core';
import { newLeadInHQ, noteOnLead, openLeadInHQ, searchLeadsInHQ } from '../leads/hqLeads';

const DAY_MS = 864e5;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default class HQSales extends HQWeeklyRhythm {
  /** Portal leads in HQ's shape (leads/hqLeads): HQ's only sales pipeline. Empty until they have loaded. */
  leadsAll() {
    return this.state.leads || [];
  }

  /** Open a lead's drawer in HQ → Sales → Pipeline. */
  openLead(id) {
    openLeadInHQ(this, id);
  }

  /**
   * View model for the sales area: contracts (`ct`), pipeline (`pp`: the won-lead contract action for the
   * hosted Leads page), chief-of-staff brief (`cs`), customers (`cu`) and the hub tab bars (`hub`).
   * Side effects: caches badge counts in `this._ctN`, `this._ppN` and `this._csN`.
   */
  salesViewModel() {
    const state = this.state;
    const { me, data } = state;
    const setUi = patch => this.setState(patch);
    const person = id => PEOPLE[id] || PEOPLE.both;
    const now = new Date();
    const today = iso(now);
    // Options may be [value, label] pairs or plain values (used as both).
    const selectProps = (value, onChange, list) => ({
      value,
      onChange,
      opts: list.map(option => Array.isArray(option) ? { v: option[0], l: option[1] } : { v: option, l: option }),
    });
    const formatDate = isoDate => isoDate
      ? new Date(isoDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—';
    const companyInfo = companyId => {
      const company = coOf(companyId);
      return {
        co: company.name || 'Founders',
        coIni: company.ini || 'F',
        coBg: company.bg || 'oklch(0.55 0.02 265)',
      };
    };
    const statTile = (label, value, hint, color, active, onClick) => ({
      l: label,
      v: String(value),
      h: hint,
      c: color || INK_C,
      bg: active ? 'color-mix(in oklch, var(--acc) 6%, #fff)' : '#fff',
      bd: active ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.915 0.006 85)',
      go: onClick,
    });
    // "All" + one tab per company, each with the number of matching items.
    const companyTabs = (current, items, setCompany) => [['any', 'All'], ...COS.map(company => [company.id, company.name])]
      .map(([tabId, label]) => {
        const company = coOf(tabId);
        const active = current === tabId;
        return {
          label,
          n: String(items.filter(item => tabId === 'any' || item.co === tabId).length),
          hasTile: tabId !== 'any',
          tile: company.bg || '',
          ini: company.ini || '',
          fg: active ? INK_C : MUTED,
          bd: active ? INK_C : 'transparent',
          go: () => setCompany(tabId),
        };
      });
    const ownerOptions = [['rahul', PEOPLE.rahul.first], ['saswat', PEOPLE.saswat.first], ['both', 'Both']];

    // ---------- contracts
    const contracts = data.contracts || [];
    const contractFilter = { co: 'any', q: '', type: 'any', status: 'any', sort: 'end', ...(state.ctf || {}) };
    const setContractFilter = patch => setUi({ ctf: { ...contractFilter, ...patch } });
    /** Effective status: an end date within 60 days means "Renewing"; past it, "Expired" unless it auto-renews. */
    const contractStatus = contract => {
      if (contract.status === 'Terminated' || contract.status === 'Draft' || contract.status === 'Under review') return contract.status;
      if (contract.end && dayDiff(contract.end) < 0) return contract.renew ? 'Active' : 'Expired';
      if (contract.end && dayDiff(contract.end) <= 60) return 'Renewing';
      return 'Active';
    };
    // Recurring value per year (one-time contracts count as 0).
    const yearlyValue = contract => {
      const value = Number(contract.value) || 0;
      return contract.period === 'month' ? value * 12 : contract.period === 'year' ? value : 0;
    };
    const activeContracts = contracts.filter(contract => ['Active', 'Renewing'].includes(contractStatus(contract)));
    const renewing = contracts.filter(contract => contractStatus(contract) === 'Renewing');
    this._ctN = renewing.length;
    const updateContract = (id, fn) => this.upd(draft => {
      const contract = (draft.contracts || []).find(item => item.id === id);
      if (contract) {
        fn(contract, draft);
        contract.updated = Date.now();
      }
    });
    /** Create a draft contract (optionally prefilled), open it and return its id. */
    const newContract = preset => {
      const id = uid();
      this.upd(draft => {
        draft.contracts = [{
          id,
          name: '',
          party: '',
          type: 'Customer',
          co: contractFilter.co !== 'any' ? contractFilter.co : (COS[0] || {}).id || 'all',
          status: 'Draft',
          value: '',
          period: 'year',
          start: today,
          end: '',
          notice: 30,
          renew: false,
          signer: '',
          owner: me,
          link: '',
          terms: '',
          created: Date.now(),
          updated: Date.now(),
          ...(preset || {}),
        }, ...(draft.contracts || [])];
        act(draft, me, 'added a contract', (preset && preset.co) || 'all');
      });
      setUi({ ctOpen: id, view: 'contracts' });
      this._focus = { sel: '[data-ctid="' + id + '"]' };
      return id;
    };
    // Leads (portal): won ones can become customer contracts, linked by lead id.
    const leads = this.leadsAll();
    const leadById = new Map(leads.map(lead => [lead.id, lead]));
    const contractOfLead = id => contracts.find(contract => contract.leadId === id);
    const knownCompany = id => (COS.some(company => company.id === id) ? id : (COS[0] || {}).id || 'all');
    /** Create a customer contract (1-year, in review) from a won lead, linked to it, and open it. */
    const contractFromLead = lead => {
      const contractId = newContract({
        name: lead.name || 'Customer agreement',
        party: lead.acct || lead.contact || '',
        type: 'Customer',
        co: knownCompany(lead.co),
        value: lead.value || '',
        period: 'year',
        status: 'Under review',
        end: plus(365),
        leadId: lead.id,
      });
      this.go('contracts', { ctOpen: contractId });
    };
    const wonWithoutContract = leads.filter(lead => lead.won && !contractOfLead(lead.id))
      .sort((first, second) => (second.wonAt || 0) - (first.wonAt || 0));
    const contractQuery = contractFilter.q.trim().toLowerCase();
    const contractSorter = contractFilter.sort === 'value'
      ? (first, second) => yearlyValue(second) - yearlyValue(first)
      : contractFilter.sort === 'name'
        ? (first, second) => (first.name || '').localeCompare(second.name || '')
        : (first, second) => (first.end || '9999') < (second.end || '9999') ? -1 : 1;
    const visibleContracts = contracts
      .filter(contract => (contractFilter.co === 'any' || contract.co === contractFilter.co)
        && (contractFilter.type === 'any' || contract.type === contractFilter.type)
        && (contractFilter.status === 'any' || contractStatus(contract) === contractFilter.status)
        && (!contractQuery || ((contract.name || '') + ' ' + (contract.party || '') + ' ' + (contract.terms || '')).toLowerCase().includes(contractQuery)))
      .sort(contractSorter);
    /** [label, colour] describing how long a contract has left. */
    const timeLeft = contract => {
      if (!contract.end) return ['No end date', MUTED];
      const days = dayDiff(contract.end);
      if (days < 0) return [contract.renew ? 'Auto-renewed' : 'Ended ' + (-days) + 'd ago', contract.renew ? MUTED : RED];
      if (days === 0) return ['Ends today', RED];
      return [days + ' days left', days <= 30 ? RED : days <= 60 ? AMBER : MUTED];
    };
    const formatContractValue = contract => !Number(contract.value)
      ? '—'
      : this.money(Number(contract.value)) + (contract.period === 'month' ? ' / mo' : contract.period === 'year' ? ' / yr' : '');
    // Clicking an active status tile clears the status filter again.
    const toggleStatus = status => () => setContractFilter({ status: contractFilter.status === status ? 'any' : status });

    const ct = {
      sub: activeContracts.length + ' active · ' + renewing.length + ' renewing in 60 days · '
        + this.money(activeContracts.reduce((sum, contract) => sum + yearlyValue(contract), 0)) + ' a year under contract',
      add: () => newContract(),
      // "From a won lead…": won leads that have no contract yet.
      hasFromLead: !!wonWithoutContract.length,
      fromLead: selectProps('', event => {
        const lead = leadById.get(event.target.value);
        if (lead) contractFromLead(lead);
      }, [['', 'From a won lead…'], ...wonWithoutContract.map(lead => [lead.id, (lead.name || lead.id) + ' · ' + coOf(knownCompany(lead.co)).name + (lead.value ? ' · ' + this.money(lead.value) : '')])]),
      coTabs: companyTabs(contractFilter.co, contracts, companyId => setContractFilter({ co: companyId })),
      tiles: [
        statTile('Active', activeContracts.length, 'Signed and in force', GREEN, contractFilter.status === 'Active', toggleStatus('Active')),
        statTile('Renewing soon', renewing.length, 'Ending in 60 days', renewing.length ? AMBER : INK_C,
          contractFilter.status === 'Renewing', toggleStatus('Renewing')),
        statTile('Expired', contracts.filter(contract => contractStatus(contract) === 'Expired').length, 'Not renewed',
          contracts.some(contract => contractStatus(contract) === 'Expired') ? RED : INK_C,
          contractFilter.status === 'Expired', toggleStatus('Expired')),
        statTile('Not signed', contracts.filter(contract => ['Draft', 'Under review'].includes(contractStatus(contract))).length,
          'Drafts and in review', INK_C, contractFilter.status === 'Under review', toggleStatus('Under review')),
        statTile('Yearly value', this.money(activeContracts.reduce((sum, contract) => sum + yearlyValue(contract), 0)),
          'Recurring contracts', INK_C, false, () => setContractFilter({ sort: 'value' })),
      ],
      q: contractFilter.q,
      onQ: event => setContractFilter({ q: event.target.value }),
      fType: selectProps(contractFilter.type, event => setContractFilter({ type: event.target.value }),
        [['any', 'Any type'], ...CT_TYPES.map(type => [type, type])]),
      fStatus: selectProps(contractFilter.status, event => setContractFilter({ status: event.target.value }),
        [['any', 'Any status'], ...Object.keys(CT_ST).map(status => [status, status])]),
      fSort: selectProps(contractFilter.sort, event => setContractFilter({ sort: event.target.value }),
        [['end', 'Sort: ends soonest'], ['value', 'Sort: highest value'], ['name', 'Sort: name']]),
      anyF: !!(contractFilter.q || contractFilter.type !== 'any' || contractFilter.status !== 'any'),
      clear: () => setContractFilter({ q: '', type: 'any', status: 'any' }),
      shown: visibleContracts.length + (visibleContracts.length === 1 ? ' contract' : ' contracts'),
      rows: visibleContracts.map(contract => {
        const status = contractStatus(contract);
        const [left, leftC] = timeLeft(contract);
        return {
          ...companyInfo(contract.co),
          name: contract.name || 'Untitled contract',
          party: contract.party || 'No counterparty yet',
          type: contract.type,
          value: formatContractValue(contract),
          end: formatDate(contract.end),
          left,
          leftC,
          owner: person(contract.owner).first,
          st: status,
          sBg: CT_ST[status][0],
          sFg: CT_ST[status][1],
          open: () => setUi({ ctOpen: contract.id }),
        };
      }),
      empty: !visibleContracts.length,
      emptyTxt: contracts.length
        ? 'No contracts match these filters.'
        : 'No contracts yet. Add customer agreements, vendor contracts, NDAs, leases and shareholder agreements to track renewals.',
      copy: () => {
        const text = visibleContracts.map(contract => '- ' + (contract.name || 'Untitled') + ' · ' + (contract.party || '')
          + ' · ' + contract.type + ' · ' + coOf(contract.co).name + ' · ' + formatContractValue(contract)
          + ' · ends ' + formatDate(contract.end) + ' · ' + contractStatus(contract)).join('\n');
        if (navigator.clipboard) navigator.clipboard.writeText(text);
        this.toastMsg('Copied ' + visibleContracts.length + ' contracts');
      },
    };

    // Contract side panel
    const selectedContract = contracts.find(contract => contract.id === state.ctOpen);
    ct.hasOpen = !!selectedContract;
    ct.d = { close: () => setUi({ ctOpen: null }) };
    if (selectedContract) {
      const contract = selectedContract;
      const status = contractStatus(contract);
      const [left, leftC] = timeLeft(contract);
      const bindField = key => event => updateContract(contract.id, item => { item[key] = event.target.value; });
      // Last day to give notice: end date minus the notice period.
      const noticeDate = contract.end
        ? iso(new Date(new Date(contract.end + 'T00:00:00').getTime() - (Number(contract.notice) || 0) * DAY_MS))
        : '';
      const hasTask = this.tasksAll().some(task => task.ctId === contract.id && !task.done);
      const linkedLead = contract.leadId ? leadById.get(contract.leadId) : null;
      Object.assign(ct.d, {
        id: contract.id,
        st: status,
        sBg: CT_ST[status][0],
        sFg: CT_ST[status][1],
        left,
        leftC,
        name: contract.name || '',
        onName: bindField('name'),
        party: contract.party || '',
        onParty: bindField('party'),
        type: selectProps(contract.type, bindField('type'), CT_TYPES),
        co: selectProps(contract.co, bindField('co'), [...COS.map(company => [company.id, company.name]), ['all', 'Founders (group)']]),
        statusSeg: segOf(
          [['Draft', 'Draft'], ['Under review', 'In review'], ['Signed', 'Signed'], ['Terminated', 'Ended']],
          ['Draft', 'Under review', 'Terminated'].includes(contract.status) ? contract.status : 'Signed',
          value => updateContract(contract.id, (item, draft) => {
            item.status = value;
            if (value === 'Signed' && !item.signedAt) {
              item.signedAt = Date.now();
              act(draft, me, 'signed “' + (item.name || 'a contract') + '”', item.co);
            }
          }),
        ),
        value: contract.value === '' || contract.value === undefined ? '' : String(contract.value),
        onValue: event => updateContract(contract.id, item => { item.value = event.target.value === '' ? '' : Number(event.target.value); }),
        period: selectProps(contract.period || 'year', bindField('period'), [['once', 'One-time'], ['month', 'Per month'], ['year', 'Per year']]),
        start: contract.start || '',
        onStart: bindField('start'),
        endV: contract.end || '',
        onEnd: bindField('end'),
        notice: contract.notice === undefined ? '' : String(contract.notice),
        onNotice: event => updateContract(contract.id, item => { item.notice = Number(event.target.value) || 0; }),
        renewSeg: segOf([[false, 'No'], [true, 'Yes, automatically']], !!contract.renew,
          value => updateContract(contract.id, item => { item.renew = value; })),
        signer: contract.signer || '',
        onSigner: bindField('signer'),
        owner: selectProps(contract.owner || me, bindField('owner'), ownerOptions),
        link: contract.link || '',
        onLink: bindField('link'),
        hasLink: /^https?:\/\//i.test(contract.link || ''),
        terms: contract.terms || '',
        onTerms: bindField('terms'),
        // The won lead this contract was made from (opens its drawer in Sales → Pipeline).
        hasLead: !!contract.leadId,
        leadTxt: contract.leadId
          ? (linkedLead ? contract.leadId + ' · ' + (linkedLead.name || '') + ' · ' + linkedLead.stage + ' · ' + linkedLead.owner : contract.leadId)
          : '',
        openLead: () => this.openLead(contract.leadId),
        hasNotice: !!contract.end && status !== 'Terminated',
        noticeTxt: contract.end
          ? (contract.renew
            ? 'Renews automatically on ' + formatDate(contract.end) + '. To cancel or renegotiate, give notice by ' + formatDate(noticeDate) + '.'
            : 'Ends on ' + formatDate(contract.end) + '. Decide on renewal by ' + formatDate(noticeDate) + '.')
          : '',
        canTask: !hasTask,
        hasTask,
        // Reminder team task for me, due on the notice date (or in 3 days if that has passed).
        makeTask: () => this.makeTeamTask({
          title: (contract.renew ? 'Review auto-renewal: ' : 'Renew or end: ') + (contract.name || 'contract')
            + (contract.party ? ' (' + contract.party + ')' : ''),
          co: contract.co,
          due: noticeDate && noticeDate > today ? noticeDate : plus(3),
          pri: 'High',
          notes: contract.end ? 'Contract ' + (contract.renew ? 'renews' : 'ends') + ' on ' + formatDate(contract.end) + (noticeDate ? '; notice by ' + formatDate(noticeDate) + '.' : '.') : '',
          from: 'the contract “' + (contract.name || 'Untitled contract') + '”',
        }, { ctId: contract.id }),
        // Renew for another term of the same length (at least 30 days), starting the day after it ends.
        renew: () => {
          if (!contract.end) { this.toastMsg('Add an end date first'); return; }
          const termStart = new Date(contract.start ? contract.start + 'T00:00:00' : contract.end + 'T00:00:00');
          const termEnd = new Date(contract.end + 'T00:00:00');
          const termDays = Math.max(30, Math.round((termEnd - termStart) / DAY_MS));
          const nextStart = new Date(termEnd.getTime() + DAY_MS);
          const nextEnd = new Date(nextStart.getTime() + termDays * DAY_MS);
          updateContract(contract.id, (item, draft) => {
            item.start = iso(nextStart);
            item.end = iso(nextEnd);
            item.status = 'Signed';
            act(draft, me, 'renewed “' + (item.name || 'a contract') + '”', item.co);
          });
          this.toastMsg('Renewed to ' + formatDate(iso(nextEnd)));
        },
        dup: () => {
          const duplicate = { ...JSON.parse(JSON.stringify(contract)), id: uid(), name: (contract.name || 'Contract') + ' (copy)', status: 'Draft', created: Date.now() };
          this.upd(draft => { draft.contracts = [duplicate, ...(draft.contracts || [])]; });
          setUi({ ctOpen: duplicate.id });
        },
        remove: () => {
          const snapshot = JSON.parse(JSON.stringify(contract));
          this.upd(draft => { draft.contracts = (draft.contracts || []).filter(item => item.id !== contract.id); });
          setUi({ ctOpen: null });
          this.toastMsg('Contract deleted', () => this.upd(draft => { draft.contracts = [snapshot, ...(draft.contracts || [])]; }));
        },
        meta: 'Added ' + new Date(contract.created || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          + (contract.updated ? ' · updated ' + new Date(contract.updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''),
      });
    }

    // ---------- pipeline (the portal's Leads page, hosted in Sales → Pipeline)
    const isOpenLead = lead => lead.open;
    const leadsValue = list => list.reduce((sum, lead) => sum + (Number(lead.value) || 0), 0);
    const openLeads = leads.filter(isOpenLead);
    // Sidebar badge: my leads whose next follow-up is due today or late.
    this._ppN = openLeads.filter(lead => lead.seat === me && lead.nextDate && dayDiff(lead.nextDate) <= 0).length;
    const pp = {
      /** The drawer action for a won lead: open its contract, or create one from it. Null for other leads. */
      contractFor: id => {
        const lead = leadById.get(id);
        if (!lead || !lead.won) return null;
        const linked = contractOfLead(id);
        return linked
          ? { label: 'Open contract', run: () => this.go('contracts', { ctOpen: linked.id }) }
          : { label: 'Create contract', run: () => contractFromLead(lead) };
      },
    };

    // ---------- chief of staff
    const who = state.csWho || me;
    const whoPerson = person(who);
    const hour = now.getHours();
    const isMonday = now.getDay() === 1;
    // Team tasks for `who` that are due or late: mine = assigned to / given by me; the other founder's =
    // assigned to / given by someone with their account name.
    const isTheirs = task => (who === me ? task.mine : [task.assignee, task.giver].includes(whoPerson.name));
    const myTasks = this.tasksAll()
      .filter(task => !task.done && isTheirs(task) && task.due && dayDiff(task.due) <= 0)
      .sort((first, second) => (first.due < second.due ? -1 : 1));
    const decisionsDue = data.decisions.filter(decision => decision.status === 'Proposed'
      && (decision.by === who || decision.by === 'both') && decision.due && dayDiff(decision.due) <= 2);
    const constitution = data.constitution || {};
    const approvalsWaiting = (constitution.rules || []).filter(rule => rule.status === 'Pending' && !(rule.sign || []).includes(who)).length
      + (constitution.amendments || []).filter(amendment => amendment.status === 'Pending' && !(amendment.appr || []).includes(who)).length;
    // Leads `who` owns whose next follow-up is due today or late.
    const leadsDue = openLeads.filter(lead => lead.seat === who && lead.nextDate && dayDiff(lead.nextDate) <= 0)
      .sort((first, second) => (first.nextAt || 0) - (second.nextAt || 0));
    // Tag colours [background, text] for the to-do list (not read anywhere at the moment).
    const TAG_COLORS = {
      TASK: ['oklch(0.95 0.03 265)', 'oklch(0.42 0.13 265)'],
      DECIDE: ['oklch(0.95 0.04 300)', 'oklch(0.42 0.13 300)'],
      LEAD: ['oklch(0.95 0.04 190)', 'oklch(0.4 0.09 190)'],
      APPROVE: ['oklch(0.96 0.05 85)', 'oklch(0.45 0.12 65)'],
      RENEW: ['oklch(0.95 0.035 25)', 'oklch(0.48 0.17 25)'],
    };

    // Things that need `who` today.
    const todo = [];
    myTasks.slice(0, 8).forEach(task => {
      const days = dayDiff(task.due);
      todo.push({
        tag: 'TASK',
        text: (task.co && task.co !== 'all' ? coOf(task.co).name + ' · ' : '') + (task.title || 'Untitled task'),
        meta: days === 0 ? 'today' : (-days) + 'd late',
        mc: days < 0 ? RED : AMBER,
        go: () => this.openTask(task.id),
        canDone: task.canStatus,
        done: () => this.toggleTask(task),
      });
    });
    decisionsDue.forEach(decision => todo.push({
      tag: 'DECIDE',
      text: decision.title || 'Untitled decision',
      meta: dayDiff(decision.due) < 0 ? (-dayDiff(decision.due)) + 'd late' : 'due ' + formatDate(decision.due).replace(/ \d{4}$/, ''),
      mc: AMBER,
      go: () => this.go('decisions', { dopen: decision.id }),
      canDone: false,
    }));
    leadsDue.forEach(lead => todo.push({
      tag: 'LEAD',
      text: (lead.next || 'Follow up') + ' · ' + (lead.name || lead.id),
      meta: dayDiff(lead.nextDate) === 0 ? 'today' : (-dayDiff(lead.nextDate)) + 'd late',
      mc: dayDiff(lead.nextDate) < 0 ? RED : AMBER,
      go: () => this.openLead(lead.id),
      canDone: false,
    }));
    if (approvalsWaiting) {
      todo.push({
        tag: 'APPROVE',
        text: approvalsWaiting + ' constitution items waiting for you',
        meta: '',
        mc: MUTED,
        go: () => this.go('constitution', { cnTab: 'overview' }),
        canDone: false,
      });
    }
    renewing
      .filter(contract => contract.owner === who || contract.owner === 'both')
      .filter(contract => dayDiff(contract.end) <= 30)
      .forEach(contract => todo.push({
        tag: 'RENEW',
        text: (contract.name || 'Contract') + (contract.party ? ' · ' + contract.party : ''),
        meta: dayDiff(contract.end) + 'd left',
        mc: RED,
        go: () => this.go('contracts', { ctOpen: contract.id }),
        canDone: false,
      }));
    this._csN = todo.length;

    // Risks to watch across the group.
    const risks = [];
    COS.forEach(company => {
      const finance = this.finOf(company.id);
      const figures = this.calc(finance);
      if (figures.months !== null && figures.months < 6) {
        risks.push({
          c: RED,
          text: company.name + ' has ' + figures.months.toFixed(1) + ' months of runway',
          area: 'Finance · the constitution asks for 6 months',
          go: () => this.go('finance', { fco: company.id }),
        });
      }
    });
    {
      const partnerCounts = this.partner().n;
      const waiting = [[partnerCounts.tickets, 'support ticket'], [partnerCounts.approvals, 'scope approval'], [partnerCounts.pay, 'payout'], [partnerCounts.kyc, 'KYC check']]
        .filter(entry => +entry[0])
        .map(([count, label]) => count + ' ' + label + (count > 1 ? 's' : ''));
      if (waiting.length) {
        risks.push({ c: AMBER, text: 'Mariox partners waiting: ' + waiting.join(' · '), area: 'Partner admin', go: () => this.setState({ ptOpen: true }) });
      }
    }
    if (this._scOff) {
      risks.push({ c: AMBER, text: this._scOff + ' scorecard numbers are off goal this week', area: 'Scorecard', go: () => this.go('scorecard', { scCo: 'all' }) });
    }
    data.goals
      .filter(goal => ['At risk', 'Behind', 'Overdue'].includes(goalCalc(goal, this.tasksAll()).status))
      .slice(0, 4)
      .forEach(goal => risks.push({
        c: AMBER,
        text: (goal.title || 'A goal') + ' is ' + goalCalc(goal, this.tasksAll()).status.toLowerCase(),
        area: 'Goals · ' + coOf(goal.co).name,
        go: () => this.go('goals'),
      }));
    renewing.filter(contract => dayDiff(contract.end) <= 30).forEach(contract => risks.push({
      c: RED,
      text: (contract.name || 'A contract') + ' ends in ' + dayDiff(contract.end) + ' days' + (contract.renew ? ' and renews automatically' : ''),
      area: 'Contracts · ' + coOf(contract.co).name,
      go: () => this.go('contracts', { ctOpen: contract.id }),
    }));
    // The three biggest open leads with no activity for 14 days.
    const staleBigLeads = openLeads
      .filter(lead => (Date.now() - (lead.updated || lead.created || 0)) > 14 * DAY_MS)
      .sort((first, second) => (Number(second.value) || 0) - (Number(first.value) || 0))
      .slice(0, 3);
    staleBigLeads.forEach(lead => risks.push({
      c: AMBER,
      text: (lead.name || 'A lead') + ' has had no activity for 2 weeks',
      area: 'Sales pipeline · ' + coOf(knownCompany(lead.co)).name + ' · ' + this.money(Number(lead.value) || 0),
      go: () => this.openLead(lead.id),
    }));
    // Overdue team tasks assigned to or given by me.
    const overdueCount = this.myTasks().filter(task => !task.done && task.due && dayDiff(task.due) < 0).length;
    if (overdueCount >= 5) risks.push({ c: AMBER, text: overdueCount + ' of your team tasks are overdue', area: 'Tasks', go: () => this.goTasks() });

    const briefs = (data.briefs || []).filter(brief => brief.by === who);
    const latest = briefs[0];
    const todayBrief = latest && iso(new Date(latest.at)) === today;
    // Plain-text facts handed to Claude by csWrite().
    const facts = [
      'Today: ' + now.toDateString(),
      'Overdue or due today for ' + whoPerson.first + ': '
        + (myTasks.slice(0, 10).map(task => coOf(task.co).name + ': ' + task.title + ' (due ' + task.due + ')').join('; ') || 'none'),
      'Decisions due: ' + (decisionsDue.map(decision => decision.title).join('; ') || 'none'),
      'Lead follow-ups due: ' + (leadsDue.map(lead => lead.name + ': ' + lead.next).join('; ') || 'none'),
      'Pipeline: ' + this.money(leadsValue(openLeads)) + ' open in ' + openLeads.length + ' leads',
      'Constitution approvals waiting: ' + approvalsWaiting,
      'Risks: ' + (risks.map(risk => risk.text).join('; ') || 'none'),
      'Companies: ' + COS.map(company => {
        const figures = this.calc(this.finOf(company.id));
        return company.name + ' (runway ' + figures.runway + ')';
      }).join(', '),
    ].join('\n');
    const plural = (count, one, many) => count + (count === 1 ? one : many);
    const cs = {
      kicker: (isMonday ? 'Monday brief · ' : 'Daily brief · ') + now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
      greet: (hour < 12 ? 'Good morning, ' : hour < 17 ? 'Good afternoon, ' : 'Good evening, ') + whoPerson.first,
      sub: todo.length
        ? plural(todo.length, ' thing needs', ' things need') + ' you today · ' + plural(risks.length, ' risk', ' risks') + ' to watch'
        : 'Nothing urgent today · ' + plural(risks.length, ' risk', ' risks') + ' to watch',
      whoSeg: segOf([['rahul', PEOPLE.rahul.first], ['saswat', PEOPLE.saswat.first]], who, founder => setUi({ csWho: founder })),
      write: () => this.csWrite(facts, who),
      writeLbl: state.csBusy ? 'Writing…' : todayBrief ? '✦ Rewrite brief' : '✦ Write my brief',
      pulse: [
        ['Decisions due', decisionsDue.length, decisionsDue.length ? AMBER : INK_C, 'Within 2 days', () => this.go('decisions')],
        ['Lead follow-ups', leadsDue.length, leadsDue.length ? AMBER : INK_C, 'Due today or late', () => this.go('pipeline')],
        ['Approvals', approvalsWaiting, approvalsWaiting ? AMBER : INK_C, 'Constitution', () => this.go('constitution', { cnTab: 'overview' })],
        ['Off goal', this._scOff || 0, this._scOff ? RED : INK_C, 'Scorecard', () => this.go('scorecard', { scCo: 'all' })],
        ['Renewals', renewing.length, renewing.length ? AMBER : INK_C, 'Next 60 days', () => this.go('contracts', { ctf: { status: 'Renewing' } })],
      ].map(([label, value, color, hint, onClick]) => ({ l: label, v: String(value), c: color, h: hint, go: onClick })),
      hasBrief: !!latest,
      briefHead: latest
        ? (latest.monday ? 'MONDAY BRIEF' : 'TODAY\'S BRIEF')
          + (todayBrief ? '' : ' · FROM ' + new Date(latest.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase())
        : '',
      briefWhen: latest ? new Date(latest.at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '',
      briefText: latest ? latest.text : '',
      copyBrief: () => {
        if (latest && navigator.clipboard) navigator.clipboard.writeText(latest.text);
        this.toastMsg('Brief copied');
      },
      note: state.csNote || (!latest && AI_ON ? 'Press “Write my brief” and Claude turns everything below into a short plan for your day.' : ''),
      hasNote: !!(state.csNote || (!latest && AI_ON)),
      todo,
      noTodo: !todo.length,
      todoN: todo.length ? String(todo.length) : '',
      risks,
      noRisk: !risks.length,
      riskN: risks.length ? String(risks.length) : '',
      past: briefs.slice(1, 10).map(brief => {
        const open = state.csOpen === brief.id;
        return {
          date: new Date(brief.at).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) + (brief.monday ? ' · Monday brief' : ''),
          who: person(brief.by).first,
          text: brief.text,
          open,
          caret: open ? '▼' : '▶',
          toggle: () => setUi({ csOpen: open ? null : brief.id }),
        };
      }),
      hasPast: briefs.length > 1,
    };
    cs.hasRisk = !!risks.length;

    /** Tab bar for a hub: list rows are [view id, label, badge, highlight badge?]. */
    const hubTabs = (list, currentView) => list.map(([viewId, label, badge, hot]) => {
      const active = currentView === viewId;
      return {
        label,
        hasN: !!badge,
        n: String(badge || ''),
        nBg: hot ? 'oklch(0.95 0.05 85)' : 'oklch(0.92 0.005 85)',
        nFg: hot ? 'oklch(0.45 0.12 65)' : 'oklch(0.45 0.012 265)',
        bg: active ? '#fff' : 'transparent',
        fg: active ? INK_C : MUTED,
        sh: active ? '0 1px 2px oklch(0.2 0.02 265 / 0.1)' : 'none',
        go: () => this.go(viewId),
      };
    });

    // ---------- customers (derived from leads + customer contracts, grouped by client company name)
    const customerFilter = { q: '', co: 'any', ...(state.cuf || {}) };
    const setCustomerFilter = patch => setUi({ cuf: { ...customerFilter, ...patch } });
    const customerKey = name => (name || '').trim().toLowerCase();
    const customersByKey = {};
    const customerFor = (key, name) => {
      if (!customersByKey[key]) customersByKey[key] = { name, leads: [], cts: [], cos: new Set(), contact: '', last: 0 };
      return customersByKey[key];
    };
    leads.forEach(lead => {
      const key = customerKey(lead.acct);
      if (!key) return;
      const customer = customerFor(key, lead.acct.trim());
      customer.leads.push(lead);
      customer.cos.add(knownCompany(lead.co));
      if (!customer.contact && (lead.contact || lead.email)) customer.contact = [lead.contact, lead.email].filter(Boolean).join(' · ');
      customer.last = Math.max(customer.last, lead.updated || lead.created || 0);
    });
    contracts.filter(contract => contract.type === 'Customer').forEach(contract => {
      const key = customerKey(contract.party);
      if (!key) return;
      const customer = customerFor(key, contract.party.trim());
      customer.cts.push(contract);
      customer.cos.add(contract.co);
      customer.last = Math.max(customer.last, contract.updated || contract.created || 0);
    });
    const customerQuery = customerFilter.q.trim().toLowerCase();
    const visibleCustomers = Object.values(customersByKey).filter(customer => (customerFilter.co === 'any' || customer.cos.has(customerFilter.co))
      && (!customerQuery || (customer.name + ' ' + customer.contact).toLowerCase().includes(customerQuery)));
    const customerRows = visibleCustomers.map(customer => {
      const openCustomerLeads = customer.leads.filter(isOpenLead);
      const wonLeads = customer.leads.filter(lead => lead.won);
      const liveContracts = customer.cts.filter(contract => ['Active', 'Renewing'].includes(contractStatus(contract)));
      const nextEnding = liveContracts
        .filter(contract => contract.end)
        .sort((first, second) => first.end < second.end ? -1 : 1)[0];
      const wonValue = leadsValue(wonLeads);
      return {
        sortV: wonValue + leadsValue(openCustomerLeads),
        name: customer.name,
        meta: customer.leads.length + (customer.leads.length === 1 ? ' lead' : ' leads') + ' · last activity '
          + (customer.last ? new Date(customer.last).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'),
        contact: customer.contact || '—',
        cos: [...customer.cos].map(companyId => {
          const company = coOf(companyId);
          return { name: company.name, ini: company.ini, bg: company.bg };
        }),
        open: openCustomerLeads.length ? this.money(leadsValue(openCustomerLeads)) + ' · ' + openCustomerLeads.length : '—',
        won: wonValue ? this.money(wonValue) : '—',
        wonC: wonValue ? GREEN : MUTED,
        ct: liveContracts.length ? liveContracts.length + ' active' : customer.cts.length ? customer.cts.length + ' total' : 'None',
        ren: nextEnding
          ? 'Ends ' + new Date(nextEnding.end + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : '',
        renC: nextEnding && dayDiff(nextEnding.end) <= 60 ? AMBER : MUTED,
        goDeals: () => searchLeadsInHQ(this, customer.name),
        goCts: () => this.go('contracts', { ctf: { ...contractFilter, q: customer.name, co: 'any', status: 'any' }, ctOpen: null }),
      };
    }).sort((first, second) => second.sortV - first.sortV);
    const cu = {
      sub: Object.keys(customersByKey).length + ' customers · '
        + this.money(Object.values(customersByKey).reduce((sum, customer) => sum + leadsValue(customer.leads.filter(lead => lead.won)), 0))
        + ' won to date',
      q: customerFilter.q,
      onQ: event => setCustomerFilter({ q: event.target.value }),
      co: selectProps(customerFilter.co, event => setCustomerFilter({ co: event.target.value }),
        [['any', 'All companies'], ...COS.map(company => [company.id, company.name])]),
      rows: customerRows,
      empty: !customerRows.length,
    };

    const offGoalCount = this._scOff || 0;
    const hub = {
      weekly: hubTabs([
        ['sync', 'Founders\' sync', data.syncLive ? 'Live' : '', !!data.syncLive],
        ['scorecard', 'Scorecard', offGoalCount ? offGoalCount + ' off goal' : '', !!offGoalCount],
        ['review', 'Weekly review', '', false],
      ], state.view),
      sales: hubTabs([
        ['pipeline', 'Pipeline', openLeads.length || '', false],
        ['customers', 'Customers', Object.keys(customersByKey).length || '', false],
        ['contracts', 'Contracts', renewing.length ? renewing.length + ' renewing' : (contracts.length || ''), !!renewing.length],
      ], state.view),
    };
    return {
      ct,
      pp,
      cs,
      cu,
      hub,
      isContracts: state.view === 'contracts',
      isPipeline: state.view === 'pipeline',
      isCustomers: state.view === 'customers',
      isBrief: false,
    };
  }

  /** Compact plain-text snapshot of the portal data for the AI prompt (capped at 14,000 characters). */
  aiContext() {
    const data = this.state.data;
    const me = this.state.me;
    const orNoDate = isoDate => isoDate || 'no date';
    const today = iso(new Date());
    const companyName = id => (coOf(id) || {}).name || id;
    const lines = [];
    lines.push('TODAY ' + today + ' · user ' + (PEOPLE[me] || PEOPLE.rahul).name + ' · current page ' + this.state.view);
    lines.push('COMPANIES (id = name): '
      + COS.map(company => company.id + ' = ' + company.name + ' (' + (company.country || '') + ', ' + (company.status || '') + ')').join('; ')
      + '; all = Founders/group');
    COS.forEach(company => {
      const finance = this.finOf(company.id);
      const figures = this.calc(finance);
      lines.push('FINANCE ' + company.name + ': cash ' + (finance.cash || 0) + ', revenue/mo ' + (finance.rev || 0)
        + ', costs/mo ' + (finance.cost || 0) + ', runway ' + figures.runway);
    });
    // Team tasks assigned to or given by me.
    const teamTasks = this.myTasks();
    const openTasks = teamTasks.filter(task => !task.done);
    lines.push('OPEN TEAM TASKS (' + openTasks.length + '): ' + openTasks
      .sort((first, second) => (first.due || '9') < (second.due || '9') ? -1 : 1)
      .slice(0, 60)
      .map(task => '[id ' + task.id + '|' + companyName(task.co) + '|' + (task.assignee || '?') + '|' + task.status + '|due ' + orNoDate(task.due) + '|' + task.pri + '] ' + task.title)
      .join(' ; '));
    lines.push('DONE LAST 7 DAYS: ' + teamTasks
      .filter(task => task.done && task.doneAt && Date.now() - task.doneAt < 7 * DAY_MS)
      .slice(0, 30)
      .map(task => companyName(task.co) + ': ' + task.title)
      .join(' ; '));
    lines.push('GOALS: ' + data.goals.slice(0, 30)
      .map(goal => companyName(goal.co) + ': ' + goal.title + ' (' + goalCalc(goal, teamTasks).status + ')')
      .join(' ; '));
    lines.push('DECISIONS: ' + data.decisions.slice(0, 30)
      .map(decision => '[id ' + decision.id + '] ' + companyName(decision.co) + ': ' + decision.title
        + ' [' + decision.status + (decision.due ? ', due ' + decision.due : '') + ']'
        + (decision.outcome ? ' outcome: ' + decision.outcome.slice(0, 120) : ''))
      .join(' ; '));
    // Sales leads (the portal's pipeline): open ones first, biggest first.
    lines.push('LEADS: ' + this.leadsAll().slice()
      .sort((first, second) => (second.open - first.open) || (second.value - first.value))
      .slice(0, 40)
      .map(lead => '[id ' + lead.id + '] ' + companyName(lead.co) + ': ' + lead.name + (lead.contact ? ' / ' + lead.contact : '')
        + ' [' + lead.stage + ', ' + lead.value + ', owner ' + lead.owner + ', next: ' + (lead.next || 'none') + ' ' + (lead.nextDate || '') + ']')
      .join(' ; '));
    lines.push('CONTRACTS: ' + (data.contracts || []).slice(0, 40)
      .map(contract => companyName(contract.co) + ': ' + (contract.name || '') + ' with ' + (contract.party || '?')
        + ' [' + contract.type + ', ' + contract.status + ', ends ' + orNoDate(contract.end) + ']')
      .join(' ; '));
    lines.push('HIRING: ' + (data.roles || []).slice(0, 20)
      .map(role => companyName(role.co) + ': ' + (role.title || role.name || 'role') + ' [' + role.stage + ']')
      .join(' ; '));
    {
      const partnerCounts = { ...PARTNER_DEF, ...((data.partner || {}).n || {}) };
      lines.push('MARIOX PARTNER ADMIN: ' + PARTNER_ROWS.map(([key, label]) => label + ' ' + partnerCounts[key]).join(' ; '));
    }
    lines.push('RESEARCH: ' + (data.research || []).slice(0, 20)
      .map(research => companyName(research.co) + ': ' + (research.title || '') + ' [' + research.status + ']')
      .join(' ; '));
    const scorecard = data.score || { metrics: [] };
    lines.push('SCORECARD METRICS: ' + (scorecard.metrics || [])
      .map(metric => companyName(metric.co) + ': ' + metric.name
        + (metric.goal !== '' && metric.goal !== undefined ? ' goal ' + (metric.dir === 'down' ? '<=' : '>=') + metric.goal : ''))
      .join(' ; '));
    const constitution = data.constitution || {};
    lines.push('CONSTITUTION ACTIVE RULES: '
      + (constitution.rules || []).filter(rule => rule.status === 'Active').map(rule => rule.code + ' ' + rule.title).join(' ; ')
      + ' · pending approval: ' + (constitution.rules || []).filter(rule => rule.status === 'Pending').length);
    if (data.syncs && data.syncs[0]) {
      lines.push('LAST FOUNDERS SYNC: ' + new Date(data.syncs[0].started).toDateString() + ', open issues: '
        + (data.syncs[0].issues || []).filter(issue => issue.status !== 'solved').map(issue => issue.text).join(' ; '));
    }
    return lines.join('\n').slice(0, 14000);
  }

  /**
   * Send a question to Founders AI. `hidden` is extra context (the item being viewed) that is
   * added to the prompt but not shown in the chat. The reply is stored with its suggested actions.
   */
  async aiSend(text, hidden) {
    const question = (text ?? this.state.aiQ ?? '').trim();
    if (!question || this.state.aiBusy) return;
    if (!this.state.aiOpen) this.setState({ aiOpen: true });
    if (!window.claude || !window.claude.complete) {
      this.setState({ aiErr: 'AI is not available in this browser.' });
      return;
    }
    const history = (this.state.data.aiChat || []).slice(-8);
    this.upd(draft => {
      draft.aiChat = [...(draft.aiChat || []), { id: uid(), role: 'user', text: question, at: Date.now() }].slice(-60);
    });
    this.setState({ aiQ: '', aiBusy: true, aiErr: '' });
    const prompt = [
      'You are Founders AI, the assistant inside Founders HQ, the private command centre of Rahul Garg (Founder) and Saswat Sahu (Co-founder). They run several companies from one portal.',
      'Use ONLY the portal data below. If something is not in the data, say so. Be concise, direct and practical. Use Indian number style for money (lakh, crore).',
      'Reply with ONLY a JSON object, no code fences: {"reply": string, "actions": array}.',
      '"reply": plain text answer, under 160 words, short lines, no markdown symbols. Put long drafts (emails, job descriptions, SOPs) in a copy or doc action instead of the reply.',
      '"actions": optional suggestions the user can approve. Allowed types:',
      '{"type":"task","title":string,"co":companyId,"owner":"rahul"|"saswat"|"both","due":"YYYY-MM-DD","pri":"High"|"Medium"|"Low"}',
      '{"type":"decision","title":string,"co":companyId}',
      '{"type":"deal","name":string,"acct":string,"co":companyId,"value":number}  (a new sales lead; acct = the client company)',
      '{"type":"goal","title":string,"co":companyId,"target":"YYYY-MM-DD"}',
      '{"type":"subtasks","taskId":id,"items":[string]}  (adds checklist items to an existing task)',
      '{"type":"update_task","taskId":id,"due":"YYYY-MM-DD","owner":"rahul"|"saswat","pri":"High"|"Medium"|"Low","status":"Not started"|"In progress"|"Done"}  (any subset)',
      '{"type":"note","kind":"task"|"decision"|"deal","id":id,"text":string}  (adds a note or comment; for a lead use kind "deal" and the lead id)',
      '{"type":"option","decisionId":id,"text":string,"notes":string}  (adds an option with pros and cons to a decision)',
      '{"type":"metric","co":companyId,"name":string,"unit":"#"|"₹"|"%","dir":"up"|"down","goal":number}  (adds a weekly scorecard metric)',
      '{"type":"doc","title":string,"body":markdown}  (creates a page in Docs: SOPs, plans, job descriptions)',
      '{"type":"copy","label":string,"text":string}  (ready-to-send text: emails, posts, messages)',
      '{"type":"goto","view":"home"|"tasks"|"goals"|"decisions"|"sync"|"scorecard"|"review"|"pipeline"|"customers"|"contracts"|"research"|"finance"|"hiring"|"docs"|"companies"|"constitution","label":string}',
      'Only add actions when they clearly help, at most 8. When the user pastes notes, extract every concrete action item as a task with the right owner and company.',
      '',
      'PORTAL DATA:',
      this.aiContext(),
      ...(hidden ? ['', 'ITEM THE USER IS LOOKING AT:', String(hidden).slice(0, 5000)] : []),
      '',
      'CONVERSATION SO FAR:',
      ...history.map(message => (message.role === 'user' ? 'User: ' : 'AI: ') + message.text),
      '',
      'User: ' + question,
    ].join('\n');
    try {
      const raw = String(await window.claude.complete(prompt) || '');
      // Take the outermost {...} from the reply; fall back to treating it all as plain text.
      let parsed = null;
      try {
        const jsonStart = raw.indexOf('{');
        const jsonEnd = raw.lastIndexOf('}');
        parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
      } catch {
        parsed = { reply: raw.trim(), actions: [] };
      }
      const allowedTypes = ['task', 'decision', 'deal', 'goal', 'goto', 'subtasks', 'update_task', 'note', 'option', 'metric', 'doc', 'copy'];
      const actions = (Array.isArray(parsed.actions) ? parsed.actions : [])
        .filter(action => action && allowedTypes.includes(action.type))
        .slice(0, 8)
        .map(action => ({ ...action, id: uid(), state: 'pending' }));
      this.upd(draft => {
        draft.aiChat = [
          ...(draft.aiChat || []),
          { id: uid(), role: 'ai', text: String(parsed.reply || '').trim() || 'Done.', acts: actions, at: Date.now() },
        ].slice(-60);
      });
      this.setState({ aiBusy: false });
    } catch {
      this.setState({ aiBusy: false, aiErr: 'Could not get an answer. Try again.' });
    }
  }

  /** Apply one suggested AI action (message `mid`, action `aid`) and mark it done. */
  aiRun(mid, aid) {
    const me = this.state.me;
    const message = (this.state.data.aiChat || []).find(item => item.id === mid);
    const action = message && (message.acts || []).find(item => item.id === aid);
    // Copy actions can be run again; everything else only while pending.
    if (!action || (action.state !== 'pending' && action.type !== 'copy')) return;
    const companyId = action.co && (COS.some(company => company.id === action.co) || action.co === 'all') ? action.co : (COS[0] || {}).id || 'all';
    const owner = ['rahul', 'saswat', 'both'].includes(action.owner) ? action.owner : me;
    if (action.type === 'goto') {
      this.setState({ aiOpen: false });
      this.go(action.view || 'home');
    }
    if (action.type === 'copy') {
      if (navigator.clipboard) navigator.clipboard.writeText(action.text || '');
      this.toastMsg('Copied to clipboard');
    }
    if (action.type === 'doc') {
      this.setState({ aiOpen: false });
      this.go('docs');
      this.addPage(null, [action.title || 'Untitled', '', action.body || '']);
    }
    // Tasks are team tasks (for me); the AI can create one or open an existing one.
    if (action.type === 'task') {
      this.makeTeamTask({
        title: action.title || 'Untitled task',
        co: companyId,
        due: ISO_DATE.test(action.due || '') ? action.due : plus(7),
        pri: ['High', 'Medium', 'Low'].includes(action.pri) ? action.pri : 'Medium',
        from: 'a Founders AI suggestion',
      });
    }
    // A deal is a new sales lead: its form opens prefilled in Sales → Pipeline (contact and services are needed).
    if (action.type === 'deal') {
      this.setState({ aiOpen: false });
      newLeadInHQ(this, { co: companyId, client: action.acct || action.name || '', value: Number(action.value) || '', notes: action.name && action.acct ? action.name : '' });
    }
    if (action.type === 'note' && action.kind === 'deal') {
      noteOnLead(action.id, action.text).then(saved => { if (!saved) this.toastMsg('That lead isn’t available'); });
    }
    if (['subtasks', 'update_task'].includes(action.type) || (action.type === 'note' && action.kind === 'task')) {
      if (action.taskId || action.id) this.openTask(action.taskId || action.id);
    }
    this.upd(draft => {
      if (action.type === 'decision') {
        draft.decisions.unshift({
          id: uid(),
          title: action.title || 'Untitled decision',
          co: companyId,
          by: 'both',
          status: 'Proposed',
          impact: 'Medium',
          due: plus(7),
          context: 'Suggested by Founders AI',
          options: '',
          opts: [],
          chosen: '',
          outcome: '',
          revisit: '',
          comments: [],
          log: [{ at: Date.now(), by: me, text: 'Logged from Founders AI' }],
          created: Date.now(),
          decidedAt: null,
        });
      }
      if (action.type === 'goal') {
        draft.goals.push({
          id: uid(),
          title: action.title || 'New goal',
          co: companyId,
          owner: owner === 'both' ? me : owner,
          start: iso(new Date()),
          target: ISO_DATE.test(action.target || '') ? action.target : plus(90),
          measure: 'tasks',
          current: 0,
          goalVal: 0,
          unit: '',
          notes: 'Suggested by Founders AI',
          checkins: [],
          created: Date.now(),
        });
      }
      if (action.type === 'note') {
        if (action.kind === 'decision') {
          const decision = draft.decisions.find(item => item.id === action.id);
          if (decision) decision.comments = [...(decision.comments || []), { id: uid(), by: me, text: action.text, at: Date.now() }];
        }
      }
      if (action.type === 'option') {
        const decision = draft.decisions.find(item => item.id === action.decisionId);
        if (decision) decision.opts = [...(decision.opts || []), { id: uid(), text: action.text || '', notes: action.notes || '', votes: [] }];
      }
      if (action.type === 'metric') {
        if (!draft.score) draft.score = { metrics: [], values: {} };
        draft.score.metrics.push({
          id: uid(),
          co: companyId,
          name: action.name || 'Metric',
          unit: ['#', '₹', '%'].includes(action.unit) ? action.unit : '#',
          dir: action.dir === 'down' ? 'down' : 'up',
          src: 'manual',
          goal: action.goal === undefined || action.goal === null ? '' : Number(action.goal) || 0,
          owner: me,
        });
      }
      if (!['goto', 'copy', 'doc', 'deal'].includes(action.type) && !(action.type === 'note' && action.kind === 'deal')) {
        act(draft, me, 'added from Founders AI: “' + (action.title || action.name || action.text || action.type) + '”', companyId);
      }
      const storedMessage = (draft.aiChat || []).find(item => item.id === mid);
      const storedAction = storedMessage && (storedMessage.acts || []).find(item => item.id === aid);
      if (storedAction) storedAction.state = 'done';
    });
  }
}
