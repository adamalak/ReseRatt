"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

interface StickyMobileResultBarProps {
  targetId: string;
  label: string;
  valueText: string;
  subText?: string;
  isPositive: boolean;
  ctaLabel?: string;
}

/**
 * Klistrad live-resultatslist längst ner på mobil medan inmatningsfälten visas
 * och resultatpanelen fortfarande ligger nedanför skärmbilden.
 */
export function StickyMobileResultBar({
  targetId,
  label,
  valueText,
  subText,
  isPositive,
  ctaLabel = "Visa krav & länk",
}: StickyMobileResultBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const target = document.getElementById(targetId);
      if (!target) {
        setVisible(false);
        return;
      }
      const rect = target.getBoundingClientRect();
      // Visa bara när resultatets topp ligger under viewportens nedre del
      setVisible(rect.top > window.innerHeight - 64);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [targetId]);

  if (!visible) return null;

  const scrollToResult = () => {
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-[#0B1F3A] bg-white px-4 py-2 lg:hidden print:hidden"
    >
      <div className="mx-auto flex h-10 max-w-6xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-slate-600">{label}</p>
          <p className="tabular-nums truncate text-sm font-bold text-[#0B1F3A]">
            <span className={isPositive ? "text-[#0B1F3A]" : "text-slate-700"}>{valueText}</span>
            {subText ? (
              <span className="ml-1.5 font-normal text-slate-600">({subText})</span>
            ) : null}
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToResult}
          className="inline-flex shrink-0 items-center gap-1 rounded-[4px] bg-[#0B1F3A] px-3 py-2 text-xs font-semibold text-white transition active:bg-[#163763]"
        >
          <span>{ctaLabel}</span>
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
