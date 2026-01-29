'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUp, ExternalLink } from 'lucide-react';

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
    <footer className="relative mt-20 pb-10">
      <div className="container-wide">
        {/* Main Footer Island */}
        <div className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 dark:border-white/5 relative overflow-hidden shadow-2xl shadow-primary/5">
          {/* Background Decorative Element */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
            {/* Brand Section */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center space-x-3 group">
                <motion.div 
                  whileHover={{ rotate: 180 }}
                  className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <span className="text-white font-bold text-xl">O</span>
                </motion.div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight">Oselumese Agbonrofo</span>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Available for new opportunities</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Combining data science and product management to create impactful digital experiences. 
                Always pushing the boundaries of what's possible with code and culture.
              </p>
              <div className="flex space-x-4">
                {socials.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    className="p-3 rounded-full bg-secondary/50 hover:bg-primary hover:text-white transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-6">
              <h3 className="font-bold text-sm uppercase tracking-widest text-foreground/50">Navigation</h3>
              <ul className="space-y-4">
                {footerNav.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center group text-sm font-medium"
                    >
                      {item.name}
                      <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Section */}
            <div className="md:col-span-4 space-y-6">
              <h3 className="font-bold text-sm uppercase tracking-widest text-foreground/50">Get in touch</h3>
              <div className="bg-secondary/30 rounded-3xl p-6 border border-white/5 space-y-4">
                <p className="text-sm font-medium">Have a project in mind or just want to chat?</p>
                <Link
                  href="mailto:oselumeseagbonrofo@gmail.com"
                  className="block w-full py-3 px-6 rounded-2xl bg-foreground text-background font-bold text-center hover:opacity-90 transition-opacity"
                >
                  Say Hello
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-muted-foreground font-medium">
              © {currentYear} • An Oselumese Agbonrofo Production
            </div>
            
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
            >
              <span>Back to Top</span>
              <div className="p-2 rounded-full bg-secondary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:-translate-y-1">
                <ArrowUp size={16} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
