function Text({ title, content }: { title: string; content?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium uppercase tracking-wider text-subtle">{title}</h3>
      {content && (
        <p className="max-w-[68ch] text-base leading-7 text-ink-soft">{content}</p>
      )}
    </div>
  )
}

export default Text
