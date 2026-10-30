import { useEffect, useId, useState } from "react";
import type { Mermaid as MermaidApi } from "mermaid";

// Mermaid is large, so it's only downloaded once a page shows a diagram
let mermaidLoader: Promise<MermaidApi> | undefined;

function loadMermaid() {
  mermaidLoader ??= import("mermaid").then((module) => module.default);
  return mermaidLoader;
}

// Dark when the theme toggle says so, or when it's on System and the device is dark
function isDark() {
  const theme = document.documentElement.dataset.theme;
  return theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function useDarkMode() {
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const update = () => setDark(isDark());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return dark;
}

type Rendered = { svg: string } | { error: string } | undefined;

type Props = { code: string; title?: string; description?: string };

function Mermaid({ code, title, description }: Props) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const dark = useDarkMode();
  const [rendered, setRendered] = useState<Rendered>();

  useEffect(() => {
    let cancelled = false;

    loadMermaid().then(async (mermaid) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: dark ? "dark" : "default",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      });
      try {
        const { svg } = await mermaid.render(id, code);
        if (!cancelled) setRendered({ svg });
      } catch (error) {
        // A failed render can leave its scratch element behind
        document.getElementById(`d${id}`)?.remove();
        if (!cancelled) setRendered({ error: (error as Error).message });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, dark, id]);

  return (
    <figure className="flex flex-col gap-3">
      {title && (
        <figcaption className="text-xs font-medium uppercase tracking-wider text-subtle">
          {title}
        </figcaption>
      )}

      {description && <p className="text-sm leading-6 text-ink-soft">{description}</p>}

      {rendered === undefined && <p className="text-sm text-muted">Loading diagram…</p>}

      {rendered && "svg" in rendered && (
        <div
          className="overflow-x-auto border border-line p-6 [&_svg]:mx-auto"
          dangerouslySetInnerHTML={{ __html: rendered.svg }}
        />
      )}

      {rendered && "error" in rendered && (
        <div className="flex flex-col gap-3 bg-high-bg px-4 py-3 text-sm text-high">
          <p>This diagram couldn't be drawn: {rendered.error}</p>
          <pre className="overflow-x-auto whitespace-pre text-xs">{code}</pre>
        </div>
      )}
    </figure>
  );
}

export default Mermaid;
