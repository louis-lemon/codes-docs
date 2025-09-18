import { baseOptions } from '@/lib/layout.shared';
import { LemonHomeLayout } from "@/components/layout/lemon-home-layout";

export default function Layout({ children }: LayoutProps<'/'>) {
    return <LemonHomeLayout {...baseOptions()}>{children}</LemonHomeLayout>;
}
