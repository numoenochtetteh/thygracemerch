import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './HomeSections.css';

const countries = [
  { value: 'GH', label: 'GH +233', dial: '+233' },
  { value: 'GB', label: 'GB +44', dial: '+44' },
  { value: 'US', label: 'US +1', dial: '+1' },
  { value: 'CA', label: 'CA +1', dial: '+1' },
  { value: 'NG', label: 'NG +234', dial: '+234' },
  { value: 'DE', label: 'DE +49', dial: '+49' },
];
const endpoint = (import.meta.env.VITE_NEWSLETTER_ENDPOINT || '').trim();

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('GH');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(() => {
    if (endpoint) return false;
    try { const saved = JSON.parse(localStorage.getItem('thygracemerch-newsletter-preview') || 'null'); return !!(saved?.email && saved?.consent); } catch { return false; }
  });
  const [error, setError] = useState('');
  const submissionLock = useRef(false);
  const confirmation = useRef<HTMLHeadingElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLock.current) return;
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const digits = phone.replace(/[\s().-]/g, '');
    const countryInfo = countries.find(item => item.value === country)!;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setError('Enter a valid email address.'); return; }
    const nationalNumber = digits.replace(/^0+/, '');
    if (digits && (!/^\d{7,14}$/.test(nationalNumber) || countryInfo.dial.length - 1 + nationalNumber.length > 15)) { setError('Enter a valid phone number using digits, without the country code.'); return; }
    if (!consent) { setError('Please agree to receive collection updates.'); return; }
    const payload = { email: cleanEmail, phone: digits ? countryInfo.dial + nationalNumber : null, country, consent: true, source: 'thygracemerch-homepage', createdAt: new Date().toISOString() };
    submissionLock.current = true; setSubmitting(true);
    try {
      if (endpoint) {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('server');
      } else {
        localStorage.setItem('thygracemerch-newsletter-preview', JSON.stringify(payload));
      }
      setSuccess(true);
      requestAnimationFrame(() => confirmation.current?.focus());
    } catch {
      setError(endpoint ? 'We couldn’t save your signup. Please try again.' : 'Your browser couldn’t save the signup. Please enable browser storage and try again.');
    } finally { submissionLock.current = false; setSubmitting(false); }
  }

  function reset() {
    if (!endpoint) localStorage.removeItem('thygracemerch-newsletter-preview');
    setEmail(''); setPhone(''); setConsent(false); setError(''); setSuccess(false);
  }

  return <section className="newsletter-section" aria-label="Collection updates">
    {success ? <div className="newsletter-confirmation" role="status">
      <h2 ref={confirmation} tabIndex={-1}>Thanks for signing up!</h2>
      <p>{endpoint ? 'You’re on the list for our next drop.' : 'Your signup is saved on this device. Email updates will be available once our email service is connected.'}</p>
      <button type="button" className="newsletter-reset" onClick={reset}>{endpoint ? 'Sign up another email' : 'Clear signup and start again'}</button>
    </div> : <div className="newsletter-content">
      <h2>Be first for the next drop.</h2>
      <form onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input id="newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Enter your email address" value={email} onChange={event => setEmail(event.target.value)} disabled={submitting} />
        <div className="newsletter-phone">
          <label className="sr-only" htmlFor="newsletter-country">Phone country code</label>
          <select id="newsletter-country" aria-label="Phone country code" value={country} onChange={event => setCountry(event.target.value)} disabled={submitting}>{countries.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
          <label className="sr-only" htmlFor="newsletter-phone">Phone number (optional)</label>
          <input id="newsletter-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={25} placeholder="Phone number (optional)" value={phone} onChange={event => setPhone(event.target.value)} disabled={submitting} />
        </div>
        <label className="newsletter-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} disabled={submitting} /><span>I agree to receive collection updates. <Link to="/privacy">Privacy policy</Link></span></label>
        {error && <p className="newsletter-error" role="alert">{error}</p>}
        <button className="newsletter-submit" type="submit" disabled={submitting}>{submitting ? 'Signing up…' : 'Sign up'}</button>
        {!endpoint && <p className="newsletter-note">Email delivery isn’t connected yet. Signup is saved on this device only.</p>}
      </form>
    </div>}
  </section>;
}
