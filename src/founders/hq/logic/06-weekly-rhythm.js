/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import React from 'react';
import HQConstitution from './05-constitution';
import { setTeamTaskDue } from '../teamTasks/hqTeamTasks';
import { PEOPLE, COS, coOf, segOf, iso, plus, dayDiff, uid, INK_C, RED, AMBER, GREEN, MUTED, act, goalCalc, SC_SUGG, SY_STEPS, SyncClock } from './core';

const DAY_MS = 864e5;

export default class HQWeeklyRhythm extends HQConstitution {
  /**
   * View model for the weekly-rhythm pages: the Scorecard (`sc`) and the founders' sync meeting (`sy`).
   * Side effect: caches the number of off-goal metrics this week in `this._scOff` (read by the sales view model).
   */
  weeklyRhythmViewModel() {
    const state = this.state;
    const { me, data } = state;
    const setUi = patch => this.setState(patch);
    const person = id => PEOPLE[id] || PEOPLE.both;
    const founders = ['rahul', 'saswat'];
    const now = new Date();
    const todayStart = new Date(iso(now) + 'T00:00:00').getTime();
    const dayStart = isoDate => isoDate ? new Date(isoDate + 'T00:00:00').getTime() : 0;

    // Monday 00:00 of the week `offset` weeks away from the current one.
    const mondayOf = offset => {
      const monday = new Date(now);
      monday.setHours(0, 0, 0, 0);
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + offset * 7);
      return monday;
    };
    // The last 13 weeks, oldest first. `a`/`b` are the week's start/end timestamps.
    const weeks = Array.from({ length: 13 }, (_, weekIndex) => {
      const monday = mondayOf(weekIndex - 12);
      return {
        key: iso(monday),
        a: monday.getTime(),
        b: monday.getTime() + 7 * DAY_MS,
        lbl: monday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        cur: weekIndex === 12,
      };
    });
    const currentWeek = weeks[12];
    const selectProps = (value, onChange, list) => ({
      value,
      onChange,
      opts: list.map(([optionValue, label]) => ({ v: optionValue, l: label })),
    });
    const companyChip = companyId => {
      const company = coOf(companyId);
      return {
        co: company.name || 'Founders',
        cBg: company.tint || 'oklch(0.95 0.005 265)',
        cFg: company.ink || 'oklch(0.42 0.012 265)',
      };
    };

    // ---------- scorecard
    const score = data.score || { metrics: [], values: {} };
    const updateScore = fn => this.upd(draft => {
      if (!draft.score) draft.score = { metrics: [], values: {} };
      if (!draft.score.values) draft.score.values = {};
      fn(draft.score, draft);
    });

    // Team tasks are HQ's tasks: every one the founder can see.
    const teamTasks = this.tasksAll();
    /** Value of an automatic metric for one week, computed from team tasks or decisions. */
    const autoValue = (source, companyId, week) => {
      if (source === 'tasks_done') {
        return teamTasks.filter(task => task.co === companyId && task.doneAt
          && task.doneAt >= week.a && task.doneAt < week.b).length;
      }
      if (source === 'tasks_slipped') {
        // Due this week and already past due, but not done by the day after the due date.
        return teamTasks.filter(task => task.co === companyId && task.due
          && dayStart(task.due) >= week.a && dayStart(task.due) < week.b && dayStart(task.due) < todayStart
          && (!task.done || (task.doneAt || 0) > dayStart(task.due) + DAY_MS)).length;
      }
      if (source === 'decisions') {
        return data.decisions.filter(decision => decision.co === companyId && decision.decidedAt
          && decision.decidedAt >= week.a && decision.decidedAt < week.b).length;
      }
      return null;
    };
    const isAuto = metric => metric.src && metric.src !== 'manual';
    const valueOf = (metric, week) => isAuto(metric)
      ? autoValue(metric.src, metric.co, week)
      : ((((score.values || {})[metric.id] || {})[week.key]) ?? null);
    const hasGoal = metric => metric.goal !== null && metric.goal !== undefined && metric.goal !== '';
    /** true = on goal, false = off goal, null = nothing to judge (no value or no goal). */
    const onGoal = (metric, value) => value === null || value === undefined || !hasGoal(metric)
      ? null
      : metric.dir === 'down' ? value <= Number(metric.goal) : value >= Number(metric.goal);
    const formatValue = (metric, value) => value === null || value === undefined
      ? '—'
      : metric.unit === '₹' ? this.money(value) : metric.unit === '%' ? value + '%' : String(value);
    const goalText = metric => (metric.dir === 'down' ? '≤ ' : '≥ ') + formatValue(metric, Number(metric.goal));

    /** Sparkline bars (height + colour) for a metric across the 13 weeks. */
    const barsOf = metric => {
      const values = weeks.map(week => valueOf(metric, week));
      const maxValue = Math.max(1, ...values.filter(value => value !== null).map(value => Math.abs(value)));
      return values.map(value => {
        const ok = onGoal(metric, value);
        return {
          h: value === null ? '2px' : Math.max(10, Math.round(Math.abs(value) / maxValue * 100)) + '%',
          c: value === null ? 'oklch(0.92 0.005 85)'
            : ok === false ? 'oklch(0.68 0.15 25)'
              : ok ? 'oklch(0.62 0.13 150)' : 'oklch(0.72 0.03 265)',
        };
      });
    };
    const metricsOf = companyId => (score.metrics || []).filter(metric => metric.co === companyId);

    const offTrack = [];
    COS.forEach(company => metricsOf(company.id).forEach(metric => {
      const value = valueOf(metric, currentWeek);
      if (onGoal(metric, value) === false) offTrack.push({ m: metric, c: company, v: value });
    }));
    this._scOff = offTrack.length;
    const missing = COS.reduce((count, company) => count + metricsOf(company.id)
      .filter(metric => !isAuto(metric) && valueOf(metric, currentWeek) === null).length, 0);
    const selectedCo = state.scCo && (state.scCo === 'all' || COS.some(company => company.id === state.scCo)) ? state.scCo : 'all';
    const editing = !!state.scEdit;
    // Build a metric from a [name, unit, direction, source] tuple (the shape of SC_SUGG entries).
    const newMetric = (companyId, spec) => ({
      id: uid(),
      co: companyId,
      name: spec[0],
      unit: spec[1],
      dir: spec[2],
      src: spec[3],
      goal: spec[3] === 'tasks_slipped' ? 0 : '',
      owner: me,
    });

    const sc = {
      isAll: selectedCo === 'all',
      isSingle: selectedCo !== 'all',
      sub: COS.length + (COS.length === 1 ? ' company' : ' companies')
        + ' · ' + offTrack.length + ' off goal this week'
        + (missing ? ' · ' + missing + ' numbers not entered yet' : ''),
      coTabs: [['all', 'All companies'], ...COS.map(company => [company.id, company.name])].map(([tabId, label]) => {
        const company = coOf(tabId);
        const active = selectedCo === tabId;
        const offCount = tabId === 'all' ? 0
          : metricsOf(tabId).filter(metric => onGoal(metric, valueOf(metric, currentWeek)) === false).length;
        return {
          label,
          hasTile: tabId !== 'all',
          tile: company.bg || '',
          ini: company.ini || '',
          fg: active ? INK_C : MUTED,
          bd: active ? INK_C : 'transparent',
          hasN: !!offCount,
          n: offCount + ' off',
          go: () => setUi({ scCo: tabId }),
        };
      }),
      cards: COS.map(company => {
        const metrics = metricsOf(company.id);
        const onCount = metrics.filter(metric => onGoal(metric, valueOf(metric, currentWeek)) === true).length;
        const offCount = metrics.filter(metric => onGoal(metric, valueOf(metric, currentWeek)) === false).length;
        return {
          name: company.name,
          ini: company.ini,
          bg: company.bg,
          go: () => setUi({ scCo: company.id }),
          empty: !metrics.length,
          track: !metrics.length ? 'Not set up' : offCount ? offCount + ' off goal' : onCount + ' of ' + metrics.length + ' on goal',
          tBg: !metrics.length ? 'oklch(0.95 0.005 265)' : offCount ? 'oklch(0.95 0.035 25)' : 'oklch(0.95 0.05 150)',
          tFg: !metrics.length ? MUTED : offCount ? 'oklch(0.48 0.17 25)' : 'oklch(0.4 0.11 150)',
          rows: metrics.slice(0, 6).map(metric => {
            const value = valueOf(metric, currentWeek);
            const ok = onGoal(metric, value);
            return {
              name: metric.name,
              v: formatValue(metric, value),
              col: ok === false ? RED : ok ? GREEN : INK_C,
              bars: barsOf(metric),
            };
          }),
          hasMore: metrics.length > 6,
          more: '+ ' + (metrics.length - 6) + ' more',
        };
      }),
      editSeg: segOf([[false, 'Enter numbers'], [true, 'Edit metrics']], editing, value => setUi({ scEdit: value })),
      isEdit: editing,
      notEdit: !editing,
      copy: () => {
        const companies = selectedCo === 'all' ? COS : [coOf(selectedCo)];
        const metricLine = metric => {
          const value = valueOf(metric, currentWeek);
          const ok = onGoal(metric, value);
          return '- ' + metric.name + ': ' + formatValue(metric, value)
            + (hasGoal(metric) ? ' (goal ' + goalText(metric) + ')' : '')
            + (ok === false ? ' OFF' : ok ? ' ON' : '');
        };
        const text = 'Scorecard · week of ' + currentWeek.lbl + '\n'
          + companies.map(company => '\n' + company.name + '\n' + metricsOf(company.id).map(metricLine).join('\n')).join('\n');
        if (navigator.clipboard) navigator.clipboard.writeText(text);
        this.toastMsg('Scorecard copied');
      },
    };

    if (selectedCo !== 'all') {
      const company = coOf(selectedCo);
      const metrics = metricsOf(selectedCo);
      const updateMetric = (id, fn) => updateScore(scoreDraft => {
        const metric = scoreDraft.metrics.find(item => item.id === id);
        if (metric) fn(metric, scoreDraft);
      });
      const addNew = () => {
        const name = (state.scNew || '').trim();
        if (!name) return;
        updateScore(scoreDraft => { scoreDraft.metrics.push(newMetric(selectedCo, [name, '#', 'up', 'manual'])); });
        setUi({ scNew: '' });
      };
      Object.assign(sc, {
        coName: company.name,
        noMetrics: !metrics.length,
        hasMetrics: !!metrics.length,
        weeks: weeks.map(week => ({
          lbl: week.cur ? 'This wk' : week.lbl,
          bg: week.cur ? 'color-mix(in oklch, var(--acc) 9%, oklch(0.975 0.004 85))' : 'transparent',
          fw: week.cur ? '700' : '600',
        })),
        rows: metrics.map(metric => {
          const auto = isAuto(metric);
          const values = weeks.map(week => valueOf(metric, week));
          const hit = values.filter(value => onGoal(metric, value) === true).length;
          const scored = values.filter(value => onGoal(metric, value) !== null).length;
          return {
            name: metric.name,
            sub: person(metric.owner).first + ' · ' + (auto ? 'Automatic' : 'Entered weekly'),
            goal: hasGoal(metric) ? goalText(metric) : 'No goal',
            goalV: hasGoal(metric) ? String(metric.goal) : '',
            onName: event => updateMetric(metric.id, item => { item.name = event.target.value; }),
            onGoal: event => updateMetric(metric.id, item => { item.goal = event.target.value === '' ? '' : Number(event.target.value); }),
            unit: selectProps(metric.unit, event => updateMetric(metric.id, item => { item.unit = event.target.value; }),
              [['#', 'Number'], ['₹', '₹ Amount'], ['%', 'Percent']]),
            dir: selectProps(metric.dir, event => updateMetric(metric.id, item => { item.dir = event.target.value; }),
              [['up', 'Higher is better'], ['down', 'Lower is better']]),
            src: selectProps(metric.src || 'manual', event => updateMetric(metric.id, item => { item.src = event.target.value; }),
              [['manual', 'Enter weekly'], ['tasks_done', 'Auto: tasks done'], ['tasks_slipped', 'Auto: tasks slipped'], ['decisions', 'Auto: decisions made']]),
            owner: selectProps(metric.owner || me, event => updateMetric(metric.id, item => { item.owner = event.target.value; }),
              [['rahul', PEOPLE.rahul.first], ['saswat', PEOPLE.saswat.first], ['both', 'Both']]),
            // Move up: swap with the closest earlier metric of the same company.
            up: () => updateScore(scoreDraft => {
              const position = scoreDraft.metrics.findIndex(item => item.id === metric.id);
              const previous = scoreDraft.metrics.slice(0, position)
                .map((item, itemIndex) => [item, itemIndex])
                .filter(([item]) => item.co === metric.co)
                .pop();
              if (previous) {
                const previousIndex = previous[1];
                [scoreDraft.metrics[previousIndex], scoreDraft.metrics[position]] = [scoreDraft.metrics[position], scoreDraft.metrics[previousIndex]];
              }
            }),
            remove: () => {
              if (!confirm('Remove “' + metric.name + '” and its numbers?')) return;
              updateScore(scoreDraft => {
                scoreDraft.metrics = scoreDraft.metrics.filter(item => item.id !== metric.id);
                delete scoreDraft.values[metric.id];
              });
            },
            cells: weeks.map((week, weekIndex) => {
              const value = values[weekIndex];
              const ok = onGoal(metric, value);
              return {
                auto,
                manual: !auto,
                v: value === null ? '' : String(value),
                txt: value === null ? '—' : String(value),
                bg: ok === false ? 'oklch(0.96 0.035 25)'
                  : ok ? 'oklch(0.96 0.045 150)'
                    : week.cur ? 'color-mix(in oklch, var(--acc) 5%, #fff)' : '#fff',
                fg: ok === false ? 'oklch(0.48 0.17 25)' : ok ? 'oklch(0.4 0.11 150)' : INK_C,
                on: event => {
                  const raw = event.target.value;
                  updateScore(scoreDraft => {
                    scoreDraft.values[metric.id] = { ...(scoreDraft.values[metric.id] || {}) };
                    if (raw === '') delete scoreDraft.values[metric.id][week.key];
                    else scoreDraft.values[metric.id][week.key] = Number(raw);
                  });
                },
              };
            }),
            bars: barsOf(metric),
            hitTxt: scored ? hit + ' of ' + scored + ' weeks on goal' : 'Set a goal',
          };
        }),
        sugg: SC_SUGG.filter(spec => !metrics.some(metric => metric.name === spec[0])).map(spec => ({
          label: '+ ' + spec[0] + (spec[3] !== 'manual' ? ' · auto' : ''),
          go: () => updateScore(scoreDraft => { scoreDraft.metrics.push(newMetric(selectedCo, spec)); }),
        })),
        // Starter set: picks suggestions 0, 1, 2, 4 and 5.
        addSuggested: () => updateScore(scoreDraft => {
          [0, 1, 2, 4, 5].forEach(suggestionIndex => scoreDraft.metrics.push(newMetric(selectedCo, SC_SUGG[suggestionIndex])));
        }),
        newName: state.scNew || '',
        onNew: event => setUi({ scNew: event.target.value }),
        onNewKey: event => { if (event.key === 'Enter') addNew(); },
        addNew,
      });
    }

    // ---------- founders' sync
    const live = data.syncLive || null;
    const syncs = data.syncs || [];
    const updateLive = fn => this.upd(draft => { if (draft.syncLive) fn(draft.syncLive, draft); });
    const constitution = data.constitution || {};
    const constitutionRules = constitution.rules || [];
    const pendingAmendments = (constitution.amendments || []).filter(amendment => amendment.status === 'Pending');
    // Pending rules and amendments that still need this founder's signature or approval.
    const constitutionWaitingFor = founder =>
      constitutionRules.filter(rule => rule.status === 'Pending' && !(rule.sign || []).includes(founder)).length
      + pendingAmendments.filter(amendment => !(amendment.appr || []).includes(founder)).length;
    // Overdue team tasks assigned to or given by me.
    const overdue = teamTasks
      .filter(task => task.mine && !task.done && task.due && dayStart(task.due) < todayStart)
      .sort((first, second) => (first.due < second.due ? -1 : 1));
    const badGoals = data.goals.filter(goal => ['At risk', 'Behind', 'Overdue'].includes(goalCalc(goal, teamTasks).status));
    const openDecs = data.decisions.filter(decision => decision.status === 'Proposed');
    const carry = syncs[0] ? (syncs[0].issues || []).filter(issue => issue.status !== 'solved') : [];
    const sy = { idle: !live, live: !!live };
    const goTo = (view, options) => () => this.go(view, options);

    if (!live) {
      Object.assign(sy, {
        start: () => {
          this.upd(draft => {
            draft.syncLive = {
              id: uid(),
              started: Date.now(),
              stepAt: Date.now(),
              step: 0,
              wins: {},
              issues: carry.map(issue => ({ ...issue, id: uid(), from: 'Carried over' })),
              ratings: {},
              notes: '',
              tasks: [],
              decs: [],
              by: me,
            };
          });
          window.scrollTo(0, 0);
        },
        prep: [
          ['Off-goal metrics', offTrack.length, offTrack.length ? RED : INK_C, goTo('scorecard', { scCo: 'all' })],
          ['Goals at risk', badGoals.length, badGoals.length ? AMBER : INK_C, goTo('goals')],
          ['Overdue tasks', overdue.length, overdue.length ? RED : INK_C, goTo('tasks', {})],
          ['Open decisions', openDecs.length, INK_C, goTo('decisions')],
          ['Issues carried over', carry.length, INK_C, () => {}],
        ].map(([label, count, color, onClick]) => ({ l: label, v: String(count), c: color, go: onClick })),
        agenda: SY_STEPS.map(([name, minutes, desc], stepIndex) => ({ n: String(stepIndex + 1), name, desc, min: minutes + ' min' })),
        past: syncs.slice(0, 12).map(sync => {
          const open = state.syOpen === sync.id;
          const ratings = founders.map(founder => (sync.ratings || {})[founder]).filter(Boolean);
          const avg = ratings.length ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) : null;
          const minutes = Math.round(((sync.ended || sync.started) - sync.started) / 60000);
          const solved = (sync.issues || []).filter(issue => issue.status === 'solved').length;
          return {
            date: new Date(sync.started).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
            meta: minutes + ' min · ' + solved + ' of ' + (sync.issues || []).length + ' issues solved · '
              + (sync.tasks || []).length + ' tasks created',
            rating: avg ? avg.toFixed(1) + ' / 10' : '—',
            rc: avg === null ? MUTED : avg >= 8 ? GREEN : avg >= 6 ? AMBER : RED,
            open,
            caret: open ? '▼' : '▶',
            toggle: () => setUi({ syOpen: open ? null : sync.id }),
            wins: founders
              .filter(founder => ((sync.wins || {})[founder] || '').trim())
              .map(founder => ({ who: person(founder).first, text: sync.wins[founder] })),
            issues: (sync.issues || []).map(issue => ({
              text: issue.text,
              mark: issue.status === 'solved' ? '✓' : '○',
              c: issue.status === 'solved' ? GREEN : MUTED,
            })),
            notes: sync.notes || '',
            hasNotes: !!(sync.notes || '').trim(),
          };
        }),
        pastN: syncs.length ? syncs.length + (syncs.length === 1 ? ' meeting' : ' meetings') : '',
        noPast: !syncs.length,
      });
    } else {
      const step = Math.min(Math.max(live.step || 0, 0), 6);
      const issues = live.issues || [];
      const issueTexts = new Set(issues.map(issue => issue.text));
      const toStep = stepIndex => updateLive(liveDraft => { liveDraft.step = stepIndex; liveDraft.stepAt = Date.now(); });
      const addIssue = (text, companyId, from) => {
        if (issueTexts.has(text)) return;
        updateLive(liveDraft => {
          liveDraft.issues = [...(liveDraft.issues || []), { id: uid(), text, co: companyId || 'all', status: 'open', from: from || '' }];
        });
        this.toastMsg('Added to Issues');
      };
      // Spread into a list item to give it an "Add as issue" button.
      const issueButton = (text, companyId, from) => ({
        issueLbl: issueTexts.has(text) ? '✓ In issues' : 'Add as issue',
        issue: () => addIssue(text, companyId, from),
      });
      const updateIssue = (id, fn) => updateLive((liveDraft, draft) => {
        const issue = (liveDraft.issues || []).find(item => item.id === id);
        if (issue) fn(issue, liveDraft, draft);
      });
      // Solve an issue by turning it into a team task (due in a week) for one founder, or a proposed decision.
      // The other founder gets it when they have an internal portal account with the same name, else I do.
      const issueToTask = async (issue, owner) => {
        const taskId = await this.makeTeamTask({
          title: issue.text, co: issue.co, due: plus(7), pri: 'High', from: 'the founders’ sync' + (issue.from ? ' (' + issue.from + ')' : ''),
          forName: owner === me ? '' : person(owner).name,
        });
        if (!taskId) return;
        updateIssue(issue.id, (issueDraft, liveDraft) => {
          issueDraft.status = 'solved';
          issueDraft.out = 'Task for ' + person(owner).first;
          liveDraft.tasks = [...(liveDraft.tasks || []), taskId];
        });
      };
      const issueToDecision = issue => {
        const decisionId = uid();
        updateIssue(issue.id, (issueDraft, liveDraft, draft) => {
          draft.decisions.unshift({
            id: decisionId,
            title: issueDraft.text,
            co: issueDraft.co === 'all' ? 'all' : issueDraft.co,
            by: 'both',
            status: 'Proposed',
            impact: 'Medium',
            due: plus(7),
            context: 'Raised in founders\' sync',
            options: '',
            opts: [],
            chosen: '',
            outcome: '',
            revisit: '',
            comments: [],
            log: [{ at: Date.now(), by: me, text: 'Logged from founders\' sync' }],
            created: Date.now(),
            decidedAt: null,
          });
          issueDraft.status = 'solved';
          issueDraft.out = 'Decision logged';
          liveDraft.decs = [...(liveDraft.decs || []), decisionId];
        });
        this.toastMsg('Decision logged');
      };
      const newIssueCo = state.syCo || 'all';
      const postIssue = () => {
        const text = (state.syIssue || '').trim();
        if (!text) return;
        addIssue(text, newIssueCo, '');
        setUi({ syIssue: '' });
      };
      const newTasks = teamTasks.filter(task => (live.tasks || []).includes(task.id));

      Object.assign(sy, {
        date: new Date(live.started).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
        clock: React.createElement(SyncClock, { start: live.started }),
        stepClock: React.createElement(SyncClock, { key: 'st' + live.stepAt, start: live.stepAt || live.started, target: SY_STEPS[step][1] }),
        stepMin: String(SY_STEPS[step][1]),
        steps: SY_STEPS.map(([name, minutes], stepIndex) => ({
          name,
          min: String(minutes),
          mark: stepIndex < step ? '✓' : String(stepIndex + 1) + ' ·',
          bg: stepIndex === step ? '#fff' : stepIndex < step ? 'oklch(1 0 0 / 0.12)' : 'oklch(1 0 0 / 0.05)',
          fg: stepIndex === step ? INK_C : '#fff',
          go: () => toStep(stepIndex),
        })),
        stepN: String(step + 1),
        stepName: SY_STEPS[step][0],
        stepDesc: SY_STEPS[step][2],
        s1: step === 0, s2: step === 1, s3: step === 2, s4: step === 3, s5: step === 4, s6: step === 5, s7: step === 6,
        hasPrev: step > 0,
        prevName: step > 0 ? SY_STEPS[step - 1][0] : '',
        prev: () => toStep(step - 1),
        hasNext: step < 6,
        nextName: step < 6 ? 'Next: ' + SY_STEPS[step + 1][0] : '',
        next: () => { toStep(step + 1); window.scrollTo(0, 0); },
        cancel: () => {
          if (!confirm('Discard this sync? Tasks and decisions already created stay.')) return;
          this.upd(draft => { draft.syncLive = null; });
        },
        wins: founders.map(founder => ({
          ini: person(founder).ini,
          bg: person(founder).bg,
          name: person(founder).first,
          v: (live.wins || {})[founder] || '',
          on: event => updateLive(liveDraft => { liveDraft.wins = { ...(liveDraft.wins || {}), [founder]: event.target.value }; }),
        })),
        offTrack: offTrack.map(({ m: metric, c: company, v: value }) => ({
          ini: company.ini,
          bg: company.bg,
          name: metric.name,
          v: formatValue(metric, value),
          goal: goalText(metric),
          ...issueButton(company.name + ': ' + metric.name + ' is off goal (' + formatValue(metric, value) + ')', company.id, 'Scorecard'),
        })),
        noOff: !offTrack.length,
        offEmpty: (score.metrics || []).length ? 'Every metric is on goal this week.' : 'No scorecard metrics yet. Set them up in Scorecard.',
        goScore: goTo('scorecard', { scCo: 'all' }),
        goals: badGoals.map(goal => {
          const progress = goalCalc(goal, teamTasks);
          return {
            ...companyChip(goal.co),
            title: goal.title || 'Untitled goal',
            status: progress.status,
            sc: progress.status === 'Overdue' ? RED : AMBER,
            ...issueButton('Goal ' + (progress.status || '').toLowerCase() + ': ' + (goal.title || 'Untitled goal'), goal.co, 'Goals'),
          };
        }),
        noGoals: !badGoals.length,
        tasks: overdue.slice(0, 30).map(task => ({
          ...companyChip(task.co),
          title: task.title || 'Untitled task',
          owner: task.team.toMe ? person(me).first : task.team.otherFirst,
          late: (-dayDiff(task.due)) + 'd late',
          done: () => this.toggleTask(task),
          push: () => setTeamTaskDue(this, task, plus(7)).then(ok => ok && this.toastMsg('Moved to next week')),
          ...issueButton('Overdue: ' + (task.title || 'Untitled task'), task.co, 'Tasks'),
        })),
        noTasks: !overdue.length,
        decs: openDecs.map(decision => ({
          ...companyChip(decision.co),
          title: decision.title || 'Untitled decision',
          age: 'raised ' + Math.max(0, Math.round((Date.now() - (decision.created || Date.now())) / DAY_MS)) + 'd ago',
          open: () => this.go('decisions', { dopen: decision.id }),
          ...issueButton('Decide: ' + (decision.title || 'Untitled decision'), decision.co, 'Decisions'),
        })),
        noDecs: !openDecs.length,
        consTxt: founders.map(founder => person(founder).first + ': ' + constitutionWaitingFor(founder) + ' waiting').join(' · '),
        goCons: goTo('constitution', { cnTab: 'overview' }),
        newIssue: state.syIssue || '',
        onNewIssue: event => setUi({ syIssue: event.target.value }),
        onIssueKey: event => { if (event.key === 'Enter') postIssue(); },
        addIssue: postIssue,
        issueCo: selectProps(newIssueCo, event => setUi({ syCo: event.target.value }), [['all', 'Founders'], ...COS.map(company => [company.id, company.name])]),
        // Open issues first, solved ones last.
        issues: issues.slice()
          .sort((first, second) => (first.status === 'solved') - (second.status === 'solved'))
          .map(issue => {
            const solved = issue.status === 'solved';
            return {
              ...companyChip(issue.co),
              text: issue.text,
              hasFrom: !!issue.from,
              from: issue.from,
              mark: solved ? '✓' : '',
              cbg: solved ? 'oklch(0.55 0.14 150)' : '#fff',
              cbd: solved ? 'oklch(0.55 0.14 150)' : 'oklch(0.72 0.01 265)',
              deco: solved && !issue.out ? 'line-through' : 'none',
              col: solved ? MUTED : INK_C,
              hasOut: !!issue.out,
              out: '✓ ' + (issue.out || ''),
              canAct: !solved,
              toggle: () => updateIssue(issue.id, issueDraft => {
                issueDraft.status = solved ? 'open' : 'solved';
                if (solved) issueDraft.out = '';
              }),
              taskR: () => issueToTask(issue, 'rahul'),
              taskS: () => issueToTask(issue, 'saswat'),
              dec: () => issueToDecision(issue),
              remove: () => updateLive(liveDraft => { liveDraft.issues = liveDraft.issues.filter(item => item.id !== issue.id); }),
            };
          }),
        noIssues: !issues.length,
        sum: [
          ['Minutes so far', Math.round((Date.now() - live.started) / 60000)],
          ['Issues solved', issues.filter(issue => issue.status === 'solved').length + ' / ' + issues.length],
          ['Tasks created', (live.tasks || []).length],
          ['Decisions logged', (live.decs || []).length],
        ].map(([label, value]) => ({ l: label, v: String(value) })),
        newTasks: newTasks.map(task => ({
          title: task.title,
          meta: (task.assignee || 'Unassigned') + (task.due ? ' · due '
            + new Date(task.due + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''),
        })),
        rates: founders.map(founder => ({
          name: person(founder).first,
          opts: Array.from({ length: 10 }, (_, ratingIndex) => {
            const rating = ratingIndex + 1;
            const selected = (live.ratings || {})[founder] === rating;
            return {
              n: String(rating),
              bg: selected ? INK_C : '#fff',
              fg: selected ? '#fff' : INK_C,
              bd: selected ? INK_C : 'oklch(0.88 0.008 85)',
              go: () => updateLive(liveDraft => { liveDraft.ratings = { ...(liveDraft.ratings || {}), [founder]: rating }; }),
            };
          }),
        })),
        notes: live.notes || '',
        onNotes: event => updateLive(liveDraft => { liveDraft.notes = event.target.value; }),
        // Archive the live sync (newest first, keep 100) and log it to the activity feed.
        end: () => {
          this.upd(draft => {
            const finished = draft.syncLive;
            if (!finished) return;
            draft.syncs = [{ ...finished, ended: Date.now() }, ...(draft.syncs || [])].slice(0, 100);
            draft.syncLive = null;
            act(draft, me, 'completed a founders\' sync', 'all');
          });
          this.toastMsg('Sync saved');
          window.scrollTo(0, 0);
        },
      });
    }
    return { sc, sy, isScore: state.view === 'scorecard', isSync: state.view === 'sync' };
  }

  /** Ask Claude to write the chief-of-staff brief for `who` from the given facts, and store it in `data.briefs`. */
  async csWrite(facts, who) {
    if (this.state.csBusy) return;
    if (!window.claude || !window.claude.complete) {
      this.setState({ csNote: 'Claude is not available in this browser. The lists below still update live.' });
      return;
    }
    this.setState({ csBusy: true, csNote: 'Writing your brief…' });
    const founder = PEOPLE[who] || PEOPLE.rahul;
    const isMonday = new Date().getDay() === 1;
    const prompt = [
      'You are the chief of staff for ' + founder.name + ' (' + founder.role + '). Together with '
        + (who === 'rahul' ? PEOPLE.saswat : PEOPLE.rahul).name + ' (' + (who === 'rahul' ? PEOPLE.saswat : PEOPLE.rahul).role + ')'
        + ' they run Mariox Software, HROO, Arth and other companies from India.',
      'Write a ' + (isMonday ? 'Monday weekly brief' : 'daily brief') + ' for ' + founder.first + ' using ONLY the facts below. Do not invent numbers or names.',
      'Format, plain text, no markdown symbols:',
      'Line 1: one sentence on the overall state of things.',
      'Then "Top 3 today:" followed by three numbered lines, each a concrete action with the company name.',
      'Then "Watch:" followed by up to three short lines on risks.',
      isMonday ? 'Then "This week:" with two lines on what would make the week a success.' : '',
      'Keep it under 160 words. Warm, direct, no filler.',
      '',
      'FACTS:',
      facts,
    ].filter(Boolean).join('\n');
    try {
      const reply = await window.claude.complete(prompt);
      this.upd(draft => {
        draft.briefs = [
          { id: uid(), at: Date.now(), by: who, monday: isMonday, text: String(reply || '').trim() },
          ...(draft.briefs || []),
        ].slice(0, 60);
      });
      this.setState({ csBusy: false, csNote: '' });
    } catch {
      this.setState({ csBusy: false, csNote: 'Could not write the brief. Try again.' });
    }
  }
}
