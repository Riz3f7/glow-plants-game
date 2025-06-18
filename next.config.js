/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLintのチェックをスキップ
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
