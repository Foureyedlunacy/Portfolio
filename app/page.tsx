import Link from 'next/link'
import Image from 'next/image'
import Showcase from '@/components/Showcase'
import { getContent } from '@/lib/content'
import { me } from '@/lib/profile'

const screen = 'flex min-h-[calc(100svh-3.5rem)] flex-col justify-center gap-4'

export default function Home() {
  const { photos, videos, models } = getContent()

  const cards = [
    ['/gallery', 'Gallery', `${photos.length} artworks`, 'Digital, antique and 3D renders.'],
    ['/videos', 'Videos', `${videos.length} films`, 'Motion work, played back to back.'],
    ['/models', '3D Models', `${models.length} models`, 'Orbit, inspect, switch views.'],
  ]

  return (
    <main>
      
      <div className="mx-auto grid max-w-7xl px-5 md:px-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div className="h-96 m-5 rounded-md bg-amber-400  p-5 flex items-center flex-col justify-center">
          <img className='h-36 w-36' src="/01.png" alt="Work in progress"  />
          <h2 className="font-bold text-red-800 text-3xl"  >The site is under development please ignore the malfunction ,naming conventions and 3dmodel viewport errors
            </h2>
          <h1 className="font-extrabold text-red-700 text-3xl" >PLEASE VIEW MY WORK ON 
          <a
      href="https://www.instagram.com/foureyedlunacy?srtk=MThzbjYyOHp2eHQycQ=="
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 hover:opacity-80"
    >
      <span className="font-bold text-blue-800 text-3xl"> { " => " } Instagram</span>
    </a></h1>
        </div>
        <section className={screen}>
          <p className="text-xs uppercase tracking-[0.2em] text-mute">Portfolio</p>
          <h1 className="text-[clamp(3rem,9vw,7rem)]">{me.name}</h1>
          <p className="max-w-[34ch] text-xl">{me.hobby}</p>
          <p>{me.education}</p>
          <p className="meta">{me.worked}</p>
        </section>

        <section className={screen}>
          <h3 className="text-2xl">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {me.skills.map((s) => (
              <span key={s} className="rounded-full border border-line px-3.5 py-1 text-sm">{s}</span>
            ))}
          </div>
          <h3 className="mt-4 text-2xl">Say hello</h3>
          <div className="flex flex-col gap-1">
            {[
              [me.insta, 'Instagram'],
              [me.linkedin, 'LinkedIn'],
              [`tel:${me.phone}`, me.phone],
              [`mailto:${me.email}`, me.email],
            ].map(([href, label]) => (
              <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                 className="w-fit border-b border-line transition hover:border-ink">
                {label}
              </a>
            ))}
          </div>
          <p className="mt-4 font-serif text-2xl text-mute">{me.note}</p>
        </section>
      </div>

      <Showcase photos={photos} videos={videos} models={models} />

      <section className="wrap grid gap-4 lg:grid-cols-3">
        {cards.map(([href, t, n, d]) => (
          <Link
            key={href}
            href={href}
            className="flex min-h-56 flex-col justify-between gap-12 rounded-3xl border border-line p-8 transition duration-500 hover:-translate-y-1 hover:bg-ink hover:text-paper"
          >
            <span className="meta">{n}</span>
            <div>
              <h3 className="text-3xl">{t}</h3>
              <p className="text-mute">{d}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
