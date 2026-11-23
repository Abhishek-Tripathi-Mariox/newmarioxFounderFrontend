/**
 * Empty summaries in the API shape. The overview uses one in place of a portal whose numbers
 * did not load, so the other portal's numbers still show (with a note about the missing one).
 */
const emptyPeriod = { value: 0, deals: 0 };

export const EMPTY_MARIOX = {
  company: 'mariox',
  syncedAt: null,
  sales: {
    won: { today: emptyPeriod, week: emptyPeriod, month: emptyPeriod },
    lost: { month: emptyPeriod, topReason: null },
    newDeals: { today: 0, week: 0 },
    winRateQuarter: 0,
    stages: [],
    owners: [],
    followUps: { dueToday: 0, due: { count: 0, overdue: 0, list: [] } },
    newLeads: { count: 0, value: 0, list: [] },
    sourcesMonth: [],
  },
  cash: null,
  changeRequests: { waitingOnClient: 0, value: 0, list: [] },
  bugs: { open: 0, bySeverity: { Critical: 0, Major: 0, Minor: 0, Trivial: 0 }, critical: [] },
  projects: { running: 0, list: [], onHold: [], milestones: { overdue: { count: 0, list: [] }, dueSoon: { count: 0, list: [] } } },
  quotes: { waiting: { count: 0, value: 0, oldestSentAt: null, list: [] }, acceptedMonth: { count: 0, value: 0 } },
  team: { size: 0, in: 0, onBreak: 0, left: 0, notIn: 0, late: 0, hoursToday: 0, people: [], days: [], week: { from: null, workdays: 0, people: [] } },
  hoursWeek: { from: null, workdays: 0, total: 0, expected: 0, projects: { count: 0, list: [] }, people: [] },
  weekly: [],
};

export const EMPTY_PARTNERS = {
  company: 'partners',
  syncedAt: null,
  rate: 0,
  counts: { total: 0, active: 0, invited: 0, disabled: 0 },
  pipeline: { open: 0, value: 0, stages: [] },
  newDeals: { today: 0, week: 0 },
  won: { today: emptyPeriod, week: emptyPeriod, month: emptyPeriod },
  commission: { toPay: [], clientDue: [], recentReleased: [], released: 0, upcoming: 0 },
  requests: [],
  recruitment: {
    funnel: { contacted: 0, meeting: 0, followup: 0, signed: 0, onboarding: 0, rejected: 0 },
    team: [],
    rejectReasons: [],
    upcoming: [],
    agenda: { count: 0, list: [] },
    recent: { count: 0, list: [] },
  },
  attention: { missingPayout: 0, missingPayoutWithDue: 0, invitedNotSetUp: 0, oldestInviteDays: 0, noLead30d: 0, signedNotOnboarding: 0 },
  topPartners: [],
  roster: { count: 0, list: [] },
  newLeads: { count: 0, value: 0, list: [] },
  requestKinds: [],
  payoutsDue: { payable: { count: 0, total: 0, list: [] }, onHold: { count: 0, total: 0, list: [] } },
  weekly: [],
};
