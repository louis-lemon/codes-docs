'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  LayoutGrid,
  List,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/admin/auth-provider';
import { listPosts, getPost, deletePost as deletePostApi } from '@/lib/github-client';
import type { PostListItem } from '@/types/admin';

type ViewMode = 'grid' | 'list';

export default function BlogPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [deletingPath, setDeletingPath] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listPosts('blog');
      setPosts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch posts';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.path.toLowerCase().includes(search.toLowerCase()) ||
      post.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (post: PostListItem) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    setDeletingPath(post.path);

    try {
      const fullPost = await getPost(post.path);
      if (!fullPost) {
        throw new Error('Failed to get post');
      }

      const result = await deletePostApi(post.path, fullPost.sha);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete');
      }

      toast.success(`"${post.title}" deleted successfully`);
      fetchPosts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete';
      toast.error(message);
    } finally {
      setDeletingPath(null);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-green-600" />
            Blog Posts
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {posts.length} posts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </div>
      </div>

      {/* Search & View Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button onClick={fetchPosts} className="mt-3 text-sm text-red-700 hover:underline">
            Try again
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState search={search} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.path}
              post={post}
              onDelete={() => handleDelete(post)}
              isDeleting={deletingPath === post.path}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPosts.map((post) => (
            <PostRow
              key={post.path}
              post={post}
              onDelete={() => handleDelete(post)}
              isDeleting={deletingPath === post.path}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {search ? 'No posts found' : 'No posts yet'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {search ? `No posts match "${search}"` : 'Create your first blog post'}
      </p>
      {!search && (
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Link>
      )}
    </div>
  );
}

function PostCard({
  post,
  onDelete,
  isDeleting,
}: {
  post: PostListItem;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-2">
              <FileText className="h-3 w-3" />
              blog
            </span>
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {post.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/admin/posts/edit?path=${encodeURIComponent(post.path)}`}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {post.description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.description}</p>
        )}
      </div>
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
        <code className="text-xs text-gray-500 truncate block">{post.path}</code>
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Tag className="h-3 w-3 text-gray-400" />
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-xs rounded">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <Link href={`/admin/posts/edit?path=${encodeURIComponent(post.path)}`} className="absolute inset-0 z-0" />
    </div>
  );
}

function PostRow({
  post,
  onDelete,
  isDeleting,
}: {
  post: PostListItem;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <FileText className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/admin/posts/edit?path=${encodeURIComponent(post.path)}`}
          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 truncate block"
        >
          {post.title}
        </Link>
        <code className="text-xs text-gray-500">{post.path}</code>
      </div>
      <div className="flex items-center gap-1">
        <Link
          href={`/admin/posts/edit?path=${encodeURIComponent(post.path)}`}
          className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Edit className="h-4 w-4" />
        </Link>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
