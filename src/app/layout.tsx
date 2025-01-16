import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Debjyoti Mondal - Portfolio",
  description: "Hey There 👋, I'm Debjyoti Mondal, a Full Stack Developer from India. I love to build web applications and solve problems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
