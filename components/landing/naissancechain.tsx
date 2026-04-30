"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMotionConfig } from "@/hooks/use-motion-config";

const features = [
  { title: "Smart Contracts",            desc: "Des contrats intelligents Solidity automatisent l'intégralité du processus. Aucun agent ne peut intervenir dans la décision de délivrance." },
  { title: "Signature cryptographique",  desc: "Chaque document est signé avec une clé privée du contrat. Impossible à falsifier. Vérifiable instantanément par n'importe quelle partie." },
  { title: "QR Code d'authentification", desc: "Chaque document génère une vérification en temps réel sur la blockchain. Authentique ou faux en moins de 3 secondes." },
  { title: "Registre immuable",          desc: "Chaque action — demande, vérification, délivrance — est enregistrée avec horodatage. Permanent. Transparent. Immuable." },
];

const flowSteps = [
  { label: "CITOYEN SOUMET",              sub: null },
  { label: "SMART CONTRACT ACTIVÉ",       sub: null },
  { label: "VÉRIFICATION NAISSANCECHAIN", sub: "Registre consulté · Identité vérifiée en <3s" },
  { label: "DOCUMENT GÉNÉRÉ",             sub: null },
  { label: "ENREGISTRÉ SUR BLOCKCHAIN",   sub: "Immuable · Certifié · Téléchargeable" },
];

export function NaissanceChain() {
  const { fadeUp, staggerVariants, cardVariants } = useMotionConfig();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % flowSteps.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="naissancechain" className="py-20 bg-[#06090F]">
      <div className="mx-auto max-w-6xl px-4">
        <motion.p {...fadeUp(0)} className="text-center text-xs font-semibold tracking-widest text-[#009460] uppercase mb-4">
          TECHNOLOGIE BLOCKCHAIN
        </motion.p>
        <motion.h2 {...fadeUp(0.1)} className="text-center text-3xl md:text-4xl font-bold text-white mb-3">
          NaissanceChain — le registre qui rend la corruption impossible
        </motion.h2>
        <motion.p {...fadeUp(0.15)} className="text-center text-white/50 mb-12 max-w-2xl mx-auto">
          Un smart contract Solidity automatise chaque décision. Zéro décision humaine. Zéro opportunité de corruption.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Features */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerVariants}
            className="space-y-5"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={cardVariants(false)} className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-[#009460] shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">{f.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated flow */}
          <motion.div {...fadeUp(0.2)} className="bg-[#0D1117] border border-white/10 rounded-2xl p-5">
            {flowSteps.map((step, i) => (
              <div key={step.label}>
                <div className={`flex items-start gap-3 rounded-xl px-3 py-3 transition-all duration-500 ${active === i ? "bg-[#009460]/10 border border-[#009460]/30" : ""}`}>
                  <div className="mt-1.5 shrink-0">
                    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                      active === i
                        ? "bg-[#009460] shadow-[0_0_10px_#009460]"
                        : "bg-white/20"
                    }`} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold tracking-wide transition-colors duration-500 ${
                      active === i ? "text-white" : "text-white/40"
                    }`}>
                      {step.label}
                    </p>
                    {step.sub && active === i && (
                      <p className="text-white/50 text-xs mt-0.5">{step.sub}</p>
                    )}
                  </div>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className={`ml-[1.1rem] w-px h-4 transition-colors duration-500 ${active > i ? "bg-[#009460]/40" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.blockquote {...fadeUp(0.3)} className="mt-12 text-center text-white/40 italic text-lg border-t border-white/10 pt-10">
          &ldquo;En supprimant le rôle de l&apos;agent, on supprime structurellement la corruption.&rdquo;
        </motion.blockquote>
      </div>
    </section>
  );
}
