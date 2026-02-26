'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/components/admin/auth-provider';
import { MDXEditor } from '@/components/admin/mdx-editor';
import { FrontmatterForm, type Frontmatter } from '@/components/admin/frontmatter-form';
import { getPost, updatePost, deletePost } from '@/lib/github-client';
import type { Post } from '@/types/admin';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function EditPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = searchParams.get('path') || '';
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Form state
  const [post, setPost] = useState<Post | null>(null);
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({
    title: '',
    description: '',
  });
  const [content, setContent] = useState('');

  // Track changes for autosave
  const [hasChanges, setHasChanges] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const AUTOSAVE_DELAY = 30000; // 30 seconds

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && path) {
      fetchPost();
    }
  }, [path, isAuthenticated]);

  const fetchPost = async () => {
    setLoading(true);

    try {
      const data = await getPost(path);

      if (!data) {
        throw new Error('Post not found');
      }

      setPost(data);

      // Load all frontmatter fields from rawFrontmatter
      const raw = data.rawFrontmatter || {};
      const parsedFrontmatter: Frontmatter = {
        title: (raw.title as string) || data.title || '',
        description: (raw.description as string) || data.description || '',
        id: raw.id as string | undefined,
        no: raw.no as number | undefined,
        order: raw.order as number | undefined,
        category: raw.category as string | undefined,
        subCategory: raw.subCategory as string | undefined,
        tags: raw.tags as string[] | undefined,
        created: raw.created as string | undefined,
        updated: raw.updated as string | undefined,
        slug: raw.slug as string | undefined,
      };

      setFrontmatter(parsedFrontmatter);
      setContent(data.content);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to load post: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Track changes
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
    setSaveStatus('idle');
  }, []);

  const handleFrontmatterChange = useCallback((newFrontmatter: Frontmatter) => {
    setFrontmatter(newFrontmatter);
    setHasChanges(true);
    setSaveStatus('idle');
  }, []);

  // Build frontmatter object for saving (preserves all existing fields)
  const buildFrontmatterForSave = useCallback(() => {
    const fm: Record<string, unknown> = {};

    // Include all frontmatter fields
    if (frontmatter.title) fm.title = frontmatter.title;
    if (frontmatter.description) fm.description = frontmatter.description;
    if (frontmatter.id) fm.id = frontmatter.id;
    if (frontmatter.no !== undefined) fm.no = frontmatter.no;
    if (frontmatter.order !== undefined) fm.order = frontmatter.order;
    if (frontmatter.category) fm.category = frontmatter.category;
    if (frontmatter.subCategory) fm.subCategory = frontmatter.subCategory;
    if (frontmatter.tags && frontmatter.tags.length > 0) fm.tags = frontmatter.tags;
    if (frontmatter.created) fm.created = frontmatter.created;
    // updated will be set automatically by updatePost
    if (frontmatter.slug) fm.slug = frontmatter.slug;

    return fm;
  }, [frontmatter]);

  const handleSave = useCallback(async () => {
    if (!post) return;

    if (!frontmatter.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');

    try {
      const result = await updatePost(
        path,
        buildFrontmatterForSave(),
        content,
        post.sha,
        `Update ${frontmatter.title}`
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to update post');
      }

      // Update SHA for next save
      setPost({ ...post, sha: result.sha! });
      setSaveStatus('saved');
      setLastSaved(new Date());
      setHasChanges(false);
      toast.success('Post updated successfully!');
    } catch (err) {
      setSaveStatus('error');
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to update post: ${message}`);
    } finally {
      setSaving(false);
    }
  }, [post, frontmatter, path, content, buildFrontmatterForSave]);

  // Autosave functionality
  useEffect(() => {
    if (hasChanges && post && !saving) {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }

      autosaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, AUTOSAVE_DELAY);
    }

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [hasChanges, post, saving, handleSave]);

  const handleDelete = async () => {
    if (!post) return;

    if (!confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);

    try {
      const result = await deletePost(path, post.sha);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete post');
      }

      toast.success('Post deleted successfully!');
      router.push('/admin/posts');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to delete post: ${message}`);
    } finally {
      setDeleting(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!path) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No post path specified</p>
        <Link href="/admin/posts" className="mt-4 text-blue-600 hover:underline">
          Back to posts
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Post not found</p>
        <Link href="/admin/posts" className="mt-4 text-blue-600 hover:underline">
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Post</h1>
            <p className="text-gray-600 dark:text-gray-400">
              <code className="text-sm">{path}</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Save Status */}
          <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} hasChanges={hasChanges} />

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Frontmatter */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Post Settings
            </h2>
            <FrontmatterForm
              frontmatter={frontmatter}
              onChange={handleFrontmatterChange}
              type={post.type}
              onTypeChange={() => {}}
              slug={post.slug}
              onSlugChange={() => {}}
              isEditing
            />
          </div>
        </div>

        {/* Main - Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content</h2>
            <MDXEditor value={content} onChange={handleContentChange} />
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Cmd/Ctrl + S to save • Auto-saves every 30s</span>
              <span>{content.length} characters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveStatusIndicator({
  status,
  lastSaved,
  hasChanges,
}: {
  status: SaveStatus;
  lastSaved: Date | null;
  hasChanges: boolean;
}) {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (status === 'saved' && lastSaved) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="h-4 w-4" />
        <span>Saved at {lastSaved.toLocaleTimeString()}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
        <AlertCircle className="h-4 w-4" />
        <span>Save failed</span>
      </div>
    );
  }

  if (hasChanges) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Clock className="h-4 w-4" />
        <span>Unsaved changes</span>
      </div>
    );
  }

  return null;
}
