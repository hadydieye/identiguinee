"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* ── Kente SVG pattern ── */
function KentePattern() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
      <defs>
        <pattern id="kente" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          {/* diamond */}
          <polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="#C9A84C" strokeWidth="1" />
          {/* zigzag */}
          <polyline points="0,10 10,20 0,30" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <polyline points="40,10 30,20 40,30" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kente)" />
    </svg>
  );
}

/* ── Floating hexagons ── */
const hexagons = [
  { size: 120, top: "8%",  left: "5%",  rotate: 15 },
  { size: 60,  top: "20%", right: "8%", rotate: -20 },
  { size: 80,  top: "55%", left: "2%",  rotate: 30 },
  { size: 40,  top: "70%", right: "15%",rotate: -10 },
  { size: 100, bottom: "10%", left: "40%", rotate: 45 },
  { size: 50,  top: "40%", right: "3%", rotate: 25 },
];

function FloatingHexagons() {
  return (
    <>
      {hexagons.map((h, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: h.top, left: h.left, right: (h as { right?: string }).right, bottom: (h as { bottom?: string }).bottom }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 100 100" style={{ transform: `rotate(${h.rotate}deg)`, opacity: 0.15 }}>
            <polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" fill="#006B3C" />
          </svg>
        </div>
      ))}
    </>
  );
}

/* ── Document card ── */
function CertifiedCard() {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: shouldReduce ? 0 : 0.7, delay: shouldReduce ? 0 : 0.3 }}
      className="hidden md:block flex-shrink-0 w-[300px]"
    >
      <motion.div
        animate={shouldReduce ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "rotate(5deg)", boxShadow: "0 0 40px rgba(0,232,122,0.3)" }}
        className="bg-[#1A1A2E] border border-[#2D3748] rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/40 text-[9px] uppercase tracking-widest font-mono">République de Guinée</p>
            <p className="text-white font-bold text-sm mt-0.5 uppercase tracking-wide">Acte de Naissance</p>
          </div>
          <span className="flex items-center gap-1.5 bg-[#00E87A]/15 text-[#00E87A] text-[9px] font-bold px-2.5 py-1 rounded-full border border-[#00E87A]/40" style={{ boxShadow: "0 0 10px rgba(0,232,122,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E87A] animate-pulse" />
            CERTIFIÉ
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {[["Nom","DIALLO"],["Prénom","Mamadou"],["Date de naissance","14 mars 1995"],["ID Blockchain","GN-2026-847291"],["Commune","Conakry"]].map(([k,v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-white/40">{k}</span>
              <span className="text-white font-medium font-mono text-[10px]">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => (
                Math.random() > 0.5 ? <rect key={`${r}-${c}`} x={c*4} y={r*4} width="3" height="3" fill="white" opacity="0.6" /> : null
              )))}
            </svg>
          </div>
          <div className="text-right">
            <p className="text-white/30 text-[9px]">Signé par NaissanceChain</p>
            <p className="text-[#00E87A] text-[10px] font-mono">0x7f3a...b291</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const shouldReduce = useReducedMotion();
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduce ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduce ? 0 : 0.6, delay: shouldReduce ? 0 : delay },
  });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#0D0D0D" }}>
      {/* Diagonal gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(0,107,60,0.35) 0%, transparent 60%)" }} />
      {/* Kente pattern */}
      <KentePattern />
      {/* Floating hexagons */}
      <FloatingHexagons />
      {/* Radial glow behind headline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(0,107,60,0.20) 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-6xl px-4 w-full py-24 pt-28">
        <div className="flex flex-col md:flex-row md:items-center gap-12">

          {/* Left — text */}
          <div className="flex-1 space-y-7 md:max-w-[55%]">
            {/* Badge */}
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2">
              <span
                className="flex items-center gap-2 text-[11px] font-mono text-[#C9A84C] border border-[#C9A84C] rounded-full px-4 py-1.5"
                style={{ background: "rgba(201,168,76,0.10)", letterSpacing: "0.05em" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,1 11,3.5 11,8.5 6,11 1,8.5 1,3.5" fill="#C9A84C" /></svg>
                MIABE Hackathon 2026 · GN-02
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-[64px] font-bold leading-[1.1] text-white" style={{ fontFamily: "var(--font-clash, sans-serif)" }}>
              Fini les pots-de-vin<br />
              <span style={{ color: "#00E87A" }}>pour vos papiers officiels</span>
            </motion.h1>

            {/* Sub */}
            <motion.p {...fadeUp(0.2)} className="text-[18px] leading-relaxed max-w-[600px]" style={{ color: "#A0AEC0" }}>
              IdentiGuinée automatise la délivrance de documents d&apos;identité par blockchain.
              Zéro intermédiaire. Zéro corruption possible. Vos documents en 2 minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl text-white font-semibold text-[16px] transition-all"
                style={{ background: "#006B3C", boxShadow: "0 0 24px rgba(0,107,60,0.40)" }}
              >
                Faire une demande
              </Link>
              <a
                href="#flow"
                className="px-8 py-4 rounded-xl font-semibold text-[16px] transition-colors"
                style={{ border: "1px solid #C9A84C", color: "#C9A84C", background: "transparent" }}
              >
                Comment ça marche
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center gap-4 text-[13px]" style={{ color: "#A0AEC0" }}>
              <span>🔒 Sécurisé par blockchain</span>
              <span className="w-px h-4 bg-white/20" />
              <span>⚡ Document en 2 minutes</span>
              <span className="w-px h-4 bg-white/20" />
              <span>✓ Reconnu officiellement</span>
            </motion.div>
          </div>

          {/* Right — card */}
          <CertifiedCard />
        </div>
      </div>
    </section>
  );
}
