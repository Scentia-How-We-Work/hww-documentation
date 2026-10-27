function Commercials({ content }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-medium uppercase tracking-wider text-subtle">
        {content.title}
      </h4>

      <div className="flex flex-col border-t border-ink">
        <p className="border-b border-line py-[18px] text-base text-ink">
          {content.timeSaving}
        </p>

        <p className="border-b border-line py-[18px] text-base text-ink">
          {content.costBenefit}
        </p>
      </div>
    </div>
  )
}

export default Commercials
