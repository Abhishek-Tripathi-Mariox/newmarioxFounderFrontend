# CofounderMariox: cofounder portal for Mariox + Mariox Partners

One place for the founders to track both businesses:

- **Mariox**: direct sales and delivery, from the internal portal (`../internal-portal`)
- **Mariox Partners**: the partner network, from the partners portal (`../mariox-saas`)

React 19 · Vite · React Router 7 · CSS Modules. No database of its own. It reads one read-only
summary from each product. Without them it runs on built-in sample data.

## Run

```bash
npm install
npm run dev        # http://localhost:5180 (summaries come from the backend, see below)
npm run build      # production build in dist/
npm run lint
```

### Live data

Summaries come from the Founders HQ backend (`GET /api/summary/mariox`, `GET /api/summary/partners`,
see `../../API.md`). The backend holds `FOUNDER_API_KEY` and calls the two products server-to-server,
so the key is never in the browser. The dev / preview server forwards `/api` to the backend
(`VITE_API_PROXY`, default `http://localhost:5050`).

1. Pick one shared secret: `openssl rand -hex 24`.
2. Put it in both products and in the backend's `.env`, and restart them:
   - `internal-portal/backend/.env` → `FOUNDER_API_KEY=<secret>`
   - `mariox-saas/.env.local` → `FOUNDER_API_KEY=<secret>`
3. `npm run dev`. If a product is not connected or not reachable, the page shows the backend's error.

| Variable | What it does |
|---|---|
| `VITE_SUMMARY_API_URL` | Where the browser loads summaries from. Empty = `/api/summary`; `sample` = built-in sample data. |
| `VITE_API_PROXY` | Backend the dev/preview server forwards `/api` to. |
| `VITE_INTERNAL_PORTAL_URL` / `VITE_PARTNERS_ADMIN_URL` | “Open internal portal” / “Open partners admin” buttons. Hidden when empty. |

## Deploy

`npm run build` and serve `dist/` from your web server, forwarding `/api` to the Founders HQ backend:

```nginx
location /api/ { proxy_pass http://127.0.0.1:5050; }
location / { try_files $uri /index.html; }   # SPA routes
```

## Pages

| Route | Page | Shows |
|---|---|---|
| `/` | Overview | “Needs you today” alerts from both companies (mark handled, per browser, resets daily), 6 headline numbers with a Today / This week / This month switch and a Mariox vs Partners split, a card per company, 12-week revenue chart, top partners |
| `/mariox` | Mariox · Sales & delivery | Won, pipeline, win rate, overdue follow-ups, change requests, critical bugs; pipeline by stage; sales team; running projects with health; who is in, on break, left or not in |
| `/partners` | Mariox Partners | Partners, partner pipeline, commission (to pay / client payment due / released), open request queue, recruitment funnel, partners who need a nudge |

## How it fits together

```
src/
  api/summary.js          fetchSummary('mariox' | 'partners'): API call, or sample data when no URL is set
  data/sample.js          sample summaries in the exact API shape (dates relative to today)
  state/                  SummaryProvider loads both summaries once, refreshes every 5 min; useSummaries()
  domain/                 pure rules, no React: alerts, overview numbers, project health, commission, team status
  components/ui/          Card, KpiCard, Segmented, Pill, BarList, StackedBar, Tile, Avatar …
  components/layout/      AppShell (sidebar + data status), PageHeader
  features/<page>/        one folder per page and its sections
  lib/                    money (₹ lakh / crore), dates
```

### Business rules

- **Commission** per client payment = amount × the project's locked rate (else the partner's rate), computed in mariox-saas.
  - **To pay**: the client has paid and the partner hasn't been paid yet. This is what Mariox owes now.
  - **Client payment due**: the client still has to pay. Commission follows once they do.
  - **Released**: paid out, with UTR.
- **Project health**: **Late** if the current milestone's due date has passed; **At risk** if hours logged exceed the hour budget, or the client hasn't approved the milestone for 7+ days; otherwise **On track**.
- **Late check-in**: after 10:30 (the internal portal decides and sends `late`).
- **Periods** are “to date” in IST and compared with the same span of the previous week or month.
- **Cash collected** shows “—”: the internal portal doesn't record client payments yet (`cash: null`).

## Summary API

Both endpoints are `GET`, read-only, need the `x-founder-key` header (401 without it, 503 while the
key isn't configured), send `Cache-Control: no-store` and return `{ "data": summary }`.
`src/data/sample.js` is a full example of both shapes.

| Product | Endpoint | Code | Tests |
|---|---|---|---|
| internal-portal | `GET /api/v1/founder/summary` | `backend/src/modules/founder/` | `backend/tests/founder.test.js` |
| mariox-saas | `GET /api/founder/summary` | `src/lib/founder.ts`, `src/app/api/founder/summary/route.ts` | — |

**Mariox** (`company: "mariox"`):

- `sales.won.{today,week,month}`: `{ value, deals, prev? }`. A lead's won date is its last “Stage: … → Won” activity, else its `updated_at`.
- `sales.lost.month`, `sales.newDeals`, `sales.winRateQuarter` (closed in the last 90 days).
- `sales.stages`: open leads per stage in master-list order. `sales.owners`: open, pipeline, won this month and overdue follow-ups per sales owner. `sales.followUps.dueToday`.
- `changeRequests`: CRs “Sent to client”.
- `bugs`: open count; critical open bugs with project.
- `projects.list`: every *Running* project with its current milestone (first not Done), `hoursUsed` = hours logged ÷ hour budget (`budget_hours`, else the sum of milestone allocations; `null` without a budget), and `approvalAskedAt` while client approval is pending.
- `team`: every active member and sales owner, with today's check-in/out, break, running timer and `late`, plus counts (`in`, `onBreak`, `left`, `notIn`, `late`, `hoursToday`).
- `weekly`: won value per Monday-based week (12 weeks). `cash: null`.
- `projects.onHold`: projects on hold with the PM's reason and note.
- `reports`: today's end-of-shift reports (`checkedIn`, `submitted`) and the `blockers` people wrote, today and yesterday.
- `quotes`: quotes waiting on clients (Sent / Viewed: `count`, `value`, `oldestSentAt`) and accepted this month.
- `teamTasks`: Team tasks `open`, `overdue`, `doneWeek`, plus the 5 most overdue.

**Partners** (`company: "partners"`):

- `counts` (partner accounts by status), `pipeline` (open partner leads), `newDeals`, and `won.{today,week,month}`. The won date comes from the lead's “won” activity.
- `commission.toPay`, `commission.clientDue`, `commission.recentReleased`: rows with `partner, code, company, client, label, amount, commission, dueOn, releasedOn, utr`. Totals in `commission.released` and `commission.upcoming`.
- `requests`: everything waiting on Mariox, oldest first. That is scopes in review, office visits requested or rescheduled, tech calls requested or assigned, and tickets requested or assigned.
- `recruitment`: everyone first contacted this month in partner acquisition (sample leads excluded). Includes the funnel, per team member counts and reject reasons.
- `attention`:
  - active partners missing PAN or bank details (and how many of them are owed commission)
  - invited accounts that never set a password
  - active partners with no lead in 30 days
  - signed but not onboarding
- `topPartners`: top 5 by won value this month. `weekly`: won value per week.
- `pipeline.stages`: open partner leads per stage of the partner portal's pipeline.
- `delivery`: partner deals Mariox is delivering, by stage (Discovery … Go-live), and the ones still in progress.
- `recruitment.upcoming`: recruitment meetings booked for the next 7 days.
