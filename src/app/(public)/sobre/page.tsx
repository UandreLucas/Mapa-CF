import Image from 'next/image'
import type { Metadata } from 'next'
import { Differentials } from '@/components/public/Differentials'
import { AdvertiseCTA } from '@/components/public/AdvertiseCTA'
import { SectionHeading } from '@/components/public/SectionHeading'
import { Button } from '@/components/ui/button'
import { getSettings } from '@/lib/settings'
import { buildWhatsAppUrl } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Sobre Eduardo Vieira',
  description:
    'Conheça Eduardo Vieira, especialista em imóveis de alto padrão em João Pessoa, com mais de 15 anos de experiência e atendimento personalizado.',
}

const ABOUT_IMAGE = '/broker.png'

const STATS = [
  { value: '+15', label: 'anos de mercado' },
  { value: '+500', label: 'famílias atendidas' },
  { value: '8', label: 'bairros nobres' },
  { value: '100%', label: 'dedicação' },
]

export default async function SobrePage() {
  const settings = await getSettings()

  return (
    <>
      <div className="bg-brand-navy pb-12 pt-32">
        <div className="container-wide">
          <p className="eyebrow mb-3 text-brand-gold-light">Sobre</p>
          <h1 className="font-serif text-3xl font-medium text-white md:text-5xl">
            Especialista em alto padrão em João Pessoa
          </h1>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-2xl">
            <Image
              src={ABOUT_IMAGE}
              alt={settings.broker_name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="eyebrow mb-3">A história</p>
            <h2 className="font-serif text-3xl font-medium text-brand-navy">
              {settings.broker_name}
            </h2>
            <p className="mt-2 text-sm uppercase tracking-wider text-brand-gold">
              {settings.broker_creci}
            </p>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>{settings.company_bio}</p>
              <p>
                Ao longo de mais de uma década no mercado imobiliário de João
                Pessoa, construí uma trajetória pautada pela confiança, pela
                discrição e pelo profundo conhecimento das regiões mais nobres da
                capital. Cada cliente recebe um atendimento exclusivo, pensado
                para tornar a jornada de compra, venda ou locação simples e
                segura.
              </p>
              <p>
                Acredito que encontrar um imóvel vai muito além de metros
                quadrados: trata-se de encontrar o cenário certo para os próximos
                capítulos da sua vida. É com esse propósito que conduzo cada
                negociação.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-3xl font-semibold text-brand-gold">
                    {s.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button asChild variant="gold" size="lg">
                <a
                  href={buildWhatsAppUrl(
                    settings.broker_whatsapp,
                    settings.whatsapp_default_message
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar com {settings.broker_name.split(' ')[0]}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / values */}
      <section className="bg-secondary/40 section-padding">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Nossos valores"
            title="O que nos move"
            align="center"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Confiança',
                text: 'Relações construídas com transparência e ética em cada negociação.',
              },
              {
                title: 'Excelência',
                text: 'Padrão elevado de atendimento, à altura dos imóveis que representamos.',
              },
              {
                title: 'Discrição',
                text: 'Sigilo absoluto e respeito à privacidade de cada cliente.',
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-lg border border-border bg-card p-8 text-center"
              >
                <h3 className="font-serif text-2xl font-medium text-brand-navy">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Differentials />
      <AdvertiseCTA />
    </>
  )
}
