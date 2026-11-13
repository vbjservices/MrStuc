(()=>{'use strict';const header=document.getElementById('header'),progress=document.getElementById('progress'),menu=document.getElementById('menuBtn'),links=document.getElementById('navLinks');document.getElementById('year').textContent=new Date().getFullYear();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const closeMenu=()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false')};menu.addEventListener('click',()=>{const a=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(a))});links.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));// Scroll-linked counters: values advance only when the visitor scrolls.
const stats=document.getElementById('scrollStats');
const counters=[...document.querySelectorAll('.count-up')];
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const quantize=(progress,target,step)=>Math.min(target,Math.floor(progress*target/step+1e-7)*step);
function updateStats(){
 if(!stats)return;
 // Progress starts when the visitor begins scrolling, independent of elapsed time.
 const distance=Math.min(650,Math.max(300,innerHeight*.70));
 const progress=reduced?1:clamp(scrollY/distance,0,1);
 stats.classList.toggle('stats-visible',reduced||scrollY>12);
 counters.forEach(el=>{
  const target=Number(el.dataset.target),step=Number(el.dataset.step),suffix=el.dataset.suffix||'';
  const value=reduced?target:quantize(progress,target,step);
  el.textContent=value+suffix;
 });
}
// Reveal animations are viewport-based; the statistics have their own scroll reveal.
const obs='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(e=>{
 if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}
}),{threshold:.08}):null;
document.querySelectorAll('.reveal').forEach(el=>obs?obs.observe(el):el.classList.add('visible'));
let ticking=false;const photo=document.querySelector('.hero-photo img'),statement=document.querySelector('.statement-bg');function update(){updateStats();const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';header.classList.toggle('scrolled',scrollY>20);if(!reduced){if(photo){const box=photo.parentElement.getBoundingClientRect();if(box.bottom>0&&box.top<innerHeight)photo.style.setProperty('--parallax',Math.max(-38,Math.min(38,(innerHeight/2-box.top-box.height/2)*.12))+'px')}if(statement){const box=statement.parentElement.getBoundingClientRect();if(box.bottom>0&&box.top<innerHeight)statement.style.transform='translate3d(0,'+Math.max(-30,Math.min(30,(innerHeight/2-box.top-box.height/2)*.085))+'px,0) scale(1.16)'}}ticking=false}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update();const overlay=document.getElementById('lightbox'),large=document.getElementById('lightboxImg'),close=document.getElementById('closeLightbox');let returnFocus=null;document.querySelectorAll('[data-img]').forEach(b=>b.addEventListener('click',()=>{const img=b.querySelector('img');returnFocus=b;large.src=img.currentSrc||img.src;large.alt=img.alt;overlay.hidden=false;document.body.style.overflow='hidden';close.focus()}));function hide(){overlay.hidden=true;large.removeAttribute('src');document.body.style.overflow='';returnFocus?.focus()}close.addEventListener('click',hide);overlay.addEventListener('click',e=>{if(e.target===overlay)hide()});addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)hide()});document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();if(!e.target.reportValidity())return;const n=document.getElementById('name').value.trim(),em=document.getElementById('email').value.trim(),m=document.getElementById('message').value.trim();location.href='mailto:info@mrstuc.nl?subject='+encodeURIComponent('Websiteaanvraag via Mister Stuc - '+n)+'&body='+encodeURIComponent('Naam: '+n+'\nE-mail: '+em+'\n\n'+m)})})();