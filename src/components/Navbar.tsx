"use client";
import { useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const menuItems = ["Intro", "Skills", "Projects", "Contact"];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between m-auto px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          <Image src="/RishiLogo.png" alt="Logo" width={48} height={48} />
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          className="lg:hidden text-xl text-primary focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Menu */}
        <nav
          className={`lg:block ${
            isMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-background lg:static lg:w-auto`}
        >
          <NavigationMenu className="lg:flex">
            <NavigationMenuList className="lg:flex lg:gap-6">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item}>
                  <Link href={`#${item.toLowerCase()}`} legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} block p-4 lg:p-0`}>
                      {item}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </header>
  );
}
