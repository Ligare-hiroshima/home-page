/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        { source: "/privacy", destination: "/privacy.html" },
        { source: "/contact", destination: "/contact.html" }
      ]
    };
  }
};

export default nextConfig;
