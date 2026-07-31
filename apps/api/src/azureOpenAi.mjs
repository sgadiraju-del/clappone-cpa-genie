import { config } from './config.mjs';

const buildAssistantMessages = (prompt) => [
  {
    role: 'system',
    content:
      'You are CPA Genie, an assistant for CPA firms. Summarize tax document issues, identify missing support, and keep every recommendation subject to CPA review.'
  },
  {
    role: 'user',
    content: prompt
  }
];

export const draftAssistantResponse = async (prompt) => {
  if (!config.azureOpenAiEndpoint || !config.azureOpenAiKey || !config.azureOpenAiDeployment) {
    const error = new Error('Azure OpenAI is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const endpoint = config.azureOpenAiEndpoint.replace(/\/$/, '');
  const url = `${endpoint}/openai/deployments/${encodeURIComponent(
    config.azureOpenAiDeployment
  )}/chat/completions?api-version=${encodeURIComponent(config.azureOpenAiApiVersion)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.azureOpenAiKey
    },
    body: JSON.stringify({
      messages: buildAssistantMessages(prompt),
      temperature: 0.2,
      max_tokens: 700
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    const error = new Error(`Azure OpenAI request failed with ${response.status}.`);
    error.statusCode = 502;
    error.detail = detail.slice(0, 500);
    throw error;
  }

  const body = await response.json();
  return body.choices?.[0]?.message?.content?.trim() || '';
};
