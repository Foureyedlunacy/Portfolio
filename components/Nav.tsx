import Link from 'next/link'

const links = [['/gallery', 'Gallery'], ['/videos', 'Videos'], ['/models', '3D']]

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper/80 px-5 backdrop-blur-md md:px-10">
      <Link href="/" className="font-serif text-2xl">Profile</Link>
      <nav className="flex gap-6 text-sm text-mute">
        {links.map(([h, l]) => (
          <Link key={h} href={h} className="transition hover:text-ink">{l}</Link>
        ))}
      </nav>
    </header>
  )
}