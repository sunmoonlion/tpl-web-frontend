import { createServer } from 'node:http'

const host = '127.0.0.1'
const port = Number(process.env.MOCK_WEB_BACKEND_PORT ?? 18080)

const session = {
  contract_version: 1,
  authenticated: true,
  user: {
    actor_id: 'b42cf3bb-d63e-5df5-a884-9c34286f2608',
    app: 'info',
    surface: 'web',
    display_name: 'Paired E2E User',
    email: 'e2e@example.test',
    roles: ['member'],
    scopes: ['profile:read'],
    expires_at: '2027-07-22T06:00:00.000Z',
  },
  csrf_token: 'e2e-csrf-token-value-that-is-long-enough-1234',
}

const server = createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'text/plain' })
    response.end('ok')
    return
  }
  if (request.method === 'GET' && request.url === '/api/auth/me') {
    if (!request.headers.cookie?.includes('sunmoonai_info_web_sid=e2e-session')) {
      sendJson(response, 401, {
        error: {
          code: 'auth_required',
          message: 'Authentication is required',
          operation_id: 'e2e',
        },
      })
      return
    }
    sendJson(response, 200, session)
    return
  }
  response.writeHead(404, { 'content-type': 'text/plain' })
  response.end('not found')
})

server.listen(port, host, () => {
  process.stdout.write(`mock Web Backend listening on http://${host}:${port}\n`)
})

function sendJson(response, status, body) {
  response.writeHead(status, {
    'content-type': 'application/json',
    'cache-control': 'no-store',
  })
  response.end(JSON.stringify(body))
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
