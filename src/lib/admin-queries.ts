import { createClient } from '@/lib/supabase/server'
import type {
  DashboardStats,
  PropertyWithImages,
  LeadWithProperty,
  Property,
} from '@/types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()

  const [
    totalProps,
    publishedProps,
    featured,
    luxury,
    totalLeads,
    newLeads,
    convertedLeads,
    views,
  ] = await Promise.all([
    supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')
      .is('deleted_at', null),
    supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('is_featured', true)
      .is('deleted_at', null),
    supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('is_luxury', true)
      .is('deleted_at', null),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'converted'),
    supabase.from('property_views').select('id', { count: 'exact', head: true }),
  ])

  return {
    totalProperties: totalProps.count ?? 0,
    publishedProperties: publishedProps.count ?? 0,
    featuredCount: featured.count ?? 0,
    luxuryCount: luxury.count ?? 0,
    totalLeads: totalLeads.count ?? 0,
    newLeads: newLeads.count ?? 0,
    convertedLeads: convertedLeads.count ?? 0,
    totalViews: views.count ?? 0,
  }
}

export async function getRecentLeads(limit = 5): Promise<LeadWithProperty[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('leads')
    .select('*, property:properties(id, title, slug, code)')
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as LeadWithProperty[]
}

export async function getLeadsByDay(days = 14) {
  const supabase = createClient()
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data } = await supabase
    .from('leads')
    .select('created_at')
    .gte('created_at', since.toISOString())

  const buckets: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    buckets[key] = 0
  }
  ;(data ?? []).forEach((lead) => {
    const key = lead.created_at.slice(0, 10)
    if (key in buckets) buckets[key]++
  })

  return Object.entries(buckets).map(([date, count]) => ({
    date: date.slice(5).split('-').reverse().join('/'),
    leads: count,
  }))
}

export async function getLeadsByStatus() {
  const supabase = createClient()
  const { data } = await supabase.from('leads').select('status')
  const counts: Record<string, number> = {}
  ;(data ?? []).forEach((l) => {
    counts[l.status] = (counts[l.status] ?? 0) + 1
  })
  return counts
}

export async function getAdminProperties(filters?: {
  status?: string
  search?: string
}): Promise<PropertyWithImages[]> {
  const supabase = createClient()
  let query = supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,code.ilike.%${filters.search}%,neighborhood.ilike.%${filters.search}%`
    )
  }

  const { data } = await query
  return (data ?? []) as unknown as PropertyWithImages[]
}

export async function getAdminPropertyById(
  id: string
): Promise<(Property & { images: any[]; feature_ids: string[] }) | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select('*, images:property_images(*), property_features(feature_id)')
    .eq('id', id)
    .maybeSingle()

  if (!data) return null

  const raw = data as Record<string, unknown>
  const feature_ids = Array.isArray(raw.property_features)
    ? (raw.property_features as { feature_id: string }[]).map((f) => f.feature_id)
    : []

  return {
    ...(raw as unknown as Property & { images: any[] }),
    feature_ids,
  }
}

export async function getAdminLeads(filters?: {
  status?: string
  type?: string
}): Promise<LeadWithProperty[]> {
  const supabase = createClient()
  let query = supabase
    .from('leads')
    .select('*, property:properties(id, title, slug, code)')
    .order('created_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }

  const { data } = await query
  return (data ?? []) as unknown as LeadWithProperty[]
}

export async function getAdminNeighborhoods() {
  const supabase = createClient()
  const { data } = await supabase
    .from('neighborhoods')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data } = await supabase.from('settings').select('key, value')
  const result: Record<string, string> = {}
  ;(data ?? []).forEach((row) => {
    result[row.key] = row.value ?? ''
  })
  return result
}

export async function getProfiles() {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}
