'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Brain, 
  Layers, 
  Terminal, 
  Cpu, 
  BarChart3, 
  Workflow,
  Cloud,
  FileCode2
} from 'lucide-react';

const techGroups = [
  {
    title: 'Languages',
    techs: [
      { name: 'Python', icon: <Code2 size={24} /> },
      { name: 'TypeScript / JS', icon: <FileCode2 size={24} /> },
      { name: 'SQL / PLpgSQL', icon: <Database size={24} /> },
      { name: 'C / C#', icon: <Terminal size={24} /> },
      { name: 'Bash', icon: <Terminal size={24} /> },
    ]
  },
  {
    title: 'Web & Mobile',
    techs: [
      { name: 'Next.js / React', icon: <Layers size={24} /> },
      { name: 'React Native', icon: <Cpu size={24} /> },
      { name: 'Django / Flask', icon: <Brain size={24} /> },
      { name: 'Supabase / Node.js', icon: <Workflow size={24} /> },
    ]
  },
  {
    title: 'Tools & Data',
    techs: [
      { name: 'PostgreSQL', icon: <Database size={24} /> },
      { name: 'Tensorflow / Numpy', icon: <Brain size={24} /> },
      { name: 'Git / Docker', icon: <Workflow size={24} /> },
      { name: 'Vercel / GCP', icon: <Cloud size={24} /> },
    ]
  }
];

export default function TechStack() {
  return (
    <section id="about" className="py-24 bg-card">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-6">Expertise & Tools</h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive toolkit built over years of research and industrial practice. 
            I focus on selecting the right tool for the job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {techGroups.map((group, groupIdx) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">
                {group.title}
              </h3>
              <div className="space-y-4">
                {group.techs.map((tech, idx) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (groupIdx * 4 + idx) * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4 p-4 rounded-xl border border-border/50 hover:bg-secondary transition-colors"
                  >
                    <div className="text-primary">{tech.icon}</div>
                    <span className="font-semibold">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
