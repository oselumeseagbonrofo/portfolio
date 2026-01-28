'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="container-wide">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary font-bold tracking-wider text-sm uppercase mb-4">
              Software Engineer & AI Enthusiast
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-outfit text-balance">
              Leveraging technology to <span className="text-primary">preserve culture.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Hi, I'm Oselumese Agbonrofo. A student at Pan-Atlantic University passionate about Data Science, 
              AI, and Web Development. I build solutions that merge innovation with impact.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="#projects"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-all group shadow-lg shadow-primary/25"
              >
                View Projects
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/resume.pdf"
                target="_blank"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border hover:bg-secondary transition-all font-semibold"
              >
                View Resume
                <Download size={18} className="ml-2" />
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <Link href="https://github.com/oselumeseagbonrofo" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={24} />
              </Link>
              <Link href="https://linkedin.com/in/oselumese-agbonrofo" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={24} />
              </Link>
              <Link href="mailto:oselumeseagbonrofo@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail size={24} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative SVG grid */}
      <div className="absolute inset-0 -z-50 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-10 blur-[100px]"></div>
      </div>
    </section>
  );
}
