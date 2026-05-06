'use client';
import { useRouter } from 'next/navigation';

export default function Termos() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f0fafa] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-md max-w-2xl w-full p-8">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a6b6b]">Ateste+</h1>
          <h2 className="text-lg font-semibold text-gray-700 mt-1">
            Política de Privacidade e Proteção de Dados
          </h2>
          <p className="text-xs text-gray-400 mt-1">Lei Geral de Proteção de Dados — Lei nº 13.709/2018 (LGPD)</p>
        </div>

        <div className="text-sm text-gray-600 space-y-4 max-h-96 overflow-y-auto pr-2 border border-gray-100 rounded-lg p-4">

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">1. Quais dados coletamos</h3>
            <p>Coletamos nome completo, e-mail corporativo, senha (armazenada de forma criptografada) e documentos de atestados médicos enviados pelo usuário.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">2. Como usamos seus dados</h3>
            <p>Os dados são utilizados exclusivamente para gerenciamento interno de atestados médicos, controle de ausências e relatórios administrativos da empresa. Nenhum dado é compartilhado com terceiros.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">3. Armazenamento e segurança</h3>
            <p>Todas as informações são armazenadas em servidores seguros com acesso restrito. Senhas são criptografadas e documentos são acessíveis apenas por você e pelos administradores autorizados.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">4. Seus direitos (LGPD)</h3>
            <p>Conforme a Lei nº 13.709/2018, você tem direito a:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Confirmar a existência de tratamento de seus dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Solicitar a correção de dados incompletos ou incorretos</li>
              <li>Solicitar a exclusão de dados desnecessários</li>
              <li>Revogar o consentimento a qualquer momento</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">5. Retenção de dados</h3>
            <p>Seus dados são mantidos enquanto você possuir vínculo ativo com a empresa. Após desligamento, os dados são anonimizados ou excluídos em até 90 dias, salvo obrigação legal.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">6. Contato</h3>
            <p>Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato com o setor de RH ou com o encarregado de dados (DPO) da empresa.</p>
          </section>

        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={() => router.back()}
            className="px-5 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Voltar
          </button>
        </div>

      </div>
    </div>
  );
}