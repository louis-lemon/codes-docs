import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listPosts, createPost } from '@/lib/github';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/posts
 * List all posts (optionally filtered by type)
 */
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'docs' | 'blog' | null;

  try {
    const posts = await listPosts(session.accessToken, type || undefined);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error listing posts:', error);
    return NextResponse.json(
      { error: 'Failed to list posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/posts
 * Create a new post
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { path, frontmatter, content, message } = body;

    if (!path || !frontmatter?.title || content === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: path, frontmatter.title, content' },
        { status: 400 }
      );
    }

    // Validate path format
    if (!path.endsWith('.mdx')) {
      return NextResponse.json(
        { error: 'Path must end with .mdx' },
        { status: 400 }
      );
    }

    if (!path.startsWith('docs/') && !path.startsWith('blog/')) {
      return NextResponse.json(
        { error: 'Path must start with docs/ or blog/' },
        { status: 400 }
      );
    }

    const result = await createPost(
      session.accessToken,
      path,
      frontmatter,
      content,
      message
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, sha: result.sha });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
