/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desativa a otimização de fontes que causa o erro de SWC/WASM
  optimizeFonts: false, 
  // Força o modo Webpack para evitar o Turbopack (que o SENAI bloqueia)
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;