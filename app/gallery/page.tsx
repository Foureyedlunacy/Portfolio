import Gallery from '@/components/Gallery'
import { getContent } from '@/lib/content'

export const metadata = { title: 'Gallery — Gyanshu Kushwaha' }
export default function Page() {
  return <Gallery groups={getContent().groups} />
}