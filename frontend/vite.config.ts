import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        proxy: {
          '^/api': {
            target: 'https://localhost:7443',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path,
            configure: (proxy, _options) => {
              proxy.on('error', (err, _req, _res) => {
                console.log('Proxy error:', err);
              });
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                console.log('Proxying request:', {
                  originalUrl: req.originalUrl,
                  target: proxyReq.path,
                  method: req.method
                });
              });
            }
          }
        }
      }
    };
});
