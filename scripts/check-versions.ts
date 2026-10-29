// Fails if this branch edits, deletes or renames a PRD or TDS version that's already on the base
// (rules in src/lib/versions.ts). Usage: pnpm check:versions [base ref, default origin/main]
import { execFileSync } from "node:child_process";
import { parseNameStatus, versionViolations } from "../src/lib/versions";

const base = process.argv[2] || "origin/main";

if (/^0+$/.test(base)) {
  console.log("No base commit to compare with (new branch): skipping the version check.");
  process.exit(0);
}

const output = execFileSync(
  "git",
  ["diff", "--name-status", "-M", `${base}...HEAD`, "--", "src/content/projects"],
  { encoding: "utf8" },
);

const errors = versionViolations(parseNameStatus(output));
if (errors.length > 0) {
  console.error(`Version check failed against ${base}:\n`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}
console.log(`Versions unchanged against ${base}.`);
