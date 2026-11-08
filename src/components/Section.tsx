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
    <section id={id} className="min-h-screen scroll-mt-8 py-10 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:gap-5">
        <p className="text-sm font-medium text-accent">
          {number} — {title}
        </p>
        <HeadlineTag
          className={
            primary
              ? "text-4xl font-light leading-none tracking-tighter sm:text-5xl lg:text-6xl"
              : "text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-[44px]"
          }
        >
          {headline || title}
        </HeadlineTag>
      </div>

      <div className="flex flex-col gap-10 sm:gap-12">{children}</div>
    </section>
  );
}

export default Section;
