"use client";
import Link from "next/link";
import Image from "next/image";
import { FaBars } from "react-icons/fa";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function Navbar() {
  const menuItems = [
    { label: "Intro", href: "#intro" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-400/20 bg-slate-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/80 shadow-lg shadow-green-400/5">
      <div className="container flex h-16 items-center justify-between m-auto px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 focus:outline-none">
          <div className="relative p-1.5 rounded-lg border-2 border-green-400/40 bg-gradient-to-br from-green-400/10 to-cyan-400/10 group-hover:border-green-400/80 group-hover:shadow-lg group-hover:shadow-green-400/30 transition-all duration-300 group-hover:scale-110">
            <Image src="/favicon-32x32.png" alt="Logo" width={32} height={32} className="rounded-md" />
          </div>
          <span className="hidden sm:inline font-mono font-bold text-green-400 group-hover:text-cyan-400 transition-colors">
            ./portfolio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group/nav relative px-4 py-2 text-green-300 hover:text-cyan-400 font-mono text-sm transition-all duration-500 ease-out rounded-lg overflow-hidden hover:scale-105"
            >
              {/* Background gradient on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-cyan-400/10 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500"></span>
              
              {/* Bottom border animation */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-cyan-400 group-hover/nav:w-full transition-all duration-500 ease-out"></span>
              
              {/* Content */}
              <span className="relative flex items-center">
                <span className="text-gray-500 mr-1 group-hover/nav:text-cyan-400 transition-colors duration-300">~/</span>
                {item.label.toLowerCase()}
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile Sidebar Sheet */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="text-xl text-green-400 focus:outline-none hover:text-cyan-400 transition-colors"
                aria-label="Open menu"
              >
                <FaBars />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-950 border-green-400/20 w-64">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <SheetDescription className="hidden">Portfolio navigation menu</SheetDescription>
              <div className="flex flex-col gap-4 mt-8">
                <h2 className="text-green-400 font-mono font-bold text-lg">~/menu</h2>
                <nav className="flex flex-col gap-3">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group/item px-4 py-3 text-green-300 hover:text-cyan-400 hover:bg-green-400/10 font-mono text-sm transition-all duration-300 rounded border border-green-400/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-green-400/20 hover:translate-x-1"
                    >
                      <span className="text-gray-500 mr-2 group-hover/item:text-cyan-400">~/</span>
                      {item.label.toLowerCase()}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
