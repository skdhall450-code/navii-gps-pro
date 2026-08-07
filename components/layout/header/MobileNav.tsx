"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const menu = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Software", href: "/software" },
  { name: "Industries", href: "/industries" },
  { name: "Contact", href: "/contact" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Menu Button */}

      <button
        onClick={() => setOpen(true)}
        className="rounded-xl p-2 lg:hidden"
      >
        <Menu size={28} />
      </button>

      {/* Drawer */}

      <AnimatePresence>

        {open && (

          <>
            {/* Overlay */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50"
            />

            {/* Sidebar */}

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-2xl"
            >
              {/* Header */}

              <div className="flex items-center justify-between border-b p-6">

                <h2 className="text-2xl font-bold text-cyan-700">
                  NAVII GPS
                </h2>

                <button onClick={() => setOpen(false)}>
                  <X size={28} />
                </button>

              </div>

              {/* Menu */}

              <nav className="flex-1 p-6">

                <div className="space-y-2">

                  {menu.map((item) => (

                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-4 py-3 font-semibold transition ${
                        pathname === item.href
                          ? "bg-cyan-100 text-cyan-700"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      {item.name}
                    </Link>

                  ))}

                </div>

              </nav>

              {/* Bottom */}

              <div className="border-t p-6">

                <a
                  href="https://wa.me/917717394007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-semibold text-white"
                >
                  <MessageCircle size={20} />

                  WhatsApp

                </a>

              </div>

            </motion.div>

          </>

        )}

      </AnimatePresence>

    </>
  );
}