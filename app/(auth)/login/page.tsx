"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Erreur de connexion");
      setLoading(false);
      return;
    }

    router.push(data.role === "admin" ? "/nca" : "/dashboard");
  }

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
        <h2 className="text-xl font-semibold text-white mb-6">Connexion</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1.5">Adresse email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#009460] transition-colors"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#009460] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[#CE1126] text-sm bg-[#CE1126]/10 border border-[#CE1126]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#009460] hover:bg-[#007a50] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-[#FCD116] hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
