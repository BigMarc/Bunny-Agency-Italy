/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      ...Object.entries(require("./src/content/route-migrations.json")).map(([source, destination]) => ({ source, destination, statusCode: 301 })),
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },
  async headers() { return [{ source: "/(.*)", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }] }]; }
};
module.exports = nextConfig;
