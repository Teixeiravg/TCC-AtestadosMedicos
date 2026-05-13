// frontend/src/app/login/page.jsx
// frontend/src/app/login/page.jsx
'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
// 1. adicione o import no topo
import AccessibilityWidget from '@/components/AccessibilityWidget';

function AuthContent() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', aceitouTermos: false,
  });
  const [cadastroError, setCadastroError] = useState('');
  const [cadastroLoading, setCadastroLoading] = useState(false);

    async function handleLogin() {
        setLoginError('');
        setLoginLoading(true);
        try {
            const response = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            router.push(role === 'ADMIN' ? '/admin/dashboard' : '/funcionario/dashboard');
        } catch {
            setLoginError('Email ou senha incorretos.');
        } finally {
            setLoginLoading(false);
        }
    }

    async function handleCadastro() {
        setCadastroError('');
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setCadastroError('Preencha todos os campos.'); return;
        }
        if (formData.password !== formData.confirmPassword) {
            setCadastroError('As senhas não coincidem.'); return;
        }
          if (formData.password.length < 8) {
            setCadastroError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }
        if (!formData.aceitouTermos) {
            setCadastroError('Você precisa aceitar os termos de proteção de dados.'); return;
        }
        setCadastroLoading(true);
        try {
            await api.post('/auth/register', {
                name: formData.name, email: formData.email, password: formData.password, role: 'EMPLOYEE',
            });
            setIsLogin(true); // volta pro login após cadastrar
        } catch (err) {
            setCadastroError(err.response?.status === 409 ? 'Este email já está cadastrado.' : 'Erro ao cadastrar. Tente novamente.');
        } finally {
            setCadastroLoading(false);
        }
    }

    return (
        <div className="relative flex h-screen font-sans overflow-hidden bg-white">

            {/* ===== PAINEL COLORIDO (deslizante) ===== */}
            <div
                className={`
    absolute top-0 right-0 w-1/2 h-full bg-[#e4fcfc] flex items-center justify-center
    transition-transform duration-700 ease-in-out z-10
    ${isLogin ? 'translate-x-0' : '-translate-x-full'}
  `}
            >
                <img src="/FotoInicio.png" alt="Ilustração" className="w-3/4" />
            </div>

            {/* ===== FORMULÁRIO: LOGIN ===== */}

            <div
                className={`
    absolute left-0 top-0 w-1/2 h-full flex flex-col items-center justify-center
    transition-all duration-700 ease-in-out delay-300
    ${isLogin ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-8 pointer-events-none'}
  `}
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[#1a6b6b]">ATESTE+</h1>
                    <p className="text-sm text-gray-500">Gerenciamento de Atestados</p>
                </div>
                <div className="flex flex-col gap-3 w-72">
                    <input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />
                    {loginError && <p className="text-xs text-red-500">{loginError}</p>}
                    <a href="/redefinir-senha" className="text-right text-xs text-gray-500 hover:underline">
                        Esqueceu sua senha?
                    </a>
                    <button
                        onClick={handleLogin}
                        disabled={loginLoading}
                        className="bg-[#1a9e9e] text-white py-2 rounded text-sm font-medium hover:bg-[#1a6b6b] transition-colors disabled:opacity-70 cursor-pointer"
                    >
                        {loginLoading ? 'Entrando...' : 'Login'}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    Ainda não possui conta?{' '}
                    <button onClick={() => setIsLogin(false)} className="text-[#1a9e9e] hover:underline cursor-pointer">
                        Criar conta
                    </button>
                </p>
            </div>

            {/* ===== FORMULÁRIO: CADASTRO ===== */}
            {/* FORMULÁRIO: CADASTRO */}
            <div
                className={`
    absolute right-0 top-0 w-1/2 h-full flex flex-col items-center justify-center
    transition-all duration-700 ease-in-out delay-300
    ${!isLogin ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-8 pointer-events-none'}
  `}
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[#1a6b6b]">Ateste+</h1>
                    <p className="text-sm text-gray-500">Crie sua conta</p>
                </div>
                <div className="flex flex-col gap-3 w-72">
                    <input
                        type="text" name="name" placeholder="Nome"
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />
                    <input
                        type="email" name="email" placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />
                    <input
                        type="password" name="password" placeholder="Senha"
                        value={formData.password}
                        onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />
                    <input
                        type="password" name="confirmPassword" placeholder="Confirmar senha"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox" id="termos"
                            checked={formData.aceitouTermos}
                            onChange={(e) => setFormData(p => ({ ...p, aceitouTermos: e.target.checked }))}
                            className="mt-0.5 cursor-pointer accent-[#1a9e9e]"
                        />
                        <label htmlFor="termos" className="text-xs text-gray-500 cursor-pointer">
                            Li e concordo com a{' '}
                            <a href="/termos" className="text-[#1a9e9e] hover:underline font-medium">
                                Política de Privacidade (LGPD)
                            </a>
                        </label>
                    </div>
                    {cadastroError && <p className="text-xs text-red-500">{cadastroError}</p>}
                    <button
                        onClick={handleCadastro}
                        disabled={cadastroLoading}
                        className="bg-[#1a9e9e] text-white py-2 rounded text-sm font-medium hover:bg-[#1a6b6b] transition-colors disabled:opacity-70 cursor-pointer"
                    >
                        {cadastroLoading ? 'Cadastrando...' : 'Cadastrar-se'}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    Já possui conta?{' '}
                    <button onClick={() => setIsLogin(true)} className="text-[#1a9e9e] hover:underline cursor-pointer">
                        Fazer Login
                    </button>
                </p>
            </div>

            <AccessibilityWidget /> 

        </div>
    );

}


export default function Auth() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}