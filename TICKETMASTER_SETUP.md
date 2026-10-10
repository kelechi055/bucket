# Ticketmaster events

Create a developer account and application at https://developer.ticketmaster.com/products-and-docs/apis/getting-started/ and copy its Consumer Key/API key.

Add this server-only variable to your local `.env` file (or `.env.local`):

```dotenv
TICKETMASTER_API_KEY="your_actual_api_key"
```

Restart `npm run dev`. In Vercel, add the same variable under your project's Settings → Environment Variables for the environments you use, then redeploy. Never commit the actual key or use a NEXT_PUBLIC prefix.

Open City Guides, choose a city, select Events, and click Find events. Optional date and category filters narrow results. Signed-in users can save an event as a personal list; ticket purchases open the provider's website.

The server limits searches to the curated U.S. cities, caches successful results for five minutes, coalesces identical simultaneous requests, and spaces upstream requests within each server process. These are per-instance controls; at larger traffic volumes use a shared rate limiter/cache to enforce account-wide quotas across instances. Missing credentials show a coming-soon message; upstream failures return a friendly retry message without exposing credentials.
