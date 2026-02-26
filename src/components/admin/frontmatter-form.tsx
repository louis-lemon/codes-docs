'use client';

import { useState, useCallback, useEffect } from 'react';
import { BookOpen, FileText, X, Plus, Tag, Hash, Layers } from 'lucide-react';

/**
 * Frontmatter structure matching existing blog format
 */
export interface Frontmatter {
  title: string;
  description: string;
  id?: string;
  no?: number;
  order?: number;
  category?: string;
  subCategory?: string;
  tags?: string[];
  created?: string;
  updated?: string;
  slug?: string;
}

// Predefined categories based on existing content
const BLOG_CATEGORIES = ['Blog', 'Tutorial', 'News'];
const BLOG_SUB_CATEGORIES = ['Ideas', 'User Guide', 'Technical', 'Announcement', 'Tips'];
const DOCS_CATEGORIES = ['Technology', 'Guide', 'Reference', 'API'];
const DOCS_SUB_CATEGORIES = ['Backend', 'Frontend', 'Infrastructure', 'DevOps', 'Database'];

interface FrontmatterFormProps {
  frontmatter: Frontmatter;
  onChange: (frontmatter: Frontmatter) => void;
  type: 'docs' | 'blog';
  onTypeChange: (type: 'docs' | 'blog') => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  folder?: string;
  onFolderChange?: (folder: string) => void;
  isEditing?: boolean;
}

export function FrontmatterForm({
  frontmatter,
  onChange,
  type,
  onTypeChange,
  slug,
  onSlugChange,
  folder = '',
  onFolderChange,
  isEditing = false,
}: FrontmatterFormProps) {
  const [tagInput, setTagInput] = useState('');

  const handleChange = useCallback(
    (field: keyof Frontmatter, value: string | string[] | number | boolean | null | undefined) => {
      onChange({ ...frontmatter, [field]: value });
    },
    [frontmatter, onChange]
  );

  // Auto-generate ID when creating new post
  useEffect(() => {
    if (!isEditing && !frontmatter.id) {
      // Generate a new ID like C340
      const newId = `C${Date.now().toString().slice(-3)}`;
      const newNo = parseInt(newId.slice(1));
      onChange({
        ...frontmatter,
        id: newId,
        no: newNo,
        order: newNo,
        category: type === 'blog' ? 'Blog' : 'Technology',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, type]);

  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !frontmatter.tags?.includes(trimmedTag)) {
      const newTags = [...(frontmatter.tags || []), trimmedTag];
      handleChange('tags', newTags);
      setTagInput('');
    }
  }, [tagInput, frontmatter.tags, handleChange]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      const newTags = (frontmatter.tags || []).filter((tag) => tag !== tagToRemove);
      handleChange('tags', newTags.length > 0 ? newTags : undefined);
    },
    [frontmatter.tags, handleChange]
  );

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      } else if (e.key === 'Backspace' && !tagInput && frontmatter.tags?.length) {
        const newTags = frontmatter.tags.slice(0, -1);
        handleChange('tags', newTags.length > 0 ? newTags : undefined);
      }
    },
    [tagInput, frontmatter.tags, handleAddTag, handleChange]
  );

  // Auto-generate slug from title (only for new posts)
  const handleTitleChange = useCallback(
    (title: string) => {
      handleChange('title', title);
      if (!isEditing && title) {
        const generatedSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9가-힣\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 50);
        onSlugChange(generatedSlug);
      }
    },
    [handleChange, isEditing, onSlugChange]
  );

  return (
    <div className="space-y-4">
      {/* Content Type */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content Type
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onTypeChange('docs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                type === 'docs'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Docs
            </button>
            <button
              type="button"
              onClick={() => onTypeChange('blog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                type === 'blog'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              Blog
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={frontmatter.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter post title"
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={frontmatter.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description for SEO and previews"
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* ID & Order */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              ID
            </span>
          </label>
          <input
            type="text"
            id="id"
            value={frontmatter.id || ''}
            onChange={(e) => handleChange('id', e.target.value)}
            placeholder="C317"
            disabled={isEditing}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Order
          </label>
          <input
            type="number"
            id="order"
            value={frontmatter.order || ''}
            onChange={(e) => handleChange('order', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="317"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category & SubCategory */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Category
            </span>
          </label>
          <select
            id="category"
            value={frontmatter.category || (type === 'blog' ? 'Blog' : 'Technology')}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(type === 'blog' ? BLOG_CATEGORIES : DOCS_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            SubCategory
          </label>
          <select
            id="subCategory"
            value={frontmatter.subCategory || ''}
            onChange={(e) => handleChange('subCategory', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {(type === 'blog' ? BLOG_SUB_CATEGORIES : DOCS_SUB_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <span className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" />
            Tags
          </span>
        </label>
        <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 min-h-[42px]">
          {frontmatter.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-1 flex-1 min-w-[120px]">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={frontmatter.tags?.length ? '' : 'Add tags...'}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
            {tagInput && (
              <button
                type="button"
                onClick={handleAddTag}
                className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Press Enter to add</p>
      </div>


      {/* Folder (for new posts) */}
      {!isEditing && onFolderChange && type === 'docs' && (
        <div>
          <label htmlFor="folder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Folder (optional)
          </label>
          <input
            type="text"
            id="folder"
            value={folder}
            onChange={(e) => onFolderChange(e.target.value)}
            placeholder="e.g., getting-started, guides"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          placeholder="url-friendly-name"
          disabled={isEditing}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          required
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          File: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
            {type}/{folder && type === 'docs' ? `${folder}/` : ''}{slug || 'slug'}.{type === 'blog' ? 'md' : 'mdx'}
          </code>
        </p>
      </div>

      {/* Timestamps (read-only for editing) */}
      {isEditing && frontmatter.created && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {new Date(frontmatter.created).toLocaleString()}
            </div>
            {frontmatter.updated && (
              <div>
                <span className="font-medium">Updated:</span>{' '}
                {new Date(frontmatter.updated).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
