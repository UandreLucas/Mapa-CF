import { Award, ShieldCheck, Sparkles, HeartHandshake, KeyRound, Search } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const ITEMS = [
  {
    icon: Sparkles,
    title: 'Curadoria exclusiva',
    description:
      'Selecionamos a dedo os melhores imóveis de alto padrão, poupando o seu tempo.',
  },
  {
    icon: HeartHandshake,
    title: 'Atendimento personalizado',
    description:
      'Acompanhamento individual em cada etapa, do primeiro contato à assinatura.',
  },
  {
    icon: ShieldCheck,
    title: 'Segurança jurídica',
    description:
      'Toda a documentação verificada e negociação conduzida com total transparência.',
  },
  {
    icon: Award,
    title: 'Mais de 15 anos de mercado',
    description:
      'Experiência consolidada nos bairros mais valorizados de João Pessoa.',
  },
  {
    icon: Search,
    title: 'Conhecimento local',
    description:
      'Domínio profundo de cada bairro, valor de mercado e tendências da região.',
  },
  {
    icon: KeyRound,
    title: 'Do início ao fim',
    description:
      'Suporte completo em financiamento, avaliação e pós-venda do seu imóvel.',
  },
]

export function Differentials() {
  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Por que Eduardo Vieira"
          title="Uma experiência à altura do seu padrão"
          description="Combinamos conhecimento de mercado, discrição e dedicação para entregar muito mais do que um imóvel."
          align="center"
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="group rounded-lg border border-border bg-card p-7 transition-all duration-300 hover:border-brand-gold hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-navy">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-brand-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
