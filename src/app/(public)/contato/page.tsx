import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram } from 'lucide-react'
import { ContactForm } from '@/components/public/ContactForm'
import { Button } from '@/components/ui/button'
import { getSettings } from '@/lib/settings'
import { buildWhatsAppUrl } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato com Eduardo Vieira Imóveis. Atendimento personalizado para compra, venda e locação de imóveis de alto padrão em João Pessoa.',
}

export default async function ContatoPage() {
  const settings = await getSettings()

  const contactItems = [
    {
      icon: Phone,
      label: 'Telefone',
      value: settings.broker_phone,
      href: `tel:${settings.broker_phone}`,
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: settings.broker_email,
      href: `mailto:${settings.broker_email}`,
    },
    {
      icon: MapPin,
      label: 'Localização',
      value: settings.company_address,
    },
    {
      icon: Clock,
      label: 'Horário de atendimento',
      value: settings.office_hours,
    },
  ]

  return (
    <>
      <div className="bg-brand-navy pb-12 pt-32">
        <div className="container-wide">
          <p className="eyebrow mb-3 text-brand-gold-light">Contato</p>
          <h1 className="font-serif text-3xl font-medium text-white md:text-5xl">
            Vamos conversar
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Estamos prontos para ajudar você a encontrar, vender ou alugar o seu
            imóvel. Escolha o canal de sua preferência.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Info */}
          <div>
            <div className="space-y-6">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy/5 text-brand-gold">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-medium text-foreground transition-colors hover:text-brand-gold"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-medium text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="whatsapp" size="lg">
                <a
                  href={buildWhatsAppUrl(
                    settings.broker_whatsapp,
                    settings.whatsapp_default_message
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" fill="currentColor" />
                  WhatsApp
                </a>
              </Button>
              {settings.company_instagram && (
                <Button asChild variant="outline" size="lg">
                  <a
                    href={settings.company_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-5 w-5" />
                    Instagram
                  </a>
                </Button>
              )}
            </div>

            <div className="mt-10 aspect-[16/10] overflow-hidden rounded-xl border border-border">
              <iframe
                title="Mapa João Pessoa"
                className="h-full w-full"
                loading="lazy"
                src="https://www.google.com/maps?q=João+Pessoa+Paraíba&output=embed"
              />
            </div>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h2 className="mb-2 font-serif text-2xl font-medium text-brand-navy">
              Envie uma mensagem
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Preencha o formulário e retornaremos o mais breve possível.
            </p>
            <ContactForm source="contact_page" />
          </div>
        </div>
      </section>
    </>
  )
}
