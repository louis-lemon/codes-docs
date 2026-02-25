/**
 * Site Configuration
 *
 * This is the main configuration file for your documentation site.
 * Update these values to customize your site's metadata, branding, and SEO.
 */

export const siteConfig = {
  // ============================================
  // BASIC SITE INFORMATION
  // ============================================

  /** Site name displayed in the browser tab and header */
  name: 'EurekaCodes',

  /** Short description for SEO and social sharing */
  description:
    'From Infrastructure to Scalable Microservices. Transform your ideas into intelligent, production-ready applications.',

  /** Full URL of your deployed site (no trailing slash) */
  url: 'https://docs.eureka.codes',

  // ============================================
  // BRANDING
  // ============================================

  /** Logo URLs for light and dark modes */
  logo: {
    light: 'https://image.lemoncloud.io/codes/codes-logo-black.png',
    dark: 'https://image.lemoncloud.io/codes/codes-logo-white.png',
  },

  /** Favicon path (relative to /public directory) */
  favicon: '/favicon.ico',

  // ============================================
  // AUTHOR & ORGANIZATION
  // ============================================

  /** Author or organization name */
  author: 'EurekaCodes Team',

  /** Creator name for metadata */
  creator: 'EurekaCodes',

  // ============================================
  // SEO KEYWORDS
  // ============================================

  /** Keywords for search engine optimization */
  keywords: [
    'microservices',
    'AI agents',
    'cloud-native',
    'infrastructure',
    'scalable applications',
    'DevOps automation',
    'real-time chat',
    'WebSocket',
    'serverless',
    'eureka codes',
  ],

  // ============================================
  // OPEN GRAPH (Social Sharing)
  // ============================================

  openGraph: {
    /** OG title (defaults to site name if not set) */
    title: 'EurekaCodes - From Infrastructure to Scalable Microservices',

    /** OG description */
    description:
      'Transform your ideas into intelligent, production-ready applications. Build AI agents, microservices, and real-time applications with enterprise-grade infrastructure.',

    /** Site name for OG */
    siteName: 'EurekaCodes',

    /** Locale for OG */
    locale: 'en_US',

    /** OG type */
    type: 'website' as const,
  },

  // ============================================
  // TWITTER CARD
  // ============================================

  twitter: {
    /** Twitter card type */
    card: 'summary_large_image' as const,

    /** Twitter title */
    title: 'EurekaCodes - From Infrastructure to Scalable Microservices',

    /** Twitter description */
    description:
      'Transform your ideas into intelligent, production-ready applications with EurekaCodes platform.',

    /** Twitter handle (optional, e.g., '@yourusername') */
    // creator: '@eurekacodes',
  },
} as const;

/** Type for the site configuration */
export type SiteConfig = typeof siteConfig;
