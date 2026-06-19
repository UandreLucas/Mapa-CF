import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { WhatsAppButton } from '@/components/public/WhatsAppButton'
import { getSettings } from '@/lib/settings'
import { getNeighborhoods } from '@/lib/queries'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, neighborhoods] = await Promise.all([
    getSettings(),
    getNeighborhoods(),
  ])

  return (
    <>
      <Header settings={settings} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} neighborhoods={neighborhoods} />
      <WhatsAppButton
        phone={settings.broker_whatsapp}
        message={settings.whatsapp_default_message}
      />
    </>
  )
}
