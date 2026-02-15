'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Mail, MessageCircle, Send } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');

      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <section id="contact" className="section-shell pb-10">
      <div className="container-wide">
        <div className="blueprint-card grain-panel overflow-hidden rounded-[1.7rem] border-border/85">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative border-b border-border/80 px-6 py-8 md:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
              <div className="pointer-events-none absolute -left-14 top-0 h-40 w-40 rounded-full bg-primary/18 blur-3xl" />

              <span className="overline">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Let&apos;s Build
              </span>
              <h2 className="section-title mt-6 text-balance text-[2.4rem] md:text-5xl">
                Open to internships and high-impact collaborations.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Tell me about your product idea, team challenge, or data workflow. I reply quickly when the mission is
                clear and meaningful.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href="mailto:oselumeseagbonrofo@gmail.com"
                  className="flex items-start gap-3 rounded-[1rem] border border-border/75 bg-background/65 px-4 py-3 transition-colors hover:border-primary/45"
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-[0.75rem] bg-primary/12 text-primary">
                    <Mail size={16} />
                  </span>
                  <span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">Email</span>
                    <span className="mt-1 block text-sm font-medium text-foreground">oselumeseagbonrofo@gmail.com</span>
                  </span>
                </a>

                <div className="flex items-start gap-3 rounded-[1rem] border border-border/75 bg-background/65 px-4 py-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-[0.75rem] bg-accent/15 text-accent">
                    <MessageCircle size={16} />
                  </span>
                  <span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">Availability</span>
                    <span className="mt-1 block text-sm font-medium text-foreground">Open for product and engineering internships</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-8 md:px-8 lg:px-10 lg:py-10">
              <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                      disabled={status === 'loading'}
                      className="form-field"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      inputMode="email"
                      required
                      disabled={status === 'loading'}
                      className="form-field"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    autoComplete="off"
                    required
                    disabled={status === 'loading'}
                    className="form-field resize-none"
                    placeholder="Tell me about your project and timeline…"
                  />
                </div>

                <div aria-live="polite" aria-atomic="true">
                  <AnimatePresence mode="wait">
                    {status === 'success' ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2 rounded-[0.95rem] border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
                      >
                        <CheckCircle2 size={17} />
                        Message sent successfully.
                      </motion.div>
                    ) : null}

                    {status === 'error' ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2 rounded-[0.95rem] border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
                      >
                        <AlertCircle size={17} />
                        {errorMessage}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[1rem] border border-primary/60 bg-primary px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
