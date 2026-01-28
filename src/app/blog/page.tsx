import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { BlogList } from './BlogList';

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Deployment & Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Production-ready thoughts on machine learning, engineering, and data strategy.
            </p>
        </div>

        <BlogList posts={posts} />
      </div>
    </div>
  );
}
