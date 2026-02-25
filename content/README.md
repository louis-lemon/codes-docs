# Content Authoring Guide

This guide explains how to create and organize documentation content for your site.

## Directory Structure

```
content/
├── docs/           # Documentation pages
│   ├── index.mdx   # Docs landing page (/docs)
│   ├── meta.json   # Section configuration
│   └── ...         # Your documentation files
├── blog/           # Blog posts (if enabled)
└── README.md       # This file
```

## Creating Documentation Pages

### Basic Page

Create a new `.mdx` file in the `content/docs/` directory:

```mdx
---
title: Page Title
description: A brief description for SEO
---

# Page Title

Your content goes here...
```

### Frontmatter Options

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Page title (appears in sidebar and browser tab) |
| `description` | No | SEO description |
| `icon` | No | Icon name from Lucide icons |
| `full` | No | Set to `true` for full-width layout |

### Organizing with Folders

Create folders to group related pages:

```
content/docs/
├── getting-started/
│   ├── meta.json        # Configure this section
│   ├── index.mdx        # Section landing page
│   ├── installation.mdx
│   └── quick-start.mdx
└── guides/
    ├── meta.json
    └── ...
```

### Configuring Sections with meta.json

Each folder can have a `meta.json` file to configure the sidebar:

```json
{
  "title": "Getting Started",
  "description": "Learn the basics",
  "pages": ["index", "installation", "quick-start"]
}
```

The `pages` array controls the order of items in the sidebar.

## MDX Features

### Code Blocks

````mdx
```typescript title="example.ts"
const hello = "world";
```
````

### Callouts

```mdx
<Callout type="info">
  This is an informational callout.
</Callout>

<Callout type="warn">
  This is a warning callout.
</Callout>

<Callout type="error">
  This is an error callout.
</Callout>
```

### Tabs

```mdx
<Tabs items={["npm", "yarn", "pnpm"]}>
  <Tab value="npm">npm install package</Tab>
  <Tab value="yarn">yarn add package</Tab>
  <Tab value="pnpm">pnpm add package</Tab>
</Tabs>
```

### Cards

```mdx
<Cards>
  <Card title="First Card" href="/docs/first">
    Description of the first card
  </Card>
  <Card title="Second Card" href="/docs/second">
    Description of the second card
  </Card>
</Cards>
```

## Images

Place images in the `public/` directory and reference them:

```mdx
![Alt text](/images/screenshot.png)
```

Or use Next.js Image component for optimization:

```mdx
import Image from 'next/image';

<Image src="/images/screenshot.png" alt="Screenshot" width={800} height={600} />
```

## Tips

1. **File naming**: Use kebab-case for file names (`my-page.mdx`)
2. **Keep pages focused**: One topic per page
3. **Use headings**: Structure content with `##` and `###`
4. **Add descriptions**: Help with SEO and page previews
5. **Test locally**: Run `yarn dev` to preview changes

## Need Help?

- [Fumadocs Documentation](https://fumadocs.vercel.app/)
- [MDX Documentation](https://mdxjs.com/)
