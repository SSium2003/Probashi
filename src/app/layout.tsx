import './globals.css'   // Tailwind imports
import { ReactNode } from 'react'

export const metadata = {
  title: 'Probashi',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        {children}
      </body>
    </html>
  )
}
