"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const menu = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Shop Now", href: "/shop-now" },
  { name: "Software", href: "/software" },
  { name: "Industries", href: "/industries" },
  { name: "Contact", href: "/contact" },
];

export default function MobileNav() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;

    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => drawerRef.current?.querySelector<HTMLButtonElement>('button')?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const focusable = drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (focusable?.length) {
          const first = focusable[0], last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();

      document.removeEventListener("keydown", handleKeyDown);

      window.scrollTo(0, window.scrollY);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
  };

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={closeMenu}
            className="fixed inset-0 z-[190] bg-black/50"
            aria-hidden="true"
          />

          <motion.aside
            ref={drawerRef}
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              duration: 0.3,
            }}
            className="fixed right-0 top-0 z-[200] flex h-dvh w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b bg-white p-6">
              <h2 className="text-2xl font-bold text-cyan-700">NAVII GPS</h2>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                className="rounded-lg p-2 transition hover:bg-slate-100"
              >
                <X size={27} />
              </button>
            </div>

            <nav aria-label="Mobile main navigation" className="flex-1 bg-white p-6">
              <div className="space-y-2">
                {menu.map((item) => (
                  <Link
                    prefetch={false}
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={closeMenu}
                    className={`block rounded-xl px-4 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      item.href === "/shop-now"
                        ? pathname === item.href ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : pathname === item.href ? "bg-cyan-100 text-cyan-700" : "text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="sticky bottom-0 mt-auto shrink-0 border-t bg-white p-6">
              <a
                href="https://wa.me/918899729705"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-500"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-navigation-drawer"
        className="rounded-xl p-2 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 xl:hidden"
      >
        <Menu size={28} />
      </button>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
