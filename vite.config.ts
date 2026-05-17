import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// Mock Vercel API plugin for local dev
const vercelApiMock = () => {
  return {
    name: 'vercel-api-mock',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/')) {
          const apiPath = req.url.split('?')[0]; // simple path
          const filePath = path.join(process.cwd(), `${apiPath}.ts`);
          
          try {
            // Provide Vercel res methods
            res.status = (statusCode: number) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
            
            // Try to load the handler dynamically
            const module = await server.ssrLoadModule(filePath);
            const handler = module.default;
            if (handler) {
              await handler(req, res);
              return;
            }
          } catch (e: any) {
            if (e.code !== 'ERR_MODULE_NOT_FOUND') {
               console.error("API Mock Error:", e);
               // If there's an error calling the module, but the module exists, return 500
               res.statusCode = 500;
               res.setHeader('Content-Type', 'application/json');
               res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
               return;
            }
          }
        }
        next();
      });
    }
  };
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  // Inject env vars into process.env so Vercel Serverless mocks can access them
  Object.assign(process.env, env);

  return {
    plugins: [react(), tailwindcss(), vercelApiMock()],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
