'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, LinkIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface SingleImageUploadProps {
  value: string
  onChange: (url: string) => void
  /** Sub-folder inside the bucket, e.g. "neighborhoods". */
  folder?: string
  /** Height of the preview area. */
  previewClassName?: string
}

const BUCKET = 'property-images'

export function SingleImageUpload({
  value,
  onChange,
  folder = 'neighborhoods',
  previewClassName = 'h-40',
}: SingleImageUploadProps) {
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [showUrl, setShowUrl] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Selecione um arquivo de imagem' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Imagem muito grande',
        description: 'O limite é 10MB. Reduza a imagem e tente novamente.',
      })
      return
    }

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

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
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path)
      onChange(publicUrl)
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
    onChange(url)
    setUrlInput('')
    setShowUrl(false)
  }

  if (value) {
    return (
      <div className="space-y-2">
        <div className={cn('group relative overflow-hidden rounded-lg border border-border', previewClassName)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Imagem selecionada" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Trocar
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => onChange('')}>
              <X className="h-4 w-4" />
              Remover
            </Button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-6 text-center transition-colors hover:border-brand-gold',
          previewClassName
        )}
      >
        {uploading ? (
          <Loader2 className="mb-2 h-7 w-7 animate-spin text-brand-gold" />
        ) : (
          <Upload className="mb-2 h-7 w-7 text-muted-foreground" />
        )}
        <p className="text-sm font-medium text-foreground">
          {uploading ? 'Enviando...' : 'Clique ou arraste a imagem aqui'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG ou WEBP até 10MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />

      {showUrl ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="https://..."
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
          <Button type="button" variant="outline" size="sm" onClick={addUrl}>
            Usar
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowUrl(true)}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          ou colar a URL de uma imagem
        </button>
      )}
    </div>
  )
}
