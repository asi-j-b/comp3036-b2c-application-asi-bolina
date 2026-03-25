/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

module.exports = {
    images: {
        remotePatterns: [new URLPattern('https://images.unsplash.com/**')],
    }
}