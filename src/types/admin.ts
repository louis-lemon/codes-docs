/**
 * Admin CMS Types - Matching existing blog format
 */

/**
 * Extended frontmatter fields matching existing blog format
 */
export interface ExtendedFrontmatter {
  title: string;
  description?: string;
  id?: string;
  no?: number;
  order?: number;
  category?: string;
  subCategory?: string;
  tags?: string[];
  created?: string;
  updated?: string;
  slug?: string;
  /** Additional custom fields */
  [key: string]: unknown;
}

export interface Post {
  /** File path relative to content/ (e.g., "docs/getting-started.mdx") */
  path: string;
  /** File name without extension */
  slug: string;
  /** Content type */
  type: 'docs' | 'blog';
  /** Frontmatter title */
  title: string;
  /** Frontmatter description */
  description?: string;
  /** Raw MDX content (without frontmatter) */
  content: string;
  /** Raw frontmatter as YAML string */
  frontmatter: string;
  /** Parsed frontmatter object */
  rawFrontmatter?: Record<string, unknown>;
  /** Last modified date from Git */
  lastModified?: string;
  /** Git SHA for optimistic locking */
  sha: string;
}

export interface PostListItem {
  path: string;
  slug: string;
  type: 'docs' | 'blog';
  title: string;
  description?: string;
  lastModified?: string;
  /** Tags */
  tags?: string[];
}

export interface PostCreateInput {
  /** File path relative to content/ */
  path: string;
  /** Frontmatter as object */
  frontmatter: ExtendedFrontmatter;
  /** MDX content (without frontmatter) */
  content: string;
  /** Commit message */
  message?: string;
}

export interface PostUpdateInput {
  /** File path relative to content/ */
  path: string;
  /** Frontmatter as object */
  frontmatter: ExtendedFrontmatter;
  /** MDX content (without frontmatter) */
  content: string;
  /** Git SHA for optimistic locking */
  sha: string;
  /** Commit message */
  message?: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  url: string;
  download_url: string | null;
}

export interface GitHubContentResponse {
  name: string;
  path: string;
  sha: string;
  size: number;
  content: string;
  encoding: 'base64';
}

/**
 * Save status for editor autosave feature
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Editor mode for MDX editing
 */
export type EditorMode = 'wysiwyg' | 'source' | 'preview';
