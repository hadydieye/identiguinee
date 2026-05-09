import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
    const variants: Record<string, string> = {
      default: "bg-[#006B3C] text-white hover:bg-[#00E87A]",
      destructive: "bg-[#EF4444] text-white hover:bg-red-600",
      outline: "border border-[#2a2a4a] text-[#9ca3af] hover:text-white bg-transparent",
      ghost: "text-[#9ca3af] hover:text-white bg-transparent",
    };
    return <button ref={ref} className={cn(base, variants[variant], className)} {...props} />;
  }
);
Button.displayName = "Button";
