import { createClient } from '@/lib/supabase/server'
import { DEFAULT_SETTINGS, type SiteSettings } from '@/types'

/**
 * Load all site settings merged over the defaults.
 * Falls back to defaults if Supabase is unavailable (e.g. local dev without env).
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('settings').select('key, value')
    if (error || !data) return DEFAULT_SETTINGS

    const merged: SiteSettings = { ...DEFAULT_SETTINGS }
    for (const row of data) {
      if (row.value !== null && row.value !== undefined && row.value !== '') {
        merged[row.key] = row.value
      }
    }
    return merged
  } catch {
    return DEFAULT_SETTINGS
  }
}
