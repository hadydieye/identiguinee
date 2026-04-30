"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const kpis = [
  { value: "0", label: "Intermédiaires humains" },
  { value: "2 min", label: "pour recevoir votre document" },
  { value: "100%", label: "Vérifiable par QR code" },
];

const inView = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function Cta() {
  return (
    <section id="cta" className="py-24 bg-[#06090F]">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.p
          {...inView}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-widest text-[#009460] uppercase mb-4"
        >
          IMPACT ATTENDU
        </motion.p>

        <motion.h2
          {...inView}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Vos documents officiels en 2 minutes, sans corruption
        </motion.h2>

        <motion.p
          {...inView}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-white/50 mb-12 max-w-xl mx-auto"
        >
          Rejoignez la révolution de l&apos;identité numérique en Guinée. Gratuit pour les citoyens. Sécurisé par blockchain.
        </motion.p>

        {/* KPIs */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {kpis.map((k) => (
            <motion.div
              key={k.label}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-[#0D1117] border border-white/10 rounded-2xl p-6"
            >
              <p className="text-3xl font-bold text-[#009460] mb-1">{k.value}</p>
              <p className="text-white/50 text-sm">{k.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          {...inView}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <Link
            href="/register"
            className="px-8 py-3 bg-[#009460] hover:bg-[#007a50] text-white font-semibold rounded-lg transition-colors"
          >
            Commencer ma demande
          </Link>
          <Link
            href="#flow"
            className="px-8 py-3 border border-white/20 hover:border-white/40 text-white rounded-lg transition-colors"
          >
            Voir la démo
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.p
          {...inView}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-white/20 text-sm"
        >
          Sécurisé par NaissanceChain · MIABE Hackathon 2025
        </motion.p>
      </div>
    </section>
  );
}
