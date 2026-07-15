"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE } from "@/app/lib/anim";
import ContactForm from "@/app/components/ui/ContactForm";
import { useContent } from "@/app/lib/i18n";
import {
  sectionAvailableWidth,
  useSectionContentScale,
} from "@/app/lib/sectionTypography";

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const content = useContent();
  const isAnimPlayingRef = useRef(false);
  const { viewportW } = useSectionContentScale(isAnimPlayingRef);
  const isMobile = viewportW < 1024;
  const footerContentW = sectionAvailableWidth(viewportW);
  const modalWidth = isMobile
    ? Math.min(720, Math.floor(viewportW * 0.92))
    : Math.min(720, Math.max(footerContentW, 560));

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-[4vw] py-8 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <button
            type="button"
            aria-label={content.contactModal.close}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-[1] w-full min-w-0"
            style={{ maxWidth: modalWidth }}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <button
              type="button"
              aria-label={content.contactModal.close}
              onClick={onClose}
              className="absolute -top-3 -right-3 z-10 flex size-9 items-center justify-center rounded-full bg-cream text-ink shadow-lg transition hover:bg-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="max-h-[88vh] overflow-y-auto">
              <ContactForm formId="contact-modal-form" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
