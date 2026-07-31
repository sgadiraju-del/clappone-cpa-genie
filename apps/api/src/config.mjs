const requiredForAssistant = [
  'AZURE_OPENAI_ENDPOINT',
  'AZURE_OPENAI_API_KEY',
  'AZURE_OPENAI_DEPLOYMENT'
];

export const config = {
  port: Number(process.env.PORT || 4001),
  webOrigin: process.env.WEB_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL || '',
  storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
  storageContainer: process.env.AZURE_STORAGE_CONTAINER || 'tax-documents',
  documentIntelligenceEndpoint: process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || '',
  documentIntelligenceKey: process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || '',
  azureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
  azureOpenAiKey: process.env.AZURE_OPENAI_API_KEY || '',
  azureOpenAiDeployment: process.env.AZURE_OPENAI_DEPLOYMENT || '',
  azureOpenAiApiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-06-01',
  jwtSecret: process.env.JWT_SECRET || ''
};

export const getReadiness = () => ({
  postgres: Boolean(config.databaseUrl),
  blobStorage: Boolean(config.storageConnectionString && config.storageContainer),
  documentIntelligence: Boolean(config.documentIntelligenceEndpoint && config.documentIntelligenceKey),
  azureOpenAi: requiredForAssistant.every((name) => Boolean(process.env[name])),
  authSecret: Boolean(config.jwtSecret)
});
