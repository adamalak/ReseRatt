"use client";

import { Plane, Train } from "lucide-react";
import { useState } from "react";
import { FlightCalculator } from "@/components/calculators/FlightCalculator";
import { TransitCalculator } from "@/components/calculators/TransitCalculator";

export function HeroDualCalculator() {
  const [mode, setMode] = useState<"transit" | "flight">("transit");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Välj färdmedel"
        className="mb-5 inline-flex w-full rounded-lg border border-[#DDD9CE] bg-white p-1 sm:w-auto"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "transit"}
          onClick={() => setMode("transit")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition sm:flex-initial ${
            mode === "transit"
              ? "bg-[#143A66] text-white"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Train className="h-4 w-4" />
          <span>Tåg, pendeltåg &amp; buss</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "flight"}
          onClick={() => setMode("flight")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition sm:flex-initial ${
            mode === "flight"
              ? "bg-[#143A66] text-white"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Plane className="h-4 w-4" />
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
