'use client'
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { GizmoHelper, GizmoViewport } from '@react-three/drei'
import { Mode, Scene, type ViewMode } from './Model3D'
import { fmt } from '@/lib/profile'
import type { Item } from '@/lib/types'

const MODES: [ViewMode, string][] = [['wire', 'Wireframe'], ['clay', 'Clay'], ['full', 'Textured']]

function Seg({ items, active, onPick }: { items: [string, string][]; active: string; onPick: (k: string) => void }) {
  return (
    <div className="inline-flex flex-wrap rounded-3xl border border-line p-1">
      {items.map(([k, l]) => (
        <button
          key={k}
          onClick={() => onPick(k)}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition ${k === active ? 'bg-ink text-paper' : ''}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function ModelGallery({ models }: { models: Item[] }) {
  const [i, setI] = useState(0)
  const [mode, setMode] = useState<ViewMode>('full')

  useEffect(() => {
    const h = () => {
      const k = models.findIndex((m) => m.id === location.hash.slice(1))
      if (k >= 0) setI(k)
    }
    h()
    addEventListener('hashchange', h)
    return () => removeEventListener('hashchange', h)
  }, [models])

  const m = models[i]
  if (!m) return <p className="wrap text-mute">Add .gltf / .glb files to public/models/</p>

  return (
    <div className="wrap grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">
      <div className="h-[min(70svh,640px)] overflow-hidden rounded-3xl bg-[#ebe8e2]">
        <Canvas camera={{ position: [3, 2, 5], fov: 40 }} dpr={[1, 2]}>
          <Scene key={m.src} src={m.src} />
          <Mode mode={mode} />
          <GizmoHelper alignment="bottom-right" margin={[64, 64]}>
            <GizmoViewport labelColor="#111" />
          </GizmoHelper>
        </Canvas>
      </div>

      <aside className="flex flex-col items-start gap-4">
        <h2 className="text-4xl capitalize">{m.title}</h2>
        <p className="meta">{fmt(m.date)}</p>
        {m.description && <p>{m.description}</p>}
        {m.software && <p className="meta">Software · {m.software}</p>}
        {m.skills && <p className="meta">Skills · {m.skills}</p>}

        <Seg items={MODES} active={mode} onPick={(k) => setMode(k as ViewMode)} />

        {models.length > 1 && (
          <Seg
            items={models.map((x, k) => [String(k), x.title])}
            active={String(i)}
            onPick={(k) => setI(Number(k))}
          />
        )}
      </aside>
    </div>
  )
}