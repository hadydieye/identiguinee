"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, FileText, Link2, Users, ShieldCheck,
  Settings, BarChart2, Bell, LogOut
} from "lucide-react";

const NAV = [
  { href: "/nca", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/nca/demandes", label: "Demandes", icon: FileText, badge: "en_cours" },
  { href: "/nca/blockchain", label: "Blockchain", icon: Link2 },
  { href: "/nca/citoyens", label: "Citoyens", icon: Users },
  { href: "/nca/verifications", label: "Vérifications", icon: ShieldCheck },
  { href: "/nca/parametres", label: "Paramètres", icon: Settings },
  { href: "/nca/rapports", label: "Rapports", icon: BarChart2 },
  { href: "/nca/alertes", label: "Alertes", icon: Bell, badge: "critique" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [enCours, setEnCours] = useState(0);
  const [critiques, setCritiques] = useState(0);
  const [blocActuel, setBlocActuel] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const [{ count: c1 }, { count: c2 }, { data: bloc }] = await Promise.all([
        supabase.from("demandes").select("*", { count: "exact", head: true }).eq("statut", "en_cours"),
        supabase.from("alertes").select("*", { count: "exact", head: true }).eq("niveau", "critique"),
        supabase.from("documents_certifies").select("bloc_number").order("bloc_number", { ascending: false }).limit(1),
      ]);
      setEnCours(c1 ?? 0);
      setCritiques(c2 ?? 0);
      setBlocActuel(bloc?.[0]?.bloc_number ?? null);
    }
    load();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#0D0D1A" }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col" style={{ width: 200, background: "#111120", borderRight: "1px solid #1e1e3a" }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-[#1e1e3a]">
          <div className="text-[#00E87A] font-bold text-sm leading-tight">IdentGuinée</div>
          <div className="text-[#6b7280] text-xs mt-0.5">Administration</div>
        </div>

        {/* Avatar */}
        <div className="px-4 py-4 border-b border-[#1e1e3a] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#006B3C] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AS</div>
          <div className="min-w-0">
            <div className="text-white text-xs font-medium truncate">Admin Système</div>
            <div className="text-[#6b7280] text-[10px] truncate">Super Admin</div>
          </div>
        </div>

        {/* Déconnexion */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors w-full border-b border-[#1e1e3a]"
          style={{ color: "#EF4444" }}
        >
          <LogOut size={14} />
          <span>Déconnexion</span>
        </button>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== "/nca" && pathname.startsWith(href));
            const count = badge === "en_cours" ? enCours : badge === "critique" ? critiques : 0;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors relative"
                style={{ color: active ? "#00E87A" : "#9ca3af", background: active ? "rgba(0,232,122,0.08)" : "transparent" }}
              >
                {active && <span className="absolute left-0 top-0 h-full w-0.5 bg-[#00E87A] rounded-r" />}
                <Icon size={14} />
                <span className="flex-1">{label}</span>
                {badge && count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: badge === "critique" ? "#EF4444" : "#F6AD55", color: "#fff" }}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#1e1e3a]">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E87A] animate-pulse" />
            <span className="text-[10px] text-[#00E87A]">NaissanceChain: En ligne</span>
          </div>
          <div className="text-[10px] text-[#6b7280]">
            Bloc actuel: #{blocActuel ?? "…"}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen" style={{ marginLeft: 200 }}>
        {children}
      </main>
    </div>
  );
}
