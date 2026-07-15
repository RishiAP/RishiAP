"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyPackageInfo({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 bg-zinc-900 rounded p-3 font-mono text-sm text-zinc-300 flex items-center justify-between gap-3 border border-zinc-800/50">
      <span className="truncate overflow-hidden">{text}</span>
      <button
        onClick={handleCopy}
        className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
        aria-label="Copy to clipboard"
        title="Copy to clipboard"
      >
        {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}
