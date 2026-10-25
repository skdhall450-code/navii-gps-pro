"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function DesktopNav() {
  const pathname = usePathname();

  const menu = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Products",
      href: "/products",
      mega: true,
    },
    { title: "Shop Now", href: "/shop-now" },
    {
      title: "Software",
      href: "/software",
    },
    {
      title: "Industries",
      href: "/industries",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ];

  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-4 xl:flex">

      {menu.map((item) => (

        <div
          key={item.href}
          className="group relative"
        >

          <Link
            prefetch={false}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-1 py-2 font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 ${
              item.href === "/shop-now"
                ? pathname === item.href ? "bg-blue-700 px-3 text-white" : "bg-blue-50 px-3 text-blue-700 hover:bg-blue-100"
                : pathname === item.href ? "text-cyan-600" : "text-slate-700 hover:text-cyan-600"
            }`}
          >

            {item.title}

            {item.mega && (
              <ChevronDown
                size={16}
                className="transition group-hover:rotate-180"
              />
            )}

          </Link>

          {/* Active Line */}

          <span
            className={`absolute -bottom-2 left-0 h-[2px] bg-cyan-500 transition-all duration-300 ${
              pathname === item.href
                ? "w-full"
                : "w-0 group-hover:w-full"
            }`}
          />

        </div>

      ))}

    </nav>
  );
}