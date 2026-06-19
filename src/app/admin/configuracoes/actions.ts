'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveSettings(values: Record<string, string>) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const rows = Object.entries(values).map(([key, value]) => ({
    key,
    value: value ?? '',
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from('settings').upsert(rows, {
    onConflict: 'key',
  })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}
