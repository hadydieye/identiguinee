import { createClient } from "@/lib/supabase/server";

const RESULTAT_COLORS: Record<string, string> = {
  confirme: "#00E87A", echec: "#EF4444", anomalie: "#F6AD55", en_cours: "#3B82F6",
};

export default async function VerificationsPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [
    { count: totalToday },
    { data: all },
    { data: history },
  ] = await Promise.all([
    supabase.from("verifications_admin").select("*", { count: "exact", head: true }).gte("created_at", today),
    supabase.from("verifications_admin").select("resultat, duree_ms"),
    supabase.from("verifications_admin").select("id, type, source, duree_ms, created_at, resultat, citoyen_id, profiles(nom, prenom)").order("created_at", { ascending: false }).limit(50),
  ]);

  const total = all?.length ?? 0;
  const confirmes = all?.filter((v) => v.resultat === "confirme").length ?? 0;
  const tauxSucces = total > 0 ? Math.round((confirmes / total) * 100) : 0;
  const avgDuree = total > 0 ? (all!.reduce((s, v) => s + (v.duree_ms ?? 0), 0) / total / 1000).toFixed(1) : "0";
  const anomalies = all?.filter((v) => v.resultat === "anomalie").length ?? 0;

  const kpis = [
    { label: "Vérifications aujourd'hui", value: totalToday ?? 0, color: "#3B82F6" },
    { label: "Taux de succès", value: `${tauxSucces}%`, color: "#00E87A" },
    { label: "Durée moyenne", value: `${avgDuree}s`, color: "#F6AD55" },
    { label: "Anomalies", value: anomalies, color: "#EF4444" },
  ];

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-white text-xl font-bold">Vérifications</h1>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
            <div className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[#9ca3af] text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "#1A1A2E" }}>
        <div className="px-4 py-3 border-b border-[#2a2a4a] text-white text-sm font-semibold">Historique</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#6b7280] text-xs border-b border-[#2a2a4a]">
              {["ID", "Citoyen", "Type", "Source", "Durée", "Date", "Résultat"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(history ?? []).map((v: any) => (
              <tr key={v.id} className="border-b border-[#1e1e3a] text-[#d1d5db] hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-[#6b7280]">{v.id.slice(0, 8)}…</td>
                <td className="px-4 py-3 text-xs">{v.profiles ? `${v.profiles.prenom} ${v.profiles.nom}` : "—"}</td>
                <td className="px-4 py-3 text-xs">{v.type ?? "—"}</td>
                <td className="px-4 py-3 text-xs">{v.source}</td>
                <td className="px-4 py-3 text-xs">{v.duree_ms ? `${v.duree_ms}ms` : "—"}</td>
                <td className="px-4 py-3 text-xs text-[#6b7280]">{new Date(v.created_at).toLocaleString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${RESULTAT_COLORS[v.resultat] ?? "#6b7280"}22`, color: RESULTAT_COLORS[v.resultat] ?? "#6b7280" }}>
                    {v.resultat}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
