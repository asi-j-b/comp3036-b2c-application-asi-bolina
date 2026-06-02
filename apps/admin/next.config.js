/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@repo/db", "@repo/env", "@repo/ui", "@repo/utils"],
	serverExternalPackages: ["@prisma/client", "prisma"],
	async redirects() {
		return [
			{
				source: "/dashboard/:path*",
				destination: "/admin-dashboard/:path*",
				permanent: false,
			},
		];
	},
	async rewrites() {
		return [
			{
				source: "/admin-dashboard/:path*",
				destination: "/dashboard/:path*",
			},
		];
	},
};

export default nextConfig;
