'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const quickFacts = [
  { value: '2+', label: 'Hackathons launched' },
  { value: '5', label: 'Team members led' },
  { value: '20%', label: 'Workflow efficiency gain' },
];

const focusAreas = [
  'Culture-preserving digital products',
  'Applied machine learning with clear outcomes',
  'Web systems built for resilience and speed',
];

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/oselumeseagbonrofo',
    icon: Github,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/oselumese-agbonrofo',
    icon: Linkedin,
  },
  {
    label: 'Email',
    href: 'mailto:oselumeseagbonrofo@gmail.com',
    icon: Mail,
  },
];

export default function Hero() {
  return (
    <section id="about" className="section-shell pt-28 md:pt-36">
      <div className="container-wide">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative"
          >
            <span className="overline">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Product Manager and Data Scientist
            </span>

            <h1 className="section-title mt-6 max-w-4xl text-balance">
              Building technology that protects culture and proves impact.
            </h1>

            <p className="section-subtitle mt-6">
              I am Oselumese Agbonrofo, a Pan-Atlantic University student focused on data science, AI, and modern web
              engineering. I shape practical products where research clarity meets execution speed.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 rounded-[0.95rem] border border-primary/60 bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                View Projects
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/Oselumese%20Agbonrofo%20resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[0.95rem] border border-border/85 bg-card/80 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary/45 hover:text-primary"
              >
                View Resume
                <Download size={17} />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/75 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.17em] text-muted-foreground transition-[transform,color,border-color] hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {quickFacts.map((fact, index) => (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.08, duration: 0.45 }}
                  className="blueprint-card grain-panel rounded-[1.05rem] px-4 py-4"
                >
                  <p className="font-display text-3xl leading-none text-primary">{fact.value}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{fact.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="relative"
          >
            <div className="blueprint-card grain-panel rounded-[1.5rem] border border-border/85 p-7 md:p-8">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.29em] text-muted-foreground">Current Focus</p>
              <h2 className="mt-5 max-w-sm font-display text-3xl leading-[1.03] text-balance md:text-[2.3rem]">
                Designing digital infrastructure for African stories and communities.
              </h2>

              <ul className="mt-6 space-y-4">
                {focusAreas.map((area) => (
                  <li key={area} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-[1rem] border border-border/80 bg-secondary/40 px-4 py-4">
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.25em] text-muted-foreground">Now Building</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  Human-centered web apps with expressive interfaces and measurable product signals.
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-36 w-36 rounded-full bg-accent/25 blur-3xl" />
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
