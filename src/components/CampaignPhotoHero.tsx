import { Link } from 'react-router-dom';
import ActionLink from './ActionLink';
import './CampaignPhotoHero.css';

export default function CampaignPhotoHero() {
  return <section className="campaign-photo" aria-label="THY-GRACE King Jesus campaign">
    <picture className="campaign-photo__picture">
      <source media="(max-width: 767px)" type="image/webp" srcSet="/campaign-2026/hero-mobile-480.webp 480w, /campaign-2026/hero-mobile-960.webp 960w" sizes="100vw" width={1143} height={2048} />
      <source media="(max-width: 767px)" srcSet="/campaign-2026/hero-mobile-original.jpeg" width={1143} height={2048} />
      <source type="image/webp" srcSet="/campaign-2026/hero-960.webp 960w, /campaign-2026/hero-1920.webp 1920w" sizes="100vw" />
      <img src="/campaign-2026/hero-original.jpeg" alt="THY-GRACE campaign: a model wearing the black King Jesus tee with a second model in a white tee" width={2048} height={1143} {...{ fetchpriority: 'high' }} loading="eager" decoding="async" />
    </picture>
    <Link to="/products" className="campaign-photo__shop-link">Shop Now</Link>
    <div className="campaign-photo__content">
      <p className="campaign-photo__eyebrow">THY-GRACE / FAITH-INSPIRED STREETWEAR</p>
      <h1>WEAR THE <span>MESSAGE.</span><br />Live the word.</h1>
      <div className="campaign-photo__actions">
        <ActionLink to="/products" className="campaign-photo__primary">Shop Now</ActionLink>
        <ActionLink href="#thy-grace-edit" className="campaign-photo__secondary">Explore More</ActionLink>
      </div>
    </div>
  </section>;
}
