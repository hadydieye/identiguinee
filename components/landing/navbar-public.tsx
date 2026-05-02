"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { label: "Accueil", href: "#" },
  { label: "Comment ça marche", href: "#flow" },
  { label: "NaissanceChain", href: "#naissancechain" },
  { label: "À propos", href: "#cta" },
];

import Image from "next/image";

function HexLogo() {
  return <Image src="/logo.png" alt="IdentiGuinée" width={32} height={32} className="rounded-lg" />;
}

export function NavbarPublic() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/10" : "bg-[#0D0D0D]/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <HexLogo />
          <span className="font-bold text-[20px] text-white" style={{ fontFamily: "var(--font-clash, sans-serif)" }}>
            IdentiGuinée
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[15px] text-white/70">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl border border-[#C9A84C] text-[#C9A84C] text-sm font-medium hover:bg-[#C9A84C]/10 transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-[#006B3C] hover:bg-[#005a32] text-white text-sm font-medium transition-colors"
          >
            Faire une demande
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0D0D0D] border-t border-white/10 px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="block text-white/70 hover:text-white text-sm py-1">
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" className="text-center px-4 py-2 rounded-xl border border-[#C9A84C] text-[#C9A84C] text-sm">Se connecter</Link>
            <Link href="/register" className="text-center px-4 py-2 rounded-xl bg-[#006B3C] text-white text-sm font-medium">Faire une demande</Link>
          </div>
        </div>
      )}
    </motion.header>
  );
}
