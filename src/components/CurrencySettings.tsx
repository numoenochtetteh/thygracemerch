import { useLocaleStore } from '@/stores/localeStore';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';
export default function CurrencySettings() {
  const { selectedLocale, availableLocales, setLocale } = useLocaleStore();
  const { ratesLoading, ratesError } = useFormattedPrice();
  return <div className="mt-6 flex flex-col items-center gap-2 text-xs text-muted-foreground normal-case">
    <label className="flex items-center gap-2">Currency
      <select aria-label="Display currency" className="border border-border bg-white text-foreground rounded px-2 py-2" value={selectedLocale.countryCode} onChange={event => { const option = availableLocales.find(value => value.countryCode === event.target.value); if (option) setLocale(option); }}>
        {availableLocales.map(option => <option key={option.countryCode} value={option.countryCode}>{option.country} · {option.currencyCode}</option>)}
      </select>
    </label>
    <p role="status" className="text-center max-w-md">{ratesLoading ? 'Loading exchange rates…' : ratesError ? 'Currency conversion is unavailable. Original prices are shown.' : 'Converted prices are estimates. Final currency and delivery fees are shown at checkout.'}</p>
    <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="underline underline-offset-2">Rates by ExchangeRate-API</a>
  </div>;
}
