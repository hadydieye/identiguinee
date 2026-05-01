"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentTypeSelector } from "@/components/demandes/document-type-selector";
import { FormStepper } from "@/components/demandes/form-stepper";
import { EtapeInformations, InfosFormData } from "@/components/demandes/etape-informations";
import { EtapeJustificatifs, JustificatifFile } from "@/components/demandes/etape-justificatifs";
import { EtapeConfirmation } from "@/components/demandes/etape-confirmation";
import { TypeDocument } from "@/lib/types";

const INFOS_INIT: InfosFormData = {
  nom: "", prenom: "", date_naissance: "", sexe: "", commune: "",
  nom_pere: "", nom_mere: "", telephone: "", lien_beneficiaire: "moi_meme", motif: "",
};

export default function NouvelleDemandePage() {
  const router = useRouter();
  const [typeDocument, setTypeDocument] = useState<TypeDocument | null>(null);
  const [step, setStep] = useState(0); // 0=sélection, 1=infos, 2=justificatifs, 3=confirmation
  const [infos, setInfos] = useState<InfosFormData>(INFOS_INIT);
  const [files, setFiles] = useState<JustificatifFile[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!typeDocument) return;
    setError("");
    try {
      const res = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type_document: typeDocument,
          ...infos,
          telephone: infos.telephone || undefined,
          nom_pere: infos.nom_pere || undefined,
          nom_mere: infos.nom_mere || undefined,
          motif: infos.motif || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Erreur lors de la soumission");
        return;
      }
      const { id } = await res.json();

      // Certification automatique après 3 secondes
      setTimeout(async () => {
        await fetch("/api/demandes/certifier", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ demande_id: id }),
        });
      }, 3000);

      router.push("/mes-demandes");
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-[#06090F] px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Nouvelle demande</h1>
          <p className="text-white/50 mt-1 text-sm">
            Remplissez le formulaire. Votre document sera prêt en moins de 2 minutes.
          </p>
        </div>

        {/* Étape 0 — Sélection type */}
        {step === 0 && (
          <div className="space-y-6">
            <DocumentTypeSelector value={typeDocument} onChange={setTypeDocument} />
            {typeDocument && (
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 rounded-xl bg-[#009460] hover:bg-[#009460]/90 text-white font-semibold text-sm transition-colors"
              >
                Continuer →
              </button>
            )}
          </div>
        )}

        {/* Stepper + étapes 1-3 */}
        {step >= 1 && typeDocument && (
          <>
            <FormStepper current={step} />
            <div className="mt-6">
              {step === 1 && (
                <EtapeInformations
                  data={infos}
                  typeDocument={typeDocument}
                  onChange={(d) => setInfos((prev) => ({ ...prev, ...d }))}
                  onNext={() => setStep(2)}
                  onBack={() => setStep(0)}
                />
              )}
              {step === 2 && (
                <EtapeJustificatifs
                  typeDocument={typeDocument}
                  files={files}
                  onFilesChange={setFiles}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <>
                  {error && (
                    <div className="mb-4 bg-[#CE1126]/10 border border-[#CE1126]/30 rounded-lg p-3 text-[#CE1126] text-sm">
                      {error}
                    </div>
                  )}
                  <EtapeConfirmation
                    typeDocument={typeDocument}
                    infos={infos}
                    onSubmit={handleSubmit}
                    onBack={() => setStep(2)}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
