import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin, FaInstagram, FaFileAlt } from "react-icons/fa";
import { IconType } from "react-icons/lib";

export function Contact() {
  const socialLinks: {
    icon: IconType;
    label: string;
    href: string;
    ariaLabel: string;
  }[] = [
    {
      icon: FaGithub,
      label: "GitHub",
      href: "https://github.com/RishiAP",
      ariaLabel: "Visit my GitHub profile",
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/rishi-the-programmer",
      ariaLabel: "Visit my LinkedIn profile",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: "https://instagram.com/rishi_the_programmer",
      ariaLabel: "Visit my Instagram profile",
    },
    {
      icon: FaFileAlt,
      label: "Resume",
      href: "https://rishiap.github.io/resume/resume.pdf",
      ariaLabel: "Download my resume",
    },
  ];

  return (
    <section id="contact" className="container py-12">
      <div className="flex justify-center space-x-4">
        {socialLinks.map((link) => (
          <Button
            key={link.label}
            variant="outline"
            className="w-16 h-16 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            asChild
          >
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              title={link.label}
              className="flex items-center justify-center"
            >
              <link.icon className="text-primary" style={{ width: "36px", height: "36px" }} />

            </a>
          </Button>
        ))}
      </div>
    </section>
  );
}
