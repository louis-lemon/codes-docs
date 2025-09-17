import Link from "next/link"
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
  BookOpen,
  Zap
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

  const featuredPosts = allPosts.filter(post => post.data.featured).slice(0, 3)
  const recentPosts = allPosts.filter(post => !post.data.featured).slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              AI 인사이트 <span className="text-primary">블로그</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              인공지능, 머신러닝, 딥러닝의 최신 동향과 실용적인 인사이트를 공유합니다.
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{blogPosts.length}개의 포스트</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>정기 업데이트</span>
              </div>
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <FeaturedCard key={post.url} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">최신 포스트</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <ArticleCard key={post.url} post={post} />
            ))}
          </div>

          {recentPosts.length < allPosts.length && (
            <div className="text-center mt-12">
              <Button variant="outline">
                더 많은 포스트 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function FeaturedCard({ post }: { post: any }) {
  const publishDate = post.data.created || post.data.updated
  const category = post.data.category || post.data.subCategory || 'AI'
  
  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-primary mb-2">
          <BrainCircuit className="h-4 w-4" />
          <span>{category}</span>
        </div>
        <CardTitle className="text-xl line-clamp-2">{post.data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{post.data.description}</CardDescription>
        {post.data.tags && post.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {post.data.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.data.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{post.data.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>
            {publishDate ? new Date(publishDate).toLocaleDateString('ko-KR') : '날짜 없음'}
          </span>
        </div>
        <Link href={post.url} className="text-primary hover:text-primary/80 font-medium">
          읽기 →
        </Link>
      </CardFooter>
    </Card>
  )
}

function ArticleCard({ post }: { post: any }) {
  const publishDate = post.data.created || post.data.updated
  const category = post.data.category || post.data.subCategory || 'AI'
  
  return (
    <Link href={post.url} className="group">
      <Card className="h-full border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs text-primary mb-2">
            <Tag className="h-3 w-3" />
            <span>{category}</span>
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {post.data.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="line-clamp-3">{post.data.description}</CardDescription>
          {post.data.tags && post.data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.data.tags.slice(0, 2).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.data.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{post.data.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {publishDate ? new Date(publishDate).toLocaleDateString('ko-KR') : '날짜 없음'}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}