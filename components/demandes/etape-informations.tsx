"use client";

import { COMMUNES_GUINEE } from "@/lib/communes";
import { TypeDocument, TYPE_DOCUMENT_LABELS } from "@/lib/types";
import { Link2 } from "lucide-react";

export type InfosFormData = {
  nom: string;
  prenom: string;
  date_naissance: string;
  sexe: string;
  commune: string;
  nom_pere: string;
  nom_mere: string;
  telephone: string;
  lien_beneficiaire: string;
  motif: string;
};

const inputCls =
  "w-full bg-[#06090F] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#009460] transition-colors";

export function EtapeInformations({
  data,
  typeDocument,
  onChange,
  onNext,
  onBack,
}: {
  data: InfosFormData;
  typeDocument: TypeDocument;
  onChange: (d: Partial<InfosFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const field = (key: keyof InfosFormData) => ({
    value: data[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange({ [key]: e.target.value }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Infos bénéficiaire */}
      <div className="bg-[#0D1117] border border-white/10 rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
          Informations du bénéficiaire
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Nom *</label>
            <input required className={inputCls} placeholder="Diallo" {...field("nom")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Prénom *</label>
            <input required className={inputCls} placeholder="Mamadou" {...field("prenom")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Date de naissance *</label>
            <input required type="date" className={inputCls} {...field("date_naissance")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Sexe *</label>
            <select required className={inputCls} {...field("sexe")}>
              <option value="">Sélectionner</option>
              <option value="masculin">Masculin</option>
              <option value="feminin">Féminin</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Commune *</label>
            <select required className={inputCls} {...field("commune")}>
              <option value="">Sélectionner</option>
              {COMMUNES_GUINEE.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Téléphone</label>
            <div className="flex">
              <span className="bg-[#06090F] border border-r-0 border-white/10 rounded-l-lg px-3 flex items-center text-white/40 text-sm">
                +224
              </span>
              <input
                className={`${inputCls} rounded-l-none`}
                placeholder="620 000 000"
                {...field("telephone")}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Nom du père</label>
            <input className={inputCls} placeholder="Prénom Nom" {...field("nom_pere")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Nom de la mère</label>
            <input className={inputCls} placeholder="Prénom Nom" {...field("nom_mere")} />
          </div>
        </div>
      </div>

      {/* Infos demandeur */}
      <div className="bg-[#0D1117] border border-white/10 rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
          Informations du demandeur
        </h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Lien avec le bénéficiaire *</label>
            <select required className={inputCls} {...field("lien_beneficiaire")}>
              <option value="moi_meme">Moi-même</option>
              <option value="parent">Parent</option>
              <option value="tuteur_legal">Tuteur légal</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs">Motif de la demande</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              maxLength={500}
              placeholder="Précisez le motif..."
              value={data.motif}
              onChange={(e) => onChange({ motif: e.target.value })}
            />
            <p className={`text-xs text-right ${data.motif.length >= 450 ? "text-[#CE1126]" : "text-white/30"}`}>
              {data.motif.length}/500
            </p>
          </div>
        </div>
      </div>

      {/* Récapitulatif */}
      <div className="bg-[#0D1117] border border-white/10 rounded-xl p-5 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="text-white/50 text-xs mb-1">Document sélectionné</p>
          <p className="text-white font-medium">{TYPE_DOCUMENT_LABELS[typeDocument]}</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-[#FCD116] font-bold text-lg">2 min</p>
            <p className="text-white/40 text-xs">Délai</p>
          </div>
          <div className="text-center">
            <p className="text-[#009460] font-bold text-lg">Gratuit</p>
            <p className="text-white/40 text-xs">Coût</p>
          </div>
          <div className="text-center flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-[#009460]">
              <Link2 className="w-3.5 h-3.5" />
              <p className="font-bold text-sm">Certifié</p>
            </div>
            <p className="text-white/40 text-xs">NaissanceChain</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 hover:border-white/40 transition-colors text-sm font-medium"
        >
          Retour
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-[#009460] hover:bg-[#009460]/90 text-white font-semibold text-sm transition-colors"
        >
          Suivant → Justificatifs
        </button>
      </div>
    </form>
  );
}
