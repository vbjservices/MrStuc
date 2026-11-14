(()=>{'use strict';const header=document.getElementById('header'),progress=document.getElementById('progress'),menu=document.getElementById('menuBtn'),links=document.getElementById('navLinks');document.getElementById('year').textContent=new Date().getFullYear();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const closeMenu=()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false')};menu.addEventListener('click',()=>{const a=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(a))});links.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));// Stat counters animate once when scrolling begins, not in proportion to scroll distance.
const stats=document.getElementById('scrollStats');
const counters=[...document.querySelectorAll('.count-up')];
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
let countersStarted=false;
function updateStats(){
 if(!stats)return;
 // Show the true totals by default; a single scroll starts a short, self-finishing animation.
 stats.classList.add('stats-visible');
 if(countersStarted||scrollY<=12)return;
 countersStarted=true;
 if(reduced)return;
 const duration=1050, began=performance.now();
 function animate(now){
  const p=clamp((now-began)/duration,0,1);
  const eased=1-Math.pow(1-p,2.4);
  counters.forEach(el=>{
   const target=Number(el.dataset.target),step=Math.max(1,Number(el.dataset.step)||1),suffix=el.dataset.suffix||'';
   const value=p>=1?target:Math.min(target,Math.floor(eased*target/step)*step);
   el.textContent=value+suffix;
  });
  if(p<1)requestAnimationFrame(animate);
 }
 counters.forEach(el=>{el.textContent='0'+(el.dataset.suffix||'')});
 requestAnimationFrame(animate);
}
// Reveal animations are viewport-based; the statistics have their own scroll reveal.
const obs='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(e=>{
 if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}
}),{threshold:.08}):null;
document.querySelectorAll('.reveal').forEach(el=>obs?obs.observe(el):el.classList.add('visible'));
/* Pinned hero: the scroll position, not elapsed time, determines every movement. */
const heroScene=document.getElementById('heroScrollScene');
const heroPinned=document.getElementById('heroPinned');
const heroLayers=heroPinned?[
  {el:heroPinned.querySelector('.eyebrow'), start:0, end:.32, rise:120},
  {el:heroPinned.querySelector('h1'),start:0,end:.52,rise:190},
  {el:heroPinned.querySelector('.hero-copy>p'),start:.12,end:.67,rise:180},
  {el:heroPinned.querySelector('.hero-actions'),start:.25,end:.79,rise:155},
  {el:heroPinned.querySelector('.hero-facts'),start:0,end:.50,rise:50}
]:[];
const heroMascot=heroPinned?.querySelector('.hero-brand-card');
const heroPhoto=heroPinned?.querySelector('.hero-bg');
function updateHeroScene(){
 if(!heroScene||reduced)return;
 const scrollLength=Math.max(1,heroScene.offsetHeight-innerHeight);
 const pos=clamp((scrollY-(heroScene.getBoundingClientRect().top+scrollY))/scrollLength,0,1);
 heroLayers.forEach(({el,start,end,rise},i)=>{
  if(!el)return;
  const v=clamp((pos-start)/(end-start),0,1);
  // Content drifts continuously upward while new text reveals from below.
  const y=(1-v)*45-v*rise;
  const opacity=clamp((pos-start+.115)/.13,0,1);
  el.style.transform='translate3d(0,'+y.toFixed(1)+'px,0)';
  el.style.opacity=String(opacity);
 });
 if(heroPhoto)heroPhoto.style.transform='translate3d(0,'+(-pos*105).toFixed(1)+'px,0) scale('+(1.09+pos*.075).toFixed(3)+')';
 if(heroMascot){
  const v=clamp(pos/.7,0,1);
  heroMascot.style.transform='translate3d(0,'+(-v*90).toFixed(1)+'px,0)';
  heroMascot.style.opacity=String(clamp((pos-.10)/.25,0,1));
 }
}
let ticking=false;const heroParallax=heroScene?null:(document.querySelector('.hero-bg')||document.querySelector('.hero-photo img')),statement=document.querySelector('.statement-bg');function update(){updateStats();updateHeroScene();const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';header.classList.toggle('scrolled',scrollY>20);if(!reduced){if(heroParallax){const heroBox=heroParallax.parentElement.getBoundingClientRect();if(heroBox.bottom>0&&heroBox.top<innerHeight)heroParallax.style.setProperty('--parallax',Math.max(-38,Math.min(38,(innerHeight/2-heroBox.top-heroBox.height/2)*.12))+'px')}if(statement){const box=statement.parentElement.getBoundingClientRect();if(box.bottom>0&&box.top<innerHeight)statement.style.transform='translate3d(0,'+Math.max(-30,Math.min(30,(innerHeight/2-box.top-box.height/2)*.085))+'px,0) scale(1.16)'}}ticking=false}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update();const overlay=document.getElementById('lightbox'),large=document.getElementById('lightboxImg'),close=document.getElementById('closeLightbox');let returnFocus=null;document.querySelectorAll('[data-img]').forEach(b=>b.addEventListener('click',()=>{const img=b.querySelector('img');returnFocus=b;large.src=img.currentSrc||img.src;large.alt=img.alt;overlay.hidden=false;document.body.style.overflow='hidden';close.focus()}));function hide(){overlay.hidden=true;large.removeAttribute('src');document.body.style.overflow='';returnFocus?.focus()}close.addEventListener('click',hide);overlay.addEventListener('click',e=>{if(e.target===overlay)hide()});addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)hide()});document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();if(!e.target.reportValidity())return;const n=document.getElementById('name').value.trim(),em=document.getElementById('email').value.trim(),m=document.getElementById('message').value.trim();location.href='mailto:info@mrstuc.nl?subject='+encodeURIComponent('Websiteaanvraag via Mister Stuc - '+n)+'&body='+encodeURIComponent('Naam: '+n+'\nE-mail: '+em+'\n\n'+m)})})();