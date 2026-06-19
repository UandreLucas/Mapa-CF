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
  getPropertiesBy,
  getPropertiesByPurpose,
  getRecentProperties,
  getNeighborhoodsWithCounts,
  getTestimonials,
} from '@/lib/queries'
import { getSettings } from '@/lib/settings'

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
  ])

  return (
    <>
      <Hero />

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
