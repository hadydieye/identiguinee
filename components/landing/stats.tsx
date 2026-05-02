"use client";

import { motion } from "framer-motion";
import { useMotionConfig } from "@/hooks/use-motion-config";

const stats = [
  {
    value: "150/180",
    color: "#C9A84C",
    border: "#C9A84C",
    icon: "🌍",
    label: "pays dans l'Indice de Corruption",
    source: "Transparency International 2023",
  },
  {
    value: "60–70%",
    color: "#FF3B3B",
    border: "#FF3B3B",
    icon: "💸",
    label: "des Guinéens ont payé informellement pour un document d'état civil",
    source: "TI Guinée, 2022",
  },
  {
    value: "25%",
    color: "#F6AD55",
    border: "#F6AD55",
    icon: "💻",
    label: "des communes guinéennes disposent d'un système informatique d'état civil",
    source: "Estimation DTC, 2024",
  },
  {
    value: "500K GNF",
    color: "#FFFFFF",
    border: "#2D3748",
    icon: "🛡️",
    label: "prix d'un faux passeport guinéen sur le marché informel",
    source: "Marché informel, estimation terrain",
  },
];

export function Stats() {
  const { fadeUp, staggerVariants, cardVariants } = useMotionConfig();

  return (
    <section className="py-20 border-t border-[#2D3748]" style={{ background: "#1A1A2E" }}>
      {/* Subtle hex bg */}
      <div className="relative mx-auto max-w-[1200px] px-4">
        <div className="text-center mb-12">
          <motion.p
            {...fadeUp(0)}
            className="text-[11px] font-mono text-[#C9A84C] uppercase mb-4"
            style={{ letterSpacing: "2px" }}
          >
            DONNÉES VÉRIFIÉES · TRANSPARENCY INTERNATIONAL
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="text-[40px] font-bold leading-tight mb-3"
            style={{ fontFamily: "var(--font-clash, sans-serif)", color: "white" }}
          >
            La corruption d&apos;état civil en Guinée,{" "}
            <span style={{ color: "#C9A84C" }}>en chiffres</span>
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-[16px]" style={{ color: "#A0AEC0" }}>
            Ces données justifient pourquoi IdentiGuinée existe.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5"
        >
          {stats.map((s) => (
            <motion.div
              key={s.value}
              variants={cardVariants()}
              className="relative flex flex-col gap-4 rounded-2xl p-8 overflow-hidden"
              style={{ background: "#0D0D0D", border: `1px solid ${s.border}` }}
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: s.border }} />

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${s.color}15` }}
                >
                  {s.icon}
                </div>
              </div>

              <span className="font-bold leading-none" style={{ fontSize: "56px", color: s.color, fontFamily: "var(--font-clash, sans-serif)" }}>
                {s.value}
              </span>

              <p className="text-[14px] leading-relaxed" style={{ color: "#A0AEC0" }}>{s.label}</p>

              <p className="text-[11px] font-mono mt-auto" style={{ color: "#A0AEC0", opacity: 0.6 }}>{s.source}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom statement */}
        <motion.div
          {...fadeUp(0.4)}
          className="relative rounded-2xl p-8 text-center overflow-hidden"
          style={{ background: "#0D0D0D", border: "1px solid #006B3C" }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: "#00E87A" }} />
          <p className="text-[18px] leading-relaxed" style={{ color: "white" }}>
            La corruption dans l&apos;état civil facilite la fraude électorale, le trafic d&apos;identité
            et exclut les populations les plus pauvres.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
