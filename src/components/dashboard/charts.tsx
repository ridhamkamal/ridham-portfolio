"use client";

/**
 * Recharts charts. This module is only ever loaded through next/dynamic
 * (see LazyCharts.tsx), so Recharts ships in its own chunk.
 */
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { INK, MODELED_DASH, SERIES, axisProps, compact, usd } from "./theme";

export interface ChartAnim {
  animate: boolean;
  duration: number;
}

interface TipProps {
  active?: boolean;
  payload?: readonly { dataKey?: unknown; name?: unknown; value?: unknown; color?: string }[];
  label?: unknown;
  format?: (v: number, name: string) => string;
}

function TooltipBox({ active, payload, label, format }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-[var(--color-line-strong)] bg-[var(--color-surface)] px-3 py-2 font-[family-name:var(--font-display)] text-[0.82rem] shadow-[var(--shadow-2)]">
      {label !== undefined && <p className="mb-1 text-[var(--color-muted)]">{String(label)}</p>}
      {payload.map((p) => (
        <p key={String(p.dataKey)} className="flex items-center gap-2 text-[var(--color-text)]">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
          <span className="text-[var(--color-muted)]">{String(p.name)}</span>
          <span className="ml-auto pl-3 font-semibold tabular-nums">
            {format ? format(Number(p.value), String(p.name)) : String(p.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

const legendStyle = { fontFamily: "var(--font-archivo)", fontSize: 12, color: INK.secondary, paddingTop: 8 };
const cursor = { stroke: INK.axis, strokeWidth: 1 };

export interface ProjectionPoint {
  month: string;
  mrr: number;
  freeUsers: number;
  payingUsers: number;
  grossMarginPct: number;
}

/** Modeled MRR: single dashed series, area for magnitude. */
export function MrrChart({
  data,
  animate,
  duration,
  height = 280,
}: { data: ProjectionPoint[]; height?: number } & ChartAnim) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="mrr-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={SERIES[0]} stopOpacity={0.35} />
            <stop offset="1" stopColor={SERIES[0]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={INK.grid} vertical={false} />
        <XAxis dataKey="month" {...axisProps} tickFormatter={(v: string) => v.replace(" 20", " ’")} />
        <YAxis {...axisProps} width={54} tickFormatter={(v: number) => `$${compact(v)}`} />
        <Tooltip
          cursor={cursor}
          content={(p) => (
            <TooltipBox active={p.active} payload={p.payload} label={p.label} format={(v) => usd(v)} />
          )}
        />
        <Area
          type="monotone"
          dataKey="mrr"
          name="Modeled MRR"
          stroke={SERIES[0]}
          strokeWidth={2}
          strokeDasharray={MODELED_DASH}
          fill="url(#mrr-fill)"
          dot={{ r: 4, fill: INK.surface, stroke: SERIES[0], strokeWidth: 2 }}
          activeDot={{ r: 6, stroke: INK.surface, strokeWidth: 2 }}
          isAnimationActive={animate}
          animationDuration={duration}
        >
          <LabelList
            dataKey="mrr"
            position="top"
            content={(props) => {
              const { x, y, index } = props as { x: number; y: number; index: number };
              if (index !== data.length - 1) return null;
              return (
                <text
                  x={x}
                  y={Number(y) - 12}
                  textAnchor="end"
                  fill={INK.primary}
                  fontSize={12}
                  fontFamily="var(--font-archivo)"
                >
                  ≈ $4.8K target
                </text>
              );
            }}
          />
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Modeled free vs paying users: stacked bars, 2px surface gap. */
export function UsersChart({
  data,
  animate,
  duration,
  height = 280,
}: { data: ProjectionPoint[]; height?: number } & ChartAnim) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }} barCategoryGap="28%">
        <CartesianGrid stroke={INK.grid} vertical={false} />
        <XAxis dataKey="month" {...axisProps} tickFormatter={(v: string) => v.replace(" 20", " ’")} />
        <YAxis {...axisProps} width={44} tickFormatter={compact} />
        <Tooltip
          cursor={{ fill: "rgba(244,239,230,0.04)" }}
          content={(p) => (
            <TooltipBox
              active={p.active}
              payload={p.payload}
              label={p.label}
              format={(v) => v.toLocaleString("en-US")}
            />
          )}
        />
        <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
        <Bar
          dataKey="payingUsers"
          name="Paying (modeled)"
          stackId="u"
          fill={SERIES[1]}
          stroke={INK.surface}
          strokeWidth={2}
          isAnimationActive={animate}
          animationDuration={duration}
        />
        <Bar
          dataKey="freeUsers"
          name="Free (modeled)"
          stackId="u"
          fill={SERIES[0]}
          fillOpacity={0.55}
          stroke={INK.surface}
          strokeWidth={2}
          radius={[4, 4, 0, 0]}
          isAnimationActive={animate}
          animationDuration={duration}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Modeled gross margin against the documented 47–61% band. */
export function MarginChart({
  data,
  animate,
  duration,
  band,
  height = 260,
}: { data: ProjectionPoint[]; band: { low: number; high: number }; height?: number } & ChartAnim) {
  const rows = data.filter((d) => d.mrr > 0);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={rows} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={INK.grid} vertical={false} />
        <ReferenceArea y1={band.low} y2={band.high} fill={SERIES[1]} fillOpacity={0.1} stroke="none">
          <Label
            value={`${band.low}–${band.high}% validated band`}
            position="insideTopLeft"
            fill={INK.secondary}
            fontSize={12}
            fontFamily="var(--font-archivo)"
          />
        </ReferenceArea>
        <XAxis dataKey="month" {...axisProps} tickFormatter={(v: string) => v.replace(" 20", " ’")} />
        <YAxis {...axisProps} width={44} domain={[0, 80]} tickFormatter={(v: number) => `${v}%`} />
        <Tooltip cursor={cursor} content={(p) => <TooltipBox {...p} format={(v) => `${v}%`} />} />
        <Line
          type="monotone"
          dataKey="grossMarginPct"
          name="Modeled gross margin"
          stroke={SERIES[0]}
          strokeWidth={2}
          strokeDasharray={MODELED_DASH}
          dot={{ r: 4, fill: INK.surface, stroke: SERIES[0], strokeWidth: 2 }}
          isAnimationActive={animate}
          animationDuration={duration}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Projected user mix across the three tiers (part-to-whole, 3 slices). */
export function MixDonut({
  data,
  animate,
  duration,
  height = 240,
}: { data: { name: string; value: number }[]; height?: number } & ChartAnim) {
  const paid = data.filter((d) => d.name !== "Free").reduce((s, d) => s + d.value, 0);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip content={(p) => <TooltipBox {...p} format={(v) => `${v}%`} />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="62%"
          outerRadius="88%"
          paddingAngle={2}
          stroke={INK.surface}
          strokeWidth={2}
          isAnimationActive={animate}
          animationDuration={duration}
          startAngle={90}
          endAngle={-270}
        >
          {data.map((d, i) => (
            <Cell key={d.name} fill={SERIES[i % SERIES.length]} fillOpacity={d.name === "Free" ? 0.45 : 1} />
          ))}
          <Label
            position="center"
            content={({ viewBox }) => {
              const vb = viewBox as { cx: number; cy: number };
              return (
                <g>
                  <text
                    x={vb.cx}
                    y={vb.cy - 4}
                    textAnchor="middle"
                    fill={INK.primary}
                    fontSize={28}
                    fontWeight={700}
                    fontFamily="var(--font-archivo)"
                  >
                    {paid}%
                  </text>
                  <text
                    x={vb.cx}
                    y={vb.cy + 18}
                    textAnchor="middle"
                    fill={INK.secondary}
                    fontSize={12}
                    fontFamily="var(--font-archivo)"
                  >
                    paid (projected)
                  </text>
                </g>
              );
            }}
          />
        </Pie>
        <Legend
          wrapperStyle={legendStyle}
          iconType="circle"
          iconSize={8}
          formatter={(v: string, e) =>
            `${v} · ${(e.payload as { value?: number } | undefined)?.value ?? ""}%`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Horizontal bars, one series. Used for tier price vs tutoring and metrics by org. */
export function HBarChart({
  data,
  animate,
  duration,
  format,
  height,
  highlightLast,
}: {
  data: { name: string; value: number; group?: string }[];
  format: (v: number) => string;
  height?: number;
  highlightLast?: boolean;
} & ChartAnim) {
  const h = height ?? Math.max(160, data.length * 46 + 30);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 64, bottom: 4, left: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid stroke={INK.grid} horizontal={false} />
        <XAxis type="number" {...axisProps} tickFormatter={(v: number) => format(v)} />
        <YAxis type="category" dataKey="name" {...axisProps} width={150} interval={0} />
        <Tooltip
          cursor={{ fill: "rgba(244,239,230,0.04)" }}
          content={(p) => (
            <TooltipBox active={p.active} payload={p.payload} label={p.label} format={(v) => format(v)} />
          )}
        />
        <Bar
          dataKey="value"
          name="Value"
          radius={[0, 4, 4, 0]}
          isAnimationActive={animate}
          animationDuration={duration}
        >
          {data.map((d, i) => (
            <Cell
              key={d.name}
              fill={
                highlightLast && i !== data.length - 1 ? SERIES[0] : highlightLast ? SERIES[2] : SERIES[0]
              }
            />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => format(Number(v))}
            fill={INK.primary}
            fontSize={12}
            fontFamily="var(--font-archivo)"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Pricing simulator: monthly revenue vs cost to serve for the current inputs. */
export function SimulatorBars({
  revenue,
  cost,
  animate,
  duration,
}: { revenue: number; cost: number } & ChartAnim) {
  const data = [
    { name: "Monthly revenue", value: Math.round(revenue) },
    { name: "Cost to serve", value: Math.round(cost) },
  ];
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 72, bottom: 0, left: 0 }}
        barCategoryGap="26%"
      >
        <XAxis type="number" hide domain={[0, (max: number) => Math.max(max, 1)]} />
        <YAxis type="category" dataKey="name" {...axisProps} width={120} />
        <Tooltip
          cursor={{ fill: "rgba(244,239,230,0.04)" }}
          content={(p) => <TooltipBox active={p.active} payload={p.payload} label={p.label} format={usd} />}
        />
        <Bar
          dataKey="value"
          name="Modeled"
          radius={[0, 4, 4, 0]}
          isAnimationActive={animate}
          animationDuration={Math.min(duration, 500)}
        >
          <Cell fill={SERIES[1]} />
          <Cell fill={SERIES[2]} />
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => usd(Number(v))}
            fill={INK.primary}
            fontSize={12}
            fontFamily="var(--font-archivo)"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Single-series sparkline for previews. */
export function Sparkline({
  data,
  dataKey,
  animate,
  duration,
  height = 90,
}: { data: Record<string, number | string>[]; dataKey: string; height?: number } & ChartAnim) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={SERIES[0]} stopOpacity={0.35} />
            <stop offset="1" stopColor={SERIES[0]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={SERIES[0]}
          strokeWidth={2}
          strokeDasharray={MODELED_DASH}
          fill="url(#spark-fill)"
          isAnimationActive={animate}
          animationDuration={duration}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
