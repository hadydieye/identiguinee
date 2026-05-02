"use client";

import Link from "next/link";
import { Bell, User, LogOut, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type Notification = {
  id: string;
  type_document: string;
  statut: string;
  reference: string;
  created_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  acte_naissance: "Acte de naissance",
  cni: "Carte d'identité nationale",
  passeport: "Passeport",
  certificat_nationalite: "Certificat de nationalité",
};

export function Navbar({ prenom }: { prenom?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNotifs() {
      const { data } = await supabase
        .from("demandes")
        .select("id, type_document, statut, reference, created_at")
        .in("statut", ["certifie", "rejete"])
        .order("created_at", { ascending: false })
        .limit(10);
      setNotifications(data ?? []);
    }
    fetchNotifs();
  }, []);

  // Fermer les dropdowns en cliquant ailleurs
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06090F]/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-[#FCD116] font-bold text-xl">Identi</span>
          <span className="text-[#009460] font-bold text-xl">Guinée</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* Cloche notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen((v) => !v); setUserOpen(false); }}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Bell className="w-5 h-5 text-white/70" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#CE1126]" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0D1117] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white font-semibold text-sm">Notifications</p>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-white/40 text-sm text-center py-6">Aucune notification</p>
                ) : (
                  <ul className="max-h-72 overflow-y-auto divide-y divide-white/5">
                    {notifications.map((n) => (
                      <li key={n.id}>
                        <Link
                          href={`/mes-demandes?tab=${n.statut}`}
                          onClick={() => setNotifOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                          <span
                            className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                              n.statut === "certifie" ? "bg-[#009460]" : "bg-[#CE1126]"
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-white text-xs font-medium truncate">
                              {TYPE_LABELS[n.type_document] ?? n.type_document}
                            </p>
                            <p className="text-white/40 text-xs font-mono">#{n.reference}</p>
                            <p className="text-white/30 text-xs mt-0.5">
                              {n.statut === "certifie" ? "✓ Certifié" : "✗ Rejeté"} ·{" "}
                              {new Date(n.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Bouton profil */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => { setUserOpen((v) => !v); setNotifOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              <span>{prenom ?? "Profil"}</span>
            </button>

            {userOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0D1117] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <Link
                  href="/dashboard/profil"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  Mon profil
                </Link>
                <div className="border-t border-white/10" />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#CE1126]/80 hover:bg-[#CE1126]/10 hover:text-[#CE1126] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
