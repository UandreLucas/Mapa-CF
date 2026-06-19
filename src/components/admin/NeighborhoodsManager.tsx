'use client'

import { useState, useTransition } from 'react'
import { Pencil, Trash2, Plus, Loader2, Eye, EyeOff } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'
import {
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
  toggleNeighborhoodActive,
} from '@/app/admin/bairros/actions'
import type { Neighborhood } from '@/types'

type FormState = {
  name: string
  description: string
  cover_image_url: string
  display_order: number
  is_active: boolean
  is_featured: boolean
}

const EMPTY: FormState = {
  name: '',
  description: '',
  cover_image_url: '',
  display_order: 0,
  is_active: true,
  is_featured: false,
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

  const openNew = () => {
    setEditingId(null)
    setForm({ ...EMPTY, display_order: neighborhoods.length + 1 })
    setDialogOpen(true)
  }

  const openEdit = (n: Neighborhood) => {
    setEditingId(n.id)
    setForm({
      name: n.name,
      description: n.description ?? '',
      cover_image_url: n.cover_image_url ?? '',
      display_order: n.display_order,
      is_active: n.is_active,
      is_featured: n.is_featured,
    })
    setDialogOpen(true)
  }

  const save = () => {
    if (!form.name.trim()) {
      toast({ variant: 'destructive', title: 'Informe o nome do bairro' })
      return
    }
    startTransition(async () => {
      const res = editingId
        ? await updateNeighborhood(editingId, form)
        : await createNeighborhood(form)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
        return
      }
      toast({
        variant: 'success',
        title: editingId ? 'Bairro atualizado' : 'Bairro criado',
      })
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
    startTransition(async () => {
      await toggleNeighborhoodActive(n.id, !n.is_active)
    })
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" />
          Novo bairro
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Ordem</th>
              <th className="px-4 py-3 font-medium">Bairro</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Destaque</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {neighborhoods.map((n) => (
              <tr key={n.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3 text-muted-foreground">
                  {n.display_order}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{n.name}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {n.description}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(n)}
                    disabled={isPending}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    {n.is_active ? (
                      <Badge variant="success">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {n.is_featured ? (
                    <Eye className="h-4 w-4 text-brand-gold" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
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
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar bairro' : 'Novo bairro'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex.: Altiplano"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL da imagem de capa</Label>
              <Input
                value={form.cover_image_url}
                onChange={(e) =>
                  setForm({ ...form, cover_image_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Ordem de exibição</Label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm({ ...form, display_order: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <Label>Ativo</Label>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <Label>Destaque na home</Label>
              <Switch
                checked={form.is_featured}
                onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="gold" onClick={save} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir bairro</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Deseja excluir{' '}
            <span className="font-medium text-foreground">
              {deleteTarget?.name}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={remove} disabled={isPending}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
