import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@/partners/components/AppShell';
import { adminNavFor } from '@/partners/components/nav';

const ACCOUNT = [
  { href: '/partners/admin/account', label: 'My account', icon: 'user' },
  { href: '/partners/admin/account?tab=security', label: 'Password & security', icon: 'shield' },
];

export default function AdminLayout() {
  return (
    <AppShell nav={adminNavFor} account={ACCOUNT} home="/partners/admin" subtitle="Admin console">
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}
