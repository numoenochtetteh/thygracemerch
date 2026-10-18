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

The homepage now uses the supplied ThyGraceMerch mannequin concept on a white background. Previous carousel and clothing-rail layouts are not displayed. The hero is taller across screen sizes: 650–1000px at 90svh on laptop/tablet, 600–1000px using the available viewport on phone, and 560px in short landscape screens. The image scales by height and crops at the sides on narrow screens. The Shop Now button remains hidden, preserving your latest preference.

Asset: public/thygracemerch-mannequin-hero.png. The built-in image-generation tool edited the supplied mannequin reference, replacing the gradient background with white and removing screenshot controls. The PNG is included in this ZIP.

Image edit prompt: “Change the yellow/turquoise gradient background to pure white #ffffff and remove all interface overlays: both circular arrow buttons and three dots at the bottom. Preserve exactly the glossy black mannequin, same pose, framing from head to upper thighs, white T-shirt and small green Thy Grace bag-shaped chest logo, lighting, fabric folds and proportions. Centre the mannequin in a portrait 4:5 image with head fully visible and small margin above. White seamless studio background, clean ecommerce hero asset. No new text, no new objects, no redesign of the logo.”

## Validation

Production build and TypeScript checks pass. Lint completes with 13 existing non-blocking warnings. Browser checks passed at 320px, 390px, 768px, 844px landscape and 1440px: taller hero, hidden Shop Now, compact form, full About photo, no horizontal page overflow or browser runtime errors. GHS default, USD/GBP conversions, saved currency choice, quantity changes, cart totals and signup confirmation were checked. A simulated exchange-rate failure retains original amounts/currencies with an explanation. A mocked Paystack-hosted URL verified product-button navigation; real payments and delivery were not tested. Desktop and phone screenshots were visually inspected.

Real payments require a configured Paystack Storefront URL or an existing Shopify connection. Customer accounts still require Shopify. This ZIP does not automatically update GitHub, Vercel or domain settings.

## Homepage clothing grid and signup

Below the mannequin hero, HomeCollection displays up to eight catalogue products (four in demo mode), with four columns on laptop and two on phone. Cards open the existing product pages; mouse hover shows only that card’s second image. Prices convert from the product data’s currency to the visitor’s selected currency using daily exchange rates. The section and product-image backgrounds are white. View all opens the catalogue.

NewsletterSignup follows the clothing grid with email, optional phone, country-code selection and consent. The form is compact: up to 360px wide on desktop and 280px on phone, with 42px input rows and a 48px submit button. Email and phone validation, submit locking, pending state, error feedback and the thank-you confirmation are included.

With VITE_NEWSLETTER_ENDPOINT empty, signup saves one preview record in localStorage on the visitor’s device. It is not centrally collected and no email or SMS is sent. Confirmation survives reload, and Clear signup and start again deletes the local record. Do not rely on preview mode to build a real mailing list.

To connect later, set VITE_NEWSLETTER_ENDPOINT to a public server endpoint and redeploy. The form POSTs JSON: email, phone (international format or null), country (ISO country code), consent, source and createdAt. The endpoint must validate the input and save the subscriber to your email service before returning a 2xx response. Failed responses and network errors keep the form available for retry. Use CORS if the endpoint is on another origin. Keep provider API keys on the server, never in VITE_ variables. Signup is for collection updates, not customer account registration.

Additional validation: desktop/mobile clothing links and cart flow passed. Signup tests passed for invalid email and phone, missing consent, normalized Ghana phone numbers, local save/reload/reset, blocked browser storage, optional phone, and mobile sizing. A mocked configured endpoint verified the POST payload, failure handling and successful retry. No live email service was used.

## Ghana currency and conversion

Ghana (GHS / GH₵) is the default region. Visitors can change currency in the menu or footer. Saved choices persist. The old locale-storage format migrates once to Ghana; subsequent choices are respected.

Rates come from https://open.er-api.com/v6/latest/GHS using the free, daily ExchangeRate-API endpoint; attribution is included in the footer. Successful responses are cached locally for up to 24 hours. Product cards, product details, related products, search and cart totals use the same conversion. Existing cart entries keep their original currency, and totals convert each line before summing. On conversion failure, amounts keep their original currency and the footer explains the failure; amounts are never merely relabelled.

The four existing template products and EUR sample amounts are unchanged internally. The site now converts these to GHS by default. These are demonstration prices, not approved ThyGraceMerch retail prices. Supply your actual Ghana-cedi prices and catalogue before opening sales. Match the website catalogue to Paystack’s actual items, stock, sizes and prices. Currency conversion is an estimate; Paystack-hosted checkout charges the configured store currency (set this to GHS).

## About photo

public/thygracemerch-about.jpg is the supplied King Jesus photograph. The About page displays it without cropping, including the embedded logo and lower caption.

## Connect Paystack Storefront later

1. The client creates and verifies their own Paystack business account, then creates a Ghana-cedi Storefront.
2. Add the real products, sizes, stock and prices in Paystack. Use the same information on this site.
3. In Paystack Storefront Settings → Checkout, require the delivery address for shipped items and configure delivery locations and fees using the client’s actual courier rates. Add pickup only if available. No example shipping prices have been used as actual charges.
4. Add VITE_PAYSTACK_STOREFRONT_URL=https://paystack.shop/your-actual-store in .env.local and Vercel Environment Variables, then rebuild/redeploy. A valid HTTPS paystack.shop or paystack.com URL is required. No Paystack secret key belongs in this frontend.
5. Product purchase buttons then open the Paystack-hosted store, where customers select products/size and delivery. This is a separate store/cart. The local cart is not transferred; cart messaging states that clearly. No automated stock sync, payment verification or delivery booking is claimed.
6. Run a test order on the client’s Paystack setup. Confirm stock, size selection, address collection, delivery fees, GHS totals and the client’s order notification before going live. The client still books the rider/courier after receiving the order.

While the URL is blank, browsing, local cart and signup preview remain usable; clicking checkout explains that the store is not open yet. No paid order is created. Signup email delivery also remains unconnected until VITE_NEWSLETTER_ENDPOINT is supplied.

Paystack delivery setup reference: https://support.paystack.com/en/articles/2132738
Exchange-rate documentation: https://www.exchangerate-api.com/docs/free
