import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BlogSkeletonLoader() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="h-12 w-96 bg-muted rounded mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 w-full max-w-2xl bg-muted rounded mx-auto mb-8 animate-pulse"></div>
          </div>
        </div>

        {/* Topics Grid Skeleton */}
        <section className="mb-20">
          <div className="h-8 w-24 bg-muted rounded mb-8 animate-pulse"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border bg-gradient-to-br from-background to-muted/20">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    </div>
                    <Badge variant="secondary" className="bg-muted animate-pulse">
                      <div className="h-3 w-12 bg-muted-foreground/20 rounded"></div>
                    </Badge>
                  </div>
                  <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-4/5 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-3/5 bg-muted rounded animate-pulse"></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-9 w-full bg-muted rounded animate-pulse"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* All Articles Grid Skeleton */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-40 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="h-full border">
                <div className="relative h-40 rounded-t-lg overflow-hidden bg-muted animate-pulse">
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-muted-foreground/20">
                      <div className="h-3 w-8 bg-muted-foreground/30 rounded"></div>
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-4/5 bg-muted rounded animate-pulse"></div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-3/4 bg-muted rounded animate-pulse"></div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}