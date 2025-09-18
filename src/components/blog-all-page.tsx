'use client'

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
  ArrowLeft,
  Eye,
  Cpu,
  Mail,
  Search,
  Cloud,
  Building,
  Code,
  Monitor,
  Server,
  Smartphone,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Palette,
  Paintbrush,
  Layers,
  FileSearch,
  BarChart3,
  Target,
  BookOpen,
  Lightbulb,
  PenTool,
  GitBranch,
  Settings
} from "lucide-react"
import { useSearchParams } from 'next/navigation'

interface BlogAllPageProps {
  blogPosts: any[]
}

export default function BlogAllPage({ blogPosts }: BlogAllPageProps) {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  // Filter and sort posts (show all posts including drafts for development)
  const allPosts = blogPosts
    .filter(post => {
      // Show all posts including drafts for now
      // if (post.data.draft) return false
      if (selectedCategory) {
        const postCategory = post.data.category || post.data.subCategory || 'Other'
        return postCategory === selectedCategory
      }
      return true
    })
    .sort((a, b) => {
      const dateA = new Date(a.data.created || a.data.updated || '').getTime()
      const dateB = new Date(b.data.created || b.data.updated || '').getTime()
      return dateB - dateA // Most recent first
    })

  // Group posts by category for Topics section
  const categories = allPosts.reduce((acc, post) => {
    const category = post.data.category || post.data.subCategory || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(post)
    return acc
  }, {} as Record<string, typeof allPosts>)

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

  return (
    <main className="flex flex-1 flex-col">
      {/* Header */}
      <section className="my-12 mx-auto max-w-6xl px-5">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to blog
        </Link>
        
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-gray-900 dark:text-gray-200 text-4xl md:text-5xl font-semibold leading-tight mb-6">
            {selectedCategory 
              ? `${categoryInfo[selectedCategory]?.name || selectedCategory} Articles`
              : 'All Articles'
            }
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-normal text-lg md:text-xl mb-8">
            {selectedCategory 
              ? `${categoryInfo[selectedCategory]?.description || 'Articles in this category.'}`
              : 'Comprehensive collection of AI insights, research, and technical deep-dives.'
            }
          </p>
        </div>
      </section>

      {/* Topics Grid - Only show when not filtering by category */}
      {!selectedCategory && (
        <section className="my-12 mx-auto max-w-6xl px-5">
          <p className="text-gray-900 dark:text-gray-200 text-left mt-4 text-2xl mb-4 font-semibold">
            Topics
          </p>
          <div className="not-prose grid gap-4 sm:grid-cols-3">
              {Object.entries(categories).map(([categoryKey, posts]) => {
                const info = categoryInfo[categoryKey] || categoryInfo['Other']
                return (
                  <Link
                    key={categoryKey}
                    href={`/blog/all?category=${encodeURIComponent(categoryKey)}`}
                    className="card block font-normal group relative my-2 rounded-2xl bg-white dark:bg-fd-card border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 overflow-hidden w-full cursor-pointer transition-all"
                  >
                    <div className="px-6 py-5 relative">
                      <div className="absolute text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary-light top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                      <div className="h-6 w-6 mb-3 text-gray-700 dark:text-gray-300">
                        {info.icon}
                      </div>
                      <div>
                        <div className="text-xs text-primary dark:text-primary-light mb-2 font-medium">
                          {posts.length} articles
                        </div>
                        <h2 className="not-prose font-semibold text-base text-gray-800 dark:text-white mt-2">
                          {info.name}
                        </h2>
                        <div className="mt-1 font-normal text-sm leading-6 text-gray-600 dark:text-gray-400">
                          <span>{info.description}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </section>
      )}

      {/* All Articles Grid */}
      <section className="my-12 mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between mt-10 mb-4">
          <p className="text-gray-900 dark:text-gray-200 text-2xl font-semibold">
            {selectedCategory ? `${categoryInfo[selectedCategory]?.name || selectedCategory} Articles` : 'All Articles'}
          </p>
          {selectedCategory && (
            <Link href="/blog/all" className="text-primary dark:text-primary-light text-sm hover:text-primary/80">
              view all articles
            </Link>
          )}
        </div>
        <div className="not-prose grid gap-4 sm:grid-cols-3">
            {allPosts.map((post, index) => {
              const images = [
                "https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1563630381190-77c336ea545a?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&h=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=600&h=400&auto=format&fit=crop"
              ];
              const publishDate = post.data.created || post.data.updated
              const category = post.data.category || post.data.subCategory || 'AI'
              
              return (
                <AllArticleCard 
                  key={post.url} 
                  post={post} 
                  image={images[index % images.length]}
                />
              );
            })}
        </div>
      </section>
    </main>
  )
}

function AllArticleCard({ post, image }: { post: any; image: string }) {
  const publishDate = post.data.created || post.data.updated
  const category = post.data.category || post.data.subCategory || 'AI'
  
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
          <BrainCircuit className="w-6 h-6" />
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