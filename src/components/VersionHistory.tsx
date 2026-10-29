import { formatDate } from "../lib/dates";
import type { VersionInfo } from "../lib/types";
import Table from "./Table";

// The approval log: every version's header up to the one being shown, newest first
function VersionHistory({ title, versions }: { title?: string; versions: VersionInfo[] }) {
  const rows = [...versions].reverse().map((version) => ({
    version: `v${version.number}`,
    date: formatDate(version.date),
    status: version.status,
    author: version.author,
    approvedBy: version.approvedBy ?? "—",
    changes: version.changes,
  }));

  return (
    <Table
      title={title}
      columns={[
        { key: "version", label: "Version" },
        { key: "date", label: "Date" },
        { key: "status", label: "Status" },
        { key: "author", label: "Author" },
        { key: "approvedBy", label: "Approved by" },
        { key: "changes", label: "Changes" },
      ]}
      rows={rows}
    />
  );
}

export default VersionHistory;
