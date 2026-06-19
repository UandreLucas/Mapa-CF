'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Star, Loader2, LinkIcon, Plus } from 'lucide-react'
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((img, i) => (
            <div
              key={`${img.url}-${i}`}
              className={cn(
                'group relative aspect-square overflow-hidden rounded-lg border-2',
                img.is_cover ? 'border-brand-gold' : 'border-transparent'
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `Imagem ${i + 1}`}
                fill
                sizes="200px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setCover(i)}
                  className="rounded-full bg-white/90 p-2 text-brand-navy hover:bg-white"
                  title="Definir como capa"
                >
                  <Star
                    className={cn(
                      'h-4 w-4',
                      img.is_cover && 'fill-brand-gold text-brand-gold'
                    )}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-full bg-white/90 p-2 text-destructive hover:bg-white"
                  title="Remover"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {img.is_cover && (
                <span className="absolute left-1.5 top-1.5 rounded bg-brand-gold px-1.5 py-0.5 text-[10px] font-semibold text-brand-navy">
                  Capa
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
