'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const projects = [
  {
    title: 'Pro League Manager',
    category: 'Full-Stack Web',
    description: 'A comprehensive platform for managing online tournaments and leagues, featuring knockout handling, tournament configuration, and admin tools.',
    tags: ['Next.js', 'Supabase', 'TypeScript', 'PostgreSQL'],
    link: 'https://pro-league-ashen.vercel.app',
    github: 'https://github.com/oselumeseagbonrofo/pro-league'
  },
  {
    title: 'Dental Clinic Mobile App',
    category: 'Mobile Development',
    description: 'A cross-platform app with offline persistence using Expo SQLite for managing patient records and clinic visitations.',
    tags: ['React Native', 'Expo Router', 'SQLite', 'TypeScript'],
    link: 'https://github.com/oselumeseagbonrofo/Dental-Clinic-App',
    github: 'https://github.com/oselumeseagbonrofo/Dental-Clinic-App'
  },
  {
    title: 'Book Donation Web App',
    category: 'Web Development',
    description: 'Full-stack platform for a non-profit organization to facilitate book donations and reception, featuring a robust relational database.',
    tags: ['Django', 'PostgreSQL', 'Python', 'Bootstrap'],
    link: 'https://bookme-rho.vercel.app',
    github: 'https://github.com/oselumeseagbonrofo/BookMe'
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-card">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-6">Recent Projects</h2>
            <p className="text-lg text-muted-foreground">
              A selection of my technical work spanning software engineering, 
              mobile development, and data science.
            </p>
          </div>
          <Link 
            href="https://github.com/oselumeseagbonrofo" 
            className="inline-flex items-center text-primary font-bold hover:underline"
          >
            See all repositories <ArrowUpRight size={20} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col bg-background p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl"
            >
              <div className="mb-6 flex justify-between items-start">
                <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                  {project.category}
                </span>
                <div className="flex space-x-2">
                  <Link href={project.github} className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Github size={20} />
                  </Link>
                  <Link href={project.link} className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink size={20} />
                  </Link>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
