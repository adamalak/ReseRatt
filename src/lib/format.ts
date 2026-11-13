/**
 * Formateringshjälp för svenska kr, EUR, procent och förseningsminuter.
 */

export function formatSEK(amount: number, decimals = 0): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return (
    new Intl.NumberFormat("sv-SE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(safe) + " kr"
  );
}

export function formatEUR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return (
    new Intl.NumberFormat("sv-SE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safe) + " EUR"
  );
}

export function formatPercent(value: number, decimals = 0): string {
  const safe = Number.isFinite(value) ? value : 0;
  return (
    new Intl.NumberFormat("sv-SE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(safe) + " %"
  );
}

export function formatDelayDuration(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  if (safe < 60) return `${safe} min`;
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return m === 0 ? `${h} tim` : `${h} tim ${m} min`;
}
