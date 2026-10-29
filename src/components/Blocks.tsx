import { level } from "../lib/projects";
import type { Block as BlockType } from "../lib/types";
import Inline from "./Inline";
import Mermaid from "./Mermaid";
import { levelStyles } from "./Table";

const calloutStyles: Record<Extract<BlockType, { type: "callout" }>["tone"], string> = {
  info: "border-accent bg-low-bg text-ink-soft",
  guidance: "border-line bg-low-bg text-muted",
  warning: "border-medium bg-medium-bg text-ink",
};

function Cell({ value }: { value: string }) {
  const cellLevel = level(value);

  if (cellLevel) {
    return (
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${levelStyles[cellLevel]}`}
      >
        {value}
      </span>
    );
  }

  return <Inline text={value} />;
}

function Block({ block }: { block: BlockType }) {
  switch (block.type) {
    case "text":
      return (
        <p className="max-w-[68ch] text-base leading-7 text-ink-soft">
          <Inline text={block.text} />
        </p>
      );

    case "heading":
      return (
        <h4 className="pt-2 text-base font-medium text-ink">
          <Inline text={block.text} />
        </h4>
      );

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={`flex max-w-[68ch] flex-col gap-2 pl-6 leading-7 text-ink-soft ${block.ordered ? "list-decimal" : "list-disc"}`}
        >
          {block.items.map((item, index) => (
            <li key={index}>
              <Inline text={item} />
            </li>
          ))}
        </ListTag>
      );
    }

    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr>
                {block.columns.map((column, index) => (
                  <th
                    key={index}
                    className="border-b border-ink pb-3 pr-4 align-bottom text-xs font-medium uppercase tracking-wider text-subtle"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="leading-relaxed text-ink-soft">
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-line">
                  {row.map((value, columnIndex) => (
                    <td
                      key={columnIndex}
                      className={`py-3.5 pr-4 align-top ${columnIndex === 0 ? "text-ink" : ""}`}
                    >
                      <Cell value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "mermaid":
      return <Mermaid code={block.code} title={block.title} />;

    case "callout":
      return (
        <div
          role="note"
          className={`flex flex-col gap-2 border-l-2 px-5 py-4 text-sm leading-6 ${calloutStyles[block.tone]}`}
        >
          {block.text.split("\n").map((line, index) => (
            <p key={index}>
              <Inline text={line} />
            </p>
          ))}
        </div>
      );

    case "checklist":
      return (
        <ul className="flex flex-col gap-2 leading-7 text-ink-soft">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span aria-hidden="true" className="text-subtle">
                {item.done ? "☑" : "☐"}
              </span>
              <span>
                <span className="sr-only">{item.done ? "Done: " : "Not done: "}</span>
                <Inline text={item.text} />
              </span>
            </li>
          ))}
        </ul>
      );
  }
}

// A TDS section's content, block by block
function Blocks({ blocks }: { blocks: BlockType[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

export default Blocks;
