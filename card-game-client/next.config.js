module.exports = {
    images: {
        domains: ['localhost']
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