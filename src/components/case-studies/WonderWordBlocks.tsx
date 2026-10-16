import { bet, pricingNotes, pricingTiers } from "@/data/wonderword";
import { HoverLift, StaggerChildren, StaggerItem, Tilt3D } from "@/components/motion";
import { ProvenanceBadge } from "@/components/ui";
import { cn } from "@/lib/cn";

/** The product bet: hypothesis, three pillars, findings by evidence tier, falsification. */
export function BetPanel({ level = "h3" }: { level?: "h3" | "h4" }) {
  const H = level;
  return (
    <div className="grid gap-6">
      <Tilt3D size="lg" className="[border-radius:var(--radius-lg)]">
        <div className="card relative overflow-hidden p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(165,148,255,0.3),transparent_70%)]"
          />
          <ProvenanceBadge kind="hypothesis" />
          <p className="display mt-4 text-[clamp(1.4rem,2.6vw,2.1rem)] leading-tight [font-stretch:100%]">
            {bet.hypothesis}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {bet.pillars.map((p) => (
              <li
                key={p.title}
                className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg)]/50 p-4"
              >
                <p className="font-[family-name:var(--font-display)] font-semibold">{p.title}</p>
                <p className="mt-1 text-[0.95rem] text-[var(--color-muted)]">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[var(--color-muted)]">{bet.threshold}</p>
          <p className="mt-3 text-[var(--color-muted)]">{bet.loadBearing}</p>
        </div>
      </Tilt3D>

      <StaggerChildren as="ul" className="grid gap-4 md:grid-cols-3">
        {bet.findings.map((f) => (
          <StaggerItem as="li" key={f.title}>
            <HoverLift>
              <Tilt3D size="sm" className="[border-radius:var(--radius-lg)]">
                <article className="card h-full p-5">
                  <ProvenanceBadge kind={f.status} label={f.statusLabel} />
                  <H className="mt-3 font-[family-name:var(--font-display)] text-lg font-semibold">
                    {f.title}
                  </H>
                  <p className="mt-1.5 text-[0.98rem] text-[var(--color-muted)]">{f.body}</p>
                </article>
              </Tilt3D>
            </HoverLift>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <div className="rounded-[var(--radius-lg)] border border-dashed border-[rgba(255,143,143,0.45)] p-6">
        <H className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-bad)]">
          What would falsify this
        </H>
        <p className="mt-2 text-[var(--color-muted)]">{bet.falsification}</p>
      </div>
    </div>
  );
}

const fmt = (n: number) => (n === 0 ? "$0" : `$${n.toFixed(2)}`);

/** Three pricing tiers with projected mix. Projections are labelled as modeled. */
export function PricingTiers({ level = "h3" }: { level?: "h3" | "h4" }) {
  const H = level;
  return (
    <div>
      <StaggerChildren as="ul" className="grid gap-4 md:grid-cols-3">
        {pricingTiers.map((t) => (
          <StaggerItem as="li" key={t.id}>
            <HoverLift>
              <Tilt3D size="md" className="[border-radius:var(--radius-lg)]">
                <article
                  className={cn(
                    "card flex h-full flex-col p-6",
                    t.id === "family" && "border-[rgba(165,148,255,0.45)]",
                  )}
                >
                  <H className="font-[family-name:var(--font-display)] text-lg font-semibold">{t.name}</H>
                  <p className="display mt-2 text-4xl">
                    {fmt(t.monthly)}
                    <span className="ml-1 text-base font-normal text-[var(--color-muted)] [font-stretch:100%]">
                      / month
                    </span>
                  </p>
                  {t.annual && <p className="text-sm text-[var(--color-muted)]">or ${t.annual} a year</p>}
                  <p className="mt-4 flex-1 text-[0.98rem] text-[var(--color-muted)]">{t.features}</p>
                  <div className="mt-5">
                    <div className="flex items-center justify-between font-[family-name:var(--font-display)] text-sm">
                      <span className="text-[var(--color-muted)]">Projected share of users</span>
                      <span className="font-semibold">{t.projectedMixPct}%</span>
                    </div>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg)]"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-violet)] to-[var(--color-cyan)]"
                        style={{ width: `${t.projectedMixPct}%` }}
                      />
                    </div>
                  </div>
                </article>
              </Tilt3D>
            </HoverLift>
          </StaggerItem>
        ))}
      </StaggerChildren>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
        <ProvenanceBadge kind="modeled" />
        <span>{pricingNotes.mixCaption}</span>
      </div>
      <p className="mt-4 max-w-3xl text-[var(--color-muted)]">
        <span className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-text)]">
          Why annual billing comes last.{" "}
        </span>
        {pricingNotes.annualLast}
      </p>
    </div>
  );
}
