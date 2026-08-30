"use client";

import Link from "next/link";
import Image from "next/image";

import TopBar from "./header/TopBar";
import DesktopNav from "./header/DesktopNav";
import HeaderActions from "./header/HeaderActions";
import MobileNav from "./header/MobileNav";

export default function HeaderV2() {
  return (
    <>
      <TopBar />

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-2"
          >

            <Image
              src="/assets/logo/logo.png"
              alt="NAVII GPS"
              width={84}
              height={84}
              className="-my-2 -ml-3 h-[76px] w-[76px] object-contain sm:h-[84px] sm:w-[84px]"
              priority
            />

            <div>

              <h2 className="text-2xl font-extrabold text-slate-900">
                NAVII GPS
              </h2>

              <p className="text-xs text-slate-500">
                INDIA (OPC) PVT LTD
              </p>

            </div>

          </Link>

          {/* Desktop Navigation */}

          <DesktopNav />

          {/* Desktop Buttons */}

          <HeaderActions />

          {/* Mobile Menu */}

          <MobileNav />

        </div>

      </header>
    </>
  );
}
