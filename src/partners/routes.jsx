// Route table of the partner portal (formerly the Next.js app router tree), mounted under /partners.
//   /partners/login                                         → /login (the one sign-in page)
//   /partners/forgot-password                               → /forgot-password (the one reset flow)
//   /partners/set-password                                  public (signed-in users go home)
//   /partners/dashboard, leads, earnings, …                partner area (any signed-in user)
//   /partners/admin/…                                       admin area (partners go to /dashboard)
// Pages are code-split; the shell stays on screen while a page's chunk loads.
import { lazy } from 'react';
import PartnerRoot from './components/PartnerRoot';
import { ForgotRedirect, HomeRedirect, LoginRedirect, PublicOnly, RequireSession } from './components/RouteGuards';
import { SectionGate } from './components/SectionGate';
import { ADMIN_PAGE_MOD } from './lib/perms';

const page = (load) => {
  const Page = lazy(load);
  return <Page />;
};

/** An admin console page, shown only when the admin's role can view its section (`sub` = path below /partners/admin). */
const adminPage = (sub, load) => <SectionGate mod={ADMIN_PAGE_MOD[sub]}>{page(load)}</SectionGate>;

export const PARTNERS_BASE = '/partners';

/** @type {import('react-router-dom').RouteObject[]} */
export const partnerRoutes = [
  {
    path: PARTNERS_BASE,
    element: <PartnerRoot />,
    children: [
      { index: true, element: <HomeRedirect /> },
      { path: 'login', element: <LoginRedirect /> },
      { path: 'forgot-password', element: <ForgotRedirect /> },
      {
        element: <PublicOnly />,
        children: [
          { path: 'set-password', element: page(() => import('./pages/auth/SetPasswordPage')) },
        ],
      },
      {
        element: <RequireSession />,
        children: [
          {
            element: page(() => import('./pages/portal/PortalLayout')),
            children: [
              { path: 'dashboard', element: page(() => import('./pages/portal/DashboardPage')) },
              { path: 'leads', element: page(() => import('./pages/portal/LeadsPage')) },
              { path: 'leads/:id', element: page(() => import('./pages/portal/LeadDetailPage')) },
              { path: 'earnings', element: page(() => import('./pages/portal/EarningsPage')) },
              { path: 'projects', element: page(() => import('./pages/portal/ProjectsPage')) },
              { path: 'scope', element: page(() => import('./pages/portal/ScopePage')) },
              { path: 'visits', element: page(() => import('./pages/portal/VisitsPage')) },
              { path: 'tech', element: page(() => import('./pages/portal/TechPage')) },
              { path: 'kit', element: page(() => import('./pages/portal/KitPage')) },
              { path: 'support', element: page(() => import('./pages/portal/SupportPage')) },
              { path: 'profile', element: page(() => import('./pages/portal/ProfilePage')) },
            ],
          },
        ],
      },
      {
        path: 'admin',
        element: <RequireSession admin />,
        children: [
          {
            element: page(() => import('./pages/admin/AdminLayout')),
            children: [
              { index: true, element: adminPage('', () => import('./pages/admin/AdminOverviewPage')) },
              { path: 'acquisition', element: adminPage('/acquisition', () => import('./pages/admin/AdminAcquisitionPage')) },
              { path: 'partners', element: adminPage('/partners', () => import('./pages/admin/AdminPartnersPage')) },
              { path: 'partners/:id', element: adminPage('/partners/:id', () => import('./pages/admin/AdminPartnerDetailPage')) },
              { path: 'leads', element: adminPage('/leads', () => import('./pages/admin/AdminLeadsPage')) },
              { path: 'leads/:id', element: adminPage('/leads/:id', () => import('./pages/admin/AdminLeadDetailPage')) },
              { path: 'projects', element: adminPage('/projects', () => import('./pages/admin/AdminProjectsPage')) },
              { path: 'requests', element: adminPage('/requests', () => import('./pages/admin/AdminRequestsPage')) },
              { path: 'kit', element: adminPage('/kit', () => import('./pages/admin/AdminKitPage')) },
              { path: 'settings', element: adminPage('/settings', () => import('./pages/admin/AdminSettingsPage')) },
              { path: 'account', element: page(() => import('./pages/admin/AdminAccountPage')) },
            ],
          },
        ],
      },
      { path: '*', element: <HomeRedirect /> },
    ],
  },
];
