import Link from 'next/link'
import {
  Building2,
  Eye,
  Users,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatCard } from '@/components/admin/StatCard'
import { LeadsAreaChart, LeadsStatusPie } from '@/components/admin/DashboardCharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getDashboardStats,
  getRecentLeads,
  getLeadsByDay,
  getLeadsByStatus,
} from '@/lib/admin-queries'
import { formatDateTime, getLeadStatusMeta, getLeadTypeLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [stats, recentLeads, leadsByDay, leadsByStatus] = await Promise.all([
    getDashboardStats(),
    getRecentLeads(6),
    getLeadsByDay(14),
    getLeadsByStatus(),
  ])

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral do seu negócio imobiliário."
        action={
          <Button asChild variant="gold">
            <Link href="/admin/imoveis/novo">
              <Plus className="h-4 w-4" />
              Novo imóvel
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Imóveis ativos"
          value={stats.publishedProperties}
          hint={`${stats.totalProperties} no total`}
          icon={Building2}
        />
        <StatCard
          label="Leads recebidos"
          value={stats.totalLeads}
          hint={`${stats.newLeads} novos`}
          icon={Users}
          accent
        />
        <StatCard
          label="Visualizações"
          value={stats.totalViews}
          icon={Eye}
        />
        <StatCard
          label="Convertidos"
          value={stats.convertedLeads}
          icon={CheckCircle2}
        />
        <StatCard label="Destaques" value={stats.featuredCount} icon={Star} />
        <StatCard
          label="Alto padrão"
          value={stats.luxuryCount}
          icon={Sparkles}
          accent
        />
        <StatCard
          label="Novos leads"
          value={stats.newLeads}
          icon={Users}
        />
        <StatCard
          label="Total imóveis"
          value={stats.totalProperties}
          icon={Building2}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-medium text-brand-navy">
            Leads nos últimos 14 dias
          </h2>
          <LeadsAreaChart data={leadsByDay} />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-medium text-brand-navy">Leads por status</h2>
          <LeadsStatusPie data={leadsByStatus} />
        </div>
      </div>

      {/* Recent leads */}
      <div className="mt-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="font-medium text-brand-navy">Leads recentes</h2>
          <Link
            href="/admin/leads"
            className="group flex items-center gap-1.5 text-sm font-medium text-brand-gold hover:text-brand-gold-dark"
          >
            Ver todos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            Nenhum lead recebido ainda.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recentLeads.map((lead) => {
              const meta = getLeadStatusMeta(lead.status)
              return (
                <li
                  key={lead.id}
                  className="flex flex-wrap items-center gap-3 p-4 px-6 hover:bg-secondary/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getLeadTypeLabel(lead.type)}
                      {lead.property ? ` · ${lead.property.title}` : ''}
                    </p>
                  </div>
                  <Badge className={`${meta.color} border-0`}>{meta.label}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(lead.created_at)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
