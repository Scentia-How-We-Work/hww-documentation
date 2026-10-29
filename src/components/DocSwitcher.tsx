import { formatDate } from "../lib/dates";
import { docHref } from "../lib/projects";
import type { DocKind, Project } from "../lib/types";

const docs: { kind: DocKind; label: string }[] = [
  { kind: "prd", label: "PRD" },
  { kind: "tds", label: "TDS" },
];

type Props = { project: Project; kind: DocKind; version: number };

// Switches between the project's PRD and TDS, and between versions of the one being shown
function DocSwitcher({ project, kind, version }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 text-sm">
        {docs.map(function (doc) {
          if (project[doc.kind].length === 0) {
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
          {[...project[kind]].reverse().map(function (doc) {
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
