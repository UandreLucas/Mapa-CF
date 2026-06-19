import type { Metadata } from 'next'
import { LegalLayout } from '@/components/public/LegalLayout'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'Termos e condições de uso do site Eduardo Vieira Imóveis.',
}

export default function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="Junho de 2024">
      <p>
        Ao acessar e utilizar o site Eduardo Vieira Imóveis, você concorda com os
        termos e condições descritos abaixo. Recomendamos a leitura atenta deste
        documento.
      </p>

      <h2>1. Objeto</h2>
      <p>
        Este site tem como finalidade divulgar imóveis disponíveis para compra,
        venda e locação, bem como facilitar o contato entre clientes e o corretor
        responsável.
      </p>

      <h2>2. Informações dos imóveis</h2>
      <p>
        Empenhamo-nos para manter as informações dos imóveis atualizadas e
        precisas. Contudo, valores, disponibilidade e características podem sofrer
        alterações sem aviso prévio. As informações exibidas não constituem
        oferta vinculante e devem ser confirmadas diretamente conosco.
      </p>

      <h2>3. Uso adequado</h2>
      <p>O usuário compromete-se a:</p>
      <ul>
        <li>Fornecer informações verídicas nos formulários;</li>
        <li>Não utilizar o site para fins ilícitos ou que violem direitos de terceiros;</li>
        <li>Não reproduzir conteúdo sem autorização prévia.</li>
      </ul>

      <h2>4. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo deste site, incluindo textos, imagens, logotipos e
        layout, é protegido por direitos autorais e não pode ser utilizado sem
        autorização expressa.
      </p>

      <h2>5. Limitação de responsabilidade</h2>
      <p>
        Não nos responsabilizamos por eventuais indisponibilidades temporárias do
        site ou por decisões tomadas exclusivamente com base nas informações aqui
        apresentadas, sem a devida confirmação.
      </p>

      <h2>6. Alterações dos termos</h2>
      <p>
        Estes Termos de Uso podem ser atualizados a qualquer momento. A versão
        vigente estará sempre disponível nesta página.
      </p>

      <h2>7. Foro</h2>
      <p>
        Fica eleito o foro da Comarca de João Pessoa - PB para dirimir quaisquer
        questões oriundas destes termos.
      </p>
    </LegalLayout>
  )
}
