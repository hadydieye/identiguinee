"use client";

import { Check, Clock } from "lucide-react";

type TimelineStep = {
  label: string;
  status: "done" | "active" | "pending";
  timestamp?: string;
  hash?: string;
};

export function TimelineBlockchain({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <div className="flex items-start gap-0 mt-3 min-w-max px-1">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-start flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.status === "done"
                  ? "bg-[#009460]/20 border border-[#009460]"
                  : step.status === "active"
                  ? "bg-orange-500/20 border border-orange-500"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {step.status === "done" ? (
                <Check className="w-3.5 h-3.5 text-[#009460]" />
              ) : step.status === "active" ? (
                <Clock className="w-3.5 h-3.5 text-orange-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-white/20" />
              )}
            </div>
            <p
              className={`text-xs mt-1.5 text-center whitespace-nowrap ${
                step.status === "done"
                  ? "text-[#009460]"
                  : step.status === "active"
                  ? "text-orange-400"
                  : "text-white/20"
              }`}
            >
              {step.label}
            </p>
            {step.timestamp && (
              <p className="text-white/30 text-[10px] mt-0.5">{step.timestamp}</p>
            )}
            {step.hash && (
              <p className="text-white/20 text-[10px] font-mono mt-0.5">{step.hash}</p>
            )}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mt-3.5 mx-1 ${
                step.status === "done" ? "bg-[#009460]/40" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
