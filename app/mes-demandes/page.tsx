import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DemandeCard } from "@/components/demandes/demande-card";
import { DemandeAvecDocument, StatutDemande } from "@/lib/types";

const TABS: { label: string; value: StatutDemande | "toutes" }[] = [
  { label: "Toutes", value: "toutes" },
  { label: "En cours", value: "en_cours" },
  { label: "Certifiées", value: "certifie" },
  { label: "Rejetées", value: "rejete" },
];

export default async function MesDemandesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { tab = "toutes" } = await searchParams;

  const { data: rawDemandes } = await supabase
    .from("demandes")
    .select("*, documents_certifies(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const demandes = rawDemandes ?? [];

  const counts = {
    toutes: demandes.length,
    en_cours: demandes.filter((d) => d.statut === "en_cours").length,
    certifie: demandes.filter((d) => d.statut === "certifie").length,
    rejete: demandes.filter((d) => d.statut === "rejete").length,
  };

  const filtered =
    tab === "toutes" ? demandes : demandes.filter((d) => d.statut === tab);

  return (
    <div className="min-h-screen bg-[#06090F] px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Mes demandes</h1>
            <span className="bg-white/10 text-white/60 text-xs font-semibold px-2.5 py-1 rounded-full">
              {counts.toutes}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0D1117] border border-white/10 rounded-xl p-1">
          {TABS.map((t) => {
            const count = counts[t.value];
            const active = tab === t.value;
            return (
              <Link
                key={t.value}
                href={`/mes-demandes?tab=${t.value}`}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {t.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-white/5 text-white/30"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Liste */}
        {filtered.length === 0 ? (
          <div className="bg-[#0D1117] border border-white/10 rounded-xl py-16 text-center">
            <p className="text-white/30 text-sm">Aucune demande dans cette catégorie</p>
            <Link
              href="/nouvelle-demande"
              className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#009460] text-white text-sm font-semibold hover:bg-[#009460]/90 transition-colors"
            >
              Nouvelle demande
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {(filtered as DemandeAvecDocument[]).map((d) => (
              <DemandeCard key={d.id} demande={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
