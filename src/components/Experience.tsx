'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    company: 'Tenece Professional Services Limited',
    role: 'Software Intern',
    period: 'Jul 2025 - Sep 2025',
    description: 'Led a 5-person team to develop a full-stack web application that emerged as the best project among the internship cohort. Engineered the client-facing platform using NextJS, ReactJS, Tailwind CSS and Framer Motion.',
    skills: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion']
  },
  {
    company: 'Technology Innovation Club',
    role: 'President',
    period: 'Apr 2024 - Nov 2025',
    description: "Organised the university's first 2 hackathons, attracting 200+ attendees. Partnered with the IT department to co-develop campus-wide tech solutions.",
    skills: ['Leadership', 'Event Management', 'Product Strategy']
  },
  {
    company: 'Lagos Business School',
    role: 'Program Management Intern',
    period: 'Jul 2024 - Sep 2024',
    description: "Automated outreach workflows and email targeting, improving outreach efficiency by 20%. Optimised the academy's event website to enhance user engagement.",
    skills: ['Automation', 'Web Optimization', 'Data Analysis']
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-6 text-foreground">Work Experience</h2>
          <p className="text-lg text-muted-foreground">
            A track record of solving complex problems at scale and contributing to scientific advancement.
          </p>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0 border-l border-border md:border-l-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-12">
                <div className="text-muted-foreground font-medium pt-1">
                  {exp.period}
                </div>
                <div className="relative">
                  {/* Desktop dot */}
                  <div className="hidden md:block absolute -left-6 top-2.5 w-2 h-2 rounded-full bg-primary" />
                  
                  <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                  <div className="text-primary font-semibold mb-3">{exp.company}</div>
                  <p className="text-muted-foreground max-w-2xl leading-relaxed mb-6">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-secondary rounded-full text-xs font-medium border border-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
