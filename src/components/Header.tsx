'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
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
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [activeSection, setActiveSection] = React.useState<string>('');
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const headerY = useTransform(scrollY, [0, 50], [20, 10]);
  const headerWidth = useTransform(scrollY, [0, 50], ['95%', '90%']);
  const headerPadding = useTransform(scrollY, [0, 50], ['1rem 2rem', '0.6rem 1.5rem']);
  
  // Track active section on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (pathname !== '/') return;
    
    const sections = navItems.filter(item => item.id !== 'blog').map(item => item.id);
    for (const section of sections.reverse()) {
      const element = document.getElementById(section);
      if (element && latest >= element.offsetTop - 100) {
        setActiveSection(section);
        break;
      }
    }
  });

  React.useEffect(() => {
    if (pathname === '/blog') setActiveSection('blog');
    else if (pathname === '/') {
      // Set initial active section
      const hash = window.location.hash.replace('#', '');
      if (hash) setActiveSection(hash);
    }
    setMounted(true);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <motion.header
      style={{
        y: headerY,
        width: headerWidth,
        padding: headerPadding,
      }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-50 glass rounded-full flex items-center justify-between shadow-2xl shadow-primary/5 border border-white/10 dark:border-white/5"
    >
      <div className="flex items-center space-x-2 group shrink-0 ml-2">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="w-9 h-9" />
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Oselumese Agbonrofo
          </span>
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center bg-secondary/20 backdrop-blur-sm rounded-full px-1.5 py-1 relative border border-white/5">
        {navItems.map((item, index) => {
          const isActive = activeSection === item.id;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 z-10 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setActiveSection(item.id)}
            >
              {item.name}
              {hoveredIndex === index && (
                <motion.div
                  layoutId="nav-hover"
                  className="absolute inset-0 bg-background/80 dark:bg-white/5 rounded-full shadow-sm -z-10"
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full z-20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center space-x-2 mr-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-full hover:bg-secondary/80 transition-all relative group overflow-hidden border border-transparent hover:border-white/10"
          aria-label="Toggle theme"
        >
          <motion.div
            initial={false}
            animate={{ 
              rotate: theme === 'dark' ? 0 : 180,
              scale: [1, 0.8, 1],
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center justify-center text-foreground"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.div>
        </button>

        {/* Mobile Nav Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2.5 rounded-full hover:bg-secondary/80 transition-colors border border-transparent hover:border-white/10"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/20 backdrop-blur-sm z-[-1] md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="absolute top-full left-0 right-0 mt-4 mx-2 p-3 glass rounded-[2rem] md:hidden overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      setActiveSection(item.id);
                    }}
                    className={`px-5 py-4 rounded-2xl text-lg font-medium transition-all ${
                      activeSection === item.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-secondary/50 text-foreground/80 hover:text-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
