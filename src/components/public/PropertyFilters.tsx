'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PROPERTY_TYPES, cn } from '@/lib/utils'

const NEIGHBORHOODS = [
  'Altiplano',
  'Cabo Branco',
  'Jardim Oceania',
  'Bessa',
  'Manaíra',
  'Tambaú',
  'Aeroclube',
  'Intermares',
]

const ROOM_OPTIONS = ['1', '2', '3', '4']

function FilterFields({
  onApply,
}: {
  onApply?: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [local, setLocal] = useState({
    purpose: searchParams.get('purpose') ?? '',
    type: searchParams.get('type') ?? '',
    neighborhood: searchParams.get('neighborhood') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    bedrooms: searchParams.get('bedrooms') ?? '',
    bathrooms: searchParams.get('bathrooms') ?? '',
    parking: searchParams.get('parking') ?? '',
    search: searchParams.get('search') ?? '',
    availability: searchParams.get('availability') ?? '',
  })

  useEffect(() => {
    setLocal({
      purpose: searchParams.get('purpose') ?? '',
      type: searchParams.get('type') ?? '',
      neighborhood: searchParams.get('neighborhood') ?? '',
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
      bedrooms: searchParams.get('bedrooms') ?? '',
      bathrooms: searchParams.get('bathrooms') ?? '',
      parking: searchParams.get('parking') ?? '',
      search: searchParams.get('search') ?? '',
      availability: searchParams.get('availability') ?? '',
    })
  }, [searchParams])

  const apply = useCallback(() => {
    const params = new URLSearchParams()
    Object.entries(local).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    // preserve special flags
    ;['isLuxury', 'isLaunch', 'sort'].forEach((k) => {
      const v = searchParams.get(k)
      if (v) params.set(k, v)
    })
    router.push(`${pathname}?${params.toString()}`)
    onApply?.()
  }, [local, pathname, router, searchParams, onApply])

  const clear = () => {
    setLocal({
      purpose: '',
      type: '',
      neighborhood: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      parking: '',
      search: '',
      availability: '',
    })
    router.push(pathname)
    onApply?.()
  }

  const set = (key: keyof typeof local, value: string) =>
    setLocal((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label>Buscar</Label>
        <Input
          placeholder="Bairro, código..."
          value={local.search}
          onChange={(e) => set('search', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Finalidade</Label>
        <Select
          value={local.purpose || 'all'}
          onValueChange={(v) => set('purpose', v === 'all' ? '' : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="sale">Comprar</SelectItem>
            <SelectItem value="rent">Alugar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Tipo de imóvel</Label>
        <Select
          value={local.type || 'all'}
          onValueChange={(v) => set('type', v === 'all' ? '' : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {PROPERTY_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Bairro</Label>
        <Select
          value={local.neighborhood || 'all'}
          onValueChange={(v) => set('neighborhood', v === 'all' ? '' : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os bairros</SelectItem>
            {NEIGHBORHOODS.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Faixa de preço (R$)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Mín."
            value={local.minPrice}
            onChange={(e) => set('minPrice', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Máx."
            value={local.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Quartos (mín.)</Label>
        <div className="flex gap-2">
          {ROOM_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() =>
                set('bedrooms', local.bedrooms === opt ? '' : opt)
              }
              className={cn(
                'h-9 flex-1 rounded-md border text-sm font-medium transition-colors',
                local.bedrooms === opt
                  ? 'border-brand-navy bg-brand-navy text-white'
                  : 'border-input hover:border-brand-gold'
              )}
            >
              {opt}+
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Vagas (mín.)</Label>
        <div className="flex gap-2">
          {ROOM_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => set('parking', local.parking === opt ? '' : opt)}
              className={cn(
                'h-9 flex-1 rounded-md border text-sm font-medium transition-colors',
                local.parking === opt
                  ? 'border-brand-navy bg-brand-navy text-white'
                  : 'border-input hover:border-brand-gold'
              )}
            >
              {opt}+
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
          <input
            type="checkbox"
            checked={local.availability === 'available'}
            onChange={(e) => set('availability', e.target.checked ? 'available' : '')}
            className="h-4 w-4 rounded border-border accent-brand-gold"
          />
          Ocultar vendidos e alugados
        </label>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button variant="gold" onClick={apply}>
          Aplicar filtros
        </Button>
        <Button variant="ghost" size="sm" onClick={clear}>
          Limpar filtros
        </Button>
      </div>
    </div>
  )
}

export function PropertyFilters() {
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 flex items-center gap-2 font-serif text-lg font-medium text-brand-navy">
          <SlidersHorizontal className="h-5 w-5 text-brand-gold" />
          Filtros
        </h2>
        <FilterFields />
      </div>
    </aside>
  )
}

export function MobileFilters() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-brand-gold" />
            Filtros
          </DialogTitle>
        </DialogHeader>
        <FilterFields onApply={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
