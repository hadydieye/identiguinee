"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Soumettez votre demande",
    desc: "Remplissez le formulaire en ligne depuis votre téléphone ou ordinateur. Uploadez vos justificatifs. Aucun déplacement nécessaire.",
    badge: "2 minutes",
    sub: "Propulsé par NaissanceChain",
    extra: null,
  },
  {
    num: "02",
    title: "Vérification NaissanceChain",
    desc: "Le smart contract interroge automatiquement le registre NaissanceChain. Vérification en temps réel. Sans possibilité de corruption.",
    badge: null,
    sub: null,
    extra: "hash",
  },
  {
    num: "03",
    title: "Téléchargez votre document",
    desc: "Votre document officiel certifié est généré avec signature cryptographique et QR code unique. Téléchargez-le immédiatement. Vérifiable par toute institution.",
    badge: "Document prêt en 2 min",
    sub: null,
    extra: "certified",
  },
];

const inView = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function FlowSteps() {
  return (
    <section id="flow" className="py-24 bg-[#06090F]">
      <div className="mx-auto max-w-6xl px-4">
        <motion.p
          {...inView}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-semibold tracking-widest text-[#009460] uppercase mb-4"
        >
          PROCESSUS AUTOMATISÉ
        </motion.p>

        <motion.h2
          {...inView}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-3xl md:text-4xl font-bold text-white mb-3"
        >
          De la demande au document, en 3 étapes
        </motion.h2>

        <motion.p
          {...inView}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-white/50 mb-12 max-w-xl mx-auto"
        >
          Aucun agent humain n&apos;intervient dans la décision. Le smart contract décide seul.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid md:grid-cols-3 gap-6"
        >
          {steps.map((s) => (
            <motion.div
              key={s.num}
              variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-[#0D1117] border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
            >
              <span className="text-4xl font-bold text-[#009460]/30">{s.num}</span>
              <h3 className="text-white font-semibold text-lg">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed flex-1">{s.desc}</p>

              {s.badge && (
                <span className="self-start bg-[#009460]/10 text-[#009460] text-xs font-medium px-3 py-1 rounded-full border border-[#009460]/20">
                  ⏱ {s.badge}
                </span>
              )}
              {s.sub && (
                <span className="text-white/30 text-xs">{s.sub}</span>
              )}
              {s.extra === "hash" && (
                <code className="text-[#009460] text-xs font-mono bg-[#009460]/5 border border-[#009460]/20 rounded px-3 py-2">
                  0x7f3a...b291
                </code>
              )}
              {s.extra === "certified" && (
                <span className="self-start bg-[#009460] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  CERTIFIÉ ✓
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
