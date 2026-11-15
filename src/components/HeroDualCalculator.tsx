"use client";

import { Plane, Train } from "lucide-react";
import { useEffect, useState } from "react";
import { FlightCalculator } from "@/components/calculators/FlightCalculator";
import { TransitCalculator } from "@/components/calculators/TransitCalculator";
import { FLIGHT_OPERATORS } from "@/lib/data/operators";

export function HeroDualCalculator() {
  const [mode, setMode] = useState<"transit" | "flight">("transit");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("mode");
    const airline = params.get("airline");
    if (
      urlMode === "flight" ||
      (airline && FLIGHT_OPERATORS.some((o) => o.slug === airline))
    ) {
      setMode("flight");
    }
  }, []);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Välj färdmedel"
        className="mb-3 inline-flex w-full rounded border border-[#CBD5E1] bg-white p-1 sm:w-auto print:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "transit"}
          onClick={() => setMode("transit")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[3px] px-3.5 py-2 text-xs font-semibold transition sm:flex-initial sm:text-sm ${
            mode === "transit"
              ? "bg-[#0B1F3A] text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Train className="h-4 w-4" aria-hidden="true" />
          <span>Tåg, pendeltåg &amp; buss</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "flight"}
          onClick={() => setMode("flight")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[3px] px-3.5 py-2 text-xs font-semibold transition sm:flex-initial sm:text-sm ${
            mode === "flight"
              ? "bg-[#0B1F3A] text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Plane className="h-4 w-4" aria-hidden="true" />
          <span>Flyg (EU 261/2004)</span>
        </button>
      </div>

      {mode === "transit" ? (
        <TransitCalculator initialOperatorSlug="sl" />
      ) : (
        <FlightCalculator initialAirlineSlug="sas" />
      )}
    </div>
  );
}
