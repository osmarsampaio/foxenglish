// =========================================================
// Fox English — interações: WhatsApp, menu mobile, parallax
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- link do WhatsApp com mensagem padrão ----------
     Troque o número em WHATSAPP_NUMBER e o texto em WHATSAPP_MESSAGE
     se precisar atualizar depois. */
  const WHATSAPP_NUMBER = '558599757359'; // 55 (Brasil) + 85 (DDD) + 9975-7359
  const WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Fox English e quero saber mais sobre o curso.';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  document.querySelectorAll('.whatsapp-link').forEach(link => {
    link.setAttribute('href', whatsappUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  /* ---------- menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- parallax no scroll ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-speed]'));

  function updateParallax() {
    const viewportH = window.innerHeight;
    const scrollY = window.scrollY;

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.1;
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const distanceFromCenter = (scrollY + viewportH / 2) - (elementTop + rect.height / 2);
      const offset = distanceFromCenter * speed * 0.15;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  if (!reduceMotion) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- tilt sutil no card do vídeo (desktop apenas) ---------- */
  const tiltCard = document.getElementById('tiltCard');

  if (tiltCard && !isCoarsePointer && !reduceMotion) {
    const maxTilt = 4;

    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (-y * maxTilt).toFixed(2);
      const rotateY = (x * maxTilt).toFixed(2);
      tiltCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'none';
    });
  }

  /* ---------- botão de play (placeholder do vídeo) ---------- */
  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      alert('Insira aqui o link ou arquivo do vídeo do professor (troque este botão por um <video> ou <iframe> no index.html).');
    });
  }
});
