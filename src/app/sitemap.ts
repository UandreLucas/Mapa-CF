import type { MetadataRoute } from 'next'
import { getAllPublishedSlugs, getNeighborhoods } from '@/lib/queries'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  const staticRoutes = [
    '',
    '/imoveis',
    '/bairros',
    '/sobre',
    '/contato',
    '/anuncie',
    '/avalie',
    '/privacidade',
    '/termos',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.7,
  }))

  let propertyRoutes: MetadataRoute.Sitemap = []
  let neighborhoodRoutes: MetadataRoute.Sitemap = []

  try {
    const [properties, neighborhoods] = await Promise.all([
      getAllPublishedSlugs(),
      getNeighborhoods(),
    ])

    propertyRoutes = properties.map((p) => ({
      url: `${baseUrl}/imoveis/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    neighborhoodRoutes = neighborhoods.map((n) => ({
      url: `${baseUrl}/bairros/${n.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch {
    // Supabase unavailable during build — fall back to static routes only.
  }

  return [...staticRoutes, ...neighborhoodRoutes, ...propertyRoutes]
}
