const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src/compat/react-router-dom.js');
    config.resolve.alias['react-quill$'] = path.resolve(__dirname, 'src/components/ReactQuillWrapper.js');
    return config;
  },
};

module.exports = nextConfig;
