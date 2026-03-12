'use client';

import { useState, useMemo } from 'react';
import { Check, GripVertical, X, Search, Plus } from 'lucide-react';
import type { PostListItem } from '@/types/admin';
import { cn } from '@/lib/utils';

interface PostSelectorProps {
  posts: PostListItem[];
  selectedIds: string[];
  maxSelection?: number;
  onChange: (ids: string[]) => void;
}

export const PostSelector = ({
  posts,
  selectedIds,
  maxSelection = 4,
  onChange,
}: PostSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Get selected posts in order
  const selectedPosts = useMemo(() => {
    return selectedIds
      .map((id) => posts.find((p) => p.path === id))
      .filter((p): p is PostListItem => p !== undefined);
  }, [selectedIds, posts]);

  // Filter available posts (not selected)
  const availablePosts = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return posts
      .filter((p) => !selectedSet.has(p.path))
      .filter((p) =>
        searchQuery
          ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );
  }, [posts, selectedIds, searchQuery]);

  // Add a post to selection
  const handleAdd = (postPath: string) => {
    if (selectedIds.length < maxSelection) {
      onChange([...selectedIds, postPath]);
    }
  };

  // Remove a post from selection
  const handleRemove = (postPath: string) => {
    onChange(selectedIds.filter((id) => id !== postPath));
  };

  // Drag and drop handlers for reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newIds = [...selectedIds];
    const [removed] = newIds.splice(draggedIndex, 1);
    newIds.splice(index, 0, removed);
    onChange(newIds);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Selected Posts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected Posts
          </h4>
          <span
            className={cn(
              'text-xs px-2 py-1 rounded-full',
              selectedIds.length >= maxSelection
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            )}
          >
            {selectedIds.length} / {maxSelection}
          </span>
        </div>

        {selectedPosts.length === 0 ? (
          <div
            className={cn(
              'p-8 border-2 border-dashed rounded-xl text-center',
              'border-gray-200 dark:border-gray-700',
              'text-gray-500 dark:text-gray-400'
            )}
          >
            <p className="text-sm">No posts selected</p>
            <p className="text-xs mt-1">Select posts from the list below</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedPosts.map((post, index) => (
              <div
                key={post.path}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-center gap-3 p-3',
                  'border border-gray-200 dark:border-gray-700 rounded-lg',
                  'bg-white dark:bg-gray-800',
                  'transition-all duration-200',
                  draggedIndex === index && 'shadow-lg ring-2 ring-blue-500 opacity-90'
                )}
              >
                <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <GripVertical className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    'flex-shrink-0 w-6 h-6 rounded-full',
                    'bg-blue-100 dark:bg-blue-900/30',
                    'text-blue-700 dark:text-blue-400',
                    'flex items-center justify-center text-xs font-medium'
                  )}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {post.title}
                  </p>
                  {post.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {post.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(post.path)}
                  className={cn(
                    'flex-shrink-0 p-1.5 rounded-md',
                    'text-gray-400 hover:text-red-600 dark:hover:text-red-400',
                    'hover:bg-red-50 dark:hover:bg-red-900/20',
                    'transition-colors'
                  )}
                  title="Remove from selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Posts */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Available Posts
        </h4>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-lg transition-all duration-200',
              'border bg-white dark:bg-gray-800',
              'text-gray-900 dark:text-white placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500'
            )}
          />
        </div>

        {/* Posts List */}
        <div
          className={cn(
            'border border-gray-200 dark:border-gray-700 rounded-xl',
            'max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700'
          )}
        >
          {availablePosts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">
                {searchQuery ? 'No posts match your search' : 'No more posts available'}
              </p>
            </div>
          ) : (
            availablePosts.map((post) => {
              const isDisabled = selectedIds.length >= maxSelection;
              return (
                <button
                  key={post.path}
                  type="button"
                  onClick={() => handleAdd(post.path)}
                  disabled={isDisabled}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 text-left',
                    'bg-white dark:bg-gray-800',
                    'transition-colors duration-150',
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  )}
                >
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full',
                      'border-2 border-dashed',
                      isDisabled
                        ? 'border-gray-200 dark:border-gray-700'
                        : 'border-gray-300 dark:border-gray-600',
                      'flex items-center justify-center',
                      !isDisabled && 'group-hover:border-blue-400'
                    )}
                  >
                    <Plus
                      className={cn(
                        'h-4 w-4',
                        isDisabled
                          ? 'text-gray-300 dark:text-gray-600'
                          : 'text-gray-400 dark:text-gray-500'
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {post.title}
                    </p>
                    {post.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {post.description}
                      </p>
                    )}
                  </div>
                  {post.type && (
                    <span
                      className={cn(
                        'flex-shrink-0 px-2 py-0.5 text-xs rounded-full',
                        post.type === 'blog'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      )}
                    >
                      {post.type}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
