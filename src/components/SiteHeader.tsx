import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { navigation } from "@/data/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition duration-300 ${
        scrolled || open
          ? "border-white/10 bg-ink/90 shadow-2xl shadow-black/10 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-shell flex h-20 items-center justify-between">
        <a href="#inicio" aria-label="Codewave, volver al inicio">
          <img
            src="/assets/logo-codewave-DdRc0x20.png"
            alt="Codewave"
            className="h-auto w-44"
          />
        </a>

        <nav aria-label="Navegación principal" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-white/70 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="rounded-full bg-leaf px-5 py-2.5 text-sm font-extrabold text-ink transition hover:-translate-y-0.5 hover:bg-white"
          >
            Hablemos
          </a>
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-white/15 text-white lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            aria-label="Navegación móvil"
            className="container-shell flex h-[calc(100dvh-5rem)] flex-col justify-center gap-2 pb-20 lg:hidden"
          >
            {navigation.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-4 font-display text-3xl font-semibold"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
