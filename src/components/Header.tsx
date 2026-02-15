'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';

const navItems = [
  { name: 'About', href: '/#about', id: 'about' },
  { name: 'Experience', href: '/#experience', id: 'experience' },
  { name: 'Projects', href: '/#projects', id: 'projects' },
  { name: 'Blog', href: '/blog', id: 'blog' },
  { name: 'Contact', href: '/#contact', id: 'contact' },
];

export function Header() {
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>('about');
  const [scrolled, setScrolled] = React.useState(false);

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 20);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  React.useEffect(() => {
    if (pathname === '/blog') {
      setActiveSection('blog');
      return;
    }

    if (pathname !== '/') {
      setActiveSection('about');
      return;
    }

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
    }

    const sectionIds = navItems
      .map((item) => item.id)
      .filter((id) => id !== 'blog');

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.2, 0.4, 0.6],
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:px-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`mx-auto flex w-full max-w-[1240px] items-center justify-between rounded-[1.3rem] border px-3 py-3 backdrop-blur-xl transition-colors duration-300 ${
          scrolled
            ? 'border-border/85 bg-background/92'
            : 'border-border/70 bg-background/78'
        }`}
      >
        <Link href="/" className="group flex min-h-11 items-center gap-3">
          <Logo className="h-10 w-10" />
          <div className="hidden min-w-0 sm:block">
            <p className="font-display text-[1.08rem] leading-none tracking-tight">Oselumese Agbonrofo</p>
            <p className="mt-1 font-mono text-[0.63rem] uppercase tracking-[0.28em] text-muted-foreground">
              Product x Data
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-[0.95rem] border border-border/80 bg-secondary/40 p-1 lg:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative inline-flex min-h-11 items-center rounded-[0.72rem] px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                {isActive ? (
                  <motion.span
                    layoutId="header-active-item"
                    className="absolute inset-0 rounded-[0.72rem] border border-primary/25 bg-primary/10"
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  />
                ) : null}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[0.9rem] border border-border/80 bg-secondary/45 text-foreground transition-colors hover:bg-primary/15"
            aria-label="Toggle theme"
          >
            <motion.span
              initial={false}
              animate={{ rotate: theme === 'dark' ? 0 : 180 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </motion.span>
          </button>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[0.9rem] border border-border/80 bg-secondary/45 text-foreground transition-colors hover:bg-primary/15 lg:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen ? (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 -z-10 bg-background/70 backdrop-blur-sm lg:hidden"
                aria-label="Close menu overlay"
              />

              <motion.nav
                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-0 top-[calc(100%+0.8rem)] mx-auto w-[calc(100%-0.5rem)] rounded-[1.2rem] border border-border/85 bg-card/97 p-3 lg:hidden"
              >
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`rounded-[0.8rem] px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] transition-colors ${
                          isActive
                            ? 'bg-primary/14 text-primary'
                            : 'text-foreground/85 hover:bg-secondary/60 hover:text-foreground'
                        }`}
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </motion.nav>
            </>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
