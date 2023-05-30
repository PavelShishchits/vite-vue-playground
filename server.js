import express from 'express';
import { fileURLToPath } from 'node:url'
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5173;

async function createServer({
    isProduction = process.env.NODE_ENV
}) {
    const app = express();

    const manifest = isProduction
     ? JSON.parse(
        fs.readFileSync(path.resolve(__dirname, 'dist/client/ssr-manifest.json'), 'utf-8'),
      )
     : {};

     let vite;

    if (isProduction) {
        const compression = await import('compression');
        const serverStatic = await import('serve-static');

        app.use(compression.default());
        app.use(
            '/',
            serverStatic.default(path.resolve(__dirname, 'dist/client'), {
              index: false,
            }),
          )
    } else {
        const { createServer } = await import('vite'); 
        vite = await createServer({
            server: {
                middlewareMode: true
            },
            appType: 'custom'
        });
    
        app.use(vite.middlewares);
    }

    app.use('*', async (req, res, next) => {
        const url = req.originalUrl;

        try {
            // 1. Read index.html
            const templateFilePath = isProduction 
                ? path.resolve(__dirname, 'dist/client/index.html')
                : path.resolve(__dirname, 'index.html');

            let template = fs.readFileSync(
              templateFilePath,
              'utf-8',
            )
        
            // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
            //    and also applies HTML transforms from Vite plugins, e.g. global
            //    preambles from @vitejs/plugin-react
            if (!isProduction) {
                template = await vite.transformIndexHtml(url, template)
            }
        
            // 3. Load the server entry. ssrLoadModule automatically transforms
            //    ESM source code to be usable in Node.js! There is no bundling
            //    required, and provides efficient invalidation similar to HMR.
            const entityServer = isProduction
                ? import('./dist/server/entry-server.js')
                : vite.ssrLoadModule('/src/entry-server.js');

            const { render } = await entityServer;
        
            // 4. render the app HTML. This assumes entry-server.js's exported
            //     `render` function calls appropriate framework SSR APIs,
            //    e.g. ReactDOMServer.renderToString()
            const { html: appHtml, preloadLinks } = await render(url, manifest)
        
            console.log(preloadLinks);
            // 5. Inject the app-rendered HTML into the template.
            const html = template
                .replace(`<!--preload-links-->`, preloadLinks)
                .replace(`<!--ssr-outlet-->`, appHtml)
        
            // 6. Send the rendered HTML back.
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
          } catch (e) {
            // If an error is caught, let Vite fix the stack trace so it maps back
            // to your actual source code.
            vite && vite.ssrFixStacktrace(e)
            res.status(500).end(e.stack);
          }
    });

    return {
        app
    }
}

createServer({
    isProduction: process.env.NODE_ENV
})
    .then(({ app }) => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    })