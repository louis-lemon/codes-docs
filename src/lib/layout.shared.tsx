import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { siteConfig, navigationConfig } from '@/config';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src={siteConfig.logo.light}
            alt="Logo"
            width={24}
            height={24}
            className="dark:hidden"
          />
          <Image
            src={siteConfig.logo.dark}
            alt="Logo"
            width={24}
            height={24}
            className="hidden dark:block"
          />
          {siteConfig.name}
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: navigationConfig,
  };
}
