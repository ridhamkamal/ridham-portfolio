/**
 * Chart palette, validated with the dataviz six-checks script against the
 * dark chart surface #13131a (lightness band, chroma, CVD ΔE ≥ 8, normal-vision
 * floor, ≥ 3:1 contrast): ALL PASS. Fixed order, never cycled.
 * Text never wears series colors; it uses the ink tokens below.
 */
export const SERIES = ["#8a74f0", "#1a9cb0", "#b9811f"] as const;

export const INK = {
  primary: "#f4efe6",
  secondary: "#b4aea4",
  muted: "#8c877f",
  grid: "rgba(244,239,230,0.08)",
  axis: "rgba(244,239,230,0.18)",
  surface: "#13131a",
} as const;

export const axisProps = {
  tick: { fill: INK.muted, fontSize: 12, fontFamily: "var(--font-archivo)" },
  axisLine: { stroke: INK.axis },
  tickLine: false,
} as const;

/** Dash pattern reserved for MODELED series so projections never read as actuals. */
export const MODELED_DASH = "6 5";

export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n);
