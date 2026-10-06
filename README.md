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

After choosing your final domain, change the og:image and twitter:image content in index.html to the absolute HTTPS URL of /thygracemerch-social.png on that domain, then redeploy. The images currently use root-relative paths until the chosen domain is connected.

## Mannequin hero

The homepage now uses the supplied ThyGraceMerch mannequin concept on a white background. Previous carousel and clothing-rail layouts are not displayed. The centred image fits within its container, preserving the head and shirt. The laptop hero is capped at 600px; the phone layout uses 72svh with a 420–620px range. Landscape phones use a shorter 380px layout. Shop Now links to /products.

Asset: public/thygracemerch-mannequin-hero.png. The built-in image-generation tool edited the supplied mannequin reference, replacing the gradient background with white and removing screenshot controls. The PNG is included in this ZIP.

Image edit prompt: “Change the yellow/turquoise gradient background to pure white #ffffff and remove all interface overlays: both circular arrow buttons and three dots at the bottom. Preserve exactly the glossy black mannequin, same pose, framing from head to upper thighs, white T-shirt and small green Thy Grace bag-shaped chest logo, lighting, fabric folds and proportions. Centre the mannequin in a portrait 4:5 image with head fully visible and small margin above. White seamless studio background, clean ecommerce hero asset. No new text, no new objects, no redesign of the logo.”

## Validation

Production build and TypeScript checks pass. Lint completes with 13 existing non-blocking warnings. Browser checks passed at 320px, 390px, 768px and 1440px: the image loads, the hero stays compact, Shop Now opens the catalogue, and there is no horizontal page overflow or browser runtime error. Desktop and phone screenshots were visually inspected.

Real checkout and accounts still require Shopify configuration. This ZIP does not automatically update GitHub, Vercel or domain settings.

## Homepage clothing grid and signup

Below the mannequin hero, HomeCollection displays up to eight catalogue products (four in demo mode), with four columns on laptop and two on phone. Cards open the existing product pages; mouse hover shows only that card’s second image. Prices display the currency supplied by the product data. The section and product-image backgrounds are white. View all opens the catalogue.

NewsletterSignup follows the clothing grid with email, optional phone, country-code selection and consent. Email and phone validation, submit locking, pending state, error feedback and the thank-you confirmation are included.

With VITE_NEWSLETTER_ENDPOINT empty, signup saves one preview record in localStorage on the visitor’s device. It is not centrally collected and no email or SMS is sent. Confirmation survives reload, and Clear signup and start again deletes the local record. Do not rely on preview mode to build a real mailing list.

To connect later, set VITE_NEWSLETTER_ENDPOINT to a public server endpoint and redeploy. The form POSTs JSON: email, phone (international format or null), country (ISO country code), consent, source and createdAt. The endpoint must validate the input and save the subscriber to your email service before returning a 2xx response. Failed responses and network errors keep the form available for retry. Use CORS if the endpoint is on another origin. Keep provider API keys on the server, never in VITE_ variables. Signup is for collection updates, not customer account registration.

Additional validation: desktop/mobile clothing links and cart flow passed. Signup tests passed for invalid email and phone, missing consent, normalized Ghana phone numbers, local save/reload/reset, blocked browser storage, optional phone, and mobile sizing. A mocked configured endpoint verified the POST payload, failure handling and successful retry. No live email service was used.
