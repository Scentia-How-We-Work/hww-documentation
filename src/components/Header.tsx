function Header({ title }: { title: string }) {
  return (
    <header>
      <h1 className="text-[15px] font-medium leading-snug">{title}</h1>
    </header>
  )
}

export default Header
