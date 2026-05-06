'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function Cadastro() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        aceitouTermos: false,   // ✅ novo campo
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleCadastro() {
        setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Preencha todos os campos.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        // ✅ Validação dos termos
        if (!formData.aceitouTermos) {
            setError('Você precisa aceitar os termos de proteção de dados.');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'EMPLOYEE',
            });

            router.push('/login');
        } catch (err) {
            if (err.response?.status === 409) {
                setError('Este email já está cadastrado.');
            } else {
                setError('Erro ao cadastrar. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex h-screen font-sans">

            <div className="w-1/2 bg-[#e4fcfc] flex items-center justify-center">
                <img src="/FotoInicio.png" alt="Ilustracao" className="w-3/4" />
            </div>

            <div className="w-1/2 flex flex-col items-center justify-center">

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[#1a6b6b]">Ateste+</h1>
                    <p className="text-sm text-gray-500">Gerenciamento de Atestados</p>
                </div>

                <div className="flex flex-col gap-3 w-72">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar senha"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]"
                    />

                    {/* ✅ Checkbox de aceite dos termos */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="termos"
                            checked={formData.aceitouTermos}
                            onChange={(e) => setFormData(prev => ({ ...prev, aceitouTermos: e.target.checked }))}
                            className="mt-0.5 cursor-pointer accent-[#1a9e9e]"
                        />
                        <label htmlFor="termos" className="text-xs text-gray-500 cursor-pointer">
                            Li e concordo com a{' '}
                            <a
                                href="/termos"
                                target="_blank"
                                className="text-[#1a9e9e] hover:underline font-medium"
                            >
                                Política de Privacidade e Proteção de Dados (LGPD)
                            </a>
                        </label>
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <button
                        onClick={handleCadastro}
                        disabled={isLoading}
                        className="bg-[#1a9e9e] text-white py-2 rounded text-sm font-medium hover:bg-[#1a6b6b] transition-colors disabled:opacity-70 cursor-pointer"
                    >
                        {isLoading ? 'Cadastrando...' : 'Cadastrar-se'}
                    </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">Já possui conta?{" "}
                    <a href="/login" className="text-[#1a9e9e] hover:underline cursor-pointer">
                        Fazer Login
                    </a>
                </p>

            </div>
        </div>
    );
}