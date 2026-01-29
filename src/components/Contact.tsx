"use client";

import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin, FaInstagram, FaFileAlt } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { FiMail, FiArrowUp } from "react-icons/fi";

export function Contact() {
  const socialLinks: {
    icon: IconType;
    label: string;
    href: string;
    ariaLabel: string;
    color: string;
  }[] = [
    {
      icon: FaGithub,
      label: "GitHub",
      href: "https://github.com/RishiAP",
      ariaLabel: "Visit my GitHub profile",
      color: "hover:text-gray-300 hover:border-gray-300/50 hover:shadow-gray-400/20",
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/rishi-the-programmer",
      ariaLabel: "Visit my LinkedIn profile",
      color: "hover:text-blue-300 hover:border-blue-400/50 hover:shadow-blue-400/20",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: "https://instagram.com/rishi_the_programmer",
      ariaLabel: "Visit my Instagram profile",
      color: "hover:text-pink-300 hover:border-pink-400/50 hover:shadow-pink-400/20",
    },
    {
      icon: FaFileAlt,
      label: "Resume",
      href: "https://rishiap.github.io/resume/resume.pdf",
      ariaLabel: "Download my resume",
      color: "hover:text-green-300 hover:border-green-400/50 hover:shadow-green-400/20",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="container py-16 md:py-24 px-4 md:px-6 relative scroll-mt-2">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 space-y-10">
        {/* Heading */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-green-400 font-mono text-sm mb-4">
            <FiMail />
            <span>~/contact</span>
            <span className="text-gray-500">$</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Let&apos;s Connect
          </h2>
          <p className="text-gray-300 md:text-lg max-w-2xl mx-auto">
            Interested in collaborating or just want to chat? Feel free to reach out through any of these platforms.
          </p>
        </div>

        {/* Social Links Grid */}
        <div className="flex justify-center flex-wrap gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              title={link.label}
              className={`group relative p-6 rounded-lg border border-green-400/20 bg-slate-900/50 backdrop-blur transition-all duration-300 ${link.color} hover:shadow-lg`}
            >
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: `radial-gradient(circle at center, var(--color-glow) 0%, transparent 70%)`}} />
              <div className="relative flex flex-col items-center gap-2">
                <link.icon className="text-3xl text-green-400 group-hover:scale-125 transition-transform duration-300" />
                <span className="font-mono text-sm text-gray-300">{link.label}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-6 pt-8 border-t border-green-400/10">
          <p className="text-center text-gray-400 font-mono text-sm">
            <span className="text-green-400">~/footer</span>
            <span className="text-gray-500"> $ </span>
            <span className="text-cyan-300">Made with React &amp; Next.js</span>
          </p>
          
          <Button
            onClick={scrollToTop}
            className="group bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-slate-950 font-semibold gap-2"
          >
            <FiArrowUp className="group-hover:-translate-y-1 transition-transform" />
            Back to Top
          </Button>
        </div>
      </div>
    </section>
  );
}
