"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TagInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string[];
  onChange: (value: string[]) => void;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ className, value, onChange, placeholder, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint.trim()]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
          className
        )}
      >
        {value.map((item) => (
          <Badge key={item} variant="secondary" className="flex items-center gap-1 hover:bg-secondary">
            {item}
            <button
              type="button"
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onChange(value.filter((i) => i !== item));
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={() => onChange(value.filter((i) => i !== item))}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Remove {item}</span>
            </button>
          </Badge>
        ))}
        <input
          className="flex-1 outline-none bg-transparent min-w-[120px] text-sm placeholder:text-muted-foreground"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

TagInput.displayName = "TagInput";
