import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
    "*.{glsl,vs,fs,vert,frag}" : {
      loaders : ["raw-loader"],
      as: "*.js"
    }
  }},
  reactCompiler: true,
};

export default nextConfig;
