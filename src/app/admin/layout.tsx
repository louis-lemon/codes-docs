'use client';

import { AuthProvider } from '@/components/admin/auth-provider';
import { AdminLayoutContent } from '@/components/admin/layout-content';
import { ToastProvider } from '@/components/admin/toast-provider';
import '@/app/global.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <ToastProvider />
    </AuthProvider>
  );
}
