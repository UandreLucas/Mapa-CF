import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { getSettings } from '@/lib/settings'
import { getSiteUrl } from '@/lib/site-url'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const siteUrl = getSiteUrl()

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seo_title,
      template: `%s | ${settings.company_name}`,
    },
    description: settings.seo_description,
    keywords: [
      'imóveis João Pessoa',
      'alto padrão',
      'apartamentos de luxo',
      'casas Altiplano',
      'imóveis Cabo Branco',
      'Eduardo Vieira',
      'imobiliária Paraíba',
    ],
    authors: [{ name: settings.broker_name }],
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: siteUrl,
      title: settings.seo_title,
      description: settings.seo_description,
      siteName: settings.company_name,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.seo_title,
      description: settings.seo_description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#1A1A2E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
