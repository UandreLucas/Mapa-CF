'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { propertySchema, type PropertyFormValues } from '@/lib/validations/property'
import { slugify, generatePropertyCode } from '@/lib/utils'

async function requireUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')
  return { supabase, user }
}

export async function createProperty(values: PropertyFormValues) {
  const parsed = propertySchema.safeParse(values)
  if (!parsed.success) {
    return { error: 'Dados inválidos', issues: parsed.error.flatten() }
  }

  const { supabase, user } = await requireUser()
  const { features, images, code, ...data } = parsed.data
  const finalCode = code || generatePropertyCode()
  const slug = `${slugify(data.title)}-${finalCode.toLowerCase()}`

  const { data: property, error } = await supabase
    .from('properties')
    .insert({ ...data, code: finalCode, slug, broker_id: user.id })
    .select()
    .single()

  if (error || !property) {
    return { error: error?.message || 'Erro ao criar imóvel' }
  }

  if (images?.length) {
    await supabase.from('property_images').insert(
      images.map((img, idx) => ({
        property_id: property.id,
        url: img.url,
        alt: img.alt || data.title,
        is_cover: img.is_cover || idx === 0,
        display_order: img.display_order ?? idx,
      }))
    )
  }

  if (features?.length) {
    await supabase.from('property_features').insert(
      features.map((feature_id) => ({ property_id: property.id, feature_id }))
    )
  }

  revalidatePath('/admin/imoveis')
  revalidatePath('/')
  return { success: true, id: property.id }
}

export async function updateProperty(id: string, values: PropertyFormValues) {
  const parsed = propertySchema.safeParse(values)
  if (!parsed.success) {
    return { error: 'Dados inválidos', issues: parsed.error.flatten() }
  }

  const { supabase } = await requireUser()
  const { features, images, code, ...data } = parsed.data

  const { error } = await supabase
    .from('properties')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  // Replace images
  await supabase.from('property_images').delete().eq('property_id', id)
  if (images?.length) {
    await supabase.from('property_images').insert(
      images.map((img, idx) => ({
        property_id: id,
        url: img.url,
        alt: img.alt || data.title,
        is_cover: img.is_cover || idx === 0,
        display_order: img.display_order ?? idx,
      }))
    )
  }

  // Replace features
  await supabase.from('property_features').delete().eq('property_id', id)
  if (features?.length) {
    await supabase.from('property_features').insert(
      features.map((feature_id) => ({ property_id: id, feature_id }))
    )
  }

  revalidatePath('/admin/imoveis')
  revalidatePath(`/admin/imoveis/${id}`)
  revalidatePath('/')
  return { success: true, id }
}

export async function deleteProperty(id: string) {
  const { supabase } = await requireUser()
  // Soft delete
  const { error } = await supabase
    .from('properties')
    .update({ deleted_at: new Date().toISOString(), status: 'archived' })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/imoveis')
  revalidatePath('/')
  return { success: true }
}

export async function updatePropertyStatus(id: string, status: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase
    .from('properties')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/imoveis')
  revalidatePath('/')
  return { success: true }
}

export async function togglePropertyFlag(
  id: string,
  flag: 'is_featured' | 'is_luxury' | 'is_launch',
  value: boolean
) {
  const { supabase } = await requireUser()
  const { error } = await supabase
    .from('properties')
    .update({ [flag]: value })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/imoveis')
  revalidatePath('/')
  return { success: true }
}
