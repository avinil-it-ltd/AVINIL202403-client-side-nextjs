const path = require('path');

function patchImageRules(rules) {
  if (!Array.isArray(rules)) return;
  for (const rule of rules) {
    if (!rule) continue;
    if (rule.oneOf) {
      patchImageRules(rule.oneOf);
    }
    if (rule.rules) {
      patchImageRules(rule.rules);
    }
    if (rule.loader && rule.loader.includes('next-image-loader')) {
      const origLoader = rule.loader;
      const origOptions = rule.options;
      delete rule.loader;
      delete rule.options;
      rule.use = [
        path.resolve(__dirname, 'src/lib/image-string-loader.js'),
        {
          loader: origLoader,
          options: origOptions,
        },
      ];
    } else if (Array.isArray(rule.use)) {
      const idx = rule.use.findIndex(u => {
        const str = typeof u === 'string' ? u : (u && u.loader) || '';
        return str.includes('next-image-loader');
      });
      if (idx !== -1) {
        rule.use.splice(idx, 0, path.resolve(__dirname, 'src/lib/image-string-loader.js'));
      }
    }
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src/compat/react-router-dom.js');
    patchImageRules(config.module.rules);
    return config;
  },
};

module.exports = nextConfig;
