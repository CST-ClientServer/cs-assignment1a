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
                source: "/:path*",
                destination:
                    "https://jasper-server-meh.shop/api/:path*",
            },
        ];
    },
};
