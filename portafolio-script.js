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
// (en PC se usa background-attachment:fixed, que ya se ve bien)
// Se usa un loop con requestAnimationFrame (no solo 'scroll') porque en
// iOS Safari el evento scroll no se dispara de forma continua durante
// el deslizamiento con inercia, y eso hacía que el efecto no se viera.
(function(){
  const bgs = document.querySelectorAll('.portafolio-bg, .coliseo-bg, .alimentos-bg, .hero-bg');
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
