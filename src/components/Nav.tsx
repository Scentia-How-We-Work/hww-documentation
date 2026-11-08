import { useEffect, useState, type ReactNode } from "react";
import Header from "./Header";
import ThemeToggle from "./ThemeToggle";

// A section's number defaults to its position (01, 02, …); the TDS gives its own (0–17, A–C)
type Props = {
  sections: { id: string; title: string; number?: string }[];
  title: string;
  children?: ReactNode;
};

// A sidebar on large screens. Below that, a bar across the top whose Menu button opens the same
// navigation as a full-screen panel.
function Nav({ sections, title, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav className="shrink-0 border-line lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:px-8 lg:py-10">
      <div className="flex h-14 items-center justify-between gap-4 border-b border-line px-4 sm:px-8 lg:hidden">
        <p className="min-w-0 truncate text-[15px] font-medium">{title}</p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen(!open)}
          className="shrink-0 cursor-pointer text-sm text-muted underline underline-offset-4 hover:text-ink"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id="nav-panel"
        className={`${open ? "flex" : "hidden"} fixed inset-x-0 top-14 bottom-0 z-20 flex-col gap-10 overflow-y-auto bg-paper px-4 py-8 sm:px-8 lg:static lg:z-auto lg:flex lg:min-h-0 lg:flex-1 lg:overflow-visible lg:bg-transparent lg:p-0`}
      >
        <div className="flex flex-col gap-4">
          <a href="./" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
            All projects
          </a>

          <div className="hidden lg:block">
            <Header title={title} />
          </div>

          {children}
        </div>

        <div className="-mx-2 flex shrink-0 flex-col border-b border-line px-2 lg:min-h-0 lg:shrink lg:overflow-y-auto">
          {sections.map(function (section, index) {
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setOpen(false)}
                className="flex gap-3.5 border-t border-line py-3 text-sm text-muted transition-transform duration-200 hover:scale-105 hover:text-ink lg:py-2.5"
              >
                <span className="w-5 shrink-0 text-subtle">
                  {section.number ?? String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </a>
            );
          })}
        </div>

        <div className="lg:mt-auto">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
