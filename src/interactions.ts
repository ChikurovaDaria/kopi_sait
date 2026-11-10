import { connectCountries } from './countries';
export type PopupName = string;
type OpenPopup = (name: PopupName | null) => void;
const appleStates = [
  ['comp-mo03n51i','mo2oqj56','comp-mo03iybi','mo2orba8','comp-mo2o0i90','mo2os2um','Gravenhill'],
  ['comp-mo03mvvd','mo2oobxm','comp-mo03ipu4','mo2ooqsq','comp-mo2nxbt1','mo2optmp','Sundrop'],
  ['comp-mo03mtsp','mo2om89m','comp-mo03irmo','mo2omv1i','comp-mo2nvq7s','mo2onqxo','Coldspan'],
  ['comp-mo03my5g','mo2offt8','comp-mo03itf1','mo2ofyro','comp-mo2nuce1','mo2ogq8p','Halftide'],
  ['comp-mo03n2kq','mo2o2lqy','comp-mo03iv8n','mo2o3645','comp-mo2nqie1','mo2odseu','Fogborn'],
  ['comp-mo03n06j','mo2lzcko','comp-mo03iwuy','mo2mctlf','comp-mo2minzf','mo2mobrx','Rona'],
];
const destinations: Record<string,string> = {
  '/home':'SCROLL_TO_TOP','/about':'comp-mnzyauyt','/apples':'comp-mo02rwsz',
  '/cyder':'comp-mo043501','/they say':'comp-mo1c0u1n','/contacts':'comp-mo1ivaro',
  'CONTACT US':'comp-mo1ivaro','RESERVE MY CAN':'comp-mo1ivaro',"THIS ONE'S MINE":'comp-mo1ivaro',
};
function navigate(id:string) {
  const target=document.getElementById(id);
  if(!target)return;
  const top=id==='SCROLL_TO_TOP'?0:target.getBoundingClientRect().top+window.scrollY-30;
  window.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
export function startEntranceAnimations(root:HTMLElement) {
  const observer = new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      const element=entry.target as HTMLElement;
      element.style.animationPlayState='running'; observer.unobserve(element);
    }
  },{threshold:0.01});
  root.querySelectorAll<HTMLElement>('[id^="comp-"]').forEach(element=>{
    const style=getComputedStyle(element);
    if(style.animationName!=='none' && style.animationPlayState.includes('paused'))observer.observe(element);
  });
  return ()=>observer.disconnect();
}
export function connectPage(root:HTMLElement, openPopup:OpenPopup) {
  const controller=new AbortController();
  const opts={signal:controller.signal};
  const updateSize=()=>{if(document.body.style.overflow!=='hidden')document.body.style.setProperty('--scrollbar-width',`${window.innerWidth-document.documentElement.clientWidth}px`);};
  updateSize(); window.addEventListener('resize',updateSize,opts);
  const stopMotion=startEntranceAnimations(root);
  root.querySelectorAll<HTMLVideoElement>('video').forEach(video=>{
    video.muted=true; video.loop=true; video.playsInline=true; video.autoplay=false;
    video.pause();
    const toggle=video.closest('[id^="videoContainer_"]')?.parentElement?.closest<HTMLElement>('[role="button"]') || root.querySelector<HTMLElement>('#comp-mo15zmef [role="button"]');
    const switchVideo=()=>{
      if(video.paused){
        video.play().catch(()=>{});video.style.opacity='1';
        const poster=root.querySelector<HTMLElement>('#comp-mo15zmef_img');if(poster)poster.style.opacity='0';
        root.querySelector('#comp-mo15zmef')?.setAttribute('data-playing','');
      }else{video.pause();root.querySelector('#comp-mo15zmef')?.removeAttribute('data-playing');}
      toggle?.setAttribute('aria-pressed',String(!video.paused));
    };
    toggle?.addEventListener('click',switchVideo,opts);
    toggle?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();switchVideo();}},opts);
  });
  function selectApple(index:number|null) {
    appleStates.forEach((state,i)=>{
      [0,2,4].forEach(offset=>{
        const el=root.querySelector<HTMLElement>('#'+state[offset]); if(!el)return;
        [...el.classList].filter(c=>c.startsWith('variants-')).forEach(c=>el.classList.remove(c));
        if(index===i)el.classList.add('variants-'+state[offset+1]);
        if(offset===2)el.style.transform=index===i?'scale(1)':'scale(0)';
        if(offset===4){el.style.opacity=index===i?'1':'0';el.style.pointerEvents=index===i?'auto':'none';}
      });
      root.querySelector('#'+state[0])?.setAttribute('aria-pressed',String(index===i));
    });
  }
  if(root.querySelector('#comp-mo02rwsz')) {
    selectApple(null);
    appleStates.forEach((state,i)=>{
      const el=root.querySelector<HTMLElement>('#'+state[0]);if(!el)return;
      el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label',state[6]);
      el.addEventListener('click',()=>selectApple(i),opts);
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectApple(i);}},opts);
    });
  }
  root.querySelectorAll<HTMLAnchorElement>('a').forEach(anchor=>{
    const label=anchor.textContent?.trim() || anchor.getAttribute('aria-label') || '';
    const destination=destinations[label];
    const popupId=anchor.dataset.popupid;
    if(popupId){anchor.href='#'+popupId;anchor.addEventListener('click',e=>{e.preventDefault();openPopup(popupId);},opts);}
    else if(destination){anchor.href='#'+destination;anchor.addEventListener('click',e=>{e.preventDefault();openPopup(null);requestAnimationFrame(()=>navigate(destination));},opts);}
  });
  root.querySelectorAll<HTMLElement>('[aria-label="Back to site"]').forEach(button=>{
    button.addEventListener('click',()=>openPopup(null),opts);
    button.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPopup(null);}},opts);
  });
  root.querySelectorAll<HTMLElement>('[data-testid="ResponsivePopupPageOverlay"]').forEach(backdrop=>backdrop.addEventListener('click',()=>openPopup(null),opts));
  const footerApple=root.querySelector<HTMLElement>('#comp-mo1kc1si');
  footerApple?.querySelectorAll('p').forEach(p=>{if(p.textContent?.trim()==='/apples'&&!p.querySelector('a')){const a=document.createElement('a');a.href='#comp-mo02rwsz';a.textContent='/apples';p.replaceChildren(a);a.addEventListener('click',e=>{e.preventDefault();navigate('comp-mo02rwsz');},opts);}});
  const form=root.querySelector<HTMLFormElement>('form');
  if(form){
    const submit=[...form.querySelectorAll<HTMLButtonElement>('button')].find(button=>button.textContent?.trim()==="I'M IN");
    if(submit)submit.type='submit';
    const fields=[...form.querySelectorAll<HTMLInputElement>('input')].filter(input=>input.type!=='hidden');
    fields.forEach((field,i)=>{field.required=true;field.name=['fullName','email','phone'][i]||field.name;if(i===1)field.type='email';if(i===2)field.type='tel';});
    form.addEventListener('submit',event=>{
      event.preventDefault();if(!form.reportValidity())return;
      const requests=JSON.parse(localStorage.getItem('tona-reservations')||'[]');
      requests.push({fullName:fields[0]?.value,email:fields[1]?.value,phone:fields[2]?.value,createdAt:new Date().toISOString()});
      localStorage.setItem('tona-reservations',JSON.stringify(requests));
      const status=form.querySelector<HTMLElement>('[role="status"]');
      if(status){status.textContent='Thank you! Your request has been saved on this device.';status.style.cssText='display:block;margin-top:12px;color:#000;font:14px Arial';}
      form.reset();
    },opts);
  }
  const stopCountries=connectCountries(root,controller.signal);
  return ()=>{controller.abort();stopMotion();stopCountries();};
}
