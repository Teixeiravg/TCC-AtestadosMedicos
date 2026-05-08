'use client';

import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import NavBarAdmin from '@/components/NavBarAdmin';

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white cursor-pointer
            ${t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-red-500' : 'bg-gray-700'}`}
        >
          {t.type === 'success' && (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          )}
          {t.type === 'error' && (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);
  const remove = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

// ─── Modal de Recusa ──────────────────────────────────────────────────────────
function ModalRecusa({ onConfirm, onCancel, isProcessing }) {
  const [motivo, setMotivo] = useState('');
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Recusar atestado</h2>
        <p className="text-sm text-gray-500 mb-4">Informe o motivo da recusa para que o funcionário seja notificado.</p>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ex: Documento ilegível, CRM inválido, data inconsistente..."
          className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-28 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onCancel} disabled={isProcessing}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button onClick={() => onConfirm(motivo)} disabled={isProcessing || !motivo.trim()}
            className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing ? 'Recusando...' : 'Confirmar Recusa'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function DetalhesAtestado({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const { toasts, add: addToast, remove } = useToast();

  const [atestado, setAtestado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModalRecusa, setShowModalRecusa] = useState(false);

  useEffect(() => {
    async function fetchDetalhes() {
      try {
        setIsLoading(true);
        const response = await api.get(`/admin/certificates/${id}`);
        setAtestado(response.data);
      } catch (err) {
        console.error('Erro ao buscar atestado:', err);
        setError('Não foi possível carregar os detalhes do atestado.');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchDetalhes();
  }, [id]);

  const handleAprovar = async () => {
    try {
      setIsProcessing(true);
      await api.patch(`/admin/certificates/${id}/approve`);
      setAtestado((prev) => ({ ...prev, status: 'APPROVED' }));
      addToast('Atestado aprovado com sucesso!', 'success');
    } catch (err) {
      addToast('Erro ao aprovar. Tente novamente.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecusar = async (motivoRecusa) => {
    try {
      setIsProcessing(true);
      await api.patch(`/admin/certificates/${id}/reject`, { motivoRecusa });
      setAtestado((prev) => ({ ...prev, status: 'REJECTED', motivoRecusa }));
      setShowModalRecusa(false);
      addToast('Atestado recusado.', 'error');
    } catch (err) {
      addToast('Erro ao recusar. Tente novamente.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    return new Date(dataIso).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const calcularDias = (inicio, fim) => {
    const d1 = new Date(inicio);
    const d2 = new Date(fim);
    return Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
  };

  const formatarMotivo = (motivo) => {
    if (!motivo) return 'Motivo não especificado';
    const mapa = { DOENCA: 'Doença', EXAME: 'Exame médico', ACOMPANHAMENTO: 'Acompanhamento' };
    return mapa[motivo] || motivo;
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBarAdmin />
      <main className="flex-1 flex items-center justify-center text-sm text-gray-400">Carregando documento...</main>
    </div>
  );

  if (error || !atestado) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBarAdmin />
      <main className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
        <p className="text-red-500">{error || 'Atestado não encontrado.'}</p>
        <Link href="/admin/atestados" className="text-[#00a8ac] hover:underline text-sm">&larr; Voltar para a lista</Link>
      </main>
    </div>
  );

  const fileUrl = atestado.fileUrl
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${atestado.fileUrl}`
    : null;

  const isPending = atestado.status === 'PENDING';
  const isApproved = atestado.status === 'APPROVED';
  const isRejected = atestado.status === 'REJECTED';

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      <NavBarAdmin />
      <Toast toasts={toasts} remove={remove} />
      {showModalRecusa && (
        <ModalRecusa
          onConfirm={handleRecusar}
          onCancel={() => setShowModalRecusa(false)}
          isProcessing={isProcessing}
        />
      )}

      {/* Layout de tela cheia: 2 colunas */}
      <div className="flex flex-1 overflow-hidden">

        {/* Esquerda — Visualizador PDF (ocupa toda a altura) */}
        <div className="hidden md:flex w-1/2 flex-col bg-gray-900 border-r border-gray-800">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700/60 bg-gray-800">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-sm text-gray-300 font-medium">Documento Anexado</span>
            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noreferrer"
                className="ml-auto text-xs text-[#00a8ac] hover:underline">
                Abrir em nova guia ↗
              </a>
            )}
          </div>
          <div className="flex-1">
            {fileUrl ? (
              <embed src={fileUrl} className="w-full h-full" type="application/pdf" />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
                Nenhum arquivo enviado
              </div>
            )}
          </div>
        </div>

        {/* Direita — Detalhes + ações (scroll interno) */}
        <div className="w-full md:w-1/2 flex flex-col overflow-y-auto">
          {/* Topo com back + título */}
          <div className="px-8 pt-7 pb-5 border-b border-gray-100 bg-white sticky top-0 z-10">
            <Link href="/admin/atestados"
              className="text-xs text-gray-400 hover:text-[#00a8ac] transition-colors mb-3 inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para atestados
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              {isPending ? 'Avaliação de Atestado' : 'Atestado Avaliado'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isPending
                ? 'Verifique o documento e decida sobre a aprovação.'
                : 'Este documento já foi processado pelo RH.'}
            </p>
          </div>

          <div className="flex-1 px-8 py-6 space-y-6 bg-gray-50">

            {/* Status banner */}
            {!isPending && (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                isApproved ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isApproved ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {isApproved ? (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    isApproved ? 'text-emerald-600' : 'text-red-500'
                  }`}>Status Final</p>
                  <p className={`font-semibold text-sm ${
                    isApproved ? 'text-emerald-800' : 'text-red-800'
                  }`}>
                    {isApproved ? 'Documento Aprovado' : 'Documento Recusado'}
                  </p>
                </div>
              </div>
            )}

            {/* Motivo de recusa */}
            {isRejected && atestado.motivoRecusa && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Motivo da Recusa</p>
                <p className="text-sm text-red-800 leading-relaxed">{atestado.motivoRecusa}</p>
              </div>
            )}

            {/* Dados do funcionário */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Funcionário</p>
              <p className="text-lg font-bold text-gray-900">{atestado.user?.name || 'Não Informado'}</p>
              <p className="text-sm text-gray-500">{atestado.user?.email}</p>
            </div>

            {/* Detalhes do afastamento */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Afastamento</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <span className="block text-xs text-gray-500 mb-1">Início</span>
                  <span className="font-semibold text-gray-900 text-sm">{formatarData(atestado.startDate)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <span className="block text-xs text-gray-500 mb-1">Fim</span>
                  <span className="font-semibold text-gray-900 text-sm">{formatarData(atestado.endDate)}</span>
                </div>
                <div className="bg-[#e4fcfc] rounded-lg p-3 border border-[#b2e8e8]">
                  <span className="block text-xs text-[#00a8ac] mb-1">Dias</span>
                  <span className="font-bold text-[#00a8ac] text-sm">{calcularDias(atestado.startDate, atestado.endDate)}d</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Motivo</span>
                  <span className="font-semibold text-gray-900 text-sm">{formatarMotivo(atestado.motivo)}</span>
                </div>
                {atestado.nomeMedico && (
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">Médico</span>
                    <span className="font-semibold text-gray-900 text-sm">{atestado.nomeMedico}</span>
                  </div>
                )}
                {atestado.crmNumber && (
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">CRM</span>
                    <span className="font-semibold text-gray-900 text-sm">{atestado.crmNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {atestado.observacoes && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Observações</p>
                <p className="text-sm text-gray-700 leading-relaxed">{atestado.observacoes}</p>
              </div>
            )}

            {/* Botão mobile para ver arquivo */}
            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noreferrer"
                className="md:hidden flex items-center justify-center gap-2 w-full py-2.5 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition">
                Visualizar Documento
              </a>
            )}
          </div>

          {/* Rodapé com botões de ação */}
          {isPending && (
            <div className="px-8 py-5 bg-white border-t border-gray-100 sticky bottom-0">
              <div className="flex gap-3">
                <button
                  onClick={handleAprovar}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition disabled:opacity-50"
                >
                  {isProcessing ? 'Processando...' : '✓ Aprovar Atestado'}
                </button>
                <button
                  onClick={() => setShowModalRecusa(true)}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-white text-red-500 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-300 transition disabled:opacity-50"
                >
                  ✗ Recusar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
