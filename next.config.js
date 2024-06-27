/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const path = require("path");

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:all*(woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/form",
    ],
  },
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
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "img.propelauth.com",
      "avatars.githubusercontent.com",
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
