"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Retourne les props d'animation adaptées au contexte :
 * - mobile (< 768px) ou prefers-reduced-motion → fade only
 * - desktop → fade + translateY/X
 */
export function useMotionConfig() {
  const shouldReduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const simple = shouldReduce || isMobile;

  function fadeUp(delay = 0) {
    return {
      initial: { opacity: 0, ...(simple ? {} : { y: 32 }) },
      whileInView: { opacity: 1, ...(simple ? {} : { y: 0 }) },
      viewport: { once: true as const },
      transition: { duration: simple ? 0.3 : 0.5, delay: simple ? 0 : delay },
    };
  }

  function fadeLeft(delay = 0) {
    return {
      initial: { opacity: 0, ...(simple ? {} : { x: -24 }) },
      whileInView: { opacity: 1, ...(simple ? {} : { x: 0 }) },
      viewport: { once: true as const },
      transition: { duration: simple ? 0.3 : 0.5, delay: simple ? 0 : delay },
    };
  }

  const staggerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: simple ? 0 : 0.1 } },
  };

  function cardVariants(withY = true) {
    return {
      hidden: { opacity: 0, ...(simple || !withY ? {} : { y: 32 }) },
      visible: { opacity: 1, ...(simple || !withY ? {} : { y: 0 }), transition: { duration: simple ? 0.3 : 0.5 } },
    };
  }

  return { fadeUp, fadeLeft, staggerVariants, cardVariants, simple };
}
