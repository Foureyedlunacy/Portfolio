'use client'
import { useEffect, useRef, useState } from 'react'
import { fmt } from '@/lib/profile'
import type { Item } from '@/lib/types'

export default function VideoGallery({ videos }: { videos: Item[] }) {
  const [i, setI] = useState(0)
  const [full, setFull] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    ref.current?.play().catch(() => {})
  }, [i])

  const v = videos[i]
  if (!v) return <p className="wrap text-mute">Add videos to public/videos/</p>

  return (
    <>
      {/* Always visible: either half or full screen, never closed */}
      <div
        className={`sticky top-14 z-30 flex flex-col bg-[#0e0e0e] text-[#eee] transition-[height] duration-500 ${
          full ? 'h-[calc(100svh-3.5rem)]' : 'h-[46svh] lg:flex-row'
        }`}
      >
        <video
          ref={ref}
          src={v.src}
          controls
          playsInline
          className="min-h-0 w-full max-w-none flex-1 bg-black"
          onEnded={() => videos.length > 1 && setI((i + 1) % videos.length)}
        />
        {!full && (
          <div className="flex max-h-[16svh] flex-col gap-1 overflow-auto p-4 lg:max-h-none lg:w-85 lg:p-8">
            <h3 className="text-3xl capitalize">{v.title}</h3>
            <p className="meta">{fmt(v.date)}{v.software && ` · ${v.software}`}</p>
            {v.description && <p className="text-sm">{v.description}</p>}
          </div>
        )}
        <button
          onClick={() => setFull(!full)}
          className="btn absolute right-3 top-3 border-white/50 bg-black/50 text-white backdrop-blur hover:bg-white hover:text-black"
        >
          {full ? 'Minimise' : 'Expand'}
        </button>
      </div>

      <div className="wrap grid gap-2">
        {videos.map((x, k) => (
          <button
            key={x.src}
            onClick={() => setI(k)}
            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-2 text-left transition hover:bg-white/60 ${
              k === i ? 'border-line bg-white/60' : 'border-transparent'
            }`}
          >
            <video src={x.src + '#t=0.5'} preload="metadata" muted playsInline className="aspect-[16/10] w-36 flex-none rounded-lg bg-black object-cover" />
            <span className="flex flex-col">
              <b className="font-medium capitalize">{x.title}</b>
              <small className="text-mute">{x.description || fmt(x.date)}</small>
            </span>
          </button>
        ))}
      </div>
    </>
  )
}