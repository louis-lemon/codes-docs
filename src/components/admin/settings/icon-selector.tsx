'use client';

import { useState, useRef, useEffect, createElement } from 'react';
import { ChevronDown } from 'lucide-react';
import type { IconName } from '@/types/settings';
import { iconMap } from '@/lib/settings';
import { cn } from '@/lib/utils';

// Generate icon options dynamically from iconMap
const iconNames = Object.keys(iconMap) as IconName[];

interface IconSelectorProps {
  value: IconName;
  onChange: (value: IconName) => void;
}

export const IconSelector = ({ value, onChange }: IconSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const IconComponent = iconMap[value];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-3 py-2 rounded-lg transition-all duration-200',
          'border bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500',
          'flex items-center justify-between gap-2'
        )}
      >
        <span className="flex items-center gap-2">
          {IconComponent && <IconComponent className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
          <span className="text-sm">{value}</span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full',
            'bg-white dark:bg-gray-800 rounded-lg shadow-lg',
            'border border-gray-200 dark:border-gray-700',
            'max-h-64 overflow-y-auto'
          )}
        >
          <div className="p-1 grid grid-cols-4 gap-1">
            {iconNames.map((name) => {
              const isSelected = name === value;
              const Icon = iconMap[name];
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name);
                    setIsOpen(false);
                  }}
                  title={name}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 p-2 rounded-md',
                    'transition-colors duration-150',
                    isSelected
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] truncate w-full text-center">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
