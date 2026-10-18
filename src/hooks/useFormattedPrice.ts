import { useQuery } from '@tanstack/react-query';
import { useLocaleStore } from '@/stores/localeStore';
import { demoModeEnabled } from '@/lib/shopify';

type RateTable = { rates: Record<string, number>; updatedAt: number };
const CACHE_KEY = 'thygracemerch-exchange-rates-v1';
function readCache(): RateTable | undefined {
  try {
    const value = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (value?.rates?.GHS === 1 && Date.now() - value.updatedAt < 86400000) return value;
  } catch { /* Storage is optional. */ }
}
async function fetchRates(): Promise<RateTable> {
  const response = await fetch('https://open.er-api.com/v6/latest/GHS', { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Rates unavailable');
  const data = await response.json();
  if (data.result !== 'success' || data.base_code !== 'GHS' || data.rates?.GHS !== 1) throw new Error('Invalid exchange rates');
  const result = { rates: data.rates, updatedAt: data.time_last_update_unix * 1000 };
  if (!Number.isFinite(result.updatedAt) || Date.now() - result.updatedAt > 172800000) throw new Error('Exchange rates are out of date');
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(result)); } catch { /* Storage is optional. */ }
  return result;
}

export function useFormattedPrice() {
  const { selectedLocale } = useLocaleStore();
  const query = useQuery({ queryKey: ['exchange-rates-ghs'], queryFn: fetchRates, initialData: readCache, staleTime: 3600000, retry: 1, refetchOnWindowFocus: false });
  const defaultSource = demoModeEnabled() ? 'EUR' : selectedLocale.currencyCode;
  const convert = (amount: number, from: string, to: string): number | null => {
    if (from === to) return amount;
    const source = query.data?.rates[from], target = query.data?.rates[to];
    return source > 0 && target > 0 ? amount / source * target : null;
  };
  const display = (amount: number, currency: string) => {
    const result = new Intl.NumberFormat(selectedLocale.locale, { style: 'currency', currency }).format(amount);
    return currency === 'GHS' ? result.replace(/GHS|GH₵|GH¢/g, 'GH₵') : result;
  };
  const formatPrice = (amount: string, sourceCurrency = defaultSource): string => {
    const converted = convert(Number(amount), sourceCurrency, selectedLocale.currencyCode);
    // Never relabel an unconverted amount when the rate service is unavailable.
    return display(converted ?? Number(amount), converted === null ? sourceCurrency : selectedLocale.currencyCode);
  };
  const formatTotal = (items: Array<{ price: { amount: string; currencyCode: string }; quantity: number }>): string => {
    const target = selectedLocale.currencyCode;
    const amounts = items.map(item => convert(Number(item.price.amount) * item.quantity, item.price.currencyCode, target));
    if (amounts.every(value => value !== null)) return display(amounts.reduce<number>((sum, value) => sum + (value ?? 0), 0), target);
    const currencies = [...new Set(items.map(item => item.price.currencyCode))];
    return currencies.map(currency => display(items.filter(item => item.price.currencyCode === currency).reduce((sum, item) => sum + Number(item.price.amount) * item.quantity, 0), currency)).join(' + ');
  };
  return { formatPrice, formatTotal, selectedLocale, ratesLoading: query.isPending, ratesError: query.isError, ratesUpdatedAt: query.data?.updatedAt };
}
