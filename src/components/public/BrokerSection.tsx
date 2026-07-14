import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl } from '@/lib/utils'
import type { SiteSettings } from '@/types'

const DEFAULT_BROKER_IMAGE = '/broker.png'

const HIGHLIGHTS = [
  'Especialista em imóveis de alto padrão',
  'Atendimento exclusivo e sigiloso',
  'Negociação transparente e segura',
  'Rede de contatos qualificada',
]

interface BrokerSectionProps {
  settings: SiteSettings
}

export function BrokerSection({ settings }: BrokerSectionProps) {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-2xl">
            <Image
              src={settings.broker_avatar?.trim() ? settings.broker_avatar : DEFAULT_BROKER_IMAGE}
              alt={settings.broker_name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden rounded-lg bg-brand-navy p-6 text-white shadow-xl md:block">
            <p className="font-serif text-4xl font-semibold text-brand-gold">+15</p>
            <p className="text-sm text-white/70">anos de experiência</p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="eyebrow mb-3">Quem atende você</p>
          <h2 className="font-serif text-3xl font-medium leading-tight text-brand-navy md:text-4xl">
            {settings.broker_name}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-wider text-brand-gold">
            Corretor de Imóveis · {settings.broker_creci}
          </p>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {settings.company_bio}
          </p>

          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
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
            <Button asChild variant="outline" size="lg">
              <Link href="/sobre">Conhecer a história</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
