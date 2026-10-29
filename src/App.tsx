import { useEffect, useRef } from "react";
import projects from "./content/projects";
import { docHref, resolveView } from "./lib/projects";
import DocSwitcher from "./components/DocSwitcher";
import Nav from "./components/Nav";
import PrdPage, { prdSections } from "./components/PrdPage";
import ProjectList from "./components/ProjectList";
import TdsPage, { tdsSections } from "./components/TdsPage";
import { useSectionSnap } from "./hooks/useSectionSnap";
import "./App.css";

const view = resolveView(projects, new URLSearchParams(window.location.search));

// The PRD or TDS version the URL asks for (versions are numbered from 1 with no gaps)
const prd = view.page === "doc" && view.kind === "prd" ? view.project.prd[view.version - 1] : null;
const tds = view.page === "doc" && view.kind === "tds" ? view.project.tds[view.version - 1] : null;
const title = prd ? prd.pageTitle : tds ? `${tds.documentControl.project} TDS` : "PRDs and TDSs";

function App() {
  const scroller = useRef<HTMLDivElement>(null);
  useSectionSnap(scroller);

  useEffect(() => {
    document.title = title;
  }, []);

  if (view.page === "list") {
    return <ProjectList projects={projects} missingId={view.missingId} />;
  }

  const { project, kind, version, missingVersion } = view;
  const latest = project[kind].length;
  const label = kind.toUpperCase();

  return (
    <main id="top" className="flex h-screen">
      <Nav sections={prd ? prdSections : tdsSections(tds!)} title={title}>
        <DocSwitcher project={project} kind={kind} version={version} />
      </Nav>

      <div
        ref={scroller}
        className="h-screen min-w-0 flex-1 overflow-y-auto scroll-smooth px-16 pb-28"
      >
        <div className="max-w-[880px]">
          {missingVersion && (
            <p className="mt-10 bg-medium-bg px-4 py-3 text-sm text-medium">
              There's no v{missingVersion} of this {label}, so this is the latest version (v
              {latest}).
            </p>
          )}

          {!missingVersion && version < latest && (
            <p className="mt-10 bg-medium-bg px-4 py-3 text-sm text-medium">
              This is v{version}, an older version of this {label}.{" "}
              <a href={docHref(project.id, kind)} className="underline underline-offset-4">
                See the latest (v{latest})
              </a>
            </p>
          )}

          {prd && (
            <PrdPage prd={prd} history={project.prd.slice(0, version).map((p) => p.version)} />
          )}
          {tds && <TdsPage project={project} tds={tds} />}
        </div>
      </div>
    </main>
  );
}

export default App;
