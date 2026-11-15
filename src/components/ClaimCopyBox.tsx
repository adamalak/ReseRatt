"use client";

import { Check, Copy, FileText } from "lucide-react";
import { useState } from "react";

interface ClaimCopyBoxProps {
  title?: string;
  primaryText: string;
  secondaryEnglishText?: string;
  compact?: boolean;
}

export function ClaimCopyBox({
  title = "Färdig reklamationstext (att klistra in i formulär eller e-post)",
  primaryText,
  secondaryEnglishText,
  compact = false,
}: ClaimCopyBoxProps) {
  const [lang, setLang] = useState<"sv" | "en">("sv");
  const [copied, setCopied] = useState(false);

  const displayedText =
    lang === "en" && secondaryEnglishText ? secondaryEnglishText : primaryText;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  return (
    <div
      className={`rounded border border-[#CBD5E1] bg-[#F8FAFC] ${
        compact ? "p-3.5" : "p-4 sm:p-5"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B1F3A] uppercase">
          <FileText className="h-4 w-4 text-[#0B1F3A]" aria-hidden="true" />
          <span>{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {secondaryEnglishText && (
            <div className="inline-flex rounded-[3px] border border-[#CBD5E1] bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLang("sv")}
                className={`rounded-[2px] px-2 py-0.5 font-semibold ${
                  lang === "sv" ? "bg-[#0B1F3A] text-white" : "text-slate-600"
                }`}
              >
                Svenska
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-[2px] px-2 py-0.5 font-semibold ${
                  lang === "en" ? "bg-[#0B1F3A] text-white" : "text-slate-600"
                }`}
              >
                English
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#163763]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Kopierad!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Kopiera kravtext</span>
              </>
            )}
          </button>
        </div>
      </div>

      <pre
        className={`mt-3 overflow-auto whitespace-pre-wrap rounded-[3px] border border-[#CBD5E1] bg-white p-3 font-sans text-xs leading-relaxed text-[#0F172A] tabular-nums ${
          compact ? "max-h-56" : "max-h-72"
        }`}
      >
        {displayedText}
      </pre>
    </div>
  );
}
