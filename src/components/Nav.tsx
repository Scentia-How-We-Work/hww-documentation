import type { ReactNode } from "react";
import Header from "./Header";
import ThemeToggle from "./ThemeToggle";

// A section's number defaults to its position (01, 02, …); the TDS gives its own (0–17, A–C)
type Props = {
  sections: { id: string; title: string; number?: string }[];
  title: string;
  children?: ReactNode;
};

function Nav({ sections, title, children }: Props) {
  return (
    <nav className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-10 border-r border-line px-8 py-10">
      <div className="flex flex-col gap-4">
        <a href="./" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
          All projects
        </a>

        <Header title={title} />

        {children}
      </div>

      <div className="-mx-2 flex min-h-0 flex-col overflow-y-auto border-b border-line px-2">
        {sections.map(function (section, index) {
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex gap-3.5 border-t border-line py-2.5 text-sm text-muted transition-transform duration-200 hover:scale-105 hover:text-ink"
            >
              <span className="w-5 shrink-0 text-subtle">
                {section.number ?? String(index + 1).padStart(2, "0")}
              </span>
              {section.title}
            </a>
          );
        })}
      </div>

      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Nav;
