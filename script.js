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

  const navClose = document.getElementById('navClose');
  const navBackdrop = document.getElementById('navBackdrop');
  const mobileQuery = window.matchMedia('(max-width:760px)');

  function syncMenuA11y() {
    if (!navLinks) return;
    if (mobileQuery.matches) {
      navLinks.setAttribute('aria-hidden', navLinks.classList.contains('open') ? 'false' : 'true');
      if (navBackdrop) {
        navBackdrop.setAttribute('aria-hidden', navBackdrop.classList.contains('open') ? 'false' : 'true');
      }
    } else {
      navLinks.removeAttribute('aria-hidden');
      if (navBackdrop) {
        navBackdrop.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function closeMenu() {
    if (document.activeElement && navLinks.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    syncMenuA11y();
    if (navBackdrop) navBackdrop.classList.remove('open');
  }

  function openMenu() {
    navLinks.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    if (navBackdrop) navBackdrop.classList.add('open');
    syncMenuA11y();
  }

  syncMenuA11y();
  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', syncMenuA11y);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(syncMenuA11y);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = !navLinks.classList.contains('open');
      if (isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });

    if (navClose) {
      navClose.addEventListener('click', closeMenu);
    }

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMenu);
    }
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
      alert('GRAVA O VIDEO E ME MANDA FELADAPUTA');
    });
  }
});
