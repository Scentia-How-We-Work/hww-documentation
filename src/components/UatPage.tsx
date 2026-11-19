import { formatDate } from "../lib/dates";
import { sectionAnchor } from "../lib/tds";
import type { UatGuide } from "../lib/types";
import Blocks from "./Blocks";
import Section from "./Section";

// One navigation entry per numbered section
export function uatSections(guide: UatGuide) {
  return guide.sections.map((section) => ({
    id: sectionAnchor(section.number),
    number: section.number,
    title: section.title,
  }));
}

// A UAT guide for testers: its sections, each with its subsections (e.g. one per journey). The
// first section is headed with the guide's title and version.
function UatPage({ guide }: { guide: UatGuide }) {
  const { version } = guide;

  return (
    <>
      {guide.sections.map((section, index) => (
        <Section
          key={section.number}
          id={sectionAnchor(section.number)}
          number={section.number}
          title={section.title}
          headline={index === 0 ? guide.title : undefined}
          primary={index === 0}
        >
          {index === 0 && (
            <p className="-mt-4 text-sm text-muted sm:-mt-6">
              v{version.number} · {version.status} · {formatDate(version.date)}
            </p>
          )}

          {index === 0 && guide.intro && <Blocks blocks={guide.intro} />}

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

export default UatPage;
