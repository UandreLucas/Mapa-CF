import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validations/lead'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { privacy_consent, ...data } = parsed.data

    // Use service client so public visitors can insert leads regardless of RLS.
    const supabase = createServiceClient()
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        whatsapp: data.phone,
        message: data.message,
        type: data.type,
        property_id: data.property_id || null,
        development_id: data.development_id || null,
        source: data.source || 'site',
        best_time: data.best_time || null,
        privacy_consent,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Não foi possível registrar seu contato.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Authenticated read for the admin panel.
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  let query = supabase
    .from('leads')
    .select('*, property:properties(id, title, slug, code)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (type) query = query.eq('type', type)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
