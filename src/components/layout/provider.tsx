'use client';

import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        options: {
          type: 'static',
          // AWS S3 + CloudFront 배포시 루트 배포
          api: '/api/search',
        },
      }}
      theme={{
        defaultTheme: 'light',
        enabled: true,
      }}
    >
      {children}
    </RootProvider>
  );
}