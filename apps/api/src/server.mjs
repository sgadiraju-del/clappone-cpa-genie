import { createServer } from 'node:http';
import { draftAssistantResponse } from './azureOpenAi.mjs';
import { config, getReadiness } from './config.mjs';

const parseJsonBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const sendJson = (response, status, body) => {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': config.webOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  });
  response.end(JSON.stringify(body));
};

createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (url.pathname === '/health') {
    sendJson(response, 200, {
      ok: true,
      name: 'clappone-cpa-genie-api',
      readiness: getReadiness()
    });
    return;
  }

  if (url.pathname === '/api/blueprint') {
    sendJson(response, 200, {
      product: 'ClAppOne CPA Genie',
      modules: ['firms', 'clients', 'returns', 'documents', 'integrations', 'ai-assistant', 'audit']
    });
    return;
  }

  if (url.pathname === '/api/assistant/draft' && request.method === 'POST') {
    try {
      const body = await parseJsonBody(request);
      const prompt = String(body.prompt || '').trim();
      if (!prompt) {
        sendJson(response, 400, { message: 'Prompt is required.' });
        return;
      }

      const draft = await draftAssistantResponse(prompt);
      sendJson(response, 200, { draft, requiresCpaReview: true });
    } catch (error) {
      sendJson(response, error.statusCode || 500, {
        message: error.message || 'Assistant request failed.',
        detail: error.detail
      });
    }
    return;
  }

  sendJson(response, 404, { message: 'Not found' });
}).listen(config.port, () => {
  console.log(`ClAppOne CPA Genie API listening on http://localhost:${config.port}`);
});
