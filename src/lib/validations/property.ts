import { z } from 'zod'

export const propertySchema = z.object({
  title: z.string().min(5, 'O título deve ter ao menos 5 caracteres'),
  code: z.string().optional(),
  purpose: z.enum(['sale', 'rent', 'both'], {
    required_error: 'Selecione a finalidade',
  }),
  type: z.string().min(1, 'Selecione o tipo de imóvel'),
  status: z.enum(['draft', 'published', 'sold', 'rented', 'archived']),
  city: z.string().min(2, 'Informe a cidade'),
  state: z.string().min(2).max(2).default('PB'),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  neighborhood_id: z.string().uuid().nullable().optional(),
  address: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  zip_code: z.string().optional().nullable(),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  hide_address: z.boolean().default(false),
  price: z.coerce.number().nonnegative('Preço inválido').nullable().optional(),
  hide_price: z.boolean().default(false),
  condo_fee: z.coerce.number().nonnegative().nullable().optional(),
  iptu: z.coerce.number().nonnegative().nullable().optional(),
  private_area: z.coerce.number().nonnegative().nullable().optional(),
  total_area: z.coerce.number().nonnegative().nullable().optional(),
  bedrooms: z.coerce.number().int().min(0).default(0),
  suites: z.coerce.number().int().min(0).default(0),
  bathrooms: z.coerce.number().int().min(0).default(0),
  parking: z.coerce.number().int().min(0).default(0),
  year_built: z.coerce.number().int().nullable().optional(),
  description: z.string().optional().nullable(),
  video_url: z.string().url('URL inválida').or(z.literal('')).optional().nullable(),
  virtual_tour_url: z
    .string()
    .url('URL inválida')
    .or(z.literal(''))
    .optional()
    .nullable(),
  is_featured: z.boolean().default(false),
  is_luxury: z.boolean().default(false),
  is_launch: z.boolean().default(false),
  is_furnished: z.boolean().default(false),
  accepts_pets: z.boolean().default(false),
  available_from: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional().nullable(),
        is_cover: z.boolean().default(false),
        display_order: z.number().default(0),
      })
    )
    .default([]),
})

export type PropertyFormValues = z.infer<typeof propertySchema>

const highlightSchema = z.object({
  icon: z.string(),
  label: z.string(),
  value: z.string(),
})

const poiSchema = z.object({
  name: z.string(),
  category: z.string(),
  image: z.string(),
})

export const neighborhoodSchema = z.object({
  name: z.string().min(2, 'Informe o nome do bairro'),
  city_id: z.string().uuid().nullable().optional(),
  city_name: z.string().optional().nullable(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  cover_image_url: z.string().url('URL inválida').or(z.literal('')).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  highlights: z.array(highlightSchema).optional().nullable(),
  points_of_interest: z.array(poiSchema).optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
})

export type NeighborhoodFormValues = z.infer<typeof neighborhoodSchema>
