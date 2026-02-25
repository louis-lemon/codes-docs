'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Eye, Code, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/admin/auth-provider';
import { MDXEditor } from '@/components/admin/mdx-editor';
import { FrontmatterForm, type Frontmatter } from '@/components/admin/frontmatter-form';
import { getPost, updatePost, deletePost } from '@/lib/github-client';
import type { Post } from '@/types/admin';

interface PageProps {
  params: Promise<{ path: string[] }>;
}

export default function EditPostPage({ params }: PageProps) {
  const { path: pathSegments } = use(params);
  const path = pathSegments.join('/');
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [post, setPost] = useState<Post | null>(null);
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({
    title: '',
    description: '',
  });
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPost();
    }
  }, [path, isAuthenticated]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPost(path);

      if (!data) {
        throw new Error('Post not found');
      }

      setPost(data);
      setFrontmatter({
        title: data.title,
        description: data.description || '',
      });
      setContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!post) return;

    if (!frontmatter.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await updatePost(
        path,
        {
          title: frontmatter.title,
          description: frontmatter.description || undefined,
        },
        content,
        post.sha,
        `Update ${frontmatter.title}`
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to update post');
      }

      // Update SHA for next save
      setPost({ ...post, sha: result.sha! });

      alert('Post updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    if (!confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const result = await deletePost(path, post.sha);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete post');
      }

      router.push('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              <code className="text-sm">{path}</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
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
            Save
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
