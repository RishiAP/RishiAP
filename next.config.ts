import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname:"opengraph.githubassets.com",
      }
    ]
  }
};

export default nextConfig;
