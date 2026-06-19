import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: 'Painel Administrativo',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', user.id)
    .maybeSingle()

  const userName = profile?.name || user.email?.split('@')[0] || 'Administrador'
  const userEmail = profile?.email || user.email || ''

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminSidebar userName={userName} userEmail={userEmail} />
      <div className="lg:pl-64">
        <main className="min-h-screen p-5 md:p-8">{children}</main>
      </div>
    </div>
  )
}
