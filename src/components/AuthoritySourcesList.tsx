import { ExternalLink } from "lucide-react";
import type { AuthoritySource } from "@/lib/data/sources";

interface AuthoritySourcesListProps {
  title: string;
  intro?: string;
  sources: readonly AuthoritySource[];
}

/**
 * Renderar vanliga, följbara käll-länkar till verifierade myndigheter, lagtexter och rättspraxis.
 */
export function AuthoritySourcesList({ title, intro, sources }: AuthoritySourcesListProps) {
  if (sources.length === 0) return null;

  return (
    <section className="rounded border border-[#CBD5E1] bg-[#F8FAFC] p-5">
      <h2 className="font-editorial text-lg font-semibold text-[#0B1F3A]">{title}</h2>
      {intro && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{intro}</p>}
      <ul className="mt-4 space-y-3">
        {sources.map((source) => (
          <li key={source.id} className="text-sm leading-relaxed">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 font-semibold text-[#0B1F3A] underline hover:text-[#163763]"
            >
              <span>{source.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 translate-y-0.5" aria-hidden="true" />
            </a>
            <span className="ml-2 text-xs font-medium text-slate-500">({source.publisher})</span>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{source.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
