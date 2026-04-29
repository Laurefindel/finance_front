type NodeReq = {
  method?: string
  url?: string
  headers: Record<string, string | string[] | undefined>
}

type NodeRes = {
  statusCode: number
  setHeader: (name: string, value: string | string[]) => void
  end: (body?: any) => void
}

let cachedHandler:
  | ((request: Request, requestOpts?: unknown) => Promise<Response>)
  | undefined

async function getStartHandler() {
  if (cachedHandler) return cachedHandler

  // This folder is generated during `npm run build:vercel`
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error Generated at build time by scripts/vercel-prepare.mjs
  const mod = (await import('./_start/server.js')) as unknown as {
    default: {
      fetch: (request: Request, requestOpts?: unknown) => Promise<Response>
    }
  }

  cachedHandler = mod.default.fetch
  return cachedHandler
}

function getHeaderFirst(
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = headers[name]
  if (Array.isArray(value)) return value[0]
  return value
}

function toRequest(req: NodeReq): Request {
  const method = req.method ?? 'GET'
  const pathnameAndQuery = req.url ?? '/'

  const proto = getHeaderFirst(req.headers, 'x-forwarded-proto') ?? 'https'

  const host =
    getHeaderFirst(req.headers, 'x-forwarded-host') ??
    getHeaderFirst(req.headers, 'host') ??
    'localhost'

  const url = `${proto}://${host}${pathnameAndQuery}`

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      headers.set(key, value.join(','))
    } else {
      headers.set(key, value)
    }
  }

  // Most TanStack Start requests are GET/HEAD. For others, we best-effort pass through.
  // Vercel's Node runtime provides a readable request stream; undici's Request needs `duplex`.
  const init: RequestInit & { duplex?: 'half' } = {
    method,
    headers,
  }

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = req as any
    init.duplex = 'half'
  }

  return new Request(url, init)
}

async function sendResponse(nodeRes: NodeRes, response: Response) {
  nodeRes.statusCode = response.status

  response.headers.forEach((value, key) => {
    // NOTE: Set-Cookie may be collapsed by the Fetch Headers impl.
    nodeRes.setHeader(key, value)
  })

  // We buffer to keep the bridge simple and avoid stream interop issues.
  const buf = Buffer.from(await response.arrayBuffer())
  nodeRes.end(buf)
}

export default async function handler(req: NodeReq, res: NodeRes) {
  const startFetch = await getStartHandler()
  const request = toRequest(req)
  const response = await startFetch(request)
  await sendResponse(res, response)
}
