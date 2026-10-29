import type { Prd, VersionInfo } from "../lib/types";
import Commercials from "./Commercials";
import List from "./List";
import Media from "./Media";
import Overview from "./Overview";
import Section from "./Section";
import Table from "./Table";
import Text from "./Text";
import VersionHistory from "./VersionHistory";

// The PRD's sections, in page order, for the side navigation
export const prdSections = [
  { id: "overview", title: "Overview" },
  { id: "problem", title: "The Problem" },
  { id: "solution", title: "The Solution" },
  { id: "scope", title: "Scope" },
  { id: "timeline", title: "Timeline" },
  { id: "risks", title: "Risks" },
  { id: "dependencies", title: "Dependencies" },
  { id: "assumptions", title: "Assumptions" },
  { id: "versions", title: "Version History" },
];

// history is every version's header up to this one
function PrdPage({ prd, history }: { prd: Prd; history: VersionInfo[] }) {
  return (
    <>
      <Section id="overview" number="01" title="Overview" headline={prd.overview.title} primary>
        <Overview overview={prd.overview} />
      </Section>

      <Section id="problem" number="02" title="The Problem" headline={prd.problem.headline}>
        <Text title="Current State" content={prd.problem.currentState} />

        <Text title="Strategic Alignment" content={prd.problem.strategicAlignment} />

        <div className="flex flex-col gap-8">
          <Text title="Business Case" />

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium">Baseline</h4>
            <Table
              columns={[
                { key: "metric", label: "Metric" },
                { key: "currentState", label: "Current State" },
              ]}
              rows={prd.problem.businessCase.baseline}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium">Expected Improvement</h4>
            <Table
              columns={[
                { key: "metric", label: "Metric" },
                { key: "currentState", label: "Current" },
                { key: "target", label: "Target" },
                { key: "improvement", label: "Improvement" },
              ]}
              rows={prd.problem.businessCase.expectedImprovement}
            />
          </div>

          <Commercials content={prd.problem.businessCase.commercialBenefit} />
        </div>
      </Section>

      <Section id="solution" number="03" title="The Solution">
        <Text title="Future State" content={prd.solution.futureState} />

        <Media title="Workflows" items={prd.solution.workflows} />

        <List title="Key Features" items={prd.solution.keyFeatures} />

        <Media title="Mock-ups" items={prd.solution.wireframes} />
      </Section>

      <Section id="scope" number="04" title="Scope">
        <List title="Goals" items={prd.scope.goals} />

        <List title="Non Goals" items={prd.scope.nonGoals} />
      </Section>

      <Section id="timeline" number="05" title="Timeline">
        <Table
          title="Key Milestones"
          columns={[
            { key: "target", label: "Target Date" },
            { key: "milestone", label: "Milestone" },
            { key: "description", label: "Description" },
          ]}
          rows={prd.milestones}
        />
      </Section>

      <Section id="risks" number="06" title="Risks">
        <Table
          columns={[
            { key: "risk", label: "Risk" },
            { key: "impact", label: "Impact" },
            { key: "likelihood", label: "Likelihood" },
            { key: "mitigation", label: "Mitigation" },
          ]}
          rows={prd.risks}
        />
      </Section>

      <Section id="dependencies" number="07" title="Dependencies">
        <Table
          columns={[
            { key: "dependency", label: "Dependency" },
            { key: "requirement", label: "Requirement" },
            { key: "owner", label: "Owner" },
            { key: "status", label: "Status" },
          ]}
          rows={prd.dependencies}
        />
      </Section>

      <Section id="assumptions" number="08" title="Assumptions">
        <List items={prd.assumptions} />
      </Section>

      <Section id="versions" number="09" title="Version History">
        <VersionHistory versions={history} />
      </Section>
    </>
  );
}

export default PrdPage;
