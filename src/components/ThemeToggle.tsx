import { useState } from "react";

type Theme = "light" | "dark" | "system";

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function getSavedTheme(): Theme {
  try {
    const theme = localStorage.getItem("theme");
    return theme === "light" || theme === "dark" ? theme : "system";
  } catch {
    return "system";
  }
}

// 'system' clears the override so the colours follow the device's setting
function applyTheme(theme: Theme) {
  if (theme === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }

  try {
    if (theme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", theme);
    }
  } catch {
    // Storage can be blocked; the theme still applies for this visit
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getSavedTheme);

  function selectTheme(value: Theme) {
    setTheme(value);
    applyTheme(value);
  }

  return (
    <div className="flex gap-4 text-sm" role="group" aria-label="Colour theme">
      {options.map(function (option) {
        const selected = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => selectTheme(option.value)}
            className={
              selected
                ? "cursor-pointer text-ink underline underline-offset-4"
                : "cursor-pointer text-muted hover:text-ink"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
