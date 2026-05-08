'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import NavBar from '@/components/NavBar';

// ─── Modal de Detalhe do Atestado ─────────────────────────────────────────────
function ModalDetalhe({ atestado, onClose, formatarData, calcularDias }) {
  if (!atestado) return null;

  const isApproved = atestado.status === 'APPROVED';
  const isRejected = atestado.status === 'REJECTED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Detalhes do Atestado</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatarData(atestado.startDate)} até {formatarData(atestado.endDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            isApproved ? 'bg-emerald-50 border-emerald-200' :
            isRejected ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isApproved ? 'bg-emerald-100' : isRejected ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              {isApproved && (
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isRejected && (
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {!isApproved && !isRejected && (
                <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${
                isApproved ? 'text-emerald-600' : isRejected ? 'text-red-600' : 'text-yellow-600'
              }`}>Status do Atestado</p>
              <p className={`font-semibold text-sm ${
                isApproved ? 'text-emerald-800' : isRejected ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {isApproved ? 'Aprovado pelo RH' : isRejected ? 'Recusado pelo RH' : 'Aguardando análise do RH'}
              </p>
            </div>
          </div>

          {/* Motivo de recusa */}
          {isRejected && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Motivo da Recusa</p>
              </div>
              <p className="text-sm text-red-800 leading-relaxed">
                {atestado.motivoRecusa || 'O RH não informou um motivo específico. Entre em contato com o setor de RH para mais informações.'}
              </p>
            </div>
          )}

          {/* Info do afastamento */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Período de Afastamento</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center">
                <span className="block text-xs text-gray-500 mb-1">Início</span>
                <span className="font-semibold text-gray-900 text-sm">{formatarData(atestado.startDate)}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center">
                <span className="block text-xs text-gray-500 mb-1">Fim</span>
                <span className="font-semibold text-gray-900 text-sm">{formatarData(atestado.endDate)}</span>
              </div>
              <div className="bg-[#e4fcfc] rounded-lg p-3 border border-[#b2e8e8] text-center">
                <span className="block text-xs text-[#00a8ac] mb-1">Dias</span>
                <span className="font-bold text-[#00a8ac] text-sm">{calcularDias(atestado.startDate, atestado.endDate)}d</span>
              </div>
            </div>
          </div>

          {/* CRM */}
          {atestado.crmNumber && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Informações Médicas</p>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <span className="text-xs text-gray-500">CRM:</span>
                <span className="ml-2 font-semibold text-gray-800 text-sm">{atestado.crmNumber}</span>
              </div>
            </div>
          )}

          {/* Botão visualizar arquivo */}
          {atestado.fileUrl && (
            <a
              href={atestado.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#00a8ac] text-white rounded-lg text-sm font-semibold hover:bg-[#008f92] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visualizar Documento
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MeusAtestados() {
  const [atestados, setAtestados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [atestadoSelecionado, setAtestadoSelecionado] = useState(null);

  useEffect(() => {
    async function fetchMeusAtestados() {
      try {
        setIsLoading(true);
        const response = await api.get('/certificates?limit=100');
        setAtestados(response.data);
      } catch (err) {
        console.error('Erro ao carregar atestados:', err);
        setError('Não foi possível carregar o seu histórico. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMeusAtestados();
  }, []);

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    return new Date(dataIso).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const calcularDias = (inicio, fim) => {
    const d1 = new Date(inicio);
    const d2 = new Date(fim);
    return Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <NavBar />

      {atestadoSelecionado && (
        <ModalDetalhe
          atestado={atestadoSelecionado}
          onClose={() => setAtestadoSelecionado(null)}
          formatarData={formatarData}
          calcularDias={calcularDias}
        />
      )}

      <main className="flex-1 w-full px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Atestados</h1>
            <p className="text-sm text-gray-500 mt-1">
              Acompanhe o histórico e a situação dos documentos enviados ao RH.
            </p>
          </div>
          <Link href="/funcionario/novo-atestado"
            className="bg-[#00a8ac] text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#008f92] transition-colors text-center">
            + Enviar Novo Atestado
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-gray-500">Carregando seu histórico de atestados...</div>
          ) : atestados.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium">Nenhum atestado encontrado</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">Você ainda não enviou nenhum documento.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {atestados.map((atestado) => {
                const isRejected = atestado.status === 'REJECTED';
                return (
                  <div
                    key={atestado.id}
                    className="p-6 flex flex-col gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setAtestadoSelecionado(atestado)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <div className="w-10 h-10 rounded-full bg-[#e4fcfc] text-[#00a8ac] flex items-center justify-center font-bold text-sm">
                            {calcularDias(atestado.startDate, atestado.endDate)}d
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-base flex items-center gap-2">
                            Afastamento
                            <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full tracking-wide
                              ${atestado.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                atestado.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'}`}>
                              {atestado.status === 'APPROVED' ? 'Aprovado' :
                               atestado.status === 'REJECTED' ? 'Recusado' : 'Em Análise'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            De <span className="font-medium text-gray-700">{formatarData(atestado.startDate)}</span> até <span className="font-medium text-gray-700">{formatarData(atestado.endDate)}</span>
                          </div>
                          {atestado.crmNumber && (
                            <div className="text-xs text-gray-400 mt-1">CRM: {atestado.crmNumber}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 md:justify-end">
                        {isRejected && (
                          <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Ver motivo
                          </span>
                        )}
                        <span className="text-xs text-[#00a8ac] font-medium flex items-center gap-1">
                          Ver detalhes
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
