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

  /* ---------- efeito de revelar ao rolar a tela (estilo fade + subida) ---------- */
  // qualquer elemento com class="stagger-group" tem seus filhos diretos revelados
  // em cascata (um pouco depois do outro) assim que entram na tela
  document.querySelectorAll('.stagger-group').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.classList.add('reveal');
      const extraDelay = parseFloat(child.style.transitionDelay) || 0;
      child.style.transitionDelay = `${i * 60 + extraDelay}ms`;
    });
  });

  const revealEls = document.querySelectorAll('.reveal');

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- parallax: scroll + movimento do mouse combinados ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-speed], [data-depth]'));
  const baseRects = new Map();

  // mede a posição "natural" de cada elemento (sem transform) uma vez,
  // e reaproveita esse valor — evita recalcular sobre um elemento já deslocado
  function cacheBaseRects() {
    parallaxEls.forEach(el => {
      const prevTransform = el.style.transform;
      el.style.transform = 'none';
      const rect = el.getBoundingClientRect();
      baseRects.set(el, { top: rect.top + window.scrollY, height: rect.height });
      el.style.transform = prevTransform;
    });
  }

  const mouseOffset = new Map();
  const scrollOffset = new Map();

  function applyTransform(el) {
    const sy = scrollOffset.get(el) || 0;
    const m = mouseOffset.get(el) || { x: 0, y: 0 };
    el.style.transform = `translate3d(${m.x.toFixed(1)}px, ${(sy + m.y).toFixed(1)}px, 0)`;
  }

  function updateScrollParallax() {
    const viewportH = window.innerHeight;
    const scrollY = window.scrollY;

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed);
      if (!speed) return;
      const base = baseRects.get(el);
      if (!base) return;
      const distanceFromCenter = (scrollY + viewportH / 2) - (base.top + base.height / 2);
      scrollOffset.set(el, distanceFromCenter * speed * 0.4);
      applyTransform(el);
    });
  }

  function updateMouseParallax(e) {
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;

    parallaxEls.forEach(el => {
      const depth = parseFloat(el.dataset.depth);
      if (!depth) return;
      mouseOffset.set(el, { x: cx * depth, y: cy * depth });
      applyTransform(el);
    });
  }

  if (!reduceMotion) {
    cacheBaseRects();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cacheBaseRects();
        updateScrollParallax();
      }, 150);
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    updateScrollParallax();

    if (!isCoarsePointer) {
      let mouseTicking = false;
      window.addEventListener('mousemove', (e) => {
        if (!mouseTicking) {
          window.requestAnimationFrame(() => {
            updateMouseParallax(e);
            mouseTicking = false;
          });
          mouseTicking = true;
        }
      }, { passive: true });
    }
  }

  /* ---------- tilt 3D no card do vídeo e na foto da raposa (desktop apenas) ---------- */
  function bindTilt(el, maxTilt) {
    if (!el) return;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (-y * maxTilt).toFixed(2);
      const rotateY = (x * maxTilt).toFixed(2);
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'none';
    });
  }

  if (!isCoarsePointer && !reduceMotion) {
    bindTilt(document.getElementById('tiltCard'), 7);
    bindTilt(document.getElementById('tiltPhoto'), 5);
  }

  /* ---------- botão de play (placeholder do vídeo) ---------- */
  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      alert('Insira aqui o link ou arquivo do vídeo do professor (troque este botão por um <video> ou <iframe> no index.html).');
    });
  }

  /* ---------- mover vídeo flutuante para antes do hero no mobile ---------- */
  function moveVideoForMobile() {
    const mobileQuery = window.matchMedia('(max-width:600px)');
    const videoFloating = document.querySelector('.video-floating');
    const hero = document.querySelector('.hero');
    
    if (!videoFloating || !hero) return;
    
    if (mobileQuery.matches) {
      // No mobile: mover vídeo para antes do hero
      if (videoFloating.previousElementSibling !== hero) {
        hero.parentNode.insertBefore(videoFloating, hero);
      }
    } else {
      // No desktop: manter vídeo depois do hero
      const metodo = document.querySelector('#metodo');
      if (metodo && videoFloating.previousElementSibling !== hero) {
        hero.parentNode.insertBefore(videoFloating, metodo);
      }
    }
  }
  
  moveVideoForMobile();
  
  // Atualizar quando mudar o tamanho da tela
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(moveVideoForMobile, 150);
  });
});
