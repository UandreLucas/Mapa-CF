'use client'

import { useState, useTransition, useEffect } from 'react'
import {
  Phone,
  Mail,
  MessageCircle,
  MoreVertical,
  Trash2,
  Eye,
  Loader2,
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  updateLeadStatus,
  deleteLead,
  addLeadNote,
  getLeadNotes,
} from '@/app/admin/leads/actions'
import {
  formatDateTime,
  getLeadStatusMeta,
  getLeadTypeLabel,
  buildWhatsAppUrl,
  LEAD_STATUSES,
} from '@/lib/utils'
import type { LeadWithProperty, LeadNote } from '@/types'

export function LeadsTable({ leads }: { leads: LeadWithProperty[] }) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<LeadWithProperty | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LeadWithProperty | null>(null)
  const [notes, setNotes] = useState<LeadNote[]>([])
  const [noteInput, setNoteInput] = useState('')
  const [loadingNotes, setLoadingNotes] = useState(false)

  useEffect(() => {
    if (!selected) return
    setLoadingNotes(true)
    getLeadNotes(selected.id)
      .then((data) => setNotes(data as LeadNote[]))
      .finally(() => setLoadingNotes(false))
  }, [selected])

  const changeStatus = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateLeadStatus(id, status)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      } else {
        toast({ variant: 'success', title: 'Status atualizado' })
        if (selected?.id === id) {
          setSelected({ ...selected, status: status as LeadWithProperty['status'] })
        }
      }
    })
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    const target = deleteTarget
    startTransition(async () => {
      const res = await deleteLead(target.id)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
      } else {
        toast({ variant: 'success', title: 'Lead removido' })
      }
      setDeleteTarget(null)
    })
  }

  const submitNote = () => {
    if (!selected || !noteInput.trim()) return
    const content = noteInput.trim()
    startTransition(async () => {
      const res = await addLeadNote(selected.id, content)
      if (res.error) {
        toast({ variant: 'destructive', title: 'Erro', description: res.error })
        return
      }
      const fresh = await getLeadNotes(selected.id)
      setNotes(fresh as LeadNote[])
      setNoteInput('')
      toast({ variant: 'success', title: 'Anotação adicionada' })
    })
  }

  if (!leads.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
        Nenhum lead encontrado.
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
                <th className="px-4 py-3 font-medium">Contato</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Imóvel</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => {
                const meta = getLeadStatusMeta(lead.status)
                return (
                  <tr key={lead.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {getLeadTypeLabel(lead.type)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {lead.property ? (
                        <span className="line-clamp-1">{lead.property.title}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={lead.status}
                        onValueChange={(v) => changeStatus(lead.id, v)}
                      >
                        <SelectTrigger className="h-8 w-40 border-0 bg-transparent p-0">
                          <Badge className={`${meta.color} border-0`}>
                            {meta.label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {LEAD_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDateTime(lead.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-md p-2 hover:bg-secondary">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setSelected(lead)}>
                            <Eye className="h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                          {lead.phone && (
                            <DropdownMenuItem asChild>
                              <a
                                href={buildWhatsAppUrl(lead.phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MessageCircle className="h-4 w-4" /> WhatsApp
                              </a>
                            </DropdownMenuItem>
                          )}
                          {lead.email && (
                            <DropdownMenuItem asChild>
                              <a href={`mailto:${lead.email}`}>
                                <Mail className="h-4 w-4" /> E-mail
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(lead)}
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

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Telefone" value={selected.phone || '—'} />
                <Info label="E-mail" value={selected.email || '—'} />
                <Info label="Tipo" value={getLeadTypeLabel(selected.type)} />
                <Info label="Origem" value={selected.source || '—'} />
              </div>

              {selected.property && (
                <Info
                  label="Imóvel de interesse"
                  value={`${selected.property.title} (${selected.property.code})`}
                />
              )}

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Mensagem
                </p>
                <p className="rounded-md bg-secondary/50 p-3 text-sm">
                  {selected.message || '—'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.phone && (
                  <Button asChild variant="whatsapp" size="sm">
                    <a
                      href={buildWhatsAppUrl(selected.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                )}
                <Select
                  value={selected.status}
                  onValueChange={(v) => changeStatus(selected.id, v)}
                >
                  <SelectTrigger className="h-9 w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="border-t border-border pt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Anotações
                </p>
                <div className="flex gap-2">
                  <Textarea
                    rows={2}
                    placeholder="Adicionar anotação interna..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="gold"
                    onClick={submitNote}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Salvar'
                    )}
                  </Button>
                </div>

                <div className="mt-3 space-y-2">
                  {loadingNotes ? (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  ) : notes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma anotação.
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-md border border-border p-3 text-sm"
                      >
                        <p>{note.content}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDateTime(note.created_at)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir lead</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Deseja excluir o lead de{' '}
            <span className="font-medium text-foreground">
              {deleteTarget?.name}
            </span>
            ? Esta ação é permanente.
          </p>
          <div className="flex justify-end gap-3">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-foreground">{value}</p>
    </div>
  )
}
