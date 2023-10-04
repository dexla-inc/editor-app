/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  modularizeImports: {
    "@tabler/icons-react": {
      transform: "@tabler/icons-react/dist/esm/icons/{{member}}",
    },
  },
  transpilePackages: ["@tabler/icons-react"],
  webpack: (config) => {
    // Exclude parsing of large, unchanging dependencies like moment.js
    config.module.noParse = [require.resolve("typescript/lib/typescript.js")];

    return config;
  },
};

module.exports = nextConfig;
