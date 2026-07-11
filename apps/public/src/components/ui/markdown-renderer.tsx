"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypePrismPlus from "rehype-prism-plus";
import { CodeBlock } from "@/components/ui/code-block";

// Prism theme — custom VS Code dark+ perfectly mapped to globals.css colors
import "@/app/prism-vscode.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypePrismPlus, { ignoreMissing: true }]]}
        components={{
          pre: ({ children, className: preClassName, ...props }) => (
            <CodeBlock className={preClassName} {...props}>
              {children}
            </CodeBlock>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
