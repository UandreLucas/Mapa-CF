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
import { SingleImageUpload } from '@/components/admin/SingleImageUpload'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { DEVELOPMENT_STAGES, formatCurrency, getDevelopmentStageLabel } from '@/lib/utils'
import {
  createDevelopment,
  updateDevelopment,
  deleteDevelopment,
  toggleDevelopmentPublished,
} from '@/app/admin/empreendimentos/actions'
import type {
  Development,
  DevelopmentUnit,
  DevelopmentDifferential,
  DevelopmentAmenity,
  DevelopmentImage,
  DevelopmentStage,
} from '@/types'

const ICON_OPTIONS = [
  'Waves', 'Dumbbell', 'Trees', 'Wifi', 'ShieldCheck', 'Sparkles',
  'Users', 'Sun', 'Coffee', 'PartyPopper', 'Baby', 'Star',
  'TrendingUp', 'Building2', 'Car',
]

type FormState = {
  name: string
  tagline: string
  developer: string
  neighborhood: string
  city: string
  state: string
  address: string
  map_embed_url: string
  price_from: string
  stage: DevelopmentStage
  delivery_date: string
  description: string
  target_audience: string
  differentials: DevelopmentDifferential[]
  amenities: DevelopmentAmenity[]
  units: DevelopmentUnit[]
  images: DevelopmentImage[]
  cover_image_url: string
  video_url: string
  seo_title: string
  seo_description: string
  display_order: number
  is_published: boolean
  is_featured: boolean
}

const EMPTY_UNIT: DevelopmentUnit = {
  name: '',
  area: null,
  bedrooms: null,
  suites: null,
  parking: null,
  price_from: null,
  image: '',
}

const EMPTY: FormState = {
  name: '',
  tagline: '',
  developer: '',
  neighborhood: '',
  city: 'João Pessoa',
  state: 'PB',
  address: '',
  map_embed_url: '',
  price_from: '',
  stage: 'launch',
  delivery_date: '',
  description: '',
  target_audience: '',
  differentials: [{ icon: 'Sparkles', title: '', text: '' }],
  amenities: [{ icon: 'Waves', name: '' }],
  units: [{ ...EMPTY_UNIT }],
  images: [],
  cover_image_url: '',
  video_url: '',
  seo_title: '',
  seo_description: '',
  display_order: 0,
  is_published: false,
  is_featured: false,
}

function toForm(d: Development): FormState {
  return {
    name: d.name,
    tagline: d.tagline ?? '',
    developer: d.developer ?? '',
    neighborhood: d.neighborhood ?? '',
    city: d.city ?? 'João Pessoa',
    state: d.state ?? 'PB',
    address: d.address ?? '',
    map_embed_url: d.map_embed_url ?? '',
    price_from: d.price_from != null ? String(d.price_from) : '',
    stage: d.stage,
    delivery_date: d.delivery_date ?? '',
    description: d.description ?? '',
    target_audience: d.target_audience ?? '',
    differentials: d.differentials?.length ? d.differentials : EMPTY.differentials,
    amenities: d.amenities?.length ? d.amenities : EMPTY.amenities,
    units: d.units?.length ? d.units : EMPTY.units,
    images: d.images ?? [],
    cover_image_url: d.cover_image_url ?? '',
    video_url: d.video_url ?? '',
    seo_title: d.seo_title ?? '',
    seo_description: d.seo_description ?? '',
    display_order: d.display_order,
    is_published: d.is_published,
    is_featured: d.is_featured,
  }
}

/** Empty strings become null so the database keeps them nullable. */
function num(value: string | number | null): number | null {
  if (value === '' || value === null) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function toPayload(form: FormState) {
  return {
    name: form.name,
    tagline: form.tagline,
    developer: form.developer,
    neighborhood: form.neighborhood,
    city: form.city,
    state: form.state,
    address: form.address,
    map_embed_url: form.map_embed_url,
    price_from: num(form.price_from),
    stage: form.stage,
    delivery_date: form.delivery_date,
    description: form.description,
    target_audience: form.target_audience,
    differentials: form.differentials.filter((d) => d.title.trim()),
    amenities: form.amenities.filter((a) => a.name.trim()),
    units: form.units.filter((u) => u.name.trim()),
    images: form.images.filter((i) => i.url.trim()),
    cover_image_url: form.cover_image_url,
    video_url: form.video_url,
    seo_title: form.seo_title,
    seo_description: form.seo_description,
    display_order: form.display_order,
    is_published: form.is_published,
    is_featured: form.is_featured,
  }
}

export function DevelopmentsManager({
  developments,
}: {
  developments: Development[]
}) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Development | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  const set = (patch: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...patch }))

  const openNew = () => {
    setEditingId(null)
    setForm(EMPTY)
    setOpen(true)
  }

  const openEdit = (d: Development) => {
    setEditingId(d.id)
    setForm(toForm(d))
    setOpen(true)
  }

  const save = () => {
    if (!form.name.trim()) {
      toast({ variant: 'destructive', title: 'Informe o nome do empreendimento' })
      return
    }

    startTransition(async () => {
      const payload = toPayload(form)
      const res = editingId
        ? await updateDevelopment(editingId, payload)
        : await createDevelopment(payload)

      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      } else {
        toast({ variant: 'success', title: 'Empreendimento salvo' })
        setOpen(false)
      }
    })
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await deleteDevelopment(deleteTarget.id)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      } else {
        toast({ variant: 'success', title: 'Empreendimento excluído' })
      }
      setDeleteTarget(null)
    })
  }

  const togglePublished = (d: Development) => {
    startTransition(async () => {
      const res = await toggleDevelopmentPublished(d.id, !d.is_published)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      }
    })
  }

  /* ── list item helpers ── */
  const setUnit = (i: number, patch: Partial<DevelopmentUnit>) =>
    set({ units: form.units.map((u, idx) => (idx === i ? { ...u, ...patch } : u)) })
  const addUnit = () => set({ units: [...form.units, { ...EMPTY_UNIT }] })
  const removeUnit = (i: number) =>
    set({ units: form.units.filter((_, idx) => idx !== i) })

  const setDiff = (i: number, patch: Partial<DevelopmentDifferential>) =>
    set({
      differentials: form.differentials.map((d, idx) =>
        idx === i ? { ...d, ...patch } : d
      ),
    })
  const addDiff = () =>
    set({ differentials: [...form.differentials, { icon: 'Sparkles', title: '', text: '' }] })
  const removeDiff = (i: number) =>
    set({ differentials: form.differentials.filter((_, idx) => idx !== i) })

  const setAmenity = (i: number, patch: Partial<DevelopmentAmenity>) =>
    set({
      amenities: form.amenities.map((a, idx) => (idx === i ? { ...a, ...patch } : a)),
    })
  const addAmenity = () =>
    set({ amenities: [...form.amenities, { icon: 'Waves', name: '' }] })
  const removeAmenity = (i: number) =>
    set({ amenities: form.amenities.filter((_, idx) => idx !== i) })

  const addImage = (url: string) =>
    set({ images: [...form.images, { url, alt: '' }] })
  const removeImage = (i: number) =>
    set({ images: form.images.filter((_, idx) => idx !== i) })

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" /> Novo empreendimento
        </Button>
      </div>

      {developments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Nenhum empreendimento cadastrado ainda.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Empreendimento</th>
                <th className="px-4 py-3">Bairro</th>
                <th className="px-4 py-3">Fase</th>
                <th className="px-4 py-3">A partir de</th>
                <th className="px-4 py-3">Plantas</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {developments.map((d) => (
                <tr key={d.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{d.name}</span>
                      {d.is_featured && <Badge variant="gold">Destaque</Badge>}
                    </div>
                    {d.developer && (
                      <span className="text-xs text-muted-foreground">
                        {d.developer}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {d.neighborhood || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {getDevelopmentStageLabel(d.stage)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {d.price_from ? formatCurrency(d.price_from) : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {d.units?.length ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => togglePublished(d)}
                        disabled={isPending}
                        title={d.is_published ? 'Despublicar' : 'Publicar'}
                        className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {d.is_published ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(d)}
                        aria-label="Editar"
                        className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(d)}
                        aria-label="Excluir"
                        className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
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
      )}

      {/* ── Form dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar empreendimento' : 'Novo empreendimento'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="geral">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="geral" className="flex-1">Geral</TabsTrigger>
              <TabsTrigger value="plantas" className="flex-1">Plantas</TabsTrigger>
              <TabsTrigger value="lazer" className="flex-1">Lazer</TabsTrigger>
              <TabsTrigger value="galeria" className="flex-1">Galeria</TabsTrigger>
              <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
            </TabsList>

            {/* ── Geral ── */}
            <TabsContent value="geral" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => set({ name: e.target.value })}
                    placeholder="Ex.: Omni Life Health"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Incorporadora</Label>
                  <Input
                    value={form.developer}
                    onChange={(e) => set({ developer: e.target.value })}
                    placeholder="Ex.: Massai"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Chamada (aparece abaixo do nome)</Label>
                <Input
                  value={form.tagline}
                  onChange={(e) => set({ tagline: e.target.value })}
                  placeholder="Uma frase que resume o projeto"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Bairro</Label>
                  <Input
                    value={form.neighborhood}
                    onChange={(e) => set({ neighborhood: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Cidade</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => set({ city: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Estado</Label>
                  <Input
                    value={form.state}
                    onChange={(e) => set({ state: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Endereço</Label>
                <Input
                  value={form.address}
                  onChange={(e) => set({ address: e.target.value })}
                  placeholder="Rua, número"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Fase da obra</Label>
                  <select
                    value={form.stage}
                    onChange={(e) => set({ stage: e.target.value as DevelopmentStage })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {DEVELOPMENT_STAGES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Entrega</Label>
                  <Input
                    value={form.delivery_date}
                    onChange={(e) => set({ delivery_date: e.target.value })}
                    placeholder="Ex.: Dez/2027"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>A partir de (R$)</Label>
                  <Input
                    value={form.price_from}
                    onChange={(e) => set({ price_from: e.target.value })}
                    placeholder="850000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Imagem de capa</Label>
                <SingleImageUpload
                  value={form.cover_image_url}
                  onChange={(url) => set({ cover_image_url: url })}
                  folder="developments"
                  previewClassName="h-40"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Sobre o empreendimento</Label>
                <Textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => set({ description: e.target.value })}
                  placeholder="Descreva o projeto. Cada parágrafo em uma linha."
                />
              </div>

              <div className="space-y-1.5">
                <Label>Público ideal</Label>
                <Textarea
                  rows={3}
                  value={form.target_audience}
                  onChange={(e) => set({ target_audience: e.target.value })}
                  placeholder="Para quem este empreendimento faz sentido?"
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Diferenciais</Label>
                {form.differentials.map((d, i) => (
                  <div key={i} className="relative rounded-lg border border-border p-4">
                    <button
                      type="button"
                      onClick={() => removeDiff(i)}
                      className="absolute right-3 top-3 rounded p-0.5 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="grid grid-cols-[140px_1fr] gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Ícone</Label>
                        <select
                          value={d.icon}
                          onChange={(e) => setDiff(i, { icon: e.target.value })}
                          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                        >
                          {ICON_OPTIONS.map((ic) => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Título</Label>
                        <Input
                          value={d.title}
                          onChange={(e) => setDiff(i, { title: e.target.value })}
                          placeholder="Ex.: Localização privilegiada"
                        />
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <Label className="text-xs">Descrição</Label>
                      <Textarea
                        rows={2}
                        value={d.text}
                        onChange={(e) => setDiff(i, { text: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addDiff}>
                  <Plus className="h-3.5 w-3.5" /> Adicionar diferencial
                </Button>
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_published}
                    onCheckedChange={(v) => set({ is_published: v })}
                  />
                  <Label className="font-normal">Publicado no site</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_featured}
                    onCheckedChange={(v) => set({ is_featured: v })}
                  />
                  <Label className="font-normal">Destaque na home</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="font-normal">Ordem</Label>
                  <Input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => set({ display_order: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
              </div>
            </TabsContent>

            {/* ── Plantas ── */}
            <TabsContent value="plantas" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                As opções de unidade deste empreendimento. Cada planta vira um
                card na página.
              </p>
              {form.units.map((u, i) => (
                <div key={i} className="relative rounded-lg border border-border p-4">
                  <button
                    type="button"
                    onClick={() => removeUnit(i)}
                    className="absolute right-3 top-3 rounded p-0.5 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome da planta</Label>
                    <Input
                      value={u.name}
                      onChange={(e) => setUnit(i, { name: e.target.value })}
                      placeholder="Ex.: 2 quartos com varanda"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Área (m²)</Label>
                      <Input
                        value={u.area ?? ''}
                        onChange={(e) => setUnit(i, { area: num(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Quartos</Label>
                      <Input
                        value={u.bedrooms ?? ''}
                        onChange={(e) => setUnit(i, { bedrooms: num(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Suítes</Label>
                      <Input
                        value={u.suites ?? ''}
                        onChange={(e) => setUnit(i, { suites: num(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Vagas</Label>
                      <Input
                        value={u.parking ?? ''}
                        onChange={(e) => setUnit(i, { parking: num(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">A partir de</Label>
                      <Input
                        value={u.price_from ?? ''}
                        onChange={(e) => setUnit(i, { price_from: num(e.target.value) })}
                        placeholder="850000"
                      />
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <Label className="text-xs">Imagem da planta</Label>
                    <SingleImageUpload
                      value={u.image}
                      onChange={(url) => setUnit(i, { image: url })}
                      folder="developments/units"
                      previewClassName="h-32"
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addUnit}>
                <Plus className="h-3.5 w-3.5" /> Adicionar planta
              </Button>
            </TabsContent>

            {/* ── Lazer ── */}
            <TabsContent value="lazer" className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Itens de lazer e estrutura do condomínio.
              </p>
              {form.amenities.map((a, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="w-40 space-y-1.5">
                    <Label className="text-xs">Ícone</Label>
                    <select
                      value={a.icon}
                      onChange={(e) => setAmenity(i, { icon: e.target.value })}
                      className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                    >
                      {ICON_OPTIONS.map((ic) => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">Item</Label>
                    <Input
                      value={a.name}
                      onChange={(e) => setAmenity(i, { name: e.target.value })}
                      placeholder="Ex.: Piscina adulto e infantil"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAmenity(i)}
                    className="mb-2.5 rounded p-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addAmenity}>
                <Plus className="h-3.5 w-3.5" /> Adicionar item
              </Button>
            </TabsContent>

            {/* ── Galeria ── */}
            <TabsContent value="galeria" className="space-y-4">
              <div className="space-y-1.5">
                <Label>Vídeo (YouTube, Vimeo ou Google Drive)</Label>
                <Input
                  value={form.video_url}
                  onChange={(e) => set({ video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label>Adicionar imagem à galeria</Label>
                <SingleImageUpload
                  value=""
                  onChange={(url) => url && addImage(url)}
                  folder="developments/gallery"
                  previewClassName="h-32"
                />
              </div>

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {form.images.map((img, i) => (
                    <div
                      key={`${img.url}-${i}`}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.alt || `Imagem ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── SEO ── */}
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-1.5">
                <Label>Título SEO</Label>
                <Input
                  value={form.seo_title}
                  onChange={(e) => set({ seo_title: e.target.value })}
                  placeholder="Deixe vazio para gerar automaticamente"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Descrição SEO</Label>
                <Textarea
                  rows={3}
                  value={form.seo_description}
                  onChange={(e) => set({ seo_description: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Mapa (URL de incorporação do Google Maps)</Label>
                <Input
                  value={form.map_embed_url}
                  onChange={(e) => set({ map_embed_url: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <p className="text-xs text-muted-foreground">
                  No Google Maps: Compartilhar → Incorporar um mapa → copie
                  apenas o endereço dentro de src=&quot;...&quot;
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="gold" onClick={save} disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Salvar empreendimento'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ── */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir empreendimento</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir{' '}
            <strong className="text-foreground">{deleteTarget?.name}</strong>? Esta
            ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Excluir'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
