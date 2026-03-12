/**
 * Settings Loader
 * Utilities to load site settings from JSON files
 */

import {
  BookOpen,
  Bot,
  Globe,
  Server,
  BrainCircuit,
  Monitor,
  Cloud,
  Wrench,
  Zap,
  Lightbulb,
  Compass,
  Smartphone,
  Code,
  Database,
  Settings,
  FileText,
} from 'lucide-react';
import type {
  IconName,
  HomepageSettings,
  BlogFeaturedSettings,
} from '@/types/settings';

// Import settings JSON files (static import for build-time)
import homepageSettingsData from '@/../content/settings/homepage.json';
import blogFeaturedSettingsData from '@/../content/settings/blog-featured.json';

// Map icon names to React components
export const iconMap: Record<
  IconName,
  React.ComponentType<{ className?: string }>
> = {
  BookOpen,
  Bot,
  Globe,
  Server,
  BrainCircuit,
  Monitor,
  Cloud,
  Wrench,
  Zap,
  Lightbulb,
  Compass,
  Smartphone,
  Code,
  Database,
  Settings,
  FileText,
};

/**
 * Get homepage settings (Quick Start + Tech Stack)
 */
export const getHomepageSettings = (): HomepageSettings => {
  return homepageSettingsData as HomepageSettings;
};

/**
 * Get blog featured settings
 */
export const getBlogFeaturedSettings = (): BlogFeaturedSettings => {
  return blogFeaturedSettingsData as BlogFeaturedSettings;
};

/**
 * Get icon component by name
 */
export const getIconComponent = (
  name: IconName
): React.ComponentType<{ className?: string }> => {
  return iconMap[name] || BookOpen;
};
