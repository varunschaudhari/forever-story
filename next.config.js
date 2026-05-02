/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  typescript: {
    tsconfigPath: './tsconfig.json',
    // Skip type checking during builds (use npm run type-check separately)
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    // Remove webpack config modifications that conflict with Next.js defaults
    return config;
  },
  experimental: {
    // Optimize for faster builds
    optimizePackageImports: ['@/components', '@/lib', 'mongoose'],
    swcPlugins: [],
  },
  // Enable SWC minification
  swcMinify: true,
  // Faster production builds
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
