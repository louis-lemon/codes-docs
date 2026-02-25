/**
 * Social Links Configuration
 *
 * Configure social media links for your site.
 * These can be used in the footer, header, or anywhere else.
 */

export interface SocialLink {
  /** Platform name */
  name: string;
  /** URL to your profile/page */
  url: string;
  /** Icon name (for use with lucide-react or other icon libraries) */
  icon: 'github' | 'twitter' | 'discord' | 'linkedin' | 'youtube' | 'mail' | 'rss';
}

export const socialConfig: SocialLink[] = [
  // ============================================
  // SOCIAL MEDIA LINKS
  // ============================================

  {
    name: 'GitHub',
    url: 'https://github.com/lemoncloud-io',
    icon: 'github',
  },

  // Uncomment and customize the links you need:

  // {
  //   name: 'Twitter',
  //   url: 'https://twitter.com/yourusername',
  //   icon: 'twitter',
  // },

  // {
  //   name: 'Discord',
  //   url: 'https://discord.gg/your-server',
  //   icon: 'discord',
  // },

  // {
  //   name: 'LinkedIn',
  //   url: 'https://linkedin.com/company/yourcompany',
  //   icon: 'linkedin',
  // },

  // {
  //   name: 'YouTube',
  //   url: 'https://youtube.com/@yourchannel',
  //   icon: 'youtube',
  // },

  // {
  //   name: 'Email',
  //   url: 'mailto:hello@example.com',
  //   icon: 'mail',
  // },

  // {
  //   name: 'RSS',
  //   url: '/rss.xml',
  //   icon: 'rss',
  // },
];

/** Type for social configuration */
export type SocialConfig = typeof socialConfig;
