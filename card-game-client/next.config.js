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
                    process.env.NEXT_PUBLIC_IS_DEV === "true"
                        ? "http://localhost:8081/api/:path*"
                        : "https://jasper-server-meh.shop/api/:path*",
            },
        ];
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            },
        ];
    },
};
