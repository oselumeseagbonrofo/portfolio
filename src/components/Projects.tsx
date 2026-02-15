'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

const projects = [
  {
    title: 'Groove',
    category: 'Frontend Development',
    description:
      'Engineered the client-facing platform using NextJS, ReactJS, Tailwind CSS and Framer Motion to automate the booking of landscaping services and streamline the customer workflow.',
    tags: ['NextJS', 'ReactJS', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://groove-inky.vercel.app',
    github: 'https://github.com/oselumeseagbonrofo/groove',
  },
  {
    title: 'Garden Gems',
    category: 'Frontend Development',
    description:
      'Engineered the client-facing platform using NextJS, ReactJS, Tailwind CSS and Framer Motion to automate the booking of landscaping services and streamline the customer workflow.',
    tags: ['NextJS', 'ReactJS', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://garden-gems.vercel.app',
    github: 'https://github.com/123johnpaul/garden-gems',
  },
  {
    title: 'Pro League Manager',
    category: 'Full-Stack Web',
    description:
      'A comprehensive platform for managing online tournaments and leagues, featuring knockout handling, tournament configuration, and admin tooling.',
    tags: ['Next.js', 'Supabase', 'TypeScript', 'PostgreSQL'],
    link: 'https://pro-league-ashen.vercel.app',
    github: 'https://github.com/oselumeseagbonrofo/pro-league',
  },
  {
    title: 'Book Donation Web App',
    category: 'Web Development',
    description:
      'A full-stack platform for a non-profit organization to facilitate book donations and reception, backed by a robust relational database.',
    tags: ['Django', 'PostgreSQL', 'Python', 'Bootstrap'],
    link: 'https://bookme-rho.vercel.app',
    github: 'https://github.com/oselumeseagbonrofo/BookMe',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="section-shell">
      <div className="container-wide">
        <div className="mb-14 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="overline">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Selected Projects
            </span>
            <h2 className="section-title mt-6 text-balance">Product work across web, mobile, and data pipelines.</h2>
            <p className="section-subtitle mt-5">
              A curated set of builds where architecture, usability, and delivery speed were all non-negotiable.
            </p>
          </div>

          <Link href="https://github.com/oselumeseagbonrofo" target="_blank" rel="noopener noreferrer" className="story-link">
            See all repositories
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-6">
          {projects.map((project, idx) => {
            const featured = idx === 0;

            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                viewport={{ once: true, amount: 0.28 }}
                className={`blueprint-card grain-panel flex flex-col rounded-[1.35rem] border-border/85 p-6 md:p-7 ${
                  featured ? 'lg:col-span-4' : 'lg:col-span-2'
                }`}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span className="rounded-full border border-primary/35 bg-primary/12 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-primary">
                    {project.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-[0.8rem] border border-border/75 bg-background/70 text-muted-foreground transition-colors hover:border-primary/45 hover:text-primary"
                      aria-label={`${project.title} GitHub`}
                    >
                      <Github size={16} />
                    </Link>
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-[0.8rem] border border-border/75 bg-background/70 text-muted-foreground transition-colors hover:border-primary/45 hover:text-primary"
                      aria-label={`${project.title} external link`}
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>

                <h3 className={`font-display leading-[1.03] text-balance ${featured ? 'text-4xl md:text-[2.55rem]' : 'text-3xl'}`}>
                  {project.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/80 bg-background/70 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
