import fs from 'fs'
import path from 'path'
import type { Item } from './types'

const ROOT = process.cwd()
const PUB = path.join(ROOT, 'public')
const metaFile = path.join(ROOT, 'content', 'meta.json')
const META: Record<string, Partial<Item>> = fs.existsSync(metaFile)
  ? JSON.parse(fs.readFileSync(metaFile, 'utf8'))
  : {}

const EXT = {
  photos: /\.(jpe?g|png|webp|gif|avif)$/i,
  videos: /\.(mp4|webm|mov|m4v)$/i,
  models: /\.(gltf|glb)$/i,
}

const walk = (d: string): string[] =>
  fs.existsSync(d)
    ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(d, e.name)
        return e.isDirectory() ? walk(p) : [p]
      })
    : []

function scan(kind: keyof typeof EXT): Item[] {
  return walk(path.join(PUB, kind))
    .filter((f) => EXT[kind].test(f))
    .sort()
    .map((file) => {
      const rel = path.relative(PUB, file).split(path.sep) // ['photos','digital','a.png']
      const m = META[rel.join('/')] ?? {}
      const base = path.basename(file, path.extname(file))
      return {
        id: base.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        src: '/' + rel.map(encodeURIComponent).join('/'),
        group: rel.length > 2 ? rel[1] : 'other',
        title: m.title ?? base.replace(/[-_]+/g, ' '),
        date: m.date ?? fs.statSync(file).mtime.toISOString(),
        software: m.software ?? '',
        skills: m.skills ?? '',
        description: m.description ?? '',
        model: m.model ?? '',
      }
    })
}

export function getContent() {
  const photos = scan('photos')
  const groups = [...new Set(photos.map((p) => p.group))]
    .sort()
    .map((name) => ({ name, items: photos.filter((p) => p.group === name) }))
  return { photos, groups, videos: scan('videos'), models: scan('models') }
}