"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Accueil", href: "#" },
  { label: "Comment ça marche", href: "#flow" },
  { label: "NaissanceChain", href: "#naissancechain" },
  { label: "À propos", href: "#cta" },
];

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#06090F]/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#009460]" />
          <span className="font-bold text-lg text-white">
            Identi<span className="text-[#009460]">Guinée</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-white/20 text-sm text-white hover:border-white/40 transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-[#009460] hover:bg-[#007a50] text-sm text-white font-medium transition-colors"
          >
            Faire une demande
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#06090F] border-t border-white/10 px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="block text-white/70 hover:text-white text-sm py-1">
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" className="text-center px-4 py-2 rounded-lg border border-white/20 text-sm text-white">
              Se connecter
            </Link>
            <Link href="/register" className="text-center px-4 py-2 rounded-lg bg-[#009460] text-sm text-white font-medium">
              Faire une demande
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
}
