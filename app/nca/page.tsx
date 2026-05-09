import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DashboardAreaChart, DashboardPieChart } from "./_components/Charts";

const STATUT_COLORS: Record<string, string> = {
  certifie: "#00E87A", en_cours: "#F6AD55", rejete: "#EF4444",
};
const TYPE_LABELS: Record<string, string> = {
  acte_naissance: "Acte naissance", cni: "CNI", passeport: "Passeport", certificat_nationalite: "Cert. nationalité",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [
    { count: totalToday },
    { count: certifieToday },
    { count: enCours },
    { count: rejeteToday },
    { data: dernières },
    { data: allDemandes },
  ] = await Promise.all([
    supabase.from("demandes").select("*", { count: "exact", head: true }).gte("created_at", today),
    supabase.from("demandes").select("*", { count: "exact", head: true }).eq("statut", "certifie").gte("created_at", today),
    supabase.from("demandes").select("*", { count: "exact", head: true }).eq("statut", "en_cours"),
    supabase.from("demandes").select("*", { count: "exact", head: true }).eq("statut", "rejete").gte("created_at", today),
    supabase.from("demandes").select("id, reference, nom, prenom, type_document, created_at, statut").order("created_at", { ascending: false }).limit(5),
    supabase.from("demandes").select("created_at, type_document").gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
  ]);

  // Group by day for area chart
  const byDay: Record<string, number> = {};
  (allDemandes ?? []).forEach((d) => {
    const day = d.created_at.split("T")[0];
    byDay[day] = (byDay[day] ?? 0) + 1;
  });
  const areaData = Object.entries(byDay).sort().map(([date, count]) => ({ date: date.slice(5), count }));

  // Group by type for pie
  const byType: Record<string, number> = {};
  (allDemandes ?? []).forEach((d) => { byType[d.type_document] = (byType[d.type_document] ?? 0) + 1; });
  const pieData = Object.entries(byType).map(([name, value]) => ({ name: TYPE_LABELS[name] ?? name, value }));

  const kpis = [
    { label: "Demandes aujourd'hui", value: totalToday ?? 0, color: "#3B82F6" },
    { label: "Certifiées", value: certifieToday ?? 0, color: "#00E87A" },
    { label: "En attente", value: enCours ?? 0, color: "#F6AD55" },
    { label: "Rejetées", value: rejeteToday ?? 0, color: "#EF4444" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-white text-xl font-bold">Tableau de bord</h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
            <div className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[#9ca3af] text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
          <div className="text-white text-sm font-semibold mb-4">Demandes — 30 derniers jours</div>
          <DashboardAreaChart data={areaData} />
        </div>
        <div className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
          <div className="text-white text-sm font-semibold mb-4">Répartition par type</div>
          <DashboardPieChart data={pieData} />
          <div className="mt-3 space-y-1">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-[#9ca3af]">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ["#00E87A","#F6AD55","#3B82F6","#EF4444"][i % 4] }} />
                {d.name} — {d.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
        <div className="text-white text-sm font-semibold mb-4">5 dernières demandes</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#6b7280] text-xs border-b border-[#2a2a4a]">
              {["Référence", "Citoyen", "Type", "Date", "Statut", ""].map((h) => (
                <th key={h} className="text-left pb-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(dernières ?? []).map((d) => (
              <tr key={d.id} className="border-b border-[#1e1e3a] text-[#d1d5db]">
                <td className="py-2.5 font-mono text-xs">{d.reference}</td>
                <td className="py-2.5">{d.prenom} {d.nom}</td>
                <td className="py-2.5 text-xs">{TYPE_LABELS[d.type_document] ?? d.type_document}</td>
                <td className="py-2.5 text-xs text-[#6b7280]">{new Date(d.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${STATUT_COLORS[d.statut]}22`, color: STATUT_COLORS[d.statut] }}>
                    {d.statut}
                  </span>
                </td>
                <td className="py-2.5">
                  <Link href={`/nca/demandes/${d.id}`} className="text-xs text-[#00E87A] hover:underline">Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
