import { PageHeader } from '@/components/admin/PageHeader'
import { DevelopmentsManager } from '@/components/admin/DevelopmentsManager'
import { getAdminDevelopments } from '@/lib/admin-queries'

export const dynamic = 'force-dynamic'

export default async function AdminEmpreendimentosPage() {
  const developments = await getAdminDevelopments()

  return (
    <>
      <PageHeader
        title="Empreendimentos"
        description="Lançamentos e obras com página própria no site."
      />
      <DevelopmentsManager developments={developments} />
    </>
  )
}
