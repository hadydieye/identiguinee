"use client";

import { useState } from "react";
import { CheckCircle, Clock, Link2 } from "lucide-react";
import { TypeDocument, TYPE_DOCUMENT_LABELS } from "@/lib/types";
import { InfosFormData } from "./etape-informations";

export function EtapeConfirmation({
  typeDocument,
  infos,
  onSubmit,
  onBack,
}: {
  typeDocument: TypeDocument;
  infos: InfosFormData;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  const Row = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
        <span className="text-white/40 text-sm">{label}</span>
        <span className="text-white text-sm font-medium">{value}</span>
      </div>
    ) : null;

  const LIEN_LABELS: Record<string, string> = {
    moi_meme: "Moi-même",
    parent: "Parent",
    tuteur_legal: "Tuteur légal",
  };

  return (
    <div className="space-y-5">
      {/* Récap */}
      <div className="bg-[#0D1117] border border-white/10 rounded-xl p-5">
        <h3 className="text-white/60 text-xs uppercase tracking-wider mb-4">Récapitulatif</h3>
        <Row label="Type de document" value={TYPE_DOCUMENT_LABELS[typeDocument]} />
        <Row label="Nom" value={infos.nom} />
        <Row label="Prénom" value={infos.prenom} />
        <Row label="Date de naissance" value={infos.date_naissance} />
        <Row label="Sexe" value={infos.sexe === "masculin" ? "Masculin" : "Féminin"} />
        <Row label="Commune" value={infos.commune} />
        <Row label="Nom du père" value={infos.nom_pere} />
        <Row label="Nom de la mère" value={infos.nom_mere} />
        <Row label="Téléphone" value={infos.telephone ? `+224 ${infos.telephone}` : ""} />
        <Row label="Lien bénéficiaire" value={LIEN_LABELS[infos.lien_beneficiaire] ?? infos.lien_beneficiaire} />
        {infos.motif && <Row label="Motif" value={infos.motif} />}
      </div>

      {/* Ce qui va se passer */}
      <div className="bg-[#0D1117] border border-white/10 rounded-xl p-5 space-y-3">
        <h3 className="text-white font-semibold text-sm">Ce qui va se passer</h3>
        {[
          { icon: <CheckCircle className="w-4 h-4 text-[#009460]" />, text: "Vérification automatique NaissanceChain" },
          { icon: <Clock className="w-4 h-4 text-[#FCD116]" />, text: "Génération du document certifié" },
          { icon: <Link2 className="w-4 h-4 text-[#009460]" />, text: "Notification quand prêt" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            {icon}
            <span className="text-white/70 text-sm">{text}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 hover:border-white/40 transition-colors text-sm font-medium disabled:opacity-50"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-[#009460] hover:bg-[#009460]/90 text-white font-semibold text-sm transition-colors disabled:opacity-60"
        >
          {loading ? "Soumission..." : "Soumettre ma demande"}
        </button>
      </div>
    </div>
  );
}
