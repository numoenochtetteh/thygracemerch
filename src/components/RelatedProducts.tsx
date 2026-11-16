import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, type ShopifyProduct } from '@/lib/shopify';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';
import ProductGrid from './ProductGrid';

interface Props {
  productId: string;
  currentHandle: string;
}

export default function RelatedProducts({ productId, currentHandle }: Props) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { selectedLocale } = useFormattedPrice();

  useEffect(() => {
    let active = true;
    setProducts([]);
    setLoading(true);
    setError(false);
    fetchProducts(12, undefined, selectedLocale.countryCode)
      .then(items => {
        if (!active) return;
        const seen = new Set<string>();
        const others = items.filter(({ node }) => {
          if (node.id === productId || node.handle === currentHandle || seen.has(node.handle)) return false;
          seen.add(node.handle);
          return true;
        });
        setProducts(others.slice(0, 4));
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [productId, currentHandle, selectedLocale.countryCode]);

  if (!loading && !error && products.length === 0) return null;

  return <section className="page-padding border-t border-border pt-12 pb-32 md:pb-16 bg-white" aria-labelledby="related-products-title" aria-busy={loading}>
    <div className="flex items-center justify-between gap-4 mb-8">
      <h2 id="related-products-title" className="text-lg font-semibold normal-case tracking-normal">You may also like</h2>
      <Link to="/products" className="text-xs underline underline-offset-4">View all</Link>
    </div>
    {loading ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" role="status" aria-label="Loading other products">
      {Array.from({ length: 4 }, (_, index) => <div key={index} className="aspect-square bg-[#f7f7f8]" aria-hidden="true" />)}
    </div> : error ? <p className="text-sm text-muted-foreground" role="status">We couldn’t load other pieces. <Link to="/products" className="underline underline-offset-4">Browse the full collection</Link>.</p> : <ProductGrid products={products} />}
  </section>;
}
