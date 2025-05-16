import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';
const withMDX = createMDX();
const config: NextConfig = {
  devIndicators: false,
  // biome-ignore lint/suspicious/useAwait: <explanation>
  async headers() {
    return [
      {
        source: '/registry/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
        ],
      },
    ];
  },
  // biome-ignore lint/suspicious/useAwait: <explanation>
  async redirects() {
    return [
      { source: '/', destination: '/overview', permanent: false },
      {
        source: '/components',
        destination: '/components/gantt',
        permanent: false,
      },
      { source: '/gantt', destination: '/components/gantt', permanent: true },
    ];
  },
  /* config options here */
};
const nextConfig = withMDX({ ...config });
export default nextConfig;
