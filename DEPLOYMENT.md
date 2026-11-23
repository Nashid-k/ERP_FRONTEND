# Frontend CI/CD

## Pipeline

GitHub Actions runs on pull requests targeting `main` and pushes to `main`.

1. Installs the exact locked dependency tree with `npm ci`.
2. Runs Oxlint using `npm run lint`.
3. Builds the optimized Vite production bundle using `npm run build`.
4. After CI succeeds, deploys pull requests to Vercel Preview and pushes to `main` to Vercel Production.

## Vercel setup

Create/connect the Vercel project for `Nashid-k/ERP_FRONTEND` and configure these GitHub Actions repository secrets:

- `VERCEL_TOKEN`: a Vercel access token with deployment access.
- `VERCEL_ORG_ID`: the Vercel team/account ID from the project settings.
- `VERCEL_PROJECT_ID`: the project ID from the Vercel project settings.

Configure `VITE_API_URL` in Vercel for both Preview and Production environments. It must point to the matching backend API base URL, including `/api` (for example, `https://your-backend.onrender.com/api`). Vite embeds this value at build time.

The deploy job is skipped until all three Vercel secrets are configured. Do not commit Vercel tokens, project credentials, or environment files.

If Vercel's Git integration is already deploying this repository automatically, disable its automatic Git deployments before enabling this workflow; otherwise each push can trigger duplicate builds/deployments. Keep the GitHub Actions workflow as the single deployment owner.
