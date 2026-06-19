'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { listPropertySchema, type ListPropertyFormValues } from '@/lib/validations/lead'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import type { LeadType } from '@/types'

interface LeadFormProps {
  type: 'list_property' | 'evaluate'
  messageLabel?: string
  messagePlaceholder?: string
  submitLabel?: string
  source?: string
}

export function LeadForm({
  type,
  messageLabel = 'Conte sobre o seu imóvel',
  messagePlaceholder = 'Tipo, bairro, número de quartos, diferenciais...',
  submitLabel = 'Enviar',
  source,
}: LeadFormProps) {
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListPropertyFormValues>({
    resolver: zodResolver(listPropertySchema),
    defaultValues: {
      type: type as 'list_property',
      privacy_consent: false as unknown as true,
    },
  })

  const consent = watch('privacy_consent')

  const onSubmit = async (values: ListPropertyFormValues) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          type: type as LeadType,
          source: source || type,
        }),
      })
      if (!res.ok) throw new Error()
      toast({
        variant: 'success',
        title: 'Recebemos sua solicitação!',
        description: 'Entraremos em contato em breve.',
      })
      reset({
        type: type as 'list_property',
        privacy_consent: false as unknown as true,
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: 'Tente novamente ou fale pelo WhatsApp.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lf-name">Nome completo *</Label>
          <Input id="lf-name" placeholder="Seu nome" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lf-phone">Telefone / WhatsApp *</Label>
          <Input
            id="lf-phone"
            placeholder="(83) 99999-9999"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lf-email">E-mail *</Label>
        <Input
          id="lf-email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lf-message">{messageLabel} *</Label>
        <Textarea
          id="lf-message"
          rows={5}
          placeholder={messagePlaceholder}
          {...register('message')}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="lf-consent"
          checked={!!consent}
          onCheckedChange={(c) =>
            setValue(
              'privacy_consent',
              c === true ? (true as const) : (false as unknown as true),
              { shouldValidate: true }
            )
          }
        />
        <Label
          htmlFor="lf-consent"
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
          submitLabel
        )}
      </Button>
    </form>
  )
}
