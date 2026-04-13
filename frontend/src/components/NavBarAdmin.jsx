'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function NavBarAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-10 py-4 z-10">
      
      {/* Lado Esquerdo: Logo Ateste+ */}
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold text-[#00a8ac] tracking-wide">
          ATESTE+
        </div>
        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-gray-200">
          Admin
        </span>
      </div>

      {/* Centro: Navegação com efeito idêntico ao NavBar convencional */}
      <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <Link 
          href="/admin/dashboard" 
          className={`transition ${pathname === '/admin/dashboard' ? 'text-[#00a8ac]' : 'hover:text-[#00a8ac]'}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/admin/atestados" 
          className={`transition ${pathname === '/admin/atestados' ? 'text-[#00a8ac]' : 'hover:text-[#00a8ac]'}`}
        >
          Gerenciar Atestados
        </Link>
      </nav>

      {/* Lado Direito: Sair / Avatar */}
      <div className="flex items-center gap-6">
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
        >
          Sair
        </button>
        <div className="w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>
      
    </header>
  );
}