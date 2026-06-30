import type { Metadata } from "next";
import "./globals.css";
import { ApiDocsShell } from "@/components/ApiDocsShell";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, Fira_Code } from "next/font/google";
import { getExperience, computeActiveRole } from "@/lib/api";
import { cache } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

const getActiveRole = cache(async () => {
  try {
    const experience = await getExperience();
    return computeActiveRole(experience);
  } catch (error) {
    console.error("Failed to fetch experience:", error);
  }
  return { role: "Full Stack Developer", company: null };
});

export async function generateMetadata(): Promise<Metadata> {
  const { role, company } = await getActiveRole();
  const titleString = company ? `${role} at ${company}` : role;
  
  return {
    title: {
      template: '%s | Debjyoti Mondal',
      default: `Debjyoti Mondal - ${titleString}`,
    },
    description: "Full Stack Software Engineer with a heavy focus on backend architecture, scalable APIs, and database design.",
    openGraph: {
      type: 'website',
      title: `Debjyoti Mondal - ${titleString}`,
      description: "Full Stack Software Engineer with a heavy focus on backend architecture, scalable APIs, and database design.",
      siteName: 'Debjyoti Mondal Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Debjyoti Mondal - ${titleString}`,
      description: "Full Stack Software Engineer with a heavy focus on backend architecture, scalable APIs, and database design.",
    },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        { url: '/rishicodes.svg', type: 'image/svg+xml' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ]
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role } = await getActiveRole();

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${firaCode.variable}`}>
      <body className="antialiased font-mono">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ApiDocsShell currentRole={role}>
            {children}
          </ApiDocsShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
