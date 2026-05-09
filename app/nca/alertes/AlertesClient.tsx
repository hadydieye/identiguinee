"use client";

import { useState } from "react";
import { resoudreAlerte } from "./actions";

const NIVEAU_COLORS: Record<string, string> = {
  critique: "#EF4444", attention: "#F6AD55", info: "#3B82F6", resolu: "#6b7280",
};
const TABS = ["Toutes", "Critiques", "Avertissements", "Info", "Résolues"];
const TAB_FILTER: Record<string, string | null> = {
  Toutes: null, Critiques: "critique", Avertissements: "attention", Info: "info", Résolues: "resolu",
};

type Alerte = { id: string; niveau: string; code: string | null; titre: string; description: string | null; source: string | null; created_at: string; resolved_at: string | null };

export function AlertesClient({ alertes, critiques, avertissements }: { alertes: Alerte[]; critiques: number; avertissements: number }) {
  const [tab, setTab] = useState("Toutes");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = TAB_FILTER[tab] ? alertes.filter((a) => a.niveau === TAB_FILTER[tab]) : alertes;

  async function handleResoudre(id: string) {
    setLoading(id);
    await resoudreAlerte(id);
    setLoading(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ background: tab === t ? "#006B3C" : "#2a2a4a", color: tab === t ? "#fff" : "#9ca3af" }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {critiques > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#EF4444] text-white">{critiques} critique{critiques > 1 ? "s" : ""}</span>}
          {avertissements > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F6AD55] text-white">{avertissements} avert.</span>}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className="rounded-2xl p-4 flex items-start gap-4" style={{ background: "#1A1A2E", borderLeft: `3px solid ${NIVEAU_COLORS[a.niveau] ?? "#6b7280"}` }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${NIVEAU_COLORS[a.niveau]}22`, color: NIVEAU_COLORS[a.niveau] }}>
                  {a.niveau.toUpperCase()}
                </span>
                {a.code && <span className="text-[#6b7280] text-xs font-mono">{a.code}</span>}
                <span className="text-[#6b7280] text-xs ml-auto">{new Date(a.created_at).toLocaleString("fr-FR")}</span>
              </div>
              <div className="text-white text-sm font-medium">{a.titre}</div>
              {a.description && <div className="text-[#9ca3af] text-xs mt-1">{a.description}</div>}
              {a.source && <div className="text-[#6b7280] text-xs mt-1">Source : {a.source}</div>}
            </div>
            {a.niveau !== "resolu" && (
              <button
                onClick={() => handleResoudre(a.id)}
                disabled={loading === a.id}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#2a2a4a] text-[#9ca3af] hover:text-[#00E87A] hover:border-[#006B3C] transition-colors disabled:opacity-50"
              >
                {loading === a.id ? "…" : "Résoudre"}
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-[#6b7280] text-sm text-center py-8">Aucune alerte</div>}
      </div>
    </div>
  );
}
