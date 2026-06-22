'use client'

import { useState, useTransition } from 'react'
import { Pencil, Trash2, Plus, Loader2, Eye, EyeOff, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
  toggleNeighborhoodActive,
} from '@/app/admin/bairros/actions'
import type { Neighborhood, NeighborhoodHighlight, NeighborhoodPOI } from '@/types'

const ICON_OPTIONS = [
  'TrendingUp', 'Trees', 'ShoppingBag', 'GraduationCap',
  'Waves', 'Star', 'MapPin', 'Home', 'Building2', 'Car',
  'Heart', 'Shield', 'Zap', 'Sun', 'Coffee',
]

type FormState = {
  name: string
  city_name: string
  description: string
  cover_image_url: string
  tags: string
  highlights: NeighborhoodHighlight[]
  points_of_interest: NeighborhoodPOI[]
  seo_title: string
  seo_description: string
  display_order: number
  is_active: boolean
  is_featured: boolean
}

const EMPTY: FormState = {
  name: '',
  city_name: 'João Pessoa',
  description: '',
  cover_image_url: '',
  tags: '',
  highlights: [
    { icon: 'TrendingUp', label: '', value: '' },
    { icon: 'Home', label: '', value: '' },
    { icon: 'ShoppingBag', label: '', value: '' },
    { icon: 'MapPin', label: '', value: '' },
  ],
  points_of_interest: [
    { name: '', category: '', image: '' },
  ],
  seo_title: '',
  seo_description: '',
  display_order: 0,
  is_active: true,
  is_featured: false,
}

function neighborhoodToForm(n: Neighborhood): FormState {
  return {
    name: n.name,
    city_name: n.city_name ?? 'João Pessoa',
    description: n.description ?? '',
    cover_image_url: n.cover_image_url ?? '',
    tags: (n.tags ?? []).join(', '),
    highlights: n.highlights?.length
      ? n.highlights
      : EMPTY.highlights,
    points_of_interest: n.points_of_interest?.length
      ? n.points_of_interest
      : EMPTY.points_of_interest,
    seo_title: n.seo_title ?? '',
    seo_description: n.seo_description ?? '',
    display_order: n.display_order,
    is_active: n.is_active,
    is_featured: n.is_featured,
  }
}

function formToPayload(form: FormState) {
  return {
    name: form.name,
    city_name: form.city_name,
    description: form.description,
    cover_image_url: form.cover_image_url,
    tags: form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    highlights: form.highlights.filter((h) => h.label && h.value),
    points_of_interest: form.points_of_interest.filter((p) => p.name),
    seo_title: form.seo_title,
    seo_description: form.seo_description,
    display_order: form.display_order,
    is_active: form.is_active,
    is_featured: form.is_featured,
  }
}

export function NeighborhoodsManager({
  neighborhoods,
}: {
  neighborhoods: Neighborhood[]
}) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<Neighborhood | null>(null)

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }))

  const openNew = () => {
    setEditingId(null)
    setForm({ ...EMPTY, display_order: neighborhoods.length + 1 })
    setDialogOpen(true)
  }

  const openEdit = (n: Neighborhood) => {
    setEditingId(n.id)
    setForm(neighborhoodToForm(n))
    setDialogOpen(true)
  }

  /* ── Highlights helpers ── */
  const setHighlight = (i: number, patch: Partial<NeighborhoodHighlight>) =>
    set({ highlights: form.highlights.map((h, idx) => (idx === i ? { ...h, ...patch } : h)) })

  const addHighlight = () =>
    set({ highlights: [...form.highlights, { icon: 'Star', label: '', value: '' }] })

  const removeHighlight = (i: number) =>
    set({ highlights: form.highlights.filter((_, idx) => idx !== i) })

  /* ── POI helpers ── */
  const setPOI = (i: number, patch: Partial<NeighborhoodPOI>) =>
    set({ points_of_interest: form.points_of_interest.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) })

  const addPOI = () =>
    set({ points_of_interest: [...form.points_of_interest, { name: '', category: '', image: '' }] })

  const removePOI = (i: number) =>
    set({ points_of_interest: form.points_of_interest.filter((_, idx) => idx !== i) })

  const save = () => {
    if (!form.name.trim()) {
      toast({ variant: 'destructive', title: 'Informe o nome do bairro' })
      return
    }
    const payload = formToPayload(form)
    startTransition(async () => {
      const res = editingId
        ? await updateNeighborhood(editingId, payload as Parameters<typeof updateNeighborhood>[1])
        : await createNeighborhood(payload as Parameters<typeof createNeighborhood>[0])
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
        return
      }
      toast({ variant: 'success', title: editingId ? 'Bairro atualizado' : 'Bairro criado' })
      setDialogOpen(false)
    })
  }

  const remove = () => {
    if (!deleteTarget) return
    const target = deleteTarget
    startTransition(async () => {
      const res = await deleteNeighborhood(target.id)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      } else {
        toast({ variant: 'success', title: 'Bairro removido' })
      }
      setDeleteTarget(null)
    })
  }

  const toggleActive = (n: Neighborhood) => {
    startTransition(async () => { await toggleNeighborhoodActive(n.id, !n.is_active) })
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" /> Novo bairro
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Ordem</th>
              <th className="px-4 py-3 font-medium">Bairro</th>
              <th className="px-4 py-3 font-medium">Highlights</th>
              <th className="px-4 py-3 font-medium">POIs</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Destaque</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {neighborhoods.map((n) => (
              <tr key={n.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3 text-muted-foreground">{n.display_order}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{n.name}</p>
                  <p className="text-xs text-muted-foreground">{n.city_name ?? 'João Pessoa'}</p>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {n.highlights?.length ?? 0} itens
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {n.points_of_interest?.length ?? 0} locais
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(n)} disabled={isPending}>
                    {n.is_active
                      ? <Badge variant="success">Ativo</Badge>
                      : <Badge variant="secondary">Inativo</Badge>}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {n.is_featured
                    ? <Eye className="h-4 w-4 text-brand-gold" />
                    : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => openEdit(n)}
                      className="rounded-md p-2 hover:bg-secondary"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(n)}
                      className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar bairro' : 'Novo bairro'}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="geral">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="geral" className="flex-1">Geral</TabsTrigger>
              <TabsTrigger value="highlights" className="flex-1">Destaques</TabsTrigger>
              <TabsTrigger value="pois" className="flex-1">Pontos de interesse</TabsTrigger>
              <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
            </TabsList>

            {/* ── Aba Geral ── */}
            <TabsContent value="geral" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome *</Label>
                  <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Ex.: Altiplano" />
                </div>
                <div className="space-y-1.5">
                  <Label>Cidade</Label>
                  <Input value={form.city_name} onChange={(e) => set({ city_name: e.target.value })} placeholder="João Pessoa" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Descrição (texto sobre o bairro)</Label>
                <Textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set({ description: e.target.value })}
                  placeholder="Descreva o bairro, características, diferenciais..."
                />
              </div>

              <div className="space-y-1.5">
                <Label>URL da imagem de capa (hero)</Label>
                <Input
                  value={form.cover_image_url}
                  onChange={(e) => set({ cover_image_url: e.target.value })}
                  placeholder="https://..."
                />
                {form.cover_image_url && (
                  <img src={form.cover_image_url} alt="preview" className="mt-2 h-32 w-full rounded-lg object-cover" />
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Tags (separadas por vírgula)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => set({ tags: e.target.value })}
                  placeholder="Alto Padrão, Beira-mar, Tranquilo"
                />
                <p className="text-xs text-muted-foreground">
                  Aparecem como etiquetas no hero da página do bairro
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Ordem de exibição</Label>
                  <Input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => set({ display_order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <Label>Ativo no site</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => set({ is_active: v })} />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <Label>Destaque na home</Label>
                <Switch checked={form.is_featured} onCheckedChange={(v) => set({ is_featured: v })} />
              </div>
            </TabsContent>

            {/* ── Aba Highlights ── */}
            <TabsContent value="highlights" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Os 4 destaques exibidos abaixo do hero (ex.: Valorização · Alta).
              </p>
              {form.highlights.map((h, i) => (
                <div key={i} className="relative rounded-lg border border-border p-4">
                  <button
                    type="button"
                    onClick={() => removeHighlight(i)}
                    className="absolute right-3 top-3 rounded p-0.5 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Ícone</Label>
                      <select
                        value={h.icon}
                        onChange={(e) => setHighlight(i, { icon: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {ICON_OPTIONS.map((ico) => (
                          <option key={ico} value={ico}>{ico}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Rótulo (ex.: Valorização)</Label>
                      <Input
                        value={h.label}
                        onChange={(e) => setHighlight(i, { label: e.target.value })}
                        placeholder="Valorização"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Valor (ex.: Alta)</Label>
                      <Input
                        value={h.value}
                        onChange={(e) => setHighlight(i, { value: e.target.value })}
                        placeholder="Alta"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {form.highlights.length < 4 && (
                <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                  <Plus className="h-3.5 w-3.5" /> Adicionar destaque
                </Button>
              )}
            </TabsContent>

            {/* ── Aba POIs ── */}
            <TabsContent value="pois" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Locais e pontos de interesse do bairro (máx. 6).
              </p>
              {form.points_of_interest.map((poi, i) => (
                <div key={i} className="relative rounded-lg border border-border p-4">
                  <button
                    type="button"
                    onClick={() => removePOI(i)}
                    className="absolute right-3 top-3 rounded p-0.5 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Nome do local</Label>
                        <Input
                          value={poi.name}
                          onChange={(e) => setPOI(i, { name: e.target.value })}
                          placeholder="Ex.: Shopping Pátio Altiplano"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Categoria</Label>
                        <Input
                          value={poi.category}
                          onChange={(e) => setPOI(i, { category: e.target.value })}
                          placeholder="Shopping, Praia, Escola..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">URL da foto</Label>
                      <Input
                        value={poi.image}
                        onChange={(e) => setPOI(i, { image: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    {poi.image && (
                      <img src={poi.image} alt={poi.name} className="h-24 w-full rounded-md object-cover" />
                    )}
                  </div>
                </div>
              ))}
              {form.points_of_interest.length < 6 && (
                <Button type="button" variant="outline" size="sm" onClick={addPOI}>
                  <Plus className="h-3.5 w-3.5" /> Adicionar local
                </Button>
              )}
            </TabsContent>

            {/* ── Aba SEO ── */}
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-1.5">
                <Label>Título SEO</Label>
                <Input
                  value={form.seo_title}
                  onChange={(e) => set({ seo_title: e.target.value })}
                  placeholder="Imóveis em Altiplano | Eduardo Vieira"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Descrição SEO</Label>
                <Textarea
                  rows={3}
                  value={form.seo_description}
                  onChange={(e) => set({ seo_description: e.target.value })}
                  placeholder="Conheça os melhores imóveis no Altiplano..."
                />
                <p className="text-xs text-muted-foreground">Recomendado: até 160 caracteres.</p>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button variant="gold" onClick={save} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar bairro'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Excluir bairro</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Deseja excluir <span className="font-medium text-foreground">{deleteTarget?.name}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={remove} disabled={isPending}>Excluir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
