import type { Metadata } from 'next'
import { LegalLayout } from '@/components/public/LegalLayout'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Saiba como o site Eduardo Vieira Imóveis coleta, utiliza e protege os seus dados pessoais, em conformidade com a LGPD.',
}

export default function PrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" updatedAt="Junho de 2024">
      <p>
        Esta Política de Privacidade descreve como o site Eduardo Vieira Imóveis
        coleta, utiliza, armazena e protege as informações pessoais dos
        usuários, em conformidade com a Lei Geral de Proteção de Dados (Lei nº
        13.709/2018 - LGPD).
      </p>

      <h2>1. Dados que coletamos</h2>
      <p>
        Podemos coletar as seguintes informações quando você utiliza nossos
        formulários de contato, interesse em imóveis ou avaliação:
      </p>
      <ul>
        <li>Nome completo;</li>
        <li>Telefone e/ou WhatsApp;</li>
        <li>Endereço de e-mail;</li>
        <li>Mensagem e preferências informadas;</li>
        <li>Dados de navegação anônimos (cookies e estatísticas de acesso).</li>
      </ul>

      <h2>2. Como utilizamos seus dados</h2>
      <p>As informações coletadas são utilizadas para:</p>
      <ul>
        <li>Responder a solicitações e prestar atendimento;</li>
        <li>Apresentar imóveis e oportunidades compatíveis com seu interesse;</li>
        <li>Conduzir negociações de compra, venda ou locação;</li>
        <li>Melhorar a experiência de navegação no site.</li>
      </ul>

      <h2>3. Compartilhamento de dados</h2>
      <p>
        Não vendemos nem compartilhamos seus dados pessoais com terceiros para
        fins de marketing. Os dados podem ser compartilhados apenas quando
        necessário para a prestação do serviço (ex.: instituições financeiras em
        processos de financiamento) ou por exigência legal.
      </p>

      <h2>4. Armazenamento e segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger seus dados
        contra acessos não autorizados, perda ou alteração indevida. Os dados são
        mantidos somente pelo tempo necessário às finalidades descritas.
      </p>

      <h2>5. Seus direitos</h2>
      <p>
        Em conformidade com a LGPD, você pode solicitar a qualquer momento o
        acesso, a correção, a portabilidade ou a exclusão dos seus dados, bem
        como revogar o consentimento concedido.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Utilizamos cookies para melhorar a navegação e analisar o uso do site.
        Você pode gerenciar as preferências de cookies diretamente no seu
        navegador.
      </p>

      <h2>7. Contato</h2>
      <p>
        Para exercer seus direitos ou esclarecer dúvidas sobre esta política,
        entre em contato pelos canais oficiais disponíveis na página de Contato.
      </p>
    </LegalLayout>
  )
}
