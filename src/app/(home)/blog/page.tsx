import { blog } from "@/lib/source";
import type { Metadata } from "next";
import Link from "next/link";

export default function page() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.created ?? b.file.name).getTime() -
      new Date(a.data.created ?? a.file.name).getTime(),
  );

  const blog_nav = [
    { name: "Computer Science", url: "/blog/tag/computer-science" },
    { name: "Photography", url: "/blog/tag/photography" },
    { name: "Programming", url: "/blog/tag/programming" },
  ]

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
      <div className="text-center mb-12">
        <h2 className="mb-4 mt-6 text-3xl font-bold md:text-5xl">
          The latest and greatest news
        </h2>
        <p className="mt-2">Lorem ipsum dolor sit amet elit ut aliquam</p>
        <div className="my-10 md:my-20 flex flex-col md:flex-row justify-center gap-3">
          {blog_nav &&
            blog_nav.map((nav) => (
              <Link
                href={nav.url}
                key={nav.url}
                className="px-4 py-2 bg-fd-primary text-fd-primary-foreground font-semibold rounded-full"
              >
                {nav.name}
              </Link>
            ))}
        </div>
      </div>

      {/* Blog Content */}

      <div className="max-w-6xl mx-auto">
        <div className="w-full grid grid-cols-1 gap-6 mb-6">
          {posts.map((post, index) => (
              <div>
                {post.id}
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://localhost:3000"),
  title: "Blog - Nextify",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque semper nunc sit amet dui vulputate, at dictum velit egestas.",
  openGraph: {
    images: ["/docs-og", "Blog - Nextify", "image.png"].join("/"),
  },
  twitter: {
    card: "summary_large_image",
    images: ["/docs-og", "Blog - Nextify", "image.png"].join("/"),
  },
};
