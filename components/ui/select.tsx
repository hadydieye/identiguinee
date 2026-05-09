"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SelectContextType = { value: string; onChange: (v: string) => void; open: boolean; setOpen: (o: boolean) => void };
const SelectContext = React.createContext<SelectContextType>({} as SelectContextType);

export function Select({ children, defaultValue = "", value: controlledValue, onValueChange }: {
  children: React.ReactNode; defaultValue?: string; value?: string; onValueChange?: (v: string) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const value = controlledValue ?? internalValue;
  const onChange = (v: string) => { setInternalValue(v); onValueChange?.(v); setOpen(false); };
  return (
    <SelectContext.Provider value={{ value, onChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn("flex h-9 w-full items-center justify-between rounded-lg border border-[#2a2a4a] bg-[#1A1A2E] px-3 text-sm text-white outline-none", className)}
    >
      {children}
      <svg className="w-4 h-4 text-[#6b7280] ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext);
  return <span className={value ? "text-white" : "text-[#6b7280]"}>{value || placeholder}</span>;
}

export function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div className={cn("absolute z-50 mt-1 w-full rounded-lg border border-[#2a2a4a] bg-[#1A1A2E] py-1 shadow-xl", className)}>
      {children}
    </div>
  );
}

export function SelectItem({ children, value }: { children: React.ReactNode; value: string }) {
  const { onChange, value: selected } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn("w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors", selected === value ? "text-[#00E87A]" : "text-[#d1d5db]")}
    >
      {children}
    </button>
  );
}
