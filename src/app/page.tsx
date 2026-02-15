'use client';

import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Hero />
      <TechStack />
      <Experience />
      <Projects />
      <Contact />
    </div>
  );
}
