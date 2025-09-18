import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // TypeScript 체크 비활성화
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint 체크 비활성화 (선택사항)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // AWS S3 + CloudFront 배포를 위한 정적 내보내기
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
  },
  // S3의 /en 폴더 구조에 맞춘 설정
  basePath: process.env.NODE_ENV === 'production' ? '/en' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/en' : '',
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
