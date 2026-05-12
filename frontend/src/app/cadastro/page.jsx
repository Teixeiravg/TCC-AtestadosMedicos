// frontend/src/app/cadastro/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Cadastro() {
  const router = useRouter();
  useEffect(() => { router.replace('/login'); }, []);
  return null;
}