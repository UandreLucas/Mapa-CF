'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, buildWhatsAppUrl } from '@/lib/utils'
import type { SiteSettings } from '@/types'

const NAV_LINKS = [
  { href: '/imoveis?purpose=sale', label: 'Comprar' },
  { href: '/imoveis?purpose=rent', label: 'Alugar' },
  { href: '/bairros', label: 'Bairros' },
  { href: '/anuncie', label: 'Anuncie' },
  { href: '/avalie', label: 'Avalie seu imóvel' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
]

interface HeaderProps {
  settings: SiteSettings
}

export function Header({ settings }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container-wide flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex flex-col leading-none">
          <span
            className={cn(
              'font-serif text-xl font-semibold tracking-tight transition-colors md:text-2xl',
              scrolled ? 'text-brand-navy' : 'text-white'
            )}
          >
            Eduardo Vieira
          </span>
          <span
            className={cn(
              'text-[10px] font-medium uppercase tracking-[0.3em] transition-colors',
              scrolled ? 'text-brand-gold' : 'text-brand-gold-light'
            )}
          >
            Imóveis · Alto Padrão
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-brand-gold',
                scrolled ? 'text-foreground/80' : 'text-white/90'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${settings.broker_phone}`}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-gold',
              scrolled ? 'text-foreground/80' : 'text-white/90'
            )}
          >
            <Phone className="h-4 w-4" />
            {settings.broker_phone}
          </a>
          <Button asChild variant="gold" size="sm">
            <a
              href={buildWhatsAppUrl(
                settings.broker_whatsapp,
                settings.whatsapp_default_message
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={cn(
            'lg:hidden',
            scrolled ? 'text-brand-navy' : 'text-white'
          )}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 top-20 z-40 transform bg-background transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="container-wide flex flex-col gap-1 py-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-border py-4 font-serif text-xl text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant="gold" size="lg">
              <a
                href={buildWhatsAppUrl(
                  settings.broker_whatsapp,
                  settings.whatsapp_default_message
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${settings.broker_phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                {settings.broker_phone}
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
