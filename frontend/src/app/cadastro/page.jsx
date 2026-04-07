export default function Cadastro() {
    return (
        <div className="flex h-screen">

            <div className="w-1/2 bg-[#e4fcfc] flex items-center justify-center">
                <img src="/FotoInicio.png" alt="Ilustracao" className="w-3/4" />
            </div>

            <div className="w-1/2 flex flex-col items-center justify-center">

                <div className="text-center mb-6">

                    <h1 className="text-3xl font-bold text-[#1a6b6b]">Ateste+</h1>
                    <p className="text-sm text-gray-500">Gerenciamento de Atestados</p>

                </div>

                <div className="flex flex-col gap-3 w-72">

                    <input type="text" placeholder="Nome" className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]" />
                    <input type="email" placeholder="Email" className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]" />
                    <input type="password" placeholder="Senha" className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]" />
                    <input type="password" placeholder="Confirmar senha" className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]" />

                    <button className="bg-[#1a9e9e] text-white py-2 rounded text-sm font-medium hover:bg-[#1a6b6b] transition-colors">
                        Cadastrar-se
                    </button>

                </div>

                <p className="text-xs text-gray-500 mt-4">Já possui conta?{" "}
                    <a href="/login" className="text-[#1a9e9e] hover:underline cursor-pointer">
                        Fazer Login
                    </a>
                </p>

            </div>



        </div>
    )
} 