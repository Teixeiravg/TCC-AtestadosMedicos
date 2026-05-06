'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import NavBar from '@/components/NavBar';
import NavBarAdmin from '@/components/NavBarAdmin';

export default function MeuPerfil() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);

    async function fetchUserData() {
      try {
        setIsLoading(true);
        const response = await api.get('/auth/me');
        setFormData({
          name: response.data.name || '',
          email: response.data.email || ''
        });
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
        setFormData({
          name: 'Usuário do Sistema',
          email: 'usuario@empresa.com'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete('/auth/me');
      localStorage.clear();
      router.push('/login');
    } catch (err) {
      alert("Erro ao excluir a conta. Verifique a conexão com o servidor.");
      setIsDeleting(false);
      setShowDeleteModal(false);
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

      {userRole === 'ADMIN' ? <NavBarAdmin /> : <NavBar />}

      <main className="flex-1 w-full px-6 md:px-10 py-10">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Configurações da Conta</h1>
          <p className="text-sm text-gray-500 mt-1">Visualize suas informações no sistema.</p>
        </div>

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

          {/* DADOS */}
          <div className="p-8 md:px-12 w-full">

            <div className="w-full text-left mb-6">
              <h3 className="text-lg font-bold text-gray-900">Dados da Conta</h3>
              <p className="text-sm text-gray-500 mt-1">Nome e e-mail são controlados pela empresa e não podem ser alterados.</p>
            </div>

            <div className="w-full space-y-5">

              {/* Nome Completo */}
              <div className="flex flex-col w-full">
                <label className="text-[13px] font-semibold text-gray-700 mb-2">Nome Completo</label>
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    className="w-full p-3 pl-10 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-500 cursor-not-allowed outline-none select-none"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* E-mail */}
              <div className="flex flex-col w-full">
                <label className="text-[13px] font-semibold text-gray-700 mb-2">E-mail corporativo</label>
                <div className="relative flex items-center w-full">
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full p-3 pl-10 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-500 cursor-not-allowed outline-none select-none"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

            </div>

            {/* AÇÕES */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-start">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={isLoading}
                className="px-5 py-2.5 bg-white border border-red-300 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Excluir conta
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* MODAL DE CONFIRMAÇÃO */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Excluir conta</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja excluir sua conta? Esta ação é <strong>irreversível</strong> e todos os seus dados serão permanentemente removidos do sistema.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-5 py-2 text-sm rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Excluindo...' : 'Sim, excluir conta'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}