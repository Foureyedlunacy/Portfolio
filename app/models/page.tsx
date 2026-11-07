import ModelGallery from '@/components/ModelGallery'
import { getContent } from '@/lib/content'

export const metadata = { title: '3D — Gyanshu Kushwaha' }
export default function Page() {
  return <ModelGallery models={getContent().models} />
}