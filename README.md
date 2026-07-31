# ClAppOne CPA Genie

ClAppOne CPA Genie is a separate subsite and product from the employee portal. It is intended for CPA firms, individual CPAs, business clients, and personal tax clients.

Recommended production URL:

- `https://cpa.clappone.com`

This first version is a deployable product blueprint and front-end MVP. The repo also includes a Node API starter and PostgreSQL schema blueprint for the next implementation phase.

## Local Run

```powershell
npm run start
```

Then open:

```text
http://localhost:4174
```

## Build

```powershell
npm run build
```

The deployable static site is generated in `dist/web`.

## Next Backend Phase

1. Create Azure PostgreSQL database using `infra/postgres/001_initial_schema.sql`.
2. Deploy `apps/api` as a separate Azure App Service or Container App.
3. Add Azure Blob Storage for documents.
4. Add Azure Document Intelligence for OCR.
5. Add Azure OpenAI for document assistant and CPA-reviewed form suggestions.
