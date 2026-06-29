"use client";

import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { Github, Twitter, Linkedin, Mail, ArrowRight, GitCommit, Star } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface GithubRepo {
  url: string;
  name: string;
  stars: number;
  description: string;
  lastPushed: string;
}

interface HeroSectionProps {
  stressRepo?: GithubRepo;
  parkingRepo?: GithubRepo;
}

export function HeroSection({ stressRepo, parkingRepo }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
            Available for new opportunities
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Rishi</span>
            <br />
            <span className="text-foreground/80 h-[80px] md:h-[100px] block">
              <Typewriter
                words={['Full Stack Developer', 'Open Source Contributor', 'UI/UX Enthusiast', 'Tech Writer']}
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
            I build exceptional and accessible digital experiences for the web.
            Passionate about modern architecture, beautiful design, and clean code.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              href="#projects" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              View My Work
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <div className="flex items-center gap-4 ml-4">
              <a href="https://github.com/RishiAP" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://twitter.com/rishicodes" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://linkedin.com/in/rishiap" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Live System Status Block */}
        {(stressRepo || parkingRepo) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:flex flex-col gap-4 absolute right-0 top-1/2 -translate-y-1/2 w-80"
          >
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Live System Status
            </div>

            {stressRepo && (
              <a href={stressRepo.url} target="_blank" rel="noreferrer" className="group block p-4 rounded-xl border bg-card/50 backdrop-blur-md hover:bg-card/80 transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{stressRepo.name}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    {stressRepo.stars}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {stressRepo.description}
                </p>
                <div className="flex items-center text-xs text-primary/80">
                  <div className="flex items-center text-zinc-500">
                  <GitCommit className="h-3 w-3 mr-1" />
                  Last push: <span suppressHydrationWarning className="ml-1">{formatDate(stressRepo.lastPushed)}</span>
                  </div>
                </div>
              </a>
            )}

            {parkingRepo && (
              <a href={parkingRepo.url} target="_blank" rel="noreferrer" className="group block p-4 rounded-xl border bg-card/50 backdrop-blur-md hover:bg-card/80 transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{parkingRepo.name}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    {parkingRepo.stars}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {parkingRepo.description}
                </p>
                <div className="flex items-center text-xs text-primary/80">
                  <div className="flex items-center text-zinc-500">
                  <GitCommit className="h-3 w-3 mr-1" />
                  Last push: <span suppressHydrationWarning className="ml-1">{formatDate(parkingRepo.lastPushed)}</span>
                  </div>
                </div>
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
