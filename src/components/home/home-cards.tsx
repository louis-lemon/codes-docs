import Link from 'next/link';
import { CARD_STYLES } from '@/constants/styles';
import HomeArrowIcon from '@/components/ui/home-arrow-icon';

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function QuickStartCard({ title, description, href, icon }: CardProps) {
  return (
    <Link
      href={href}
      className={CARD_STYLES.base}
    >
      <div className="px-6 py-5 relative">
        <HomeArrowIcon />
        <div className="h-6 w-6 mb-4 text-gray-700 dark:text-gray-300">
          {icon}
        </div>
        <div>
          <h2 className="not-prose font-semibold text-base text-gray-800 dark:text-white mt-4">
            {title}
          </h2>
          <div className="mt-1 font-normal text-sm leading-6 text-gray-600 dark:text-gray-400">
            <span>{description}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TopicCard({ title, description, href, icon }: CardProps) {
  return (
    <Link
      href={href}
      className={CARD_STYLES.base}
    >
      <div className="px-6 py-5 relative">
        <HomeArrowIcon />
        <div className="h-6 w-6 mb-4 text-gray-700 dark:text-gray-300">
          {icon}
        </div>
        <div>
          <h2 className="not-prose font-semibold text-base text-gray-800 dark:text-white mt-4">
            {title}
          </h2>
          <div className="mt-1 font-normal text-sm leading-6 text-gray-600 dark:text-gray-400">
            <span>{description}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}