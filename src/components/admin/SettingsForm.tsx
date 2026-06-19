'use client'

import { useState, useTransition } from 'react'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { saveSettings } from '@/app/admin/configuracoes/actions'
import { DEFAULT_SETTINGS } from '@/types'

const FIELDS: {
  group: string
  items: { key: string; label: string; type?: 'text' | 'textarea'; hint?: string }[]
}[] = [
  {
    group: 'corretor',
    items: [
      { key: 'broker_name', label: 'Nome do corretor' },
      { key: 'broker_creci', label: 'CRECI' },
      { key: 'broker_phone', label: 'Telefone' },
      { key: 'broker_whatsapp', label: 'WhatsApp (com DDI 55)', hint: 'Ex.: 5583999990000' },
      { key: 'broker_email', label: 'E-mail' },
      { key: 'broker_avatar', label: 'URL da foto do corretor' },
    ],
  },
  {
    group: 'empresa',
    items: [
      { key: 'company_name', label: 'Nome da empresa' },
      { key: 'company_address', label: 'Endereço' },
      { key: 'office_hours', label: 'Horário de atendimento' },
      {
        key: 'company_bio',
        label: 'Sobre / Bio',
        type: 'textarea',
      },
      {
        key: 'whatsapp_default_message',
        label: 'Mensagem padrão do WhatsApp',
        type: 'textarea',
      },
    ],
  },
  {
    group: 'redes',
    items: [
      { key: 'company_instagram', label: 'Instagram (URL)' },
      { key: 'company_facebook', label: 'Facebook (URL)' },
      { key: 'company_youtube', label: 'YouTube (URL)' },
    ],
  },
  {
    group: 'seo',
    items: [
      { key: 'seo_title', label: 'Título SEO' },
      { key: 'seo_description', label: 'Descrição SEO', type: 'textarea' },
    ],
  },
]

const GROUP_LABELS: Record<string, string> = {
  corretor: 'Corretor',
  empresa: 'Empresa',
  redes: 'Redes sociais',
  seo: 'SEO',
}

export function SettingsForm({
  settings,
}: {
  settings: Record<string, string>
}) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = { ...DEFAULT_SETTINGS }
    Object.entries(settings).forEach(([k, v]) => {
      initial[k] = v
    })
    return initial
  })

  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const submit = () => {
    startTransition(async () => {
      const res = await saveSettings(values)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      } else {
        toast({ variant: 'success', title: 'Configurações salvas' })
      }
    })
  }

  return (
    <Tabs defaultValue="corretor">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-secondary/60 p-1">
        {FIELDS.map((f) => (
          <TabsTrigger key={f.group} value={f.group}>
            {GROUP_LABELS[f.group]}
          </TabsTrigger>
        ))}
      </TabsList>

      {FIELDS.map((group) => (
        <TabsContent key={group.group} value={group.group} className="mt-6">
          <div className="space-y-5 rounded-xl border border-border bg-card p-6">
            {group.items.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <Label htmlFor={item.key}>{item.label}</Label>
                {item.type === 'textarea' ? (
                  <Textarea
                    id={item.key}
                    rows={3}
                    value={values[item.key] ?? ''}
                    onChange={(e) => set(item.key, e.target.value)}
                  />
                ) : (
                  <Input
                    id={item.key}
                    value={values[item.key] ?? ''}
                    onChange={(e) => set(item.key, e.target.value)}
                  />
                )}
                {item.hint && (
                  <p className="text-xs text-muted-foreground">{item.hint}</p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      ))}

      <div className="mt-6 flex justify-end">
        <Button variant="gold" size="lg" onClick={submit} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Salvar configurações
            </>
          )}
        </Button>
      </div>
    </Tabs>
  )
}
