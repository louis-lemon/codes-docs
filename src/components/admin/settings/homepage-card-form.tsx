'use client';

import { Trash2, GripVertical } from 'lucide-react';
import { IconSelector } from './icon-selector';
import type { HomepageCard, IconName } from '@/types/settings';
import { cn } from '@/lib/utils';

interface HomepageCardFormProps {
  card: HomepageCard;
  onChange: (card: HomepageCard) => void;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const HomepageCardForm = ({
  card,
  onChange,
  onDelete,
  isDragging = false,
  dragHandleProps,
}: HomepageCardFormProps) => {
  const handleChange = (field: keyof HomepageCard, value: string | IconName) => {
    onChange({ ...card, [field]: value });
  };

  return (
    <div
      className={cn(
        'p-4 border border-gray-200 dark:border-gray-700 rounded-xl',
        'bg-white dark:bg-gray-800',
        'transition-all duration-200',
        isDragging && 'shadow-lg ring-2 ring-blue-500 opacity-90'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className={cn(
            'flex-shrink-0 mt-2 cursor-grab active:cursor-grabbing',
            'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
            'transition-colors'
          )}
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Form Fields */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Card title"
              className={cn(
                'w-full px-3 py-2 rounded-lg transition-all duration-200',
                'border bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500'
              )}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={card.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description"
              rows={2}
              className={cn(
                'w-full px-3 py-2 rounded-lg transition-all duration-200',
                'border bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500',
                'resize-none'
              )}
              required
            />
          </div>

          {/* Href and Icon Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link (href) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={card.href}
                onChange={(e) => handleChange('href', e.target.value)}
                placeholder="/docs/getting-started"
                className={cn(
                  'w-full px-3 py-2 rounded-lg transition-all duration-200',
                  'border bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500'
                )}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icon
              </label>
              <IconSelector
                value={card.icon}
                onChange={(icon) => handleChange('icon', icon)}
              />
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={onDelete}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg',
            'text-gray-400 hover:text-red-600 dark:hover:text-red-400',
            'hover:bg-red-50 dark:hover:bg-red-900/20',
            'transition-colors'
          )}
          title="Delete card"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
