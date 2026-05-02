"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMotionConfig } from "@/hooks/use-motion-config";

const steps = [
  {
    num: "01",
    numColor: "#00E87A",
    numBg: "rgba(0,232,122,0.15)",
    border: "#2D3748",
    hoverBorder: "#006B3C",
    glow: "",
    icon: "📤",
    title: "Soumettez votre demande",
    desc: "Remplissez le formulaire en ligne depuis votre téléphone ou ordinateur. Uploadez vos justificatifs. Aucun déplacement nécessaire.",
    badge: { text: "⏱ 3 minutes", color: "#00E87A", bg: "rgba(0,232,122,0.08)", border: "rgba(0,232,122,0.3)" },
    extra: null,
  },
  {
    num: "02",
    numColor: "#C9A84C",
    numBg: "rgba(201,168,76,0.15)",
    border: "#C9A84C",
    hoverBorder: "#C9A84C",
    glow: "0 8px 32px rgba(201,168,76,0.15)",
    icon: "⛓️",
    title: "Vérification NaissanceChain",
    desc: "Le smart contract croise automatiquement vos données avec le registre NaissanceChain. Vérification en temps réel, sans agent, sans possibilité de corruption.",
    badge: { text: "Propulsé par blockchain", color: "#C9A84C", bg: "rgba(201,168,76,0.08)", border: "rgba(201,168,76,0.3)" },
    extra: "hash",
  },
  {
    num: "03",
    numColor: "#00E87A",
    numBg: "rgba(0,232,122,0.15)",
    border: "#00E87A",
    hoverBorder: "#00E87A",
    glow: "0 8px 32px rgba(0,232,122,0.20)",
    icon: "📄",
    title: "Téléchargez votre document",
    desc: "Votre document officiel certifié est généré avec signature cryptographique et QR code unique. Téléchargez-le instantanément. Vérifiable par toute institution.",
    badge: { text: "⚡ Document reçu en 2 min", color: "#00E87A", bg: "rgba(0,232,122,0.08)", border: "rgba(0,232,122,0.3)" },
    extra: "certified",
  },
];

function Arrow() {
  return (
    <div className="hidden md:flex items-center justify-center flex-shrink-0 w-8">
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
        <line x1="0" y1="12" x2="24" y2="12" stroke="#006B3C" strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points="24,7 32,12 24,17" fill="#006B3C" />
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </svg>
    </div>
  );
}

export function FlowSteps() {
  const { fadeUp, staggerVariants, cardVariants } = useMotionConfig();

  return (
    <section id="flow" className="py-20" style={{ background: "#0D0D0D" }}>
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="text-center mb-14">
          <motion.p
            {...fadeUp(0)}
            className="text-[11px] font-mono uppercase mb-4"
            style={{ color: "#00E87A", letterSpacing: "2px" }}
          >
            PROCESSUS AUTOMATISÉ
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="text-[40px] font-bold leading-tight mb-3"
            style={{ fontFamily: "var(--font-clash, sans-serif)", color: "white" }}
          >
            De la demande au document,{" "}
            <span style={{ color: "#00E87A" }}>en 3 étapes</span>
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-[16px] max-w-xl mx-auto" style={{ color: "#A0AEC0" }}>
            Aucun agent humain n&apos;intervient dans la décision. Le smart contract décide seul.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ ...staggerVariants, visible: { transition: { staggerChildren: 0.15 } } }}
          className="flex flex-col md:flex-row items-stretch gap-0"
        >
          {steps.map((s, i) => (
            <>
              <motion.div
                key={s.num}
                variants={cardVariants()}
                className="flex-1 flex flex-col gap-4 rounded-2xl p-8 transition-all duration-300 group"
                style={{ background: "#1A1A2E", border: `1px solid ${s.border}`, boxShadow: s.glow || undefined }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-[13px] font-mono font-bold px-3 py-1 rounded-lg"
                    style={{ color: s.numColor, background: s.numBg }}
                  >
                    {s.num}
                  </span>
                </div>

                <div className="text-4xl">{s.icon}</div>

                <h3 className="text-[22px] font-semibold text-white" style={{ fontFamily: "var(--font-clash, sans-serif)" }}>
                  {s.title}
                </h3>

                <p className="text-[15px] leading-relaxed flex-1" style={{ color: "#A0AEC0" }}>{s.desc}</p>

                {s.extra === "hash" && (
                  <code className="text-[11px] font-mono px-3 py-2 rounded-lg" style={{ color: "#C9A84C", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
                    0x7f3a...bc92
                  </code>
                )}

                {s.extra === "certified" && (
                  <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: "white" }}>
                    <span className="text-[11px] font-bold text-[#006B3C]">CERTIFIÉ ✓</span>
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-[8px] text-gray-400 font-mono">QR</div>
                  </div>
                )}

                <span
                  className="self-start text-[12px] font-medium px-3 py-1.5 rounded-full"
                  style={{ color: s.badge.color, background: s.badge.bg, border: `1px solid ${s.badge.border}` }}
                >
                  {s.badge.text}
                </span>
              </motion.div>
              {i < steps.length - 1 && <Arrow key={`arrow-${i}`} />}
            </>
          ))}
        </motion.div>

        <motion.p
          {...fadeUp(0.4)}
          className="text-center text-[14px] italic mt-12"
          style={{ color: "#A0AEC0" }}
        >
          Chaque étape est enregistrée sur la blockchain. Immuable. Auditable. Transparent.
        </motion.p>
      </div>
    </section>
  );
}
