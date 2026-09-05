/* ===== NAV MODAL ===== */
const nm=document.getElementById('navModal');
document.getElementById('menuOpen').onclick=()=>nm.classList.add('active');
document.getElementById('menuClose').onclick=()=>nm.classList.remove('active');
document.querySelectorAll('.nav-links a').forEach(a=>a.onclick=()=>nm.classList.remove('active'));

/* ===== COUNTER ANIMATION ===== */
function animC(el){
  const t=parseFloat(el.dataset.target),s=el.dataset.suffix||'',d=el.dataset.decimal==='true',st=performance.now();
  function u(c){const p=Math.min((c-st)/2000,1),e=1-Math.pow(1-p,3),v=t*e;el.textContent=(d?v.toFixed(1):Math.floor(v))+s;if(p<1)requestAnimationFrame(u)}
  requestAnimationFrame(u);
}
const co=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting){animC(en.target);co.unobserve(en.target)}})},{threshold:0.3});
document.querySelectorAll('.stat-num[data-target]').forEach(el=>co.observe(el));

/* ===== TESTIMONIAL CAROUSEL ===== */
const tk=document.getElementById('tTrack');let ci=0;const ts=tk?tk.children.length:0;
function gs(n){ci=((n%ts)+ts)%ts;tk.style.transform=`translateX(-${ci*100}%)`}
document.getElementById('prevBtn')?.addEventListener('click',()=>gs(ci-1));
document.getElementById('nextBtn')?.addEventListener('click',()=>gs(ci+1));
// Auto-play testimonials
setInterval(()=>gs(ci+1),5000);

/* ===== PRICING TABS ===== */
document.querySelectorAll('.tab-btn').forEach(b=>{b.onclick=()=>{
  document.querySelectorAll('.tab-btn').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  b.classList.add('active');document.querySelector(`[data-panel="${b.dataset.tab}"]`)?.classList.add('active');
}});

/* ===== FIX #5: SERVICE CAROUSELS ===== */
function initServiceCarousel(carouselId, dotsId) {
  const carousel = document.getElementById(carouselId);
  const dotsContainer = document.getElementById(dotsId);
  if (!carousel || !dotsContainer) return;
  const slides = carousel.querySelectorAll('.svc-slide');
  let idx = 0;
  slides.forEach((_,i) => {
    const dot = document.createElement('div');
    dot.className = 'svc-dot' + (i===0?' active':'');
    dot.onclick = () => { idx=i; update(); };
    dotsContainer.appendChild(dot);
  });
  function update() {
    carousel.style.transform = `translateX(-${idx*100}%)`;
    dotsContainer.querySelectorAll('.svc-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
  }
  setInterval(()=>{ idx=(idx+1)%slides.length; update(); }, 4000);
}
initServiceCarousel('svc1','dots1');
initServiceCarousel('svc2','dots2');
initServiceCarousel('svc3','dots3');

/* ===== GSAP ANIMATIONS ===== */
document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* FIX #4: Marquee heading — handled by staggerscroll SplitText below */

  /* H4 character split blur-in */
  document.querySelectorAll('h4').forEach(h => {
    const t = h.innerText; h.innerHTML = '';
    t.split('').forEach(c => {
      const s = document.createElement('span');
      s.style.cssText = 'display:inline-block;opacity:0;filter:blur(8px);transform:translateX(-30px)';
      s.innerText = c===' ' ? '\u00A0' : c;
      h.appendChild(s);
    });
    gsap.fromTo(h.querySelectorAll('span'),
      {x:'-30px', filter:'blur(8px)', opacity:0},
      {x:'0px', filter:'blur(0px)', opacity:1, duration:1.5, ease:'power4.out', stagger:0.05,
       scrollTrigger:{trigger:h, start:'top 90%', end:'top 40%', toggleActions:'restart none none reset', scrub:1}}
    );
  });

  /* H2 SplitText reveal */
  if (typeof SplitText !== 'undefined') {
    document.fonts.ready.then(() => {
      gsap.set('.staggerscroll h2', {opacity: 1});
      if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
      document.querySelectorAll('.staggerscroll h2').forEach(el => {
        const sp = SplitText.create(el, {type:'chars,words', mask:'chars', autoSplit:true});
        gsap.from(sp.chars, {
          duration:1, yPercent:100, opacity:0, stagger:0.01, ease:'power3.out',
          scrollTrigger:{trigger:el, start:'top 80%', toggleActions:'play none none none'}
        });
      });
    });
  }
});
/* ===== FOOTER BRAND AUTO-FIT ===== */
function fitFooterBrand() {
  const el = document.querySelector('.footer-brand h2');
  const wrap = document.querySelector('.footer-brand');
  if (!el || !wrap) return;
  el.style.fontSize = '';
  let max = 300, min = 20, mid;
  for (let i = 0; i < 30; i++) {
    mid = (max + min) / 2;
    el.style.fontSize = mid + 'px';
    if (el.scrollWidth <= wrap.offsetWidth) { min = mid; } else { max = mid; }
  }
  el.style.fontSize = min + 'px';
}
document.fonts.ready.then(fitFooterBrand);
window.addEventListener('resize', fitFooterBrand);
