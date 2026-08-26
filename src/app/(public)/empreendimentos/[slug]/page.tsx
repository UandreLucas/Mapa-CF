import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { LucideIcon } from 'lucide-react'
import {
  MapPin,
  CalendarClock,
  Building2,
  BedDouble,
  Car,
  Maximize,
  Bath,
  Waves,
  Dumbbell,
  Trees,
  Wifi,
  ShieldCheck,
  Sparkles,
  Users,
  Sun,
  Coffee,
  PartyPopper,
  Baby,
  Star,
  TrendingUp,
} from 'lucide-react'
import { getDevelopmentBySlug, getDevelopments } from '@/lib/queries'
import { getSettings } from '@/lib/settings'
import { DevelopmentGallery } from '@/components/public/DevelopmentGallery'
import { DevelopmentLeadForm } from '@/components/public/DevelopmentLeadForm'
import { SectionHeading } from '@/components/public/SectionHeading'
import { Button } from '@/components/ui/button'
import {
  formatCurrency,
  formatArea,
  getDevelopmentStageLabel,
  absoluteUrl,
  cn,
} from '@/lib/utils'

export const revalidate = 300
export const dynamic = 'force-dynamic'

const ICON_MAP: Record<string, LucideIcon> = {
  Waves, Dumbbell, Trees, Wifi, ShieldCheck, Sparkles, Users, Sun, Coffee,
  PartyPopper, Baby, Star, TrendingUp, Building2, BedDouble, Car, Maximize, Bath,
}

const STAGE_STYLES: Record<string, string> = {
  launch: 'bg-brand-gold text-brand-navy',
  construction: 'bg-white text-brand-navy',
  ready: 'bg-emerald-600 text-white',
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80'

export async function generateStaticParams() {
  try {
    const developments = await getDevelopments()
    return developments.map((d) => ({ slug: d.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const dev = await getDevelopmentBySlug(params.slug)
  if (!dev) return { title: 'Empreendimento não encontrado' }

  const title = dev.seo_title || `${dev.name} — ${dev.neighborhood ?? 'João Pessoa'}`
  const description =
    dev.seo_description ||
    dev.tagline ||
    `Conheça o ${dev.name}, empreendimento em ${dev.neighborhood ?? 'João Pessoa'}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: dev.cover_image_url ? [dev.cover_image_url] : [],
      url: absoluteUrl(`/empreendimentos/${dev.slug}`),
    },
  }
}

export default async function DevelopmentPage({
  params,
}: {
  params: { slug: string }
}) {
  const dev = await getDevelopmentBySlug(params.slug)
  if (!dev || !dev.is_published) notFound()

  const settings = await getSettings()
  const cover = dev.cover_image_url || FALLBACK_IMAGE
  const units = dev.units ?? []
  const amenities = dev.amenities ?? []
  const differentials = dev.differentials ?? []
  const images = dev.images ?? []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    name: dev.name,
    description: dev.description ?? dev.tagline ?? undefined,
    url: absoluteUrl(`/empreendimentos/${dev.slug}`),
    image: cover,
    address: {
      '@type': 'PostalAddress',
      streetAddress: dev.address ?? undefined,
      addressLocality: dev.city ?? undefined,
      addressRegion: dev.state ?? undefined,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden">
        <Image
          src={cover}
          alt={dev.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/30" />

        <div className="container-wide relative z-10 pb-16 pt-32">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'rounded px-3 py-1 text-xs font-semibold uppercase tracking-wider',
                STAGE_STYLES[dev.stage] ?? STAGE_STYLES.launch
              )}
            >
              {getDevelopmentStageLabel(dev.stage)}
            </span>
            {dev.developer && (
              <span className="text-sm text-white/70">
                por <strong className="font-medium text-white">{dev.developer}</strong>
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-medium leading-tight text-white md:text-6xl">
            {dev.name}
          </h1>

          {dev.tagline && (
            <p className="mt-4 max-w-2xl text-lg text-white/80">{dev.tagline}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            {dev.neighborhood && (
              <span className="flex items-center gap-2 text-white/85">
                <MapPin className="h-5 w-5 text-brand-gold-light" />
                {dev.neighborhood}, {dev.city}
              </span>
            )}
            {dev.delivery_date && (
              <span className="flex items-center gap-2 text-white/85">
                <CalendarClock className="h-5 w-5 text-brand-gold-light" />
                Entrega em {dev.delivery_date}
              </span>
            )}
            {dev.price_from ? (
              <span className="text-white">
                <span className="block text-xs uppercase tracking-wide text-white/60">
                  A partir de
                </span>
                <span className="font-serif text-2xl font-medium text-brand-gold-light">
                  {formatCurrency(dev.price_from)}
                </span>
              </span>
            ) : null}
          </div>

          <Button asChild variant="gold" size="xl" className="mt-8">
            <Link href="#interesse">Quero conhecer</Link>
          </Button>
        </div>
      </section>

      {/* ── Sobre + diferenciais ── */}
      {(dev.description || differentials.length > 0) && (
        <section className="section-padding">
          <div className="container-wide grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            {dev.description && (
              <div>
                <SectionHeading eyebrow="O projeto" title={`Sobre o ${dev.name}`} />
                <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
                  {dev.description.split('\n').filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {differentials.length > 0 && (
              <div className="space-y-6 lg:pt-16">
                {differentials.map((d, i) => {
                  const Icon = ICON_MAP[d.icon] ?? Sparkles
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-medium text-brand-navy">
                          {d.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {d.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Plantas ── */}
      {units.length > 0 && (
        <section className="bg-secondary/40 py-16 md:py-24">
          <div className="container-wide">
            <SectionHeading
              eyebrow="Opções"
              title="Escolha a planta que combina com você"
              description="Metragens e configurações disponíveis neste empreendimento."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {units.map((u, i) => (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                >
                  {u.image && (
                    <div className="relative aspect-[4/3] w-full bg-white">
                      <Image
                        src={u.image}
                        alt={u.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-4"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-xl font-medium text-brand-navy">
                      {u.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      {u.area ? (
                        <span className="flex items-center gap-1.5">
                          <Maximize className="h-4 w-4" />
                          {formatArea(u.area)}
                        </span>
                      ) : null}
                      {u.bedrooms ? (
                        <span className="flex items-center gap-1.5">
                          <BedDouble className="h-4 w-4" />
                          {u.bedrooms}
                          {u.suites ? ` (${u.suites} suíte${u.suites > 1 ? 's' : ''})` : ''}
                        </span>
                      ) : null}
                      {u.parking ? (
                        <span className="flex items-center gap-1.5">
                          <Car className="h-4 w-4" />
                          {u.parking}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-auto border-t border-border pt-4">
                      {u.price_from ? (
                        <>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            A partir de
                          </p>
                          <p className="text-lg font-semibold text-brand-navy">
                            {formatCurrency(u.price_from)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-brand-navy">
                          Valor sob consulta
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              Valores e disponibilidade sujeitos a alteração sem aviso prévio.
              Imagens meramente ilustrativas.
            </p>
          </div>
        </section>
      )}

      {/* ── Lazer ── */}
      {amenities.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <SectionHeading
              eyebrow="Estrutura"
              title="Lazer completo, dentro de casa"
            />
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {amenities.map((a, i) => {
                const Icon = ICON_MAP[a.icon] ?? Sparkles
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-brand-gold" />
                    <span className="text-sm font-medium text-foreground">
                      {a.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Galeria + vídeo ── */}
      {(images.length > 0 || dev.video_url) && (
        <section className="bg-secondary/40 py-16 md:py-24">
          <div className="container-wide">
            <SectionHeading eyebrow="Galeria" title="Veja de perto" />
            <div className="mt-10">
              <DevelopmentGallery
                images={images}
                videoUrl={dev.video_url}
                title={dev.name}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Público ideal + localização ── */}
      {(dev.target_audience || dev.map_embed_url) && (
        <section className="section-padding">
          <div className="container-wide grid gap-12 lg:grid-cols-2 lg:gap-16">
            {dev.target_audience && (
              <div>
                <SectionHeading eyebrow="Para quem é" title="O público ideal" />
                <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
                  {dev.target_audience.split('\n').filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {dev.map_embed_url && (
              <div>
                <SectionHeading eyebrow="Localização" title="Onde fica" />
                {dev.address && (
                  <p className="mt-4 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-brand-gold" />
                    {dev.address}
                  </p>
                )}
                <div className="mt-6 aspect-[4/3] overflow-hidden rounded-xl border border-border">
                  <iframe
                    src={dev.map_embed_url}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Localização do ${dev.name}`}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Formulário de interesse ── */}
      <section id="interesse" className="bg-brand-navy py-16 md:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-3 text-brand-gold-light">Interesse</p>
            <h2 className="font-serif text-3xl font-medium text-white md:text-4xl">
              Quer conhecer o {dev.name}?
            </h2>
            <p className="mt-4 max-w-lg text-white/70">
              Me diga o que procura e eu retorno com as unidades disponíveis, as
              condições de pagamento e a tabela atualizada.
            </p>
            {settings.company_phone && (
              <p className="mt-6 text-sm text-white/60">
                Prefere falar direto? {settings.company_phone}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-card p-6 shadow-lg md:p-8">
            <DevelopmentLeadForm
              developmentId={dev.id}
              developmentName={dev.name}
            />
          </div>
        </div>
      </section>
    </>
  )
}
