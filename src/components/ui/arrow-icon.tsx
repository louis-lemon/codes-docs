import { ARROW_ICON_STYLES } from '@/constants/styles'

interface ArrowIconProps {
  className?: string
}

export default function ArrowIcon({ className }: ArrowIconProps) {
  return (
    <div className={className || ARROW_ICON_STYLES}>
      <svg
        className="h-4 w-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </div>
  )
}