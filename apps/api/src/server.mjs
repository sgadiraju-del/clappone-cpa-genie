import { createServer } from 'node:http';

const port = Number(process.env.PORT || 4001);

const sendJson = (response, status, body) => {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(body));
};

createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (url.pathname === '/health') {
    sendJson(response, 200, { ok: true, name: 'clappone-cpa-genie-api' });
    return;
  }

  if (url.pathname === '/api/blueprint') {
    sendJson(response, 200, {
      product: 'ClAppOne CPA Genie',
      modules: ['firms', 'clients', 'returns', 'documents', 'integrations', 'ai-assistant', 'audit']
    });
    return;
  }

  sendJson(response, 404, { message: 'Not found' });
}).listen(port, () => {
  console.log(`ClAppOne CPA Genie API listening on http://localhost:${port}`);
});
