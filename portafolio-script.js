// Modal de tarifas (auditorios)
function abrirTarifas(id){
  const modal = document.getElementById(id);
  if(!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function cerrarTarifas(id){
  const modal = document.getElementById(id);
  if(!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    document.querySelectorAll('.tarifas-overlay.active').forEach(m => cerrarTarifas(m.id));
  }
});

// Sombra del header al hacer scroll
const hdr = document.getElementById('hdr');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('scrolled', window.scrollY > 10);
});

// Efecto parallax (sube/baja) del fondo de "Nuestros Auditorios" en móvil
// (el fondo del inicio .hero-bg lo usa en PC y móvil, porque el slider lo mueve con transform y background-attachment:fixed no funciona ahí)
// (en PC se usa background-attachment:fixed, que ya se ve bien)
// Se usa un loop con requestAnimationFrame (no solo 'scroll') porque en
// iOS Safari el evento scroll no se dispara de forma continua durante
// el deslizamiento con inercia, y eso hacía que el efecto no se viera.
(function(){
  const bgs = document.querySelectorAll('.portafolio-bg, .coliseo-bg, .alimentos-bg');
  if(!bgs.length) return;
  const mq = window.matchMedia('(max-width:900px)');

  function loop(){
    bgs.forEach(bg => {
      const section = bg.parentElement;
      if(mq.matches){
        const rect = section.getBoundingClientRect();
        const maxOffset = rect.height * 0.32; // límite para no mostrar el borde

        // progreso de 0 a 1 mientras la sección recorre toda la pantalla:
        // 0 = la sección apenas empieza a aparecer por abajo (el cliente recién empieza a bajar)
        // 1 = la sección ya salió completamente por arriba
        let progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        progress = Math.max(0, Math.min(1, progress));

        // de abajo hacia arriba: empieza en +maxOffset y termina en -maxOffset
        const offset = maxOffset - progress * (maxOffset * 2);
        bg.style.transform = `translateY(${offset}px)`;
      } else {
        bg.style.transform = '';
      }
    });
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();

// Hero Slider — igual al de index.html (2 slides, autoplay, flechas y swipe)
let cur=0,tot=2,tmr;
function chSlide(d){
  const slides=document.getElementById('slides');
  if(!slides) return;
  cur=(cur+d+tot)%tot;
  const isMob = window.innerWidth <= 600;
  slides.style.transform = isMob
    ? `translateX(-${cur*100}vw)`
    : `translateX(-${cur*100}%)`;
  clearInterval(tmr);
  tmr=setInterval(()=>chSlide(1),5500);
}
tmr=setInterval(()=>chSlide(1),5500);

// Swipe táctil en el hero (móvil)
(function(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
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
    if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){
      chSlide(dx > 0 ? 1 : -1);
    }
  }, {passive:true});
})();

// Menú móvil
function toggleMob(){
  const mnav = document.getElementById('mnav');
  mnav.classList.toggle('open');
  document.body.style.overflow = mnav.classList.contains('open') ? 'hidden' : '';
}

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
      setTimeout(()=>{ pre.style.display='none'; }, 600);
    }, 600);
  }

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
