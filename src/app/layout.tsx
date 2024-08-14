import type { Metadata } from "next";
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from "@mui/material/styles";
import Theme from "@/theme";

export const metadata: Metadata = {
  title: "Debjyoti Mondal - Portfolio",
  description: "Hi there! I'm Debjyoti Mondal, a Full Stack Developer. I love to build web applications using modern technologies.",
  robots:"index, follow",
  icons: ["./favicon.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={Theme}>
        {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
    </html>
  );
}
