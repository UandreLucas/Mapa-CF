import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getSiteUrl } from './site-url'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Brazilian currency (BRL).
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'Sob consulta'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Compact currency for cards, e.g. R$ 2,5 mi / R$ 850 mil.
 */
export function formatCurrencyCompact(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'Sob consulta'
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    return `R$ ${millions.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`
  }
  if (value >= 1_000) {
    const thousands = value / 1_000
    return `R$ ${thousands.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`
  }
  return formatCurrency(value)
}

export function formatArea(value: number | null | undefined): string {
  if (!value) return '—'
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} m²`
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Create a URL-friendly slug from a string (handles Portuguese accents).
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Generate a short property code, e.g. EV-A1B2.
 */
export function generatePropertyCode(prefix = 'EV'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${prefix}-${code}`
}

/**
 * Remove all non-digit characters from a phone string.
 */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Build a wa.me link with an optional prefilled message.
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const digits = onlyDigits(phone)
  // Add Brazil country code if not present
  const normalized = digits.startsWith('55') ? digits : `55${digits}`
  const base = `https://wa.me/${normalized}`
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`
  }
  return base
}

export function formatPhone(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return value
}

export const PROPERTY_TYPES = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'casa-condominio', label: 'Casa em Condomínio' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'flat', label: 'Flat / Studio' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'sala-comercial', label: 'Sala Comercial' },
  { value: 'loja', label: 'Loja / Ponto' },
  { value: 'galpao', label: 'Galpão' },
  { value: 'fazenda', label: 'Fazenda / Sítio' },
] as const

export const PROPERTY_PURPOSES = [
  { value: 'sale', label: 'Comprar' },
  { value: 'rent', label: 'Alugar' },
  { value: 'both', label: 'Comprar ou Alugar' },
] as const

export const PROPERTY_STATUSES = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'published', label: 'Publicado' },
  { value: 'sold', label: 'Vendido' },
  { value: 'rented', label: 'Alugado' },
  { value: 'archived', label: 'Arquivado' },
] as const

export const LEAD_STATUSES = [
  { value: 'new', label: 'Novo', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contatado', color: 'bg-amber-100 text-amber-700' },
  { value: 'attending', label: 'Em atendimento', color: 'bg-purple-100 text-purple-700' },
  { value: 'scheduled', label: 'Visita agendada', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'proposal', label: 'Proposta', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'converted', label: 'Convertido', color: 'bg-green-100 text-green-700' },
  { value: 'lost', label: 'Perdido', color: 'bg-red-100 text-red-700' },
] as const

export const LEAD_TYPES = [
  { value: 'contact', label: 'Contato' },
  { value: 'property_interest', label: 'Interesse em imóvel' },
  { value: 'list_property', label: 'Anunciar imóvel' },
  { value: 'evaluate', label: 'Avaliação' },
  { value: 'schedule', label: 'Agendamento' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'development_interest', label: 'Interesse em empreendimento' },
] as const

export const DEVELOPMENT_STAGES = [
  { value: 'launch', label: 'Lançamento' },
  { value: 'construction', label: 'Em construção' },
  { value: 'ready', label: 'Pronto para morar' },
] as const

export function getDevelopmentStageLabel(value: string): string {
  return DEVELOPMENT_STAGES.find((s) => s.value === value)?.label ?? value
}

export function getPropertyTypeLabel(value: string): string {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value
}

export function getLeadStatusMeta(value: string) {
  return LEAD_STATUSES.find((s) => s.value === value) ?? LEAD_STATUSES[0]
}

export function getLeadTypeLabel(value: string): string {
  return LEAD_TYPES.find((t) => t.value === value)?.label ?? value
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Convert a YouTube / Vimeo / Google Drive share link into its embeddable
 * URL. Anything else is returned untouched.
 */
export function toEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  // Google Drive: drive.google.com/file/d/FILE_ID/view  ->  /preview
  const driveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/)
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  return url
}
