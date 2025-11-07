/** @type {import('next').NextConfig} */
const nextConfig = {
  // Provide a small turbopack config so Next.js won't error when a webpack
  // customization is present. Set `root` to this project so Turbopack doesn't
  // incorrectly infer the workspace root from other lockfiles on the machine.
  turbopack: { root: __dirname },
  // `experimental.serverComponentsExternalPackages` was moved — use the
  // top-level `serverExternalPackages` option instead.
  serverExternalPackages: ['mediasoup'],
  // `images.domains` is deprecated in favor of `images.remotePatterns`.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'soundsync-streams-[your-name].s3.af-south-1.amazonaws.com',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
}

module.exports = nextConfig