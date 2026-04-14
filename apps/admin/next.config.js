/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@repo/db", "@repo/env", "@repo/ui", "@repo/utils"],
	serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
