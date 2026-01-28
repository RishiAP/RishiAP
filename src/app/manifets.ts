import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Debjyoti Mondal - Full Stack Developer Portfolio',
    short_name: 'Debjyoti Portfolio',
    description: 'Full Stack Developer | React, Next.js, Node.js | Java & Python | Portfolio & Projects',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#10b981',
    scope: '/',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}