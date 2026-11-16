import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
    const start = () => {
      stop();
      // Native anchors and wheel scrolling remain available without animation.
      if (preference.matches) return;
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2,
        anchors: { offset: -110 },
      });
      lenisRef.current = lenis;
      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };
    start();
    preference.addEventListener('change', start);
    return () => { preference.removeEventListener('change', start); stop(); };
  }, []);

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return <>{children}</>;
}
