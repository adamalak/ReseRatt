"use client";

import { Check, Copy, FileText } from "lucide-react";
import { useState } from "react";

interface ClaimCopyBoxProps {
  title?: string;
  primaryText: string;
  secondaryEnglishText?: string;
}

export function ClaimCopyBox({
  title = "Färdig reklamationstext (att klistra in i formulär eller e-post)",
  primaryText,
  secondaryEnglishText,
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
      // Clipboard may be unavailable
    }
  };

  return (
    <div className="rounded-lg border border-[#DDD9CE] bg-[#FAF9F6] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-600 uppercase">
          <FileText className="h-4 w-4 text-[#143A66]" />
          <span>{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {secondaryEnglishText && (
            <div className="inline-flex rounded-md border border-stone-300 bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLang("sv")}
                className={`rounded px-2 py-0.5 font-medium ${
                  lang === "sv" ? "bg-[#143A66] text-white" : "text-stone-600"
                }`}
              >
                Svenska
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded px-2 py-0.5 font-medium ${
                  lang === "en" ? "bg-[#143A66] text-white" : "text-stone-600"
                }`}
              >
                English
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#143A66] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0E294A]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Kopierad!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Kopiera kravtext</span>
              </>
            )}
          </button>
        </div>
      </div>

      <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-stone-200 bg-white p-3.5 font-sans text-xs leading-relaxed text-zinc-800">
        {displayedText}
      </pre>
    </div>
  );
}
