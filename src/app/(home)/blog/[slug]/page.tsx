import { blog } from "@/lib/source";
import { notFound } from "next/navigation";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { Share } from "./share.client";
import defaultMdxComponents from "fumadocs-ui/mdx";
import Link from "next/link";
import { Metadata } from "next";
import { Fragment } from "react";
import slugify from "slugify";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blog.getPage([slug]);
  if (!post) notFound();
  const MDX = post.data.body;
  const getTags =
    post.data.tags &&
    slugify(post.data.tags[0], {
      lower: true,
      trim: true,
    });
  return (
    <Fragment>
      <section className="pt-20 pb-24 bg-indigo-600">
        <div className="w-full mt-20  max-w-lg md:max-w-2xl lg:max-w-4xl px-5 lg:px-11 mx-auto max-md:px-4">
          <h1 className="text-white font-manrope font-semibold text-4xl min-[500px]:text-5xl leading-tight mb-8">
            {post.data.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              {post?.data?.tags && (
                <Link
                  className="text-md text-white"
                  href={`/blog/tag/${getTags}`}
                >
                  {post?.data?.tags[0]}
                </Link>
              )}
              <p className="font-normal text-lg leading-7 text-white">
                {post.data?.id}, {post.data?.created}
              </p>
            </div>
            <div className="flex items-center gap-5">

              <Share url={post.url} />
            </div>
          </div>
        </div>
      </section>
      <div className="w-full mb-24 max-w-lg md:max-w-2xl lg:max-w-4xl px-5 lg:px-11 mx-auto max-md:px-4">
        <div className="container mt-8 prose prose-gray max-w-none dark:prose-invert">
          <InlineTOC className="my-3" items={post.data.toc} />
          <MDX components={{ ...defaultMdxComponents }} />
        </div>
      </div>
    </Fragment>
  );
}

export function generateStaticParams() {
  const post = blog.getPages();
  return post.map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const getPage = blog.getPage([slug]);
  if (!getPage) notFound();
  const image = ["/docs-og", getPage.data.title, "image.png"].join("/");
  return {
    metadataBase: new URL("https://localhost:3000"),
    title: getPage.data.title,
    description: getPage.data.description,
    openGraph: {
      title: getPage.data.title,
      description: getPage.data.description,
      type: "article",
      authors: getPage.data?.id || '',
      images: image,
    },
    category: getPage.data.category && getPage.data.category[0],
    twitter: {
      card: "summary_large_image",
      images: image,
    },
  };
}
