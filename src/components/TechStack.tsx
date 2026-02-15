'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Layers,
  Terminal,
  Workflow,
} from 'lucide-react';

const techGroups = [
  {
    title: 'Languages',
    description: 'Core technical language stack used across production and research workflows.',
    techs: [
      { name: 'Python', icon: Code2 },
      { name: 'TypeScript / JavaScript', icon: FileCode2 },
      { name: 'SQL / PLpgSQL', icon: Database },
      { name: 'C / C#', icon: Terminal },
      { name: 'Bash', icon: Terminal },
    ],
  },
  {
    title: 'Web and Mobile',
    description: 'Delivery tooling for fast interfaces, APIs, and dependable user-facing products.',
    techs: [
      { name: 'Next.js / React', icon: Layers },
      { name: 'React Native', icon: Cpu },
      { name: 'Django / Flask', icon: Brain },
      { name: 'Supabase / Node.js', icon: Workflow },
    ],
  },
  {
    title: 'Tools and Data',
    description: 'Infrastructure and analytical layers for deployment, experimentation, and reporting.',
    techs: [
      { name: 'PostgreSQL', icon: Database },
      { name: 'TensorFlow / NumPy', icon: Brain },
      { name: 'Git / Docker', icon: Workflow },
      { name: 'Vercel / GCP', icon: Cloud },
    ],
  },
];

export default function TechStack() {
  return (
    <section className="section-shell">
      <div className="container-wide">
        <div className="mb-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <span className="overline">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Expertise and Tools
            </span>
            <h2 className="section-title mt-6 text-balance">A practical toolkit for shipping ideas fast.</h2>
          </div>
          <p className="section-subtitle lg:justify-self-end">
            I combine full-stack engineering, machine learning, and product operations to choose tooling based on
            outcomes, not trends.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {techGroups.map((group, groupIndex) => (
            <motion.article
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: groupIndex * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="blueprint-card grain-panel rounded-[1.4rem] p-6 md:p-7"
            >
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.27em] text-muted-foreground">{group.title}</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{group.description}</p>

              <div className="mt-6 space-y-2.5">
                {group.techs.map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: groupIndex * 0.12 + techIndex * 0.05 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex items-center gap-3 rounded-[0.95rem] border border-border/75 bg-background/60 px-3 py-3 transition-colors hover:border-primary/45 hover:bg-primary/10"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.7rem] bg-secondary/70 text-primary">
                      <tech.icon size={16} />
                    </span>
                    <span className="text-sm font-medium leading-tight text-foreground/92">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
