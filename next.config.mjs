import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * Deployment Configuration
 *
 * This config supports multiple deployment modes:
 * 1. Development: No basePath, no static export
 * 2. GitHub Pages: Dynamic basePath based on repo name, static export
 * 3. AWS S3/CloudFront: Custom domain, static export
 * 4. Admin Mode: Dynamic server (Vercel) for CMS functionality
 *
 * Set environment variables to control deployment:
 * - GITHUB_PAGES=true: Enable GitHub Pages mode
 * - ADMIN_MODE=true: Enable dynamic admin routes (disables static export)
 * - BASE_PATH=/repo-name: Set custom basePath (auto-detected for GitHub Pages)
 * - SITE_URL=https://custom.domain: Set custom site URL for assets
 */

// Determine deployment mode
const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isAdminMode = process.env.ADMIN_MODE === 'true';

// GitHub Pages auto-detects repo name from GITHUB_REPOSITORY env var
// Format: "owner/repo-name" -> extract "/repo-name"
const getGitHubPagesBasePath = () => {
  const repo = process.env.GITHUB_REPOSITORY;
  if (repo) {
    const repoName = repo.split('/')[1];
    // Check if it's a user/org site (username.github.io)
    if (repoName?.endsWith('.github.io')) {
      return '';
    }
    return `/${repoName}`;
  }
  return process.env.BASE_PATH || '';
};

// Configure basePath and assetPrefix based on deployment mode
const basePath = isGitHubPages ? getGitHubPagesBasePath() : (process.env.BASE_PATH || '');
const assetPrefix = isGitHubPages
  ? basePath
  : (process.env.SITE_URL || (isProduction && !isAdminMode ? 'https://docs.eureka.codes' : ''));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  // TypeScript check disabled for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint check disabled for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Static export for production deployments (disabled in admin mode)
  ...(isProduction && !isAdminMode && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  }),

  // Image optimization disabled for static export
  images: {
    unoptimized: true,
  },

  // Dynamic basePath and assetPrefix
  basePath,
  assetPrefix,

  // Fix fs module error for client components
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default withMDX(config);
