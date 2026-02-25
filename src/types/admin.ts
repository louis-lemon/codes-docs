/**
 * Admin CMS Types
 */

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
}

export interface PostCreateInput {
  /** File path relative to content/ */
  path: string;
  /** Frontmatter as object */
  frontmatter: {
    title: string;
    description?: string;
    [key: string]: unknown;
  };
  /** MDX content (without frontmatter) */
  content: string;
  /** Commit message */
  message?: string;
}

export interface PostUpdateInput {
  /** File path relative to content/ */
  path: string;
  /** Frontmatter as object */
  frontmatter: {
    title: string;
    description?: string;
    [key: string]: unknown;
  };
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
