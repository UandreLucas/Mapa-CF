'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function requireUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')
  return { supabase, user }
}

export async function updateLeadStatus(id: string, status: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/leads')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteLead(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/leads')
  return { success: true }
}

export async function addLeadNote(leadId: string, content: string) {
  const { supabase, user } = await requireUser()
  if (!content.trim()) return { error: 'Conteúdo vazio' }
  const { error } = await supabase
    .from('lead_notes')
    .insert({ lead_id: leadId, content: content.trim(), author_id: user.id })
  if (error) return { error: error.message }
  revalidatePath('/admin/leads')
  return { success: true }
}

export async function getLeadNotes(leadId: string) {
  const { supabase } = await requireUser()
  const { data } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
  return data ?? []
}
