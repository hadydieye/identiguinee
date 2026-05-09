import { createClient } from "@/lib/supabase/server";
import { BlockchainFeed } from "./_components/BlockchainFeed";

export default async function BlockchainPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [
    { data: maxBloc },
    { count: certToday },
    { count: fraudes },
    { data: txs },
  ] = await Promise.all([
    supabase.from("documents_certifies").select("bloc_number").order("bloc_number", { ascending: false }).limit(1),
    supabase.from("documents_certifies").select("*", { count: "exact", head: true }).gte("created_at", today),
    supabase.from("verifications_admin").select("*", { count: "exact", head: true }).eq("resultat", "anomalie"),
    supabase.from("documents_certifies").select("id, bloc_number, hash, created_at, timestamp_blockchain, demandes(nom, prenom, id_blockchain, statut)").order("bloc_number", { ascending: false }).limit(100),
  ]);

  const kpis = [
    { label: "Bloc actuel", value: `#${maxBloc?.[0]?.bloc_number ?? 0}`, color: "#00E87A" },
    { label: "Certifications aujourd'hui", value: certToday ?? 0, color: "#3B82F6" },
    { label: "Fraudes détectées", value: fraudes ?? 0, color: "#EF4444" },
  ];

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-white text-xl font-bold">Blockchain NaissanceChain</h1>

      <div className="grid grid-cols-3 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
            <div className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[#9ca3af] text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="text-white text-sm font-semibold">Transactions</div>
      <BlockchainFeed txs={(txs ?? []) as any} />
    </div>
  );
}
