import Link from "next/link"
import Image from "next/image"
import { blog } from '@/lib/source'
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
  Mail
} from "lucide-react"

export default function BlogListPage() {
  const blogPosts = blog.getPages()

  // Filter and sort posts (server-side only)
  const allPosts = blogPosts
    .filter(post => !post.data.draft)
    .sort((a, b) => {
      const dateA = new Date(a.data.created || a.data.updated || '').getTime()
      const dateB = new Date(b.data.created || b.data.updated || '').getTime()
      return dateB - dateA // Most recent first
    })

  // Specific featured posts: C135, C136, C138
  const featuredPostIds = ['C135', 'C136', 'C138']
  const featuredPosts = featuredPostIds
    .map(id => allPosts.find(post => post.data.id === id))
    .filter(Boolean) // Remove any undefined posts

  // All posts for Recent Articles
  const recentPosts = allPosts

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Stress-Free AI DevOps
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl">
                LemonCloud provides an integrated service that
                unifies all DevOps functions, from module selection to
                integration, cost management, and monitoring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary/90">
                  Latest Articles
                </Button>
                <Button variant="outline" className="border-border hover:bg-muted">
                  <Mail className="h-4 w-4 mr-2" />
                  Join Newsletter
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden border border-border">
              <Image
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&h=800&auto=format&fit=crop"
                alt="AI visualization showing neural network connections"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">추천 포스트</h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Featured
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => {
                const images = [
                  "https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=600&h=400&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=600&h=400&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&h=400&auto=format&fit=crop"
                ];
                const icons = [
                  <BrainCircuit className="h-5 w-5" key="brain" />,
                  <Cpu className="h-5 w-5" key="cpu" />,
                  <Eye className="h-5 w-5" key="eye" />
                ];
                return (
                  <FeaturedCard
                    key={post.url}
                    post={post}
                    image={images[index % images.length]}
                    icon={icons[index % icons.length]}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Articles</h2>
            <Link href="/blog/all" className="text-primary hover:text-primary/80 text-sm flex items-center gap-2">
              View all <Eye className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

function FeaturedCard({ post, image, icon }: { post: any; image: string; icon: React.ReactNode }) {
  const publishDate = post.data.created || post.data.updated
  const category = post.data.category || post.data.subCategory || 'AI'

  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <div className="relative h-48">
        <Image src={image} alt={post.data.title} fill className="object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-primary mb-2">
          {icon}
          <span>{category}</span>
        </div>
        <CardTitle className="text-xl line-clamp-2">{post.data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{post.data.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>
            {publishDate ? new Date(publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : 'No date'}
          </span>
        </div>
        <Link href={post.url} className="text-primary hover:text-primary/80 font-medium">
          Read more →
        </Link>
      </CardFooter>
    </Card>
  )
}

function ArticleCard({ post, image }: { post: any; image: string }) {
  const publishDate = post.data.created || post.data.updated
  const category = post.data.category || post.data.subCategory || 'AI'

  return (
    <Link href={post.url} className="group">
      <Card className="h-full border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
        <div className="relative h-48 rounded-t-lg overflow-hidden">
          <Image src={image} alt={post.data.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 text-xs text-primary mb-2">
            <BrainCircuit className="h-4 w-4" />
            <span>{category}</span>
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {post.data.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="line-clamp-3">{post.data.description}</CardDescription>
        </CardContent>
        <CardFooter>
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
