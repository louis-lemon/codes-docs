import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/sidebar';
import '@/app/global.css';

export const metadata = {
  title: 'Admin | CMS',
  description: 'Content Management System',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {session ? (
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8">{children}</main>
          </div>
        ) : (
          children
        )}
      </div>
    </SessionProvider>
  );
}
