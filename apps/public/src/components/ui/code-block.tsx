"use client";

import { useState, useRef } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.textContent || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 flex items-center gap-1.5 rounded-md border border-zinc-600 bg-zinc-800/90 p-1.5 sm:px-2 sm:py-1.5 text-xs text-zinc-400 transition-all hover:border-zinc-500 hover:bg-zinc-700 hover:text-zinc-200 backdrop-blur-sm"
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
      <pre ref={preRef} className={`!my-0 ${className || ""}`} {...props}>
        {children}
      </pre>
    </div>
  );
}
