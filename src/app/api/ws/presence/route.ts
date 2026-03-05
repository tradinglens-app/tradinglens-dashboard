import { WebSocket } from 'ws';

export const dynamic = 'force-dynamic';

export async function GET() {
  const WS_URL = process.env.WS_URL!;
  const WS_API_KEY = process.env.WS_API_KEY!;

  let backendWs: WebSocket | null = null;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      console.log('[SSE Proxy] Connecting to backend WS...');

      backendWs = new WebSocket(WS_URL, {
        headers: {
          'Api-Key': WS_API_KEY
        }
      });

      backendWs.on('open', () => {
        console.log('[SSE Proxy] Connected to backend');
      });

      backendWs.on('message', (data) => {
        const message = data.toString();
        controller.enqueue(encoder.encode(`data: ${message}\n\n`));
      });

      backendWs.on('close', (code) => {
        console.log('[SSE Proxy] Backend disconnected:', code);
        try {
          controller.close();
        } catch (e) {
          // stream might already be closed
        }
      });

      backendWs.on('error', (err) => {
        console.error('[SSE Proxy] Backend error:', err.message);
        try {
          controller.error(err);
        } catch (e) {
          // stream might already be errored
        }
      });
    },
    cancel() {
      console.log('[SSE Proxy] Client disconnected');
      if (backendWs && backendWs.readyState !== WebSocket.CLOSED) {
        backendWs.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  });
}
