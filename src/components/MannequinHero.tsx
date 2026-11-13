import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import './MannequinHero.css';
const statements = [
  'Faith-inspired streetwear.',
  'Purpose in every detail.',
  'Faith in every piece.',
  'WEAR THE MESSAGE. Live the word.',
];
export default function MannequinHero() {
  const [statement, setStatement] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => { setStatement(value=>(value+1)%statements.length);setVisible(true); }, 320);
    }, 4400);
    return () => window.clearInterval(timer);
  }, []);
  return <section className="tg-editorial-hero" aria-label="THY-GRACE fashion collection">
    <div className="tg-editorial-hero__content">
      <div className="tg-editorial-hero__intro">
        <span>THY-GRACE / FAITH-INSPIRED STREETWEAR</span>
        <p className={`tg-editorial-hero__statement ${visible?'is-visible':'is-hidden'}`} aria-live="off">{statements[statement]}</p>
      </div>
      <div className="tg-editorial-hero__headline">
        <h1>WEAR THE MESSAGE.<span>Live the word.</span></h1>
        <div className="tg-editorial-hero__buttons">
          <Link to="/products" className="tg-editorial-hero__primary">Shop Now <ArrowRight aria-hidden="true" /></Link>
          <Link to="/products" className="tg-editorial-hero__secondary">Explore More <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
    <div className="tg-editorial-hero__model">
      <img src="/thygrace-editorial-mannequin.png" alt="Black mannequin wearing the original white THY-GRACE shirt with green logo" width="1122" height="1402" fetchPriority="high" loading="eager" decoding="async" />
    </div>
    <a href="#home-collection-title" className="tg-editorial-hero__scroll">Explore More <ArrowDownRight aria-hidden="true" /></a>
  </section>;
}
