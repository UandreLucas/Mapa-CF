import { PageHeader } from '@/components/admin/PageHeader'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { getAllFeatures, getNeighborhoods } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function NewPropertyPage() {
  const [features, neighborhoods] = await Promise.all([
    getAllFeatures(),
    getNeighborhoods(false),
  ])

  return (
    <>
      <PageHeader
        title="Novo imóvel"
        description="Preencha as informações para cadastrar um novo imóvel."
      />
      <PropertyForm features={features} neighborhoods={neighborhoods} />
    </>
  )
}
