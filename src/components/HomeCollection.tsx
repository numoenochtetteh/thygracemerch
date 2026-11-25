import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts, type ShopifyProduct } from '@/lib/shopify';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';
import ActionLink from './ActionLink';
import './HomeSections.css';
import './ProductImage.css';

// Approved merchandise only. Do not create fillers or copy products from the reference site.
const approvedHandles = [
  'jesus-is-lord-tee',
  'trusting-god-tee',
  'thy-grace-cap',
  'beauty-for-ashes-tee',
  'king-jesus-tee',
  'word-piece',
  'more-than-gold-tee',
  'purpose-life-tee',
];

export default function HomeCollection() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [position, setPosition] = useState(0);
  const [maxPosition, setMaxPosition] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const requestedPosition = useRef<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>();
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
    const gap = (parseFloat(getComputedStyle(el).columnGap) || 0);
    const step = first.getBoundingClientRect().width + gap;
    const maximum = Math.max(0, Math.ceil((el.scrollWidth - el.clientWidth - 1) / step));
    setMaxPosition(maximum);
    setCanPrevious(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => { requestedPosition.current = null; }, 180);
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
      clearTimeout(settleTimer.current);
      requestedPosition.current = null;
      window.removeEventListener('resize', onResize);
    };
  }, [products.length, syncPosition]);

  const goTo = (requested: number) => {
    const el = track.current;
    const item = el?.querySelector<HTMLElement>('.thy-edit__product');
    if (!el || !item) return;
    const gap = (parseFloat(getComputedStyle(el).columnGap) || 0);
    const step = item.getBoundingClientRect().width + gap;
    const next = Math.min(maxPosition, Math.max(0, requested));
    requestedPosition.current = next;
    el.scrollTo({
      left: Math.min(el.scrollWidth - el.clientWidth, next * step),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };
  const move = (direction: -1 | 1) => goTo((requestedPosition.current ?? position) + direction);

  return (
    <section id="thy-grace-edit" className="thy-edit" aria-labelledby="thy-edit-title">
      <div id="home-collection-title" className="thy-edit__heading">
        <h2 id="thy-edit-title"><span className="thy-edit__shop-dot" aria-hidden="true" /> Shop</h2>
        <ActionLink to="/products">Explore All</ActionLink>
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
            id="thy-edit-track"
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
              if (event.key === 'Home') { event.preventDefault(); goTo(0); }
              if (event.key === 'End') { event.preventDefault(); goTo(maxPosition); }
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
                  ) : <span className="thy-edit__missing">Photo coming soon</span>}
                </div>
                <span className="thy-edit__name">{node.title}</span>
                {node.tags?.includes('coming-soon') && <span className="thy-edit__availability">Next drop · Coming soon</span>}
                <span className="thy-edit__price">{formatPrice(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}</span>
              </Link>
            ))}
          </div>
          {maxPosition > 0 && <div className="thy-edit__controls" aria-label="Carousel navigation">
            <button className="thy-edit__arrow" type="button" onClick={() => move(-1)} disabled={!canPrevious} aria-label="Previous product" aria-controls="thy-edit-track"><ChevronLeft size={19} /></button>
            <span className="thy-edit__count" aria-live="polite" aria-atomic="true">{position + 1} / {maxPosition + 1}</span>
            <button className="thy-edit__arrow" type="button" onClick={() => move(1)} disabled={!canNext} aria-label="Next product" aria-controls="thy-edit-track"><ChevronRight size={19} /></button>
          </div>}
        </>
      )}
    </section>
  );
}
