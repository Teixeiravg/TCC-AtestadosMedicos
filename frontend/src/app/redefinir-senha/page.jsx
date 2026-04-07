export default function RedefinirSenha() {
    return (
        <div className="flex h-screen justify-center">

            <div className="flex flex-col items-center justify-center">

                <div className="text-center mb-3">

                    <h1 className="text-3xl font-bold text-[#1a6b6b]">Ateste+</h1>
                    <p className="text-sm text-gray-500">Gerenciamento de Atestados</p>

                </div>

                <p className="text-xl font-bold mb-4">Redefinição de senhas</p>

                <div className="flex flex-col gap-3 w-72">

                    <input type="email" placeholder="Email" className="border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#1a6b6b]" />

                    <button className="bg-[#1a9e9e] text-white py-2 rounded text-sm font-medium hover:bg-[#1a6b6b] transition-colors">
                        Enviar email
                    </button>

                </div>

                <a href="/login" className="text-[#1a9e9e] hover:underline cursor-pointer mt-4 underline">
                    Voltar para tela de login
                </a>

            </div>

        </div>
    )
}