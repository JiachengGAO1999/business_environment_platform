import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import https from 'node:https'
import http from 'node:http'

function fetchPageHtml(targetUrl: string): Promise<{ html: string; finalUrl: string; status: number }> {
  return new Promise((resolve, reject) => {
    const lib = targetUrl.startsWith('https') ? https : http
    const options: https.RequestOptions & { timeout: number } = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
      },
      timeout: 15000,
      family: 4,
    }
    if (targetUrl.startsWith('https')) {
      ;(options as https.RequestOptions).rejectUnauthorized = false
    }
    const req = lib.get(targetUrl, options, (res) => {
        const status = res.statusCode ?? 0
        // Follow redirects (301, 302, 303, 307, 308)
        if (
          [301, 302, 303, 307, 308].includes(status) &&
          res.headers.location
        ) {
          const redirectUrl = new URL(res.headers.location, targetUrl).toString()
          res.resume()
          fetchPageHtml(redirectUrl).then(resolve).catch(reject)
          return
        }

        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => {
          const html = Buffer.concat(chunks).toString('utf-8')
          resolve({ html, finalUrl: targetUrl, status })
        })
      }
    )

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
    req.on('error', (err) => reject(err))
  })
}

function crawlProxyPlugin(): Plugin {
  return {
    name: 'crawl-proxy',
    configureServer(server) {
      server.middlewares.use('/api/crawl', async (req, res) => {
        const rawUrl = req.url ?? ''
        const searchParams = new URL(rawUrl, 'http://localhost').searchParams
        const targetUrl = searchParams.get('url')

        if (!targetUrl) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing url parameter' }))
          return
        }

        try {
          const { html, finalUrl, status } = await fetchPageHtml(targetUrl)
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          })
          res.end(JSON.stringify({ html, finalUrl, status }))
        } catch (err) {
          const e = err as NodeJS.ErrnoException
          const message = e.code ? `${e.code}: ${e.message}` : e.message || String(err)
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), crawlProxyPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
