import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { Button } from '@/components/ui/button'
import { getAllFeatures, getNeighborhoods } from '@/lib/queries'
import { getAdminPropertyById } from '@/lib/admin-queries'
import type { PropertyImage } from '@/types'

export const dynamic = 'force-dynamic'

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string }
}) {
  const [property, features, neighborhoods] = await Promise.all([
    getAdminPropertyById(params.id),
    getAllFeatures(),
    getNeighborhoods(false),
  ])

  if (!property) notFound()

  const initialData = {
    id: property.id,
    title: property.title,
    code: property.code,
    purpose: property.purpose,
    type: property.type,
    status: property.status,
    city: property.city,
    state: property.state,
    neighborhood: property.neighborhood,
    neighborhood_id: property.neighborhood_id,
    address: property.address,
    number: property.number,
    complement: property.complement,
    zip_code: property.zip_code,
    hide_address: property.hide_address,
    price: property.price,
    hide_price: property.hide_price,
    condo_fee: property.condo_fee,
    iptu: property.iptu,
    private_area: property.private_area,
    total_area: property.total_area,
    bedrooms: property.bedrooms,
    suites: property.suites,
    bathrooms: property.bathrooms,
    parking: property.parking,
    year_built: property.year_built,
    description: property.description,
    video_url: property.video_url ?? '',
    virtual_tour_url: property.virtual_tour_url ?? '',
    is_featured: property.is_featured,
    is_luxury: property.is_luxury,
    is_launch: property.is_launch,
    is_furnished: property.is_furnished,
    accepts_pets: property.accepts_pets,
    seo_title: property.seo_title,
    seo_description: property.seo_description,
    features: property.feature_ids,
    images: (property.images as PropertyImage[])
      .sort((a, b) => a.display_order - b.display_order)
      .map((img) => ({
        url: img.url,
        alt: img.alt,
        is_cover: img.is_cover,
        display_order: img.display_order,
      })),
  }

  return (
    <>
      <PageHeader
        title="Editar imóvel"
        description={`${property.title} · ${property.code}`}
        action={
          <Button asChild variant="outline">
            <Link href={`/imoveis/${property.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
              Ver no site
            </Link>
          </Button>
        }
      />
      <PropertyForm
        features={features}
        neighborhoods={neighborhoods}
        initialData={initialData}
      />
    </>
  )
}
