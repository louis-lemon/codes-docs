'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/components/admin/auth-provider';
import { MDXEditor } from '@/components/admin/mdx-editor';
import { FrontmatterForm, type Frontmatter } from '@/components/admin/frontmatter-form';
import { createPost } from '@/lib/github-client';

const DEFAULT_CONTENT = `# Getting Started

Write your documentation here using MDX syntax.

## Overview

Describe the main concepts.

## Usage

\`\`\`typescript
// Code example
const example = "Hello, World!";
\`\`\`

## API Reference

Document your API here.
`;

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function NewDocPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [slug, setSlug] = useState('');
  const [folder, setFolder] = useState('');
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({
    title: '',
    description: '',
  });
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [hasChanges, setHasChanges] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

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

  const buildFrontmatterForSave = useCallback(() => {
    const fm: Record<string, unknown> = {};
    if (frontmatter.title) fm.title = frontmatter.title;
    if (frontmatter.description) fm.description = frontmatter.description;
    if (frontmatter.id) fm.id = frontmatter.id;
    if (frontmatter.no !== undefined) fm.no = frontmatter.no;
    if (frontmatter.order !== undefined) fm.order = frontmatter.order;
    if (frontmatter.category) fm.category = frontmatter.category;
    if (frontmatter.subCategory) fm.subCategory = frontmatter.subCategory;
    if (frontmatter.tags && frontmatter.tags.length > 0) fm.tags = frontmatter.tags;
    if (frontmatter.created) fm.created = frontmatter.created;
    if (frontmatter.updated) fm.updated = frontmatter.updated;
    if (frontmatter.slug) fm.slug = frontmatter.slug;
    return fm;
  }, [frontmatter]);

  const handleSave = useCallback(async () => {
    if (!frontmatter.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');

    try {
      const path = folder
        ? `docs/${folder}/${slug}.mdx`
        : `docs/${slug}.mdx`;

      const result = await createPost(
        path,
        buildFrontmatterForSave(),
        content,
        `Create ${frontmatter.title}`
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to create doc');
      }

      setSaveStatus('saved');
      setLastSaved(new Date());
      setHasChanges(false);
      toast.success('Document created successfully!');
      router.push('/admin/docs');
    } catch (err) {
      setSaveStatus('error');
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to create doc: ${message}`);
    } finally {
      setSaving(false);
    }
  }, [frontmatter, slug, folder, content, buildFrontmatterForSave, router]);

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

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/docs"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Document</h1>
            <p className="text-gray-600 dark:text-gray-400">Create new documentation</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} hasChanges={hasChanges} />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Document Settings</h2>
            <FrontmatterForm
              frontmatter={frontmatter}
              onChange={handleFrontmatterChange}
              type="docs"
              onTypeChange={() => {}}
              slug={slug}
              onSlugChange={setSlug}
              folder={folder}
              onFolderChange={setFolder}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content</h2>
            <MDXEditor value={content} onChange={handleContentChange} />
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Tip: Use Cmd/Ctrl + S to save</span>
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
