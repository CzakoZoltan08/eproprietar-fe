/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['eproprietar.ro'],
  },
  compiler: {
    styledComponents: true, // Enables styled-components support with SWC
  },
};

export default nextConfig;