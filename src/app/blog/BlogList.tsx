'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post, index) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.42 }}
            className="blueprint-card grain-panel flex h-full flex-col rounded-[1.2rem] p-6 transition-transform duration-300 group-hover:-translate-y-1"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="rounded-full border border-primary/35 bg-primary/12 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-primary">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={13} />
                {post.readTime}
              </span>
            </div>

            <h3 className="font-display text-[2rem] leading-[1.06] text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h3>

            <p className="mt-4 flex-grow text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>

            <div className="mt-6 flex items-center justify-between border-t border-border/75 pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.13em] text-primary transition-transform group-hover:translate-x-0.5">
                Read
                <ArrowRight size={14} />
              </span>
            </div>
          </motion.article>
        </Link>
      ))}
    </div>
  );
}
