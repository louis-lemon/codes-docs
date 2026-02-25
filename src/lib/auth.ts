import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

/**
 * Auth.js (NextAuth v5) Configuration
 *
 * This setup uses GitHub OAuth to authenticate users for the admin panel.
 * The GitHub access token is stored in the session for API calls.
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          // Request repo scope for committing to repository
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store GitHub access token in JWT for API calls
      if (account) {
        token.accessToken = account.access_token;
        token.username = (profile as { login?: string })?.login;
      }
      return token;
    },
    async session({ session, token }) {
      // Make access token available in session
      session.accessToken = token.accessToken as string;
      session.user.username = token.username as string;
      return session;
    },
    async signIn({ profile }) {
      // Optional: Restrict to specific GitHub org members
      const allowedOrg = process.env.GITHUB_ALLOWED_ORG;
      if (!allowedOrg) return true;

      try {
        // Check org membership via GitHub API
        const response = await fetch(
          `https://api.github.com/orgs/${allowedOrg}/members/${(profile as { login?: string })?.login}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_ORG_CHECK_TOKEN}`,
            },
          }
        );
        return response.status === 204;
      } catch {
        return false;
      }
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
});

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
    };
  }
}
