/**
 * Navigation Configuration
 *
 * Configure the navigation links that appear in your site's header.
 * Each link can be internal (relative URL) or external (full URL).
 */

export interface NavLink {
  /** Display text for the link */
  text: string;
  /** URL path (relative for internal, full URL for external) */
  url: string;
  /** How to determine if link is active: 'nested-url' for path matching */
  active?: 'nested-url' | 'url';
  /** Set to true for external links (opens in new tab) */
  external?: boolean;
}

export const navigationConfig: NavLink[] = [
  // ============================================
  // INTERNAL LINKS
  // ============================================
  {
    text: 'Home',
    url: '/',
    active: 'nested-url',
  },
  {
    text: 'Docs',
    url: '/docs',
    active: 'nested-url',
  },
  {
    text: 'Blog',
    url: '/blog',
    active: 'nested-url',
  },

  // ============================================
  // EXTERNAL LINKS
  // ============================================
  {
    text: 'GitHub',
    url: 'https://github.com/lemoncloud-io',
    external: true,
  },

  // Add more navigation links as needed:
  // {
  //   text: 'Discord',
  //   url: 'https://discord.gg/your-server',
  //   external: true,
  // },
];

/** Type for navigation configuration */
export type NavigationConfig = typeof navigationConfig;
