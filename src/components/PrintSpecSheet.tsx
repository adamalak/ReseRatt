import { PRISBASBELOPP_2026, RULES_YEAR } from "@/lib/data/constants";
import { formatSEK } from "@/lib/format";
import { SITE_CONFIG } from "@/lib/siteConfig";

export interface PrintSpecRow {
  label: string;
  value: string;
}

interface PrintSpecSheetProps {
  title: string;
  operatorName: string;
  amountHeadline: string;
  legalBasis: string;
  deadline: string;
  rows: PrintSpecRow[];
  warnings: string[];
  evidenceChecklist: string[];
  claimUrl: string;
  claimText: string;
  secondaryEnglishText?: string;
}

/**
 * Skräddarsydd A4-specifikation som enbart visas vid utskrift / "Spara som PDF".
 */
export function PrintSpecSheet({
  title,
  operatorName,
  amountHeadline,
  legalBasis,
  deadline,
  rows,
  warnings,
  evidenceChecklist,
  claimUrl,
  claimText,
  secondaryEnglishText,
}: PrintSpecSheetProps) {
  return (
    <section className="hidden text-[#0B1F3A] print:block">
      <div className="border-b-2 border-[#0B1F3A] pb-3">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-serif text-lg font-bold tracking-tight">
            {SITE_CONFIG.domainLabel} &mdash; Beräkningsunderlag &amp; ersättningskrav
          </p>
          <p className="font-mono-num text-[9pt] text-slate-600">
            Regelår {RULES_YEAR} &middot; PBB {formatSEK(PRISBASBELOPP_2026)}
          </p>
        </div>
        <h2 className="mt-1 text-base font-bold text-[#0B1F3A]">{title}</h2>
      </div>

      <div className="mt-4 grid grid-cols-3 border border-[#CBD5E1]">
        <div className="border-r border-[#CBD5E1] p-3">
          <p className="text-[8pt] font-semibold tracking-wider text-slate-500 uppercase">Bolag</p>
          <p className="mt-0.5 text-sm font-bold">{operatorName}</p>
        </div>
        <div className="border-r border-[#CBD5E1] p-3">
          <p className="text-[8pt] font-semibold tracking-wider text-slate-500 uppercase">
            Beräknad ersättning
          </p>
          <p className="font-mono-num mt-0.5 text-sm font-bold">{amountHeadline}</p>
        </div>
        <div className="p-3">
          <p className="text-[8pt] font-semibold tracking-wider text-slate-500 uppercase">
            Ansökningsfrist
          </p>
          <p className="mt-0.5 text-sm font-semibold">{deadline}</p>
        </div>
      </div>

      <table className="mt-4 w-full border-collapse border border-[#CBD5E1] text-[9.5pt]">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[#CBD5E1]">
              <th className="w-44 bg-[#F8FAFC] px-3 py-1.5 text-left font-semibold text-slate-700">
                {row.label}
              </th>
              <td className="tabular-nums px-3 py-1.5 text-[#0F172A]">{row.value}</td>
            </tr>
          ))}
          <tr className="border-b border-[#CBD5E1]">
            <th className="w-44 bg-[#F8FAFC] px-3 py-1.5 text-left font-semibold text-slate-700">
              Lagstöd
            </th>
            <td className="px-3 py-1.5 text-[#0F172A]">{legalBasis}</td>
          </tr>
          <tr>
            <th className="w-44 bg-[#F8FAFC] px-3 py-1.5 text-left font-semibold text-slate-700">
              Bolagets formulär
            </th>
            <td className="px-3 py-1.5 break-all text-[#0B1F3A]">{claimUrl}</td>
          </tr>
        </tbody>
      </table>

      {warnings.length > 0 && (
        <div className="mt-4 border border-[#D97706] border-l-4 bg-[#FFFBEB] p-3 text-[9pt]">
          <p className="font-bold text-[#92400E]">Viktiga villkor &amp; kvittokrav</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-[#78350F]">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {evidenceChecklist.length > 0 && (
        <div className="mt-4 border border-[#CBD5E1] p-3 text-[9pt]">
          <p className="font-bold text-[#0B1F3A]">Underlag att bifoga ansökan</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-800">
            {evidenceChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border border-[#CBD5E1] p-3">
        <p className="text-[9pt] font-bold tracking-wider text-slate-600 uppercase">
          Färdig reklamationstext (att klistra in eller bifoga)
        </p>
        <pre className="mt-2 whitespace-pre-wrap font-sans text-[9.5pt] leading-relaxed text-[#0F172A]">
          {claimText}
        </pre>
      </div>

      {secondaryEnglishText && (
        <div className="mt-3 break-inside-avoid border border-[#CBD5E1] p-3">
          <p className="text-[9pt] font-bold tracking-wider text-slate-600 uppercase">
            English EU 261/2004 Claim Text
          </p>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-[9pt] leading-relaxed text-[#0F172A]">
            {secondaryEnglishText}
          </pre>
        </div>
      )}

      <p className="mt-4 border-t border-[#CBD5E1] pt-2 text-[8pt] text-slate-500">
        {SITE_CONFIG.publisherName} &middot; {SITE_CONFIG.url} &middot; {SITE_CONFIG.contactEmail}
        {" · "}Vägledande konsumentunderlag baserat på lag och bolagets villkor {RULES_YEAR}.
      </p>
    </section>
  );
}
