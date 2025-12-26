import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // onDemandEntries: {
  //   maxInactiveAge: 15 * 1000, //15 seconds instead of default 60
  //   pagesBufferLength: 2, //keep fewer pages in memory
  // },
  // experimental: {
  //   maxMemoryCacheSize: 0, //Disable ISR memory cache
  // },

  // //this to limit memory usage
  // webpack: (config) => {
  //   config.performance = {
  //     maxAssetSize: 500000, //500KB
  //     maxEntrypointSize: 500000,
  //   };
  //   return config;
  // },


};

export default nextConfig;