'use client';

import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        options: {
          type: 'static',
          // AWS S3 + CloudFront 배포시 /en basePath 고려
          api: process.env.NODE_ENV === 'production' ? '/en/api/search' : '/api/search',
        },
      }}
    >
      {children}
    </RootProvider>
  );
}