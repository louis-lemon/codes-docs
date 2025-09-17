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
  Code
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
    'ai': { name: 'Generative AI', icon: <BrainCircuit className="h-5 w-5" />, description: 'Explore the latest advancements in generative AI models, including GANs, diffusion models, and more.' },
    'machine-learning': { name: 'Computer Vision', icon: <Eye className="h-5 w-5" />, description: 'Discover how AI is revolutionizing image and video analysis, object detection, and scene understanding.' },
    'glossary': { name: 'AI Research', icon: <Cpu className="h-5 w-5" />, description: 'Stay updated with the latest research papers, breakthroughs, and academic developments in AI.' },
    'aws': { name: 'AWS Cloud', icon: <Cloud className="h-5 w-5" />, description: 'Master Amazon Web Services with comprehensive guides on EC2, Lambda, S3, and cloud architecture best practices.' },
    'business': { name: 'Business & Operations', icon: <Building className="h-5 w-5" />, description: 'Learn business fundamentals, operations management, and entrepreneurial strategies for tech companies.' },
    'development': { name: 'Software Development', icon: <Code className="h-5 w-5" />, description: 'Practical programming tutorials, development frameworks, and software engineering best practices.' },
    'Other': { name: 'Deep Learning', icon: <BrainCircuit className="h-5 w-5" />, description: 'Learn about neural network architectures, training techniques, and applications in various domains.' }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to blog
          </Link>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {selectedCategory 
                ? `${categoryInfo[selectedCategory]?.name || selectedCategory} Articles`
                : 'All Articles'
              }
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8">
              {selectedCategory 
                ? `${categoryInfo[selectedCategory]?.description || 'Articles in this category.'}`
                : 'Comprehensive collection of AI insights, research, and technical deep-dives.'
              }
            </p>
          </div>
        </div>

        {/* Topics Grid - Only show when not filtering by category */}
        {!selectedCategory && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Topics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categories).map(([categoryKey, posts]) => {
                const info = categoryInfo[categoryKey] || categoryInfo['Other']
                return (
                  <Card key={categoryKey} className="overflow-hidden border hover:shadow-lg transition-all duration-300 hover:border-primary/50 bg-gradient-to-br from-background to-muted/20 flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-primary">
                          {info.icon}
                          <span className="font-semibold">{info.name}</span>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {posts.length} articles
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{info.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="line-clamp-3">{info.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Link href={`/blog/all?category=${encodeURIComponent(categoryKey)}`} className="w-full">
                        <Button variant="ghost" className="w-full justify-between text-primary hover:text-primary/80">
                          View articles
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {selectedCategory ? `${categoryInfo[selectedCategory]?.name || selectedCategory} Articles` : 'All Articles'}
            </h2>
            {selectedCategory && (
              <Link href="/blog/all" className="text-primary hover:text-primary/80 text-sm flex items-center gap-2">
                View All Articles <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      </div>
    </div>
  )
}

function AllArticleCard({ post, image }: { post: any; image: string }) {
  const publishDate = post.data.created || post.data.updated
  const category = post.data.category || post.data.subCategory || 'AI'
  
  return (
    <Link href={post.url} className="group">
      <Card className="h-full border hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:scale-[1.02]">
        <div className="relative h-40 rounded-t-lg overflow-hidden">
          <Image src={image} alt={post.data.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {category}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {post.data.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <CardDescription className="line-clamp-2 text-sm">{post.data.description}</CardDescription>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {publishDate ? new Date(publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }) : 'No date'}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}