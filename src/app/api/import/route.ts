import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseImportRows } from '@/lib/import'
import type { ImportError } from '@/types'

/**
 * Receives already-parsed rows from the client wizard (CSV/XLSX parsed in
 * the browser), validates them, and bulk-inserts properties + images.
 */
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      filename?: string
      rows?: Record<string, unknown>[]
    }

    const rawRows = body.rows ?? []
    if (!rawRows.length) {
      return NextResponse.json(
        { error: 'Nenhuma linha encontrada no arquivo.' },
        { status: 400 }
      )
    }

    const { rows, errors } = parseImportRows(rawRows)

    // Create an import job record
    const { data: job } = await supabase
      .from('import_jobs')
      .insert({
        filename: body.filename || 'import.csv',
        status: 'processing',
        total_rows: rawRows.length,
        created_by: user.id,
      })
      .select()
      .single()

    let imported = 0
    const insertErrors: ImportError[] = [...errors]

    for (const row of rows) {
      const { data: property, error } = await supabase
        .from('properties')
        .insert({
          ...(row.property as any),
          broker_id: user.id,
        })
        .select()
        .single()

      if (error || !property) {
        insertErrors.push({
          row: 0,
          message: `${row.property.title}: ${error?.message || 'erro ao inserir'}`,
        })
        continue
      }

      if (row.images.length) {
        await supabase.from('property_images').insert(
          row.images.map((url, idx) => ({
            property_id: property.id,
            url,
            alt: String(row.property.title),
            is_cover: idx === 0,
            display_order: idx,
          }))
        )
      }
      imported++
    }

    if (job) {
      await supabase
        .from('import_jobs')
        .update({
          status: 'completed',
          imported_rows: imported,
          error_rows: insertErrors.length,
          errors: insertErrors,
          completed_at: new Date().toISOString(),
        })
        .eq('id', job.id)
    }

    return NextResponse.json({
      success: true,
      total: rawRows.length,
      imported,
      errors: insertErrors,
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'Erro ao processar importação.' },
      { status: 500 }
    )
  }
}
