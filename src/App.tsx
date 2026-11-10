import { memo, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import reference from './reference.html?raw';
import popups from './popups.json';
import { connectPage, startEntranceAnimations, type PopupName } from './interactions';

const SourcePage = memo(function SourcePage({pageRef}:{pageRef:RefObject<HTMLDivElement|null>}) {
  return <div ref={pageRef} dangerouslySetInnerHTML={{__html:reference.replaceAll('"/', '"'+import.meta.env.BASE_URL)}} />;
});

/** The measured source markup keeps its original responsive grid and artwork. */
export default function App() {
  const page = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<PopupName | null>(null);
  useLayoutEffect(() => connectPage(page.current!, setPopup), []);
  useLayoutEffect(() => {
    if (!popup || !overlay.current) return;
    const previous = document.activeElement as HTMLElement | null;
    const cleanup = connectPage(overlay.current, setPopup);
    const motionCleanup = startEntranceAnimations(overlay.current);
    const close = overlay.current.querySelector<HTMLElement>('[aria-label="Back to site"]');
    close?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPopup(null);
      if (event.key === 'Tab') {
        const items = [...overlay.current!.querySelectorAll<HTMLElement>('button,a,input,[tabindex="0"]')].filter(e => e.getClientRects().length);
        if (!items.length) return;
        if (event.shiftKey && document.activeElement === items[0]) {event.preventDefault(); items.at(-1)?.focus();}
        else if (!event.shiftKey && document.activeElement === items.at(-1)) {event.preventDefault(); items[0].focus();}
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {cleanup(); motionCleanup(); previous?.focus({preventScroll:true}); window.removeEventListener('keydown',onKey);};
  }, [popup]);
  const content = popup ? (popups as Record<string,string>)[popup] : '';
  return <>
    <SourcePage pageRef={page} />
    {content && page.current && createPortal(<div ref={overlay} className="tona-overlay" onClick={e=>{if(e.target===e.currentTarget)setPopup(null);}} dangerouslySetInnerHTML={{__html:content.replaceAll('"/', '"'+import.meta.env.BASE_URL)}} />,page.current.querySelector('#SITE_CONTAINER')!)}
  </>;
}
