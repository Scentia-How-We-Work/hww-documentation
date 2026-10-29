import type { ReactNode } from "react";

type Props = {
  id: string;
  number: string;
  title: string;
  headline?: string;
  primary?: boolean;
  children: ReactNode;
};

function Section({ id, number, title, headline, primary, children }: Props) {
  const HeadlineTag = primary ? "h1" : "h2";

  return (
    <section id={id} className="py-16 scroll-mt-8 min-h-screen snap-start">
      <div className="mb-12 flex flex-col gap-5">
        <p className="text-sm font-medium text-accent">
          {number} — {title}
        </p>
        <HeadlineTag
          className={
            primary
              ? "text-6xl font-light leading-none tracking-tighter"
              : "text-[44px] font-light leading-tight tracking-tight"
          }
        >
          {headline || title}
        </HeadlineTag>
      </div>

      <div className="flex flex-col gap-12">{children}</div>
    </section>
  );
}

export default Section;
