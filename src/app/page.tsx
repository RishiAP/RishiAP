"use client";
import ResponsiveAppBar from "@/components/AppBar";
import Contact from "@/components/Contact";
import Profile from "@/components/Profile";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
    <ResponsiveAppBar />
    <Profile/>
    <Skills/>
    <Projects/>
    <Contact/>
    </>
  );
}
