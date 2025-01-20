/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['eproprietar.ro', 'res.cloudinary.com'],
  },
  compiler: {
    styledComponents: true, // Enables styled-components support with SWC
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map'; // or 'inline-source-map'
    }
    return config;
  },
};

export default nextConfig;