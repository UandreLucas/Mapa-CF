import { Suspense } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { LeadsTable } from '@/components/admin/LeadsTable'
import { LeadsFilterBar } from '@/components/admin/LeadsFilterBar'
import { getAdminLeads } from '@/lib/admin-queries'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string }
}) {
  const leads = await getAdminLeads({
    status: searchParams.status,
    type: searchParams.type,
  })

  return (
    <>
      <PageHeader
        title="Leads"
        description={`${leads.length} ${
          leads.length === 1 ? 'contato' : 'contatos'
        } recebidos.`}
      />

      <Suspense fallback={null}>
        <LeadsFilterBar />
      </Suspense>

      <LeadsTable leads={leads} />
    </>
  )
}
