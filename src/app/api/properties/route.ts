import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProperties } from '@/lib/queries'
import { propertySchema } from '@/lib/validations/property'
import { slugify, generatePropertyCode } from '@/lib/utils'
import type { PropertyFilters, PropertySort } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const filters: PropertyFilters = {
    purpose: searchParams.get('purpose') || undefined,
    type: searchParams.get('type') || undefined,
    neighborhood: searchParams.get('neighborhood') || undefined,
    city: searchParams.get('city') || undefined,
    minPrice: searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined,
    maxPrice: searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : undefined,
    bedrooms: searchParams.get('bedrooms')
      ? Number(searchParams.get('bedrooms'))
      : undefined,
    bathrooms: searchParams.get('bathrooms')
      ? Number(searchParams.get('bathrooms'))
      : undefined,
    parking: searchParams.get('parking')
      ? Number(searchParams.get('parking'))
      : undefined,
    isLuxury: searchParams.get('isLuxury') === 'true' || undefined,
    isLaunch: searchParams.get('isLaunch') === 'true' || undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as PropertySort) || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    perPage: searchParams.get('perPage')
      ? Number(searchParams.get('perPage'))
      : 12,
  }

  const result = await getProperties(filters)
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = propertySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { features, images, code, ...propertyData } = parsed.data
    const finalCode = code || generatePropertyCode()
    const slug = `${slugify(propertyData.title)}-${finalCode.toLowerCase()}`

    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        code: finalCode,
        slug,
        broker_id: user.id,
      })
      .select()
      .single()

    if (error || !property) {
      return NextResponse.json(
        { error: error?.message || 'Erro ao criar imóvel' },
        { status: 500 }
      )
    }

    // Images
    if (images?.length) {
      await supabase.from('property_images').insert(
        images.map((img, idx) => ({
          property_id: property.id,
          url: img.url,
          alt: img.alt || propertyData.title,
          is_cover: img.is_cover || idx === 0,
          display_order: img.display_order ?? idx,
        }))
      )
    }

    // Features
    if (features?.length) {
      await supabase.from('property_features').insert(
        features.map((feature_id) => ({
          property_id: property.id,
          feature_id,
        }))
      )
    }

    return NextResponse.json({ success: true, property }, { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
