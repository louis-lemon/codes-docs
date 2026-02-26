'use client';

import { getToken } from './auth-client';
import { siteConfig } from '@/config';
import type { PostListItem, Post } from '@/types/admin';

/**
 * Client-side GitHub API utility
 * Makes direct calls to GitHub API from the browser
 */

// Repository configuration from site config
export const GITHUB_CONFIG = {
  owner: siteConfig.github.owner,
  repo: siteConfig.github.repo,
  branch: siteConfig.github.branch,
  contentPath: siteConfig.github.contentPath,
};

/**
 * Parse frontmatter from MDX/MD content
 * Handles YAML format including multi-line arrays
 */
export function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, frontmatterStr, body] = match;
  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterStr.split('\n');

  let currentKey: string | null = null;
  let currentArray: string[] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this is an array item (starts with "  - ")
    if (line.match(/^\s+-\s+/)) {
      if (currentKey && currentArray !== null) {
        const value = line.replace(/^\s+-\s+/, '').trim();
        currentArray.push(value);
      }
      continue;
    }

    // If we were building an array, save it
    if (currentKey && currentArray !== null) {
      frontmatter[currentKey] = currentArray;
      currentKey = null;
      currentArray = null;
    }

    // Parse key: value
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      let key = line.slice(0, colonIndex).trim();
      // Handle quoted keys like "no"
      if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
      }

      let value = line.slice(colonIndex + 1).trim();

      // Check if this starts an array (empty value followed by array items)
      if (value === '' && i + 1 < lines.length && lines[i + 1].match(/^\s+-\s+/)) {
        currentKey = key;
        currentArray = [];
        continue;
      }

      // Handle quoted strings
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle boolean
      if (value === 'true') {
        frontmatter[key] = true;
      } else if (value === 'false') {
        frontmatter[key] = false;
      } else if (value === 'null') {
        frontmatter[key] = null;
      } else if (!isNaN(Number(value)) && value !== '') {
        frontmatter[key] = Number(value);
      } else {
        frontmatter[key] = value;
      }
    }
  }

  // Don't forget the last array if any
  if (currentKey && currentArray !== null) {
    frontmatter[currentKey] = currentArray;
  }

  return { frontmatter, body: body.trim() };
}

/**
 * Serialize frontmatter to YAML string (matching existing blog format)
 */
export function serializeFrontmatter(frontmatter: Record<string, unknown>): string {
  const lines: string[] = [];

  // Define field order to match existing blog format
  const fieldOrder = [
    'title', 'description', 'id', 'no', 'order', 'category', 'subCategory',
    'tags', 'created', 'updated', 'slug'
  ];

  const processedKeys = new Set<string>();

  // Process fields in order
  for (const key of fieldOrder) {
    if (key in frontmatter) {
      const line = formatYamlValue(key, frontmatter[key]);
      if (line) lines.push(line);
      processedKeys.add(key);
    }
  }

  // Process remaining fields
  for (const [key, value] of Object.entries(frontmatter)) {
    if (!processedKeys.has(key)) {
      const line = formatYamlValue(key, value);
      if (line) lines.push(line);
    }
  }

  return `---\n${lines.join('\n')}\n---`;
}

function formatYamlValue(key: string, value: unknown): string | null {
  if (value === undefined || value === '') return null;

  // Handle "no" key with quotes (as in existing format)
  const yamlKey = key === 'no' ? '"no"' : key;

  if (value === null) {
    return `${yamlKey}: null`;
  }

  if (typeof value === 'boolean') {
    return `${yamlKey}: ${value}`;
  }

  if (typeof value === 'number') {
    return `${yamlKey}: ${value}`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    // Format as YAML multi-line array
    const items = value.map((v) => `  - ${v}`).join('\n');
    return `${yamlKey}:\n${items}`;
  }

  if (typeof value === 'string') {
    // Quote strings that contain special characters or look like dates
    if (
      value.includes(':') ||
      value.includes('#') ||
      value.includes('\n') ||
      value.includes('"') ||
      value.match(/^\d{4}-\d{2}-\d{2}/)
    ) {
      return `${yamlKey}: "${value.replace(/"/g, '\\"')}"`;
    }
    return `${yamlKey}: ${value}`;
  }

  return `${yamlKey}: ${JSON.stringify(value)}`;
}

/**
 * GitHub API fetch wrapper
 */
async function githubFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response;
}

/**
 * List all posts from GitHub
 */
export async function listPosts(type?: 'docs' | 'blog'): Promise<PostListItem[]> {
  const posts: PostListItem[] = [];
  const directories = type ? [type] : ['docs', 'blog'];

  for (const dir of directories) {
    await fetchDirectory(dir, dir as 'docs' | 'blog', posts);
  }

  return posts;
}

async function fetchDirectory(
  path: string,
  type: 'docs' | 'blog',
  posts: PostListItem[]
): Promise<void> {
  try {
    const response = await githubFetch(
      `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.contentPath}/${path}?ref=${GITHUB_CONFIG.branch}`
    );

    if (!response.ok) return;

    const files = await response.json();

    for (const file of files) {
      if (file.type === 'dir') {
        await fetchDirectory(`${path}/${file.name}`, type, posts);
      } else if (
        (file.name.endsWith('.mdx') || file.name.endsWith('.md')) &&
        !file.name.startsWith('_') &&
        file.name !== 'index.md' &&
        file.name !== 'index.mdx'
      ) {
        // Fetch file content to get frontmatter
        const contentResponse = await githubFetch(
          `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${file.path}?ref=${GITHUB_CONFIG.branch}`
        );

        if (contentResponse.ok) {
          const data = await contentResponse.json();
          const content = atob(data.content);
          const { frontmatter } = parseFrontmatter(content);
          const ext = file.name.endsWith('.mdx') ? '.mdx' : '.md';

          posts.push({
            path: file.path.replace(`${GITHUB_CONFIG.contentPath}/`, ''),
            slug: file.name.replace(ext, ''),
            type,
            title: (frontmatter.title as string) || file.name.replace(ext, ''),
            description: frontmatter.description as string | undefined,
            tags: frontmatter.tags as string[] | undefined,
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching directory ${path}:`, error);
  }
}

/**
 * Get a single post with full frontmatter
 */
export async function getPost(path: string): Promise<Post | null> {
  try {
    const response = await githubFetch(
      `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.contentPath}/${path}?ref=${GITHUB_CONFIG.branch}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const rawContent = atob(data.content);
    const { frontmatter, body } = parseFrontmatter(rawContent);

    const type = path.startsWith('blog/') ? 'blog' : 'docs';
    const fileName = path.split('/').pop() || '';
    const ext = fileName.endsWith('.mdx') ? '.mdx' : '.md';

    return {
      path,
      slug: fileName.replace(ext, ''),
      type,
      title: (frontmatter.title as string) || '',
      description: frontmatter.description as string | undefined,
      content: body,
      frontmatter: rawContent.match(/^---\n([\s\S]*?)\n---/)?.[1] || '',
      rawFrontmatter: frontmatter, // Pass the parsed frontmatter object
      sha: data.sha,
    };
  } catch (error) {
    console.error(`Error getting post ${path}:`, error);
    return null;
  }
}

/**
 * Create a new post
 */
export async function createPost(
  path: string,
  frontmatter: Record<string, unknown>,
  content: string,
  message?: string
): Promise<{ success: boolean; sha?: string; error?: string }> {
  const fileContent = `${serializeFrontmatter(frontmatter)}\n\n${content}`;
  const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

  try {
    const response = await githubFetch(
      `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.contentPath}/${path}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          message: message || `Create ${path}`,
          content: encodedContent,
          branch: GITHUB_CONFIG.branch,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, sha: data.content?.sha };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  path: string,
  frontmatter: Record<string, unknown>,
  content: string,
  sha: string,
  message?: string
): Promise<{ success: boolean; sha?: string; error?: string }> {
  // Update the 'updated' timestamp
  const updatedFrontmatter = {
    ...frontmatter,
    updated: new Date().toISOString(),
  };

  const fileContent = `${serializeFrontmatter(updatedFrontmatter)}\n\n${content}`;
  const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

  try {
    const response = await githubFetch(
      `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.contentPath}/${path}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          message: message || `Update ${path}`,
          content: encodedContent,
          sha,
          branch: GITHUB_CONFIG.branch,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, sha: data.content?.sha };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a post
 */
export async function deletePost(
  path: string,
  sha: string,
  message?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await githubFetch(
      `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.contentPath}/${path}`,
      {
        method: 'DELETE',
        body: JSON.stringify({
          message: message || `Delete ${path}`,
          sha,
          branch: GITHUB_CONFIG.branch,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
