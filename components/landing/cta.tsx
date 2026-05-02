"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useMotionConfig } from "@/hooks/use-motion-config";

const kpis = [
  { value: "0",     color: "#00E87A", label: "intermédiaires humains" },
  { value: "2 min", color: "#C9A84C", label: "pour recevoir votre document" },
  { value: "100%",  color: "#FFFFFF", label: "vérifiable par QR code" },
];

function KentePattern() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
      <defs>
        <pattern id="kente-cta" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="#C9A84C" strokeWidth="1" />
          <polyline points="0,10 10,20 0,30" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <polyline points="40,10 30,20 40,30" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kente-cta)" />
    </svg>
  );
}

export function Cta() {
  const { fadeUp, staggerVariants, cardVariants } = useMotionConfig();

  return (
    <section id="cta" className="relative py-24 overflow-hidden" style={{ background: "#0D0D0D" }}>
      {/* Diagonal gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(0,107,60,0.30) 0%, transparent 65%)" }} />
      {/* Kente */}
      <KentePattern />
      {/* Blurred glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "rgba(0,107,60,0.15)", filter: "blur(80px)" }} />

      <div className="relative mx-auto max-w-[700px] px-4 text-center">
        {/* Badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
          <span
            className="text-[11px] font-mono px-4 py-1.5 rounded-full"
            style={{ color: "#00E87A", background: "rgba(0,232,122,0.10)", border: "1px solid #00E87A", letterSpacing: "0.05em" }}
          >
            DISPONIBLE MAINTENANT
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          {...fadeUp(0.1)}
          className="text-[52px] font-bold leading-[1.1] mb-6"
          style={{ fontFamily: "var(--font-clash, sans-serif)", color: "white" }}
        >
          Vos documents officiels<br />
          en 2 minutes,<br />
          <span style={{ color: "#00E87A", textDecoration: "underline", textDecorationColor: "rgba(0,232,122,0.4)" }}>
            sans corruption
          </span>
        </motion.h2>

        {/* Sub */}
        <motion.p {...fadeUp(0.15)} className="text-[17px] max-w-[500px] mx-auto mb-12" style={{ color: "#A0AEC0" }}>
          Rejoignez la révolution de l&apos;identité numérique en Guinée. Gratuit pour les citoyens. Sécurisé par blockchain.
        </motion.p>

        {/* KPIs */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerVariants}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {kpis.map((k) => (
            <motion.div key={k.label} variants={cardVariants()} className="flex flex-col items-center gap-2">
              <span
                className="font-bold leading-none"
                style={{ fontSize: "48px", color: k.color, fontFamily: "var(--font-clash, sans-serif)" }}
              >
                {k.value}
              </span>
              <p className="text-[14px]" style={{ color: "#A0AEC0" }}>{k.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            href="/register"
            className="px-10 py-[18px] rounded-xl font-bold text-[16px] text-black transition-all"
            style={{ background: "#00E87A", boxShadow: "0 0 32px rgba(0,232,122,0.50)" }}
          >
            Commencer ma demande
          </Link>
          <a
            href="#flow"
            className="px-10 py-[18px] rounded-xl font-semibold text-[16px] transition-colors"
            style={{ border: "1px solid #C9A84C", color: "#C9A84C" }}
          >
            Voir la démo
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p {...fadeUp(0.35)} className="flex items-center justify-center gap-2 text-[13px]" style={{ color: "#A0AEC0" }}>
          <Lock className="w-3.5 h-3.5" />
          Sécurisé par NaissanceChain · MIABE Hackathon 2026
        </motion.p>
      </div>
    </section>
  );
}
