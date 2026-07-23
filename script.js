 
// ── SCROLL REVEAL (Intersection Observer) ──
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        // once visible, stop observing to save performance
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>io.observe(el));
})();
 
// Preloader — robusto para móviles lentos
(function(){
  const pre = document.getElementById('preloader');
  let done = false;
 
  function showAndHide(){
    if(done) return;
    done = true;
    pre.classList.add('fonts-ready');
    setTimeout(()=>{
      pre.classList.add('hidden');
      // Forzar display:none tras la transición para garantizar que desaparece
      setTimeout(()=>{ pre.style.display='none'; }, 600);
    }, 600);
  }
 
  // Tiempo máximo de espera: 3 segundos. Si algo falla, el preloader se oculta igual.
  const safetyTimer = setTimeout(showAndHide, 3000);
 
  function tryHide(){
    clearTimeout(safetyTimer);
    showAndHide();
  }
 
  if(document.fonts && document.fonts.load){
    Promise.all([
      document.fonts.load('700 3rem "Dancing Script"').catch(()=>{}),
      new Promise(res=>{
        if(document.readyState === 'complete') res();
        else window.addEventListener('load', res, {once:true});
      })
    ]).then(tryHide).catch(tryHide);
  } else {
    if(document.readyState === 'complete'){
      tryHide();
    } else {
      window.addEventListener('load', tryHide, {once:true});
    }
  }
})();
 
// Scroll
window.addEventListener('scroll',()=>{
  document.getElementById('hdr').classList.toggle('scrolled',scrollY>60);
});
 
// Hero Slider — autoplay activo con 2 slides
let cur=0,tot=2,tmr;
function chSlide(d){
  cur=(cur+d+tot)%tot;
  const isMob = window.innerWidth <= 600;
  document.getElementById('slides').style.transform = isMob
    ? `translateX(-${cur*100}vw)`
    : `translateX(-${cur*100}%)`;
  clearInterval(tmr);
  tmr=setInterval(()=>chSlide(1),5500);
}
tmr=setInterval(()=>chSlide(1),5500);
 
// Swipe táctil en el hero (móvil)
(function(){
  const hero = document.querySelector('.hero');
  let startX = 0, startY = 0, dragging = false;
 
  hero.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragging = true;
  }, {passive:true});
 
  hero.addEventListener('touchend', e => {
    if(!dragging) return;
    dragging = false;
    const dx = startX - e.changedTouches[0].clientX;
    const dy = startY - e.changedTouches[0].clientY;
    // Solo activar si el movimiento es más horizontal que vertical y supera 40px
    if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){
      chSlide(dx > 0 ? 1 : -1);
    }
  }, {passive:true});
})();
 
// Testimonials
let ct=0;
function goT(i){ct=i;document.getElementById('ttrack').style.transform=`translateX(-${i*100}%)`;document.querySelectorAll('.tdot').forEach((d,j)=>d.classList.toggle('active',j===i));}
setInterval(()=>goT((ct+1)%3),5500);
 
// Search inline
function toggleS(){
  const bar=document.getElementById('searchBar');
  const inp=document.getElementById('searchInput');
  const btn=document.getElementById('searchBtn');
  const res=document.getElementById('searchResults');
  const isOpen=bar.classList.contains('open');
  if(isOpen){
    bar.classList.remove('open');
    btn.style.color='';
    if(res){ res.classList.remove('show'); res.innerHTML=''; }
    inp.value='';
  } else {
    bar.classList.add('open');
    btn.style.color='var(--wine)';
    setTimeout(()=>inp.focus(),350);
  }
}
function closeS(){
  const bar=document.getElementById('searchBar');
  const btn=document.getElementById('searchBtn');
  const res=document.getElementById('searchResults');
  bar.classList.remove('open');
  btn.style.color='';
  if(res){ res.classList.remove('show'); res.innerHTML=''; }
  document.getElementById('searchInput').value='';
}
function closeSBg(e){if(e.target===document.getElementById('sm'))closeS();}
// Cerrar si click fuera del buscador
document.addEventListener('click',e=>{
  const wrap=document.querySelector('.search-wrap');
  if(wrap && !wrap.contains(e.target)) closeS();
});
 
// Mobile nav
function toggleMob(){const n=document.getElementById('mnav');n.classList.toggle('open');document.body.style.overflow=n.classList.contains('open')?'hidden':'';}
 
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ closeS(); closeBebidasModal(); closeProdModal(); }
});
 
// ── MODAL DETALLE PRODUCTO ──
function openProdModal(el){
  const card = el.closest ? el.closest('.bev-card') : el;
  const img  = card.querySelector('img');
  const name = card.querySelector('h6').textContent;
  const price= card.querySelector('span').textContent;
 
  document.getElementById('prodModalImg').src   = img.currentSrc || img.src;
  document.getElementById('prodModalImg').alt   = name;
  document.getElementById('prodModalName').textContent  = name;
  document.getElementById('prodModalPrice').textContent = price;
 
  document.getElementById('productoModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeProdModal(){
  document.getElementById('productoModal').classList.remove('open');
  document.body.style.overflow = '';
}
 
// ── MODAL BEBIDAS ──
// Prevenir scroll del fondo en iOS Safari (touchmove en el backdrop)
function _preventBgScroll(e){
  // Permitir scroll solo si el toque viene del modal-body
  const modalBody = document.querySelector('#bebidasModal .modal-body');
  if(modalBody && modalBody.contains(e.target)) return;
  e.preventDefault();
}
function openBebidasModal(){
  const m = document.getElementById('bebidasModal');
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.addEventListener('touchmove', _preventBgScroll, {passive:false});
}
function closeBebidasModal(){
  const m = document.getElementById('bebidasModal');
  m.classList.remove('open');
  document.body.style.overflow = '';
  document.removeEventListener('touchmove', _preventBgScroll);
}
 
document.querySelectorAll('.bev-card').forEach(card => {
  card.addEventListener('click', function(e){
    // Evitar doble disparo si viene del link ver-mas (ya oculto)
    openProdModal(this);
  });
});
 
(function(){
  function initCarousel(section) {
    const wrap  = section.querySelector('.recipe-carousel-wrap');
    const track = section.querySelector('.bev-grid');
    const dotsEl= section.querySelector('.recipe-carousel-dots');
    if(!wrap || !track || !dotsEl) return;
 
    const cards = Array.from(track.querySelectorAll('.bev-card'));
    const dots  = Array.from(dotsEl.querySelectorAll('.rdot'));
    let cur = 0;
    let startX = 0;
 
    function isMobile(){ return window.innerWidth <= 600; }
 
    function goTo(idx) {
      cur = (idx + cards.length) % cards.length;
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      dots.forEach((d,i) => d.classList.toggle('active', i === cur));
    }
 
    // Touch swipe
    wrap.addEventListener('touchstart', e => {
      if(!isMobile()) return;
      startX = e.touches[0].clientX;
    }, {passive:true});
 
    wrap.addEventListener('touchend', e => {
      if(!isMobile()) return;
      const diff = startX - e.changedTouches[0].clientX;
      if(Math.abs(diff) > 40) goTo(diff > 0 ? cur + 1 : cur - 1);
    }, {passive:true});
 
    // Dots
    dots.forEach((d, i) => d.addEventListener('click', () => { if(isMobile()) goTo(i); }));
 
    // Reset en desktop
    window.addEventListener('resize', () => {
      if(!isMobile()) {
        track.style.transform = '';
        cur = 0;
        dots.forEach((d,i) => d.classList.toggle('active', i===0));
      }
    });
  }
 
  document.querySelectorAll('.recipe-section').forEach(s => initCarousel(s));
})();
 
// ── BUSCADOR EN TIEMPO REAL ──
(function(){
  function buildIndex(){
    const products = [];
    document.querySelectorAll('.bev-card').forEach(card => {
      const img   = card.querySelector('img');
      const name  = card.querySelector('h6');
      const price = card.querySelector('span');
      if(!name) return;
      products.push({
        name:  name.textContent.trim(),
        price: price ? price.textContent.trim() : '',
        img:   img ? (img.currentSrc || img.src) : '',
        card
      });
    });
    return products;
  }
 
  let INDEX = [];
  window.addEventListener('load', () => { INDEX = buildIndex(); });
 
  const resultsBox  = document.getElementById('searchResults');
  const mnavResults = document.getElementById('mnavSearchResults');
 
  function renderResults(found, container, isMob){
    if(!found.length){
      container.innerHTML = '<div class="sr-empty">No se encontraron productos</div>';
    } else {
      container.innerHTML = found.map((p,i) => `
        <div class="sr-item" data-idx="${INDEX.indexOf(p)}">
          <img src="${p.img}" alt="${p.name}"
               onerror="this.src='https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80'"/>
          <div class="sr-item-info">
            <span class="sr-item-name">${p.name}</span>
            <span class="sr-item-price">${p.price}</span>
          </div>
        </div>
      `).join('');
      // Bind click → open product modal
      container.querySelectorAll('.sr-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.idx);
          const p = INDEX[idx];
          if(!p) return;
          // Cerrar buscador
          resultsBox.classList.remove('show');
          mnavResults.classList.remove('show');
          if(isMob){
            document.getElementById('mnavSearchInput').value = '';
            // Cerrar el menú móvil primero, luego animar el modal
            const mnav = document.getElementById('mnav');
            if(mnav){ mnav.classList.remove('open'); }
            document.body.style.overflow = '';
            // Precargar datos del modal
            const modal = document.getElementById('productoModal');
            document.getElementById('prodModalImg').src  = p.img;
            document.getElementById('prodModalImg').alt  = p.name;
            document.getElementById('prodModalName').textContent  = p.name;
            document.getElementById('prodModalPrice').textContent = p.price;
            // Preparar caja en estado inicial igual al CSS original
            const box = modal.querySelector('.prod-modal-box');
            if(box){
              box.style.transition = 'none';
              box.style.transform  = 'translateY(30px) scale(.97)';
            }
            // Esperar a que el menú termine de cerrar (~420ms) y luego abrir con la animación original
            setTimeout(() => {
              modal.classList.add('open');
              document.body.style.overflow = 'hidden';
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  if(box){
                    box.style.transition = 'transform .35s cubic-bezier(.25,.8,.25,1)';
                    box.style.transform  = 'translateY(0) scale(1)';
                  }
                });
              });
            }, 420);
            return;
          } else {
            closeS();
          }
          // Abrir modal de producto con datos (desktop)
          const modal = document.getElementById('productoModal');
          document.getElementById('prodModalImg').src  = p.img;
          document.getElementById('prodModalImg').alt  = p.name;
          document.getElementById('prodModalName').textContent  = p.name;
          document.getElementById('prodModalPrice').textContent = p.price;
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      });
    }
    container.classList.add('show');
  }
 
  window.doSearch = function(q, mode){
    q = q.trim().toLowerCase();
    const container = mode === 'mnav' ? mnavResults : resultsBox;
    if(!q){ container.classList.remove('show'); container.innerHTML=''; return; }
    const nameLow = p => p.name.toLowerCase();
    const found   = INDEX.filter(p => nameLow(p).startsWith(q));
    renderResults(found, container, mode === 'mnav');
  };
 
  // Cerrar dropdown desktop al click fuera
  document.addEventListener('click', e => {
    const wrap = document.querySelector('.search-wrap');
    if(wrap && !wrap.contains(e.target)){
      resultsBox.classList.remove('show');
    }
  });
})();
