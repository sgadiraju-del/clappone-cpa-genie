# Azure Deployment

Recommended production shape:

1. Azure Static Web Apps for `cpa.clappone.com`.
2. Azure App Service or Azure Container Apps for the Node API.
3. Azure Database for PostgreSQL Flexible Server for application data.
4. Azure Blob Storage private container for uploaded tax documents.
5. Azure Document Intelligence for OCR and tax document extraction.
6. Azure OpenAI for CPA assistant reasoning and drafting.

## Static Web App Settings

Use these values when creating the Static Web App from GitHub:

- App location: `/`
- API location: leave blank for the first static MVP
- Output location: `dist/web`
- Build command: `npm run build`

## DNS

Create a CNAME in Wix or BigRock:

- Host: `cpa`
- Value: your Azure Static Web App hostname

Then add `cpa.clappone.com` as a custom domain in Azure Static Web Apps.

## Later API Settings

When the API is deployed, add these app settings:

- `DATABASE_URL`
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_STORAGE_CONTAINER`
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_DEPLOYMENT`
- `JWT_SECRET`
