import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUT_COLORS: Record<string, string> = { certifie: "#00E87A", en_cours: "#F6AD55", rejete: "#EF4444" };

export default async function CitoyensPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { search } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("profiles").select("id, nom, prenom, commune, id_blockchain, created_at");
  if (search) query = query.or(`nom.ilike.%${search}%,prenom.ilike.%${search}%,commune.ilike.%${search}%`);
  const { data: profiles } = await query.order("created_at", { ascending: false });

  // Get demande counts per user
  const { data: demandesCounts } = await supabase
    .from("demandes")
    .select("user_id, statut");

  const countMap: Record<string, { count: number; lastStatut: string }> = {};
  (demandesCounts ?? []).forEach((d) => {
    if (!countMap[d.user_id]) countMap[d.user_id] = { count: 0, lastStatut: d.statut };
    countMap[d.user_id].count++;
    countMap[d.user_id].lastStatut = d.statut;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">Citoyens</h1>
        <form>
          <input
            name="search"
            defaultValue={search}
            placeholder="Rechercher nom, prénom, commune…"
            className="w-64 px-3 py-2 rounded-lg bg-[#1A1A2E] border border-[#2a2a4a] text-white placeholder:text-[#6b7280] text-sm outline-none focus:border-[#006B3C]"
          />
        </form>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "#1A1A2E" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#6b7280] text-xs border-b border-[#2a2a4a]">
              {["ID Blockchain", "Citoyen", "Commune", "Documents", "Dernier statut", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => {
              const info = countMap[p.id];
              return (
                <tr key={p.id} className="border-b border-[#1e1e3a] text-[#d1d5db] hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#6b7280]">{p.id_blockchain ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#006B3C] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {(p.prenom?.[0] ?? "?").toUpperCase()}{(p.nom?.[0] ?? "").toUpperCase()}
                      </div>
                      <span className="text-xs">{p.prenom} {p.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">{p.commune ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-center">{info?.count ?? 0}</td>
                  <td className="px-4 py-3">
                    {info?.lastStatut ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${STATUT_COLORS[info.lastStatut]}22`, color: STATUT_COLORS[info.lastStatut] }}>
                        {info.lastStatut}
                      </span>
                    ) : <span className="text-[#6b7280] text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/nca/demandes?search=${encodeURIComponent((p.prenom ?? "") + " " + (p.nom ?? ""))}`} className="text-xs text-[#00E87A] hover:underline">
                      Profil
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
