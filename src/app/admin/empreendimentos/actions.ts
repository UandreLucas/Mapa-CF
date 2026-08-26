'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  developmentSchema,
  type DevelopmentFormValues,
} from '@/lib/validations/property'
import { slugify } from '@/lib/utils'

async function requireUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')
  return { supabase }
}

/** Revalidate every route that renders developments. */
function revalidateDevelopment(slug?: string) {
  revalidatePath('/admin/empreendimentos')
  revalidatePath('/empreendimentos')
  revalidatePath('/')
  if (slug) revalidatePath(`/empreendimentos/${slug}`)
}

export async function createDevelopment(values: DevelopmentFormValues) {
  const parsed = developmentSchema.safeParse(values)
  if (!parsed.success) return { error: 'Dados inválidos' }

  const { supabase } = await requireUser()
  const { slug, ...data } = parsed.data
  const finalSlug = slug || slugify(data.name)

  const { error } = await supabase
    .from('developments')
    .insert({ ...data, slug: finalSlug })

  if (error) return { error: error.message }
  revalidateDevelopment(finalSlug)
  return { success: true }
}

export async function updateDevelopment(
  id: string,
  values: DevelopmentFormValues
) {
  const parsed = developmentSchema.safeParse(values)
  if (!parsed.success) return { error: 'Dados inválidos' }

  const { supabase } = await requireUser()
  const { slug, ...data } = parsed.data
  const finalSlug = slug || slugify(data.name)

  const { error } = await supabase
    .from('developments')
    .update({ ...data, slug: finalSlug, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidateDevelopment(finalSlug)
  return { success: true }
}

export async function deleteDevelopment(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('developments').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidateDevelopment()
  return { success: true }
}

export async function toggleDevelopmentPublished(id: string, next: boolean) {
  const { supabase } = await requireUser()
  const { error } = await supabase
    .from('developments')
    .update({ is_published: next, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidateDevelopment()
  return { success: true }
}
