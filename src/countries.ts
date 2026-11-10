import markup from './country-dropdown.html?raw';

/** Reuses the captured search/list/flags rather than approximating the control. */
export function connectCountries(root:HTMLElement,signal:AbortSignal) {
  const button=root.querySelector<HTMLElement>('[aria-label="Phone. Phone. Select a country code"]');
  const phone=root.querySelector<HTMLInputElement>('input[type="tel"]');
  if(!button||!phone)return ()=>{};
  let host:HTMLDivElement|null=null;
  const close=()=>{host?.remove();host=null;button.setAttribute('aria-expanded','false');};
  const toggle=()=>{
    if(host){close();return;}
    host=document.createElement('div');host.innerHTML=markup.replaceAll('"/', '"'+import.meta.env.BASE_URL);document.body.append(host);
    button.setAttribute('aria-expanded','true');
    const floating=host.querySelector<HTMLElement>('[data-floating-ui-focusable]')!;
    const content=host.querySelector<HTMLElement>('[data-hook="dropdown-content"]')!;
    const rect=button.getBoundingClientRect();
    const width=Math.max(220,Math.min(334,window.innerWidth-24));
    floating.style.cssText=`position:fixed;z-index:10001;left:${Math.max(0,Math.min(rect.left,innerWidth-width))}px;top:${Math.min(rect.bottom+6,innerHeight-290)}px;width:${width}px;max-width:${width}px`;
    content.style.maxHeight='280px';
    const search=host.querySelector<HTMLInputElement>('input')!;
    const list=host.querySelector<HTMLElement>('[role="listbox"]')!;
    list.style.cssText='max-height:220px;overflow:auto';
    const searchWrap=search.closest<HTMLElement>('.schBjqn');if(searchWrap)searchWrap.style.minWidth='0';
    search.addEventListener('input',()=>{
      host?.querySelectorAll<HTMLElement>('[role="option"]').forEach(option=>option.hidden=!option.textContent?.toLowerCase().includes(search.value.toLowerCase()));
    });
    host.querySelectorAll<HTMLElement>('[role="option"]').forEach(option=>{
      option.addEventListener('click',()=>{
        const dial=option.textContent?.match(/\+\d+/)?.[0]||'';
        const flag=option.querySelector('img');
        const icon=button.querySelector('svg,img');
        if(flag&&icon){const image=flag.cloneNode() as HTMLImageElement;image.style.cssText='width:18px;height:18px;object-fit:cover';icon.replaceWith(image);}
        phone.value=dial+' ';phone.dispatchEvent(new Event('input',{bubbles:true}));close();phone.focus();
      });
    });
    search.focus();
  };
  button.addEventListener('click',toggle,{signal});
  document.addEventListener('pointerdown',e=>{if(host&&!host.contains(e.target as Node)&&!button.contains(e.target as Node))close();},{signal});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();},{signal});
  window.addEventListener('scroll',close,{signal,passive:true});
  return close;
}
