'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    company: 'Tenece Professional Services Limited',
    role: 'Software Intern',
    period: 'Jul 2025 - Sep 2025',
    description:
      'Led a 5-person team to develop a full-stack web application that emerged as the best project among the internship cohort. Engineered the client-facing platform using Next.js, React, Tailwind CSS, and Framer Motion.',
    skills: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    company: 'Technology Innovation Club',
    role: 'President',
    period: 'Apr 2024 - Nov 2025',
    description:
      "Organized the university's first two hackathons, attracting 200+ attendees. Partnered with the IT department to co-develop campus-wide tech solutions.",
    skills: ['Leadership', 'Event Management', 'Product Strategy'],
  },
  {
    company: 'Lagos Business School',
    role: 'Program Management Intern',
    period: 'Jul 2024 - Sep 2024',
    description:
      "Automated outreach workflows and email targeting, improving outreach efficiency by 20%. Optimized the academy's event website to improve user engagement.",
    skills: ['Automation', 'Web Optimization', 'Data Analysis'],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section-shell">
      <div className="container-wide">
        <div className="mb-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="overline">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Work Experience
            </span>
            <h2 className="section-title mt-6 text-balance">Evidence from teams, programs, and shipped systems.</h2>
          </div>
          <p className="section-subtitle lg:justify-self-end">
            Every role strengthened one thing: turning ambiguous opportunities into clear products, measurable
            outcomes, and teams that execute well.
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-0 before:left-[1.1rem] before:top-2 before:w-px before:bg-border/80 md:before:left-[12.2rem]">
          {experiences.map((exp, idx) => (
            <motion.article
              key={exp.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              viewport={{ once: true, amount: 0.28 }}
              className="relative grid gap-3 md:grid-cols-[11.2rem_1fr] md:gap-6"
            >
              <div className="pl-9 pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:pl-0">
                {exp.period}
              </div>

              <div className="relative pl-9 md:pl-0">
                <span className="absolute left-[1.1rem] top-3 h-2.5 w-2.5 rounded-full border border-primary/60 bg-primary md:-left-[1.09rem]" />

                <div className="blueprint-card grain-panel rounded-[1.2rem] p-5 md:p-6">
                  <p className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-muted-foreground">{exp.company}</p>
                  <h3 className="mt-2 font-display text-3xl leading-[1.04]">{exp.role}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{exp.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border/80 bg-background/70 px-3 py-1.5 font-mono text-[0.63rem] uppercase tracking-[0.17em] text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
