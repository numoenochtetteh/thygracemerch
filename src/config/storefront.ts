// Public Paystack-hosted store URL only. No API keys are needed in this website.
const configuredUrl = (import.meta.env.VITE_PAYSTACK_STOREFRONT_URL || '').trim();
function safePaystackUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password && ['paystack.shop', 'paystack.com'].includes(url.hostname) && url.pathname !== '/') return url.href;
  } catch { /* Missing/invalid store URL means checkout is not connected yet. */ }
  return null;
}
export const paystackStorefrontUrl = safePaystackUrl(configuredUrl);
