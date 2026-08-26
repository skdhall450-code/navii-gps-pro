"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import MobileNav from "./header/MobileNav";

const menu = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Software", href: "/software" },
  { name: "Industries", href: "/industries" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo/logo.png"
            alt="NAVII GPS"
            width={55}
            height={55}
            className="object-contain"
          />

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              NAVII GPS
            </h2>

            <p className="text-xs text-slate-500">INDIA (OPC) PVT LTD</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium transition ${
                pathname === item.href
                  ? "text-blue-700"
                  : "text-slate-700 hover:text-blue-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 sm:inline-flex"
          >
            Get Quote
          </Link>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
