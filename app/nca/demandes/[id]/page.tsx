import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ActionButtons } from "./ActionButtons";

const STATUT_COLORS: Record<string, string> = { certifie: "#00E87A", en_cours: "#F6AD55", rejete: "#EF4444" };
const TYPE_LABELS: Record<string, string> = {
  acte_naissance: "Acte de naissance", cni: "CNI", passeport: "Passeport", certificat_nationalite: "Certificat de nationalité",
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 py-2 border-b border-[#1e1e3a]">
      <span className="text-[#6b7280] text-sm w-40 flex-shrink-0">{label}</span>
      <span className="text-[#d1d5db] text-sm">{value}</span>
    </div>
  );
}

export default async function DemandePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: demande }, { data: doc }, { data: justifs }] = await Promise.all([
    supabase.from("demandes").select("*").eq("id", id).single(),
    supabase.from("documents_certifies").select("*").eq("demande_id", id).maybeSingle(),
    supabase.from("justificatifs").select("*").eq("demande_id", id),
  ]);

  if (!demande) notFound();

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/nca/demandes" className="text-[#6b7280] hover:text-white text-sm">← Demandes</Link>
        <span className="text-[#2a2a4a]">/</span>
        <span className="text-white text-sm font-mono">{demande.reference}</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">{demande.prenom} {demande.nom}</h1>
        <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: `${STATUT_COLORS[demande.statut]}22`, color: STATUT_COLORS[demande.statut] }}>
          {demande.statut}
        </span>
      </div>

      <div className="rounded-2xl p-5 space-y-0" style={{ background: "#1A1A2E" }}>
        <div className="text-white text-sm font-semibold mb-3">Informations de la demande</div>
        <Row label="Référence" value={demande.reference} />
        <Row label="Type de document" value={TYPE_LABELS[demande.type_document]} />
        <Row label="Nom" value={demande.nom} />
        <Row label="Prénom" value={demande.prenom} />
        <Row label="Date de naissance" value={demande.date_naissance ? new Date(demande.date_naissance).toLocaleDateString("fr-FR") : null} />
        <Row label="Sexe" value={demande.sexe} />
        <Row label="Commune" value={demande.commune} />
        <Row label="Nom du père" value={demande.nom_pere} />
        <Row label="Nom de la mère" value={demande.nom_mere} />
        <Row label="Téléphone" value={demande.telephone} />
        <Row label="Motif" value={demande.motif} />
        <Row label="Lien bénéficiaire" value={demande.lien_beneficiaire} />
        <Row label="Créée le" value={new Date(demande.created_at).toLocaleString("fr-FR")} />
        {demande.motif_rejet && <Row label="Motif de rejet" value={demande.motif_rejet} />}
      </div>

      {(demande.hash_sha256 || demande.id_blockchain) && (
        <div className="rounded-2xl p-5 space-y-0" style={{ background: "#1A1A2E" }}>
          <div className="text-white text-sm font-semibold mb-3">Certification blockchain</div>
          <Row label="ID Blockchain" value={demande.id_blockchain} />
          <Row label="Hash SHA-256" value={demande.hash_sha256} />
          {doc && (
            <>
              <Row label="Bloc #" value={doc.bloc_number?.toString()} />
              <Row label="Hash document" value={doc.hash_document} />
              {doc.pdf_url && (
                <div className="flex gap-4 py-2">
                  <span className="text-[#6b7280] text-sm w-40">PDF certifié</span>
                  <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[#00E87A] text-sm hover:underline">Télécharger</a>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {justifs && justifs.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
          <div className="text-white text-sm font-semibold mb-3">Justificatifs ({justifs.length})</div>
          <div className="space-y-2">
            {justifs.map((j) => (
              <div key={j.id} className="flex items-center justify-between text-sm">
                <span className="text-[#d1d5db]">{j.nom_fichier}</span>
                <a href={j.url_storage} target="_blank" rel="noopener noreferrer" className="text-[#00E87A] hover:underline text-xs">Voir</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {demande.statut === "en_cours" && (
        <div className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
          <div className="text-white text-sm font-semibold mb-4">Actions</div>
          <ActionButtons demandeId={demande.id} />
        </div>
      )}
    </div>
  );
}
