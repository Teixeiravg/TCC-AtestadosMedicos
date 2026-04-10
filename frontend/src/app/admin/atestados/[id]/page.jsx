'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import NavBarAdmin from '@/components/NavBarAdmin';

export default function DetalhesAtestado({ params }) {
  const router = useRouter();
  const { id } = params;

  const [atestado, setAtestado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchDetalhes() {
      try {
        setIsLoading(true);
        const response = await api.get(`/admin/certificates/${id}`);
        setAtestado(response.data);
      } catch (err) {
        console.error("Erro ao buscar atestado:", err);
        setError("Não foi possível carregar os detalhes do atestado.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchDetalhes();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsProcessing(true);
      await api.patch(`/admin/certificates/${id}/status`, { status: newStatus });
      alert(`Atestado ${newStatus === 'APPROVED' ? 'Aprovado' : 'Recusado'} com sucesso!`);
      // Atualiza o estado local para forçar a re-renderização e mostrar a nova tela de "Analisado"
      setAtestado(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert("Erro ao atualizar o status no servidor.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    return new Date(dataIso).toLocaleDateString('pt-BR');
  };

  const calcularDias = (inicio, fim) => {
    const data1 = new Date(inicio);
    const data2 = new Date(fim);
    const diferencaTempo = Math.abs(data2 - data1);
    return Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBarAdmin />
        <main className="flex-1 flex items-center justify-center text-gray-500">
          Carregando informações do documento...
        </main>
      </div>
    );
  }

  if (error || !atestado) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBarAdmin />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
          <div className="text-red-500">{error || "Atestado não encontrado."}</div>
          <Link href="/admin/atestados" className="text-[#00a8ac] hover:underline text-sm font-medium">
            &larr; Voltar para a lista
          </Link>
        </main>
      </div>
    );
  }

  const fileUrl = atestado.fileUrl ? `http://localhost:3000${atestado.fileUrl}` : null;
  const isPending = atestado.status === 'PENDING';
  const isApproved = atestado.status === 'APPROVED';

  // Configuração visual da Badge de Status Final (para a tela de Analisado)
  const statusColorClass = isApproved 
    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
    : 'bg-red-50 border-red-200 text-red-700';
  
  const statusIcon = isApproved ? (
    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavBarAdmin />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
        
        {/* Cabeçalho Base */}
        <div className="mb-8">
          <Link href="/admin/atestados" className="text-sm text-gray-500 hover:text-[#00a8ac] hover:underline mb-4 inline-block transition-colors">
            &larr; Voltar para atestados
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isPending ? 'Avaliação de Atestado' : 'Atestado Avaliado'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isPending ? 'Verifique o documento e decida sobre a aprovação.' : 'Os detalhes deste documento já foram processados pelo RH.'}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* LADO ESQUERDO: Visualizador do Documento (Permanece igual) */}
          <div className="w-full md:w-1/2 bg-gray-100 border-r border-gray-200 p-8 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Documento Anexado
            </h3>
            
            <div className="flex-1 bg-white border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
              {fileUrl ? (
                <embed src={fileUrl} className="w-full h-full object-contain" type="application/pdf" />
              ) : (
                <span className="text-gray-400 text-sm italic">Nenhum arquivo enviado</span>
              )}
            </div>
            
            {fileUrl && (
              <a 
                href={fileUrl} 
                download
                target="_blank"
                rel="noreferrer"
                className="mt-6 text-center text-sm text-[#00a8ac] font-medium hover:underline bg-[#00a8ac] bg-opacity-10 py-2 rounded-md"
              >
                Abrir arquivo em nova guia
              </a>
            )}
          </div>

          {/* LADO DIREITO: Varia com base no Status */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
            
            <div className="space-y-6">
              
              {/* STATUS EM DESTAQUE (Apenas se já estiver avaliado, baseado na sua imagem) */}
              {!isPending && (
                <div className={`p-4 border rounded-lg flex items-center justify-between mb-2 ${statusColorClass}`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-full shadow-sm">
                      {statusIcon}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider mb-0.5">Status Final</p>
                      <p className="font-semibold">{isApproved ? 'Documento Aprovado' : 'Documento Recusado'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informações do Funcionário */}
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Dados do Funcionário</h2>
                <p className="text-xl font-bold text-gray-900">{atestado.user?.name || 'Não Informado'}</p>
                <p className="text-sm text-gray-500">{atestado.user?.email}</p>
              </div>

              <hr className="border-gray-100" />

              {/* Detalhes do Afastamento */}
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Detalhes do Afastamento</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <span className="block text-xs text-gray-500 font-medium mb-1">Início</span>
                    <span className="font-semibold text-gray-900">{formatarData(atestado.startDate)}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <span className="block text-xs text-gray-500 font-medium mb-1">Término</span>
                    <span className="font-semibold text-gray-900">{formatarData(atestado.endDate)}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
                  <div>
                    <span className="block text-xs text-gray-500 font-medium mb-1">Motivo</span>
                    <span className="font-semibold text-gray-900">{atestado.motivo || 'Motivo não especificado'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-medium mb-1">Dias Afastado</span>
                    <span className="font-semibold text-[#00a8ac]">{calcularDias(atestado.startDate, atestado.endDate)} dias</span>
                  </div>
                  {atestado.crmNumber && (
                    <div>
                      <span className="block text-xs text-gray-500 font-medium mb-1">CRM Médico</span>
                      <span className="font-semibold text-gray-900">{atestado.crmNumber}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {atestado.observacoes && (
                <div>
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Observações</h2>
                  <p className="text-sm text-gray-700 bg-yellow-50/30 p-3 rounded border border-yellow-100">
                    {atestado.observacoes}
                  </p>
                </div>
              )}
            </div>

            {/* Ações (Renderizadas apenas se estiver PENDENTE) */}
            {isPending && (
              <div className="mt-10 pt-6 border-t border-gray-100">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleStatusUpdate('APPROVED')}
                    disabled={isProcessing}
                    className="w-full py-3 bg-emerald-500 text-white rounded-md text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isProcessing ? 'Processando...' : 'Aprovar Atestado'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('REJECTED')}
                    disabled={isProcessing}
                    className="w-full py-3 bg-white text-red-500 border border-red-200 rounded-md text-sm font-bold hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Recusar Documento
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}