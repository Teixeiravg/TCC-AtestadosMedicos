'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import NavBarAdmin from '@/components/NavBarAdmin';

export default function AdminAtestados() {
  const [atestados, setAtestados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para o Filtro do Dev 5 (Todos, Pendentes, Aprovados, Recusados)
  const [filtroAtual, setFiltroAtual] = useState('TODOS');

  useEffect(() => {
    async function fetchTodosAtestados() {
      try {
        setIsLoading(true);
        // O backend (Módulo Dev 5) deve retornar a lista completa ou filtrada
        const response = await api.get('/admin/certificates');
        setAtestados(response.data.data);
      } catch (err) {
        console.error("Erro ao buscar atestados:", err);
        setError("Não foi possível carregar a fila de atestados. Verifique o servidor.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodosAtestados();
  }, []);

  // Funções utilitárias
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

  // Aplicação do Filtro no Frontend
  const atestadosFiltrados = atestados.filter(atestado => {
    if (filtroAtual === 'TODOS') return true;
    return atestado.status === filtroAtual;
  });

  // Cálculos para os Cards de Resumo
  const totalAtestados = atestados.length;
  const atestadosPendentes = atestados.filter(a => a.status === 'PENDING').length;
  const atestadosAnalisados = atestados.filter(a => a.status !== 'PENDING').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavBarAdmin />

      <main className="flex-1 w-full max-w-5xl mx-auto px-8 py-10 flex flex-col gap-6">

        {/* --- CARD 1: Resumo do Administrador --- */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-normal text-gray-900">Visão Geral do RH</h1>
          <p className="text-sm text-gray-500 mt-2 mb-6">Acompanhe e gerencie todos os atestados da empresa.</p>
          <hr className="border-gray-200 mb-6" />

          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-gray-900 font-medium text-lg">
                {isLoading ? "-" : totalAtestados}
              </span>
              <span className="text-sm text-gray-500">Total Recebidos</span>
            </div>
            <div className="flex flex-col">
              <span className="text-yellow-500 font-medium text-lg">
                {isLoading ? "-" : atestadosPendentes}
              </span>
              <span className="text-sm text-gray-500">Pendentes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#1a9e9e] font-medium text-lg">
                {isLoading ? "-" : atestadosAnalisados}
              </span>
              <span className="text-sm text-gray-500">Analisados</span>
            </div>
          </div>
        </div>

        {/* --- CARD 2: Lista com Filtros --- */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-normal text-gray-900">Atestados</h2>
              <p className="text-sm text-gray-500 mt-1">Selecione para avaliar ou ver detalhes.</p>
            </div>

            {/* Sistema de Filtros (Requisito do TCC) */}
            <div className="flex bg-gray-100 p-1 rounded-md text-sm font-medium">
              <button
                onClick={() => setFiltroAtual('TODOS')}
                className={`px-4 py-1.5 rounded-sm transition-colors ${filtroAtual === 'TODOS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroAtual('PENDING')}
                className={`px-4 py-1.5 rounded-sm transition-colors ${filtroAtual === 'PENDING' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pendentes
              </button>
              <button
                onClick={() => setFiltroAtual('APPROVED')}
                className={`px-4 py-1.5 rounded-sm transition-colors ${filtroAtual === 'APPROVED' ? 'bg-white text-[#1a9e9e] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Aprovados
              </button>
              <button
                onClick={() => setFiltroAtual('REJECTED')}
                className={`px-4 py-1.5 rounded-sm transition-colors ${filtroAtual === 'REJECTED' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Recusados
              </button>
            </div>
          </div>

          <hr className="border-gray-200 mb-6" />

          {error && (
            <div className="text-center py-4 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-sm text-gray-500">
              Sincronizando com o banco de dados...
            </div>
          ) : atestadosFiltrados.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <p className="text-gray-900 font-medium">Nenhum atestado encontrado.</p>
              <p className="text-sm text-gray-500 mt-1">A lista está vazia para o filtro selecionado.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {atestadosFiltrados.map((atestado) => {
                // Configuração visual baseada no Enum do Prisma
                const isApproved = atestado.status === 'APPROVED';
                const isRejected = atestado.status === 'REJECTED';

                const dotColor = isApproved ? 'bg-[#1a9e9e]' : isRejected ? 'bg-red-500' : 'bg-yellow-500';
                const textColor = isApproved ? 'text-[#1a9e9e]' : isRejected ? 'text-red-500' : 'text-yellow-600';
                const statusLabel = isApproved ? 'Aprovado' : isRejected ? 'Recusado' : 'Pendente';

                const nomeFuncionario = atestado.user?.name || 'Funcionário Desconhecido';
                const motivoAtestado = atestado.motivo ? `Atestado - ${atestado.motivo}` : 'Atestado Médico';

                return (
                  <Link
                    href={`/admin/atestados/${atestado.id}`}
                    key={atestado.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 pt-2 last:border-0 hover:bg-gray-50 transition-colors rounded -mx-2 px-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`}></div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-800 font-medium group-hover:text-[#1a9e9e] transition-colors">
                          {nomeFuncionario}
                        </span>
                        <span className="text-xs text-gray-500">
                          {motivoAtestado}
                        </span>
                        <span className="text-[13px] text-gray-400 mt-1">
                          {formatarData(atestado.startDate)} até {formatarData(atestado.endDate)} ({calcularDias(atestado.startDate, atestado.endDate)} dias)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className={`text-xs font-bold uppercase tracking-wider ${textColor} bg-opacity-10 px-2 py-1 rounded`}>
                        {statusLabel}
                      </span>
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-[#1a9e9e] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}