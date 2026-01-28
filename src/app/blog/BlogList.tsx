'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full group"
          >
            <div className="
              h-full 
              flex flex-col 
              bg-card 
              border border-border 
              rounded-2xl 
              overflow-hidden
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-lg
              hover:border-primary
              cursor-pointer
            ">
              <div className="p-8 flex flex-col flex-grow">
                <div className="w-full flex justify-between items-center mb-6">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock size={14} className="mr-1" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-foreground leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-muted-foreground mb-8 text-base flex-grow leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="w-full flex justify-between items-center mt-auto pt-6 border-t border-border/50">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
