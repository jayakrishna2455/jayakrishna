/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'imgd.aeplcdn.com',
            },
            {
                protocol: 'https',
                hostname: 'njayaguhuhhbowqxyqlb.supabase.co',
            },
        ],
    },
};

export default nextConfig;
