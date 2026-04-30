"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => { setShow(window.innerWidth >= 768); }, []);

  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    let raf: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of dots) {
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 148, 96, ${d.opacity})`; ctx.fill();
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0 || d.x > canvas.width) d.dx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.dy *= -1;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [show]);

  if (!show) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export function Hero() {
  const shouldReduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, ...(shouldReduce || isMobile ? {} : { y: 24 }) },
    animate: { opacity: 1, ...(shouldReduce || isMobile ? {} : { y: 0 }) },
    transition: { duration: shouldReduce ? 0 : 0.6, delay: shouldReduce ? 0 : delay },
  });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <Particles />
      <div className="hidden md:block absolute top-1/3 left-1/4 w-96 h-96 bg-[#009460]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 w-full py-24 pt-28">
        {/* Two-column layout: text left, card right */}
        <div className="flex flex-col md:flex-row md:items-center gap-12">

          {/* Left — text */}
          <div className="flex-1 space-y-6 md:max-w-[55%]">
            <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-bold leading-tight text-white">
              Fini les pots-de-vin pour{" "}
              <span className="text-[#009460]">vos papiers officiels</span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-white/60 text-lg leading-relaxed">
              IdentiGuinée automatise la délivrance de documents d&apos;identité par blockchain.
              Zéro intermédiaire. Zéro corruption possible. Vos documents en 2 minutes.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3">
              <Link href="/register" className="px-6 py-3 bg-[#009460] hover:bg-[#007a50] text-white font-semibold rounded-lg transition-colors">
                Faire une demande
              </Link>
              <a href="#flow" className="px-6 py-3 border border-white/20 hover:border-white/40 text-white rounded-lg transition-colors">
                Comment ça marche
              </a>
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="flex items-center gap-2 text-sm text-white/40">
              <ShieldCheck className="w-4 h-4 text-[#009460] shrink-0" />
              <span>Sécurisé par blockchain · Document en 2 minutes · Aucune officialité</span>
            </motion.div>
          </div>

          {/* Right — floating card, desktop only */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduce ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduce ? 0 : 0.7, delay: shouldReduce ? 0 : 0.3 }}
            className="hidden md:block flex-shrink-0 w-[320px]"
          >
            <motion.div
              animate={shouldReduce ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[#0D1117] border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/60"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">République de Guinée</p>
                  <p className="text-white font-semibold text-sm mt-0.5">Acte de Naissance</p>
                </div>
                <span className="flex items-center gap-1.5 bg-[#009460]/20 text-[#009460] text-[10px] font-semibold px-2 py-1 rounded-full border border-[#009460]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009460] animate-pulse" />
                  CERTIFIÉ
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[["Nom","DIALLO"],["Prénom","Mamadou"],["Date de naissance","14 mars 1995"],["N°","GN-2026-847291"],["Commune","Conakry"]].map(([k,v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-white/40">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="w-9 h-9 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                  <span className="text-[7px] text-white/30 font-mono">QR</span>
                </div>
                <div className="text-right">
                  <p className="text-white/30 text-[10px]">Signé par NaissanceChain</p>
                  <p className="text-[#009460] text-[10px] font-mono">0x7f3a...b291</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
