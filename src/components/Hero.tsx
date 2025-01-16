"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Typewriter } from 'react-simple-typewriter'

export function Hero() {
  return (
    <section id="intro" className="container space-y-8 md:py-32">
      <div className="flex flex-col-reverse md:flex-row items-center text-center md:text-left space-y-8 md:space-y-0">
        {/* Left Side - Text */}
        <div className="space-y-4 md:w-1/2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          <Typewriter words={["Hello there!", "I'm Debjyoti", 'A Full Stack Developer', "My strengths are","Java","JavaScript/Typescript","Next.js","Feel free to ask anything—I'm here to help!"]} loop={true} cursor={true} cursorStyle='|' typeSpeed={50} deleteSpeed={20} delaySpeed={1000} />
          </h1>
          <p className="text-lg text-muted-foreground">
            I specialize in building modern web applications with cutting-edge technologies.
            My passion lies in creating efficient, scalable, and user-friendly solutions.
          </p>
          <div className="flex md:justify-start justify-center gap-4">
            <Link href="#projects">
            <Button size="lg" className="group">
              View Projects
              <span className="ml-2 opacity-70 group-hover:opacity-100 transition-opacity">→</span>
            </Button>
            </Link>
            <a href="./Debjyoti_Resume.pdf" download><Button variant="outline" size="lg">
              Download CV
            </Button></a>
          </div>
        </div>

        {/* Right Side - Avatar */}
        <div className="md:w-1/2 flex justify-center">
        <Image 
  src="/MyPic.png" 
  width={300} // Replace with your desired width in pixels
  height={300} // Replace with your desired height in pixels
  className="rounded-full shadow-lg md:max-w-[300px] max-w-[150px] h-auto md:mb-0 mb-8" 
  alt="Debjyoti"
/>
        </div>
      </div>
    </section>
  );
}
