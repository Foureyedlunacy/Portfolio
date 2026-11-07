'use client'
import { useRef, useState, type PointerEvent, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Material } from 'three'
import { Scene, VIEWS } from './Model3D'

type Split = [number, number]

// Renders the same scene 3 times, each clipped to its own screen region
function Splitter({ split }: { split: RefObject<Split> }) {
  useFrame(({ gl, scene, camera, size: { width: w, height: h } }) => {
    const [a, b] = split.current.map((p) => p * w)
    const parts: [number, number, Material | null][] = [
      [0, a, VIEWS.wire],
      [a, b - a, VIEWS.clay],
      [b, w - b, VIEWS.full],
    ]
    gl.setScissorTest(true)
    for (const [x, cw, m] of parts) {
      gl.setScissor(x, 0, cw, h)
      scene.overrideMaterial = m
      gl.render(scene, camera)
    }
    scene.overrideMaterial = null
    gl.setScissorTest(false)
  }, 1)
  return null
}

export default function Compare({ src }: { src: string }) {
  const [s, setS] = useState<Split>([0.33, 0.66])
  const split = useRef<Split>(s)
  const box = useRef<HTMLDivElement>(null)

  const move = (i: 0 | 1) => (e: PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId) || !box.current) return
    const r = box.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const n: Split = [...split.current]
    n[i] = i ? Math.max(n[0] + 0.06, Math.min(0.98, x)) : Math.max(0.02, Math.min(n[1] - 0.06, x))
    split.current = n
    setS(n)
  }

  return (
    <div ref={box} className="relative h-[min(70svh,620px)] overflow-hidden rounded-3xl bg-[#ebe8e2]">
      <Canvas camera={{ position: [3, 2, 5], fov: 40 }} dpr={[1, 2]}>
        <Scene src={src} spin />
        <Splitter split={split} />
      </Canvas>

      {([0, 1] as const).map((i) => (
        <div
          key={i}
          className="absolute inset-y-0 -ml-4 w-8 cursor-ew-resize touch-none"
          style={{ left: s[i] * 100 + '%' }}
          onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
          onPointerMove={move(i)}
        >
          <span className="absolute inset-y-0 left-1/2 w-px bg-ink" />
          <span className="absolute left-1/2 top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-xs text-paper">↔</span>
        </div>
      ))}

      {['Wireframe', 'Clay', 'Textured'].map((t, k) => (
        <small
          key={t}
          className="pointer-events-none absolute bottom-3 pl-3 text-[10px] uppercase tracking-widest text-mute"
          style={{ left: (k ? s[k - 1] * 100 : 0) + '%' }}
        >
          {t}
        </small>
      ))}
    </div>
  )
}