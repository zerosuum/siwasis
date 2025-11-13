const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },

  async rewrites() {
    return [];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "siwasis.novarentech.web.id",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
