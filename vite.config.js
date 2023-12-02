// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        start_url: ".",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#000000",
        name: "Ovcapp",
        short_name: "Ovcapp",
        description: "Ovcapp (PWA)",
        icons: [
          {
            src: "goat-120.png",
            sizes: "120x120",
            type: "image/png",
          },
          {
            src: "goat-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "goat-152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "goat-167.png",
            sizes: "167x167",
            type: "image/png",
          },
          {
            src: "goat-180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "goat-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "goat-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "sheep-icon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
        ],
      },
    }),
  ],
});
