import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const sans = Inter({ subsets: ['latin'], variable: '--f-sans' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--f-serif' })

export const metadata: Metadata = {
  title: 'Gyanshu Kushwaha — Portfolio',
  description: 'Artwork, motion and 3D by Gyanshu Kushwaha.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}