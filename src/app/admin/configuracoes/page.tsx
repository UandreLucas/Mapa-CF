import { PageHeader } from '@/components/admin/PageHeader'
import { SettingsForm } from '@/components/admin/SettingsForm'
import { getAllSettings } from '@/lib/admin-queries'

export const dynamic = 'force-dynamic'

export default async function ConfiguracoesPage() {
  const settings = await getAllSettings()

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Gerencie os dados de contato, redes sociais e SEO exibidos no site."
      />
      <div className="max-w-3xl">
        <SettingsForm settings={settings} />
      </div>
    </>
  )
}
