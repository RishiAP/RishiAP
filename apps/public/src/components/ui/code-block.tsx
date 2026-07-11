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

  // Only add copy button for fenced code blocks (has className with language-)
  const isCodeBlock = className?.includes("language-") || 
    (typeof children === "object" && children !== null && 
     "props" in (children as any) && (children as any).props?.className?.includes("language-"));

  const handleCopy = async () => {
    const text = preRef.current?.textContent || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isCodeBlock) {
    return (
      <pre className={className} {...props}>
        {children}
      </pre>
    );
  }

  return (
    <div className="group relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-400 opacity-0 transition-all hover:border-zinc-600 hover:bg-zinc-700 hover:text-zinc-200 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check className="size-3.5" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}
