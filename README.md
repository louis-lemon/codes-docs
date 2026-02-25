# Documentation Site Template

A modern, fast, and customizable documentation site template built with [Fumadocs](https://fumadocs.vercel.app/) and [Next.js 15](https://nextjs.org/).

## Features

- **Fast & Modern**: Built on Next.js 15 with React 19
- **Full-text Search**: Static search powered by Orama
- **Dark Mode**: Built-in light/dark theme support
- **MDX Support**: Write content in MDX with code highlighting
- **SEO Optimized**: Automatic sitemap, robots.txt, and meta tags
- **Easy Deployment**: One-click deploy to GitHub Pages or AWS

## Quick Start

### 1. Use This Template

Click the **"Use this template"** button on GitHub to create your own repository.

### 2. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
yarn install
```

### 3. Customize Your Site

Edit `config/site.ts` to update your site's metadata:

```typescript
export const siteConfig = {
  name: 'Your Site Name',
  description: 'Your site description',
  url: 'https://your-site.com',
  // ... more options
};
```

### 4. Start Development

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### 5. Deploy

#### GitHub Pages (Recommended)

1. Go to **Settings > Pages** in your repository
2. Set **Source** to **"GitHub Actions"**
3. Push to `main` branch - your site will deploy automatically!

Your site will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

#### AWS S3/CloudFront

```bash
yarn deploy:aws
```

## Configuration

All configuration is centralized in the `/config` directory:

| File | Purpose |
|------|---------|
| `config/site.ts` | Site name, description, URL, SEO |
| `config/navigation.ts` | Header navigation links |
| `config/social.ts` | Social media links |

## Content

Documentation content lives in `/content/docs/`. See the [Content Authoring Guide](/content/README.md) for details.

### Creating a New Page

1. Create a new `.mdx` file in `/content/docs/`:

```mdx
---
title: My New Page
description: Description for SEO
---

# My New Page

Your content here...
```

2. The page is automatically available at `/docs/my-new-page`

## Project Structure

```
├── config/              # Site configuration
│   ├── site.ts          # Site metadata & branding
│   ├── navigation.ts    # Navigation links
│   └── social.ts        # Social media links
├── content/
│   ├── docs/            # Documentation pages (MDX)
│   └── blog/            # Blog posts (MDX)
├── src/
│   ├── app/             # Next.js app router
│   ├── components/      # React components
│   └── lib/             # Utilities
└── public/              # Static assets
```

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn deploy:gh-pages` | Build for GitHub Pages |
| `yarn deploy:aws` | Build and deploy to AWS |

## Customization

### Styling

This template uses [Tailwind CSS](https://tailwindcss.com/). Customize the theme in `tailwind.config.js`.

### Components

Fumadocs provides many built-in components. See the [Fumadocs UI documentation](https://fumadocs.vercel.app/docs/ui) for details.

## Learn More

- [Fumadocs Documentation](https://fumadocs.vercel.app/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)

## License

MIT
