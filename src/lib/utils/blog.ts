/**
 * 블로그 포스트에서 카테고리를 해결하는 유틸리티 함수
 */
export function getCategoryFromPost(post: any): string {
  if (post.data.category === 'Blog') {
    return post.data.subCategory || 'Other'
  }
  return post.data.category || post.data.subCategory || 'AI'
}

/**
 * 블로그 포스트 날짜를 한국어 형식으로 포매팅
 */
export function formatPostDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 블로그 포스트를 날짜별로 정렬 (최신 순)
 */
export function sortPostsByDate(posts: any[]): any[] {
  return posts.sort((a, b) => {
    const dateA = new Date(a.data.created || a.data.updated).getTime()
    const dateB = new Date(b.data.created || b.data.updated).getTime()
    return dateB - dateA
  })
}