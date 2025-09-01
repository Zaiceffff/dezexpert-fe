// next.config.mjs — базовая конфигурация Next.js 14 (ESM)
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Не блокировать сборку из-за ESLint-ошибок (особенно для демо/маркетинга)
    ignoreDuringBuilds: true
  }
};

export default nextConfig;


