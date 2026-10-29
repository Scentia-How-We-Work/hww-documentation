import { useEffect, useRef } from "react";
import projects from "./content/projects";
import { findProject } from "./lib/projects";
import Section from "./components/Section";
import Overview from "./components/Overview";
import Text from "./components/Text";
import Table from "./components/Table";
import List from "./components/List";
import Media from "./components/Media";
import Commercials from "./components/Commercials";
import Nav from "./components/Nav";
import ProjectList from "./components/ProjectList";
import { useSectionSnap } from "./hooks/useSectionSnap";
import "./App.css";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "problem", title: "The Problem" },
  { id: "solution", title: "The Solution" },
  { id: "scope", title: "Scope" },
  { id: "timeline", title: "Timeline" },
  { id: "risks", title: "Risks" },
  { id: "dependencies", title: "Dependencies" },
  { id: "assumptions", title: "Assumptions" },
];

const projectId = new URLSearchParams(window.location.search).get("project");
const project = findProject(projects, projectId);

function App() {
  const scroller = useRef<HTMLDivElement>(null);
  useSectionSnap(scroller);

  useEffect(() => {
    document.title = project ? project.prd.pageTitle : "PRDs";
  }, []);

  if (!project) {
    return <ProjectList projects={projects} missingId={projectId} />;
  }

  const prd = project.prd;

  return (
    <main id="top" className="flex h-screen">
      <Nav sections={sections} title={prd.pageTitle} />

      <div
        ref={scroller}
        className="h-screen min-w-0 flex-1 overflow-y-auto scroll-smooth px-16 pb-28"
      >
        <div className="max-w-[880px]">
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
        </div>
      </div>
    </main>
  );
}

export default App;
