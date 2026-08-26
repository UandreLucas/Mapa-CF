import Link from 'next/link'
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils'
import type { SiteSettings, Neighborhood } from '@/types'

interface FooterProps {
  settings: SiteSettings
  neighborhoods?: Neighborhood[]
}

export function Footer({ settings, neighborhoods = [] }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy text-white/80">
      <div className="container-wide section-padding">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex flex-col leading-none">
              <span className="font-serif text-2xl font-semibold text-white">
                Eduardo Vieira
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-brand-gold">
                Imóveis · Alto Padrão
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              {settings.company_bio}
            </p>
            <div className="mt-6 flex gap-3">
              {settings.company_instagram && (
                <a
                  href={settings.company_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.company_facebook && (
                <a
                  href={settings.company_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.company_youtube && (
                <a
                  href={settings.company_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Navegação
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/imoveis?purpose=sale" className="transition-colors hover:text-brand-gold">
                  Comprar
                </Link>
              </li>
              <li>
                <Link href="/imoveis?purpose=rent" className="transition-colors hover:text-brand-gold">
                  Alugar
                </Link>
              </li>
              <li>
                <Link href="/bairros" className="transition-colors hover:text-brand-gold">
                  Bairros
                </Link>
              </li>
              <li>
                <Link href="/empreendimentos" className="transition-colors hover:text-brand-gold">
                  Empreendimentos
                </Link>
              </li>
              <li>
                <Link href="/anuncie" className="transition-colors hover:text-brand-gold">
                  Anuncie seu imóvel
                </Link>
              </li>
              <li>
                <Link href="/avalie" className="transition-colors hover:text-brand-gold">
                  Avalie seu imóvel
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="transition-colors hover:text-brand-gold">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Bairros */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Bairros
            </h3>
            <ul className="space-y-3 text-sm">
              {(neighborhoods.length
                ? neighborhoods
                : [
                    { slug: 'altiplano', name: 'Altiplano' },
                    { slug: 'cabo-branco', name: 'Cabo Branco' },
                    { slug: 'manaira', name: 'Manaíra' },
                    { slug: 'tambau', name: 'Tambaú' },
                    { slug: 'bessa', name: 'Bessa' },
                  ]
              )
                .slice(0, 6)
                .map((n) => (
                  <li key={n.slug}>
                    <Link
                      href={`/bairros/${n.slug}`}
                      className="transition-colors hover:text-brand-gold"
                    >
                      {n.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Contato
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <span>{settings.company_address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <a
                  href={buildWhatsAppUrl(settings.broker_whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-gold"
                >
                  {settings.broker_phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <a
                  href={`mailto:${settings.broker_email}`}
                  className="break-all transition-colors hover:text-brand-gold"
                >
                  {settings.broker_email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <span>{settings.office_hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 md:flex-row">
          <p>
            © {year} {settings.company_name}. {settings.broker_creci}. Todos os
            direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="transition-colors hover:text-brand-gold">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="transition-colors hover:text-brand-gold">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
