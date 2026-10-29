import { formatDate } from "../lib/dates";
import { docHref } from "../lib/projects";
import { sectionAnchor } from "../lib/tds";
import type { Project, Tds } from "../lib/types";
import Blocks from "./Blocks";
import Inline from "./Inline";
import { Row } from "./Overview";
import Section from "./Section";
import VersionHistory from "./VersionHistory";

// Section 0 comes from the document control and version headers; the rest from the sections
export function tdsSections(tds: Tds) {
  return [
    { id: "document-control", number: "0", title: "Document control" },
    ...tds.sections.map((section) => ({
      id: sectionAnchor(section.number),
      number: section.number,
      title: section.title,
    })),
  ];
}

function DocumentControl({ project, tds }: { project: Project; tds: Tds }) {
  const control = tds.documentControl;
  const linkClass = "text-accent underline underline-offset-4 hover:text-accent-strong";

  return (
    <div className="flex flex-col border-t border-ink">
      <Row label="Project">{control.project}</Row>
      <Row label="Tier">
        <Inline text={control.tier} />
      </Row>
      <Row label="Author">{tds.version.author}</Row>
      <Row label="Approver">{control.approver}</Row>
      <Row label="Reviewers">{control.reviewers}</Row>
      <Row label="Status">{tds.version.status}</Row>
      <Row label="Version">v{tds.version.number}</Row>
      <Row label="Last updated">{formatDate(tds.version.date)}</Row>
      {tds.prdVersion && project.prd.length > 0 && (
        <Row label="Written against">
          <a href={docHref(project.id, "prd", tds.prdVersion)} className={linkClass}>
            PRD v{tds.prdVersion}
          </a>
        </Row>
      )}
      <Row label="Related">
        <div className="flex flex-col gap-1.5">
          {control.related.map((link) => (
            <a
              key={link.url + link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {link.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </Row>
    </div>
  );
}

function TdsPage({ project, tds }: { project: Project; tds: Tds }) {
  const history = project.tds.slice(0, tds.version.number).map((version) => version.version);

  return (
    <>
      <Section
        id="document-control"
        number="0"
        title="Document control"
        headline={`${tds.documentControl.project} — Technical Design Spec`}
        primary
      >
        {tds.intro && <Blocks blocks={tds.intro} />}

        <DocumentControl project={project} tds={tds} />

        <VersionHistory title="Approval Log" versions={history} />
      </Section>

      {tds.sections.map((section) => (
        <Section
          key={section.number}
          id={sectionAnchor(section.number)}
          number={/^[A-Z]$/.test(section.number) ? `Appendix ${section.number}` : section.number}
          title={section.title}
        >
          {section.blocks.length > 0 && <Blocks blocks={section.blocks} />}

          {section.subsections?.map((subsection) => (
            <div
              key={subsection.number}
              id={sectionAnchor(subsection.number)}
              className="flex scroll-mt-8 flex-col gap-6"
            >
              <h3 className="text-xl font-medium tracking-tight">
                <span className="mr-3 text-subtle">{subsection.number}</span>
                {subsection.title}
              </h3>
              <Blocks blocks={subsection.blocks} />
            </div>
          ))}
        </Section>
      ))}
    </>
  );
}

export default TdsPage;
