// next.config.mjs — базовая конфигурация Next.js 14 (ESM)
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Добавляем версионирование для борьбы с кэшированием
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
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
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Настройки для работы с проксированием
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.API_BASE_URL || 'https://api.bugbot.ru/api'}/:path*`,
      },
    ];
  },
};

export default nextConfig;


