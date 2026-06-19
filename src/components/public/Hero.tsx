import Image from 'next/image'
import { SearchBar } from './SearchBar'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80'

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Imóvel de alto padrão em João Pessoa"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 pt-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4 text-brand-gold-light animate-fade-in">
            Curadoria de imóveis exclusivos · João Pessoa
          </p>
          <h1 className="text-balance font-serif text-4xl font-medium leading-[1.1] text-white animate-fade-up sm:text-5xl md:text-6xl lg:text-7xl">
            O endereço do seu próximo
            <span className="text-brand-gold"> capítulo</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 animate-fade-up">
            Imóveis de alto padrão nos bairros mais desejados da capital
            paraibana. Atendimento exclusivo, do primeiro contato às chaves.
          </p>
        </div>

        <div className="mt-10 max-w-4xl animate-fade-up">
          <SearchBar variant="hero" />
        </div>

        {/* Quick stats */}
        <div className="mt-12 flex flex-wrap gap-x-12 gap-y-6 text-white">
          <div>
            <p className="font-serif text-3xl font-semibold text-brand-gold">+10</p>
            <p className="text-sm text-white/70">anos de experiência</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-semibold text-brand-gold">8</p>
            <p className="text-sm text-white/70">bairros nobres atendidos</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-semibold text-brand-gold">100%</p>
            <p className="text-sm text-white/70">atendimento personalizado</p>
          </div>
        </div>
      </div>
    </section>
  )
}
