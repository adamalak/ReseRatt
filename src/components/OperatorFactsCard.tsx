import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import type { OperatorProfile } from "@/lib/data/operators";

interface OperatorFactsCardProps {
  operator: OperatorProfile;
}

export function OperatorFactsCard({ operator }: OperatorFactsCardProps) {
  return (
    <div className="mt-8 space-y-6 print:hidden">
      {/* Structured Spec Table */}
      <section className="rounded border border-[#CBD5E1] bg-white p-5 sm:p-8">
        <h2 className="font-editorial text-xl font-semibold tracking-tight text-[#0B1F3A]">
          Sammanfattning av {operator.shortName}s ersättningsvillkor 2026
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{operator.uniqueGuideNote}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded border border-[#CBD5E1] bg-[#F8FAFC] p-4">
            <h3 className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              Ersättningsnivåer ({operator.lawFramework})
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#0F172A]">
              {operator.compensationLadder.map((step) => (
                <li key={step.label} className="flex items-start justify-between gap-2">
                  <span>{step.label}</span>
                  <span className="font-mono-num shrink-0 font-bold text-[#0B1F3A]">
                    {step.note ?? `${step.percent} %`}
                  </span>
                </li>
              ))}
            </ul>
            {operator.euRailLadder && (
              <div className="mt-3 border-t border-[#E2E8F0] pt-3">
                <p className="text-xs font-semibold text-slate-700">
                  Om tågets totalsträcka är &ge; 15 mil (150 km):
                </p>
                <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
                  {operator.euRailLadder.map((step) => (
                    <li key={step.label} className="flex justify-between">
                      <span>{step.label}</span>
                      <span className="font-mono-num font-bold text-[#0B1F3A]">{step.percent} %</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-3 rounded border border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm">
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                Taxi, egen bil &amp; värdekod
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                <strong>Taxi / alternativ resa:</strong> {operator.taxiAndCar.taxiNote}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                <strong>Egen bil / utlägg:</strong> {operator.taxiAndCar.carNote}
              </p>
            </div>
            <div className="border-t border-[#E2E8F0] pt-2.5">
              <p className="text-xs leading-relaxed text-slate-700">
                <strong>Periodkort:</strong> {operator.periodTicketRule.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-step claim + Pitfalls */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded border border-[#CBD5E1] bg-white p-5 sm:p-6">
          <h2 className="font-editorial text-lg font-semibold text-[#0B1F3A]">
            Så söker du ersättning hos {operator.shortName}
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            {operator.claimInstructions.map((step, i) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="font-mono-num mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] bg-[#0B1F3A] text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="tabular-nums mt-4 text-xs text-slate-600">
            <strong>Tidsfrist:</strong> {operator.deadlineText}
          </p>
          <a
            href={operator.claimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-[4px] bg-[#0B1F3A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#163763]"
          >
            <span>{operator.claimCtaLabel}</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </section>

        <section className="rounded border border-[#CBD5E1] bg-white p-5 sm:p-6">
          <h2 className="font-editorial text-lg font-semibold text-[#0B1F3A]">
            Vanliga fällor &amp; nödvändiga bevis
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700">
            {operator.pitfalls.map((pitfall) => (
              <li key={pitfall} className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" aria-hidden="true" />
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-[#E2E8F0] pt-3">
            <p className="text-xs font-semibold text-slate-600 uppercase">Bevischecklista</p>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
              {operator.evidenceChecklist.map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-800" aria-hidden="true" />
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
