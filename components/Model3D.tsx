'use client'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei'
import { Group, Material, MeshBasicMaterial, MeshStandardMaterial } from 'three'

export type ViewMode = 'wire' | 'clay' | 'full'

// null = the model's own textured materials
export const VIEWS: Record<ViewMode, Material | null> = {
  wire: new MeshBasicMaterial({ color: '#222222', wireframe: true }),
  clay: new MeshStandardMaterial({ color: '#d8d4cc', roughness: 0.85 }),
  full: null,
}

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src)
  const obj = useMemo(() => scene.clone(true), [scene])
  return <primitive object={obj} />
}

export function Scene({ src, spin = false }: { src: string; spin?: boolean }) {
  const g = useRef<Group>(null)
  useFrame((_, d) => {
    if (spin && g.current) g.current.rotation.y += d * 0.4
  })
  return (
    <>
      <hemisphereLight args={['#ffffff', '#8a857c', 1.4]} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <directionalLight position={[-5, 2, -4]} intensity={0.8} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.4}>
          <group ref={g}>
            <Center>
              <Model src={src} />
            </Center>
          </group>
        </Bounds>
      </Suspense>
      {!spin && <OrbitControls makeDefault enableDamping />}
    </>
  )
}

// Applies wireframe / clay / textured to the whole scene
export function Mode({ mode }: { mode: ViewMode }) {
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    scene.overrideMaterial = VIEWS[mode]
    return () => {
      scene.overrideMaterial = null
    }
  }, [mode, scene])
  return null
}