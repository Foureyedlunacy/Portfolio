import VideoGallery from '@/components/VideoGallery'
import { getContent } from '@/lib/content'

export const metadata = { title: 'Videos — Gyanshu Kushwaha' }
export default function Page() {
  return <VideoGallery videos={getContent().videos} />
}