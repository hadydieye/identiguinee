"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "150/180",
    color: "#CE1126",
    desc: "pays dans l'Indice de Perception de la Corruption · Transparency International, 2023",
  },
  {
    value: "60–70%",
    color: "#FCD116",
    desc: "des Guinéens ont payé informellement pour un document d'état civil",
  },
  {
    value: "25%",
    color: "#009460",
    desc: "des communes guinéennes disposent d'un système informatique d'état civil",
  },
  {
    value: "500K GNF",
    color: "#FFFFFF",
    desc: "prix d'un faux passeport guinéen sur le marché informel",
  },
];

const inView = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function Stats() {
  return (
    <section className="py-24 bg-[#06090F]">
      <div className="mx-auto max-w-6xl px-4">
        {/* Label */}
        <motion.p
          {...inView}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-semibold tracking-widest text-white/30 uppercase mb-4"
        >
          DONNÉES LÉGITIMES · TRANSPARENCE · INTERNATIONAL
        </motion.p>

        <motion.h2
          {...inView}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-3xl md:text-4xl font-bold text-white mb-3"
        >
          La corruption d&apos;état civil en Guinée, en chiffres
        </motion.h2>

        <motion.p
          {...inView}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-white/50 mb-12 max-w-xl mx-auto"
        >
          Ces données justifient pourquoi IdentiGuinée existe.
        </motion.p>

        {/* 4 cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.value}
              variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-[#0D1117] border border-white/10 rounded-2xl p-6 flex flex-col gap-3"
            >
              <span className="text-3xl font-bold" style={{ color: s.color }}>
                {s.value}
              </span>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Full-width card */}
        <motion.div
          {...inView}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#0D1117] border border-[#CE1126]/30 rounded-2xl p-6"
        >
          <p className="text-white/70 text-sm leading-relaxed text-center">
            <span className="text-[#CE1126] font-semibold">⚠ </span>
            La corruption dans l&apos;état civil facilite la fraude électorale, le trafic d&apos;identité
            et exclut les populations les plus pauvres.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
