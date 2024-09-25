/** @type {import('next').NextConfig} */
// next.config.js
// import { i18n } from "./next-i18next.config.mjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // or http
        hostname: "images.unsplash.com", // if your website has no www, drop it
      },
      {
        protocol: "https", // or http
        hostname: "uwdquwwvyllqspkrbpch.supabase.co", // if your website has no www, drop it
      },
      {
        protocol: "https", // or http
        hostname: "random.danielpetrica.com", // if your website has no www, drop it
      },
      {
        protocol: "https", // or http
        hostname: "utfs.io", // if your website has no www, drop it
      },
      {
        protocol: "https", // or http
        hostname: "fastly.picsum.photos", // if your website has no www, drop it
      },
    ],
  },
};

export default withNextIntl(nextConfig);
