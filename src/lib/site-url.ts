/**
 * Canonical base URL of the site, used for metadata, sitemap and robots.
 *
 * NEXT_PUBLIC_SITE_URL wins when set. Without it, a production build falls
 * back to the real domain rather than localhost, so a missing env var can
 * never leak "http://localhost:3000" into the sitemap or canonical tags.
 * Preview deployments use their own generated URL.
 */
const PRODUCTION_URL = 'https://corretoreduardovieira.com.br'

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')

  if (process.env.VERCEL_ENV === 'production') return PRODUCTION_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  return 'http://localhost:3000'
}
