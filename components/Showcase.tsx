'use client'
import { useEffect, useState } from 'react'
import Compare from './Compare'
import type { Item } from '@/lib/types'

const pick = <T,>(a: T[], n: number) => [...a].sort(() => Math.random() - 0.5).slice(0, n)

export default function Showcase({ photos, videos, models }: { photos: Item[]; videos: Item[]; models: Item[] }) {
  const [s, setS] = useState<{ imgs: Item[]; vid?: Item; model?: Item } | null>(null)

  // random picks happen only in the browser, after load
  useEffect(() => {
    setS({ imgs: pick(photos, 4), vid: pick(videos, 1)[0], model: pick(models, 1)[0] })
  }, [photos, videos, models])

  if (!s) return <div className="min-h-[60svh]" />
  const { imgs, vid, model } = s

  return (
    <>
      {(imgs.length > 0 || vid) && (
        <section className="wrap grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 gap-3">
            {imgs.map((p) => (
              <img key={p.src} src={p.src} alt={p.title} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            ))}
          </div>
          {vid && (
            <video src={vid.src} autoPlay muted loop playsInline disablePictureInPicture
                   className="pointer-events-none aspect-[16/10] w-full rounded-2xl bg-black object-cover" />
          )}
        </section>
      )}

      {model && (
        <section className="wrap">
          <h2 className="rule">One model, three views</h2>
          <Compare src={model.src} />
        </section>
      )}
    </>
  )
}