import { formatDate } from "../lib/dates";
import { DOC_LABELS, docHref, versions } from "../lib/projects";
import type { DocKind, Project } from "../lib/types";

// PRD and TDS always show, greyed out until written; a UAT guide only shows when there is one
function docsFor(project: Project): { kind: DocKind; label: string }[] {
  const kinds: DocKind[] = project.uat ? ["prd", "tds", "uat"] : ["prd", "tds"];
  return kinds.map((kind) => ({ kind, label: DOC_LABELS[kind] }));
}

type Props = { project: Project; kind: DocKind; version: number };

// Switches between the project's PRD, TDS and UAT guide, and between versions of the one being shown
function DocSwitcher({ project, kind, version }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {docsFor(project).map(function (doc) {
          if (versions(project, doc.kind).length === 0) {
            return (
              <span key={doc.kind} className="text-subtle">
                {doc.label}
                <span className="sr-only"> (not written yet)</span>
              </span>
            );
          }

          const current = doc.kind === kind;
          return (
            <a
              key={doc.kind}
              href={docHref(project.id, doc.kind)}
              aria-current={current ? "page" : undefined}
              className={
                current
                  ? "font-medium text-ink underline underline-offset-4"
                  : "text-muted hover:text-ink"
              }
            >
              {doc.label}
            </a>
          );
        })}
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wider text-subtle">
        Version
        <select
          value={version}
          onChange={(event) => {
            window.location.search = docHref(project.id, kind, Number(event.target.value));
          }}
          className="cursor-pointer border border-line bg-paper px-2 py-1.5 text-sm font-normal normal-case tracking-normal text-ink"
        >
          {[...versions(project, kind)].reverse().map(function (doc) {
            const info = doc.version;
            return (
              <option key={info.number} value={info.number}>
                v{info.number} · {info.status} · {formatDate(info.date)}
              </option>
            );
          })}
        </select>
      </label>
    </div>
  );
}

export default DocSwitcher;
