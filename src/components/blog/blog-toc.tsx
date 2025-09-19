'use client'

import { useEffect, useState } from 'react'
import { List, ChevronDown, ChevronUp } from 'lucide-react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface BlogTocProps {
  className?: string
}

export default function BlogToc({ className = '' }: BlogTocProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Extract headings from the content
    const headings = document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')
    
    const items: TocItem[] = []
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`
      if (!heading.id) {
        heading.id = id
      }
      
      items.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      })
    })
    
    setTocItems(items)
  }, [])

  useEffect(() => {
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -80% 0%'
      }
    )

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [tocItems])

  if (tocItems.length === 0) {
    return null
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={className}>
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <List className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span>Table of Contents</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>
        
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 p-3">
            <nav className="space-y-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`
                    block w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200
                    ${activeId === item.id 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-medium border-l-3 border-blue-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }
                  `}
                  style={{ 
                    marginLeft: `${(item.level - 1) * 16}px`
                  }}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}