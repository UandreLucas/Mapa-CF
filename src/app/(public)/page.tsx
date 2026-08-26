import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Hero } from '@/components/public/Hero'
import { PropertySection } from '@/components/public/PropertySection'
import { NeighborhoodCard } from '@/components/public/NeighborhoodCard'
import { SectionHeading } from '@/components/public/SectionHeading'
import { Differentials } from '@/components/public/Differentials'
import { BrokerSection } from '@/components/public/BrokerSection'
import { AdvertiseCTA } from '@/components/public/AdvertiseCTA'
import { Testimonials } from '@/components/public/Testimonials'
import { ContactForm } from '@/components/public/ContactForm'
import {
  getFeaturedProperties,
  getFeaturedDevelopments,
  getPropertiesBy,
  getPropertiesByPurpose,
  getRecentProperties,
  getNeighborhoodsWithCounts,
  getTestimonials,
} from '@/lib/queries'
import { getSettings } from '@/lib/settings'
import { formatCurrency, getDevelopmentStageLabel } from '@/lib/utils'

export const revalidate = 300

export default async function HomePage() {
  const [
    settings,
    featured,
    luxury,
    launches,
    forSale,
    forRent,
    recent,
    neighborhoods,
    testimonials,
    developments,
  ] = await Promise.all([
    getSettings(),
    getFeaturedProperties(8),
    getPropertiesBy('is_luxury', 4),
    getPropertiesBy('is_launch', 4),
    getPropertiesByPurpose('sale', 4),
    getPropertiesByPurpose('rent', 4),
    getRecentProperties(4),
    getNeighborhoodsWithCounts(),
    getTestimonials(),
    getFeaturedDevelopments(3),
  ])

  return (
    <>
      <Hero imageUrl={settings.hero_image} />

      <PropertySection
        eyebrow="Seleção do corretor"
        title="Imóveis em destaque"
        description="Uma curadoria dos imóveis mais desejados do momento, escolhidos pessoalmente para você."
        properties={featured}
        viewAllHref="/imoveis"
        viewAllLabel="Ver todos os imóveis"
      />

      {/* Neighborhoods */}
      <section className="section-padding bg-secondary/40">
        <div className="container-wide">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Onde viver"
              title="Os melhores bairros de João Pessoa"
              description="Conheça as regiões mais valorizadas da capital e encontre o endereço ideal para o seu estilo de vida."
            />
            <Link
              href="/bairros"
              className="group flex shrink-0 items-center gap-2 text-sm font-medium text-brand-navy transition-colors hover:text-brand-gold"
            >
              Ver todos os bairros
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {neighborhoods.slice(0, 8).map((n) => (
              <NeighborhoodCard key={n.id} neighborhood={n} />
            ))}
          </div>
        </div>
      </section>

      {developments.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Lançamentos"
                title="Empreendimentos selecionados"
                description="Projetos novos em João Pessoa, com plantas, lazer e condições especiais de lançamento."
              />
              <Link
                href="/empreendimentos"
                className="group flex shrink-0 items-center gap-2 text-sm font-medium text-brand-navy transition-colors hover:text-brand-gold"
              >
                Ver todos os empreendimentos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {developments.map((dev) => (
                <Link
                  key={dev.id}
                  href={`/empreendimentos/${dev.slug}`}
                  className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl"
                >
                  <Image
                    src={
                      dev.cover_image_url ||
                      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'
                    }
                    alt={dev.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="relative z-10 p-6 text-white">
                    <span className="rounded bg-brand-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-navy">
                      {getDevelopmentStageLabel(dev.stage)}
                    </span>
                    <h3 className="mt-3 font-serif text-2xl font-medium leading-tight">
                      {dev.name}
                    </h3>
                    {dev.neighborhood && (
                      <p className="mt-1 text-sm text-white/80">
                        {dev.neighborhood}, {dev.city}
                      </p>
                    )}
                    {dev.price_from ? (
                      <p className="mt-3 text-sm text-white/90">
                        A partir de{' '}
                        <strong className="font-semibold text-brand-gold-light">
                          {formatCurrency(dev.price_from)}
                        </strong>
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {luxury.length > 0 && (
        <PropertySection
          eyebrow="Coleção exclusiva"
          title="Alto padrão"
          description="Residências e coberturas que redefinem o conceito de viver bem."
          properties={luxury}
          viewAllHref="/imoveis?isLuxury=true"
          dark
        />
      )}

      <PropertySection
        eyebrow="Para comprar"
        title="Imóveis à venda"
        properties={forSale}
        viewAllHref="/imoveis?purpose=sale"
      />

      {launches.length > 0 && (
        <PropertySection
          eyebrow="Novidades"
          title="Lançamentos"
          description="Os empreendimentos mais aguardados de João Pessoa."
          properties={launches}
          viewAllHref="/imoveis?isLaunch=true"
        />
      )}

      <BrokerSection settings={settings} />

      <PropertySection
        eyebrow="Para alugar"
        title="Imóveis para locação"
        properties={forRent}
        viewAllHref="/imoveis?purpose=rent"
      />

      <Differentials />

      <PropertySection
        eyebrow="Recém-chegados"
        title="Adicionados recentemente"
        properties={recent}
        viewAllHref="/imoveis"
      />

      <AdvertiseCTA />

      <Testimonials testimonials={testimonials} />

      {/* Contact */}
      <section className="section-padding bg-background">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Fale conosco"
              title="Vamos encontrar o seu imóvel ideal"
              description="Conte o que você procura e retornaremos com as melhores oportunidades. Atendimento exclusivo e sem compromisso."
            />
            <div className="mt-8 space-y-4 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Horário: </span>
                {settings.office_hours}
              </p>
              <p>
                <span className="font-medium text-foreground">Telefone: </span>
                {settings.broker_phone}
              </p>
              <p>
                <span className="font-medium text-foreground">E-mail: </span>
                {settings.broker_email}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <ContactForm source="homepage" />
          </div>
        </div>
      </section>
    </>
  )
}
