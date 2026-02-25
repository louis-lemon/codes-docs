'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, BookOpen, PenTool, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/admin/auth-provider';
import { GITHUB_CONFIG } from '@/lib/github-client';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    { name: 'Documentation', icon: BookOpen, href: '/admin/posts?type=docs', description: 'Manage documentation pages' },
    { name: 'Blog Posts', icon: FileText, href: '/admin/posts?type=blog', description: 'Manage blog articles' },
    { name: 'New Post', icon: PenTool, href: '/admin/posts/new', description: 'Create new content' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || user?.login}!
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your documentation and blog content from this dashboard.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="relative group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <item.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Repository info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Repository
        </h2>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">Owner:</span>{' '}
            {GITHUB_CONFIG.owner}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">Repo:</span>{' '}
            {GITHUB_CONFIG.repo}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">Branch:</span>{' '}
            {GITHUB_CONFIG.branch}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">Signed in as:</span>{' '}
            @{user?.login}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
          Getting Started
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-amber-700 dark:text-amber-300">
          <li>Click "New Post" to create documentation or blog content</li>
          <li>Use the editor to write MDX content with live preview</li>
          <li>Click "Publish" to commit directly to your GitHub repository</li>
          <li>GitHub Actions will automatically rebuild and deploy your site</li>
        </ol>
      </div>
    </div>
  );
}
