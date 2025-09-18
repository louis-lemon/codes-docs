import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Monitor,
  Server,
  Settings,
  Smartphone,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Layers,
  Briefcase,
  Paintbrush,
  PenTool,
  BookOpen,
  Lightbulb,
  GitBranch,
  FileSearch,
  Building,
  Palette,
  Code,
  BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import { getMDXComponents } from '@/mdx-components';
import BlogToc from '@/components/blog-toc';
import ShareButton from '@/components/share-button';

interface BlogPostPageProps {
  page: any;
  relatedPosts: any[];
}

export default function BlogPostPage({ page, relatedPosts }: BlogPostPageProps) {
  const MDXContent = page.data.body;
  const publishDate = page.data.created || page.data.updated;
  const category = page.data.subCategory || 'Etc';

  // Category info with icons
  const categoryInfo = {
    // Main Categories
    'Technology': { name: 'Technology', icon: <Monitor className="h-5 w-5" />, description: 'Technical articles covering frontend, backend, DevOps, mobile development, and AI/ML topics.' },
    'Business': { name: 'Business', icon: <Building className="h-5 w-5" />, description: 'Business insights including strategy, marketing, sales, finance, and HR topics.' },
    'Design': { name: 'Design', icon: <Palette className="h-5 w-5" />, description: 'Design-focused content covering UI/UX, branding, graphics, and prototyping.' },
    'Research': { name: 'Research', icon: <FileSearch className="h-5 w-5" />, description: 'Research articles including user studies, market analysis, competitive research, and academic content.' },
    'Blog': { name: 'Blog', icon: <BookOpen className="h-5 w-5" />, description: 'Personal blog posts including guides, notes, ideas, and learning content.' },

    // Technology Subcategories
    'Frontend': { name: 'Frontend', icon: <Monitor className="h-5 w-5" />, description: 'Frontend development topics including React, Vue, Angular, and modern web technologies.' },
    'Backend': { name: 'Backend', icon: <Server className="h-5 w-5" />, description: 'Backend development covering APIs, databases, server architecture, and system design.' },
    'DevOps': { name: 'DevOps', icon: <Settings className="h-5 w-5" />, description: 'DevOps practices including CI/CD, containerization, deployment, and infrastructure automation.' },
    'Mobile': { name: 'Mobile', icon: <Smartphone className="h-5 w-5" />, description: 'Mobile development for iOS, Android, and cross-platform solutions.' },
    'AI/ML': { name: 'AI/ML', icon: <BrainCircuit className="h-5 w-5" />, description: 'Artificial Intelligence and Machine Learning topics, algorithms, and implementations.' },

    // Business Subcategories
    'Strategy': { name: 'Strategy', icon: <Target className="h-5 w-5" />, description: 'Business strategy, planning, and strategic decision-making processes.' },
    'Marketing': { name: 'Marketing', icon: <TrendingUp className="h-5 w-5" />, description: 'Marketing strategies, digital marketing, content marketing, and growth tactics.' },
    'Sales': { name: 'Sales', icon: <DollarSign className="h-5 w-5" />, description: 'Sales processes, customer acquisition, and revenue generation strategies.' },
    'Finance': { name: 'Finance', icon: <BarChart3 className="h-5 w-5" />, description: 'Financial planning, budgeting, investment strategies, and financial analysis.' },
    'HR': { name: 'HR', icon: <Users className="h-5 w-5" />, description: 'Human resources, team management, recruitment, and organizational development.' },

    // Design Subcategories
    'UI/UX': { name: 'UI/UX', icon: <Layers className="h-5 w-5" />, description: 'User interface and user experience design principles, patterns, and best practices.' },
    'Branding': { name: 'Branding', icon: <Briefcase className="h-5 w-5" />, description: 'Brand identity, visual identity systems, and brand strategy development.' },
    'Graphics': { name: 'Graphics', icon: <Paintbrush className="h-5 w-5" />, description: 'Graphic design, visual communication, and creative design processes.' },
    'Prototype': { name: 'Prototype', icon: <PenTool className="h-5 w-5" />, description: 'Prototyping methods, tools, and iterative design processes.' },

    // Research Subcategories
    'User Research': { name: 'User Research', icon: <Users className="h-5 w-5" />, description: 'User research methodologies, usability testing, and user behavior analysis.' },
    'Market Analysis': { name: 'Market Analysis', icon: <BarChart3 className="h-5 w-5" />, description: 'Market research, industry analysis, and market trend identification.' },
    'Competitor Analysis': { name: 'Competitor Analysis', icon: <Target className="h-5 w-5" />, description: 'Competitive analysis, benchmarking, and competitive intelligence gathering.' },
    'Academic': { name: 'Academic', icon: <BookOpen className="h-5 w-5" />, description: 'Academic research, scholarly articles, and theoretical foundations.' },

    // Blog Subcategories
    'User Guide': { name: 'User Guide', icon: <BookOpen className="h-5 w-5" />, description: 'Step-by-step guides and tutorials for users and developers.' },
    'Notes': { name: 'Notes', icon: <PenTool className="h-5 w-5" />, description: 'Personal notes, quick thoughts, and informal documentation.' },
    'Ideas': { name: 'Ideas', icon: <Lightbulb className="h-5 w-5" />, description: 'Creative ideas, brainstorming, and conceptual thinking.' },
    'Journal': { name: 'Journal', icon: <Calendar className="h-5 w-5" />, description: 'Personal journal entries, reflections, and periodic updates.' },
    'Technical': { name: 'Technical', icon: <Code className="h-5 w-5" />, description: 'Technical deep-dives, code explanations, and engineering insights.' },
    'Learning': { name: 'Learning', icon: <BookOpen className="h-5 w-5" />, description: 'Learning experiences, educational content, and knowledge sharing.' },
    'API': { name: 'API', icon: <GitBranch className="h-5 w-5" />, description: 'API documentation, integration guides, and technical specifications.' },
    'Process': { name: 'Process', icon: <Settings className="h-5 w-5" />, description: 'Process documentation, workflows, and operational procedures.' },

    // Fallback
    'Other': { name: 'Other', icon: <BookOpen className="h-5 w-5" />, description: 'Miscellaneous content that doesn\'t fit into other categories.' }
  }

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
                <RelatedArticleCard key={post.url} post={post} categoryInfo={categoryInfo} />
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

function RelatedArticleCard({ post, categoryInfo }: { post: any; categoryInfo: any }) {
  const publishDate = post.data.created || post.data.updated;
  // For Blog category, use subCategory as the category display
  const category = post.data.category === 'Blog'
    ? (post.data.subCategory || 'Other')
    : (post.data.category || post.data.subCategory || 'AI')

  // Get the appropriate icon from categoryInfo
  const info = categoryInfo[category] || categoryInfo['Other']

  return (
    <Link
      href={post.url}
      className="card block font-normal group relative my-2 rounded-2xl bg-white dark:bg-fd-card border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 overflow-hidden w-full cursor-pointer transition-all h-full"
    >
      <div className="px-5 py-4 relative h-full flex flex-col">
        <div className="absolute text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary-light top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M7 7h10v10"></path>
            <path d="M7 17 17 7"></path>
          </svg>
        </div>
        <div className="h-6 w-6 mb-3 text-gray-700 dark:text-gray-300">
          {info.icon}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-xs text-primary dark:text-primary-light mb-2 font-medium">
            {category.toUpperCase()}
          </div>
          <h2 className="not-prose font-semibold text-base text-gray-800 dark:text-white mt-2">
            {post.data.title}
          </h2>
          <div className="mt-1 font-normal text-sm leading-6 text-gray-600 dark:text-gray-400 flex-1">
            <span className="line-clamp-3">{post.data.description}</span>
          </div>
          {publishDate && (
            <div className="mt-auto pt-3 text-xs text-gray-500 dark:text-gray-500">
              {new Date(publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
