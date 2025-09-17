import { blog } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import BlogListPage from '@/components/blog-list-page';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  
  // If no slug, show blog list page
  if (!params.slug || params.slug.length === 0) {
    return <BlogListPage />;
  }
  
  // Get individual blog post
  const page = blog.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(blog, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  // Generate params for all blog posts + empty for blog list page
  return [
    { slug: [] }, // This generates /blog (blog list page)
    ...blog.generateParams(),
  ];
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  
  // Default metadata for blog list page
  if (!params.slug || params.slug.length === 0) {
    return {
      title: 'Blog',
      description: 'AI 인사이트 블로그 - 인공지능, 머신러닝, 딥러닝의 최신 동향과 실용적인 인사이트',
    };
  }

  // Metadata for individual blog posts
  const page = blog.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    keywords: page.data.tags,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: 'article',
      publishedTime: page.data.created,
      modifiedTime: page.data.updated,
      tags: page.data.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
    },
  };
}