'use client';

import * as React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 border-t border-border/40">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-primary font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Oselumese Agbonrofo</span>
          </div>
          
          <div className="flex space-x-8 text-sm font-medium text-muted-foreground">
            <Link href="#about" className="hover:text-primary transition-colors">About</Link>
            <Link href="#experience" className="hover:text-primary transition-colors">Experience</Link>
            <Link href="#projects" className="hover:text-primary transition-colors">Projects</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {currentYear} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
