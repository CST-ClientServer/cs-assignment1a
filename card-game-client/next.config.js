module.exports = {
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                hostname: "*",
            },
        ],
    },
  async rewrites() {
      return [
        {
          source: '/:path*',
          destination: 'http://localhost:8081/api/:path*',
        },
      ]
    },
};