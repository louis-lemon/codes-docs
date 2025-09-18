"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface BlogSearchProps {
  onSearch: (term: string) => void
}

export function BlogSearch({ onSearch }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }
  
  return (
    <div className="max-w-md mx-auto relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="포스트 검색..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}