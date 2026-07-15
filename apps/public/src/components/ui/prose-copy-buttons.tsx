"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Check, Copy } from "lucide-react";

function CopyButton({ preEl }: { preEl: HTMLPreElement }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preEl.textContent || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 z-10 flex items-center gap-1.5 rounded-md border border-zinc-600 bg-zinc-800/90 p-1.5 sm:px-2 sm:py-1.5 text-xs text-zinc-400 transition-all hover:border-zinc-500 hover:bg-zinc-700 hover:text-zinc-200 backdrop-blur-sm cursor-pointer"
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          <span className="hidden sm:inline">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          <span className="hidden sm:inline">Copy</span>
        </>
      )}
    </button>
  );
}

interface ProseCopyButtonsProps {
  articleSelector: string;
}

export function ProseCopyButtons({ articleSelector }: ProseCopyButtonsProps) {
  const [preEls, setPreEls] = useState<HTMLPreElement[]>([]);
  const wrapperRefs = useRef<Map<HTMLPreElement, HTMLDivElement>>(new Map());

  useEffect(() => {
    const article = document.querySelector(articleSelector);
    if (!article) return;

    const pres = Array.from(article.querySelectorAll<HTMLPreElement>("pre"));
    if (pres.length === 0) return;

    pres.forEach((pre) => {
      if (wrapperRefs.current.has(pre)) return; // already processed

      // Wrap pre in a relative div so we can absolutely position the button
      const wrapper = document.createElement("div");
      wrapper.style.cssText = "position:relative;";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapperRefs.current.set(pre, wrapper);
    });

    setPreEls(pres);
  }, [articleSelector]);

  return (
    <>
      {preEls.map((pre, i) => {
        const wrapper = wrapperRefs.current.get(pre);
        if (!wrapper) return null;
        return createPortal(<CopyButton key={i} preEl={pre} />, wrapper);
      })}
    </>
  );
}
