'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/components/admin/auth-provider';
import { PostSelector } from '@/components/admin/settings';
import { SaveStatusIndicator, type SaveStatus } from '@/components/admin/save-status-indicator';
import { getSettings, updateSettings, listPosts } from '@/lib/github-client';
import { cn } from '@/lib/utils';
import type { BlogFeaturedSettings } from '@/types/settings';
import type { PostListItem } from '@/types/admin';

export default function FeaturedSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [settings, setSettings] = useState<BlogFeaturedSettings | null>(null);
  const [sha, setSha] = useState<string>('');
  const [blogPosts, setBlogPosts] = useState<PostListItem[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsResult, posts] = await Promise.all([
        getSettings<BlogFeaturedSettings>('blog-featured'),
        listPosts('blog'),
      ]);

      if (settingsResult) {
        setSettings(settingsResult.data);
        setSha(settingsResult.sha);
      } else {
        // Initialize with default settings if not found
        setSettings({
          featuredPostIds: [],
          maxFeatured: 4,
        });
      }
      setBlogPosts(posts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to load data: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleFeaturedChange = (ids: string[]) => {
    if (!settings) return;
    setSettings({ ...settings, featuredPostIds: ids });
    setHasChanges(true);
    setSaveStatus('idle');
  };

  const handleSave = useCallback(async () => {
    if (!settings || !sha) return;

    setSaving(true);
    setSaveStatus('saving');
    const toastId = toast.loading('Saving settings...');

    try {
      const result = await updateSettings('blog-featured', settings, sha);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save');
      }

      if (result.sha) {
        setSha(result.sha);
      }
      setSaveStatus('saved');
      setLastSaved(new Date());
      setHasChanges(false);

      toast.success('Saved! Deploying...', {
        id: toastId,
        duration: 8000,
        action: {
          label: 'View Deploy',
          onClick: () => window.open(result.workflowUrl, '_blank'),
        },
      });
    } catch (err) {
      setSaveStatus('error');
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Save failed: ${message}`, { id: toastId });
    } finally {
      setSaving(false);
    }
  }, [settings, sha]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasChanges && !saving) {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, hasChanges, saving]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/settings"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Featured Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Select blog posts to feature on the blog page
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SaveStatusIndicator
            status={saveStatus}
            lastSaved={lastSaved}
            hasChanges={hasChanges}
          />
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              'bg-yellow-600 text-white hover:bg-yellow-700',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </button>
        </div>
      </div>

      {/* Post Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {settings && (
          <PostSelector
            posts={blogPosts}
            selectedIds={settings.featuredPostIds}
            maxSelection={settings.maxFeatured}
            onChange={handleFeaturedChange}
          />
        )}
      </div>

      {/* Tip */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>
          Tip: Use Cmd/Ctrl + S to save. Featured posts will appear at the top
          of the blog page. Drag to reorder.
        </p>
      </div>
    </div>
  );
}
