"use client";

import { FileText, Download, RefreshCw } from "lucide-react";
import { DemandeAvecDocument, TYPE_DOCUMENT_LABELS } from "@/lib/types";
import { TimelineBlockchain } from "./timeline-blockchain";
import { formatDistanceToNow } from "@/lib/utils";

export function DemandeCard({ demande }: { demande: DemandeAvecDocument }) {
  const { statut, reference, type_document, created_at, motif_rejet, documents_certifies } = demande;
  const doc = documents_certifies?.[0];

  const createdDate = new Date(created_at);
  const timeAgo = formatDistanceToNow(createdDate);

  const timelineSteps =
    statut === "en_cours"
      ? [
          { label: "Soumission", status: "done" as const, timestamp: createdDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) },
          { label: "Validation", status: "done" as const, hash: demande.hash_sha256 ? `0x${demande.hash_sha256.slice(0, 4)}...${demande.hash_sha256.slice(-4)}` : undefined },
          { label: "Génération", status: "active" as const },
          { label: "Attente", status: "pending" as const },
        ]
      : [];

  return (
    <div className="bg-[#0D1117] border border-white/10 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white/50" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{TYPE_DOCUMENT_LABELS[type_document]}</p>
            <p className="text-white/40 text-xs font-mono">#{reference}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {statut === "en_cours" && (
            <span className="bg-orange-500/15 text-orange-400 border border-orange-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
              EN COURS
            </span>
          )}
          {statut === "certifie" && (
            <span className="bg-[#009460]/15 text-[#009460] border border-[#009460]/30 text-xs font-semibold px-2.5 py-1 rounded-full">
              CERTIFIÉ ✓
            </span>
          )}
          {statut === "rejete" && (
            <span className="bg-[#CE1126]/15 text-[#CE1126] border border-[#CE1126]/30 text-xs font-semibold px-2.5 py-1 rounded-full">
              REJETÉ
            </span>
          )}
          <p className="text-white/30 text-xs">Soumise {timeAgo}</p>
        </div>
      </div>

      {/* Timeline pour en_cours */}
      {statut === "en_cours" && <TimelineBlockchain steps={timelineSteps} />}

      {/* Rejet */}
      {statut === "rejete" && motif_rejet && (
        <div className="bg-[#CE1126]/10 border border-[#CE1126]/30 rounded-lg p-3">
          <p className="text-[#CE1126] text-xs font-semibold mb-1">Motif du rejet</p>
          <p className="text-white/70 text-sm">{motif_rejet}</p>
        </div>
      )}

      {/* Actions */}
      {statut === "certifie" && doc?.url_pdf && (
        <a
          href={doc.url_pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#009460] hover:bg-[#009460]/90 text-white text-sm font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </a>
      )}
      {statut === "rejete" && (
        <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-white/20 text-white/70 hover:border-white/40 text-sm font-medium transition-colors">
          <RefreshCw className="w-4 h-4" />
          Soumettre à nouveau
        </button>
      )}
    </div>
  );
}
