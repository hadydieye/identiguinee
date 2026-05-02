"use client";

import { useRef, useState } from "react";
import { COMMUNES_GUINEE } from "@/lib/communes";
import { TypeDocument, TYPE_DOCUMENT_LABELS } from "@/lib/types";
import { Link2, Camera, X } from "lucide-react";

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
  photo_identite?: string; // base64 JPEG recadrée 3:4
};

// Recadre une image au ratio 3:4 (portrait photo d'identité) et retourne un base64 JPEG
function cropToIdPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const targetRatio = 3 / 4;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (img.width / img.height > targetRatio) {
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
      }
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 400;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 300, 400);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

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
  const photoRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState("");

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Formats acceptés : JPG, PNG, WEBP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Taille max : 5 MB");
      return;
    }
    setPhotoError("");
    const cropped = await cropToIdPhoto(file);
    onChange({ photo_identite: cropped });
  };

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

      {/* Photo d'identité */}
      <div className="bg-[#0D1117] border border-white/10 rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
          Photo d'identité
        </h3>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div
            className="w-[90px] h-[120px] rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer hover:border-[#009460] transition-colors"
            onClick={() => photoRef.current?.click()}
          >
            {data.photo_identite ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photo_identite} alt="Photo" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-7 h-7 text-white/20" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-white/60 text-xs">
              Ajoutez une photo portrait. Elle sera automatiquement recadrée au format 3×4 cm pour le document certifié.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => photoRef.current?.click()}
                className="px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:border-[#009460] hover:text-[#009460] transition-colors text-xs"
              >
                {data.photo_identite ? "Changer" : "Choisir une photo"}
              </button>
              {data.photo_identite && (
                <button
                  type="button"
                  onClick={() => onChange({ photo_identite: undefined })}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-white/30 hover:text-[#CE1126] hover:border-[#CE1126]/30 transition-colors text-xs flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Supprimer
                </button>
              )}
            </div>
            {photoError && <p className="text-[#CE1126] text-xs">{photoError}</p>}
          </div>
        </div>
        <input
          ref={photoRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhoto}
        />
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
