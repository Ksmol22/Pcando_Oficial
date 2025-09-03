import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode }) => {
  const isGitHubPages = process.env.GITHUB_PAGES === 'true' || mode === 'gh-pages';
  
  return {
    plugins: [react()],
    base: isGitHubPages ? '/Pcando_Oficial/' : '/',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3003',
          changeOrigin: true,
          secure: false,
        }
      }
    },
  };
});
