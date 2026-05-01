"use client";

import { FileText, CreditCard, BookOpen, Award } from "lucide-react";
import { TypeDocument, TYPE_DOCUMENT_LABELS } from "@/lib/types";

const TYPES: { value: TypeDocument; icon: React.ReactNode; desc: string }[] = [
  { value: "acte_naissance", icon: <FileText className="w-6 h-6" />, desc: "Naissance & état civil" },
  { value: "cni", icon: <CreditCard className="w-6 h-6" />, desc: "Identité nationale" },
  { value: "passeport", icon: <BookOpen className="w-6 h-6" />, desc: "Voyage international" },
  { value: "certificat_nationalite", icon: <Award className="w-6 h-6" />, desc: "Nationalité guinéenne" },
];

export function DocumentTypeSelector({
  value,
  onChange,
}: {
  value: TypeDocument | null;
  onChange: (v: TypeDocument) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TYPES.map((t) => {
        const selected = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={`flex flex-col gap-3 p-4 rounded-xl border text-left transition-all ${
              selected
                ? "border-[#009460] bg-[#009460]/10"
                : "border-white/10 bg-[#0D1117] hover:border-white/20"
            }`}
          >
            <span className={selected ? "text-[#009460]" : "text-white/50"}>{t.icon}</span>
            <div>
              <p className="text-white text-sm font-medium">{TYPE_DOCUMENT_LABELS[t.value]}</p>
              <p className="text-white/40 text-xs mt-0.5">{t.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
