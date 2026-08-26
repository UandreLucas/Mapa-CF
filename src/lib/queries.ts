import { createClient } from '@/lib/supabase/server'
import type {
  PropertyWithImages,
  PropertyFull,
  NeighborhoodWithCount,
  PropertyFilters,
  PaginatedResult,
  Neighborhood,
  Testimonial,
  Feature,
} from '@/types'

const PROPERTY_SELECT = '*, images:property_images(*)'

/**
 * Statuses visible to anonymous visitors. Sold/rented listings stay on the
 * site as social proof; they are pushed to the end of the listing by
 * `applyAvailabilityOrder` below.
 */
const PUBLIC_STATUSES = ['published', 'sold', 'rented']

function sortToOrder(sort?: string): { column: string; ascending: boolean } {
  switch (sort) {
    case 'price_asc':
      return { column: 'price', ascending: true }
    case 'price_desc':
      return { column: 'price', ascending: false }
    case 'area_desc':
      return { column: 'total_area', ascending: false }
    default:
      return { column: 'created_at', ascending: false }
  }
}

/**
 * Fetch published properties with filters and pagination.
 */
export async function getProperties(
  filters: PropertyFilters = {}
): Promise<PaginatedResult<PropertyWithImages>> {
  const supabase = createClient()
  const page = filters.page && filters.page > 0 ? filters.page : 1
  const perPage = filters.perPage ?? 12
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('properties')
    .select(PROPERTY_SELECT, { count: 'exact' })
    .is('deleted_at', null)

  // 'available' hides sold/rented entirely; otherwise they show at the end.
  query =
    filters.availability === 'available'
      ? query.eq('status', 'published')
      : query.in('status', PUBLIC_STATUSES)

  if (filters.purpose && filters.purpose !== 'both') {
    query = query.or(`purpose.eq.${filters.purpose},purpose.eq.both`)
  }
  if (filters.type) query = query.eq('type', filters.type)
  if (filters.neighborhood) query = query.eq('neighborhood', filters.neighborhood)
  if (filters.city) query = query.eq('city', filters.city)
  if (filters.minPrice) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
  if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms)
  if (filters.bathrooms) query = query.gte('bathrooms', filters.bathrooms)
  if (filters.parking) query = query.gte('parking', filters.parking)
  if (filters.suites) query = query.gte('suites', filters.suites)
  if (filters.minArea) query = query.gte('total_area', filters.minArea)
  if (filters.maxArea) query = query.lte('total_area', filters.maxArea)
  if (filters.isLuxury) query = query.eq('is_luxury', true)
  if (filters.isLaunch) query = query.eq('is_launch', true)
  if (filters.isFeatured) query = query.eq('is_featured', true)
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,neighborhood.ilike.%${filters.search}%,code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }

  const order = sortToOrder(filters.sort)
  // Alphabetically 'published' < 'rented' < 'sold', so ordering by status
  // ascending keeps available listings ahead of closed ones. It is applied
  // first so it outranks the user-chosen sort.
  query = query
    .order('status', { ascending: true })
    .order(order.column, { ascending: order.ascending, nullsFirst: false })

  const { data, count, error } = await query.range(from, to)

  if (error) {
    return { data: [], total: 0, page, perPage, totalPages: 0 }
  }

  const properties = (data ?? []) as unknown as PropertyWithImages[]
  const total = count ?? 0

  return {
    data: properties,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  }
}

export async function getFeaturedProperties(
  limit = 6
): Promise<PropertyWithImages[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as PropertyWithImages[]
}

export async function getPropertiesBy(
  field: 'is_luxury' | 'is_launch',
  limit = 4
): Promise<PropertyWithImages[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq(field, true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as PropertyWithImages[]
}

export async function getPropertiesByPurpose(
  purpose: 'sale' | 'rent',
  limit = 4
): Promise<PropertyWithImages[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .in('status', PUBLIC_STATUSES)
    .is('deleted_at', null)
    .or(`purpose.eq.${purpose},purpose.eq.both`)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as PropertyWithImages[]
}

export async function getRecentProperties(limit = 6): Promise<PropertyWithImages[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as PropertyWithImages[]
}

export async function getPropertyBySlug(
  slug: string
): Promise<PropertyFull | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle()

  if (error || !data) return null

  // Fetch features separately to avoid PostgREST junction table ambiguity
  let features: Feature[] = []
  try {
    const { data: pfRows } = await supabase
      .from('property_features')
      .select('features(*)')
      .eq('property_id', data.id)

    if (pfRows) {
      features = pfRows
        .map((row: Record<string, unknown>) => row.features as Feature)
        .filter(Boolean)
    }
  } catch {
    // features not critical — continue without them
  }

  return {
    ...(data as unknown as PropertyFull),
    features,
  }
}

export async function getRelatedProperties(
  property: PropertyFull,
  limit = 3
): Promise<PropertyWithImages[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .in('status', PUBLIC_STATUSES)
    .is('deleted_at', null)
    .eq('neighborhood', property.neighborhood)
    .neq('id', property.id)
    .limit(limit)
  return (data ?? []) as unknown as PropertyWithImages[]
}

export async function getAllPublishedSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select('slug, updated_at')
    .in('status', PUBLIC_STATUSES)
    .is('deleted_at', null)
  return data ?? []
}

export async function getNeighborhoods(
  onlyActive = true
): Promise<Neighborhood[]> {
  const supabase = createClient()
  let query = supabase
    .from('neighborhoods')
    .select('*')
    .order('display_order', { ascending: true })
  if (onlyActive) query = query.eq('is_active', true)
  const { data } = await query
  return data ?? []
}

export async function getNeighborhoodsWithCounts(): Promise<
  NeighborhoodWithCount[]
> {
  const supabase = createClient()
  const { data: neighborhoods } = await supabase
    .from('neighborhoods')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (!neighborhoods) return []

  const withCounts = await Promise.all(
    neighborhoods.map(async (n) => {
      const { count } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .in('status', PUBLIC_STATUSES)
        .is('deleted_at', null)
        .eq('neighborhood', n.name)
      return { ...n, property_count: count ?? 0 }
    })
  )

  return withCounts
}

export async function getNeighborhoodBySlug(
  slug: string
): Promise<Neighborhood | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('neighborhoods')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return data
}

export async function getTestimonials(limit = 6): Promise<Testimonial[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getAllFeatures(): Promise<Feature[]> {
  const supabase = createClient()
  const { data } = await supabase.from('features').select('*').order('name')
  return data ?? []
}
