'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Loader2, Send } from 'lucide-react'
import { contactSchema, type ContactFormValues } from '@/lib/validations/lead'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { trackLead } from '@/lib/analytics'
import type { LeadType } from '@/types'

interface ContactFormProps {
  propertyId?: string
  propertyTitle?: string
  type?: LeadType
  source?: string
  defaultMessage?: string
  compact?: boolean
}

export function ContactForm({
  propertyId,
  propertyTitle,
  type = 'contact',
  source = 'site',
  defaultMessage,
  compact = false,
}: ContactFormProps) {
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type,
      property_id: propertyId ?? null,
      source,
      message:
        defaultMessage ??
        (propertyTitle
          ? `Olá, tenho interesse no imóvel "${propertyTitle}". Gostaria de mais informações.`
          : ''),
      privacy_consent: false as unknown as true,
    },
  })

  const consent = watch('privacy_consent')

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Falha ao enviar')

      trackLead({ content_name: values.type })

      toast({
        variant: 'success',
        title: 'Mensagem enviada!',
        description: 'Em breve entraremos em contato com você.',
      })
      reset({
        type,
        property_id: propertyId ?? null,
        source,
        message: '',
        name: '',
        email: '',
        phone: '',
        privacy_consent: false as unknown as true,
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: 'Tente novamente ou fale conosco pelo WhatsApp.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome completo *</Label>
          <Input id="name" placeholder="Seu nome" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Telefone / WhatsApp *</Label>
          <Input
            id="phone"
            placeholder="(83) 99999-9999"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Mensagem *</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Como podemos ajudar?"
          {...register('message')}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="privacy_consent"
          checked={!!consent}
          onCheckedChange={(c) =>
            setValue('privacy_consent', c === true ? (true as const) : (false as unknown as true), {
              shouldValidate: true,
            })
          }
        />
        <Label
          htmlFor="privacy_consent"
          className="text-xs font-normal leading-relaxed text-muted-foreground"
        >
          Li e concordo com a{' '}
          <Link href="/privacidade" className="text-brand-gold underline">
            Política de Privacidade
          </Link>{' '}
          e autorizo o contato.
        </Label>
      </div>
      {errors.privacy_consent && (
        <p className="text-xs text-destructive">
          {errors.privacy_consent.message}
        </p>
      )}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Enviar mensagem
          </>
        )}
      </Button>
    </form>
  )
}
