import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Building2, MapPin, CalendarClock, ArrowRight } from 'lucide-react'
import { getDevelopments } from '@/lib/queries'
import { SectionHeading } from '@/components/public/SectionHeading'
import { Button } from '@/components/ui/button'
import { formatCurrency, getDevelopmentStageLabel, cn } from '@/lib/utils'

export const revalidate = 600
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Empreendimentos em João Pessoa',
  description:
    'Lançamentos e empreendimentos selecionados em João Pessoa. Conheça as plantas, o lazer e as condições de cada projeto com Eduardo Vieira.',
}

const STAGE_STYLES: Record<string, string> = {
  launch: 'bg-brand-gold text-brand-navy',
  construction: 'bg-brand-navy text-white',
  ready: 'bg-emerald-600 text-white',
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'

export default async function EmpreendimentosPage() {
  const developments = await getDevelopments()

  return (
    <>
      <div className="bg-brand-navy pb-12 pt-32">
        <div className="container-wide">
          <p className="eyebrow mb-3 text-brand-gold-light">Empreendimentos</p>
          <h1 className="font-serif text-3xl font-medium text-white md:text-5xl">
            Projetos que valem a espera
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Lançamentos e obras em andamento nos melhores endereços de João
            Pessoa. Plantas, lazer e condições de compra reunidos em um só lugar.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide">
          {developments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-12 text-center">
              <Building2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <h2 className="font-serif text-xl font-medium text-brand-navy">
                Nenhum empreendimento publicado ainda
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Em breve novos projetos por aqui. Enquanto isso, conheça os
                imóveis disponíveis.
              </p>
              <Button asChild variant="gold" className="mt-6">
                <Link href="/imoveis">Ver imóveis</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {developments.map((dev, i) => {
                const cover = dev.cover_image_url || FALLBACK_IMAGE
                const unitCount = dev.units?.length ?? 0

                return (
                  <Link
                    key={dev.id}
                    href={`/empreendimentos/${dev.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <Image
                        src={cover}
                        alt={dev.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={i < 2}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 to-transparent" />

                      <span
                        className={cn(
                          'absolute left-4 top-4 rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wider',
                          STAGE_STYLES[dev.stage] ?? STAGE_STYLES.launch
                        )}
                      >
                        {getDevelopmentStageLabel(dev.stage)}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <h2 className="font-serif text-2xl font-medium leading-tight">
                          {dev.name}
                        </h2>
                        {dev.neighborhood && (
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
                            <MapPin className="h-3.5 w-3.5 text-brand-gold-light" />
                            {dev.neighborhood}, {dev.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      {dev.tagline && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {dev.tagline}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        {unitCount > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-brand-gold" />
                            {unitCount} {unitCount === 1 ? 'planta' : 'plantas'}
                          </span>
                        )}
                        {dev.delivery_date && (
                          <span className="flex items-center gap-1.5">
                            <CalendarClock className="h-3.5 w-3.5 text-brand-gold" />
                            Entrega {dev.delivery_date}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
                        <div>
                          {dev.price_from ? (
                            <>
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                A partir de
                              </p>
                              <p className="text-xl font-semibold text-brand-navy">
                                {formatCurrency(dev.price_from)}
                              </p>
                            </>
                          ) : (
                            <p className="text-lg font-semibold text-brand-navy">
                              Valores sob consulta
                            </p>
                          )}
                        </div>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-brand-gold transition-transform group-hover:translate-x-1">
                          Conhecer
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="container-wide text-center">
          <SectionHeading
            eyebrow="Não encontrou o que procura?"
            title="Posso buscar o projeto certo para você"
            align="center"
          />
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Trabalho com lançamentos de diversas incorporadoras de João Pessoa.
            Me diga o que procura e eu apresento as opções que fazem sentido.
          </p>
          <Button asChild variant="gold" size="xl" className="mt-8">
            <Link href="/contato">Falar com Eduardo</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
