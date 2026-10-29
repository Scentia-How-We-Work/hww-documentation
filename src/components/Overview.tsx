import type { ReactNode } from "react";
import type { Person as PersonType, Prd } from "../lib/types";

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-1.5 border-b border-line py-[18px]">
      <p className="basis-44 pt-0.5 text-xs font-medium uppercase tracking-wider text-subtle">
        {label}
      </p>
      <div className="min-w-0 flex-1 basis-80 text-base">{children}</div>
    </div>
  );
}

function Person({ person }: { person: PersonType }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-0.5">
      <span className="basis-36">{person.name}</span>
      <span className="flex-1 basis-48 text-muted">{person.role}</span>
      <a
        href={`mailto:${person.email}`}
        className="text-sm text-accent underline underline-offset-4 hover:text-accent-strong"
      >
        {person.email}
      </a>
    </div>
  );
}

function Overview({ overview }: { overview: Prd["overview"] }) {
  return (
    <div className="flex flex-col border-t border-ink">
      <Row label="Team">{overview.team}</Row>

      <Row label="Target Delivery">{overview.targetDelivery}</Row>

      <Row label="Key Stakeholders">
        <div className="flex flex-col gap-3">
          {overview.stakeholders.map(function (stakeholder, index) {
            return <Person key={index} person={stakeholder} />;
          })}
        </div>
      </Row>

      <Row label="Primary Contact">
        <Person person={overview.primaryContact} />
      </Row>

      <Row label="Contributors">
        <div className="flex flex-col gap-3">
          {overview.contributors.map(function (contributor, index) {
            return <Person key={index} person={contributor} />;
          })}
        </div>
      </Row>
    </div>
  );
}

export default Overview;
