import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DemandesFilters } from "./_components/DemandesFilters";

const STATUT_COLORS: Record<string, string> = { certifie: "#00E87A", en_cours: "#F6AD55", rejete: "#EF4444" };
const TYPE_LABELS: Record<string, string> = {
  acte_naissance: "Acte naissance", cni: "CNI", passeport: "Passeport", certificat_nationalite: "Cert. nationalité",
};
const PAGE_SIZE = 20;

export default async function DemandesPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const { statut, type, search, page: pageStr } = params;
  const page = parseInt(pageStr ?? "1") - 1;
  const supabase = await createClient();

  let query = supabase.from("demandes").select("id, reference, nom, prenom, type_document, created_at, statut, id_blockchain", { count: "exact" });
  if (statut) query = query.eq("statut", statut);
  if (type) query = query.eq("type_document", type);
  if (search) query = query.or(`reference.ilike.%${search}%,nom.ilike.%${search}%,prenom.ilike.%${search}%`);
  query = query.order("created_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  const { data: demandes, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">Demandes</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#2a2a4a] text-[#9ca3af] hover:text-white transition-colors">
            Exporter CSV
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#2a2a4a] text-[#9ca3af] hover:text-white transition-colors">
            Exporter PDF
          </button>
        </div>
      </div>

      <DemandesFilters statut={statut} type={type} search={search} />

      <div className="rounded-2xl overflow-hidden" style={{ background: "#1A1A2E" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#6b7280] text-xs border-b border-[#2a2a4a]">
              {["Référence", "Citoyen", "Type", "Date", "Statut", "ID Blockchain", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(demandes ?? []).map((d) => (
              <tr key={d.id} className="border-b border-[#1e1e3a] text-[#d1d5db] hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{d.reference}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#006B3C] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      {(d.prenom?.[0] ?? "?").toUpperCase()}{(d.nom?.[0] ?? "").toUpperCase()}
                    </div>
                    <span className="text-xs">{d.prenom} {d.nom}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">{TYPE_LABELS[d.type_document] ?? d.type_document}</td>
                <td className="px-4 py-3 text-xs text-[#6b7280]">{new Date(d.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${STATUT_COLORS[d.statut]}22`, color: STATUT_COLORS[d.statut] }}>
                    {d.statut}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#6b7280]">{d.id_blockchain ? `${d.id_blockchain.slice(0, 12)}…` : "—"}</td>
                <td className="px-4 py-3">
                  <Link href={`/nca/demandes/${d.id}`} className="text-xs text-[#00E87A] hover:underline">Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a4a]">
            <span className="text-xs text-[#6b7280]">{count} résultats</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
                  className="w-7 h-7 flex items-center justify-center rounded text-xs transition-colors"
                  style={{ background: p === page + 1 ? "#006B3C" : "#2a2a4a", color: p === page + 1 ? "#fff" : "#9ca3af" }}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
