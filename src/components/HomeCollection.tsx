import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, type ShopifyProduct } from '@/lib/shopify';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';
import ProductGrid from './ProductGrid';
import './HomeSections.css';

export default function HomeCollection() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { selectedLocale } = useFormattedPrice();
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false);
    fetchProducts(8, undefined, selectedLocale.countryCode)
      .then(items => { if (!cancelled) setProducts(items); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt, selectedLocale.countryCode]);
  return <section className="home-collection" aria-labelledby="home-collection-title">
    <div className="home-collection-heading"><h2 id="home-collection-title">All products</h2><Link to="/products">View all</Link></div>
    {error ? <div className="collection-message" role="alert">We couldn’t load the products. <button onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : <ProductGrid products={products} loading={loading} />}
  </section>;
}
