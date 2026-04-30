"use client";

import Link from "next/link";
import { Bell, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Navbar({ prenom }: { prenom?: string }) {
  const router = useRouter();
  const supabase = createClient();

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
          <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-white/70" />
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
          >
            <User className="w-4 h-4" />
            <span>{prenom ?? "Profil"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
