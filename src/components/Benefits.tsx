import type { Prd } from "../lib/types";

type Props = { items: NonNullable<Prd["problem"]["businessCase"]["benefits"]> };

// Each benefit's figure leads, with its label, explanation and optional status (e.g. Confirmed)
function Benefits({ items }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-medium uppercase tracking-wider text-subtle">
        Commercial Benefit
      </h4>

      <ul className="flex flex-col border-t border-ink">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex flex-col gap-2 border-b border-line py-[18px] sm:flex-row sm:gap-8"
          >
            <p className="shrink-0 text-2xl font-medium leading-tight text-ink sm:w-32">
              {item.figure}
            </p>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
                <p className="text-base font-medium text-ink">{item.label}</p>
                {item.status && (
                  <span className="inline-block rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-ink-soft">
                    {item.status}
                  </span>
                )}
              </div>
              <p className="max-w-[68ch] text-base leading-7 text-ink-soft">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Benefits;
