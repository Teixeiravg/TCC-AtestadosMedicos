'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import NavBarAdmin from '@/components/NavBarAdmin';

export default function AdminAtestados() {
  const [atestados, setAtestados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtraNome, setFiltraNome] = useState('');
  const [filtroAtual, setFiltroAtual] = useState('TODOS');

  useEffect(() => {
    async function fetchTodosAtestados() {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/certificates?limit=100');
        setAtestados(response.data.data);
      } catch (err) {
        console.error('Erro ao buscar atestados:', err);
        setError('Não foi possível carregar a fila de atestados. Verifique o servidor.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodosAtestados();
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

  const formatarMotivo = (motivo) => {
    if (!motivo) return 'Motivo não especificado';
    const mapa = { DOENCA: 'Doença', EXAME: 'Exame médico', ACOMPANHAMENTO: 'Acompanhamento' };
    return mapa[motivo] || motivo;
  };

  const atestadosFiltrados = atestados.filter((atestado) => {
    const passaStatus = filtroAtual === 'TODOS' || atestado.status === filtroAtual;
    const nome = atestado.user?.name?.toLowerCase() || '';
    const passaNome = filtraNome === '' || nome.includes(filtraNome.toLowerCase());
    return passaStatus && passaNome;
  });

  const totalAtestados = atestados.length;
  const atestadosPendentes = atestados.filter((a) => a.status === 'PENDING').length;
  const atestadosAnalisados = atestados.filter((a) => a.status !== 'PENDING').length;

  const FILTROS = [
    { key: 'TODOS', label: 'Todos', activeClass: 'bg-white text-gray-900 shadow-sm' },
    { key: 'PENDING', label: 'Pendentes', activeClass: 'bg-white text-yellow-600 shadow-sm' },
    { key: 'APPROVED', label: 'Aprovados', activeClass: 'bg-white text-[#1a9e9e] shadow-sm' },
    { key: 'REJECTED', label: 'Recusados', activeClass: 'bg-white text-red-500 shadow-sm' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavBarAdmin />

      <main className="flex-1 flex flex-col w-full px-6 md:px-10 py-8 gap-6">

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Recebidos</p>
            <p className="text-3xl font-bold text-gray-900">{isLoading ? '—' : totalAtestados}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1">Pendentes</p>
            <p className="text-3xl font-bold text-yellow-500">{isLoading ? '—' : atestadosPendentes}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-[#1a9e9e] uppercase tracking-wider mb-1">Analisados</p>
            <p className="text-3xl font-bold text-[#1a9e9e]">{isLoading ? '—' : atestadosAnalisados}</p>
          </div>
        </div>

        {/* Tabela principal */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col flex-1">
          {/* Header do painel */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerenciar Atestados</h1>
                <p className="text-sm text-gray-500 mt-1">Selecione um atestado para avaliar ou ver detalhes.</p>
              </div>
              <input
                type="text"
                placeholder="Buscar por funcionário..."
                value={filtraNome}
                onChange={(e) => setFiltraNome(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#1a9e9e] focus:ring-1 focus:ring-[#1a9e9e]/20 w-full md:w-64 transition"
              />
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg text-sm font-medium mt-4 w-fit">
              {FILTROS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFiltroAtual(f.key)}
                  className={`px-4 py-1.5 rounded-md transition-colors ${
                    filtroAtual === f.key ? f.activeClass : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {error && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                Sincronizando com o banco de dados...
              </div>
            ) : atestadosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-gray-900 font-medium">Nenhum atestado encontrado</p>
                <p className="text-sm text-gray-500 mt-1">A lista está vazia para o filtro selecionado.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {atestadosFiltrados.map((atestado) => {
                  const isApproved = atestado.status === 'APPROVED';
                  const isRejected = atestado.status === 'REJECTED';
                  const dotColor = isApproved ? 'bg-[#1a9e9e]' : isRejected ? 'bg-red-500' : 'bg-yellow-400';
                  const textColor = isApproved ? 'text-[#1a9e9e]' : isRejected ? 'text-red-500' : 'text-yellow-600';
                  const statusLabel = isApproved ? 'Aprovado' : isRejected ? 'Recusado' : 'Pendente';
                  const nomeFuncionario = atestado.user?.name || 'Funcionário Desconhecido';

                  return (
                    <Link
                      href={`/admin/atestados/${atestado.id}`}
                      key={atestado.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
                        <div>
                          <span className="text-sm text-gray-800 font-semibold group-hover:text-[#1a9e9e] transition-colors">
                            {nomeFuncionario}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">{formatarMotivo(atestado.motivo)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatarData(atestado.startDate)} → {formatarData(atestado.endDate)} &middot; {calcularDias(atestado.startDate, atestado.endDate)} dias
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
                          {statusLabel}
                        </span>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1a9e9e] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
