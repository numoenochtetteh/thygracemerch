# ThyGraceMerch

React, TypeScript and Vite storefront, rebranded with the supplied ThyGraceMerch logo. Includes responsive shopping pages, search, cart, collections and Shopify Storefront API support.

## Run locally

Use Node.js 22 LTS. Extract this folder, open a terminal in it, then run:

```sh
npm ci
npm run dev
```

## Deploy to Vercel

1. Upload this folder's contents to a GitHub repository. The repository root should contain package.json and vercel.json.
2. In Vercel, add a new project and import that repository.
3. Framework: Vite. Build command: npm run build. Output directory: dist. Install command: npm ci.
4. Add optional environment variables listed below and deploy. Demo browsing works without environment variables.
5. Test direct links such as /products, /about and /contact. vercel.json includes the SPA fallback for page refreshes.

Official guide: https://vercel.com/docs/frameworks/frontend/vite

## Connect your domain

After buying your chosen domain, add it under the project's Settings → Domains in Vercel. Add both the main domain and www if desired, then enter exactly the DNS records Vercel displays at your domain registrar. Wait for verification and test HTTPS. Do not guess DNS record values.

Official guide: https://vercel.com/docs/domains/working-with-domains/add-a-domain

## Configure real shopping and support

Copy .env.example to .env.local for local settings. For deployment, add the same variables to Vercel and redeploy.

- VITE_SHOPIFY_STORE_DOMAIN: your Shopify domain, for example your-store.myshopify.com (no https://).
- VITE_SHOPIFY_STOREFRONT_TOKEN: a public Storefront API token with the required product and cart permissions. Never use a private token or an Admin API token in a VITE_ variable.
- VITE_CONTACT_EMAIL: your actual customer support email. The form opens a prepared message in the visitor's email app; it does not send email from a server.

Without Shopify credentials, products and prices are demonstration content and real checkout is disabled. Account links also need Shopify. Replace demo product imagery through the Shopify catalogue when connected; original clothing graphics have been preserved.

The contact form remains disabled until a real support email is configured. Old placeholder email addresses have been removed. Supabase is not used by the current storefront; the unrelated supplied .env configuration was removed. Optional Supabase variables are documented in .env.example for future work.

Review the template's legal text, shipping promises, return rules, size guide and FAQ for your business before accepting orders. The rebrand does not verify those business policies.

## Branding and social previews

- public/thygracemerch-logo.png: supplied transparent logo, used in navbar and footer.
- public/thygracemerch-social.png: supplied square logo, used for social previews.
- Browser icon and Apple touch icon assets are included.
- All page titles and visible brand references use ThyGraceMerch.

After choosing your final domain, change the og:image and twitter:image content in index.html to the absolute HTTPS URL of /thygracemerch-social.png on that domain, then redeploy. The images currently use root-relative paths because no domain has been purchased yet.

## Validation

npm run build and TypeScript checks pass. npm run lint passes with existing non-blocking React hook/fast-refresh warnings. The build reports a non-blocking large JavaScript bundle warning. Deployment to a Vercel account and domain purchase remain separate steps.
