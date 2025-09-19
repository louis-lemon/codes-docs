import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import { getMDXComponents } from '@/mdx-components';
import BlogToc from '@/components/blog/blog-toc';
import ShareButton from '@/components/common/share-button';
import { categoryInfo } from '@/constants/blog-categories';
import BlogCard from '@/components/blog/blog-card';

interface BlogPostPageProps {
  page: any;
  relatedPosts: any[];
}

export default function BlogPostPage({ page, relatedPosts }: BlogPostPageProps) {
  const MDXContent = page.data.body;
  const publishDate = page.data.created || page.data.updated;
  const category = page.data.subCategory || 'Etc';

  // Category info with icons

  // Use related posts passed from server component

  // Calculate reading time (rough estimation)
  const readingTime = Math.max(1, Math.round((page.data.description || '').length / 1000 * 5));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to articles
        </Link>

        {/* Article header */}
        <header className="mb-8">
          {/* Category */}
          <div className="mb-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {category}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {page.data.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
            {publishDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={publishDate}>
                  {new Date(publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            )}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>EurekaCodes</span>
            </div>
            <div className="ml-auto">
              <ShareButton />
            </div>
          </div>

          {/* Hero Image */}
          {/*<div className="relative h-[400px] rounded-xl overflow-hidden border border-border mb-8">*/}
          {/*  <Image*/}
          {/*    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&h=800&auto=format&fit=crop"*/}
          {/*    alt={page.data.title || "Blog post image"}*/}
          {/*    fill*/}
          {/*    className="object-cover"*/}
          {/*    priority*/}
          {/*  />*/}
          {/*  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>*/}
          {/*</div>*/}

        </header>

        {/* Table of Contents */}
        <div className="mb-8">
          <BlogToc />
        </div>


        {/* Article content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {page.data.description && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {page.data.description}
            </p>
          )}

          <div className="blog-content">
            <MDXContent components={getMDXComponents()} />
          </div>
        </article>

        {/* Tags */}
        {page.data.tags && page.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
            {page.data.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <BlogCard key={post.url} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 text-center text-muted-foreground">
        </footer>
      </div>
    </div>
  );
}

