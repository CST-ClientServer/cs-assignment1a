module.exports = {
    images: {
        remotePatterns: [
            {
                hostname: "*",
            },
        ],
    },
  async rewrites() {
      return [
        // {
        //   source: '/:path*',
        //   destination: 'http://localhost:8081/api/:path*',
        // },
          {
              source:'/:path*',
              destination: 'http://ec2-54-176-67-195.us-west-1.compute.amazonaws.com:8080/api/:path*',
          }
      ]
    },
};