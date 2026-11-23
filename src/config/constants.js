/**
 * Static portal configuration. Hue numbers (0–360) drive the colour of each
 * status / type via lib/color.tone().
 */

/** Sales owners (lead owners). */
export const OWNERS = [
  { id: 'ak', name: 'Aman Kapoor', h: 265 },
  { id: 'ps', name: 'Priya Sharma', h: 340 },
  { id: 'rv', name: 'Rohit Verma', h: 155 },
  { id: 'nj', name: 'Neha Jain', h: 65 },
  { id: 'sk', name: 'Sahil Khan', h: 210 },
];

/** Lead pipeline stages, in order. */
export const LEAD_STATUSES = [
  ['New', 250], ['Contacted', 220], ['Qualified', 190], ['Proposal Sent', 295],
  ['Negotiation', 70], ['Won', 150], ['Lost', 25],
];
export const LEAD_STATUS_NAMES = LEAD_STATUSES.map((s) => s[0]);
export const leadStatusHue = (k) => (LEAD_STATUSES.find((s) => s[0] === k) || [k, 265])[1];

export const SOURCES = ['Website', 'LinkedIn', 'Upwork', 'Clutch', 'Referral', 'Google Ads', 'IndiaMART', 'Email Campaign'];
export const SERVICES = ['Mobile App', 'Web Development', 'UI/UX Design', 'Custom Software', 'E-commerce', 'AI / ML', 'Digital Marketing'];

export const FU_TYPES = { Meeting: 150, Call: 220, Task: 70, Reminder: 300 };
export const PRIORITIES = { High: 25, Medium: 70, Low: 220 };
export const PRIORITY_NAMES = Object.keys(PRIORITIES);

export const PROJECT_STATUS = { Running: 150, 'On hold': 70, Completed: 220, Planning: 250, Cancelled: 25 };
export const TASK_STATUS = { 'To do': 265, 'In progress': 250, Blocked: 25, 'In review': 300, Done: 150 };
export const BUG_STATUS = { Open: 250, 'In progress': 70, Fixed: 150, Retest: 300, Reopened: 25, Closed: 265 };
export const BUG_SEVERITY = { Critical: 25, Major: 55, Minor: 220, Trivial: 265 };
export const BUG_SEVERITY_DAYS = { Critical: 1, Major: 3, Minor: 7, Trivial: 14 };
export const BUG_ENVS = ['Android', 'iOS', 'Web', 'API / Backend', 'Admin panel'];
export const MILESTONE_STATUS = { 'Not started': 265, 'In progress': 250, 'In review': 300, Done: 150 };
export const CR_STATUS = { Draft: 265, 'Sent to client': 70, Approved: 150, 'In progress': 250, Done: 150, Rejected: 25 };
export const QUOTE_STATUS = { Draft: 265, Sent: 250, Viewed: 300, Accepted: 150, Declined: 25 };

export const TEAMS = ['Web', 'Mobile', 'Backend', 'Design', 'QA', 'PMO'];
/** Internal cost per hour (INR) by team. */
export const TEAM_COST = { Web: 700, Mobile: 750, Backend: 750, Design: 650, QA: 550, PMO: 900 };

/** Permission modules: [key, label, hint]. */
export const MODULES = [
  ['dash', 'Dashboard', 'Sales KPIs and agenda'],
  ['leads', 'Leads', 'Pipeline, lead details, documents'],
  ['fu', 'Follow-ups', 'Meetings, calls, reminders'],
  ['projects', 'Projects', 'Projects, milestones, documents'],
  ['tasks', 'Tasks', 'Task board'],
  ['bugs', 'Bugs', 'Bug reports'],
  ['ts', 'Timesheets', 'Log and view hours'],
  ['team', 'Team & hours', 'Hours and allocation per person'],
  ['users', 'Users & roles', 'Users, roles and permissions'],
  ['tt', 'Team tasks', 'Give and track tasks · Team = self + people who report to them · All = everyone'],
  ['att', 'Attendance & reports', 'Check-ins, breaks, end-of-shift reports, internal work, CSV export · Edit = check people in / out, breaks and timers · Team = people who report to them'],
  // Partner portal admin console (/partners/admin): one module per section.
  ['pp_overview', 'Overview', 'Partner network at a glance (shows only the sections below the role can view)'],
  ['pp_acq', 'Acquisition', 'Partner recruitment funnel · Create = add / import leads · Edit = update, convert, board lists'],
  ['pp_partners', 'Partners', 'Partner accounts, commission rate, KYC · Create = invite · Edit = profile, rate, status, password'],
  ['pp_leads', 'Leads', 'Leads of every partner · Edit = update, reassign'],
  ['pp_projects', 'Projects & payouts', 'Partner projects, payments and commission payouts'],
  ['pp_requests', 'Requests', 'Scope approvals, office visits, tech requests, support tickets · Edit = review / reply'],
  ['pp_kit', 'Sales kit', 'Decks, case studies and videos for partners'],
  ['pp_settings', 'Settings', 'Pipeline stages, announcement, contacts · Edit = publish'],
];

/** Module groups in the role editor: [title, first module key]. */
export const MODULE_GROUPS = [['Team portal', 'dash'], ['Partner portal (admin console)', 'pp_overview']];

/** Partner portal admin modules (any with View opens /partners/admin). */
export const PARTNER_MODULES = MODULES.map(([k]) => k).filter((k) => k.startsWith('pp_'));

/**
 * Actions a module offers when it doesn't use all of View / Create / Edit / Delete (same as the
 * server, backend/src/core/permissions.js). The missing ones show as "—" with the reason below.
 */
export const MODULE_ACTIONS = {
  dash: ['v'], projects: ['v', 'c', 'e'], ts: ['v', 'c', 'e'], team: ['v'], att: ['v', 'e'],
  pp_overview: ['v'], pp_requests: ['v', 'e', 'd'], pp_settings: ['v', 'e'],
};
/** Why an action is "—" (tooltip). */
export const MISSING_ACTION_NOTE = {
  dash: 'The dashboard is read-only',
  projects: { d: 'Projects aren’t deleted: removing milestones, members or change requests is Edit' },
  ts: { d: 'Deleting a time entry is part of Edit' },
  team: 'Team & hours is read-only (allocations are changed under Projects → Edit)',
  att: { c: 'Attendance comes from check-ins: there are no manual entries', d: 'Attendance events can’t be deleted' },
  pp_overview: 'The overview is read-only',
  pp_requests: { c: 'Partners raise requests; admins review them (Edit)' },
  pp_settings: { c: 'Settings are edited and published, not created', d: 'Settings are edited and published, not deleted' },
};
/** Modules without a data scope (All / Team / Own): partner records belong to partners, not to staff. */
export const NO_SCOPE_MODULES = PARTNER_MODULES;

export const REMINDERS = [
  [0, 'No reminder'], [5, '5 min before'], [10, '10 min before'], [30, '30 min before'], [60, '1 hour before'], [1440, '1 day before'],
];

/** Follow-up defaults per type: [duration, reminder, meet link]. */
export const FU_DEFAULTS = { Meeting: [45, 10, true], Call: [15, 10, false], Task: [0, 60, false], Reminder: [0, 0, false] };

export const BREAK_TYPES = [['Lunch', 45], ['Tea / coffee', 15], ['Personal', 15], ['Meeting outside', 30]];

/** Why a project is on hold / delayed. */
export const STATUS_REASONS = ['Client end', 'Third party', 'Internal / team', 'Payment pending', 'Scope change', 'Other'];

export const MILESTONE_TEMPLATE = {
  fractions: [0.15, 0.3, 0.3, 0.15, 0.1],
  names: ['Feature List', 'UI/UX Milestone 1', 'Frontend Milestone 2', 'Backend Milestone 3', 'QA, Third Party, Go Live - Milestone 4'],
};

export const LINK_TYPES = ['Figma', 'Prototype', 'Google Drive', 'Repository', 'Staging URL', 'Live URL', 'Jira / tracker', 'Other'];
export const LINK_PLACEHOLDER = {
  Figma: 'https://www.figma.com/design/…', Prototype: 'https://www.figma.com/proto/…', 'Google Drive': 'https://drive.google.com/…',
  Repository: 'https://github.com/…', 'Staging URL': 'https://staging.…', 'Live URL': 'https://…', 'Jira / tracker': 'https://…atlassian.net/…', Other: 'https://…',
};
export const LINK_HUE = { Figma: 300, Prototype: 330, 'Google Drive': 150, Repository: 265, 'Staging URL': 70, 'Live URL': 150, 'Jira / tracker': 250, Other: 265 };

export const DOC_KINDS = ['SOW', 'FRD', 'BRD', 'NDA', 'Proposal', 'Contract / MSA', 'Wireframes', 'Invoice', 'Design specs', 'Other'];

export const ACTIVITY_KINDS = ['Call', 'Email', 'WhatsApp', 'Meeting', 'Note'];

/** Period presets used across filters. */
export const LEAD_DATE_PRESETS = [
  ['all', 'Any created date'], ['today', 'Created today'], ['yesterday', 'Yesterday'], ['7d', 'Last 7 days'], ['30d', 'Last 30 days'],
  ['month', 'This month'], ['lastmonth', 'Last month'], ['90d', 'Last 90 days'], ['custom', 'Custom range…'],
];
export const FU_DATE_PRESETS = [
  ['all', 'Any due date'], ['today', 'Due today'], ['tomorrow', 'Tomorrow'], ['week', 'This week'], ['next7', 'Next 7 days'],
  ['7d', 'Last 7 days'], ['month', 'This month'], ['custom', 'Custom range…'],
];
export const PROJECT_PERIOD_PRESETS = [
  ['today', 'Today'], ['yesterday', 'Yesterday'], ['week', 'This week'], ['7d', 'Last 7 days'], ['month', 'This month'],
  ['lastmonth', 'Last month'], ['30d', 'Last 30 days'], ['90d', 'Last 90 days'], ['all', 'All time'], ['custom', 'Custom range…'],
];
export const ATTENDANCE_RANGES = [
  ['today', 'Today'], ['yesterday', 'Yesterday'], ['date', 'Pick a date…'], ['week', 'This week'], ['7d', 'Last 7 days'],
  ['month', 'This month'], ['30d', 'Last 30 days'], ['lastmonth', 'Last month'],
];

