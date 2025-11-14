import path from "path";
import { fileURLToPath } from "url";

/** ESM-safe replacement for __dirname */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },

  serverExternalPackages: ["@prisma/client", "mediasoup"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "soundsync-streams-nhlakanipho.s3.af-south-1.amazonaws.com",
      },
    ],
  },

  webpack: (config) => {
    config.externals = config.externals || [];

    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    return config;
  },
};

export default nextConfig;

