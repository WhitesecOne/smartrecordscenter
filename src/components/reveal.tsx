"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

/** One quiet entrance for content that arrives on scroll: a short rise, never hidden before JavaScript runs. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={cn("min-w-0", className)}
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
