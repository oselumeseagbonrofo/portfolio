'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto rounded-[2rem] bg-primary/5 border border-primary/20 overflow-hidden relative">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-primary/10">
              <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-6">Let's build something impactful</h2>
                <p className="text-muted-foreground mb-8">
                  I'm always open to discussing web/mobile development, data science projects, or how AI can be used for cultural preservation.
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
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-sm font-bold mb-2 block uppercase tracking-wider text-muted-foreground">Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block uppercase tracking-wider text-muted-foreground">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 group">
                  <span>Send Message</span>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
