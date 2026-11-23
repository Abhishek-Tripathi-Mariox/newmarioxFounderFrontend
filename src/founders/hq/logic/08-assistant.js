/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */

import HQSales from './07-sales';
import { useStore } from '@/store';
import { PEOPLE, coOf, AI_ON } from './core';

/** Human-readable page names, keyed by view id. */
const PAGE_NAMES = {
  home: 'Today', tasks: 'Team tasks', mytasks: 'My tasks', calendar: 'Calendar', attendance: 'Attendance', goals: 'Goals', decisions: 'Decisions',
  sync: 'Founders\' sync', scorecard: 'Scorecard', review: 'Weekly review', pipeline: 'Sales pipeline', customers: 'Customers',
  contracts: 'Contracts', research: 'Research', finance: 'Finance', hiring: 'Hiring', docs: 'Docs & files', vault: 'Vault',
  companies: 'Companies', constitution: 'Constitution', settings: 'Settings', co: 'Company',
};

/** Suggested questions per page. */
const PAGE_PROMPTS = {
  home: ['What are my top 3 priorities today?', 'Which company needs the most attention this week, and why?', 'Summarise what changed in the last 7 days'],
  tasks: ['Which overdue tasks should I drop or delegate?', 'Plan my week from my open tasks', 'Break my biggest task into subtasks'],
  goals: ['Which goals are at risk and what would get them back on track?', 'Suggest 3 quarterly goals for each company'],
  decisions: ['Which open decisions are blocking the most work?', 'Help me think through the oldest open decision'],
  sync: ['Draft the agenda and top issues for our next founders\' sync', 'What did we leave unsolved last sync?'],
  scorecard: ['Suggest 5 weekly metrics for each company', 'Which numbers are trending the wrong way?'],
  review: ['Write this week\'s review in five lines'],
  pipeline: ['Which leads should I follow up on today?', 'Forecast this quarter from the pipeline', 'Which leads look stuck?'],
  customers: ['Who are our most valuable customers?', 'Which customers have renewals coming up?'],
  contracts: ['Which contracts need action in the next 60 days?', 'Are any companies missing NDAs or IP assignments?'],
  research: ['What research is still open, and what should we conclude first?'],
  finance: ['Which company is burning cash fastest?', 'What happens if costs rise 20%?'],
  hiring: ['Which roles are slowest to fill, and why?', 'Are we hiring within budget?'],
  docs: ['Draft a one-page company overview for Mariox'],
  vault: ['What should we store in the vault for each company?'],
  companies: ['Which company setup is least complete?', 'Plan the launch of a new company'],
  constitution: ['Which rules still need my approval?', 'Are we breaking any active rule right now?'],
  settings: ['How should I set up the portal for 100 companies?'],
  co: ['Summarise this company in five lines'],
};

/** Extra suggestions shown after the page prompts when nothing specific is open. */
const EXTRA_PROMPTS = {
  finance: ['Explain our numbers in plain language', 'Find 5 cost-cutting ideas across the companies', 'Which company should get the next ₹10 L?'],
  scorecard: ['Add 5 weekly scorecard metrics for each company'],
  hiring: ['Write a job description for our most urgent role as a doc'],
  docs: ['Write an employee onboarding SOP as a doc', 'Write a 1-page investor update as a doc'],
  companies: ['Write a 90-day launch plan for a new company as a doc'],
  tasks: ['Which tasks can be marked done or deleted?', 'Rebalance work between the founders'],
  pipeline: ['Write a cold email for our ideal customer'],
  home: ['Draft a WhatsApp update to the other founders about today'],
};

/** Per action type: [tag label, tag background, tag text colour, button label]. */
const ACTION_TAGS = {
  task: ['TASK', 'oklch(0.95 0.03 265)', 'oklch(0.42 0.13 265)', 'Create task'],
  decision: ['DECISION', 'oklch(0.95 0.04 300)', 'oklch(0.42 0.13 300)', 'Log decision'],
  deal: ['LEAD', 'oklch(0.95 0.04 190)', 'oklch(0.4 0.09 190)', 'Add lead'],
  goal: ['GOAL', 'oklch(0.95 0.05 150)', 'oklch(0.4 0.11 150)', 'Add goal'],
  goto: ['OPEN', 'oklch(0.95 0.005 265)', 'oklch(0.4 0.012 265)', 'Go'],
  subtasks: ['SUBTASKS', 'oklch(0.95 0.03 265)', 'oklch(0.42 0.13 265)', 'Add'],
  update_task: ['UPDATE', 'oklch(0.96 0.05 85)', 'oklch(0.45 0.12 65)', 'Apply'],
  note: ['NOTE', 'oklch(0.95 0.005 265)', 'oklch(0.4 0.012 265)', 'Add note'],
  option: ['OPTION', 'oklch(0.95 0.04 300)', 'oklch(0.42 0.13 300)', 'Add option'],
  metric: ['METRIC', 'oklch(0.95 0.05 150)', 'oklch(0.4 0.11 150)', 'Add metric'],
  doc: ['DOC', 'oklch(0.95 0.03 255)', 'oklch(0.42 0.13 255)', 'Create page'],
  copy: ['DRAFT', 'oklch(0.95 0.04 190)', 'oklch(0.4 0.09 190)', 'Copy'],
};

export default class HQAssistant extends HQSales {
  /**
   * View model for the Founders AI drawer (`ai7`): chat messages with their suggested actions,
   * page-aware prompt suggestions and the input box. Also registers the Cmd/Ctrl+J shortcut once (when AI_ON).
   */
  assistantViewModel() {
    const state = this.state;
    const me = state.me;
    const chat = state.data.aiChat || [];
    if (AI_ON && !this._aiKey) {
      // Cmd/Ctrl+J toggles the drawer, Escape closes it.
      this._aiKey = event => {
        if ((event.metaKey || event.ctrlKey) && (event.key === 'j' || event.key === 'J')) {
          event.preventDefault();
          this.setState({ aiOpen: !this.state.aiOpen });
          if (!this.state.aiOpen) this._focus = { sel: '[data-ai7]' };
        } else if (event.key === 'Escape' && this.state.aiOpen) {
          this.setState({ aiOpen: false });
        }
      };
      window.addEventListener('keydown', this._aiKey);
    }
    const view = state.view;
    const data = state.data;
    // JSON for the prompt: long history arrays are trimmed to 8 entries, the whole string to 4000 chars.
    const toPromptJson = value => JSON.stringify(value, (key, field) =>
      (key === 'log' || key === 'comments' || key === 'blocks') && Array.isArray(field) ? field.slice(0, 8) : field,
    ).slice(0, 4000);

    // The item open on the current page, as [label, JSON context, item-specific prompts].
    let focusItem = null;
    const openGoal = data.goals.find(goal => goal.id === state.gopen);
    const openDecision = data.decisions.find(decision => decision.id === state.dopen);
    const openRole = (data.roles || []).find(role => role.id === state.peek);
    const openResearch = (data.research || []).find(research => research.id === state.sel);
    // The lead whose drawer is open in Sales → Pipeline (portal store).
    const openLeadId = view === 'pipeline' ? useStore.getState().selLead : null;
    const openLead = openLeadId ? this.leadsAll().find(lead => lead.id === openLeadId) : null;
    const openContract = (data.contracts || []).find(contract => contract.id === state.ctOpen);
    const openCompany = (data.companies || []).find(company => company.id === state.cmOpen);
    if (openDecision && view === 'decisions') {
      focusItem = ['decision “' + (openDecision.title || 'Untitled') + '”', toPromptJson(openDecision), [
        'Add 3 options with pros and cons to this decision', 'Recommend what we should decide, and why',
        'What do we need to know before deciding?', 'Which constitution rules apply to this decision?',
      ]];
    } else if (openGoal && view === 'goals') {
      focusItem = ['goal “' + (openGoal.title || 'Untitled') + '”', toPromptJson(openGoal), [
        'Suggest the tasks that would hit this goal', 'Is this goal realistic? What is the biggest risk?',
        'Suggest a weekly scorecard metric to track this goal',
      ]];
    } else if (openRole && view === 'hiring') {
      focusItem = ['role “' + (openRole.title || openRole.name || 'role') + '”', toPromptJson(openRole), [
        'Write a job description for this role as a doc', 'Give me 10 interview questions for this role',
        'Draft a LinkedIn job post for this role', 'Compare the candidates for this role',
      ]];
    } else if (openResearch && view === 'research') {
      focusItem = ['research “' + (openResearch.title || 'Untitled') + '”', toPromptJson(openResearch), [
        'Suggest sources and next steps for this research', 'Turn the findings into a clear conclusion',
        'What tasks or decisions should come out of this?',
      ]];
    } else if (openLead) {
      focusItem = ['lead “' + (openLead.name || openLead.id) + '”', toPromptJson(openLead), [
        'Draft a follow-up email for this lead', 'What is the next best step to win this lead?',
        'How risky is this lead, and why?', 'Draft a proposal outline for this customer as a doc',
      ]];
    } else if (openContract && view === 'contracts') {
      focusItem = ['contract “' + (openContract.name || 'Untitled') + '”', toPromptJson(openContract), [
        'Summarise the key risks in this contract', 'Should we renew this contract? Recommend',
        'Draft a renewal or termination email', 'What clauses should we add next time?',
      ]];
    } else if (openCompany && view === 'companies') {
      focusItem = ['company ' + openCompany.name, toPromptJson({ ...openCompany, runs: undefined }), [
        'Summarise this company\'s health in five lines', 'What should this company focus on in the next 90 days?',
        'What setup steps are still missing for this company?',
      ]];
    }
    const prompts = focusItem
      ? focusItem[2].concat((PAGE_PROMPTS[view] || []).slice(0, 2))
      : (PAGE_PROMPTS[view] || PAGE_PROMPTS.home).concat(
        EXTRA_PROMPTS[view] || [],
        view === 'home' ? ['Turn these meeting notes into tasks: '] : ['What are my top 3 priorities today?'],
      );
    const hidden = focusItem ? focusItem[1] : '';

    // Title and meta line for a suggested action card.
    const actionTitle = action => {
      if (action.type === 'subtasks') {
        const items = action.items || [];
        return items.length + ' subtasks: ' + items.slice(0, 3).join(' · ') + (items.length > 3 ? '…' : '');
      }
      if (action.type === 'update_task') return 'Update “' + ((this.tasksAll().find(task => task.id === action.taskId) || {}).title || 'task') + '”';
      if (action.type === 'note' || action.type === 'option') return action.text || '';
      if (action.type === 'copy') return action.label || 'Draft';
      return action.title || action.name || action.label || PAGE_NAMES[action.view] || 'Open page';
    };
    const actionMeta = (action, defaultMeta) => {
      if (action.type === 'update_task') {
        return [action.due && 'due ' + action.due, action.owner && (PEOPLE[action.owner] || {}).first, action.pri, action.status].filter(Boolean).join(' · ');
      }
      if (action.type === 'copy' || action.type === 'doc') return String(action.text || action.body || '').slice(0, 110) + '…';
      if (action.type === 'option') return action.notes || '';
      return defaultMeta;
    };

    // Last 40 messages, newest first.
    const msgs = chat.slice(-40).map(message => {
      const mine = message.role === 'user';
      const visibleActs = (message.acts || []).filter(action => action.state !== 'skipped');
      const pendingActs = visibleActs.filter(action => action.state === 'pending' && action.type !== 'goto');
      return {
        align: mine ? 'flex-end' : 'flex-start',
        bg: mine ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.965 0.004 85)',
        fg: mine ? '#fff' : 'oklch(0.25 0.015 265)',
        text: message.text,
        hasActs: !!visibleActs.length,
        multi: pendingActs.length > 1,
        nPending: String(pendingActs.length),
        runAll: () => pendingActs.forEach(action => this.aiRun(message.id, action.id)),
        acts: visibleActs.map(action => {
          const tag = ACTION_TAGS[action.type] || ACTION_TAGS.task;
          const company = action.co ? coOf(action.co) : null;
          const meta = [
            company && company.name,
            action.owner && (PEOPLE[action.owner] || {}).first,
            action.due && 'due ' + action.due,
            action.value && this.money(Number(action.value)),
            action.acct,
          ].filter(Boolean).join(' · ');
          return {
            tag: tag[0],
            tBg: tag[1],
            tFg: tag[2],
            btn: tag[3],
            title: actionTitle(action),
            meta: actionMeta(action, meta),
            hasMeta: !!(meta || ['update_task', 'copy', 'doc', 'option'].includes(action.type)),
            // Copy actions stay clickable until skipped.
            pending: action.state === 'pending' || (action.type === 'copy' && action.state !== 'skipped'),
            isDone: action.state === 'done' && action.type !== 'copy',
            doneTxt: action.type === 'goto' ? 'Opened' : action.type === 'doc' ? '✓ Page created' : '✓ Added',
            doneC: 'oklch(0.45 0.12 150)',
            run: () => this.aiRun(message.id, action.id),
            skip: () => this.upd(draft => {
              const storedMessage = (draft.aiChat || []).find(item => item.id === message.id);
              const storedAction = storedMessage && (storedMessage.acts || []).find(item => item.id === action.id);
              if (storedAction) storedAction.state = 'skipped';
            }),
          };
        }),
      };
    }).reverse();

    // When a side drawer is open the floating button moves up and collapses.
    const drawerOpen = !!(state.gopen || state.dopen || state.peek || openLeadId || state.ctOpen || state.cxr || state.cmOpen || state.cxv);
    // Prompts ending in ": " are templates: put them in the input box instead of sending.
    const applyPrompt = promptText => {
      if (promptText.endsWith(': ')) {
        this.setState({ aiQ: promptText });
        this._focus = { sel: '[data-ai7]' };
      } else {
        this.aiSend(focusItem ? promptText + ' (' + focusItem[0] + ')' : promptText, hidden);
      }
    };
    const ai7 = {
      fabB: drawerOpen ? '86px' : '22px',
      fabP: drawerOpen ? '0 10px' : '0 18px 0 14px',
      fabFull: !drawerOpen,
      closed: !state.aiOpen,
      isOpen: !!state.aiOpen,
      open: () => { this.setState({ aiOpen: true }); this._focus = { sel: '[data-ai7]' }; },
      close: () => this.setState({ aiOpen: false }),
      page: PAGE_NAMES[view] || 'this page',
      me: (PEOPLE[me] || PEOPLE.both).first,
      msgs,
      hasMsgs: !!chat.length,
      empty: !chat.length && !state.aiBusy,
      busy: !!state.aiBusy,
      clear: () => { this.upd(draft => { draft.aiChat = []; }); this.setState({ aiErr: '' }); },
      sugg: prompts.map(promptText => ({ t: promptText, go: () => applyPrompt(promptText) })),
      hasItem: !!focusItem,
      itemLbl: focusItem ? focusItem[0] : '',
      quick: prompts.slice(0, 5).map(promptText => ({ t: promptText.replace(/: $/, '…'), go: () => applyPrompt(promptText) })),
      hasQuick: !!chat.length,
      // Voice input: toggles browser speech recognition and appends what was heard to the question.
      mic: () => {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) {
          this.setState({ aiErr: 'Voice input is not supported in this browser. Try Chrome.' });
          return;
        }
        if (this._rec) { this._rec.stop(); return; }
        const recognition = new Recognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.onresult = event => {
          const transcript = [...event.results].map(result => result[0].transcript).join(' ');
          this.setState({ aiQ: ((this.state.aiQ || '') + ' ' + transcript).trim() });
        };
        recognition.onend = () => { this._rec = null; this.setState({ aiMic: false }); };
        this._rec = recognition;
        recognition.start();
        this.setState({ aiMic: true, aiErr: '' });
      },
      micBg: state.aiMic ? 'oklch(0.62 0.2 25)' : '#fff',
      micFg: state.aiMic ? '#fff' : 'oklch(0.4 0.012 265)',
      micTip: state.aiMic ? 'Listening… click to stop' : 'Speak instead of typing',
      send2: () => this.aiSend(undefined, hidden),
      q: state.aiQ || '',
      onQ: event => this.setState({ aiQ: event.target.value }),
      onKey: event => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          this.aiSend(undefined, hidden);
        }
      },
      send: () => this.aiSend(undefined, hidden),
      sendOp: (state.aiQ || '').trim() && !state.aiBusy ? '1' : '0.45',
      err: state.aiErr || '',
      hasErr: !!state.aiErr,
    };
    return { ai7 };
  }
}
