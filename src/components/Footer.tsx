'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUp, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo';

const footerNav = [
  { name: 'About', href: '/#about' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Blog', href: '/blog' },
];

const socials = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/oselumeseagbonrofo' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/oselumese-agbonrofo' },
  { name: 'Email', icon: Mail, href: 'mailto:oselumeseagbonrofo@gmail.com' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pb-10 pt-12">
      <div className="container-wide">
        <div className="blueprint-card grain-panel rounded-[1.8rem] border-border/85 p-6 md:p-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.85fr_0.85fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <Logo className="h-11 w-11" />
                <div>
                  <p className="font-display text-[1.5rem] leading-none">Oselumese Agbonrofo</p>
                  <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">
                    Product + Data + Culture
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                Building thoughtful software systems where cultural relevance and technical precision can coexist.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {socials.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/75 bg-background/70 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/45 hover:text-primary"
                    aria-label={social.name}
                  >
                    <social.icon size={14} />
                    {social.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">Navigation</p>
              <ul className="mt-4 space-y-2.5">
                {footerNav.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground/85 transition-colors hover:text-primary"
                    >
                      {item.name}
                      <ExternalLink size={13} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">Ready to collaborate?</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                If you are building for social impact, AI adoption, or product scale, I would love to hear from you.
              </p>

              <Link
                href="/#contact"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[0.95rem] border border-primary/60 bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start a conversation
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border/80 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
            <p className="font-medium">{currentYear} Oselumese Agbonrofo. Crafted with intention.</p>

            <button
              onClick={scrollToTop}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/75 bg-background/70 px-3 py-1.5 font-semibold uppercase tracking-[0.15em] transition-colors hover:border-primary/45 hover:text-primary"
            >
              Back to top
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
