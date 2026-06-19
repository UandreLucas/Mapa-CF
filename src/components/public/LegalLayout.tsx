interface LegalLayoutProps {
  title: string
  updatedAt: string
  children: React.ReactNode
}

export function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  return (
    <>
      <div className="bg-brand-navy pb-12 pt-32">
        <div className="container-wide">
          <p className="eyebrow mb-3 text-brand-gold-light">Documentos</p>
          <h1 className="font-serif text-3xl font-medium text-white md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Última atualização: {updatedAt}
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <div className="space-y-6 leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-brand-navy [&_li]:ml-4 [&_li]:list-disc [&_p]:text-base [&_ul]:space-y-2">
            {children}
          </div>
        </div>
      </section>
    </>
  )
}
