"use client";

import { Check } from "lucide-react";

const STEPS = ["Informations", "Justificatifs", "Confirmation"];

export function FormStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mt-6">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = current > step;
        const active = current === step;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  done
                    ? "bg-[#009460] border-[#009460] text-white"
                    : active
                    ? "border-[#009460] text-[#009460] bg-transparent"
                    : "border-white/20 text-white/30 bg-transparent"
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : step}
              </div>
              <span
                className={`text-xs whitespace-nowrap ${
                  active ? "text-white" : done ? "text-[#009460]" : "text-white/30"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 mb-4 transition-all ${
                  done ? "bg-[#009460]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
