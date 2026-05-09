import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("flex h-9 w-full rounded-lg border border-[#2a2a4a] bg-[#1A1A2E] px-3 py-1 text-sm text-white placeholder:text-[#6b7280] outline-none focus:border-[#006B3C] transition-colors", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";
