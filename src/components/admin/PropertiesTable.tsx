'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Star,
  CheckCircle2,
  Copy,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  deleteProperty,
  updatePropertyStatus,
  togglePropertyFlag,
  duplicateProperty,
} from '@/app/admin/imoveis/actions'
import {
  formatCurrency,
  getPropertyTypeLabel,
  PROPERTY_STATUSES,
} from '@/lib/utils'
import type { PropertyWithImages } from '@/types'

const STATUS_VARIANT: Record<string, string> = {
  draft: 'bg-amber-100 text-amber-700',
  published: 'bg-green-100 text-green-700',
  sold: 'bg-blue-100 text-blue-700',
  rented: 'bg-purple-100 text-purple-700',
  archived: 'bg-neutral-200 text-neutral-600',
}

const FALLBACK =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=60'

export function PropertiesTable({
  properties,
}: {
  properties: PropertyWithImages[]
}) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<PropertyWithImages | null>(
    null
  )

  const handleDelete = () => {
    if (!deleteTarget) return
    const target = deleteTarget
    startTransition(async () => {
      const res = await deleteProperty(target.id)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      } else {
        toast({ variant: 'success', title: 'Imóvel removido' })
      }
      setDeleteTarget(null)
    })
  }

  const changeStatus = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updatePropertyStatus(id, status)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      } else {
        toast({ variant: 'success', title: 'Status atualizado' })
      }
    })
  }

  const handleDuplicate = (p: PropertyWithImages) => {
    startTransition(async () => {
      const res = await duplicateProperty(p.id)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      } else {
        toast({
          variant: 'success',
          title: 'Imóvel duplicado',
          description: 'Uma cópia foi criada como rascunho.',
        })
      }
    })
  }

  const toggleFeatured = (p: PropertyWithImages) => {
    startTransition(async () => {
      await togglePropertyFlag(p.id, 'is_featured', !p.is_featured)
      toast({
        variant: 'success',
        title: p.is_featured ? 'Removido dos destaques' : 'Adicionado aos destaques',
      })
    })
  }

  if (!properties.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <p className="text-muted-foreground">Nenhum imóvel cadastrado.</p>
        <Button asChild variant="gold" className="mt-4">
          <Link href="/admin/imoveis/novo">Cadastrar primeiro imóvel</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Imóvel</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Destaque</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {properties.map((p) => {
                const cover =
                  p.images?.find((i) => i.is_cover)?.url ||
                  p.images?.[0]?.url ||
                  FALLBACK
                return (
                  <tr key={p.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={cover}
                            alt={p.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium text-foreground">
                            {p.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.code} · {p.neighborhood}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {getPropertyTypeLabel(p.type)}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-navy">
                      {p.hide_price
                        ? 'Sob consulta'
                        : formatCurrency(p.price)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`${STATUS_VARIANT[p.status]} border-0`}
                      >
                        {PROPERTY_STATUSES.find((s) => s.value === p.status)
                          ?.label ?? p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(p)}
                        disabled={isPending}
                        aria-label="Alternar destaque"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            p.is_featured
                              ? 'fill-brand-gold text-brand-gold'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-md p-2 hover:bg-secondary">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/imoveis/${p.id}`}>
                              <Pencil className="h-4 w-4" /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/imoveis/${p.slug}`} target="_blank">
                              <Eye className="h-4 w-4" /> Ver no site
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(p)}>
                            <Copy className="h-4 w-4" /> Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {p.status !== 'published' && (
                            <DropdownMenuItem
                              onClick={() => changeStatus(p.id, 'published')}
                            >
                              <CheckCircle2 className="h-4 w-4" /> Publicar
                            </DropdownMenuItem>
                          )}
                          {p.status === 'published' && (
                            <DropdownMenuItem
                              onClick={() => changeStatus(p.id, 'draft')}
                            >
                              <Pencil className="h-4 w-4" /> Despublicar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => changeStatus(p.id, 'sold')}
                          >
                            Marcar como vendido
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(p)}
                          >
                            <Trash2 className="h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir imóvel</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-foreground">
              {deleteTarget?.title}
            </span>
            ? Esta ação irá arquivar o imóvel.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
