"use client";

import { Check, Copy, Link2 } from "lucide-react";
import { useState } from "react";

interface ShareSummaryBarProps {
  summaryText: string;
  shareQueryString: string;
  sharePath?: string;
}

export function ShareSummaryBar({
  summaryText,
  shareQueryString,
  sharePath,
}: ShareSummaryBarProps) {
  const [copiedType, setCopiedType] = useState<"text" | "link" | null>(null);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedType("text");
      setTimeout(() => setCopiedType(null), 2200);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  const copyLink = async () => {
    try {
      const targetPath = sharePath ?? window.location.pathname;
      const url = `${window.location.origin}${targetPath}?${shareQueryString}`;
      await navigator.clipboard.writeText(url);
      setCopiedType("link");
      setTimeout(() => setCopiedType(null), 2200);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copyText}
        className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0B1F3A] transition hover:bg-slate-100"
      >
        {copiedType === "text" ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-800" aria-hidden="true" />
            <span className="text-emerald-800">Resultat kopierat</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>Kopiera sammanfattning</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0B1F3A] transition hover:bg-slate-100"
      >
        {copiedType === "link" ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-800" aria-hidden="true" />
            <span className="text-emerald-800">Delningslänk kopierad</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>Dela till medresenär</span>
          </>
        )}
      </button>
    </div>
  );
}
