import { useEffect, useRef, useState } from 'react';
import './VideoHero.css';

/** No media source is attached until motion preferences have been checked. */
export default function VideoHero() {
  const main = useRef<HTMLVideoElement>(null);
  const background = useRef<HTMLVideoElement>(null);
  const [motion, setMotion] = useState(false);
  const [wide, setWide] = useState(false);
  const [ready, setReady] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 768px)');
    const update = () => { setMotion(!preference.matches); setWide(desktop.matches); };
    update();
    preference.addEventListener('change', update);
    desktop.addEventListener('change', update);
    return () => { preference.removeEventListener('change', update); desktop.removeEventListener('change', update); };
  }, []);

  useEffect(() => {
    const primary = main.current;
    const ambience = background.current;
    if (!primary) return;
    const sync = () => {
      if (ambience && Math.abs(ambience.currentTime - primary.currentTime) > 0.25) ambience.currentTime = primary.currentTime;
    };
    const play = () => {
      if (!motion || failed || paused || document.hidden) { primary.pause(); ambience?.pause(); return; }
      primary.muted = true;
      void primary.play().catch(() => { setReady(false); });
      if (ambience) { ambience.muted = true; sync(); void ambience.play().catch(() => {}); }
    };
    primary.addEventListener('timeupdate', sync);
    document.addEventListener('visibilitychange', play);
    play();
    return () => { primary.removeEventListener('timeupdate', sync); document.removeEventListener('visibilitychange', play); primary.pause(); ambience?.pause(); };
  }, [motion, wide, failed, paused]);

  const playing = motion && !failed;
  return <section className="campaign-hero" aria-label="THY-GRACE fashion campaign">
    <h1 className="sr-only">THY-GRACE — Wear the Message, Live the Word.</h1>
    <div className="campaign-hero__ambience" aria-hidden="true">
      {playing && wide ? <video ref={background} src="/campaign/ambience.mp4" poster="/campaign/ambience.jpg" autoPlay muted loop playsInline preload="auto" tabIndex={-1} className={backgroundReady ? 'is-ready' : ''} onPlaying={() => setBackgroundReady(true)} /> : null}
    </div>
    <div className="campaign-hero__frame">
      <img src="/campaign/poster.jpg" alt="THY-GRACE campaign featuring the original faith-inspired collection" width={352} height={624} {...{ fetchpriority: 'high' }} loading="eager" className="campaign-hero__poster" />
      {playing ? <video ref={main} src="/campaign/thy-grace.mp4" poster="/campaign/poster.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} className={`campaign-hero__video ${ready ? 'is-ready' : ''}`} onPlaying={() => setReady(true)} onError={() => { setFailed(true); setReady(false); }} /> : null}
    </div>
    <div className="campaign-hero__bottom">
      <span aria-hidden="true">A THY-GRACE FILM</span>
      <a href="#thy-grace-edit">Explore the collection <span aria-hidden="true">↓</span></a>
    </div>
    {playing && ready ? <button type="button" className="campaign-motion-toggle" onClick={() => setPaused(value => !value)}>{paused ? 'Resume motion' : 'Pause motion'}</button> : null}
  </section>;
}
