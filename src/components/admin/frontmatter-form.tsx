'use client';

import { BookOpen, FileText } from 'lucide-react';

export interface Frontmatter {
  title: string;
  description: string;
  icon?: string;
}

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
  const handleChange = (field: keyof Frontmatter, value: string) => {
    onChange({ ...frontmatter, [field]: value });
  };

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
              Documentation
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
              Blog Post
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={frontmatter.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter post title"
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
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

      {/* Folder (for new posts) */}
      {!isEditing && onFolderChange && (
        <div>
          <label
            htmlFor="folder"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
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
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Organize content in subfolders
          </p>
        </div>
      )}

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          placeholder="url-friendly-name"
          disabled={isEditing}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          required
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          File path: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{type}/{folder ? `${folder}/` : ''}{slug || 'slug'}.mdx</code>
        </p>
      </div>
    </div>
  );
}
