import { Link } from 'react-router-dom';
import './MannequinHero.css';

export default function MannequinHero() {
  return (
    <section className="mannequin-hero" aria-label="ThyGraceMerch clothing collection">
      <h1 className="sr-only">ThyGraceMerch clothing and everyday essentials</h1>
      <img
        className="mannequin-hero-image"
        src="/thygracemerch-mannequin-hero.png"
        alt="Black mannequin wearing a white ThyGraceMerch T-shirt with the green chest logo"
        width={1122}
        height={1402}
        fetchPriority="high"
        loading="eager"
      />
      <Link to="/products" className="mannequin-shop-link">Shop Now</Link>
    </section>
  );
}
