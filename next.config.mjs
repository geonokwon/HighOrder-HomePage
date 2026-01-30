/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  // preload 경고 해결
  optimizeFonts: false,
  // 정적 파일 서빙을 위한 설정
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
    // 로컬 이미지 허용
    unoptimized: true,
  },
};

export default nextConfig; 