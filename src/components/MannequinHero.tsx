import { useEffect, useState } from 'react';
import ActionLink from './ActionLink';
import './MannequinHero.css';

const statements = [
  { text: 'Faith-inspired ', word: 'streetwear.' },
  { text: 'Purpose in every ', word: 'detail.' },
  { text: 'Faith in every ', word: 'piece.' },
];

export default function MannequinHero() {
  const [statement, setStatement] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let interval: ReturnType<typeof setInterval> | undefined;
    let transition: ReturnType<typeof setTimeout> | undefined;
    const stop = () => { clearInterval(interval); clearTimeout(transition); };
    const update = () => {
      stop();
      setVisible(true);
      if (preference.matches) return;
      interval = setInterval(() => {
        setVisible(false);
        transition = setTimeout(() => {
          setStatement(value => (value + 1) % statements.length);
          setVisible(true);
        }, 320);
      }, 4400);
    };
    update();
    preference.addEventListener('change', update);
    return () => { stop(); preference.removeEventListener('change', update); };
  }, []);

  return <section className="tg-editorial-hero" aria-label="THY-GRACE fashion collection">
    <div className="tg-editorial-hero__content">
      <div className="tg-editorial-hero__intro">
        <span>THY-GRACE / FAITH-INSPIRED STREETWEAR</span>
        <p className={`tg-editorial-hero__statement ${visible ? 'is-visible' : 'is-hidden'}`} aria-live="off">
          {statements[statement].text}<span className="tg-editorial-hero__accent">{statements[statement].word}</span>
        </p>
      </div>
      <div className="tg-editorial-hero__headline">
        <h1>WEAR THE <em className="tg-editorial-hero__accent">MESSAGE.</em><span>Live the word.</span></h1>
        <div className="tg-editorial-hero__buttons">
          <ActionLink to="/products" className="tg-editorial-hero__primary">Shop Now</ActionLink>
          <ActionLink href="#thy-grace-edit" className="tg-editorial-hero__secondary">Explore More</ActionLink>
        </div>
      </div>
    </div>
    <div className="tg-editorial-hero__model">
      <img src="/thygrace-editorial-mannequin.png" alt="Black mannequin wearing the original white THY-GRACE shirt with green logo" width="1122" height="1402" {...{ fetchpriority: 'high' }} loading="eager" decoding="async" />
    </div>
    <ActionLink href="#thy-grace-edit" direction="down" className="tg-editorial-hero__scroll">Explore More</ActionLink>
  </section>;
}
