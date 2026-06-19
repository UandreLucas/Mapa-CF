import type { Metadata } from 'next'
import { TrendingUp, Users, Camera, FileCheck, Megaphone, Handshake } from 'lucide-react'
import { LeadForm } from '@/components/public/LeadForm'
import { SectionHeading } from '@/components/public/SectionHeading'

export const metadata: Metadata = {
  title: 'Anuncie seu imóvel',
  description:
    'Anuncie seu imóvel de alto padrão com Eduardo Vieira. Exposição qualificada, avaliação justa e negociação conduzida por um especialista em João Pessoa.',
}

const BENEFITS = [
  {
    icon: Users,
    title: 'Público qualificado',
    text: 'Sua propriedade exposta para compradores e locatários realmente interessados em alto padrão.',
  },
  {
    icon: Camera,
    title: 'Apresentação premium',
    text: 'Curadoria de fotos e descrição que valorizam cada detalhe do seu imóvel.',
  },
  {
    icon: TrendingUp,
    title: 'Avaliação justa',
    text: 'Precificação baseada em dados reais do mercado da sua região.',
  },
  {
    icon: Megaphone,
    title: 'Divulgação estratégica',
    text: 'Presença digital e rede de contatos qualificada para acelerar o seu negócio.',
  },
  {
    icon: FileCheck,
    title: 'Segurança jurídica',
    text: 'Toda a documentação verificada e processo conduzido com transparência.',
  },
  {
    icon: Handshake,
    title: 'Acompanhamento total',
    text: 'Suporte do anúncio à assinatura, com você em cada etapa.',
  },
]

const STEPS = [
  { n: '01', title: 'Você nos conta', text: 'Preencha o formulário com as informações do seu imóvel.' },
  { n: '02', title: 'Avaliamos', text: 'Fazemos uma avaliação criteriosa e alinhamos a estratégia.' },
  { n: '03', title: 'Divulgamos', text: 'Seu imóvel ganha visibilidade qualificada no mercado.' },
  { n: '04', title: 'Negociamos', text: 'Conduzimos toda a negociação até o fechamento seguro.' },
]

export default function AnunciePage() {
  return (
    <>
      <div className="bg-brand-navy pb-12 pt-32">
        <div className="container-wide">
          <p className="eyebrow mb-3 text-brand-gold-light">Para proprietários</p>
          <h1 className="font-serif text-3xl font-medium text-white md:text-5xl">
            Anuncie seu imóvel com quem entende de alto padrão
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Exposição qualificada, avaliação justa e negociação conduzida por um
            especialista. Conte com Eduardo Vieira para vender ou alugar com
            tranquilidade.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {/* Benefits */}
          <div>
            <SectionHeading
              eyebrow="Vantagens"
              title="Por que anunciar conosco"
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy/5 text-brand-gold">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{b.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {b.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="mb-2 font-serif text-2xl font-medium text-brand-navy">
                Cadastre seu imóvel
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Preencha os dados e entraremos em contato para os próximos passos.
              </p>
              <LeadForm
                type="list_property"
                source="anuncie_page"
                messageLabel="Sobre o seu imóvel"
                messagePlaceholder="Tipo, bairro, quartos, área, valor desejado, diferenciais..."
                submitLabel="Quero anunciar"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-secondary/40 section-padding">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Como funciona"
            title="Simples do início ao fim"
            align="center"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n}>
                <span className="font-serif text-5xl font-semibold text-brand-gold/40">
                  {s.n}
                </span>
                <h3 className="mt-3 font-serif text-xl font-medium text-brand-navy">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
