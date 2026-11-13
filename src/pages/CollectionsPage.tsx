import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { fetchCollections, type ShopifyCollection } from '@/lib/shopify';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchCollections(20)
      .then((items) => {
        if (!cancelled) {
          setCollections(items.filter(({ node }) => node.handle?.toLowerCase() !== 'frontpage' && node.title?.toLowerCase() !== 'home page'));
        }
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Collections — ThyGraceMerch</title>
        <meta name="description" content="Explore faith-inspired graphic tees, everyday essentials, and new arrivals from ThyGraceMerch." />
      </Helmet>
      <section className="page-padding pb-16 pt-12 min-h-[65vh]">
        <div className="mb-10 md:mb-14">
          <p className="text-xs tracking-[0.15em] text-muted-foreground mb-3">WEAR THE MESSAGE. LIVE THE WORD.</p>
          <h1 className="text-3xl md:text-5xl tracking-tight normal-case">Explore Collections</h1>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }, (_, i) => <div key={i} className="aspect-[4/5] bg-[#f1f1ef] animate-pulse" />)}
          </div>
        ) : error ? (
          <p role="alert" className="text-sm text-muted-foreground">Collections couldn't be loaded. Please try again later.</p>
        ) : collections.length === 0 ? (
          <p className="text-sm text-muted-foreground">No collections are available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
            {collections.map(({ node }) => (
              <Link to={`/collections/${node.handle}`} key={node.id} className="group block" aria-label={`Explore ${node.title}`}>
                <div className="aspect-[4/5] bg-[#f3f3f1] overflow-hidden flex items-center justify-center">
                  {node.image?.url ? (
                    <img
                      src={node.image.url}
                      alt={node.image.altText || `${node.title} collection`}
                      loading="lazy"
                      className="block w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.035]"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">{node.title}</span>
                  )}
                </div>
                <div className="flex justify-between items-start gap-4 pt-4">
                  <div>
                    <h2 className="text-base md:text-lg normal-case tracking-normal">{node.title}</h2>
                    {node.description && <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{node.description}</p>}
                  </div>
                  <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
