"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/siteConfig";

const MOBILE_PILLS = [
  { href: "/", label: "Kalkylator" },
  { href: "/tag-och-kollektivtrafik", label: "Tåg & Buss" },
  { href: "/flygersattning", label: "Flyg EU 261" },
  { href: "/bolag", label: "Bolag" },
  { href: "/reklamationsmall", label: "Kravbrev" },
  { href: "/guider", label: "Guider" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  const isRouteActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#CBD5E1] bg-[#F8FAFC] print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6 sm:py-2.5">
        <Link
          href="/"
          className="flex items-baseline gap-2 text-[#0F172A] transition-opacity hover:opacity-85"
        >
          <span className="font-serif text-lg font-bold tracking-tight text-[#0B1F3A] sm:text-xl">
            {SITE_CONFIG.name}
          </span>
          <span className="font-mono-num rounded-[2px] border border-[#CBD5E1] bg-white px-1.5 py-0.5 text-[11px] font-semibold text-[#0B1F3A]">
            {SITE_CONFIG.year}
          </span>
        </Link>

        <nav aria-label="Huvudmeny" className="hidden items-center gap-1 lg:flex">
          {SITE_CONFIG.navLinks.map((item) => {
            const active = isRouteActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded border px-2.5 py-1 text-[13px] font-semibold transition-colors ${
                  active
                    ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                    : "border-transparent text-slate-700 hover:border-[#CBD5E1] hover:bg-white hover:text-[#0B1F3A]"
                }`}
              >
                {item.shortLabel}
              </Link>
            );
          })}
        </nav>

        <div className="font-mono-num text-[11px] font-medium text-slate-500">
          <span className="lg:hidden">0 cookies &middot; Lokal</span>
          <span className="hidden lg:inline">Lokal beräkning &middot; 0 cookies</span>
        </div>
      </div>

      {/* Compact single-tap horizontal quick bar on mobile */}
      <nav
        aria-label="Snabbmeny mobil"
        className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-t border-[#E2E8F0] bg-white px-4 py-1.5 whitespace-nowrap lg:hidden"
      >
        {MOBILE_PILLS.map((item) => {
          const active = isRouteActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-[3px] border px-2.5 py-1 text-xs font-semibold transition-colors ${
                active
                  ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                  : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0B1F3A] active:bg-slate-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
