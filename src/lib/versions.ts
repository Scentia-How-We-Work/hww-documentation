import { parseDocPath } from "./projects";

// A merged PRD or TDS version never changes: a change goes in as a new version. CI compares the
// branch with main (scripts/check-versions.ts) and fails on any of these.

export type FileChange = { status: string; path: string; oldPath?: string };

/** Changes from `git diff --name-status`, with the status letter only (R100 becomes R). */
export function parseNameStatus(output: string): FileChange[] {
  return output
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const [status, first, second] = line.split("\t");
      const letter = status[0];
      return second === undefined
        ? { status: letter, path: first }
        : { status: letter, path: second, oldPath: first };
    });
}

const verbs: Record<string, string> = { M: "edited", T: "edited", D: "deleted", R: "renamed" };

/** Projects that were removed on purpose: their versions may be deleted, never edited or renamed. */
export const RETIRED_PROJECTS: readonly string[] = ["example-invoice-automation"];

/** An error for each merged version file the changes edit, delete or rename. */
export function versionViolations(changes: FileChange[]): string[] {
  return changes.flatMap(({ status, path, oldPath }) => {
    const before = oldPath ?? path;
    const doc = parseDocPath(before);
    if (!(status in verbs) || !doc) return [];
    if (status === "D" && RETIRED_PROJECTS.includes(doc.projectId)) return [];
    return [
      `${before} was ${verbs[status]}. Merged versions can't change: add the change as a new version.`,
    ];
  });
}
