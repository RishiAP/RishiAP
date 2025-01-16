
import {Navbar} from '@/components/Navbar';
import {Hero} from '@/components/Hero';
import {Skills} from '@/components/Skills';
import {Projects} from '@/components/Projects';
import {Contact} from '@/components/Contact';
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}