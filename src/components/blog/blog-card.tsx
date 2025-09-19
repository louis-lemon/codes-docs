import Link from "next/link"
import { categoryInfo } from '@/constants/blog-categories'
import { CARD_STYLES } from '@/constants/styles'
import { getCategoryFromPost, formatPostDate } from '@/lib/utils/blog'
import ArrowIcon from '@/components/ui/arrow-icon'

interface BlogCardProps {
  post: any;
}

export default function BlogCard({ post }: BlogCardProps) {
  const category = getCategoryFromPost(post)
  
  const categoryData = categoryInfo[category as keyof typeof categoryInfo]
  const categoryIcon = categoryData?.icon
  const categoryName = categoryData?.name || category

  return (
    <Link href={post.url} className={CARD_STYLES.withHeight}>
      <div className="px-5 py-4 relative h-full flex flex-col">
        <ArrowIcon />

        {/* Category icon */}
        <div className="h-6 w-6 mb-3 text-gray-700 dark:text-gray-300">
          {categoryIcon}
        </div>

        {/* Category label */}
        <div className="text-xs text-primary dark:text-primary-light mb-2 font-medium">
          {categoryName.toUpperCase()}
        </div>

        {/* Title */}
        <h3 className="not-prose font-semibold text-base text-gray-800 dark:text-white mt-2">
          {post.data.title}
        </h3>

        {/* Description */}
        <p className="mt-1 font-normal text-sm leading-6 text-gray-600 dark:text-gray-400 flex-1 line-clamp-3">
          {post.data.description}
        </p>

        {/* Date */}
        <div className="mt-auto pt-3 text-xs text-gray-500 dark:text-gray-500">
          {formatPostDate(post.data.created)}
        </div>
      </div>
    </Link>
  )
}