import type { Property, PropertyImage, Neighborhood, Feature, Lead } from './database'

export * from './database'

/** Property with its related images joined. */
export interface PropertyWithImages extends Property {
  images: PropertyImage[]
}

/** Full property with images, features and neighborhood. */
export interface PropertyFull extends Property {
  images: PropertyImage[]
  features: Feature[]
  neighborhood_ref?: Neighborhood | null
}

export interface NeighborhoodWithCount extends Neighborhood {
  property_count: number
}

export interface LeadWithProperty extends Lead {
  property?: Pick<Property, 'id' | 'title' | 'slug' | 'code'> | null
}

export interface PropertyFilters {
  purpose?: string
  type?: string
  neighborhood?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  parking?: number
  suites?: number
  minArea?: number
  maxArea?: number
  isLuxury?: boolean
  isLaunch?: boolean
  isFeatured?: boolean
  /** 'available' hides sold/rented listings; default shows them at the end. */
  availability?: 'all' | 'available'
  features?: string[]
  search?: string
  sort?: PropertySort
  page?: number
  perPage?: number
}

export type PropertySort =
  | 'recent'
  | 'price_asc'
  | 'price_desc'
  | 'area_desc'
  | 'relevance'

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface DashboardStats {
  totalProperties: number
  publishedProperties: number
  totalLeads: number
  newLeads: number
  convertedLeads: number
  totalViews: number
  featuredCount: number
  luxuryCount: number
}

export interface SiteSettings {
  broker_name: string
  broker_creci: string
  broker_phone: string
  broker_whatsapp: string
  broker_email: string
  company_name: string
  company_address: string
  company_instagram: string
  company_facebook: string
  company_youtube: string
  company_bio: string
  whatsapp_default_message: string
  seo_title: string
  seo_description: string
  office_hours: string
  primary_color: string
  accent_color: string
  [key: string]: string
}

export const DEFAULT_SETTINGS: SiteSettings = {
  broker_name: 'Eduardo Vieira',
  broker_creci: 'CRECI-PB [NÚMERO]',
  broker_phone: '(83) 8650-4782',
  broker_whatsapp: '558386504782',
  broker_email: 'corretoreduardovieira@gmail.com',
  broker_avatar: '/broker.png',
  hero_image: '',
  company_name: 'Eduardo Vieira Imóveis',
  company_address: 'João Pessoa, Paraíba',
  company_instagram: 'https://www.instagram.com/eduardovieiraimoveis/',
  company_facebook: '',
  company_youtube: '',
  company_bio:
    'Especialista em imóveis de alto padrão em João Pessoa há mais de 15 anos. Atendimento personalizado, curadoria exclusiva e acompanhamento completo em todas as etapas.',
  whatsapp_default_message:
    'Olá, Eduardo! Gostaria de mais informações sobre um imóvel.',
  seo_title: 'Eduardo Vieira Imóveis | Imóveis de Alto Padrão em João Pessoa',
  seo_description:
    'Encontre imóveis exclusivos em João Pessoa com Eduardo Vieira. Especialista em alto padrão nos melhores bairros da cidade.',
  office_hours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h',
  primary_color: '#1A1A2E',
  accent_color: '#C9A96E',
}
