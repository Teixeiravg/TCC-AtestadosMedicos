'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import NavBar from '@/components/NavBar';
import NavBarAdmin from '@/components/NavBarAdmin';

export default function MeuPerfil() {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefone: ''
  });

  useEffect(() => {
    // Descobre quem é o utilizador atual para a NavBar
    const role = localStorage.getItem('role');
    setUserRole(role);

    // Busca os dados reais do utilizador no backend
    async function fetchUserData() {
      try {
        setIsLoading(true);
        const response = await api.get('/auth/me'); 
        setFormData(prev => ({
          ...prev,
          name: response.data.name || '',
          email: response.data.email || '',
          telefone: response.data.telefone || '' 
        }));
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
        // Fallback visual: Telefone inicia vazio por padrão
        setFormData(prev => ({
          ...prev,
          name: 'Usuário do Sistema',
          email: 'usuario@empresa.com',
          telefone: '' 
        }));
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.put('/auth/me', { 
        telefone: formData.telefone
      });
      
      alert("Telefone atualizado com sucesso!");
    } catch (err) {
      alert("Erro ao atualizar o perfil. Verifique a conexão com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'US';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 pb-12">
      
      {/* RENDERIZAÇÃO CONDICIONAL DA BARRA DE NAVEGAÇÃO */}
      {userRole === 'ADMIN' ? <NavBarAdmin /> : <NavBar />}

      {/* A remoção do max-w-4xl e mx-auto permite que ocupe a largura total */}
      <main className="flex-1 w-full px-6 md:px-10 py-10">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Configurações da Conta</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie suas informações de contato no sistema.</p>
        </div>

        {/* Caixa do formulário que agora estica por toda a largura */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full">
          
          {/* HEADER DO PERFIL */}
          <div className="h-32 bg-[#00a8ac] w-full relative"></div>
          
          <div className="flex flex-col items-center -mt-12 px-8 pb-8 border-b border-gray-100 relative z-10">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-sm border border-gray-100">
              <div className="w-full h-full bg-[#e4fcfc] rounded-full flex items-center justify-center text-3xl font-bold text-[#00a8ac] tracking-widest">
                {isLoading ? '...' : getInitials(formData.name)}
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-3">
              {isLoading ? 'Carregando...' : formData.name}
            </h2>
            <div className="inline-flex items-center gap-1.5 mt-1 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              <span className={`w-2 h-2 rounded-full ${userRole === 'ADMIN' ? 'bg-[#00a8ac]' : 'bg-gray-400'}`}></span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                {userRole === 'ADMIN' ? 'Administrador' : 'Funcionário'}
              </span>
            </div>
          </div>

          {/* CORPO DO FORMULÁRIO */}
          <form onSubmit={handleSave} className="p-8 md:px-12 w-full">
            
            <div className="flex flex-col gap-6 w-full">
              
              {/* Título e Subtítulo no topo à esquerda */}
              <div className="w-full text-left mb-2">
                <h3 className="text-lg font-bold text-gray-900">Dados de Contato</h3>
                <p className="text-sm text-gray-500 mt-1">Nome e e-mail são controlados pela empresa e não podem ser alterados. Atualize o seu telefone de contato caso necessário.</p>
              </div>
              
              {/* Campos ocupando 100% da largura disponível */}
              <div className="w-full space-y-5">
                
                {/* Nome Completo (Bloqueado) */}
                <div className="flex flex-col w-full">
                  <label className="text-[13px] font-semibold text-gray-700 mb-2">Nome Completo</label>
                  <div className="relative flex items-center w-full">
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      disabled
                      className="w-full p-3 pl-10 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-500 cursor-not-allowed outline-none select-none"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                {/* E-mail Corporativo (Bloqueado) */}
                <div className="flex flex-col w-full">
                  <label className="text-[13px] font-semibold text-gray-700 mb-2">E-mail corporativo</label>
                  <div className="relative flex items-center w-full">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full p-3 pl-10 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-500 cursor-not-allowed outline-none select-none"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                {/* Telefone (Editável) */}
                <div className="flex flex-col w-full">
                  <label className="text-[13px] font-semibold text-gray-700 mb-2">Telefone de Contato</label>
                  <input 
                    type="text" 
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#00a8ac] focus:ring-1 focus:ring-[#00a8ac] transition bg-white"
                  />
                </div>
                
              </div>
            </div>

            {/* AÇÕES: Botão de Salvar */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving || isLoading}
                className="px-6 py-2.5 bg-[#00a8ac] text-white rounded-md text-sm font-semibold hover:bg-[#008f92] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Salvando...' : 'Salvar telefone'}
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}