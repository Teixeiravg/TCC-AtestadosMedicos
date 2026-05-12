'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import NavBarAdmin from '@/components/NavBarAdmin';
import jsPDF from 'jspdf';

export default function AdminDashboard() {
  const [atestados, setAtestados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const doughnutChartInstance = useRef(null);

  useEffect(() => {
    async function fetchTodosAtestados() {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/certificates?limit=100');
        setAtestados(response.data.data);
      } catch (err) {
        console.error('Erro ao buscar atestados:', err);
        setError('Não foi possível carregar as métricas do sistema.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodosAtestados();
  }, []);

  useEffect(() => {
    if (isLoading || atestados.length === 0) return;

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const anoAtual = new Date().getFullYear();

    const contagemMensal = Array(12).fill(0);
    atestados.forEach((a) => {
      const d = new Date(a.startDate);
      if (d.getUTCFullYear() === anoAtual) {
        contagemMensal[d.getUTCMonth()]++;
      }
    });

    const aprovados = atestados.filter(a => a.status === 'APPROVED').length;
    const pendentes = atestados.filter(a => a.status === 'PENDING').length;
    const recusados = atestados.filter(a => a.status === 'REJECTED').length;

    function buildCharts() {
      if (!window.Chart) return;

      if (barChartInstance.current) barChartInstance.current.destroy();
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();

      if (barChartRef.current) {
        barChartInstance.current = new window.Chart(barChartRef.current, {
          type: 'bar',
          data: {
            labels: meses,
            datasets: [{
              label: 'Atestados',
              data: contagemMensal,
              backgroundColor: 'rgba(0, 168, 172, 0.15)',
              borderColor: '#00a8ac',
              borderWidth: 2,
              borderRadius: 6,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} atestado(s)` } },
            },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1, color: '#9ca3af', font: { size: 12 } }, grid: { color: 'rgba(0,0,0,0.04)' } },
              x: { ticks: { color: '#9ca3af', font: { size: 12 } }, grid: { display: false } },
            },
          },
        });
      }

      if (doughnutChartRef.current) {
        doughnutChartInstance.current = new window.Chart(doughnutChartRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Aprovados', 'Pendentes', 'Recusados'],
            datasets: [{
              data: [aprovados, pendentes, recusados],
              backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
              borderColor: '#ffffff',
              borderWidth: 3,
              hoverOffset: 6,
              pointStyle: 'circle',
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: { padding: 20, color: '#6b7280', font: { size: 13 }, usePointStyle: true, pointStyle: 'circle', boxWidth: 10, boxHeight: 10 },
              },
              tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} atestado(s)` } },
            },
          },
        });
      }
    }

    if (window.Chart) {
      buildCharts();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js';
      script.onload = buildCharts;
      document.head.appendChild(script);
    }

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();
    };
  }, [atestados, isLoading]);

  const totalRecebidos = atestados.length;
  const pendentes = atestados.filter(a => a.status === 'PENDING').length;
  const aprovados = atestados.filter(a => a.status === 'APPROVED').length;
  const recusados = atestados.filter(a => a.status === 'REJECTED').length;

  const taxaAprovacao = totalRecebidos > 0 ? Math.round((aprovados / totalRecebidos) * 100) : 0;

  const mediaDias = totalRecebidos > 0
    ? Math.round(atestados.reduce((acc, a) => {
        const d1 = new Date(a.startDate);
        const d2 = new Date(a.endDate);
        return acc + Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
      }, 0) / totalRecebidos)
    : 0;

  async function exportarPDF() {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const ano = new Date().getFullYear();
    const dataGeracao = new Date().toLocaleDateString('pt-BR');

    // Cabeçalho
    pdf.setFillColor(26, 158, 158);
    pdf.rect(0, 0, 210, 28, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ATESTE+', 14, 12);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Relatório de Atestados Médicos', 14, 20);
    pdf.text(`Gerado em: ${dataGeracao}`, 150, 20);

    // Métricas
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Visão Geral — ${ano}`, 14, 42);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(14, 45, 196, 45);

    const metricas = [
      ['Total de Atestados', `${totalRecebidos}`],
      ['Pendentes', `${pendentes}`],
      ['Aprovados', `${aprovados}`],
      ['Recusados', `${recusados}`],
      ['Taxa de Aprovação', `${taxaAprovacao}%`],
      ['Média de Afastamento', `${mediaDias} dias`],
    ];

    pdf.setFontSize(11);
    let y = 55;
    metricas.forEach(([label, valor], i) => {
      if (i % 2 === 0) pdf.setFillColor(248, 250, 252);
      else pdf.setFillColor(255, 255, 255);
      pdf.rect(14, y - 5, 182, 10, 'F');
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(label, 18, y);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text(valor, 180, y, { align: 'right' });
      y += 12;
    });

    // Fluxo Mensal
    y += 8;
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 30, 30);
    pdf.text(`Fluxo Mensal — ${ano}`, 14, y);
    pdf.line(14, y + 3, 196, y + 3);
    y += 12;

    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const contagemMensal = Array(12).fill(0);
    atestados.forEach((a) => {
      const d = new Date(a.startDate);
      if (d.getUTCFullYear() === ano) contagemMensal[d.getUTCMonth()]++;
    });

    pdf.setFontSize(10);
    meses.forEach((mes, i) => {
      if (i % 2 === 0) pdf.setFillColor(248, 250, 252);
      else pdf.setFillColor(255, 255, 255);
      pdf.rect(14, y - 5, 182, 9, 'F');
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(mes, 18, y);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text(`${contagemMensal[i]} atestado(s)`, 180, y, { align: 'right' });
      y += 10;
    });

    // Rodapé
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(150, 150, 150);
    pdf.text('ATESTE+ — Sistema de Gerenciamento de Atestados Médicos', 105, 287, { align: 'center' });

    pdf.save(`relatorio-atestados-${ano}.pdf`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavBarAdmin />

      <main className="flex-1 w-full px-6 md:px-10 py-10 flex flex-col gap-8">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visão Geral do Sistema</h1>
            <p className="text-sm text-gray-500 mt-1">Acompanhe as métricas e o fluxo de atestados da empresa.</p>
          </div>
          <button
            onClick={exportarPDF}
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#1a9e9e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a6b6b] transition-colors disabled:opacity-50 cursor-pointer"
          >
            ↓ Exportar PDF
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</span>
            <span className="text-4xl font-bold text-gray-900 mt-3">{isLoading ? '—' : totalRecebidos}</span>
            <span className="text-xs text-gray-400 mt-2">Atestados recebidos</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pendentes</span>
            <span className="text-4xl font-bold text-yellow-500 mt-3">{isLoading ? '—' : pendentes}</span>
            <span className="text-xs text-yellow-600/70 mt-2 font-medium">Aguardando análise</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aprovados</span>
            <span className="text-4xl font-bold text-emerald-500 mt-3">{isLoading ? '—' : aprovados}</span>
            <span className="text-xs text-emerald-600/70 mt-2 font-medium">Atestados validados</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recusados</span>
            <span className="text-4xl font-bold text-red-500 mt-3">{isLoading ? '—' : recusados}</span>
            <span className="text-xs text-red-600/70 mt-2 font-medium">Documentos inválidos</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Taxa Aprovação</span>
            <span className="text-4xl font-bold text-[#00a8ac] mt-3">{isLoading ? '—' : `${taxaAprovacao}%`}</span>
            <span className="text-xs text-[#00a8ac]/70 mt-2 font-medium">Dos atestados recebidos</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Média Afastamento</span>
            <span className="text-4xl font-bold text-gray-700 mt-3">{isLoading ? '—' : `${mediaDias}d`}</span>
            <span className="text-xs text-gray-400 mt-2">Por atestado</span>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Fluxo Mensal</h2>
              <p className="text-xs text-gray-400 mt-0.5">Atestados por mês com base na data de início do afastamento ({new Date().getFullYear()})</p>
            </div>
            <div className="relative flex-1 min-h-[260px]">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">Carregando...</div>
              ) : (
                <canvas ref={barChartRef} />
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Distribuição por Status</h2>
              <p className="text-xs text-gray-400 mt-0.5">Proporção de aprovados, pendentes e recusados</p>
            </div>
            <div className="relative flex-1 min-h-[260px]">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">Carregando...</div>
              ) : totalRecebidos === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">Nenhum dado disponível</div>
              ) : (
                <canvas ref={doughnutChartRef} />
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
