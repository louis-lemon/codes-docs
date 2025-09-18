import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BrainCircuit,
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  Eye,
  Cpu,
  ExternalLink,
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
  Code
} from "lucide-react"

interface BlogListPageProps {
  blogPosts: any[];
}

export default function BlogListPage({ blogPosts }: BlogListPageProps) {

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

  // Filter and sort posts (show all posts including drafts for development)
  const allPosts = blogPosts
    // .filter(post => !post.data.draft)  // Show drafts for now
    .sort((a, b) => {
      const dateA = new Date(a.data.created || a.data.updated || '').getTime()
      const dateB = new Date(b.data.created || b.data.updated || '').getTime()
      return dateB - dateA // Most recent first
    })

  // Specific featured posts: C135, C136, C138
  const featuredPostIds = ['C329', 'C331']
  const featuredPosts = featuredPostIds
    .map(id => allPosts.find(post => post.data.id === id))
    .filter(Boolean) // Remove any undefined posts

  // All posts for Recent Articles
  const recentPosts = allPosts

  return (
    <main className="flex flex-1 flex-col">
        {/* Blog Hero Section - Distinctive design */}
        <section className="my-12 mx-auto max-w-6xl px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-200">
                From Infrastructure to{' '}
                <span
                  style={{
                    background: 'linear-gradient(102deg, rgb(255, 212, 95) -3.17%, rgb(255, 164, 90) 40.51%, rgb(255, 98, 0) 89.47%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Scalable Microservices
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-normal leading-relaxed">
                Stress-free AI DevOps insights and practical guides for building scalable, modern software architectures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://eureka.codes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-border bg-background text-foreground font-medium hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Try EurekaCodes
                </a>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-background to-muted/20">
              <Image
                src="https://image.lemoncloud.io/codes/landing_img5.png"
                alt="Modern infrastructure visualization showing scalable microservices architecture and DevOps automation"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
          </div>
        </section>

      {/* Featured Posts */}
      <section className="my-12 mx-auto max-w-6xl px-5">
        <p className="text-gray-900 dark:text-gray-200 text-left text-2xl mb-4 font-semibold">
          Featured Articles
        </p>

        <div className="not-prose grid gap-4 sm:grid-cols-3">
              {featuredPosts.map((post, index) => {
                const images = [
                  "https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=600&h=400&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=600&h=400&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&h=400&auto=format&fit=crop"
                ];
                return (
                  <FeaturedCard
                    key={post.url}
                    post={post}
                    image={images[index % images.length]}
                    categoryInfo={categoryInfo}
                  />
                );
              })}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="my-12 mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between mt-10 mb-4">
          <p className="text-gray-900 dark:text-gray-200 text-2xl font-semibold">
            Recent Articles
          </p>
          <Link href="/blog/all" className="text-primary dark:text-primary-light text-sm hover:text-primary/80">
            view all articles
          </Link>
        </div>

        <div className="not-prose grid gap-4 sm:grid-cols-3">
            {recentPosts.map((post, index) => {
              const images = [
                "https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1563630381190-77c336ea545a?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&h=400&auto=format&fit=crop"
              ];
              return (
                <ArticleCard
                  key={post.url}
                  post={post}
                  image={images[index % images.length]}
                  categoryInfo={categoryInfo}
                />
              );
            })}
        </div>
      </section>
    </main>
  )
}

function FeaturedCard({ post, image, categoryInfo }: { post: any; image: string; categoryInfo: any }) {
  const publishDate = post.data.created || post.data.updated
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
  )
}

function ArticleCard({ post, image, categoryInfo }: { post: any; image: string; categoryInfo: any }) {
  const publishDate = post.data.created || post.data.updated
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
  )
}
