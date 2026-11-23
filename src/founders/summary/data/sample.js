import { addDays, atTime, startOfWeek } from '@/founders/summary/lib/dates';

/**
 * Sample summaries in exactly the shape the summary API returns (README → Summary API).
 * Dates are relative to `now`, so time-based rules ("due in the next 7 days", "late") always
 * have something to show. Money is in rupees, ratios are 0–1, timestamps are ISO strings.
 */
export function buildSample(now = new Date()) {
  const iso = (d) => d.toISOString();
  const day = (n, h = 12, m = 0) => iso(atTime(addDays(now, n), h, m));
  const minsAgo = (n) => iso(new Date(now.getTime() - n * 60000));
  const monday = startOfWeek(now);
  const weekOf = (i, total) => iso(addDays(monday, -7 * (total - 1 - i)));
  const weekly = (values) => values.map((value, i) => ({ weekOf: weekOf(i, values.length), value }));
  // Working days (Mon–Sat) of this week so far, for the attendance and hours samples.
  const workdays = Math.max(1, Math.min(6, Math.round((atTime(now, 0) - monday) / 864e5) + 1));

  const mariox = {
    company: 'mariox',
    syncedAt: minsAgo(2),
    sales: {
      won: {
        today: { value: 0, deals: 0 },
        week: { value: 540000, deals: 2, prev: 500000 },
        month: { value: 2410000, deals: 7, prev: 2210000 },
      },
      lost: { month: { value: 1160000, deals: 5 }, topReason: null },
      newDeals: { today: 1, week: 7 },
      winRateQuarter: 0.31,
      stages: [
        { key: 'new', name: 'New', count: 12, value: 3100000 },
        { key: 'contacted', name: 'Contacted', count: 10, value: 2450000 },
        { key: 'qualified', name: 'Qualified', count: 8, value: 1980000 },
        { key: 'proposal', name: 'Proposal sent', count: 7, value: 920000 },
        { key: 'negotiation', name: 'Negotiation', count: 4, value: 500000 },
      ],
      owners: [
        { id: 'ak', name: 'Aman Kapoor', hue: 265, open: 9, value: 2140000, wonMonth: 720000, overdue: 0 },
        { id: 'ps', name: 'Priya Sharma', hue: 340, open: 10, value: 2400000, wonMonth: 610000, overdue: 3 },
        { id: 'rv', name: 'Rohit Verma', hue: 155, open: 8, value: 1830000, wonMonth: 560000, overdue: 1 },
        { id: 'nj', name: 'Neha Jain', hue: 65, open: 7, value: 1460000, wonMonth: 340000, overdue: 1 },
        { id: 'sk', name: 'Sahil Khan', hue: 210, open: 7, value: 1120000, wonMonth: 180000, overdue: 2 },
      ],
      followUps: {
        dueToday: 23,
        due: {
          count: 14,
          overdue: 7,
          list: [
            { id: 'F-211', type: 'Call', title: 'Pricing follow-up', priority: 'High', leadId: 'MX-1043', company: 'Orbit Logistics', ownerId: 'ps', owner: 'Priya Sharma', hue: 340, dueAt: day(-3, 11), overdue: true },
            { id: 'F-219', type: 'Meeting', title: 'Scope walkthrough', priority: 'High', leadId: 'MX-1051', company: 'Apex Clinics', ownerId: 'sk', owner: 'Sahil Khan', hue: 210, dueAt: day(-2, 15), overdue: true },
            { id: 'F-224', type: 'Call', title: 'Check proposal feedback', priority: 'Medium', leadId: 'MX-1048', company: 'Urban Nest', ownerId: 'ps', owner: 'Priya Sharma', hue: 340, dueAt: day(-1, 12), overdue: true },
            { id: 'F-226', type: 'Task', title: 'Send case studies', priority: 'Low', leadId: 'MX-1055', company: 'Greenleaf Foods', ownerId: 'rv', owner: 'Rohit Verma', hue: 155, dueAt: day(-1, 17), overdue: true },
            { id: 'F-230', type: 'Call', title: 'Intro call', priority: 'Medium', leadId: 'MX-1060', company: 'Kaveri Foods', ownerId: 'nj', owner: 'Neha Jain', hue: 65, dueAt: day(0, 10), overdue: true },
            { id: 'F-231', type: 'Meeting', title: 'Demo of the ordering app', priority: 'High', leadId: 'MX-1061', company: 'Urban Spoon', ownerId: 'ak', owner: 'Aman Kapoor', hue: 265, dueAt: day(0, 16), overdue: false },
            { id: 'F-232', type: 'Reminder', title: 'Renewal reminder', priority: 'Low', leadId: 'MX-1022', company: 'Lumen Studio', ownerId: 'rv', owner: 'Rohit Verma', hue: 155, dueAt: day(0, 17, 30), overdue: false },
            { id: 'F-233', type: 'Call', title: 'Budget check', priority: 'Medium', leadId: 'MX-1064', company: 'TrackPro Industries', ownerId: 'ak', owner: 'Aman Kapoor', hue: 265, dueAt: day(0, 18), overdue: false },
          ],
        },
      },
      newLeads: {
        count: 7,
        value: 2860000,
        list: [
          { id: 'MX-1066', company: 'Nimbus Travel', source: 'Website', ownerId: 'ak', owner: 'Aman Kapoor', hue: 265, value: 650000, stage: 'New', createdAt: day(0, 10) },
          { id: 'MX-1065', company: 'Sparrow Schools', source: 'Referral', ownerId: 'ps', owner: 'Priya Sharma', hue: 340, value: 420000, stage: 'Contacted', createdAt: day(-1, 15) },
          { id: 'MX-1064', company: 'TrackPro Industries', source: 'LinkedIn', ownerId: 'ak', owner: 'Aman Kapoor', hue: 265, value: 380000, stage: 'Qualified', createdAt: day(-2, 11) },
          { id: 'MX-1063', company: 'Bloom Interiors', source: 'Website', ownerId: 'nj', owner: 'Neha Jain', hue: 65, value: 260000, stage: 'New', createdAt: day(-3, 12) },
          { id: 'MX-1062', company: 'Pulse Fitness', source: 'Event', ownerId: 'sk', owner: 'Sahil Khan', hue: 210, value: 450000, stage: 'Contacted', createdAt: day(-4, 16) },
          { id: 'MX-1061', company: 'Urban Spoon', source: 'Referral', ownerId: 'ak', owner: 'Aman Kapoor', hue: 265, value: 520000, stage: 'Proposal sent', createdAt: day(-5, 9) },
          { id: 'MX-1060', company: 'Kaveri Foods', source: 'Not set', ownerId: 'nj', owner: 'Neha Jain', hue: 65, value: 180000, stage: 'New', createdAt: day(-6, 14) },
        ],
      },
      sourcesMonth: [
        { source: 'Website', count: 11 },
        { source: 'Referral', count: 8 },
        { source: 'LinkedIn', count: 5 },
        { source: 'Event', count: 3 },
        { source: 'Not set', count: 2 },
      ],
    },
    // The internal portal doesn't record client payments yet, so the real API sends null here.
    cash: null,
    changeRequests: {
      waitingOnClient: 4,
      value: 680000,
      list: [
        { id: 'CR-104-2', projectId: 'PR-104', projectName: 'FreshKart app', title: 'Loyalty points', amount: 240000, sentAt: day(-12, 11) },
        { id: 'CR-102-1', projectId: 'PR-102', projectName: 'Orbit CRM', title: 'Driver app tracking', amount: 210000, sentAt: day(-6, 15) },
        { id: 'CR-107-1', projectId: 'PR-107', projectName: 'Medisure portal', title: 'Video consultations', amount: 160000, sentAt: day(-3, 10) },
        { id: 'CR-103-2', projectId: 'PR-103', projectName: 'Lumen marketing site', title: 'Blog section', amount: 70000, sentAt: day(-1, 17) },
      ],
    },
    bugs: {
      open: 14,
      bySeverity: { Critical: 2, Major: 5, Minor: 6, Trivial: 1 },
      critical: [
        { id: 'BG-311', projectId: 'PR-101', projectName: 'FinEdge wallet app', title: 'Wallet balance not updated after refund', openedAt: day(-3, 11) },
        { id: 'BG-318', projectId: 'PR-101', projectName: 'FinEdge wallet app', title: 'Crash on login with OTP', openedAt: day(-1, 16) },
      ],
    },
    projects: {
      running: 12,
      list: [
        { id: 'PR-104', name: 'FreshKart app', client: 'FreshKart', pm: 'Vikas Gupta', milestone: { n: 3, name: 'Payment gateway', due: day(-6) }, hoursUsed: 0.96 },
        { id: 'PR-107', name: 'Medisure portal', client: 'Medisure Health', pm: 'Vikas Gupta', milestone: { n: 3, name: 'Doctor app', due: day(11) }, hoursUsed: 1.18 },
        { id: 'PR-102', name: 'Orbit CRM', client: 'Orbit Logistics', pm: 'Karan Mehta', milestone: { n: 2, name: 'Admin dashboard', due: day(23) }, hoursUsed: 0.81, approvalAskedAt: day(-9) },
        { id: 'PR-101', name: 'FinEdge wallet app', client: 'FinEdge Pay', pm: 'Ishita Rao', milestone: { n: 3, name: 'Wallet & cashback', due: day(9) }, hoursUsed: 0.72, note: 'Change request CR-101-1 approved' },
        { id: 'PR-103', name: 'Lumen marketing site', client: 'Lumen Studio', pm: 'Ishita Rao', milestone: { n: 4, name: 'Launch', due: day(3) }, hoursUsed: 0.64, note: 'Client review in 2 days' },
        { id: 'PR-105', name: 'TrackPro ERP', client: 'TrackPro Industries', pm: 'Karan Mehta', milestone: { n: 1, name: 'Discovery', due: day(16) }, hoursUsed: 0.22, note: 'Kick-off done' },
      ],
      onHold: [
        { id: 'PR-106', name: 'Zenvy loyalty app', client: 'Zenvy Retail', pm: 'Ishita Rao', reason: 'Payment pending', note: 'Second milestone invoice unpaid for 3 weeks', since: day(-12) },
        { id: 'PR-108', name: 'Kaveri ordering site', client: 'Kaveri Foods', pm: 'Karan Mehta', reason: 'Client end', note: 'Waiting for menu content and photos', since: day(-6) },
      ],
      milestones: {
        overdue: {
          count: 2,
          list: [
            { id: 'PR-104-M3', projectId: 'PR-104', projectName: 'FreshKart app', client: 'FreshKart', n: 3, name: 'Payment gateway', status: 'In progress', approvalPending: false, approvalAskedAt: null, due: day(-6, 0) },
            { id: 'PR-102-M2', projectId: 'PR-102', projectName: 'Orbit CRM', client: 'Orbit Logistics', n: 2, name: 'Admin dashboard', status: 'In review', approvalPending: true, approvalAskedAt: day(-9), due: day(-2, 0) },
          ],
        },
        dueSoon: {
          count: 2,
          list: [
            { id: 'PR-103-M4', projectId: 'PR-103', projectName: 'Lumen marketing site', client: 'Lumen Studio', n: 4, name: 'Launch', status: 'In progress', approvalPending: false, approvalAskedAt: null, due: day(3, 0) },
            { id: 'PR-105-M1', projectId: 'PR-105', projectName: 'TrackPro ERP', client: 'TrackPro Industries', n: 1, name: 'Discovery', status: 'Not started', approvalPending: false, approvalAskedAt: null, due: day(6, 0) },
          ],
        },
      },
    },
    reports: {
      checkedIn: 21,
      submitted: 14,
      blockers: [
        { who: 'm-tb', name: 'Tarun Bansal', text: 'Waiting for the payment gateway keys from FreshKart', day: day(0, 0), at: minsAgo(40) },
        { who: 'm-ad', name: 'Arjun Das', text: 'Need final brand colours from Medisure before the doctor app screens', day: day(0, 0), at: minsAgo(95) },
        { who: 'm-dn', name: 'Deepak Nair', text: 'Staging server for Orbit CRM is down', day: day(-1, 0), at: minsAgo(60 * 20) },
      ],
    },
    quotes: {
      waiting: {
        count: 6,
        value: 1840000,
        oldestSentAt: day(-11),
        list: [
          { id: 'Q-1031-1', leadId: 'MX-1031', company: 'Apex Clinics', status: 'Viewed', amount: 520000, total: 613600, sentAt: day(-11), viewedAt: day(-9) },
          { id: 'Q-1043-2', leadId: 'MX-1043', company: 'Orbit Logistics', status: 'Sent', amount: 410000, total: 483800, sentAt: day(-7), viewedAt: null },
          { id: 'Q-1048-1', leadId: 'MX-1048', company: 'Urban Nest', status: 'Viewed', amount: 330000, total: 389400, sentAt: day(-5), viewedAt: day(-4) },
          { id: 'Q-1052-1', leadId: 'MX-1052', company: 'Pulse Fitness', status: 'Sent', amount: 250000, total: 295000, sentAt: day(-3), viewedAt: null },
          { id: 'Q-1061-1', leadId: 'MX-1061', company: 'Urban Spoon', status: 'Sent', amount: 200000, total: 236000, sentAt: day(-2), viewedAt: null },
          { id: 'Q-1064-1', leadId: 'MX-1064', company: 'TrackPro Industries', status: 'Viewed', amount: 130000, total: 153400, sentAt: day(-1), viewedAt: day(0, 10) },
        ],
      },
      acceptedMonth: { count: 3, value: 1260000 },
    },
    teamTasks: {
      open: 27,
      overdue: 4,
      doneWeek: 15,
      overdueList: [
        { id: 'TT-41', title: 'Send revised estimate to Orbit Logistics', assignee: 'Karan Mehta', priority: 'High', due: day(-3, 0) },
        { id: 'TT-38', title: 'Collect GST invoice for FreshKart milestone 2', assignee: 'Priya Sharma', priority: 'High', due: day(-2, 0) },
        { id: 'TT-44', title: 'Update the case study deck with FinEdge', assignee: 'Neha Jain', priority: 'Medium', due: day(-1, 0) },
        { id: 'TT-45', title: 'Book the team offsite venue', assignee: 'Ishita Rao', priority: 'Low', due: day(-1, 0) },
      ],
    },
    team: {
      size: 24,
      in: 18,
      onBreak: 2,
      left: 1,
      notIn: 3,
      late: 2,
      hoursToday: 86,
      people: [
        { id: 'm-ir', name: 'Ishita Rao', hue: 300, team: 'PMO', checkInAt: day(0, 9, 30), activity: 'Client call · Lumen launch review' },
        { id: 'm-tb', name: 'Tarun Bansal', hue: 255, team: 'Backend', checkInAt: day(0, 9, 41), timer: { task: 'Wallet ledger API', projectId: 'PR-101', startedAt: minsAgo(72) } },
        { id: 'm-vg', name: 'Vidya Ghosh', hue: 175, team: 'Mobile', checkInAt: day(0, 9, 55), timer: { task: 'Wallet screens, Android', projectId: 'PR-101', startedAt: minsAgo(48) } },
        { id: 'm-dn', name: 'Deepak Nair', hue: 85, team: 'QA', checkInAt: day(0, 10, 2), timer: { task: 'Wallet regression tests', projectId: 'PR-101', startedAt: minsAgo(22) } },
        { id: 'o-ps', name: 'Priya Sharma', hue: 340, team: 'Sales', checkInAt: day(0, 9, 48), activity: '6 calls · 1 meeting today' },
        { id: 'm-ad', name: 'Arjun Das', hue: 40, team: 'Design', checkInAt: day(0, 10, 41), late: true, timer: { task: 'FreshKart checkout UI', projectId: 'PR-104', startedAt: minsAgo(15) } },
        { id: 'm-si', name: 'Sneha Iyer', hue: 210, team: 'Mobile', checkInAt: day(0, 9, 35), break: { kind: 'Lunch', startedAt: minsAgo(18), plannedMin: 30 }, activity: 'Wallet screens, iOS' },
        { id: 'm-rk', name: 'Rahul Kumar', hue: 20, team: 'Web', checkInAt: day(0, 8, 0), checkOutAt: day(0, 9, 15), activity: 'Half day' },
        { id: 'm-km', name: 'Karan Mehta', hue: 120, team: 'PMO', expectedAt: day(0, 10, 0) },
      ],
      week: {
        from: iso(monday),
        workdays,
        people: [
          ['m-ir', 'Ishita Rao', 300, 'PMO', 0, 8.6],
          ['m-tb', 'Tarun Bansal', 255, 'Backend', 0, 8.2],
          ['m-vg', 'Vidya Ghosh', 175, 'Mobile', 1, 7.9],
          ['m-dn', 'Deepak Nair', 85, 'QA', 0, 7.6],
          ['o-ps', 'Priya Sharma', 340, 'Sales', 0, 7.4],
          ['m-si', 'Sneha Iyer', 210, 'Mobile', 0, 7.2],
          ['m-ad', 'Arjun Das', 40, 'Design', 2, 6.8],
          ['m-rk', 'Rahul Kumar', 20, 'Web', 0, 5.1],
          ['m-km', 'Karan Mehta', 120, 'PMO', 1, 6.2],
          ['m-pk', 'Pooja Kulkarni', 230, 'Web', 0, 7.7],
          ['m-ms', 'Manish Sethi', 60, 'Backend', 0, 7.5],
        ].map(([id, name, hue, team, late, perDay], i) => {
          const daysPresent = i === 7 ? Math.max(0, workdays - 1) : workdays;
          return { id, name, hue, team, daysPresent, lateDays: Math.min(late, daysPresent), workedMin: Math.round(daysPresent * perDay * 60), expectedMin: workdays * 8 * 60 };
        }),
      },
    },
    hoursWeek: {
      from: iso(monday),
      workdays,
      total: 31.5 * workdays,
      expected: 40 * workdays,
      projects: {
        count: 9,
        list: [
          ['PR-101', 'FinEdge wallet app', 9.5],
          ['PR-104', 'FreshKart app', 7],
          ['PR-107', 'Medisure portal', 5.5],
          ['PR-102', 'Orbit CRM', 4],
          ['PR-103', 'Lumen marketing site', 2.5],
          ['PR-105', 'TrackPro ERP', 1.5],
          ['PR-106', 'Zenvy loyalty app', 1],
          ['PR-108', 'Kaveri ordering site', 0.5],
        ].map(([id, name, perDay]) => ({ id, name, hours: perDay * workdays })),
      },
      people: [
        ['m-tb', 'Tarun Bansal', 255, 'Backend', 7.8],
        ['m-vg', 'Vidya Ghosh', 175, 'Mobile', 7.2],
        ['m-dn', 'Deepak Nair', 85, 'QA', 6.5],
        ['m-ad', 'Arjun Das', 40, 'Design', 5.5],
        ['m-si', 'Sneha Iyer', 210, 'Mobile', 4.5],
      ].map(([id, name, hue, team, perDay]) => ({ id, name, hue, team, hours: perDay * workdays, expected: 8 * workdays })),
    },
    weekly: weekly([520000, 680000, 410000, 750000, 600000, 380000, 820000, 590000, 640000, 710000, 500000, 540000]),
  };

  const partners = {
    company: 'partners',
    syncedAt: minsAgo(2),
    rate: 0.1,
    counts: { total: 143, active: 118, invited: 9, disabled: 16 },
    pipeline: {
      open: 23,
      value: 5250000,
      stages: [
        { key: 'lead', name: 'Lead', count: 8, value: 1620000 },
        { key: 'contacted', name: 'Contacted', count: 6, value: 1380000 },
        { key: 'meeting', name: 'Meeting done', count: 4, value: 1050000 },
        { key: 'proposal', name: 'Proposal sent', count: 3, value: 720000 },
        { key: 'negotiation', name: 'Negotiation', count: 2, value: 480000 },
      ],
    },
    delivery: {
      projects: 9,
      stages: [
        { name: 'Discovery', count: 2 },
        { name: 'UI/UX design', count: 2 },
        { name: 'Development', count: 3 },
        { name: 'QA & UAT', count: 1 },
        { name: 'Go-live', count: 1 },
      ],
      list: [
        { client: 'Kapoor Retail', title: 'Retail app', partner: 'Sharma Digital', stage: 'QA & UAT', nextDate: day(6), update: 'UAT starts Monday' },
        { client: 'Urban Spoon', title: 'Ordering website', partner: 'Nexa Growth', stage: 'Development', nextDate: day(14), update: 'Checkout in progress' },
        { client: 'Medisure Health', title: 'Patient portal', partner: 'BrightPath Consulting', stage: 'Development', nextDate: day(21), update: '' },
        { client: 'Greenleaf Foods', title: 'Ordering app', partner: 'Kapoor Digital', stage: 'UI/UX design', nextDate: day(9), update: 'Wireframes approved' },
        { client: 'TrackPro Industries', title: 'Dealer portal', partner: 'Qureshi Tech Advisors', stage: 'Discovery', nextDate: day(5), update: '' },
      ],
    },
    newDeals: { today: 1, week: 4 },
    won: {
      today: { value: 160000, deals: 1, note: 'Kapoor Retail' },
      week: { value: 440000, deals: 2, prev: 460000 },
      month: { value: 1450000, deals: 6, prev: 1346000 },
    },
    // toPay: client paid, partner not paid yet · clientDue: client payment due · released: paid out
    commission: {
      released: 620000,
      upcoming: 580000,
      toPay: [
        { id: 'PY-866', partner: 'Kavya Rao', code: 'MX-P-243-9', company: 'Nexa Growth', client: 'Orbit Logistics', label: 'Milestone 1', amount: 250000, commission: 25000, dueOn: day(-7) },
        { id: 'PY-889', partner: 'Rohan Kapoor', code: 'MX-P-243-27', company: 'Kapoor Digital', client: 'Greenleaf Foods', label: 'Milestone 1', amount: 430000, commission: 43000, dueOn: day(-4) },
        { id: 'PY-869', partner: 'Rohit Sharma', code: 'MX-P-243-1', company: 'Sharma Digital', client: 'Lumen Studio', label: 'Milestone 3', amount: 380000, commission: 38000, dueOn: day(-4) },
        { id: 'PY-886', partner: 'Ananya Mehta', code: 'MX-P-243-14', company: 'BrightPath Consulting', client: 'Medisure Health', label: 'Advance', amount: 510000, commission: 51000, dueOn: day(-3) },
        { id: 'PY-881', partner: 'Rohit Sharma', code: 'MX-P-243-1', company: 'Sharma Digital', client: 'Kapoor Retail', label: 'Final payment', amount: 840000, commission: 84000, dueOn: day(-2) },
        { id: 'PY-872', partner: 'Imran Qureshi', code: 'MX-P-243-21', company: 'Qureshi Tech Advisors', client: 'TrackPro Industries', label: 'Advance', amount: 450000, commission: 45000, dueOn: day(-2) },
        { id: 'PY-884', partner: 'Kavya Rao', code: 'MX-P-243-9', company: 'Nexa Growth', client: 'Urban Spoon', label: 'Milestone 2', amount: 620000, commission: 62000, dueOn: day(-1) },
      ],
      clientDue: [
        { id: 'PY-891', partner: 'Rohit Sharma', code: 'MX-P-243-1', company: 'Sharma Digital', client: 'Urban Nest', label: 'Advance', amount: 420000, commission: 42000, dueOn: day(3) },
        { id: 'PY-893', partner: 'Ananya Mehta', code: 'MX-P-243-14', company: 'BrightPath Consulting', client: 'Apex Clinics', label: 'Milestone 1', amount: 650000, commission: 65000, dueOn: day(6) },
        { id: 'PY-895', partner: 'Kavya Rao', code: 'MX-P-243-9', company: 'Nexa Growth', client: 'Urban Spoon', label: 'Final payment', amount: 380000, commission: 38000, dueOn: day(18) },
      ],
      recentReleased: [
        { id: 'PY-851', partner: 'Ananya Mehta', code: 'MX-P-243-14', company: 'BrightPath Consulting', client: 'Apex Clinics', label: 'Advance', amount: 360000, commission: 36000, releasedOn: day(-5), utr: '4417' },
        { id: 'PY-840', partner: 'Rohit Sharma', code: 'MX-P-243-1', company: 'Sharma Digital', client: 'Kapoor Retail', label: 'Milestone 2', amount: 520000, commission: 52000, releasedOn: day(-12), utr: '3982' },
      ],
    },
    requests: [
      { id: 'SC-412', kind: 'scope', title: 'Urban Nest · website and booking', detail: '3 line items', amount: 420000, partner: 'Sharma Digital', createdAt: day(-4, 10), status: 'In review' },
      { id: 'BK-34', kind: 'visit', title: 'Contract signing with Urban Nest', partner: 'Sharma Digital', createdAt: day(-5, 12), status: 'Rescheduled', scheduledAt: day(4, 14, 30), where: 'Noida office · 4 guests' },
      { id: 'TK-2026', kind: 'ticket', title: 'TK-2026 · Change my bank account', detail: 'Payout details', partner: 'Qureshi Tech Advisors', createdAt: day(-6, 15), status: 'Assigned' },
      { id: 'TK-2029', kind: 'ticket', title: 'TK-2029 · Commission not shown for Kapoor Retail', detail: 'Commission', partner: 'Nexa Growth', createdAt: day(-4, 12), status: 'Assigned', escalated: true },
      { id: 'SC-415', kind: 'scope', title: 'Greenleaf Foods · ordering app', detail: '5 line items', amount: 980000, partner: 'Kapoor Digital', createdAt: day(-3, 9), status: 'In review' },
      { id: 'SC-416', kind: 'scope', title: 'Apex Clinics · patient portal', detail: '4 line items', amount: 650000, partner: 'BrightPath Consulting', createdAt: day(-3, 11), status: 'In review' },
      { id: 'TK-2028', kind: 'ticket', title: 'TK-2028 · Need the app demo video in Hindi', detail: 'Sales kit', partner: 'Sharma Digital', createdAt: day(-3, 16), status: 'Assigned', escalated: true },
      { id: 'TR-77', kind: 'tech', title: 'Pre-sales call with a tech lead', partner: 'Nexa Growth', createdAt: day(-2, 10), status: 'Requested', scheduledAt: day(2, 16), where: 'Google Meet · 45 min' },
      { id: 'TR-78', kind: 'tech', title: 'Solution demo for Greenleaf Foods', partner: 'Kapoor Digital', createdAt: day(-2, 14), status: 'Assigned', scheduledAt: day(3, 11), where: 'Mariox office' },
      { id: 'TK-2031', kind: 'ticket', title: 'TK-2031 · Invoice copy for my client', detail: 'Billing', partner: 'Sharma Digital', createdAt: day(-2, 17), status: 'Requested' },
      { id: 'BK-35', kind: 'visit', title: 'Client visit with Apex Clinics', partner: 'BrightPath Consulting', createdAt: day(-2, 18), status: 'Requested', scheduledAt: day(5, 11), where: 'Pune office · 6 guests' },
      { id: 'TR-79', kind: 'tech', title: 'Estimate review call', partner: 'Qureshi Tech Advisors', createdAt: day(-1, 10), status: 'Requested', scheduledAt: day(6, 15), where: 'Zoom · 30 min' },
      { id: 'TR-80', kind: 'tech', title: 'Architecture call for Urban Spoon', partner: 'BrightPath Consulting', createdAt: day(-1, 12), status: 'Assigned', scheduledAt: day(7, 17), where: 'Google Meet' },
      { id: 'BK-36', kind: 'visit', title: 'Office tour for Greenleaf Foods', partner: 'Kapoor Digital', createdAt: day(-1, 15), status: 'Requested', scheduledAt: day(7, 15, 30), where: 'Pune office · 3 guests' },
      { id: 'TK-2030', kind: 'ticket', title: 'TK-2030 · Set-password link expired', detail: 'Account', partner: 'Kapoor Digital', createdAt: day(-1, 18), status: 'Requested' },
    ],
    recruitment: {
      upcoming: [
        { name: 'Meera Iyer', company: 'Iyer Ventures', owner: 'Aman', type: 'Demo', at: day(1, 16) },
        { name: 'Sarah Thompson', company: 'Northside Partners', owner: 'Neha', type: 'Intro call', at: day(3, 11, 30) },
      ],
      funnel: { contacted: 42, meeting: 17, followup: 9, signed: 6, onboarding: 4, rejected: 7 },
      team: [
        { name: 'Ritika', contacted: 18, meetings: 7, signed: 3 },
        { name: 'Aman', contacted: 14, meetings: 6, signed: 2 },
        { name: 'Neha', contacted: 10, meetings: 4, signed: 1 },
      ],
      rejectReasons: [
        { reason: 'Commission or terms', count: 3 },
        { reason: 'Not interested', count: 2 },
        { reason: 'No response', count: 2 },
      ],
      agenda: {
        count: 4,
        list: [
          { id: 'AQ-7', name: 'Priya Nair', company: 'Nair Tech Advisors', owner: 'Ritika', kind: 'followup', type: 'Follow-up', at: day(-1, 0), overdue: true },
          { id: 'AQ-9', name: 'Kiran Shah', company: 'Shah Ventures', owner: 'Neha', kind: 'followup', type: 'Lead', at: day(0, 0), overdue: false },
          { id: 'AQ-3', name: 'Meera Iyer', company: 'Iyer Ventures', owner: 'Aman', kind: 'meeting', type: 'Demo', at: day(1, 16), overdue: false },
          { id: 'AQ-4', name: 'Sarah Thompson', company: 'Northside Partners', owner: 'Neha', kind: 'meeting', type: 'Intro call', at: day(3, 11, 30), overdue: false },
        ],
      },
      recent: {
        count: 42,
        list: [
          { id: 'AQ-12', name: 'Kiran Shah', company: 'Shah Ventures', owner: 'Neha', status: 'Lead', contactedAt: day(0, 0) },
          { id: 'AQ-11', name: 'Arjun Reddy', company: 'Reddy Growth Labs', owner: 'Aman', status: 'Lead', contactedAt: day(-1, 0) },
          { id: 'AQ-10', name: 'Meera Iyer', company: 'Iyer Ventures', owner: 'Aman', status: 'Meeting', contactedAt: day(-3, 0) },
          { id: 'AQ-8', name: 'Sarah Thompson', company: 'Northside Partners', owner: 'Neha', status: 'Meeting', contactedAt: day(-5, 0) },
          { id: 'AQ-7', name: 'Priya Nair', company: 'Nair Tech Advisors', owner: 'Ritika', status: 'Follow-up', contactedAt: day(-8, 0) },
          { id: 'AQ-5', name: 'Farhan Ali', company: 'Ali & Sons Consulting', owner: 'Ritika', status: 'Converted', contactedAt: day(-12, 0) },
          { id: 'AQ-4', name: 'Leena Joshi', company: 'Joshi Digital', owner: 'Aman', status: 'Rejected', contactedAt: day(-14, 0) },
        ],
      },
    },
    attention: { missingPayout: 6, missingPayoutWithDue: 2, invitedNotSetUp: 9, oldestInviteDays: 12, noLead30d: 11, signedNotOnboarding: 2 },
    topPartners: [
      { name: 'Imran Qureshi', company: 'Qureshi Tech Advisors', code: 'MX-P-243-21', openLeads: 3, won: 900000, lastLeadAt: day(-7) },
      { name: 'Rohit Sharma', company: 'Sharma Digital', code: 'MX-P-243-1', openLeads: 6, won: 840000, lastLeadAt: day(-2) },
      { name: 'Kavya Rao', company: 'Nexa Growth', code: 'MX-P-243-9', openLeads: 5, won: 620000, lastLeadAt: day(-4) },
      { name: 'Ananya Mehta', company: 'BrightPath Consulting', code: 'MX-P-243-14', openLeads: 4, won: 510000, lastLeadAt: day(0, 9) },
      { name: 'Rohan Kapoor', company: 'Kapoor Digital', code: 'MX-P-243-27', openLeads: 2, won: 430000, lastLeadAt: day(0, 8) },
    ],
    roster: {
      count: 143,
      list: [
        ['Ananya Mehta', 'BrightPath Consulting', 'MX-P-243-14', 'active', 14, 4, 5, 2310000, 51000, 236000, 0, false],
        ['Rohan Kapoor', 'Kapoor Digital', 'MX-P-243-27', 'active', 9, 2, 3, 1290000, 43000, 86000, 0, true],
        ['Rohit Sharma', 'Sharma Digital', 'MX-P-243-1', 'active', 22, 6, 8, 4120000, 122000, 318000, 2, false],
        ['Kavya Rao', 'Nexa Growth', 'MX-P-243-9', 'active', 17, 5, 6, 2870000, 87000, 194000, 4, false],
        ['Imran Qureshi', 'Qureshi Tech Advisors', 'MX-P-243-21', 'active', 11, 3, 4, 1960000, 45000, 102000, 7, true],
        ['Neel Bhatt', 'Bhatt Associates', 'MX-P-243-33', 'active', 6, 2, 1, 340000, 0, 34000, 9, false],
        ['Divya Menon', 'Menon Partners', 'MX-P-243-38', 'invited', 0, 0, 0, 0, 0, 0, 12, true],
        ['Arvind Pillai', 'Pillai Ventures', 'MX-P-243-17', 'active', 4, 1, 0, 0, 0, 0, 21, true],
        ['Sana Khan', 'Khan Ventures', 'MX-P-243-2', 'active', 3, 0, 1, 180000, 0, 18000, 34, false],
        ['Tara Singh', 'Singh Consulting', 'MX-P-243-41', 'disabled', 2, 0, 0, 0, 0, 0, 60, true],
      ].map(([name, company, code, status, leads, openLeads, wonLeads, wonValue, commissionPayable, commissionPaid, ago, payoutDetailsMissing]) => ({
        id: code, name, company, code, status, leads, openLeads, wonLeads, wonValue, commissionPayable, commissionPaid, lastActivityAt: day(-ago, 11), payoutDetailsMissing,
      })),
    },
    newLeads: {
      count: 4,
      value: 1660000,
      list: [
        { id: 'PL-301', partner: 'BrightPath Consulting', company: 'Apex Diagnostics', stage: 'lead', stageName: 'Lead', value: 420000, createdAt: day(0, 9) },
        { id: 'PL-298', partner: 'Kapoor Digital', company: 'Greenleaf Organics', stage: 'contacted', stageName: 'Contacted', value: 380000, createdAt: day(0, 8) },
        { id: 'PL-295', partner: 'Sharma Digital', company: 'Urban Nest', stage: 'meeting', stageName: 'Meeting done', value: 700000, createdAt: day(-2, 15) },
        { id: 'PL-290', partner: 'Nexa Growth', company: 'Spice Route Foods', stage: 'won', stageName: 'Won', value: 160000, createdAt: day(-5, 12) },
      ],
    },
    payoutsDue: {
      payable: {
        count: 5,
        total: 228000,
        list: [
          { id: 'PY-866', partner: 'Kavya Rao', company: 'Nexa Growth', code: 'MX-P-243-9', client: 'Orbit Logistics', project: 'Fleet app', milestone: 'Milestone 1', amount: 250000, commission: 25000, clientPaidOn: day(-7) },
          { id: 'PY-869', partner: 'Rohit Sharma', company: 'Sharma Digital', code: 'MX-P-243-1', client: 'Lumen Studio', project: 'Marketing site', milestone: 'Milestone 3', amount: 380000, commission: 38000, clientPaidOn: day(-4) },
          { id: 'PY-886', partner: 'Ananya Mehta', company: 'BrightPath Consulting', code: 'MX-P-243-14', client: 'Medisure Health', project: 'Patient portal', milestone: 'Advance', amount: 510000, commission: 51000, clientPaidOn: day(-3) },
          { id: 'PY-881', partner: 'Rohit Sharma', company: 'Sharma Digital', code: 'MX-P-243-1', client: 'Kapoor Retail', project: 'Retail app', milestone: 'Final payment', amount: 840000, commission: 84000, clientPaidOn: day(-2) },
          { id: 'PY-884', partner: 'Kavya Rao', company: 'Nexa Growth', code: 'MX-P-243-9', client: 'Urban Spoon', project: 'Ordering website', milestone: 'Milestone 2', amount: 300000, commission: 30000, clientPaidOn: day(-1) },
        ],
      },
      onHold: {
        count: 2,
        total: 88000,
        list: [
          { id: 'PY-889', partner: 'Rohan Kapoor', company: 'Kapoor Digital', code: 'MX-P-243-27', client: 'Greenleaf Foods', project: 'Ordering app', milestone: 'Milestone 1', amount: 430000, commission: 43000, clientPaidOn: day(-4), reason: 'PAN, IFSC missing' },
          { id: 'PY-872', partner: 'Imran Qureshi', company: 'Qureshi Tech Advisors', code: 'MX-P-243-21', client: 'TrackPro Industries', project: 'Dealer portal', milestone: 'Advance', amount: 450000, commission: 45000, clientPaidOn: day(-2), reason: 'Bank account missing' },
        ],
      },
    },
    weekly: weekly([310000, 240000, 390000, 220000, 410000, 300000, 360000, 480000, 320000, 500000, 460000, 440000]),
  };

  // Open requests per kind, derived from the request list above (same rules as the API).
  partners.requestKinds = ['scope', 'visit', 'tech', 'ticket'].map((kind) => {
    const mine = partners.requests.filter((r) => r.kind === kind);
    return {
      kind,
      open: mine.length,
      escalated: mine.filter((r) => r.escalated).length,
      oldestAt: mine[0]?.createdAt ?? null,
      latest: mine.slice(-3).reverse().map((r) => ({ id: r.id, title: r.title, partner: r.partner, status: r.status, createdAt: r.createdAt, scheduledAt: r.scheduledAt ?? null })),
    };
  });

  return { mariox, partners };
}
