import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { blog } from '@/lib/source';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const docsOptions = { ...baseOptions(), links: [] };

  return (
    <DocsLayout tree={blog.pageTree} {...docsOptions}>
      {children}
    </DocsLayout>
  );
}