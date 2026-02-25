'use client';

import { useAuth } from './auth-provider';
import { AdminSidebar } from './sidebar';
import { usePathname } from 'next/navigation';

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Login page doesn't need sidebar
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthenticated && !isLoginPage ? (
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
