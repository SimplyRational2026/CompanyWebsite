"use client";

import { motion } from "motion/react";
import { EASE } from "@/app/lib/anim";

export default function ScrollHintArrow({ visible }: { visible: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-[1vh] flex justify-center text-purple lg:bottom-[3vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <motion.svg
        className="h-[36px] w-[36px] lg:h-[72px] lg:w-[72px]"
        viewBox="0 0 24 24"
        fill="none"
        animate={visible ? { y: [0, 6, 0] } : { y: 0 }}
        transition={
          visible
            ? { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            : { duration: 0 }
        }
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
        />
      </motion.svg>
    </motion.div>
  );
}
