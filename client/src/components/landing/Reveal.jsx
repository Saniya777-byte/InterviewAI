"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({ children, className = "", delay = 0, as = "div" }) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 };
  const animate = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 };

  return (
    <Component
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}