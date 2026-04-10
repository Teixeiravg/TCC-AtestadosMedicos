'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/NavBar'; // <-- Importando o NavBar

export default function EnviarAtestado() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  
  const [formData, setFormData] = useState({
    dataInicio: '',
    dataTermino: '',
    motivo: '',
    nomeMedico: '',
    crm: '',
    observacoes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Por favor, anexe o arquivo do atestado.");
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('dataInicio', formData.dataInicio);
      data.append('dataTermino', formData.dataTermino);
      data.append('motivo', formData.motivo);
      data.append('nomeMedico', formData.nomeMedico);
      data.append('crm', formData.crm);
      data.append('observacoes', formData.observacoes);
      data.append('arquivo', file);

      const response = await fetch('http://localhost:3000/api/certificates', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar o atestado');
      }

      alert('Atestado enviado com sucesso!');
      router.push('/funcionario/meus-atestados'); 

    } catch (error) {
      console.error("Erro no envio:", error);
      alert('Ocorreu um erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      
      {/* Componente NavBar inserido no lugar do header solto */}
      <NavBar />

      {/* Alteração principal feita aqui: flex-1 para preencher a tela, mantendo as margens originais */}
      <main className="flex-1 w-full px-10 py-10 bg-white">
        <Link href="/funcionario/dashboard" className="text-sm text-gray-500 hover:underline mb-6 inline-block">
          &larr; Voltar
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enviar atestado</h1>
        <p className="text-sm text-gray-500 mb-8">Preencha os dados do documento médico e anexe o arquivo.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 flex flex-col">
              <label className="text-[13px] font-medium text-gray-700 mb-2">Data de início<span className="text-red-500">*</span></label>
              <input 
                type="date" 
                name="dataInicio"
                value={formData.dataInicio}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#00a8ac] focus:ring-1 focus:ring-[#00a8ac] transition"
                required 
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-[13px] font-medium text-gray-700 mb-2">Data de término<span className="text-red-500">*</span></label>
              <input 
                type="date" 
                name="dataTermino"
                value={formData.dataTermino}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#00a8ac] focus:ring-1 focus:ring-[#00a8ac] transition"
                required 
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-medium text-gray-700 mb-2">Motivo<span className="text-red-500">*</span></label>
            <select 
              name="motivo"
              value={formData.motivo}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-[#00a8ac] focus:ring-1 focus:ring-[#00a8ac] transition appearance-none"
              required
            >
              <option value="" disabled>Selecione</option>
              <option value="DOENCA">Doença</option>
              <option value="EXAME">Exame Médico</option>
              <option value="ACOMPANHAMENTO">Acompanhamento</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 flex flex-col">
              <label className="text-[13px] font-medium text-gray-700 mb-2">Nome do médico</label>
              <input 
                type="text" 
                name="nomeMedico"
                value={formData.nomeMedico}
                onChange={handleInputChange}
                placeholder="Dr. Nome"
                className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#00a8ac] focus:ring-1 focus:ring-[#00a8ac] transition"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-[13px] font-medium text-gray-700 mb-2">CRM</label>
              <input 
                type="text" 
                name="crm"
                value={formData.crm}
                onChange={handleInputChange}
                placeholder="CRM/UF"
                className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#00a8ac] focus:ring-1 focus:ring-[#00a8ac] transition"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-medium text-gray-700 mb-2">Observações</label>
            <textarea 
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              placeholder="Informações adicionais que queira adicionar..."
              className="w-full p-3 border border-gray-300 rounded-md text-sm min-h-[120px] resize-y outline-none focus:border-[#00a8ac] focus:ring-1 focus:ring-[#00a8ac] transition"
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-medium text-gray-700 mb-2">Arquivo do atestado<span className="text-red-500">*</span></label>
            <div className="relative flex items-center border border-gray-300 rounded-md p-3 bg-white focus-within:border-[#00a8ac] focus-within:ring-1 focus-within:ring-[#00a8ac] transition">
              <span className="flex items-center gap-2 text-sm text-gray-500 pointer-events-none">
                <span className="transform -rotate-45">📎</span> 
                {file ? file.name : "Anexar PDF, JPG ou PNG"}
              </span>
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 py-3 bg-[#00a8ac] text-white rounded-md text-[15px] font-semibold hover:bg-[#008f92] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enviando...' : 'Enviar atestado'}
          </button>
        </form>
      </main>
    </div>
  );
}