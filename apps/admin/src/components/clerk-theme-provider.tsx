"use client"

import * as React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "oklch(0.646 0.222 284.711)", // Matches indigo-500 from admin theme
          colorBackground: resolvedTheme === "dark" ? "oklch(0.141 0.005 285.823)" : undefined,
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
