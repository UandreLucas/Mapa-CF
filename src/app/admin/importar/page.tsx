import { PageHeader } from '@/components/admin/PageHeader'
import { ImportWizard } from '@/components/admin/ImportWizard'

export const dynamic = 'force-dynamic'

export default function ImportarPage() {
  return (
    <>
      <PageHeader
        title="Importar imóveis"
        description="Importe vários imóveis de uma vez a partir de uma planilha CSV ou XLSX."
      />
      <div className="max-w-4xl">
        <ImportWizard />
      </div>
    </>
  )
}
