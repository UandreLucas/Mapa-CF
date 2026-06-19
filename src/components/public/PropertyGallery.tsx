'use client'

import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { PropertyImage } from '@/types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80'

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const gallery =
    images.length > 0
      ? images
      : ([{ id: 'fallback', url: FALLBACK_IMAGE, alt: title }] as PropertyImage[])

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % gallery.length),
    [gallery.length]
  )
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + gallery.length) % gallery.length),
    [gallery.length]
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

  const main = gallery[0]
  const thumbs = gallery.slice(1, 5)

  return (
    <>
      {/* Mosaic */}
      <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-xl md:grid-cols-4 md:grid-rows-2 md:gap-2">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="group relative col-span-1 aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto"
        >
          <Image
            src={main.url}
            alt={main.alt || title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur md:hidden">
            <Expand className="h-3.5 w-3.5" /> {gallery.length} fotos
          </span>
        </button>

        {thumbs.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => openAt(i + 1)}
            className="group relative hidden aspect-[4/3] md:block"
          >
            <Image
              src={img.url}
              alt={img.alt || title}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {i === thumbs.length - 1 && gallery.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">
                <Expand className="mr-2 h-4 w-4" />+{gallery.length - 5} fotos
              </span>
            )}
          </button>
        ))}

        {/* Fill empty slots on desktop when fewer than 4 thumbs */}
        {Array.from({ length: Math.max(0, 4 - thumbs.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="hidden aspect-[4/3] bg-muted md:block"
          />
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          hideClose
          className="max-w-6xl border-none bg-transparent p-0 shadow-none"
        >
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <Image
                src={gallery[current].url}
                alt={gallery[current].alt || title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Próxima"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="mt-3 flex items-center justify-center gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === current ? 'w-6 bg-brand-gold' : 'w-1.5 bg-white/40'
                  )}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
