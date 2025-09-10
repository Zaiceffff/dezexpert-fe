// next.config.mjs — базовая конфигурация Next.js 14 (ESM)
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Не блокировать сборку из-за ESLint-ошибок (особенно для демо/маркетинга)
    ignoreDuringBuilds: true
  },
  // Исключаем папку avitobotBE-main из сборки
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/avitobotBE-main/**', '**/node_modules/**']
    };
    return config;
  },
  // Исключаем папку из TypeScript проверки
  typescript: {
    ignoreBuildErrors: false,
  },
  // Исключаем папку из ESLint проверки
  experimental: {
    // Дополнительные экспериментальные функции можно добавить здесь
  },
  // Настройки для работы с проксированием и заголовками
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  // Настройки для работы с внешними доменами
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://195.200.17.116:3000/api/:path*',
      },
    ];
  },
};

export default nextConfig;


