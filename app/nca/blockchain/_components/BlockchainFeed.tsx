"use client";

import { useState } from "react";

const TYPE_COLORS: Record<string, string> = { CERTIFICATION: "#00E87A", DEMANDE: "#3B82F6", REJET: "#EF4444" };

type Tx = {
  id: string;
  bloc_number: number | null;
  hash: string | null;
  created_at: string;
  timestamp_blockchain: string | null;
  demandes: { nom: string | null; prenom: string | null; id_blockchain: string | null; statut: string } | null;
};

export function BlockchainFeed({ txs }: { txs: Tx[] }) {
  const [filter, setFilter] = useState("tout");
  const [visible, setVisible] = useState(20);

  const filtered = txs.filter((t) => {
    if (filter === "certifications") return t.demandes?.statut === "certifie";
    if (filter === "rejets") return t.demandes?.statut === "rejete";
    return true;
  }).slice(0, visible);

  const tabs = [
    { key: "tout", label: "Tout" },
    { key: "certifications", label: "Certifications" },
    { key: "rejets", label: "Rejets" },
  ];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#1A1A2E" }}>
      <div className="flex gap-1 px-4 pt-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setFilter(t.key); setVisible(20); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ background: filter === t.key ? "#006B3C" : "#2a2a4a", color: filter === t.key ? "#fff" : "#9ca3af" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-2 mt-2">
        {filtered.map((tx) => {
          const type = tx.demandes?.statut === "certifie" ? "CERTIFICATION" : tx.demandes?.statut === "rejete" ? "REJET" : "DEMANDE";
          return (
            <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "#0D0D1A" }}>
              <div className="text-xs font-mono text-[#6b7280] w-16 flex-shrink-0">#{tx.bloc_number ?? "—"}</div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0" style={{ background: `${TYPE_COLORS[type]}22`, color: TYPE_COLORS[type] }}>
                {type}
              </span>
              <div className="font-mono text-xs text-[#6b7280] flex-shrink-0 hidden md:block">{tx.hash ? `${tx.hash.slice(0, 16)}…` : "—"}</div>
              <div className="flex-1 text-xs text-[#d1d5db]">
                {tx.demandes ? `${tx.demandes.prenom} ${tx.demandes.nom}` : "—"}
              </div>
              <div className="text-xs text-[#6b7280] flex-shrink-0 hidden lg:block">{tx.demandes?.id_blockchain ?? "—"}</div>
              <div className="text-xs text-[#6b7280] flex-shrink-0">
                {new Date(tx.timestamp_blockchain ?? tx.created_at).toLocaleString("fr-FR")}
              </div>
            </div>
          );
        })}
      </div>

      {visible < txs.length && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setVisible((v) => v + 20)}
            className="w-full py-2 rounded-lg text-xs text-[#9ca3af] border border-[#2a2a4a] hover:text-white hover:border-[#006B3C] transition-colors"
          >
            Charger 20 de plus
          </button>
        </div>
      )}
    </div>
  );
}
