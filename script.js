

   (function(){
    const useGSAP = (typeof gsap !== 'undefined');
    const introKey = 'glow_intro_shown_v1';
    const body = document.body;
  
    // Ensure grid overlay exists (in case html didn't include it)
    if(!document.querySelector('.grid-overlay')){
      const g = document.createElement('div');
      g.className = 'grid-overlay';
      document.documentElement.appendChild(g);
    }
  
    // Intro logic: show once per session
    function runIntro(){
      const intro = document.getElementById('introScreen');
      if(!intro) return startMain();
      if(sessionStorage.getItem(introKey)){
        // hide immediately
        intro.remove(); // completely removes it from the DOM
        startMain();
        return;
      }
  
      // show, animate then hide
      if(useGSAP){
        gsap.fromTo(intro.querySelector('.intro-text'), {autoAlpha:0, y:18}, {autoAlpha:1, y:0, duration:1.1, ease:'power3.out'});
        gsap.fromTo(intro, {autoAlpha:1}, {autoAlpha:1, duration:0.1}); // ensure visible
        // auto-hide after 2s
        setTimeout(()=> {
          gsap.to(intro, {autoAlpha:0, scale:0.995, duration:1.0, ease:'power2.inOut', onComplete: ()=> { intro.style.display='none'; sessionStorage.setItem(introKey, '1'); startMain(); }});
        }, 2000);
      } else {
        setTimeout(()=> { intro.style.display='none'; sessionStorage.setItem(introKey, '1'); startMain(); }, 2000);
      }
  
      // allow click to skip
      intro.addEventListener('click', ()=> {
        if(useGSAP){
          gsap.to(intro, {autoAlpha:0, duration:.6, onComplete: ()=> { intro.style.display='none'; sessionStorage.setItem(introKey, '1'); startMain(); }});
        } else { intro.style.display='none'; sessionStorage.setItem(introKey, '1'); startMain(); }
      }, { once:true });
    }
  
    // Start main page animations & behavior
    function startMain(){
      // Reveal elements
      document.querySelectorAll('.reveal').forEach((el,i) => setTimeout(()=> el.classList.add('visible'), 220 + i * 80));
  
      // Nav button behavior
      const navBtn = document.getElementById('navBtn');
      const navMenu = document.getElementById('navMenu');
      if(navBtn && navMenu){
        navBtn.addEventListener('click', ()=> {
          const open = navMenu.classList.toggle('show');
          navBtn.classList.toggle('open', open);
          navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
          navMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
        });
        navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=> {
          navMenu.classList.remove('show'); navBtn.classList.remove('open'); navBtn.setAttribute('aria-expanded','false');
        }));
      }
  
      // Counters
      const counters = document.querySelectorAll('.stat .num');
      if(counters.length){
        const animate = (el, target) => {
          const dur = 1800;
          const start = performance.now();
          function step(now){
            const t = Math.min((now - start)/dur, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.floor(target * eased);
            if(t < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        };
        const io = new IntersectionObserver(entries=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){
              counters.forEach(c=>{
                if(!c.dataset.animated){
                  animate(c, parseInt(c.dataset.target || '0', 10));
                  c.dataset.animated = '1';
                }
              });
            }
          });
        }, { threshold: 0.4 });
        counters.forEach(c => io.observe(c));
      }
  
      // Marquee: duplicate then GSAP scroll
      const track = document.getElementById('marqueeTrack');
      if(track){
        // duplicate contents for seamless scroll
        if(!track.dataset.duplicated){
          track.innerHTML = track.innerHTML + track.innerHTML;
          track.dataset.duplicated = '1';
        }
        if(useGSAP){
          // kill previous if present
          if(track._tween) track._tween.kill();
          const width = track.scrollWidth / 2;
          const dur = Math.max(24, width / 40);
          track._tween = gsap.to(track, { x: -width, duration: dur, ease: 'none', repeat: -1 });
          track.addEventListener('mouseenter', ()=> track._tween.pause());
          track.addEventListener('mouseleave', ()=> track._tween.play());
        } else {
          // fallback — CSS animation already exists in stylesheet if needed
        }
      }
  
      // Form handlers
      bindForm('bookingForm','formMessage');
      bindForm('contactForm','contactMessage');
  
      // small GSAP entry for wrap
      if(useGSAP){
        gsap.from('#wrap', { y: -26, autoAlpha:0, duration:1.1, ease:'power2.out' });
      }
    }
  
    // Form AJAX via Formspree — stays on page
    function bindForm(formId, messageId){
      const form = document.getElementById(formId);
      const msg = document.getElementById(messageId);
      if(!form) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(msg) msg.textContent = 'Sending…';
        const data = new FormData(form);
        try {
          const res = await fetch(form.action, { method:'POST', body:data, headers:{ 'Accept':'application/json' } });
          if(res.ok){
            if(msg) msg.textContent = '✅ Thanks — your request has been sent.';
            form.reset();
          } else {
            const json = await res.json().catch(()=>null);
            if(msg) msg.textContent = json && json.error ? `❌ ${json.error}` : '❌ Error sending — try again.';
          }
        } catch(err){
          if(msg) msg.textContent = '⚠️ Network error. Please retry.';
          console.error('Form error', err);
        }
      });
    }
  
    // Start sequence after DOM ready
    document.addEventListener('DOMContentLoaded', runIntro);
  
  })();
  
// Promo popup logic — show after 30s, once per session
(function(){
  const popupKey = 'promo_shown_v1';
  const popup = document.getElementById('promoPopup');
  const closeBtn = document.getElementById('closePopup');

  if (!popup || sessionStorage.getItem(popupKey)) return;

  setTimeout(() => {
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
    sessionStorage.setItem(popupKey, '1');
  }, 30000); // 30 seconds

  closeBtn.addEventListener('click', () => {
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
  });
})();

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = Array.from({ length: 60 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 2 + 1,
  dx: (Math.random() - 0.5) * 0.3,
  dy: (Math.random() - 0.5) * 0.3,
  color: "rgba(0,234,255,0.3)"
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();


const countdownEl = document.getElementById("countdown");
const targetDate = new Date("2025-10-31T23:59:59");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) {
    countdownEl.textContent = "Expired";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

gsap.from(".kit-card", {
  opacity: 0,
  y: 20,
  duration: 0.8,
  stagger: 0.2,
  ease: "power2.out"
});


document.addEventListener("click", e => {
  const flash = document.createElement("div");
  flash.className = "click-flash";
  flash.style.left = `${e.clientX - 30}px`;
  flash.style.top = `${e.clientY - 30}px`;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 400);
});
gsap.fromTo(flash, { scale: 0, opacity: 0.4 }, {
  scale: 1.8,
  opacity: 0,
  duration: 0.4,
  ease: "power2.out",
  onComplete: () => flash.remove()
});

