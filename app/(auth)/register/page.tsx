"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateIdBlockchain } from "@/lib/utils";
import { COMMUNES_GUINEE } from "@/lib/communes";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", password: "", telephone: "", commune: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const id_blockchain = generateIdBlockchain();

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nom: form.nom,
          prenom: form.prenom,
          telephone: form.telephone,
          commune: form.commune,
          id_blockchain,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#009460] transition-colors";

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <Image src="/logo.png" alt="IdentiGuinée" width={64} height={64} className="rounded-xl" />
        </div>
        <p className="text-white/50 mt-2 text-sm">Identité numérique citoyenne</p>
      </div>

      {/* Card */}
      <div className="bg-[#0D1117] rounded-2xl p-8 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6">Créer un compte</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Nom</label>
              <input
                required value={form.nom} onChange={(e) => set("nom", e.target.value)}
                className={inputClass} placeholder="Diallo"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Prénom</label>
              <input
                required value={form.prenom} onChange={(e) => set("prenom", e.target.value)}
                className={inputClass} placeholder="Mamadou"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Email</label>
            <input
              type="email" required value={form.email} onChange={(e) => set("email", e.target.value)}
              className={inputClass} placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Mot de passe</label>
            <input
              type="password" required minLength={6} value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className={inputClass} placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Téléphone</label>
            <input
              type="tel" value={form.telephone} onChange={(e) => set("telephone", e.target.value)}
              className={inputClass} placeholder="+224 6XX XXX XXX"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Commune</label>
            <select
              required value={form.commune} onChange={(e) => set("commune", e.target.value)}
              className={inputClass + " appearance-none"}
            >
              <option value="" disabled className="bg-[#0D1117]">Sélectionner une commune</option>
              {COMMUNES_GUINEE.map((c) => (
                <option key={c} value={c} className="bg-[#0D1117]">{c}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-[#CE1126] text-sm bg-[#CE1126]/10 border border-[#CE1126]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#009460] hover:bg-[#007a50] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-[#FCD116] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
