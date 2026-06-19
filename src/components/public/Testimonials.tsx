import { Quote, Star } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import type { Testimonial } from '@/types'

const FALLBACK_TESTIMONIALS: Pick<Testimonial, 'name' | 'text' | 'rating'>[] = [
  {
    name: 'Mariana Albuquerque',
    text: 'Atendimento impecável do início ao fim. Encontrei o apartamento dos meus sonhos no Cabo Branco com total tranquilidade e segurança.',
    rating: 5,
  },
  {
    name: 'Ricardo Nóbrega',
    text: 'Profissionalismo e discrição em todas as etapas. O Eduardo entende como ninguém o mercado de alto padrão de João Pessoa.',
    rating: 5,
  },
  {
    name: 'Fernanda Lins',
    text: 'Vendi meu imóvel no Altiplano em tempo recorde e por um valor justo. Recomendo de olhos fechados.',
    rating: 5,
  },
]

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

export function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const items = testimonials.length ? testimonials : FALLBACK_TESTIMONIALS

  return (
    <section className="section-padding bg-brand-navy">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Quem confia, recomenda"
          align="center"
          light
        />

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {items.slice(0, 3).map((t, i) => (
            <figure
              key={i}
              className="relative rounded-lg border border-white/10 bg-white/5 p-8"
            >
              <Quote className="mb-5 h-8 w-8 text-brand-gold" />
              <blockquote className="text-base leading-relaxed text-white/80">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between">
                <span className="font-medium text-white">{t.name}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-brand-gold text-brand-gold"
                    />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
