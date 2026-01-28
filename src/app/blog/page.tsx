'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const posts = [
    {
        id: 1,
        title: 'Deploying ML Models with Docker and Kubernetes',
        excerpt: 'A comprehensive guide to containerizing your machine learning applications and orchestrating them for scale.',
        date: 'Nov 15, 2023',
        readTime: '8 min read',
        category: 'DevOps',
        slug: 'deploying-ml-models'
    },
    {
        id: 2,
        title: 'Understanding Attention Mechanisms in Transformers',
        excerpt: 'Deep dive into the mathematics and intuition behind the self-attention mechanism that powers modern LLMs.',
        date: 'Oct 28, 2023',
        readTime: '12 min read',
        category: 'Deep Learning',
        slug: 'attention-mechanisms'
    },
    {
        id: 3,
        title: 'Feature Engineering for Time Series Data',
        excerpt: 'Techniques and strategies for extracting meaningful features from temporal data to improve model performance.',
        date: 'Sep 10, 2023',
        readTime: '10 min read',
        category: 'Data Science',
        slug: 'time-series-features'
    }
];

export default function Blog() {
    return (
        <div className="min-h-screen bg-background py-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                            Deployment & Insights
                        </h2>
                        <h5 className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Production-ready thoughts on machine learning, engineering, and data strategy.
                        </h5>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <div key={post.id} className="h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="h-full"
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
                                    group
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

                                        <h5 className="text-2xl font-bold mb-4 text-foreground leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h5>

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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
