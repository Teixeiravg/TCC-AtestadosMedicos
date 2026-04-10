'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import NavBar from '@/components/NavBar';

export default function MeusAtestados() {
    const [atestados, setAtestados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMeusAtestados() {
            try {
                setIsLoading(true);
                // Chama a rota que aciona a função getUserCertificates do seu controller
                // (Ajuste o caminho '/certificates' se a sua rota estiver mapeada diferente, ex: '/certificates/me')
                const response = await api.get('/certificates');
                setAtestados(response.data);
            } catch (err) {
                console.error("Erro ao carregar atestados:", err);
                setError("Não foi possível carregar o seu histórico. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchMeusAtestados();
    }, []);

    // Função auxiliar para formatar a data
    const formatarData = (dataIso) => {
        if (!dataIso) return '';
        return new Date(dataIso).toLocaleDateString('pt-BR');
    };

    // Função auxiliar para calcular a quantidade de dias
    const calcularDias = (inicio, fim) => {
        const data1 = new Date(inicio);
        const data2 = new Date(fim);
        const diferencaTempo = Math.abs(data2 - data1);
        const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24)); 
        return diferencaDias;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            <NavBar />

            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Meus Atestados</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Acompanhe o histórico e a situação dos documentos enviados ao RH.
                        </p>
                    </div>
                    <Link 
                        href="/funcionario/novo-atestado" 
                        className="bg-[#00a8ac] text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#008f92] transition-colors text-center"
                    >
                        + Enviar Novo Atestado
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    {isLoading ? (
                        <div className="p-12 text-center text-sm text-gray-500">
                            Carregando seu histórico de atestados...
                        </div>
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
                            {atestados.map((atestado) => (
                                <div key={atestado.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors gap-4">
                                    
                                    {/* Informações Principais */}
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            <div className="w-10 h-10 rounded-full bg-[#e4fcfc] text-[#00a8ac] flex items-center justify-center font-bold">
                                                {calcularDias(atestado.startDate, atestado.endDate)}d
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-base flex items-center gap-2">
                                                Afastamento
                                                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full tracking-wide
                                                    ${atestado.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                                                      atestado.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                                                      'bg-yellow-100 text-yellow-700'}`}
                                                >
                                                    {atestado.status === 'APPROVED' ? 'Aprovado' : 
                                                     atestado.status === 'REJECTED' ? 'Recusado' : 'Em Análise'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                De <span className="font-medium text-gray-700">{formatarData(atestado.startDate)}</span> até <span className="font-medium text-gray-700">{formatarData(atestado.endDate)}</span>
                                            </div>
                                            {atestado.crmNumber && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    CRM: {atestado.crmNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ações / Arquivo */}
                                    <div className="flex items-center md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                                        {atestado.fileUrl ? (
                                            <a 
                                                // O backend salva o caminho do arquivo em atestado.fileUrl
                                                href={`http://localhost:3000${atestado.fileUrl}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex items-center gap-2 text-sm text-[#00a8ac] font-medium hover:underline bg-[#00a8ac] bg-opacity-10 px-4 py-2 rounded-md transition-colors"
                                            >
                                                <span>Visualizar Arquivo</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                                </svg>
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Arquivo indisponível</span>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}