'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Eye, Code } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/admin/auth-provider';
import { MDXEditor } from '@/components/admin/mdx-editor';
import { FrontmatterForm, type Frontmatter } from '@/components/admin/frontmatter-form';
import { createPost } from '@/lib/github-client';

const DEFAULT_CONTENT = `# Getting Started

Write your content here using MDX syntax.

## Features

- **Bold text** and *italic text*
- \`inline code\` and code blocks
- Lists and tables
- And much more!

\`\`\`typescript
// Code example
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
`;

export default function NewPostPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [type, setType] = useState<'docs' | 'blog'>('docs');
  const [slug, setSlug] = useState('');
  const [folder, setFolder] = useState('');
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({
    title: '',
    description: '',
  });
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSave = async () => {
    if (!frontmatter.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!slug.trim()) {
      setError('Slug is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const path = folder
        ? `${type}/${folder}/${slug}.mdx`
        : `${type}/${slug}.mdx`;

      const result = await createPost(
        path,
        {
          title: frontmatter.title,
          description: frontmatter.description || undefined,
        },
        content,
        `Create ${frontmatter.title}`
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to create post');
      }

      router.push('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              New Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create new content for your site
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {previewMode ? (
              <>
                <Code className="h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Publish
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

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
              onChange={setFrontmatter}
              type={type}
              onTypeChange={setType}
              slug={slug}
              onSlugChange={setSlug}
              folder={folder}
              onFolderChange={setFolder}
            />
          </div>
        </div>

        {/* Main - Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Content
            </h2>
            {previewMode ? (
              <div className="prose dark:prose-invert max-w-none p-4 min-h-[500px] border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Preview mode - MDX rendering coming soon
                </p>
                <pre className="text-sm">{content}</pre>
              </div>
            ) : (
              <MDXEditor value={content} onChange={setContent} height="500px" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
