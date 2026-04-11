export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-(--line) px-4 pb-14 pt-10 text-(--sea-ink-soft)">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">&copy; {year} Finance Console</p>
        <p className="island-kicker m-0">TanStack Start + shadcn/ui + Tailwind v4</p>
      </div>
      <div className="page-wrap mt-4 text-center text-xs text-muted-foreground sm:text-right">
        Backend: financeapplaurefindel-e0f1853e72fd.herokuapp.com
      </div>
    </footer>
  )
}
