import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  BedDouble,
  Bath,
  Car,
  Maximize,
  MapPin,
  Calendar,
  Sofa,
  PawPrint,
  Ruler,
  Building2,
  CheckCircle2,
  Hash,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PropertyGallery } from '@/components/public/PropertyGallery'
import { PropertyContactCard } from '@/components/public/PropertyContactCard'
import { PropertySection } from '@/components/public/PropertySection'
import { DEFAULT_SETTINGS } from '@/types'
import {
  formatArea,
  formatCurrency,
  getPropertyTypeLabel,
  absoluteUrl,
} from '@/lib/utils'
import type { PropertyFull, SiteSettings } from '@/types'

export const revalidate = 300
export const dynamic = 'force-dynamic'

async function fetchProperty(slug: string): Promise<PropertyFull | null> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const { data, error } = await supabase
      .from('properties')
      .select('*, images:property_images(*)')
      .eq('slug', slug)
      .is('deleted_at', null)
      .order('display_order', { referencedTable: 'property_images', ascending: true })
      .maybeSingle()

    if (error || !data) return null

    // Ensure images are sorted by display_order (defensive)
    if (Array.isArray(data.images)) {
      data.images.sort(
        (a: { display_order: number }, b: { display_order: number }) =>
          (a.display_order ?? 0) - (b.display_order ?? 0)
      )
    }

    // Separate features query
    let features: { id: string; name: string; category: string | null; icon: string | null }[] = []
    try {
      const { data: pfRows } = await supabase
        .from('property_features')
        .select('feature_id')
        .eq('property_id', data.id)

      if (pfRows && pfRows.length > 0) {
        const ids = pfRows.map((r: { feature_id: string }) => r.feature_id)
        const { data: featData } = await supabase
          .from('features')
          .select('*')
          .in('id', ids)
        features = featData ?? []
      }
    } catch {
      // non-critical
    }

    return { ...(data as unknown as PropertyFull), features }
  } catch {
    return null
  }
}

async function fetchSettings(): Promise<SiteSettings> {
  try {
    const { getSettings } = await import('@/lib/settings')
    return await getSettings()
  } catch {
    return DEFAULT_SETTINGS
  }
}

async function fetchRelated(property: PropertyFull, limit = 3): Promise<PropertyFull[]> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()
    const { data } = await supabase
      .from('properties')
      .select('*, images:property_images(*)')
      .eq('status', 'published')
      .is('deleted_at', null)
      .eq('neighborhood', property.neighborhood)
      .neq('id', property.id)
      .limit(limit)
    return (data ?? []).map((p) => ({ ...(p as unknown as PropertyFull), features: [] }))
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()
    const { data } = await supabase
      .from('properties')
      .select('slug')
      .eq('status', 'published')
      .is('deleted_at', null)
    return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const property = await fetchProperty(params.slug)
  if (!property) return { title: 'Imóvel não encontrado' }
  const cover =
    property.images?.find((i) => i.is_cover)?.url || property.images?.[0]?.url
  return {
    title: property.seo_title || property.title,
    description:
      property.seo_description ||
      `${getPropertyTypeLabel(property.type)} em ${property.neighborhood}, ${property.city}.`,
    openGraph: {
      title: property.title,
      description: property.seo_description || property.description || '',
      images: cover ? [{ url: cover }] : [],
    },
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const property = await fetchProperty(params.slug)
  if (!property) notFound()

  const [settings, related] = await Promise.all([
    fetchSettings(),
    fetchRelated(property),
  ])

  const specs = [
    property.bedrooms > 0 && { icon: BedDouble, label: 'Quartos', value: property.bedrooms },
    property.suites > 0 && { icon: BedDouble, label: 'Suítes', value: property.suites },
    property.bathrooms > 0 && { icon: Bath, label: 'Banheiros', value: property.bathrooms },
    property.parking > 0 && { icon: Car, label: 'Vagas', value: property.parking },
    property.total_area && { icon: Maximize, label: 'Área total', value: formatArea(property.total_area) },
    property.private_area && { icon: Ruler, label: 'Área privativa', value: formatArea(property.private_area) },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string; value: string | number }[]

  const purposeLabel =
    property.purpose === 'rent' ? 'Para alugar' :
    property.purpose === 'both' ? 'Venda ou aluguel' : 'À venda'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: absoluteUrl(`/imoveis/${property.slug}`),
    image: property.images?.map((i) => i.url) ?? [],
    ...(property.price && !property.hide_price
      ? { offers: { '@type': 'Offer', price: property.price, priceCurrency: 'BRL' } }
      : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressRegion: property.state,
      streetAddress: property.hide_address ? undefined : property.address,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-secondary/30 pt-24">
        <div className="container-wide py-6">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="gold">{purposeLabel}</Badge>
            {property.is_luxury && <Badge variant="luxury">Alto Padrão</Badge>}
            {property.is_launch && <Badge variant="secondary">Lançamento</Badge>}
            <span className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground">
              <Hash className="h-3.5 w-3.5" />
              {property.code}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium leading-tight text-brand-navy md:text-4xl">
            {property.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4 text-brand-gold" />
            {property.neighborhood}, {property.city} - {property.state}
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        <PropertyGallery images={property.images ?? []} title={property.title} />
      </div>

      <div className="container-wide pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-3">
              {specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy/5 text-brand-gold">
                    <spec.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-brand-navy">{spec.value}</p>
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {property.description && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-medium text-brand-navy">Sobre o imóvel</h2>
                <Separator className="my-4" />
                <div className="prose prose-neutral max-w-none whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                  {property.description}
                </div>
              </div>
            )}

            <div className="mt-10">
              <h2 className="font-serif text-2xl font-medium text-brand-navy">Detalhes</h2>
              <Separator className="my-4" />
              <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                <DetailRow icon={Building2} label="Tipo" value={getPropertyTypeLabel(property.type)} />
                {property.year_built && (
                  <DetailRow icon={Calendar} label="Ano de construção" value={String(property.year_built)} />
                )}
                {property.condo_fee ? (
                  <DetailRow icon={Building2} label="Condomínio" value={formatCurrency(property.condo_fee)} />
                ) : null}
                {property.iptu ? (
                  <DetailRow icon={Hash} label="IPTU (anual)" value={formatCurrency(property.iptu)} />
                ) : null}
                <DetailRow icon={Sofa} label="Mobiliado" value={property.is_furnished ? 'Sim' : 'Não'} />
                <DetailRow icon={PawPrint} label="Aceita pets" value={property.accepts_pets ? 'Sim' : 'Não'} />
              </dl>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-medium text-brand-navy">
                  Características e lazer
                </h2>
                <Separator className="my-4" />
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {property.features.map((feature) => (
                    <li key={feature.id} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                      {feature.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {property.video_url && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-medium text-brand-navy">Vídeo</h2>
                <Separator className="my-4" />
                <div className="aspect-video overflow-hidden rounded-xl">
                  <iframe
                    src={toEmbedUrl(property.video_url)}
                    title={property.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {!property.hide_address && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-medium text-brand-navy">Localização</h2>
                <Separator className="my-4" />
                <p className="mb-4 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-brand-gold" />
                  {[property.address, property.number, property.neighborhood, property.city]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                <div className="aspect-[16/9] overflow-hidden rounded-xl border border-border">
                  <iframe
                    title="Mapa"
                    className="h-full w-full"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      `${property.neighborhood}, ${property.city}, ${property.state}`
                    )}&output=embed`}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <PropertyContactCard property={property} settings={settings} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <PropertySection
          eyebrow="Você também pode gostar"
          title={`Outros imóveis em ${property.neighborhood}`}
          properties={related}
          className="bg-secondary/30"
        />
      )}

      <div className="container-wide pb-8 text-center text-xs text-muted-foreground">
        Preços e disponibilidade sujeitos a alterações sem aviso prévio.
      </div>
    </>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BedDouble
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-brand-gold" />
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

function toEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  // Google Drive: drive.google.com/file/d/FILE_ID/view  ->  /preview
  const driveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/)
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  return url
}
