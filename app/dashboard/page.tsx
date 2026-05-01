import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { TYPE_DOCUMENT_LABELS } from "@/lib/types";
import { FileText, FolderOpen, ShieldCheck, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: recentDemandes } = await supabase
    .from("demandes")
    .select("id, type_document, statut, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const blocNum = profile?.id_blockchain?.replace("GN-2026-", "") ?? "000000";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bonjour, {profile?.prenom ?? "Citoyen"} 👋
          </h1>
          <p className="text-white/50 mt-1">Bienvenue sur votre espace IdentiGuinée</p>
          <p className="text-[#FCD116] font-mono text-sm mt-2">
            ID: {profile?.id_blockchain ?? "—"}
          </p>
        </div>

        {/* Badge vérifié */}
        <div className="flex items-center gap-2 bg-[#009460]/10 border border-[#009460]/30 rounded-full px-4 py-2 text-sm">
          <ShieldCheck className="w-4 h-4 text-[#009460]" />
          <span className="text-[#009460] font-medium">Identité vérifiée</span>
          <span className="text-white/30">·</span>
          <span className="text-white/60">NaissanceChain</span>
          <span className="text-white/30">·</span>
          <span className="text-white/60">Bloc #{blocNum}</span>
        </div>
      </div>

      {/* 3 Cards actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/nouvelle-demande"
          className="group bg-[#0D1117] border border-[#009460]/40 hover:border-[#009460] rounded-2xl p-6 flex flex-col gap-3 transition-all hover:bg-[#009460]/5"
        >
          <div className="w-10 h-10 rounded-xl bg-[#009460]/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#009460]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Nouvelle demande</h3>
            <p className="text-white/50 text-sm mt-0.5">Déposer un dossier</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#009460] mt-auto group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/mes-demandes"
          className="group bg-[#0D1117] border border-white/10 hover:border-white/20 rounded-2xl p-6 flex flex-col gap-3 transition-all hover:bg-white/5"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-white/70" />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">Mes demandes</h3>
              <p className="text-white/50 text-sm mt-0.5">Suivre mes dossiers</p>
            </div>
            <span className="bg-orange-500/20 text-orange-400 text-xs font-medium px-2 py-0.5 rounded-full border border-orange-500/30">
              0 en cours
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-white/40 mt-auto group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/verifier"
          className="group bg-[#0D1117] border border-white/10 hover:border-white/20 rounded-2xl p-6 flex flex-col gap-3 transition-all hover:bg-white/5"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white/70" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Vérifier un document</h3>
            <p className="text-white/50 text-sm mt-0.5">Authentifier un acte</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/40 mt-auto group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Activité récente */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Activité récente</h2>
        <div className="bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden">
          {!recentDemandes?.length ? (
            <div className="py-12 text-center text-white/40">
              <FolderOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>Aucune activité pour le moment</p>
              <p className="text-sm mt-1">Vos demandes apparaîtront ici</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentDemandes.map((d) => (
                <li key={d.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-white text-sm font-medium">{TYPE_DOCUMENT_LABELS[d.type_document as keyof typeof TYPE_DOCUMENT_LABELS]}</p>
                    <p className="text-white/40 text-xs mt-0.5">{new Date(d.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <StatusBadge status={d.statut.toUpperCase() as "EN_COURS" | "CERTIFIE" | "REJETE"} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
