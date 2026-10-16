import {
  CareerImpact,
  DemoMetrics,
  EnterpriseDelivery,
  WonderWordDashboard,
} from "@/components/dashboard/sections";
import { FadeIn } from "@/components/motion";

function Block({
  id,
  n,
  title,
  lede,
  children,
}: {
  id: string;
  n: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="scroll-mt-28 border-t border-[var(--color-line)] py-14"
    >
      <FadeIn>
        <p className="font-[family-name:var(--font-display)] text-sm text-[var(--color-faint)] tabular-nums">
          {n}
        </p>
        <h2 id={`${id}-h`} className="display mt-1 text-[clamp(1.7rem,3.2vw,2.5rem)]">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-[var(--color-muted)]">{lede}</p>
      </FadeIn>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function DashboardBody() {
  return (
    <>
      <Block
        id="career"
        n="01"
        title="Career impact"
        lede="Six roles since 2016, including three that run at the same time today. Filter by focus area; results are grouped by the employer or project they belong to."
      >
        <CareerImpact />
      </Block>
      <Block
        id="wonderword"
        n="02"
        title="WonderWord AI beta"
        lede="One measured number (100+ beta families), the targets set for March 2027, and a modeled projection between them. No revenue has been booked; every projection is dashed and labelled."
      >
        <WonderWordDashboard />
      </Block>
      <Block
        id="enterprise"
        n="03"
        title="Enterprise delivery"
        lede="Four separate achievements. 15+ integrations are from Juniper Networks; the three percentages are from C3.ai. They are not added together."
      >
        <EnterpriseDelivery />
      </Block>
      <Block
        id="demos"
        n="04"
        title="Product-thinking demos"
        lede="Outputs from the Playground. These are demonstrations of documented logic, not production analytics, and your interactions stay in this browser tab."
      >
        <DemoMetrics />
      </Block>
    </>
  );
}
