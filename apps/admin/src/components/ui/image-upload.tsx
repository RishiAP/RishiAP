"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | File | null;
  onChange: (value: string | File | null) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [tab, setTab] = useState<"url" | "file">(
    typeof value === "string" && value.length > 0 ? "url" : "file"
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string" && value.length > 0) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onChange(file);
    }
  };

  const clearSelection = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs value={tab} onValueChange={(v) => setTab(v as "url" | "file")} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-4">
          {!preview || (typeof value === 'string' && value === '') ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-colors cursor-pointer",
                isDragging 
                  ? "border-primary bg-primary/10 text-primary" 
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50"
              )}
            >
              <UploadCloud className="w-8 h-8 mb-4" />
              <p className="text-sm font-medium">{isDragging ? "Drop image here" : "Click or drag and drop to upload"}</p>
              <p className="text-xs mt-1">SVG, PNG, JPG or GIF</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-zinc-800 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-auto" />
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={clearSelection}
                className="absolute top-2 right-2 shadow-sm"
              >
                <X className="w-4 h-4 mr-2" /> Remove
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-4">
          <Input
            placeholder="https://example.com/image.jpg"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
          />
          {typeof value === 'string' && value && (
             <div className="relative rounded-lg overflow-hidden border border-zinc-800 group mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-auto" />
             </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
