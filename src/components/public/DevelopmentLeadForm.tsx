'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { trackLead } from '@/lib/analytics'

interface DevelopmentLeadFormProps {
  developmentId: string
  developmentName: string
}

export function DevelopmentLeadForm({
  developmentId,
  developmentName,
}: DevelopmentLeadFormProps) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [consent, setConsent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.name.trim().length < 3) {
      toast({ variant: 'destructive', title: 'Informe seu nome completo' })
      return
    }
    if (form.phone.trim().length < 8) {
      toast({ variant: 'destructive', title: 'Informe um telefone válido' })
      return
    }
    if (!consent) {
      toast({
        variant: 'destructive',
        title: 'Aceite a política de privacidade para continuar',
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message:
            form.message.trim() ||
            `Tenho interesse no empreendimento ${developmentName}.`,
          type: 'development_interest',
          development_id: developmentId,
          source: `empreendimento:${developmentName}`,
          privacy_consent: true,
        }),
      })

      if (!res.ok) throw new Error('request failed')

      trackLead({ content_name: developmentName })

      toast({
        variant: 'success',
        title: 'Recebido!',
        description: 'Eduardo entrará em contato em breve.',
      })
      setForm({ name: '', email: '', phone: '', message: '' })
      setConsent(false)
    } catch {
      toast({
        variant: 'destructive',
        title: 'Não foi possível enviar',
        description: 'Tente novamente ou fale pelo WhatsApp.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="font-serif text-xl font-medium text-brand-navy">
        Receba a tabela de valores
      </h3>

      <div className="space-y-1.5">
        <Label htmlFor="dev-name">Nome *</Label>
        <Input
          id="dev-name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Seu nome completo"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="dev-phone">WhatsApp *</Label>
          <Input
            id="dev-phone"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="(83) 90000-0000"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dev-email">E-mail</Label>
          <Input
            id="dev-email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="voce@email.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dev-message">O que você procura?</Label>
        <Textarea
          id="dev-message"
          rows={3}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="Número de quartos, andar, forma de pagamento..."
        />
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox
          id="dev-consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
        />
        <Label
          htmlFor="dev-consent"
          className="text-xs font-normal leading-relaxed text-muted-foreground"
        >
          Aceito a{' '}
          <Link href="/privacidade" className="underline hover:text-brand-gold">
            política de privacidade
          </Link>{' '}
          e autorizo o contato sobre este empreendimento.
        </Label>
      </div>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Quero saber mais'}
      </Button>
    </form>
  )
}
