import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@/partners/components/AppShell';
import { PARTNER_NAV } from '@/partners/components/nav';

const ACCOUNT = [
  { href: '/partners/profile', label: 'Profile & partner card', icon: 'idcard' },
  { href: '/partners/profile?tab=security', label: 'Password & security', icon: 'shield' },
];

export default function PortalLayout() {
  return (
    <AppShell nav={PARTNER_NAV} account={ACCOUNT} home="/partners/dashboard" subtitle="Partner portal">
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}
