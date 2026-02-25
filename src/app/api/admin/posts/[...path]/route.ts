import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPost, updatePost, deletePost } from '@/lib/github';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

/**
 * GET /api/admin/posts/[...path]
 * Get a single post by path
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path: pathSegments } = await params;
  const path = pathSegments.join('/');

  try {
    const post = await getPost(session.accessToken, path);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error getting post:', error);
    return NextResponse.json(
      { error: 'Failed to get post' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/posts/[...path]
 * Update an existing post
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path: pathSegments } = await params;
  const path = pathSegments.join('/');

  try {
    const body = await request.json();
    const { frontmatter, content, sha, message } = body;

    if (!frontmatter?.title || content === undefined || !sha) {
      return NextResponse.json(
        { error: 'Missing required fields: frontmatter.title, content, sha' },
        { status: 400 }
      );
    }

    const result = await updatePost(
      session.accessToken,
      path,
      frontmatter,
      content,
      sha,
      message
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, sha: result.sha });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/posts/[...path]
 * Delete a post
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path: pathSegments } = await params;
  const path = pathSegments.join('/');

  try {
    const { searchParams } = new URL(request.url);
    const sha = searchParams.get('sha');
    const message = searchParams.get('message');

    if (!sha) {
      return NextResponse.json(
        { error: 'Missing required parameter: sha' },
        { status: 400 }
      );
    }

    const result = await deletePost(
      session.accessToken,
      path,
      sha,
      message || undefined
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
