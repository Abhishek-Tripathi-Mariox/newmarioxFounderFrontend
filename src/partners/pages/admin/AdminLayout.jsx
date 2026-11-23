import '@/partners/styles/acquire.css';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@/partners/components/AppShell';
import { ADMIN_NAV, ADMIN_TABS } from '@/partners/components/nav';

const ACCOUNT = [
  { href: '/partners/admin/account', label: 'My account', icon: 'user' },
  { href: '/partners/admin/account?tab=security', label: 'Password & security', icon: 'shield' },
];

export default function AdminLayout() {
  return (
    <AppShell nav={ADMIN_NAV} tabs={ADMIN_TABS} home="/partners/admin" subtitle="Admin console" menu={[...ACCOUNT, ...ADMIN_NAV.filter(n => !ADMIN_TABS.includes(n.href))]}>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}
