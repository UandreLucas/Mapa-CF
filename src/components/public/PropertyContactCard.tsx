'use client'

import { useState } from 'react'
import { MessageCircle, Phone, CalendarClock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ContactForm } from './ContactForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatCurrency, buildWhatsAppUrl } from '@/lib/utils'
import type { PropertyFull, SiteSettings } from '@/types'

interface PropertyContactCardProps {
  property: PropertyFull
  settings: SiteSettings
}

export function PropertyContactCard({
  property,
  settings,
}: PropertyContactCardProps) {
  const [scheduleOpen, setScheduleOpen] = useState(false)

  const waMessage = `Olá, Eduardo! Tenho interesse no imóvel "${property.title}" (Cód. ${property.code}). Gostaria de mais informações.`
  const initials = settings.broker_name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="sticky top-24 space-y-4">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Price */}
        <div className="border-b border-border pb-5">
          {property.hide_price ? (
            <p className="text-2xl font-semibold text-brand-navy">
              Valor sob consulta
            </p>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {property.purpose === 'rent' ? 'Aluguel mensal' : 'Valor de venda'}
              </p>
              <p className="mt-1 text-3xl font-semibold text-brand-navy">
                {formatCurrency(property.price)}
                {property.purpose === 'rent' && (
                  <span className="text-base font-normal text-muted-foreground">
                    {' '}
                    /mês
                  </span>
                )}
              </p>
            </>
          )}
          {(property.condo_fee || property.iptu) && (
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              {property.condo_fee ? (
                <p>Condomínio: {formatCurrency(property.condo_fee)}</p>
              ) : null}
              {property.iptu ? <p>IPTU: {formatCurrency(property.iptu)}/ano</p> : null}
            </div>
          )}
        </div>

        {/* Broker */}
        <div className="flex items-center gap-3 py-5">
          <Avatar className="h-12 w-12">
            <AvatarImage src={settings.broker_avatar} alt={settings.broker_name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{settings.broker_name}</p>
            <p className="text-xs text-muted-foreground">
              {settings.broker_creci}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild variant="whatsapp" size="lg" className="w-full">
            <a
              href={buildWhatsAppUrl(settings.broker_whatsapp, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" fill="currentColor" />
              Conversar no WhatsApp
            </a>
          </Button>

          <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
            <DialogTrigger asChild>
              <Button variant="gold-outline" size="lg" className="w-full">
                <CalendarClock className="h-5 w-5" />
                Agendar visita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agendar visita</DialogTitle>
              </DialogHeader>
              <p className="mb-4 text-sm text-muted-foreground">
                {property.title} · Cód. {property.code}
              </p>
              <ContactForm
                propertyId={property.id}
                propertyTitle={property.title}
                type="schedule"
                source="property_schedule"
                defaultMessage={`Olá! Gostaria de agendar uma visita ao imóvel "${property.title}" (Cód. ${property.code}).`}
                compact
              />
            </DialogContent>
          </Dialog>

          <Button asChild variant="ghost" size="lg" className="w-full">
            <a href={`tel:${settings.broker_phone}`}>
              <Phone className="h-5 w-5" />
              {settings.broker_phone}
            </a>
          </Button>
        </div>
      </div>

      {/* Inline lead form */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-serif text-lg font-medium text-brand-navy">
          Tenho interesse
        </h3>
        <ContactForm
          propertyId={property.id}
          propertyTitle={property.title}
          type="property_interest"
          source="property_detail"
          compact
        />
      </div>
    </div>
  )
}
