import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/css/globals.css'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import { AppContext, AppProvider } from '@/context/AppContext'
import '@/app/css/globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Dote Timer',
  description: 'Productivity tracker app',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen overflow-hidden bg-[#f8f9fa]`}
      >
        <AppProvider>
          <Sidebar />

          <div className='flex-1 flex flex-col min-w-0'>
            <Navbar />

            <main className='flex-1 overflow-y-auto'>{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
