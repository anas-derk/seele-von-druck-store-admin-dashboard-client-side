/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    env: {
        BASE_API_URL: process.env.NODE_ENV === "development" ? "http://localhost:5600" : "https://api.olamet-vip.com",
        WEBSITE_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://olamet-vip.com",
        adminTokenNameInLocalStorage: "s-v-d-s-a-t",
        currencyName: "EUR",
        storeName: "Seele Von Druck Store",
        adminDashboardlanguageFieldNameInLocalStorage: "seele-von-druck-store-admin-dashboard-language",
        defaultLanguage: "en"
    },
    async headers() {
        return [
            {
                source: process.env.NODE_ENV === "development" ? "//localhost:5600/(.*)" : "//api.olamet-vip.com/(.*)",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    {
                        key: "Access-Control-Allow-Origin",
                        value: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://olamet-vip.com",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value:
                            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ]
            }
        ];
    }
}

module.exports = nextConfig;