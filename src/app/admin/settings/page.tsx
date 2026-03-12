'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, Home, Star, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/admin/auth-provider';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/motion-utils';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const prefersReducedMotion = useReducedMotion();

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

  const settingsItems = [
    {
      name: 'Homepage',
      description: 'Manage Quick Start and Technology Stack sections',
      href: '/admin/settings/homepage',
      icon: Home,
      color: 'purple',
    },
    {
      name: 'Featured Posts',
      description: 'Select blog posts to feature on the blog page',
      href: '/admin/settings/featured',
      icon: Star,
      color: 'yellow',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
        animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? undefined : { duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Site Settings
          </h1>
        </div>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Configure homepage sections and blog featured content
        </p>
      </motion.div>

      {/* Settings cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.4, delay: 0.1 + index * 0.1 }}
          >
            <Link
              href={item.href}
              className={cn(
                'group flex items-center gap-4 p-6 rounded-xl border transition-all duration-200',
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                'hover:shadow-lg hover:-translate-y-1'
              )}
            >
              <div
                className={cn(
                  'flex-shrink-0 p-3 rounded-lg transition-colors',
                  item.color === 'purple'
                    ? 'bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50'
                )}
              >
                <item.icon
                  className={cn(
                    'h-6 w-6',
                    item.color === 'purple'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  )}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {item.name}
                  <ArrowRight
                    className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
