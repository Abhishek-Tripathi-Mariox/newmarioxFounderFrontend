import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@/partners/components/AppShell';
import { PARTNER_NAV, PARTNER_TABS } from '@/partners/components/nav';

const MENU = [
  { href: '/partners/profile', label: 'Profile & partner card', icon: 'idcard' },
  { href: '/partners/profile?tab=security', label: 'Password & security', icon: 'shield' },
  { href: '/partners/visits', label: 'Book office visit', icon: 'cal' },
  { href: '/partners/kit', label: 'Sales kit', icon: 'file' },
  { href: '/partners/support', label: 'Support', icon: 'help' },
];

export default function PortalLayout() {
  return (
    <AppShell nav={PARTNER_NAV} tabs={PARTNER_TABS} home="/partners/dashboard" subtitle="Partner portal" menu={MENU}>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}
