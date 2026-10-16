import Image from "next/image";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/asset";

/**
 * Artifact preview per project. WonderWord shows the real product; concepts
 * show a diagram of the mechanism the prototype demonstrates. Pure SVG, so
 * it is crisp, light and readable without JS. Hover animation is CSS-only
 * (group-hover) and disabled globally when motion is off.
 */
export function ProjectVisual({
  slug,
  className,
  priority,
}: {
  slug: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg)]",
        className,
      )}
    >
      {slug === "wonderword-ai" && (
        <Image
          src={asset("/images/wonderword-child-home.jpg")}
          alt="WonderWord AI child home screen with the Snap homework action in the centre"
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          priority={priority}
        />
      )}
      {slug === "interviewer-prep-coach" && <LoopDiagram />}
      {slug === "instant-order-resolution" && <ResolutionDiagram />}
      {slug === "alert-triage-copilot" && <LadderDiagram />}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(11,11,15,0.55)] to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

const svgCls = "absolute inset-0 h-full w-full";
const label = { fontFamily: "var(--font-archivo)", fontSize: 13, fill: "#f4efe6" } as const;

function LoopDiagram() {
  const nodes = [
    { x: 110, y: 160, t: "Prepare" },
    { x: 320, y: 70, t: "Align" },
    { x: 530, y: 160, t: "Close the loop" },
  ];
  return (
    <svg
      viewBox="0 0 640 400"
      className={svgCls}
      role="img"
      aria-label="Diagram: Prepare, Align and Close-the-loop stages connected in a cycle, with a guardrail: no candidate scoring"
    >
      <rect width="640" height="400" fill="#101018" />
      <path
        d="M150 140 Q 230 60 280 70 M360 70 Q 450 70 500 140 M500 190 Q 320 330 150 190"
        fill="none"
        stroke="#a594ff"
        strokeWidth="2"
        strokeDasharray="6 6"
        className="[animation:dash_3s_linear_infinite] group-hover:[animation-duration:1s]"
      />
      {nodes.map((n) => (
        <g key={n.t} transform={`translate(${n.x} ${n.y})`}>
          <circle r="34" fill="#1b1b25" stroke="#a594ff" strokeWidth="2" />
          <circle r="8" fill="#a594ff" />
          <text y="58" textAnchor="middle" {...label}>
            {n.t}
          </text>
        </g>
      ))}
      <g transform="translate(220 300)">
        <rect width="200" height="40" rx="20" fill="none" stroke="#ff8f8f" strokeOpacity="0.6" />
        <text x="100" y="25" textAnchor="middle" {...label} fill="#ff8f8f">
          No scoring · no hire calls
        </text>
      </g>
      <style>{`@keyframes dash{to{stroke-dashoffset:-48}}`}</style>
    </svg>
  );
}

function ResolutionDiagram() {
  const steps = ["Order fails", "Pre-authorization", "Abuse guardrails", "Cost attribution"];
  return (
    <svg
      viewBox="0 0 640 400"
      className={svgCls}
      role="img"
      aria-label="Diagram: a failed order moves through pre-authorization, abuse guardrails and cost attribution"
    >
      <rect width="640" height="400" fill="#101018" />
      <line
        x1="80"
        y1="200"
        x2="560"
        y2="200"
        stroke="#f4efe6"
        strokeOpacity="0.15"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="80"
        y1="200"
        x2="560"
        y2="200"
        stroke="#67e0f0"
        strokeWidth="6"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="0.62"
        className="transition-[stroke-dashoffset] duration-1000 ease-[var(--ease-out-expo)] group-hover:[stroke-dashoffset:0]"
      />
      {steps.map((s, i) => (
        <g key={s} transform={`translate(${80 + i * 160} 200)`}>
          <circle
            r="16"
            fill={i === 0 ? "#ff8f8f" : i === 3 ? "#7ee2a8" : "#1b1b25"}
            stroke="#67e0f0"
            strokeWidth="2"
          />
          <text y={i % 2 ? -32 : 44} textAnchor="middle" {...label}>
            {s}
          </text>
        </g>
      ))}
      <text x="320" y="320" textAnchor="middle" {...label} fill="#b4aea4">
        Order accuracy 88% vs 98% (research)
      </text>
    </svg>
  );
}

function LadderDiagram() {
  const rungs = [1, 2, 3, 4];
  return (
    <svg
      viewBox="0 0 640 400"
      className={svgCls}
      role="img"
      aria-label="Diagram: an automation ladder with promotion and demotion thresholds and a hard-stop guardrail"
    >
      <rect width="640" height="400" fill="#101018" />
      {rungs.map((r, i) => (
        <g
          key={r}
          transform={`translate(170 ${300 - i * 66})`}
          className="transition-transform duration-500 group-hover:translate-x-[6px]"
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <rect
            width="300"
            height="46"
            rx="10"
            fill="#1b1b25"
            stroke={i < 2 ? "#67e0f0" : "#f4efe6"}
            strokeOpacity={i < 2 ? 0.8 : 0.2}
          />
          <rect
            x="18"
            y="18"
            width={200 - i * 30}
            height="10"
            rx="5"
            fill={i < 2 ? "#67e0f0" : "#f4efe6"}
            opacity={i < 2 ? 0.7 : 0.15}
          />
        </g>
      ))}
      <path d="M500 300 V 120" stroke="#7ee2a8" strokeWidth="2" markerEnd="url(#up)" />
      <path d="M540 120 V 300" stroke="#f2c46d" strokeWidth="2" markerEnd="url(#down)" />
      <text x="470" y="350" {...label} fontSize={11} fill="#7ee2a8">
        promotion threshold
      </text>
      <text x="470" y="100" {...label} fontSize={11} fill="#f2c46d">
        demotion threshold
      </text>
      <rect x="30" y="40" width="130" height="30" rx="15" fill="none" stroke="#ff8f8f" />
      <text x="95" y="60" textAnchor="middle" {...label} fontSize={12} fill="#ff8f8f">
        hard-stop guardrail
      </text>
      <defs>
        <marker
          id="up"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill="#7ee2a8" />
        </marker>
        <marker
          id="down"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill="#f2c46d" />
        </marker>
      </defs>
    </svg>
  );
}
