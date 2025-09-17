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

  // Filter and sort posts (show all posts including drafts for development)
  const allPosts = blogPosts
    // .filter(post => !post.data.draft)  // Show drafts for now
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
    <main className="flex flex-1 flex-col">
        {/* Blog Hero Section - Distinctive design */}
        <section className="my-12 mx-auto max-w-6xl px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-200">
                Exploring the Frontiers of{' '}
                <span
                  style={{
                    background: 'linear-gradient(102deg, rgb(255, 212, 95) -3.17%, rgb(255, 164, 90) 40.51%, rgb(255, 98, 0) 89.47%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Artificial Intelligence
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-normal leading-relaxed">
                Deep insights into AI, GenAI, Computer Vision, and Deep Learning advancements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/blog/all" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                  Latest Articles
                </Link>
                <button className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-border bg-background text-foreground font-medium hover:bg-muted transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  Join Newsletter
                </button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-background to-muted/20">
              <Image
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&h=600&auto=format&fit=crop"
                alt="AI visualization showing neural network connections and robotic intelligence"
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
          추천 포스트
        </p>

        <div className="not-prose grid gap-4 sm:grid-cols-3">
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
                />
              );
            })}
        </div>
      </section>
    </main>
  )
}

function FeaturedCard({ post, image, icon }: { post: any; image: string; icon: React.ReactNode }) {
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
          {icon}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-xs text-primary dark:text-primary-light mb-2 font-medium">
            {category.toUpperCase()}
          </div>
          <h2 className="not-prose font-semibold text-base text-gray-800 dark:text-white mt-2">
            {post.data.title}
          </h2>
          <div className="mt-1 font-normal text-sm leading-6 text-gray-600 dark:text-gray-400 flex-1">
            <span>{post.data.description}</span>
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

function ArticleCard({ post, image }: { post: any; image: string }) {
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
            <span>{post.data.description}</span>
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
