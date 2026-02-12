'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

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

      // Reset to idle after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto rounded-[2rem] bg-primary/5 border border-primary/20 overflow-hidden relative">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-primary/10">
              <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-6">Let&apos;s build something impactful</h2>
              <p className="text-muted-foreground mb-8">
                I&apos;m always open to discussing web/mobile development, data science projects, or how AI can be used for cultural preservation.
              </p>
              
              <div className="space-y-6">
                <a href="mailto:oselumeseagbonrofo@gmail.com" className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Email</div>
                    <div className="font-semibold">oselumeseagbonrofo@gmail.com</div>
                  </div>
                </a>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Availability</div>
                    <div className="font-semibold">Open for internships and collaborations</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="text-sm font-bold mb-2 block uppercase tracking-wider text-muted-foreground">Name</label>
                  <input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-bold mb-2 block uppercase tracking-wider text-muted-foreground">Email</label>
                  <input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-bold mb-2 block uppercase tracking-wider text-muted-foreground">Message</label>
                  <textarea 
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none disabled:opacity-50"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Status Feedback */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-500/10 px-4 py-3 rounded-xl"
                      role="alert"
                    >
                      <CheckCircle2 size={20} />
                      <span className="font-medium">Message sent successfully!</span>
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-500/10 px-4 py-3 rounded-xl"
                      role="alert"
                    >
                      <AlertCircle size={20} />
                      <span className="font-medium">{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
