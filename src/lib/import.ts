import { slugify, generatePropertyCode } from '@/lib/utils'
import type { ImportError } from '@/types'

/** Header mapping from the CSV template (PT) to property fields. */
export const IMPORT_COLUMNS: Record<string, string> = {
  titulo: 'title',
  finalidade: 'purpose',
  tipo: 'type',
  cidade: 'city',
  estado: 'state',
  bairro: 'neighborhood',
  endereco: 'address',
  numero: 'number',
  cep: 'zip_code',
  preco: 'price',
  condominio: 'condo_fee',
  iptu: 'iptu',
  area_privativa: 'private_area',
  area_total: 'total_area',
  quartos: 'bedrooms',
  suites: 'suites',
  banheiros: 'bathrooms',
  vagas: 'parking',
  ano: 'year_built',
  descricao: 'description',
  destaque: 'is_featured',
  alto_padrao: 'is_luxury',
  lancamento: 'is_launch',
  mobiliado: 'is_furnished',
  imagens: 'images',
  video: 'video_url',
}

const PURPOSE_MAP: Record<string, string> = {
  venda: 'sale',
  vender: 'sale',
  sale: 'sale',
  aluguel: 'rent',
  alugar: 'rent',
  locacao: 'rent',
  rent: 'rent',
  ambos: 'both',
  both: 'both',
}

const TYPE_MAP: Record<string, string> = {
  apartamento: 'apartamento',
  casa: 'casa',
  'casa em condominio': 'casa-condominio',
  cobertura: 'cobertura',
  flat: 'flat',
  studio: 'flat',
  terreno: 'terreno',
  'sala comercial': 'sala-comercial',
  loja: 'loja',
  galpao: 'galpao',
  fazenda: 'fazenda',
  sitio: 'fazenda',
}

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const str = String(value)
    .replace(/[R$\s.]/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '')
  const n = Number(str)
  return Number.isFinite(n) ? n : null
}

function parseInteger(value: unknown): number {
  const n = parseNumber(value)
  return n === null ? 0 : Math.round(n)
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  const str = String(value ?? '').trim().toLowerCase()
  return ['sim', 'true', '1', 'x', 'yes', 's'].includes(str)
}

function normalizeKey(key: string): string {
  return key
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
}

export interface ParsedPropertyRow {
  property: Record<string, unknown>
  images: string[]
}

export interface ParseResult {
  rows: ParsedPropertyRow[]
  errors: ImportError[]
}

/**
 * Map raw spreadsheet rows (array of objects keyed by header) into
 * insert-ready property payloads, collecting per-row validation errors.
 */
export function parseImportRows(
  rawRows: Record<string, unknown>[]
): ParseResult {
  const rows: ParsedPropertyRow[] = []
  const errors: ImportError[] = []

  rawRows.forEach((raw, index) => {
    const rowNumber = index + 2 // header is row 1

    // Normalize keys and map to fields
    const mapped: Record<string, unknown> = {}
    let imageStr = ''

    for (const [rawKey, value] of Object.entries(raw)) {
      const key = normalizeKey(rawKey)
      const field = IMPORT_COLUMNS[key]
      if (!field) continue
      if (field === 'images') {
        imageStr = String(value ?? '')
        continue
      }
      mapped[field] = value
    }

    const title = String(mapped.title ?? '').trim()
    if (!title) {
      errors.push({ row: rowNumber, field: 'titulo', message: 'Título obrigatório' })
      return
    }

    const purposeRaw = String(mapped.purpose ?? 'venda').trim().toLowerCase()
    const purpose = PURPOSE_MAP[purposeRaw] || 'sale'

    const typeRaw = String(mapped.type ?? '').trim().toLowerCase()
    const type = TYPE_MAP[typeRaw] || 'apartamento'

    const city = String(mapped.city ?? 'João Pessoa').trim() || 'João Pessoa'
    const neighborhood = String(mapped.neighborhood ?? '').trim()
    if (!neighborhood) {
      errors.push({ row: rowNumber, field: 'bairro', message: 'Bairro obrigatório' })
      return
    }

    const code = generatePropertyCode()
    const slug = `${slugify(title)}-${code.toLowerCase()}`

    const property: Record<string, unknown> = {
      title,
      slug,
      code,
      purpose,
      type,
      status: 'published',
      city,
      state: String(mapped.state ?? 'PB').trim().toUpperCase().slice(0, 2) || 'PB',
      neighborhood,
      address: mapped.address ? String(mapped.address) : null,
      number: mapped.number ? String(mapped.number) : null,
      zip_code: mapped.zip_code ? String(mapped.zip_code) : null,
      price: parseNumber(mapped.price),
      condo_fee: parseNumber(mapped.condo_fee),
      iptu: parseNumber(mapped.iptu),
      private_area: parseNumber(mapped.private_area),
      total_area: parseNumber(mapped.total_area),
      bedrooms: parseInteger(mapped.bedrooms),
      suites: parseInteger(mapped.suites),
      bathrooms: parseInteger(mapped.bathrooms),
      parking: parseInteger(mapped.parking),
      year_built: parseNumber(mapped.year_built),
      description: mapped.description ? String(mapped.description) : null,
      video_url: mapped.video_url ? String(mapped.video_url) : null,
      is_featured: parseBoolean(mapped.is_featured),
      is_luxury: parseBoolean(mapped.is_luxury),
      is_launch: parseBoolean(mapped.is_launch),
      is_furnished: parseBoolean(mapped.is_furnished),
    }

    const images = imageStr
      .split(/[\n|;,]+/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith('http'))

    rows.push({ property, images })
  })

  return { rows, errors }
}
