export type PropertyPurpose = 'sale' | 'rent' | 'both'
export type PropertyStatus = 'draft' | 'published' | 'sold' | 'rented' | 'archived'
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'attending'
  | 'scheduled'
  | 'proposal'
  | 'converted'
  | 'lost'
export type LeadType =
  | 'contact'
  | 'property_interest'
  | 'list_property'
  | 'evaluate'
  | 'schedule'
  | 'newsletter'
export type UserRole = 'admin' | 'broker' | 'attendant'
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Profile {
  id: string
  name: string | null
  email: string | null
  role: UserRole
  creci: string | null
  phone: string | null
  whatsapp: string | null
  avatar_url: string | null
  bio: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface City {
  id: string
  name: string
  state: string
  slug: string
  is_active: boolean
  created_at: string
}

export interface Neighborhood {
  id: string
  name: string
  city_id: string | null
  slug: string
  description: string | null
  cover_image_url: string | null
  seo_title: string | null
  seo_description: string | null
  is_active: boolean
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  title: string
  slug: string
  code: string
  purpose: PropertyPurpose
  type: string
  status: PropertyStatus
  city: string
  state: string
  neighborhood: string
  neighborhood_id: string | null
  address: string | null
  number: string | null
  complement: string | null
  zip_code: string | null
  latitude: number | null
  longitude: number | null
  hide_address: boolean
  price: number | null
  hide_price: boolean
  condo_fee: number | null
  iptu: number | null
  private_area: number | null
  total_area: number | null
  bedrooms: number
  suites: number
  bathrooms: number
  parking: number
  year_built: number | null
  description: string | null
  video_url: string | null
  virtual_tour_url: string | null
  broker_id: string | null
  is_featured: boolean
  is_luxury: boolean
  is_launch: boolean
  is_furnished: boolean
  accepts_pets: boolean
  available_from: string | null
  seo_title: string | null
  seo_description: string | null
  views_count: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  alt: string | null
  is_cover: boolean
  display_order: number
  created_at: string
}

export interface Feature {
  id: string
  name: string
  category: string | null
  icon: string | null
}

export interface PropertyFeature {
  property_id: string
  feature_id: string
}

export interface Lead {
  id: string
  name: string
  email: string | null
  phone: string | null
  whatsapp: string | null
  message: string | null
  type: LeadType
  status: LeadStatus
  property_id: string | null
  source: string | null
  best_time: string | null
  privacy_consent: boolean
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface LeadNote {
  id: string
  lead_id: string
  content: string
  author_id: string | null
  created_at: string
}

export interface Settings {
  key: string
  value: string | null
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  property_id: string | null
  is_published: boolean
  created_at: string
}

export interface SavedProperty {
  user_id: string
  property_id: string
  created_at: string
}

export interface PropertyView {
  id: string
  property_id: string
  ip_hash: string | null
  user_agent: string | null
  created_at: string
}

export interface ImportJob {
  id: string
  filename: string | null
  status: ImportStatus
  total_rows: number
  imported_rows: number
  error_rows: number
  errors: ImportError[] | null
  created_by: string | null
  created_at: string
  completed_at: string | null
}

export interface ImportError {
  row: number
  field?: string
  message: string
}

/**
 * Minimal Supabase Database typing. Tables map to their row interfaces.
 * Insert/Update use Partial where the DB provides defaults.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
      }
      cities: {
        Row: City
        Insert: Partial<City> & { name: string; state: string; slug: string }
        Update: Partial<City>
      }
      neighborhoods: {
        Row: Neighborhood
        Insert: Partial<Neighborhood> & { name: string; slug: string }
        Update: Partial<Neighborhood>
      }
      properties: {
        Row: Property
        Insert: Partial<Property> & {
          title: string
          slug: string
          code: string
          purpose: PropertyPurpose
          type: string
          city: string
          neighborhood: string
        }
        Update: Partial<Property>
      }
      property_images: {
        Row: PropertyImage
        Insert: Partial<PropertyImage> & { property_id: string; url: string }
        Update: Partial<PropertyImage>
      }
      features: {
        Row: Feature
        Insert: Partial<Feature> & { name: string }
        Update: Partial<Feature>
      }
      property_features: {
        Row: PropertyFeature
        Insert: PropertyFeature
        Update: Partial<PropertyFeature>
      }
      leads: {
        Row: Lead
        Insert: Partial<Lead> & { name: string }
        Update: Partial<Lead>
      }
      lead_notes: {
        Row: LeadNote
        Insert: Partial<LeadNote> & { lead_id: string; content: string }
        Update: Partial<LeadNote>
      }
      settings: {
        Row: Settings
        Insert: Settings
        Update: Partial<Settings>
      }
      testimonials: {
        Row: Testimonial
        Insert: Partial<Testimonial> & { name: string; text: string }
        Update: Partial<Testimonial>
      }
      saved_properties: {
        Row: SavedProperty
        Insert: SavedProperty
        Update: Partial<SavedProperty>
      }
      property_views: {
        Row: PropertyView
        Insert: Partial<PropertyView> & { property_id: string }
        Update: Partial<PropertyView>
      }
      import_jobs: {
        Row: ImportJob
        Insert: Partial<ImportJob>
        Update: Partial<ImportJob>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
