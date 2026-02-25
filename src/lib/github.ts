import { Octokit } from '@octokit/rest';
import type { PostListItem, Post, GitHubFile } from '@/types/admin';

/**
 * GitHub API utility functions for CMS operations
 */

const CONTENT_PATH = 'content';

interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
}

function getConfig(): GitHubConfig {
  return {
    owner: process.env.GITHUB_OWNER!,
    repo: process.env.GITHUB_REPO!,
    branch: process.env.GITHUB_BRANCH || 'main',
  };
}

function createOctokit(accessToken: string): Octokit {
  return new Octokit({ auth: accessToken });
}

/**
 * Parse frontmatter from MDX content
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

  // Simple YAML parsing for common fields
  frontmatterStr.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  });

  return { frontmatter, body: body.trim() };
}

/**
 * Serialize frontmatter to YAML string
 */
export function serializeFrontmatter(frontmatter: Record<string, unknown>): string {
  const lines = Object.entries(frontmatter)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (typeof value === 'string') {
        // Quote strings that contain special characters
        if (value.includes(':') || value.includes('#') || value.includes('\n')) {
          return `${key}: "${value.replace(/"/g, '\\"')}"`;
        }
        return `${key}: ${value}`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    });

  return `---\n${lines.join('\n')}\n---`;
}

/**
 * List all MDX files in a directory
 */
export async function listPosts(
  accessToken: string,
  type?: 'docs' | 'blog'
): Promise<PostListItem[]> {
  const octokit = createOctokit(accessToken);
  const config = getConfig();
  const posts: PostListItem[] = [];

  const directories = type ? [type] : ['docs', 'blog'];

  for (const dir of directories) {
    try {
      const { data } = await octokit.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: `${CONTENT_PATH}/${dir}`,
        ref: config.branch,
      });

      if (Array.isArray(data)) {
        await processDirectory(octokit, config, data, dir as 'docs' | 'blog', posts);
      }
    } catch (error) {
      // Directory might not exist, skip it
      console.error(`Error listing ${dir}:`, error);
    }
  }

  return posts;
}

async function processDirectory(
  octokit: Octokit,
  config: GitHubConfig,
  files: GitHubFile[],
  type: 'docs' | 'blog',
  posts: PostListItem[],
  parentPath = ''
): Promise<void> {
  for (const file of files) {
    if (file.type === 'dir') {
      // Recursively process subdirectories
      try {
        const { data } = await octokit.repos.getContent({
          owner: config.owner,
          repo: config.repo,
          path: file.path,
          ref: config.branch,
        });

        if (Array.isArray(data)) {
          await processDirectory(
            octokit,
            config,
            data as GitHubFile[],
            type,
            posts,
            `${parentPath}${file.name}/`
          );
        }
      } catch (error) {
        console.error(`Error processing directory ${file.path}:`, error);
      }
    } else if ((file.name.endsWith('.mdx') || file.name.endsWith('.md')) && !file.name.startsWith('_')) {
      // Process MDX/MD files (skip templates starting with _)
      // Also skip index.md files (they are section landing pages)
      if (file.name === 'index.md' || file.name === 'index.mdx') continue;

      try {
        const { data } = await octokit.repos.getContent({
          owner: config.owner,
          repo: config.repo,
          path: file.path,
          ref: config.branch,
        });

        if ('content' in data && data.content) {
          const content = Buffer.from(data.content, 'base64').toString('utf-8');
          const { frontmatter } = parseFrontmatter(content);
          const ext = file.name.endsWith('.mdx') ? '.mdx' : '.md';

          posts.push({
            path: file.path.replace(`${CONTENT_PATH}/`, ''),
            slug: file.name.replace(ext, ''),
            type,
            title: (frontmatter.title as string) || file.name.replace(ext, ''),
            description: frontmatter.description as string | undefined,
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file.path}:`, error);
      }
    }
  }
}

/**
 * Get a single post by path
 */
export async function getPost(
  accessToken: string,
  path: string
): Promise<Post | null> {
  const octokit = createOctokit(accessToken);
  const config = getConfig();

  try {
    const { data } = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: `${CONTENT_PATH}/${path}`,
      ref: config.branch,
    });

    if ('content' in data && data.content) {
      const rawContent = Buffer.from(data.content, 'base64').toString('utf-8');
      const { frontmatter, body } = parseFrontmatter(rawContent);

      // Determine type from path
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
        sha: data.sha,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error getting post ${path}:`, error);
    return null;
  }
}

/**
 * Create a new post
 */
export async function createPost(
  accessToken: string,
  path: string,
  frontmatter: Record<string, unknown>,
  content: string,
  message?: string
): Promise<{ success: boolean; sha?: string; error?: string }> {
  const octokit = createOctokit(accessToken);
  const config = getConfig();

  const fileContent = `${serializeFrontmatter(frontmatter)}\n\n${content}`;
  const encodedContent = Buffer.from(fileContent).toString('base64');

  try {
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: `${CONTENT_PATH}/${path}`,
      message: message || `Create ${path}`,
      content: encodedContent,
      branch: config.branch,
    });

    return { success: true, sha: data.content?.sha };
  } catch (error) {
    console.error(`Error creating post ${path}:`, error);
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
  accessToken: string,
  path: string,
  frontmatter: Record<string, unknown>,
  content: string,
  sha: string,
  message?: string
): Promise<{ success: boolean; sha?: string; error?: string }> {
  const octokit = createOctokit(accessToken);
  const config = getConfig();

  const fileContent = `${serializeFrontmatter(frontmatter)}\n\n${content}`;
  const encodedContent = Buffer.from(fileContent).toString('base64');

  try {
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: `${CONTENT_PATH}/${path}`,
      message: message || `Update ${path}`,
      content: encodedContent,
      sha,
      branch: config.branch,
    });

    return { success: true, sha: data.content?.sha };
  } catch (error) {
    console.error(`Error updating post ${path}:`, error);
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
  accessToken: string,
  path: string,
  sha: string,
  message?: string
): Promise<{ success: boolean; error?: string }> {
  const octokit = createOctokit(accessToken);
  const config = getConfig();

  try {
    await octokit.repos.deleteFile({
      owner: config.owner,
      repo: config.repo,
      path: `${CONTENT_PATH}/${path}`,
      message: message || `Delete ${path}`,
      sha,
      branch: config.branch,
    });

    return { success: true };
  } catch (error) {
    console.error(`Error deleting post ${path}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
