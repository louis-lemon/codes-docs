import { LemonHomeLayout } from '@/components/layout/lemon-home-layout';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <LemonHomeLayout {...baseOptions()}>
      {children}
    </LemonHomeLayout>
  );
}