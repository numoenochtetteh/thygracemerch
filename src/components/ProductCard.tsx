import { useState } from 'react';
import './ProductImage.css';
import { Link } from 'react-router-dom';
import { ShopifyProduct } from '@/lib/shopify';
import { Badge } from '@/components/ui/badge';
import { useFormattedPrice } from '@/hooks/useFormattedPrice';

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const { node } = product;
  const images = node.images.edges;
  const hasMultipleImages = images.length > 1;
  const { formatPrice } = useFormattedPrice();
  
  // Check if product has "new" tag (case-insensitive)
  const isNew = node.tags?.some(tag => tag.toLowerCase() === 'new');

  return (
    <Link
      to={`/product/${node.handle}`}
      className="group block merchandise-card"
      data-product-handle={node.handle}
      onMouseEnter={() => hasMultipleImages && setImageIndex(1)}
      onMouseLeave={() => setImageIndex(0)}
    >
      <div className="aspect-square bg-[#f2f2f1] mb-4 overflow-hidden relative">
        {images[imageIndex] ? (
          <img
            src={images[imageIndex].node.url}
            alt={images[imageIndex].node.altText || node.title}
            className="merchandise-image w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
        
        {isNew && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-background text-xs px-1.5 py-0.5 rounded-none font-normal uppercase">
            New
          </Badge>
        )}
        
        {!node.availableForSale && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/90 py-2 text-center">
            <span className="text-xs text-muted-foreground">Sold out</span>
          </div>
        )}
      </div>
      
      <p className="text-sm mb-2 line-clamp-2 font-semibold tracking-normal normal-case">{node.title}</p>
      <p className="text-sm font-semibold text-[#171717]">
        {formatPrice(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}
      </p>
    </Link>
  );
}
