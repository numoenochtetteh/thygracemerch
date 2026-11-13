import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts, type ShopifyProduct } from '@/lib/shopify';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';
import './HomeSections.css';
import './ProductImage.css';

// Approved merchandise only. Do not create fillers or copy products from the reference site.
const approvedHandles = [
  'beauty-for-ashes-tee',
  'jesus-is-lord-tee',
  'more-than-gold-tee',
  'trusting-god-tee',
  'thy-grace-cap',
];

export default function HomeCollection() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [position, setPosition] = useState(0);
  const [maxPosition, setMaxPosition] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const { selectedLocale, formatPrice } = useFormattedPrice();

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProducts(48, undefined, selectedLocale.countryCode)
      .then((items) => {
        if (!active) return;
        const byHandle = new Map(items.map((p) => [p.node.handle, p]));
        setProducts(approvedHandles.flatMap((handle) => {
          const product = byHandle.get(handle);
          return product ? [product] : [];
        }));
        setError(false);
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedLocale.countryCode]);

  const syncPosition = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>('.thy-edit__product');
    if (!first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || '0');
    const step = first.getBoundingClientRect().width + gap;
    const maximum = Math.max(0, Math.ceil((el.scrollWidth - el.clientWidth - 1) / step));
    setMaxPosition(maximum);
    setPosition(Math.min(maximum, Math.max(0, Math.round(el.scrollLeft / step))));
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el || !products.length) return;
    const onResize = () => syncPosition();
    const observer = new ResizeObserver(onResize);
    observer.observe(el);
    window.addEventListener('resize', onResize);
    syncPosition();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [products.length, syncPosition]);

  const move = (direction: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>('.thy-edit__product');
    if (!item) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || '0');
    const step = item.getBoundingClientRect().width + gap;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section id="thy-grace-edit" className="thy-edit" aria-labelledby="thy-edit-title">
      <div id="home-collection-title" className="thy-edit__heading">
        <h2 id="thy-edit-title"><span aria-hidden="true">▪</span> Shop</h2>
        <Link to="/products">Explore All <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>

      {loading ? (
        <div className="thy-edit__skeletons" aria-label="Loading products">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="thy-edit__skeleton" />)}
        </div>
      ) : error ? (
        <p className="thy-edit__empty" role="alert">Products are temporarily unavailable. <Link to="/products">Visit Shop</Link></p>
      ) : products.length === 0 ? (
        <p className="thy-edit__empty">No THY-GRACE items are currently listed. <Link to="/products">Visit Shop</Link></p>
      ) : (
        <>
          <div
            className="thy-edit__track"
            ref={track}
            role="region"
            aria-roledescription="carousel"
            aria-label="THY-GRACE featured merchandise"
            tabIndex={0}
            onScroll={syncPosition}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
              if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
            }}
          >
            {products.map(({ node }) => (
              <Link
                to={`/product/${node.handle}`}
                key={node.id}
                className="thy-edit__product"
                data-product-handle={node.handle}
                aria-label={`${node.title}, ${formatPrice(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}`}
              >
                <div className="thy-edit__image">
                  {node.images.edges[0]?.node.url ? (
                    <img
                      className="merchandise-image"
                      src={node.images.edges[0].node.url}
                      alt={node.images.edges[0].node.altText ?? node.title}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : <span className="thy-edit__missing">Image unavailable</span>}
                </div>
                <span className="thy-edit__name">{node.title}</span>
                <span className="thy-edit__price">{formatPrice(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}</span>
              </Link>
            ))}
          </div>
          <div className="thy-edit__controls" aria-label="Carousel navigation">
            <button type="button" onClick={() => move(-1)} disabled={position === 0} aria-label="Previous product"><ChevronLeft size={19} /></button>
            <span className="thy-edit__indicator" aria-label={`Carousel position ${position + 1} of ${maxPosition + 1}`}>
              <span className="thy-edit__indicator-current" />
              <span className="thy-edit__indicator-end" />
            </span>
            <button type="button" onClick={() => move(1)} disabled={position >= maxPosition} aria-label="Next product"><ChevronRight size={19} /></button>
          </div>
        </>
      )}
    </section>
  );
}
