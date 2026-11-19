import { projectsFromModules } from "../lib/projects";
import type { Prd, Tds, UatGuide } from "../lib/types";

// Each project is a folder in ./projects holding prd/v<n>.json, tds/v<n>.json and (optionally)
// uat/v<n>.json files; the folder
// name is its id (used in ?project=<id>). pnpm validate checks every file.
const modules = import.meta.glob<Prd | Tds | UatGuide>("./projects/*/*/v*.json", {
  eager: true,
  import: "default",
});

const projects = projectsFromModules(modules);

export default projects;
