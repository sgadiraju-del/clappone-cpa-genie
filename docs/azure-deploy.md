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
- `AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT`
- `AZURE_DOCUMENT_INTELLIGENCE_KEY`
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_DEPLOYMENT`
- `AZURE_OPENAI_API_VERSION`
- `JWT_SECRET`

## GitHub Secrets And Variables

Create these GitHub repository secrets:

- `AZURE_STATIC_WEB_APPS_API_TOKEN_CPA_GENIE`: deployment token from the CPA Genie Static Web App.
- `AZURE_API_PUBLISH_PROFILE`: publish profile XML downloaded from the Azure App Service API.
- `AZURE_POSTGRES_DATABASE_URL`: PostgreSQL connection string with `sslmode=require`.

Create these GitHub repository variables:

- `AZURE_API_APP_NAME`: Azure App Service name for the Node API.

## Azure Resource Checklist

Use a separate resource group for CPA Genie, for example `rg-clappone-cpa-genie-prod`.

1. Create Azure Static Web Apps for the static site.
2. Create Azure App Service for the Node API with Node 20.
3. Create Azure Database for PostgreSQL Flexible Server.
4. Create a private Azure Storage account container named `tax-documents`.
5. Create Azure AI Document Intelligence for OCR.
6. Create Azure OpenAI and deploy a chat model. Store the deployment name in `AZURE_OPENAI_DEPLOYMENT`.
7. Add all API app settings listed above to the Azure App Service.
8. Run the `Migrate CPA Genie PostgreSQL` GitHub Action manually after the database is created.

The API workflow deploys the `apps/api` folder. Its production start command is `node src/server.mjs`.

## API Verification

After the API deployment completes, verify:

```text
https://YOUR_API_APP.azurewebsites.net/health
```

The response includes readiness flags for PostgreSQL, Blob Storage, Document Intelligence, Azure OpenAI, and the auth secret.

To test Azure OpenAI after app settings are configured:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://YOUR_API_APP.azurewebsites.net/api/assistant/draft" `
  -ContentType "application/json" `
  -Body '{"prompt":"List missing documents for a 2026 S corp return."}'
```
