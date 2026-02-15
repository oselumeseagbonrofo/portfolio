import { getPostBySlug, getPostSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Calendar, ChevronLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen py-28 md:py-32">
      <div className="container-wide max-w-4xl">
        <Link
          href="/blog"
          className="story-link mb-10 inline-flex rounded-full border border-border/75 bg-card/70 px-4 py-2 text-[0.62rem] text-muted-foreground hover:text-primary"
        >
          <ChevronLeft size={14} />
          Back to Blog
        </Link>

        <header className="blueprint-card grain-panel rounded-[1.3rem] p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2.5 text-xs">
            <span className="rounded-full border border-primary/35 bg-primary/12 px-3 py-1.5 font-mono uppercase tracking-[0.2em] text-primary">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-muted-foreground">
              <Calendar size={13} />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-muted-foreground">
              <Clock size={13} />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-display text-4xl leading-[0.98] text-balance md:text-6xl">{post.title}</h1>
          <p className="mt-5 max-w-2xl text-base italic leading-relaxed text-muted-foreground md:text-lg">{post.excerpt}</p>
        </header>

        <div
          className="prose prose-lg mt-10 max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/87 prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:text-accent prose-li:text-foreground/85 prose-code:rounded prose-code:bg-secondary/60 prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
