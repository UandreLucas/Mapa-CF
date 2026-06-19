'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
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

interface SearchBarProps {
  variant?: 'hero' | 'inline'
  className?: string
}

export function SearchBar({ variant = 'hero', className }: SearchBarProps) {
  const router = useRouter()
  const [purpose, setPurpose] = useState('sale')
  const [type, setType] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [search, setSearch] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (purpose) params.set('purpose', purpose)
    if (type) params.set('type', type)
    if (neighborhood) params.set('neighborhood', neighborhood)
    if (search.trim()) params.set('search', search.trim())
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <div
      className={cn(
        'w-full rounded-xl bg-white/95 p-4 shadow-2xl backdrop-blur md:p-5',
        variant === 'hero' && 'border border-white/20',
        className
      )}
    >
      {/* Purpose tabs */}
      <div className="mb-4 inline-flex rounded-lg bg-muted p-1">
        {[
          { value: 'sale', label: 'Comprar' },
          { value: 'rent', label: 'Alugar' },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setPurpose(opt.value)}
            className={cn(
              'rounded-md px-5 py-1.5 text-sm font-medium transition-colors',
              purpose === opt.value
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div>
          <Input
            placeholder="Buscar por bairro, código ou palavra-chave"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-12 border-input bg-background"
          />
        </div>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Tipo de imóvel" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={neighborhood} onValueChange={setNeighborhood}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Bairro" />
          </SelectTrigger>
          <SelectContent>
            {NEIGHBORHOODS.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleSearch}
          variant="gold"
          size="lg"
          className="h-12 md:w-14 md:px-0"
        >
          <Search className="h-5 w-5" />
          <span className="md:hidden">Buscar</span>
        </Button>
      </div>
    </div>
  )
}
