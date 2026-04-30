"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMotionConfig } from "@/hooks/use-motion-config";

const kpis = [
  { value: "0",     label: "Intermédiaires humains" },
  { value: "2 min", label: "pour recevoir votre document" },
  { value: "100%",  label: "Vérifiable par QR code" },
];

export function Cta() {
  const { fadeUp, staggerVariants, cardVariants } = useMotionConfig();

  return (
    <section id="cta" className="py-20 bg-[#06090F]">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.p {...fadeUp(0)} className="text-xs font-semibold tracking-widest text-[#009460] uppercase mb-4">
          IMPACT ATTENDU
        </motion.p>
        <motion.h2 {...fadeUp(0.1)} className="text-3xl md:text-4xl font-bold text-white mb-4">
          Vos documents officiels en 2 minutes,{" "}
          <span className="text-[#009460]">sans corruption</span>
        </motion.h2>
        <motion.p {...fadeUp(0.15)} className="text-white/50 mb-10 max-w-xl mx-auto">
          Rejoignez la révolution de l&apos;identité numérique en Guinée. Gratuit pour les citoyens. Sécurisé par blockchain.
        </motion.p>

        {/* KPIs */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerVariants}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {kpis.map((k) => (
            <motion.div key={k.label} variants={cardVariants()} className="bg-[#0D1117] border border-white/10 rounded-2xl p-6">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{k.value}</p>
              <p className="text-white/40 text-sm">{k.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-4 mb-10">
          <Link href="/register" className="px-8 py-3 bg-[#009460] hover:bg-[#007a50] text-white font-semibold rounded-lg transition-colors">
            Commencer ma demande
          </Link>
          <Link href="#flow" className="px-8 py-3 border border-white/20 hover:border-white/40 text-white rounded-lg transition-colors">
            Voir la démo
          </Link>
        </motion.div>

        <motion.p {...fadeUp(0.35)} className="text-white/20 text-sm">
          Sécurisé par NaissanceChain · MIABE Hackathon 2025
        </motion.p>
      </div>
    </section>
  );
}
