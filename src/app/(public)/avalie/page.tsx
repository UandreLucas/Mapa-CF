import type { Metadata } from 'next'
import { BarChart3, MapPin, ShieldCheck, Clock } from 'lucide-react'
import { LeadForm } from '@/components/public/LeadForm'
import { SectionHeading } from '@/components/public/SectionHeading'

export const metadata: Metadata = {
  title: 'Avalie seu imóvel gratuitamente',
  description:
    'Descubra o valor de mercado do seu imóvel em João Pessoa. Avaliação gratuita e sem compromisso com Eduardo Vieira, especialista em alto padrão.',
}

const POINTS = [
  {
    icon: BarChart3,
    title: 'Análise de mercado',
    text: 'Estudo comparativo com imóveis semelhantes vendidos e disponíveis na sua região.',
  },
  {
    icon: MapPin,
    title: 'Conhecimento local',
    text: 'Domínio profundo da valorização de cada bairro de João Pessoa.',
  },
  {
    icon: ShieldCheck,
    title: 'Sem compromisso',
    text: 'A avaliação é gratuita e você decide os próximos passos com liberdade.',
  },
  {
    icon: Clock,
    title: 'Resposta rápida',
    text: 'Retornamos com uma estimativa em tempo hábil, com agilidade e precisão.',
  },
]

export default function AvaliePage() {
  return (
    <>
      <div className="bg-brand-navy pb-12 pt-32">
        <div className="container-wide">
          <p className="eyebrow mb-3 text-brand-gold-light">Avaliação gratuita</p>
          <h1 className="font-serif text-3xl font-medium text-white md:text-5xl">
            Quanto vale o seu imóvel?
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Descubra o valor de mercado do seu imóvel com uma avaliação criteriosa
            e gratuita, feita por quem conhece os bairros nobres de João Pessoa.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Form */}
          <div className="lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="mb-2 font-serif text-2xl font-medium text-brand-navy">
                Solicite sua avaliação
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Preencha os dados do imóvel e retornaremos com uma estimativa de
                valor.
              </p>
              <LeadForm
                type="evaluate"
                source="avalie_page"
                messageLabel="Dados do imóvel a avaliar"
                messagePlaceholder="Endereço/bairro, tipo, área, quartos, vagas, estado de conservação..."
                submitLabel="Quero avaliar meu imóvel"
              />
            </div>
          </div>

          {/* Points */}
          <div className="lg:order-1">
            <SectionHeading
              eyebrow="Como avaliamos"
              title="Uma estimativa precisa e transparente"
            />
            <div className="mt-10 space-y-8">
              {POINTS.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-brand-navy">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {p.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
