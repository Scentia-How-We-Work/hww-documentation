// The inline formatting TDS text can use: **bold**, *italic*, `code` and [links](https://…).

export type InlinePart =
  | { type: "text" | "bold" | "italic" | "code"; text: string }
  | { type: "link"; text: string; url: string };

const pattern =
  /`([^`]+)`|\*\*(.+?)\*\*|\*([^*\s][^*]*?)\*|\[([^\]]+)\]\(((?:https?:|mailto:)[^)\s]+)\)/g;

export function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push({ type: "text", text: text.slice(last, match.index) });
    const [, code, bold, italic, label, url] = match;
    if (code !== undefined) parts.push({ type: "code", text: code });
    else if (bold !== undefined) parts.push({ type: "bold", text: bold });
    else if (italic !== undefined) parts.push({ type: "italic", text: italic });
    else parts.push({ type: "link", text: label, url });
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });
  return parts;
}
