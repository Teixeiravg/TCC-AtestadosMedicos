'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import NavBarAdmin from '@/components/NavBarAdmin';

export default function AdminDashboard() {
  const [atestados, setAtestados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTodosAtestados() {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/certificates');
        setAtestados(response.data);
      } catch (err) {
        console.error("Erro ao buscar atestados:", err);
        setError("Não foi possível carregar as métricas do sistema.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodosAtestados();
  }, []);

  // Cálculos dinâmicos baseados no Enum do Prisma
  const totalRecebidos = atestados.length;
  const pendentes = atestados.filter(a => a.status === 'PENDING').length;
  const aprovados = atestados.filter(a => a.status === 'APPROVED').length;
  const recusados = atestados.filter(a => a.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavBarAdmin />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
        
        {/* Cabeçalho da Página */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visão Geral do Sistema</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe as métricas e o fluxo de atestados da empresa.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100 text-sm">
            {error}
          </div>
        )}

        {/* --- GRID DOS 4 CARDS SUPERIORES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card: Total */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-semibold text-gray-500">Total Recebidos</span>
            <span className="text-4xl font-bold text-gray-900 mt-4">
              {isLoading ? "-" : totalRecebidos}
            </span>
            <span className="text-xs text-gray-400 mt-2">No total</span>
          </div>

          {/* Card: Pendentes */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-semibold text-gray-500">Pendentes</span>
            <span className="text-4xl font-bold text-yellow-500 mt-4">
              {isLoading ? "-" : pendentes}
            </span>
            <span className="text-xs text-yellow-600/70 mt-2 font-medium">Aguardando análise</span>
          </div>

          {/* Card: Aprovados */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-semibold text-gray-500">Aprovados</span>
            <span className="text-4xl font-bold text-emerald-500 mt-4">
              {isLoading ? "-" : aprovados}
            </span>
            <span className="text-xs text-emerald-600/70 mt-2 font-medium">Atestados validados</span>
          </div>

          {/* Card: Recusados */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-semibold text-gray-500">Recusados</span>
            <span className="text-4xl font-bold text-red-500 mt-4">
              {isLoading ? "-" : recusados}
            </span>
            <span className="text-xs text-red-600/70 mt-2 font-medium">Atestados inválidos</span>
          </div>

        </div>

        {/* --- GRID DOS GRÁFICOS (Parte Inferior) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          
          {/* Seção: Fluxo Mensal */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col min-h-[350px]">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Fluxo Mensal</h2>
            {/* Espaço reservado para o gráfico (Ex: Chart.js ou Recharts) */}
            <div className="flex-1 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50/50">
              <span className="text-sm text-gray-400 font-medium">Área reservada para Gráfico de Barras</span>
            </div>
          </div>

          {/* Seção: Motivos de Afastamento */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col min-h-[350px]">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Motivos de Afastamento</h2>
            {/* Espaço reservado para o gráfico */}
            <div className="flex-1 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50/50">
              <span className="text-sm text-gray-400 font-medium">Área reservada para Gráfico de Rosca (Doughnut)</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}