import type { Metadata } from 'next';
import BlogAllPage from '@/components/blog/blog-all-page';
import BlogSkeletonLoader from '@/components/blog/blog-skeleton-loader';
import { blog } from '@/lib/source';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'All Articles - Blog',
  description: 'Comprehensive collection of AI insights, research, and technical deep-dives from our blog.',
  keywords: ['AI', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Research'],
  openGraph: {
    title: 'All Articles - AI Blog',
    description: 'Comprehensive collection of AI insights, research, and technical deep-dives.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Articles - AI Blog',
    description: 'Comprehensive collection of AI insights, research, and technical deep-dives.',
  },
};

export default function AllArticlesPage() {
  const blogPosts = blog.getPages();

  // Serialize only necessary data for client component
  const serializedPosts = blogPosts.map(post => ({
    url: post.url,
    data: {
      title: post.data.title,
      description: post.data.description,
      id: post.data.id,
      category: post.data.category,
      subCategory: post.data.subCategory,
      tags: post.data.tags,
      created: post.data.created,
      updated: post.data.updated,
      draft: post.data.draft,
      featured: post.data.featured,
    }
  }));

  return (
    <Suspense fallback={<BlogSkeletonLoader />}>
      <BlogAllPage blogPosts={serializedPosts} />
    </Suspense>
  );
}
