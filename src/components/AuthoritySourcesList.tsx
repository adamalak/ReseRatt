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
    <section className="rounded-md border border-stone-200 bg-[#FAF9F6] p-5">
      <h2 className="font-editorial text-lg font-semibold text-zinc-900">{title}</h2>
      {intro && <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{intro}</p>}
      <ul className="mt-4 space-y-3">
        {sources.map((source) => (
          <li key={source.id} className="text-sm leading-relaxed">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 font-semibold text-[#143A66] underline hover:text-[#0E294A]"
            >
              <span>{source.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 translate-y-0.5" aria-hidden="true" />
            </a>
            <span className="ml-2 text-xs font-medium text-stone-500">({source.publisher})</span>
            <p className="mt-0.5 text-xs leading-relaxed text-stone-600">{source.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
