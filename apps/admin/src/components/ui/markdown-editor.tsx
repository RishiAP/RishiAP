"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export interface MarkdownEditorProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement> | any) => void;
}

export function MarkdownEditor({ value, onChange, className, ...props }: MarkdownEditorProps) {
  return (
    <Tabs defaultValue="write" className="w-full">
      <div className="flex items-center justify-between">
        <TabsList className="grid w-[200px] grid-cols-2 mb-2">
          <TabsTrigger value="write" className="border border-transparent data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!border-border data-[state=active]:shadow-sm">Write</TabsTrigger>
          <TabsTrigger value="preview" className="border border-transparent data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!border-border data-[state=active]:shadow-sm">Preview</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="write" className="mt-0">
        <Textarea
          value={value || ""}
          onChange={onChange}
          className={className}
          {...props}
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-0">
        <div 
          className={`w-full rounded-md border border-input bg-zinc-950 px-3 py-2 text-sm shadow-sm overflow-y-auto ${className}`}
        >
          {value ? (
            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          ) : (
            <span className="text-muted-foreground italic">Nothing to preview</span>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
