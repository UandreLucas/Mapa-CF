'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, ImageIcon, Home, MapPin, DollarSign, ListChecks } from 'lucide-react'
import { propertySchema, type PropertyFormValues } from '@/lib/validations/property'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUpload } from './ImageUpload'
import { useToast } from '@/hooks/use-toast'
import { createProperty, updateProperty } from '@/app/admin/imoveis/actions'
import { PROPERTY_TYPES, PROPERTY_STATUSES } from '@/lib/utils'
import type { Feature, Neighborhood } from '@/types'

interface PropertyFormProps {
  features: Feature[]
  neighborhoods: Neighborhood[]
  initialData?: Partial<PropertyFormValues> & { id?: string }
}

const NUMERIC_FIELDS = [
  { name: 'bedrooms', label: 'Quartos' },
  { name: 'suites', label: 'Suítes' },
  { name: 'bathrooms', label: 'Banheiros' },
  { name: 'parking', label: 'Vagas' },
] as const

export function PropertyForm({
  features,
  neighborhoods,
  initialData,
}: PropertyFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState('basico')
  const isEdit = !!initialData?.id

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title ?? '',
      code: initialData?.code ?? '',
      purpose: initialData?.purpose ?? 'sale',
      type: initialData?.type ?? 'apartamento',
      status: initialData?.status ?? 'draft',
      city: initialData?.city ?? 'João Pessoa',
      state: initialData?.state ?? 'PB',
      neighborhood: initialData?.neighborhood ?? '',
      neighborhood_id: initialData?.neighborhood_id ?? null,
      address: initialData?.address ?? '',
      number: initialData?.number ?? '',
      complement: initialData?.complement ?? '',
      zip_code: initialData?.zip_code ?? '',
      hide_address: initialData?.hide_address ?? false,
      price: initialData?.price ?? null,
      hide_price: initialData?.hide_price ?? false,
      condo_fee: initialData?.condo_fee ?? null,
      iptu: initialData?.iptu ?? null,
      private_area: initialData?.private_area ?? null,
      total_area: initialData?.total_area ?? null,
      bedrooms: initialData?.bedrooms ?? 0,
      suites: initialData?.suites ?? 0,
      bathrooms: initialData?.bathrooms ?? 0,
      parking: initialData?.parking ?? 0,
      year_built: initialData?.year_built ?? null,
      description: initialData?.description ?? '',
      video_url: initialData?.video_url ?? '',
      virtual_tour_url: initialData?.virtual_tour_url ?? '',
      is_featured: initialData?.is_featured ?? false,
      is_luxury: initialData?.is_luxury ?? false,
      is_launch: initialData?.is_launch ?? false,
      is_furnished: initialData?.is_furnished ?? false,
      accepts_pets: initialData?.accepts_pets ?? false,
      seo_title: initialData?.seo_title ?? '',
      seo_description: initialData?.seo_description ?? '',
      features: initialData?.features ?? [],
      images: initialData?.images ?? [],
    },
  })

  const selectedFeatures = watch('features') ?? []
  const images = watch('images') ?? []

  const toggleFeature = (id: string) => {
    const current = selectedFeatures
    setValue(
      'features',
      current.includes(id)
        ? current.filter((f) => f !== id)
        : [...current, id]
    )
  }

  const onSubmit = (values: PropertyFormValues) => {
    startTransition(async () => {
      const res = isEdit
        ? await updateProperty(initialData!.id!, values)
        : await createProperty(values)

      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
        return
      }
      toast({
        variant: 'success',
        title: isEdit ? 'Imóvel atualizado' : 'Imóvel criado',
      })
      router.push('/admin/imoveis')
      router.refresh()
    })
  }

  const onError = () => {
    toast({
      variant: 'destructive',
      title: 'Verifique os campos',
      description: 'Há campos obrigatórios não preenchidos.',
    })
  }

  // Group features by category
  const grouped = features.reduce<Record<string, Feature[]>>((acc, f) => {
    const cat = f.category ?? 'outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(f)
    return acc
  }, {})

  const CATEGORY_LABELS: Record<string, string> = {
    lazer: 'Lazer',
    condominio: 'Condomínio',
    imovel: 'Imóvel',
    outros: 'Outros',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-secondary/60 p-1">
          <TabsTrigger value="basico" className="gap-2">
            <Home className="h-4 w-4" /> Básico
          </TabsTrigger>
          <TabsTrigger value="local" className="gap-2">
            <MapPin className="h-4 w-4" /> Localização
          </TabsTrigger>
          <TabsTrigger value="valores" className="gap-2">
            <DollarSign className="h-4 w-4" /> Valores & Detalhes
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <ListChecks className="h-4 w-4" /> Características
          </TabsTrigger>
          <TabsTrigger value="midia" className="gap-2">
            <ImageIcon className="h-4 w-4" /> Mídia
          </TabsTrigger>
        </TabsList>

        {/* BÁSICO */}
        <TabsContent value="basico" className="mt-6">
          <div className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div className="space-y-1.5">
              <Label htmlFor="title">Título do anúncio *</Label>
              <Input
                id="title"
                placeholder="Ex.: Apartamento alto padrão com vista mar no Cabo Branco"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Finalidade *</Label>
                <Controller
                  control={control}
                  name="purpose"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Venda</SelectItem>
                        <SelectItem value="rent">Aluguel</SelectItem>
                        <SelectItem value="both">Venda e Aluguel</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Tipo *</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Status *</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">Código (opcional)</Label>
                <Input
                  id="code"
                  placeholder="Gerado automaticamente se vazio"
                  {...register('code')}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={6}
                placeholder="Descreva o imóvel, seus diferenciais e o entorno..."
                {...register('description')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FlagSwitch
                label="Destaque"
                hint="Aparece na home"
                checked={watch('is_featured')}
                onChange={(v) => setValue('is_featured', v)}
              />
              <FlagSwitch
                label="Alto padrão"
                hint="Coleção luxo"
                checked={watch('is_luxury')}
                onChange={(v) => setValue('is_luxury', v)}
              />
              <FlagSwitch
                label="Lançamento"
                checked={watch('is_launch')}
                onChange={(v) => setValue('is_launch', v)}
              />
            </div>
          </div>
        </TabsContent>

        {/* LOCALIZAÇÃO */}
        <TabsContent value="local" className="mt-6">
          <div className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Bairro *</Label>
                <Controller
                  control={control}
                  name="neighborhood"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v)
                        const match = neighborhoods.find((n) => n.name === v)
                        setValue('neighborhood_id', match?.id ?? null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o bairro" />
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods.map((n) => (
                          <SelectItem key={n.id} value={n.name}>
                            {n.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.neighborhood && (
                  <p className="text-xs text-destructive">
                    {errors.neighborhood.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">Cidade *</Label>
                <Input id="city" {...register('city')} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-[2fr_1fr_1fr]">
              <div className="space-y-1.5">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Rua / Avenida" {...register('address')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="number">Número</Label>
                <Input id="number" {...register('number')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="zip_code">CEP</Label>
                <Input id="zip_code" {...register('zip_code')} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                placeholder="Apto, bloco, referência..."
                {...register('complement')}
              />
            </div>

            <FlagSwitch
              label="Ocultar endereço exato"
              hint="Mostra apenas bairro e cidade no site"
              checked={watch('hide_address')}
              onChange={(v) => setValue('hide_address', v)}
            />
          </div>
        </TabsContent>

        {/* VALORES & DETALHES */}
        <TabsContent value="valores" className="mt-6">
          <div className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="condo_fee">Condomínio (R$)</Label>
                <Input
                  id="condo_fee"
                  type="number"
                  step="0.01"
                  {...register('condo_fee')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="iptu">IPTU anual (R$)</Label>
                <Input id="iptu" type="number" step="0.01" {...register('iptu')} />
              </div>
            </div>

            <FlagSwitch
              label="Ocultar preço"
              hint="Exibe 'Sob consulta' no site"
              checked={watch('hide_price')}
              onChange={(v) => setValue('hide_price', v)}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="total_area">Área total (m²)</Label>
                <Input
                  id="total_area"
                  type="number"
                  step="0.01"
                  {...register('total_area')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="private_area">Área privativa (m²)</Label>
                <Input
                  id="private_area"
                  type="number"
                  step="0.01"
                  {...register('private_area')}
                />
              </div>
            </div>

            <div className="grid gap-5 grid-cols-2 sm:grid-cols-4">
              {NUMERIC_FIELDS.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <Label htmlFor={f.name}>{f.label}</Label>
                  <Input id={f.name} type="number" {...register(f.name)} />
                </div>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="year_built">Ano de construção</Label>
                <Input id="year_built" type="number" {...register('year_built')} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FlagSwitch
                label="Mobiliado"
                checked={watch('is_furnished')}
                onChange={(v) => setValue('is_furnished', v)}
              />
              <FlagSwitch
                label="Aceita pets"
                checked={watch('accepts_pets')}
                onChange={(v) => setValue('accepts_pets', v)}
              />
            </div>
          </div>
        </TabsContent>

        {/* CARACTERÍSTICAS */}
        <TabsContent value="features" className="mt-6">
          <div className="space-y-6 rounded-xl border border-border bg-card p-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {CATEGORY_LABELS[category] ?? category}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {items.map((feature) => (
                    <label
                      key={feature.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2.5 text-sm transition-colors hover:border-brand-gold"
                    >
                      <Checkbox
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => toggleFeature(feature.id)}
                      />
                      {feature.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {features.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma característica cadastrada.
              </p>
            )}
          </div>
        </TabsContent>

        {/* MÍDIA */}
        <TabsContent value="midia" className="mt-6">
          <div className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div>
              <Label className="mb-3 block">Fotos do imóvel</Label>
              <ImageUpload
                value={images}
                onChange={(imgs) => setValue('images', imgs)}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="video_url">URL do vídeo (YouTube/Vimeo)</Label>
                <Input
                  id="video_url"
                  placeholder="https://youtube.com/..."
                  {...register('video_url')}
                />
                {errors.video_url && (
                  <p className="text-xs text-destructive">
                    {errors.video_url.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="virtual_tour_url">Tour virtual (URL)</Label>
                <Input
                  id="virtual_tour_url"
                  placeholder="https://..."
                  {...register('virtual_tour_url')}
                />
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                SEO
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="seo_title">Título SEO</Label>
                  <Input id="seo_title" {...register('seo_title')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seo_description">Descrição SEO</Label>
                  <Textarea
                    id="seo_description"
                    rows={2}
                    {...register('seo_description')}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sticky actions */}
      <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/imoveis')}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="gold" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? 'Salvar alterações' : 'Criar imóvel'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

function FlagSwitch({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border p-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
