import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;

// This route must be dynamic for OAuth to work
export const dynamic = 'force-dynamic';
