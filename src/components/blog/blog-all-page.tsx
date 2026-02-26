'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Tag,
  ArrowLeft,
  Eye,
  Cpu,
  Mail,
  Search,
  Cloud
} from "lucide-react"
import { useSearchParams } from 'next/navigation'
import { categoryInfo } from '@/constants/blog-categories'
import { getCategoryFromPost } from '@/lib/utils/blog'
import { CARD_STYLES } from '@/constants/styles'
import BlogCard from '@/components/blog/blog-card'
import HomeArrowIcon from '@/components/ui/home-arrow-icon'

interface BlogAllPageProps {
  blogPosts: any[]
}

export default function BlogAllPage({ blogPosts }: BlogAllPageProps) {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  // Filter and sort posts
  const allPosts = blogPosts
    .filter(post => {
      if (selectedCategory) {
        // For Blog category, use subCategory as the filtering criteria
        const postCategory = getCategoryFromPost(post)
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
    const category = getCategoryFromPost(post)

    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(post)
    return acc
  }, {} as Record<string, typeof allPosts>)


  return (
    <main className="flex flex-1 flex-col">
      {/* Header */}
      <section className="mt-12 mx-auto max-w-6xl px-5 w-full">
        <div className="w-full">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group w-fit"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to blog
          </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-gray-900 dark:text-gray-200 text-4xl md:text-5xl font-semibold leading-tight">
            {selectedCategory
              ? `${categoryInfo[selectedCategory]?.name || selectedCategory} Articles`
              : 'All Articles'
            }
          </h1>
        </div>
      </section>

      {/* Topics Grid - Only show when not filtering by category */}
      {!selectedCategory && (
        <section className="my-12 mx-auto max-w-6xl px-5 min-w-80">
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
                    className={CARD_STYLES.base}
                  >
                    <div className="px-6 py-5 relative">
                      <HomeArrowIcon />
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
      <section className="my-12 mx-auto max-w-6xl px-5 min-w-80">
        <div className="flex items-center justify-between mt-10 mb-4">
          <p className="text-gray-900 dark:text-gray-200 text-2xl font-semibold">
            {selectedCategory ? `${categoryInfo[selectedCategory]?.name || selectedCategory} Articles` : 'All Articles'}
          </p>
          {selectedCategory && (
            <Link href="/blog/all" className="text-primary dark:text-primary-light text-sm hover:text-primary/80">
              View all articles
            </Link>
          )}
        </div>
        <div className="not-prose grid gap-4 sm:grid-cols-3">
            {allPosts.map((post) => (
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

