'use client'

import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toEmbedUrl, cn } from '@/lib/utils'
import type { DevelopmentImage } from '@/types'

interface DevelopmentGalleryProps {
  images: DevelopmentImage[]
  videoUrl?: string | null
  title: string
}

export function DevelopmentGallery({
  images,
  videoUrl,
  title,
}: DevelopmentGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length]
  )
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length]
  )

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, next, prev])

  const openAt = (i: number) => {
    setCurrent(i)
    setLightboxOpen(true)
  }

  return (
    <div className="space-y-6">
      {videoUrl && (
        <button
          type="button"
          onClick={() => setVideoOpen(true)}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-brand-navy py-10 text-white transition-colors hover:bg-brand-navy/90"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold text-brand-navy transition-transform group-hover:scale-110">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
            <span className="font-medium">Assistir ao vídeo do empreendimento</span>
          </span>
        </button>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => openAt(i)}
              className={cn(
                'group relative overflow-hidden rounded-lg bg-muted',
                // first image spans wider on larger screens
                i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} — imagem ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-black">
            {images[current] && (
              <Image
                src={images[current].url}
                alt={images[current].alt || title}
                fill
                sizes="90vw"
                className="object-contain"
              />
            )}

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Fechar"
              className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Próxima"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                  {current + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video */}
      {videoUrl && (
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={toEmbedUrl(videoUrl)}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`Vídeo do ${title}`}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
