import { PageHeader } from '@/components/admin/PageHeader'
import { NeighborhoodsManager } from '@/components/admin/NeighborhoodsManager'
import { getAdminNeighborhoods } from '@/lib/admin-queries'

export const dynamic = 'force-dynamic'

export default async function AdminBairrosPage() {
  const neighborhoods = await getAdminNeighborhoods()

  return (
    <>
      <PageHeader
        title="Bairros"
        description="Gerencie os bairros exibidos no site e sua ordem de destaque."
      />
      <NeighborhoodsManager neighborhoods={neighborhoods} />
    </>
  )
}
