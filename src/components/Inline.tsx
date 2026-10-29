import { parseInline } from "../lib/inline";

// TDS text with its **bold**, *italic*, `code` and [link](https://…) formatting applied
function Inline({ text }: { text: string }) {
  return parseInline(text).map(function (part, index) {
    switch (part.type) {
      case "bold":
        return (
          <strong key={index} className="font-medium text-ink">
            {part.text}
          </strong>
        );
      case "italic":
        return <em key={index}>{part.text}</em>;
      case "code":
        return (
          <code key={index} className="bg-low-bg px-1 py-0.5 font-mono text-[0.9em] text-ink">
            {part.text}
          </code>
        );
      case "link":
        return (
          <a
            key={index}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 hover:text-accent-strong"
          >
            {part.text}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      default:
        return part.text;
    }
  });
}

export default Inline;
