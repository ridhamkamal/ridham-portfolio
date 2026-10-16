/**
 * Static SVG/CSS version of the hero composition: product core, three
 * interface panels (enterprise, consumer, responsible) and a particle field.
 * Used without WebGL or after a context loss. Server-renderable.
 */
export function HeroFallback() {
  const dots = Array.from({ length: 60 }, (_, i) => ({
    x: (i * 137.5) % 1000,
    y: ((i * 89.3) % 600) + 20,
    r: (i % 3) * 0.6 + 0.8,
  }));
  return (
    <svg
      viewBox="0 0 1000 640"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hf-core" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#c9bfff" />
          <stop offset="0.45" stopColor="#6d5ae6" />
          <stop offset="1" stopColor="#1b1340" />
        </radialGradient>
        <radialGradient id="hf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#6d5ae6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#6d5ae6" stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#cfc8ff" opacity="0.45" />
      ))}
      <circle cx="500" cy="300" r="260" fill="url(#hf-glow)" />
      <ellipse
        cx="500"
        cy="300"
        rx="190"
        ry="60"
        fill="none"
        stroke="#a594ff"
        strokeOpacity="0.7"
        transform="rotate(-18 500 300)"
      />
      <circle cx="500" cy="300" r="118" fill="url(#hf-core)" />
      <circle
        cx="500"
        cy="300"
        r="152"
        fill="none"
        stroke="#67e0f0"
        strokeOpacity="0.25"
        strokeDasharray="4 8"
      />
      {/* Enterprise panel */}
      <g transform="translate(150 150) rotate(-6)">
        <rect width="200" height="130" rx="12" fill="#1b1b25" stroke="#67e0f0" strokeOpacity="0.55" />
        <rect x="20" y="20" width="70" height="7" rx="3" fill="#f4efe6" opacity="0.2" />
        {[30, 52, 40, 72, 60].map((h, i) => (
          <rect key={i} x={24 + i * 34} y={110 - h} width="18" height={h} rx="3" fill="#67e0f0" />
        ))}
      </g>
      {/* Consumer panel */}
      <g transform="translate(660 130) rotate(6)">
        <rect width="200" height="130" rx="12" fill="#1b1b25" stroke="#f2c46d" strokeOpacity="0.55" />
        <circle cx="168" cy="32" r="14" fill="#f2c46d" />
        <rect x="20" y="58" width="150" height="8" rx="4" fill="#f4efe6" opacity="0.2" />
        <rect x="20" y="80" width="130" height="8" rx="4" fill="#f4efe6" opacity="0.2" />
        <rect x="20" y="102" width="110" height="8" rx="4" fill="#f4efe6" opacity="0.2" />
        <rect x="34" y="76" width="34" height="16" rx="4" fill="#f2c46d" />
      </g>
      {/* Responsible panel */}
      <g transform="translate(410 470)">
        <rect width="200" height="120" rx="12" fill="#1b1b25" stroke="#a594ff" strokeOpacity="0.55" />
        {[28, 60, 92].map((y, i) => (
          <g key={y}>
            <circle cx="30" cy={y} r="8" fill={i < 2 ? "#a594ff" : "#f4efe6"} opacity={i < 2 ? 1 : 0.2} />
            <rect x="50" y={y - 4} width="120" height="8" rx="4" fill="#f4efe6" opacity="0.2" />
          </g>
        ))}
      </g>
    </svg>
  );
}
