"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Typewriter } from 'react-simple-typewriter'
import { FiArrowRight, FiDownload } from "react-icons/fi";

export function Hero() {
  return (
    <section id="intro" className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 md:px-6 relative scroll-mt-2">
      {/* Terminal-style background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container flex flex-col-reverse md:flex-row items-center text-center md:text-left relative z-10 gap-8 md:gap-12 w-full">        {/* Left Side - Text */}
        <div className="space-y-5 md:w-[60%]">
          {/* Terminal prompt indicator */}
          <div className="flex items-center gap-2 text-green-400 font-mono text-sm md:justify-start justify-center">
            <span className="text-green-400">~/portfolio</span>
            <span className="text-gray-500">$</span>
            <span className="text-cyan-400">whoami</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight">
              <Typewriter 


                words={["Hello there!", "I'm Debjyoti", 'Full Stack Developer', "Let's build together!"]} 
                loop={false} 
                cursor={true} 
                cursorStyle='_' 
                typeSpeed={40} 
                deleteSpeed={30} 
                delaySpeed={1500} 
              />
            </h1>
            <div className="space-y-2.5">
              <p className="text-lg text-gray-300 leading-relaxed">
                Full-stack developer crafting modern web applications with <span className="text-cyan-400 font-semibold">React, Next.js, and Node.js</span>. Coming from a <span className="text-orange-400 font-semibold">Java</span> background, I bring strong fundamentals to every project.
              </p>
              <p className="text-base text-gray-400 leading-relaxed">
                Sometimes working with <span className="text-green-400 font-semibold">Python Flask</span> for backend development. I love building scalable solutions and turning ideas into reality.
              </p>
            </div>
          </div>

          {/* Tech stack showcase */}
          <div className="flex flex-wrap gap-2 md:justify-start justify-center">
            <span className="text-xs font-mono bg-cyan-400/10 text-cyan-300 px-3 py-1.5 rounded border border-cyan-400/30">React</span>
            <span className="text-xs font-mono bg-blue-400/10 text-blue-300 px-3 py-1.5 rounded border border-blue-400/30">Next.js</span>
            <span className="text-xs font-mono bg-green-400/10 text-green-300 px-3 py-1.5 rounded border border-green-400/30">Node.js</span>
            <span className="text-xs font-mono bg-purple-400/10 text-purple-300 px-3 py-1.5 rounded border border-purple-400/30">TypeScript</span>
            <span className="text-xs font-mono bg-orange-400/10 text-orange-300 px-3 py-1.5 rounded border border-orange-400/30">Java</span>
            <span className="text-xs font-mono bg-emerald-400/10 text-emerald-300 px-3 py-1.5 rounded border border-emerald-400/30">Flask</span>
          </div>

          <div className="flex md:justify-start justify-center gap-4">
            <Link href="#projects">
              <Button size="lg" className="group bg-green-600 hover:bg-green-700 border border-green-400/30">
                <span>View Projects</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" asChild className="border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10">
              <Link href="https://rishiap.github.io/resume/resume.pdf" target="_blank">
                <FiDownload className="mr-2" />
                CV
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Side - Avatar */}
        <div className="md:w-[40%] flex justify-center relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none"></div>
          <img 
            src="https://res.cloudinary.com/dnxfq38fr/image/upload/v1769608813/MyPic_jpox82.png" 
            width={400}
            height={400}
            className="relative rounded-full md:max-w-sm max-w-[280px] h-auto object-cover transition-all duration-500" 
            alt="Debjyoti"
          />
        </div>
      </div>
    </section>
  );
}
