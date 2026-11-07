'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { fmt } from '@/lib/profile'
import type { Item } from '@/lib/types'

export default function Gallery({ groups }: { groups: { name: string; items: Item[] }[] }) {
  const [sel, setSel] = useState<Item | null>(null)

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setSel(null)
    addEventListener('keydown', k)
    document.body.style.overflow = sel ? 'hidden' : ''
    return () => {
      removeEventListener('keydown', k)
      document.body.style.overflow = ''
    }
  }, [sel])

  return (
    <div className="wrap">
      {groups.map((g) => (
        <section key={g.name}>
          <h2 className="rule">{g.name}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {g.items.map((p) => (
              <motion.img
                key={p.src}
                layoutId={p.src}
                src={p.src}
                alt={p.title}
                loading="lazy"
                decoding="async"
                onClick={() => setSel(p)}
                className="aspect-[4/5] w-full cursor-zoom-in rounded-xl bg-line object-cover transition-opacity hover:opacity-85"
              />
            ))}
          </div>
        </section>
      ))}
      {!groups.length && <p className="py-12 text-mute">Add images to public/photos/&lt;folder&gt;/</p>}

      <AnimatePresence>
        {sel && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-paper/50 backdrop-blur-xl"
            onClick={() => setSel(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="grid max-h-[90svh] w-[92vw] max-w-5xl gap-6 overflow-auto rounded-3xl border border-line bg-paper p-5 shadow-2xl md:grid-cols-[1fr_1.25fr] md:items-center md:p-10"
            >
              <div className="flex flex-col items-start gap-3">
                <button className="btn" onClick={() => setSel(null)}>← Back</button>
                <h3 className="text-4xl capitalize">{sel.title}</h3>
                <p className="meta">{fmt(sel.date)}</p>
                {sel.software && <p className="meta">Made with {sel.software}</p>}
                {sel.description && <p>{sel.description}</p>}
                {sel.model && (
                  <Link className="btn btn-solid" href={`/models#${sel.model}`}>View 3D model →</Link>
                )}
              </div>
              <motion.img
                layoutId={sel.src}
                src={sel.src}
                alt={sel.title}
                style={{ transformPerspective: 1400 }}
                initial={{ rotateY: 180, rotate: -10 }}
                animate={{ rotateY: 0, rotate: 0 }}
                exit={{ rotateY: -180, rotate: 10 }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                className="order-first max-h-[60svh] w-full rounded-xl object-contain md:order-last md:max-h-[78svh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}