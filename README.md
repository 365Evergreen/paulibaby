# paulibaby

A personal blog site built with React and Vite, using an Azure Blob container as the CMS.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and update it for your storage account:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Azure Blob CMS setup

Set `VITE_AZURE_BLOG_CONTAINER_URL` to a public or SAS-enabled Azure Blob container URL. The frontend lists every `.json` blob in the container and renders each blob as a blog post.

### Expected post format

```json
{
  "slug": "hello-world",
  "title": "Hello, world",
  "excerpt": "A short summary for the post list.",
  "publishedAt": "2026-07-17",
  "author": "Pauli Baby",
  "tags": ["intro", "personal"],
  "content": [
    "First paragraph.",
    "Second paragraph."
  ]
}
```

`content` can also be a single string separated by blank lines if that is easier for your publishing workflow.

## Available scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — create a production build
- `npm run lint` — run the existing oxlint checks
