/**
 * Settings Types
 * Type definitions for site settings managed via Admin CMS
 */

/**
 * Available icon names from lucide-react
 * These are mapped to actual icon components at runtime
 */
export type IconName =
  | 'BookOpen'
  | 'Bot'
  | 'Globe'
  | 'Server'
  | 'BrainCircuit'
  | 'Monitor'
  | 'Cloud'
  | 'Wrench'
  | 'Zap'
  | 'Lightbulb'
  | 'Compass'
  | 'Smartphone'
  | 'Code'
  | 'Database'
  | 'Settings'
  | 'FileText';

/**
 * Homepage card configuration
 * Used for Quick Start and Tech Stack sections
 */
export interface HomepageCard {
  /** Unique identifier for the card */
  id: string;
  /** Display title */
  title: string;
  /** Brief description shown below the title */
  description: string;
  /** Navigation link (internal or external) */
  href: string;
  /** Icon name from lucide-react */
  icon: IconName;
}

/**
 * Homepage section configuration
 * Groups cards under a section title
 */
export interface HomepageSection {
  /** Section heading */
  title: string;
  /** Cards displayed in this section */
  cards: HomepageCard[];
}

/**
 * Full homepage settings configuration
 * Contains all configurable sections on the homepage
 */
export interface HomepageSettings {
  /** Quick Start section with getting started guides */
  quickStart: HomepageSection;
  /** Tech Stack section with technology documentation links */
  techStack: HomepageSection;
}

/**
 * Blog featured posts settings
 * Controls which posts are highlighted on the blog
 */
export interface BlogFeaturedSettings {
  /** Array of post IDs to feature */
  featuredPostIds: string[];
  /** Maximum number of featured posts to display */
  maxFeatured: number;
}

/**
 * Available settings file types for CRUD operations
 */
export type SettingsType = 'homepage' | 'blog-featured';

/**
 * Union type of all possible settings data structures
 */
export type SettingsData = HomepageSettings | BlogFeaturedSettings;
