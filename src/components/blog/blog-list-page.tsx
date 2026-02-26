import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Tag,
  ArrowRight,
  Eye,
  Cpu,
  ExternalLink
} from "lucide-react"

import { categoryInfo } from '@/constants/blog-categories'
import BlogCard from '@/components/blog/blog-card'

interface BlogListPageProps {
  blogPosts: any[];
}

export default function BlogListPage({ blogPosts }: BlogListPageProps) {


  // Sort posts by date
  const allPosts = blogPosts
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
              {featuredPosts.map((post) => (
                <BlogCard
                  key={post.url}
                  post={post}
                />
              ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="my-12 mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between mt-10 mb-4">
          <p className="text-gray-900 dark:text-gray-200 text-2xl font-semibold">
            Recent Articles
          </p>
          <Link href="/blog/all" className="text-primary dark:text-primary-light text-sm hover:text-primary/80">
            View all
          </Link>
        </div>

        <div className="not-prose grid gap-4 sm:grid-cols-3">
            {recentPosts.map((post) => (
              <BlogCard
                key={post.url}
                post={post}
              />
            ))}
        </div>
      </section>
    </main>
  )
}

