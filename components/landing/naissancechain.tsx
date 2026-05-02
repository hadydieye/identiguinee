"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMotionConfig } from "@/hooks/use-motion-config";

const features = [
  { title: "Smart Contracts",            color: "#006B3C", desc: "Des contrats intelligents Solidity automatisent l'intégralité du processus. Aucun agent ne peut intervenir dans la décision de délivrance." },
  { title: "Signature cryptographique",  color: "#C9A84C", desc: "Chaque document est signé avec une clé privée du contrat. Impossible à falsifier. Vérifiable instantanément par n'importe quelle institution." },
  { title: "QR Code d'authentification", color: "#00E87A", desc: "Scanner le QR code déclenche une vérification en temps réel sur la blockchain. Authentique ou faux en moins de 3 secondes." },
  { title: "Registre immuable",          color: "#A0AEC0", desc: "Chaque action — demande, vérification, délivrance — est enregistrée avec horodatage. Permanent, transparent, inviolable." },
];

const flowBlocks = [
  { icon: "📋", label: "DEMANDE SOUMISE",              sub: "Citoyen soumet formulaire",              border: "#2D3748", subColor: "#A0AEC0", bg: "#1A1A2E" },
  { icon: "⛓",  label: "SMART CONTRACT ACTIVÉ",        sub: "0x7f3a8b2c...",                          border: "#006B3C", subColor: "#00E87A", bg: "#1A1A2E" },
  { icon: "🔍", label: "VÉRIFICATION NAISSANCECHAIN",  sub: "Registre consulté · Identité validée",   border: "#C9A84C", subColor: "#C9A84C", bg: "#1A1A2E" },
  { icon: "📄", label: "DOCUMENT GÉNÉRÉ",              sub: "Signature cryptographique apposée",       border: "#00E87A", subColor: "#00E87A", bg: "#1A1A2E", glow: "0 0 12px rgba(0,232,122,0.25)" },
  { icon: "✅", label: "ENREGISTRÉ SUR BLOCKCHAIN",    sub: "Immuable · Auditable · Permanent",        border: "#00E87A", subColor: "#A0AEC0", bg: "rgba(0,107,60,0.15)", blockNum: "#847291" },
];

export function NaissanceChain() {
  const { fadeUp, staggerVariants, cardVariants } = useMotionConfig();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % flowBlocks.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="naissancechain" className="py-20" style={{ background: "#16213E" }}>
      {/* Diagonal grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.03 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="1" />
              <line x1="0" y1="0" x2="40" y2="0" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4">
        <div className="text-center mb-14">
          <motion.p
            {...fadeUp(0)}
            className="text-[11px] font-mono uppercase mb-4"
            style={{ color: "#C9A84C", letterSpacing: "2px" }}
          >
            TECHNOLOGIE BLOCKCHAIN
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="text-[40px] font-bold leading-tight mb-3"
            style={{ fontFamily: "var(--font-clash, sans-serif)", color: "white" }}
          >
            NaissanceChain —{" "}
            <span style={{ color: "#C9A84C" }}>le registre qui rend<br />la corruption impossible</span>
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-[16px] max-w-[600px] mx-auto" style={{ color: "#A0AEC0" }}>
            Un smart contract Solidity automatise chaque décision. Zéro discrétion humaine. Zéro opportunité de corruption.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left — feature cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerVariants}
            className="space-y-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={cardVariants(false)}
                className="flex gap-4 rounded-xl px-6 py-5"
                style={{ background: "#0D0D0D", borderLeft: `3px solid ${f.color}` }}
              >
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: `${f.color}20` }}>
                  <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 13,4 13,10 7,13 1,10 1,4" fill={f.color} /></svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[16px] mb-1">{f.title}</h4>
                  <p className="text-[14px] leading-relaxed" style={{ color: "#A0AEC0" }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right — animated flow */}
          <motion.div
            {...fadeUp(0.2)}
            className="rounded-2xl p-6"
            style={{ background: "#0D0D0D", border: "1px solid #2D3748" }}
          >
            <p className="text-[14px] font-semibold mb-5" style={{ color: "#A0AEC0" }}>
              Flow de délivrance automatique
            </p>
            <div className="space-y-0">
              {flowBlocks.map((b, i) => (
                <div key={b.label}>
                  <div
                    className="flex items-start gap-3 rounded-xl px-4 py-3 transition-all duration-500"
                    style={{
                      background: active === i ? `${b.border}15` : b.bg,
                      border: `1px solid ${active === i ? b.border : "transparent"}`,
                      boxShadow: active === i && b.glow ? b.glow : undefined,
                    }}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{b.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-mono font-semibold text-white">{b.label}</p>
                      {b.blockNum && (
                        <p className="text-[11px] font-mono" style={{ color: "#00E87A" }}>#{b.blockNum}</p>
                      )}
                      <p className="text-[11px] mt-0.5" style={{ color: b.subColor, opacity: active === i ? 1 : 0.5 }}>{b.sub}</p>
                    </div>
                    {active === i && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: b.border, boxShadow: `0 0 8px ${b.border}` }} />
                    )}
                  </div>
                  {i < flowBlocks.length - 1 && (
                    <div
                      className="ml-[1.35rem] w-px h-4 transition-colors duration-500"
                      style={{ background: active > i ? "#006B3C" : "#2D3748" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom banner */}
        <motion.div
          {...fadeUp(0.35)}
          className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: "rgba(0,107,60,0.15)", border: "1px solid #006B3C" }}
        >
          <p
            className="text-[24px] font-bold"
            style={{ fontFamily: "var(--font-clash, sans-serif)", color: "white", textShadow: "0 0 30px rgba(0,107,60,0.6)" }}
          >
            En supprimant le rôle de l&apos;agent, on supprime structurellement la corruption.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
