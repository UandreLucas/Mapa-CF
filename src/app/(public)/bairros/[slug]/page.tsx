import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  ArrowRight,
  MapPin,
  Home,
  TrendingUp,
  Trees,
  ShoppingBag,
  GraduationCap,
  Waves,
  Star,
} from 'lucide-react'
import { PropertyCard } from '@/components/public/PropertyCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getNeighborhoodBySlug, getNeighborhoods, getProperties } from '@/lib/queries'

export const revalidate = 600
export const dynamic = 'force-dynamic'

/* ─── Per-bairro editorial content ─── */
const EDITORIAL: Record<
  string,
  {
    image: string
    highlights: { icon: typeof Home; label: string; value: string }[]
    about: string[]
    pointsOfInterest: { name: string; category: string; image: string }[]
    tags: string[]
  }
> = {
  altiplano: {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
    tags: ['Alto Padrão', 'Tranquilo', 'Vista privilegiada', 'Ótima infraestrutura'],
    about: [
      'O Altiplano é reconhecido como um dos bairros mais nobres de João Pessoa. Situado em cota elevada, oferece vista panorâmica da cidade e do litoral, com ruas arborizadas, calçadas bem conservadas e amplos espaços verdes.',
      'O bairro reúne uma excelente estrutura de serviços: shopping center, supermercados, farmácias, colégios de referência e restaurantes sofisticados, tudo a poucos minutos de distância. A combinação de segurança, tranquilidade e localização estratégica torna o Altiplano a escolha preferida de famílias e profissionais que buscam qualidade de vida diferenciada.',
    ],
    highlights: [
      { icon: TrendingUp, label: 'Valorização', value: 'Alta' },
      { icon: Trees, label: 'Áreas verdes', value: 'Amplas' },
      { icon: ShoppingBag, label: 'Comércio', value: 'Completo' },
      { icon: GraduationCap, label: 'Escolas', value: 'Referência' },
    ],
    pointsOfInterest: [
      {
        name: 'Shopping Pátio Altiplano',
        category: 'Shopping',
        image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&q=80',
      },
      {
        name: 'Parque Solon de Lucena',
        category: 'Lazer',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
      },
      {
        name: 'Colégio Paraibano',
        category: 'Educação',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
      },
    ],
  },
  'cabo-branco': {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
    tags: ['Beira-mar', 'Alto Padrão', 'Vista para o mar', 'Sofisticado'],
    about: [
      'Cabo Branco é sinônimo de sofisticação à beira-mar. O bairro ocupa uma das posições mais privilegiadas de João Pessoa, com acesso direto à orla e uma paisagem costeira de tirar o fôlego, incluindo o Ponto de Cabo Branco — o ponto mais oriental das Américas.',
      'Com infraestrutura completa e um perfil predominantemente residencial de alto padrão, Cabo Branco atrai moradores que valorizam qualidade de vida, segurança e a beleza natural do litoral paraibano.',
    ],
    highlights: [
      { icon: Waves, label: 'Praia', value: 'A 5 minutos' },
      { icon: TrendingUp, label: 'Valorização', value: 'Muito alta' },
      { icon: Star, label: 'Padrão', value: 'Luxo' },
      { icon: ShoppingBag, label: 'Comércio', value: 'Próximo' },
    ],
    pointsOfInterest: [
      {
        name: 'Orla de Cabo Branco',
        category: 'Praia',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
      },
      {
        name: 'Ponto Mais Oriental',
        category: 'Turismo',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80',
      },
      {
        name: 'Restaurantes à Beira-mar',
        category: 'Gastronomia',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
      },
    ],
  },
  manaira: {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
    tags: ['Nobre', 'Central', 'Lazer completo', 'Próximo à praia'],
    about: [
      'Manaíra é um dos bairros mais completos e valorizados de João Pessoa. Com localização central e fácil acesso a todas as regiões da cidade, o bairro reúne infraestrutura de lazer, gastronomia, comércio e educação em uma só região.',
      'O Manaíra Shopping é um dos principais centros de lazer da capital, enquanto a orla beira-mar oferece ciclovia, restaurantes e quiosques para momentos de descanso. O bairro atende desde jovens profissionais até famílias que buscam praticidade e bem-estar.',
    ],
    highlights: [
      { icon: ShoppingBag, label: 'Shopping', value: 'Manaíra' },
      { icon: Waves, label: 'Praia', value: 'Próxima' },
      { icon: TrendingUp, label: 'Valorização', value: 'Alta' },
      { icon: GraduationCap, label: 'Escolas', value: 'Várias' },
    ],
    pointsOfInterest: [
      {
        name: 'Manaíra Shopping',
        category: 'Shopping',
        image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&q=80',
      },
      {
        name: 'Orla de Manaíra',
        category: 'Lazer',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
      },
      {
        name: 'Espaços Gastronômicos',
        category: 'Gastronomia',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
      },
    ],
  },
  tambau: {
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80',
    tags: ['Tradicional', 'Turístico', 'Beira-mar', 'Infraestrutura completa'],
    about: [
      'Tambaú é o coração turístico de João Pessoa. Bairro tradicional e bem estruturado à beira-mar, é referência em gastronomia, artesanato e vida noturna, atraindo tanto moradores quanto visitantes de todo o país.',
      'Com ampla oferta de apartamentos, flats e residências de alto padrão próximos à praia, Tambaú é ideal para quem busca morar ou investir em um dos endereços mais conhecidos da capital paraibana.',
    ],
    highlights: [
      { icon: Waves, label: 'Praia', value: 'Na porta' },
      { icon: Star, label: 'Turismo', value: 'Destaque' },
      { icon: ShoppingBag, label: 'Comércio', value: 'Completo' },
      { icon: TrendingUp, label: 'Investimento', value: 'Excelente' },
    ],
    pointsOfInterest: [
      {
        name: 'Praia de Tambaú',
        category: 'Praia',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
      },
      {
        name: 'Mercado de Artesanato',
        category: 'Cultura',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80',
      },
      {
        name: 'Restaurantes à Beira-mar',
        category: 'Gastronomia',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
      },
    ],
  },
  bessa: {
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600&q=80',
    tags: ['Residencial', 'Tranquilo', 'Beira-mar', 'Familiar'],
    about: [
      'O Bessa é um bairro residencial de perfil familiar, com ruas tranquilas e acesso privilegiado ao mar. Menos movimentado que Tambaú e Manaíra, oferece uma rotina mais calma sem abrir mão da proximidade com a praia e os serviços essenciais.',
      'Nos últimos anos, o bairro passou por intensa valorização imobiliária, com novos empreendimentos de alto padrão surgindo na orla e nas ruas internas, tornando-se uma excelente opção de investimento.',
    ],
    highlights: [
      { icon: Waves, label: 'Praia', value: 'Frente ao mar' },
      { icon: Trees, label: 'Ambiente', value: 'Tranquilo' },
      { icon: TrendingUp, label: 'Valorização', value: 'Crescente' },
      { icon: Home, label: 'Perfil', value: 'Familiar' },
    ],
    pointsOfInterest: [
      {
        name: 'Praia do Bessa',
        category: 'Praia',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
      },
      {
        name: 'Calçadão da Orla',
        category: 'Lazer',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
      },
      {
        name: 'Comércio Local',
        category: 'Serviços',
        image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&q=80',
      },
    ],
  },
  'jardim-oceania': {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
    tags: ['Residencial', 'Bem localizado', 'Familiar', 'Acessível'],
    about: [
      'Jardim Oceania é um bairro residencial com excelente localização estratégica, oferecendo fácil acesso às principais vias e comércios da cidade. Tranquilo e bem estruturado, é uma ótima opção para famílias que buscam conforto e praticidade.',
      'O bairro conta com boas escolas, supermercados e comércio local, além de estar próximo às principais vias de acesso que conectam ao centro e à orla de João Pessoa.',
    ],
    highlights: [
      { icon: MapPin, label: 'Localização', value: 'Central' },
      { icon: Trees, label: 'Ambiente', value: 'Tranquilo' },
      { icon: GraduationCap, label: 'Escolas', value: 'Próximas' },
      { icon: Home, label: 'Perfil', value: 'Familiar' },
    ],
    pointsOfInterest: [
      {
        name: 'Vias de acesso',
        category: 'Mobilidade',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
      },
      {
        name: 'Parques e praças',
        category: 'Lazer',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
      },
      {
        name: 'Comércio local',
        category: 'Serviços',
        image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&q=80',
      },
    ],
  },
  aeroclube: {
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&q=80',
    tags: ['Moderno', 'Bem localizado', 'Em crescimento', 'Boa infraestrutura'],
    about: [
      'Aeroclube é um bairro residencial moderno com excelente infraestrutura e fácil acesso às principais vias da cidade. Nos últimos anos, tornou-se palco de lançamentos imobiliários de alto padrão que atraem compradores exigentes.',
      'Com perfil jovem e dinâmico, o bairro oferece opções variadas de lazer, gastronomia e serviços, além de boa conexão com o restante de João Pessoa.',
    ],
    highlights: [
      { icon: TrendingUp, label: 'Crescimento', value: 'Acelerado' },
      { icon: Star, label: 'Lançamentos', value: 'Frequentes' },
      { icon: ShoppingBag, label: 'Comércio', value: 'Variado' },
      { icon: MapPin, label: 'Acesso', value: 'Fácil' },
    ],
    pointsOfInterest: [
      {
        name: 'Novos empreendimentos',
        category: 'Imóveis',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      },
      {
        name: 'Gastronomia local',
        category: 'Alimentação',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
      },
      {
        name: 'Fácil acesso viário',
        category: 'Mobilidade',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
      },
    ],
  },
  intermares: {
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',
    tags: ['Praias preservadas', 'Alto Padrão', 'Cabedelo', 'Natureza'],
    about: [
      'Intermares, em Cabedelo, encanta pela beleza natural de suas praias preservadas e pela tranquilidade incomparável. O bairro vem ganhando espaço no mercado de alto padrão com empreendimentos modernos que aliam conforto e natureza.',
      'Localizado a poucos minutos de João Pessoa, Intermares oferece um estilo de vida mais relaxado, em contato com o rio, o mar e a natureza exuberante da costa paraibana.',
    ],
    highlights: [
      { icon: Waves, label: 'Praias', value: 'Preservadas' },
      { icon: Trees, label: 'Natureza', value: 'Exuberante' },
      { icon: TrendingUp, label: 'Valorização', value: 'Em alta' },
      { icon: Star, label: 'Padrão', value: 'Alto' },
    ],
    pointsOfInterest: [
      {
        name: 'Praia de Intermares',
        category: 'Praia',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
      },
      {
        name: 'Reserva ambiental',
        category: 'Natureza',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
      },
      {
        name: 'Condomínios de luxo',
        category: 'Imóveis',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      },
    ],
  },
}

const DEFAULT_EDITORIAL = {
  image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80',
  tags: ['João Pessoa', 'Paraíba'],
  about: ['Bairro nobre com ótima localização e infraestrutura completa em João Pessoa.'],
  highlights: [
    { icon: MapPin, label: 'Cidade', value: 'João Pessoa' },
    { icon: TrendingUp, label: 'Valorização', value: 'Crescente' },
    { icon: Home, label: 'Imóveis', value: 'Variados' },
    { icon: ShoppingBag, label: 'Comércio', value: 'Próximo' },
  ],
  pointsOfInterest: [] as { name: string; category: string; image: string }[],
}

export async function generateStaticParams() {
  try {
    const neighborhoods = await getNeighborhoods()
    return neighborhoods.map((n) => ({ slug: n.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const neighborhood = await getNeighborhoodBySlug(params.slug)
  if (!neighborhood) return { title: 'Bairro não encontrado' }
  return {
    title: neighborhood.seo_title || `Imóveis em ${neighborhood.name} | Eduardo Vieira`,
    description:
      neighborhood.seo_description ||
      `Conheça ${neighborhood.name} e veja imóveis à venda e para alugar nesse bairro nobre de João Pessoa. Atendimento especializado com Eduardo Vieira.`,
    openGraph: {
      images: [
        EDITORIAL[neighborhood.slug]?.image || DEFAULT_EDITORIAL.image,
      ],
    },
  }
}

export default async function NeighborhoodDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const neighborhood = await getNeighborhoodBySlug(params.slug)
  if (!neighborhood) notFound()

  const { data: properties, total } = await getProperties({
    neighborhood: neighborhood.name,
    perPage: 6,
  })

  const ed = EDITORIAL[neighborhood.slug] ?? DEFAULT_EDITORIAL
  const heroImage = neighborhood.cover_image_url || ed.image

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex h-[70vh] min-h-[500px] items-end overflow-hidden">
        <Image
          src={heroImage}
          alt={neighborhood.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="container-wide relative z-10 pb-14">
          {/* breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <Link href="/bairros" className="hover:text-white transition-colors">Bairros</Link>
            <span>/</span>
            <span className="text-white">{neighborhood.name}</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest text-brand-gold-light">
                <MapPin className="h-3.5 w-3.5" />
                João Pessoa, PB
              </p>
              <h1 className="font-serif text-5xl font-medium text-white md:text-7xl">
                {neighborhood.name}
              </h1>
            </div>

            <div className="rounded-xl bg-white/10 px-6 py-4 text-center backdrop-blur-sm border border-white/20">
              <p className="text-4xl font-bold text-white">{total}</p>
              <p className="mt-0.5 text-sm text-white/70">
                {total === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
              </p>
            </div>
          </div>

          {/* tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {ed.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="border-b border-border bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
            {ed.highlights.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-8 py-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-brand-navy">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
            <div>
              <p className="eyebrow mb-3">Sobre o bairro</p>
              <h2 className="font-serif text-3xl font-medium text-brand-navy">
                Por que morar no {neighborhood.name}?
              </h2>
              <div className="mt-6 space-y-4">
                {(neighborhood.description
                  ? [neighborhood.description]
                  : ed.about
                ).map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild variant="gold">
                  <Link href={`/imoveis?neighborhood=${encodeURIComponent(neighborhood.name)}`}>
                    Ver imóveis no {neighborhood.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title={`Mapa de ${neighborhood.name}`}
                className="h-full min-h-[320px] w-full"
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${neighborhood.name}, João Pessoa, Paraíba`
                )}&output=embed`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Points of interest ── */}
      {ed.pointsOfInterest.length > 0 && (
        <section className="bg-secondary/40 section-padding">
          <div className="container-wide">
            <p className="eyebrow mb-3">O que tem por aqui</p>
            <h2 className="font-serif text-3xl font-medium text-brand-navy">
              Pontos de interesse
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ed.pointsOfInterest.map((poi) => (
                <div
                  key={poi.name}
                  className="group relative overflow-hidden rounded-xl bg-card shadow-sm border border-border"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={poi.image}
                      alt={poi.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {poi.category}
                    </Badge>
                    <p className="font-medium text-foreground">{poi.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Properties ── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-2">Disponíveis agora</p>
              <h2 className="font-serif text-3xl font-medium text-brand-navy">
                {total > 0
                  ? `${total} ${total === 1 ? 'imóvel' : 'imóveis'} em ${neighborhood.name}`
                  : `Imóveis em ${neighborhood.name}`}
              </h2>
            </div>
            {total > 6 && (
              <Button asChild variant="gold-outline">
                <Link href={`/imoveis?neighborhood=${encodeURIComponent(neighborhood.name)}`}>
                  Ver todos os {total} imóveis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {properties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/30 px-8 py-16 text-center">
              <Home className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium text-foreground">
                Nenhum imóvel publicado em {neighborhood.name} no momento
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Entre em contato e avisaremos assim que surgir uma oportunidade.
              </p>
              <Button asChild variant="gold" className="mt-6">
                <Link href="/contato">Ser avisado</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA bottom ── */}
      <section className="bg-brand-navy section-padding">
        <div className="container-wide text-center">
          <p className="eyebrow mb-3 text-brand-gold-light">Atendimento especializado</p>
          <h2 className="font-serif text-3xl font-medium text-white md:text-4xl">
            Quer morar no {neighborhood.name}?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Fale com Eduardo Vieira e descubra as melhores oportunidades deste bairro.
            Curadoria exclusiva, atendimento personalizado e total segurança na negociação.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="gold">
              <Link href="/contato">Entrar em contato</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/imoveis">Ver todos os imóveis</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
