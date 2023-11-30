import type { Metadata } from 'next'
import { Marcellus, Nunito_Sans } from 'next/font/google'
import './globals.css'

const marcellus = Marcellus({ weight: '400', variable: '--font-marcellus', subsets: ['latin'] })
const nunito = Nunito_Sans({ variable: '--font-nunito', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fawn Protocol',
  description: 'Solar-Powered Bitcoin Mining Solutions',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${marcellus.variable} ${nunito.variable} max-w-[100vw] overflow-x-hidden relative`}>
        {children}
      </body>
    </html>
  )
}
