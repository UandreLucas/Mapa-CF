'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { neighborhoodSchema, type NeighborhoodFormValues } from '@/lib/validations/property'
import { slugify } from '@/lib/utils'

async function requireUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')
  return { supabase }
}

export async function createNeighborhood(values: NeighborhoodFormValues) {
  const parsed = neighborhoodSchema.safeParse(values)
  if (!parsed.success) return { error: 'Dados inválidos' }

  const { supabase } = await requireUser()
  const { slug, ...data } = parsed.data
  const finalSlug = slug || slugify(data.name)

  const { error } = await supabase
    .from('neighborhoods')
    .insert({ ...data, slug: finalSlug })

  if (error) return { error: error.message }
  revalidatePath('/admin/bairros')
  revalidatePath('/bairros')
  return { success: true }
}

export async function updateNeighborhood(
  id: string,
  values: NeighborhoodFormValues
) {
  const parsed = neighborhoodSchema.safeParse(values)
  if (!parsed.success) return { error: 'Dados inválidos' }

  const { supabase } = await requireUser()
  const { slug, ...data } = parsed.data
  const finalSlug = slug || slugify(data.name)

  const { error } = await supabase
    .from('neighborhoods')
    .update({ ...data, slug: finalSlug, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/bairros')
  revalidatePath('/bairros')
  return { success: true }
}

export async function deleteNeighborhood(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('neighborhoods').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/bairros')
  revalidatePath('/bairros')
  return { success: true }
}

export async function toggleNeighborhoodActive(id: string, value: boolean) {
  const { supabase } = await requireUser()
  const { error } = await supabase
    .from('neighborhoods')
    .update({ is_active: value })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/bairros')
  revalidatePath('/bairros')
  return { success: true }
}
