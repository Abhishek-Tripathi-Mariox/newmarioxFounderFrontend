// Route table of the partner portal (formerly the Next.js app router tree), mounted under /partners.
//   /partners/login                                         → /login (the one sign-in page)
//   /partners/forgot-password                               → /forgot-password?as=partner (the one reset flow)
//   /partners/set-password                                  public (signed-in users go home)
//   /partners/dashboard, leads, earnings, …                partner area (any signed-in user)
//   /partners/admin/…                                       admin area (partners go to /dashboard)
// Pages are code-split; the shell stays on screen while a page's chunk loads.
import { lazy } from 'react';
import PartnerRoot from './components/PartnerRoot';
import { ForgotRedirect, HomeRedirect, LoginRedirect, PublicOnly, RequireSession } from './components/RouteGuards';

const page = (load) => {
  const Page = lazy(load);
  return <Page />;
};

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
              { index: true, element: page(() => import('./pages/admin/AdminOverviewPage')) },
              { path: 'acquisition', element: page(() => import('./pages/admin/AdminAcquisitionPage')) },
              { path: 'partners', element: page(() => import('./pages/admin/AdminPartnersPage')) },
              { path: 'partners/:id', element: page(() => import('./pages/admin/AdminPartnerDetailPage')) },
              { path: 'leads', element: page(() => import('./pages/admin/AdminLeadsPage')) },
              { path: 'leads/:id', element: page(() => import('./pages/admin/AdminLeadDetailPage')) },
              { path: 'projects', element: page(() => import('./pages/admin/AdminProjectsPage')) },
              { path: 'requests', element: page(() => import('./pages/admin/AdminRequestsPage')) },
              { path: 'kit', element: page(() => import('./pages/admin/AdminKitPage')) },
              { path: 'settings', element: page(() => import('./pages/admin/AdminSettingsPage')) },
              { path: 'account', element: page(() => import('./pages/admin/AdminAccountPage')) },
            ],
          },
        ],
      },
      { path: '*', element: <HomeRedirect /> },
    ],
  },
];
