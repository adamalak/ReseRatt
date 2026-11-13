import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import type { OperatorProfile } from "@/lib/data/operators";

interface OperatorFactsCardProps {
  operator: OperatorProfile;
}

export function OperatorFactsCard({ operator }: OperatorFactsCardProps) {
  return (
    <div className="mt-10 space-y-6">
      {/* Structured Spec Table */}
      <section className="rounded-lg border border-[#DDD9CE] bg-white p-6 sm:p-8">
        <h2 className="font-editorial text-xl font-semibold tracking-tight text-zinc-900">
          Sammanfattning av {operator.shortName}s ersättningsvillkor 2026
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">{operator.uniqueGuideNote}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-stone-200 bg-[#FAF9F6] p-4">
            <h3 className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
              Ersättningsnivåer ({operator.lawFramework})
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-800">
              {operator.compensationLadder.map((step) => (
                <li key={step.label} className="flex items-start justify-between gap-2">
                  <span>{step.label}</span>
                  <span className="font-mono-num shrink-0 font-bold text-[#143A66]">
                    {step.note ?? `${step.percent} %`}
                  </span>
                </li>
              ))}
            </ul>
            {operator.euRailLadder && (
              <div className="mt-3 border-t border-stone-200 pt-3">
                <p className="text-xs font-semibold text-stone-600">
                  Om tågets totalsträcka är ≥ 15 mil (150 km):
                </p>
                <ul className="mt-1.5 space-y-1 text-xs text-stone-700">
                  {operator.euRailLadder.map((step) => (
                    <li key={step.label} className="flex justify-between">
                      <span>{step.label}</span>
                      <span className="font-mono-num font-bold">{step.percent} %</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-md border border-stone-200 bg-[#FAF9F6] p-4 space-y-3 text-sm">
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
                Taxi, egen bil &amp; värdekod
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-700">
                <strong>Taxi / alternativ resa:</strong> {operator.taxiAndCar.taxiNote}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-stone-700">
                <strong>Egen bil / utlägg:</strong> {operator.taxiAndCar.carNote}
              </p>
            </div>
            <div className="border-t border-stone-200 pt-2.5">
              <p className="text-xs leading-relaxed text-stone-700">
                <strong>Periodkort:</strong> {operator.periodTicketRule.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-step claim + Pitfalls */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-[#DDD9CE] bg-white p-6">
          <h2 className="font-editorial text-lg font-semibold text-zinc-900">
            Så söker du ersättning hos {operator.shortName}
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-stone-700">
            {operator.claimInstructions.map((step, i) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="font-mono-num mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#143A66] text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-stone-500">
            <strong>Tidsfrist:</strong> {operator.deadlineText}
          </p>
          <a
            href={operator.claimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#143A66] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0E294A]"
          >
            <span>{operator.claimCtaLabel}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>

        <section className="rounded-lg border border-[#DDD9CE] bg-white p-6">
          <h2 className="font-editorial text-lg font-semibold text-zinc-900">
            Vanliga fällor &amp; nödvändiga bevis
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-stone-700">
            {operator.pitfalls.map((pitfall) => (
              <li key={pitfall} className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-stone-200 pt-3">
            <p className="text-xs font-semibold text-stone-500 uppercase">Bevischecklista</p>
            <ul className="mt-2 space-y-1.5 text-xs text-stone-700">
              {operator.evidenceChecklist.map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0B6B4F]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
