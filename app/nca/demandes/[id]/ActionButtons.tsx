"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { validerDemande, rejeterDemande } from "./actions";

export function ActionButtons({ demandeId }: { demandeId: string }) {
  const [motif, setMotif] = useState("");
  const [showRejet, setShowRejet] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleValider() {
    setLoading(true);
    await validerDemande(demandeId);
    setLoading(false);
  }

  async function handleRejeter() {
    if (!motif.trim()) return;
    setLoading(true);
    await rejeterDemande(demandeId, motif);
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      {!showRejet ? (
        <div className="flex gap-3">
          <Button onClick={handleValider} disabled={loading} className="bg-[#006B3C] hover:bg-[#00E87A] text-white text-sm">
            ✓ Valider
          </Button>
          <Button onClick={() => setShowRejet(true)} variant="destructive" className="text-sm">
            ✗ Rejeter
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Motif du rejet…"
            className="w-full rounded-lg p-3 text-sm bg-[#0D0D1A] border border-[#2a2a4a] text-white placeholder:text-[#6b7280] resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={handleRejeter} disabled={loading || !motif.trim()} variant="destructive" className="text-sm">
              Confirmer le rejet
            </Button>
            <Button onClick={() => setShowRejet(false)} variant="outline" className="text-sm border-[#2a2a4a] text-[#9ca3af]">
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
