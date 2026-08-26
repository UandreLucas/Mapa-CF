'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Building,
  Users,
  MapPin,
  Upload,
  Settings,
  UserCog,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/imoveis', label: 'Imóveis', icon: Building2 },
  { href: '/admin/empreendimentos', label: 'Empreendimentos', icon: Building },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/bairros', label: 'Bairros', icon: MapPin },
  { href: '/admin/importar', label: 'Importar', icon: Upload },
  { href: '/admin/usuarios', label: 'Usuários', icon: UserCog },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

interface AdminSidebarProps {
  userName: string
  userEmail: string
}

export function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const initials =
    userName
      ?.split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('') || 'EV'

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-white/10 p-6">
        <Link href="/admin" className="block">
          <span className="font-serif text-xl font-semibold text-white">
            Eduardo Vieira
          </span>
          <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.25em] text-brand-gold">
            Painel Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              isActive(item)
                ? 'bg-brand-gold text-brand-navy'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Ver site
        </Link>
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-xs text-white/50">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition-colors hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-brand-navy px-4 lg:hidden">
        <Link href="/admin" className="font-serif text-lg font-semibold text-white">
          Painel Admin
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-brand-navy lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-brand-navy">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-5 text-white"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
