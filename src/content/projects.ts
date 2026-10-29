import { projectsFromModules } from "../lib/projects";
import type { Prd, Tds } from "../lib/types";

// Each project is a folder in ./projects holding prd/v<n>.json and tds/v<n>.json files; the folder
// name is its id (used in ?project=<id>). pnpm validate checks every file.
const modules = import.meta.glob<Prd | Tds>("./projects/*/*/v*.json", {
  eager: true,
  import: "default",
});

const projects = projectsFromModules(modules);

export default projects;
