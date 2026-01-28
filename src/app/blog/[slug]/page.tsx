import { getPostBySlug, getPostSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const post = await getPostBySlug(slug);

    return (
      <article className="min-h-screen bg-background py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-12 group"
          >
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <header className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar size={16} className="mr-1" />
                {post.date}
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock size={16} className="mr-1" />
                {post.readTime}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              {post.excerpt}
            </p>
          </header>

          <div 
            className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline
              prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>
      </article>
    );
  } catch (error) {
    notFound();
  }
}
