"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    const viewport = document.querySelector('#main-scroll [data-slot="scroll-area-viewport"]');
    if (viewport) {
      viewport.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
