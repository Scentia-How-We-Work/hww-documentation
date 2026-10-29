import { isLinkCard } from "../lib/media";
import type { Image, LinkCard, MediaItem } from "../lib/types";

type Props = { title?: string; items: MediaItem[] };

function Card({ card }: { card: LinkCard }) {
  return (
    <a
      href={card.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 border border-line p-6 transition-colors hover:border-ink"
    >
      <span className="text-base font-medium text-ink">{card.title}</span>
      {card.description && (
        <span className="text-sm leading-6 text-ink-soft">{card.description}</span>
      )}
      <span className="mt-auto pt-2 text-sm text-accent underline underline-offset-4 group-hover:text-accent-strong">
        Open ↗<span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  );
}

function Media({ title, items }: Props) {
  const images = items.filter((item): item is Image => !isLinkCard(item));
  const cards = items.filter(isLinkCard);

  return (
    <div className="flex flex-col gap-3">
      {title && (
        <h3 className="text-xs font-medium uppercase tracking-wider text-subtle">{title}</h3>
      )}

      {images.length > 0 && (
        <div className="flex flex-col gap-6">
          {images.map(function (item, index) {
            return (
              <div key={index} className="overflow-hidden border border-line">
                <img src={item.image} alt={item.alt} className="block h-auto w-full" />
              </div>
            );
          })}
        </div>
      )}

      {cards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map(function (card) {
            return <Card key={card.link} card={card} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Media;
