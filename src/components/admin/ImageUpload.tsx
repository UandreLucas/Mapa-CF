'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Star, Loader2, LinkIcon, Plus, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export interface UploadedImage {
  url: string
  alt?: string | null
  is_cover: boolean
  display_order: number
}

interface ImageUploadProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
}

const BUCKET = 'property-images'

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [previewSize, setPreviewSize] = useState<'small' | 'medium' | 'large'>('small')

  const GRID_COLS: Record<typeof previewSize, string> = {
    small: 'grid-cols-3 sm:grid-cols-5 md:grid-cols-6',
    medium: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    large: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return
    setUploading(true)
    const supabase = createClient()
    const uploaded: UploadedImage[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Falha no upload',
          description:
            'Verifique se o bucket "property-images" existe no Supabase Storage.',
        })
        continue
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path)
      uploaded.push({
        url: publicUrl,
        is_cover: false,
        display_order: value.length + uploaded.length,
      })
    }

    if (uploaded.length) {
      const next = [...value, ...uploaded]
      if (!next.some((i) => i.is_cover)) next[0].is_cover = true
      onChange(next)
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const addUrl = () => {
    const url = urlInput.trim()
    if (!url.startsWith('http')) {
      toast({ variant: 'destructive', title: 'URL inválida' })
      return
    }
    const next = [
      ...value,
      { url, is_cover: value.length === 0, display_order: value.length },
    ]
    onChange(next)
    setUrlInput('')
  }

  const remove = (index: number) => {
    const next = value.filter((_, i) => i !== index)
    if (next.length && !next.some((i) => i.is_cover)) next[0].is_cover = true
    onChange(next.map((img, i) => ({ ...img, display_order: i })))
  }

  const setCover = (index: number) => {
    onChange(value.map((img, i) => ({ ...img, is_cover: i === index })))
  }

  /** Move image from one position to another and re-index display_order. */
  const reorder = (from: number, to: number) => {
    if (from === to) return
    const next = [...value]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next.map((img, i) => ({ ...img, display_order: i })))
  }

  const handleDrop = (target: number) => {
    if (dragIndex !== null) reorder(dragIndex, target)
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-8 text-center transition-colors hover:border-brand-gold"
      >
        {uploading ? (
          <Loader2 className="mb-2 h-8 w-8 animate-spin text-brand-gold" />
        ) : (
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        )}
        <p className="text-sm font-medium text-foreground">
          {uploading ? 'Enviando...' : 'Clique ou arraste imagens aqui'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG ou WEBP até 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ou cole a URL de uma imagem"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrl()
              }
            }}
            className="pl-9"
          />
        </div>
        <Button type="button" variant="outline" onClick={addUrl}>
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {/* Grid */}
      {value.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GripVertical className="h-3.5 w-3.5" />
              Arraste para reordenar. A primeira posição define a sequência da galeria.
            </p>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/40 p-0.5">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPreviewSize(size)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    previewSize === size
                      ? 'bg-brand-navy text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande'}
                </button>
              ))}
            </div>
          </div>
          <div className={cn('grid gap-3', GRID_COLS[previewSize])}>
            {value.map((img, i) => (
              <div
                key={`${img.url}-${i}`}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragEnter={() => setOverIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                onDragEnd={() => {
                  setDragIndex(null)
                  setOverIndex(null)
                }}
                className={cn(
                  'group relative aspect-square cursor-grab overflow-hidden rounded-lg border-2 transition-all active:cursor-grabbing',
                  img.is_cover ? 'border-brand-gold' : 'border-transparent',
                  dragIndex === i && 'opacity-40',
                  overIndex === i && dragIndex !== i && 'ring-2 ring-brand-gold ring-offset-2'
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Imagem ${i + 1}`}
                  fill
                  sizes="200px"
                  className="pointer-events-none object-cover"
                />

                {/* Position number */}
                <span
                  className={cn(
                    'absolute right-1 top-1 flex items-center justify-center rounded-full bg-black/60 font-semibold text-white',
                    previewSize === 'small' ? 'h-4 w-4 text-[9px]' : 'h-6 w-6 text-[11px]'
                  )}
                >
                  {i + 1}
                </span>

                {/* Drag handle hint (hidden on small) */}
                {previewSize !== 'small' && (
                  <span className="absolute left-1.5 bottom-1.5 rounded bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="h-3.5 w-3.5" />
                  </span>
                )}

                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100',
                    previewSize === 'small' ? 'gap-1' : 'gap-2'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setCover(i)}
                    className={cn(
                      'rounded-full bg-white/90 text-brand-navy hover:bg-white',
                      previewSize === 'small' ? 'p-1' : 'p-2'
                    )}
                    title="Definir como capa"
                  >
                    <Star
                      className={cn(
                        previewSize === 'small' ? 'h-3 w-3' : 'h-4 w-4',
                        img.is_cover && 'fill-brand-gold text-brand-gold'
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className={cn(
                      'rounded-full bg-white/90 text-destructive hover:bg-white',
                      previewSize === 'small' ? 'p-1' : 'p-2'
                    )}
                    title="Remover"
                  >
                    <X className={previewSize === 'small' ? 'h-3 w-3' : 'h-4 w-4'} />
                  </button>
                </div>
                {img.is_cover && (
                  <span
                    className={cn(
                      'absolute left-1 top-1 rounded bg-brand-gold font-semibold text-brand-navy',
                      previewSize === 'small'
                        ? 'px-1 py-0.5 text-[8px]'
                        : 'px-1.5 py-0.5 text-[10px]'
                    )}
                  >
                    Capa
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
