/* =====================================================================
   animations.js — ANIMAÇÕES (GSAP + ScrollTrigger, com fallback)
   ---------------------------------------------------------------------
   - Se o GSAP carregar (CDN), usamos ScrollTrigger para as entradas.
   - Se não carregar (sem internet), usamos IntersectionObserver.
   - Se o usuário preferir "reduzir movimento", nada é animado.

   Como usar no HTML:
     data-reveal                 -> sobe suavemente ao aparecer
     data-reveal="left|right|zoom"
     data-reveal-stagger         -> anima os filhos diretos em sequência
     data-tilt                   -> cartão com inclinação 3D no mouse
     data-parallax="0.2"         -> leve parallax vertical
     data-count="850"            -> contador numérico
   ===================================================================== */
const Anim = (() => {
  'use strict';
  const { qsa, prefersReducedMotion } = Utils;
  const hasGSAP = () => typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  let io = null;

  const OFFSETS = { up: { y: 36 }, left: { x: -48 }, right: { x: 48 }, zoom: { scale: 0.92 } };

  /* -------- Entradas ao rolar -------- */
  function scan(root = document) {
    const reduce = prefersReducedMotion();
    const items = qsa('[data-reveal]:not([data-anim-done]), [data-reveal-stagger]:not([data-anim-done])', root);
    if (!items.length) return;

    items.forEach((el) => el.setAttribute('data-anim-done', ''));
    if (reduce) return;

    if (hasGSAP()) {
      items.forEach((el) => {
        const stagger = el.hasAttribute('data-reveal-stagger');
        const targets = stagger ? Array.from(el.children) : el;
        const from = OFFSETS[el.dataset.reveal] || OFFSETS.up;
        gsap.from(targets, {
          ...from,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: stagger ? 0.08 : 0,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });
      return;
    }

    // Fallback sem GSAP
    document.documentElement.classList.add('reveal-fallback');
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
    }
    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Elementos já visíveis no carregamento aparecem direto (sem esperar)
      if (rect.top < window.innerHeight) el.classList.add('is-visible');
      else io.observe(el);
    });
  }

  /* -------- Contadores -------- */
  function counters(root = document) {
    qsa('[data-count]:not([data-count-done])', root).forEach((el) => {
      el.setAttribute('data-count-done', '');
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target)) return;
      const fmt = (n) => Math.round(n).toLocaleString('pt-BR');
      if (prefersReducedMotion()) { el.textContent = fmt(target); return; }
      if (hasGSAP()) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => { el.textContent = fmt(obj.v); },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        });
      } else {
        const start = performance.now();
        const step = (t) => {
          const p = Math.min((t - start) / 1500, 1);
          el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
  }

  /* -------- Inclinação 3D (cards) -------- */
  function tilt(root = document) {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    qsa('[data-tilt]:not([data-tilt-done])', root).forEach((card) => {
      card.setAttribute('data-tilt-done', '');
      const max = Number(card.dataset.tilt) || 8;
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* -------- Parallax leve -------- */
  function parallax(root = document) {
    if (prefersReducedMotion() || !hasGSAP()) return;
    qsa('[data-parallax]:not([data-parallax-done])', root).forEach((el) => {
      el.setAttribute('data-parallax-done', '');
      const speed = Number(el.dataset.parallax) || 0.2;
      gsap.to(el, {
        yPercent: speed * 100, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* -------- Entrada do Hero (página inicial) -------- */
  function heroIntro() {
    if (prefersReducedMotion() || !hasGSAP()) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__eyebrow', { y: 20, opacity: 0, duration: 0.6 })
      .from('.hero__title .line', { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.3')
      .from('.hero__lead', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero__actions > *', { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.4')
      .from('.hero-stack__card', { y: 60, rotateX: -25, opacity: 0, duration: 1, stagger: 0.15, clearProps: 'transform,opacity' }, '-=0.6');

    // O conteúdo do hero se afasta levemente ao rolar (profundidade)
    gsap.to('.hero__content', {
      y: -60, opacity: 0.3, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  function refresh() { if (hasGSAP()) ScrollTrigger.refresh(); }

  // Remove animações (usado pela prévia ao trocar de página)
  function teardown() {
    if (hasGSAP()) { ScrollTrigger.getAll().forEach((t) => t.kill()); gsap.killTweensOf('*'); }
  }

  function init(root = document) {
    if (hasGSAP() && !init.registered) {
      gsap.registerPlugin(ScrollTrigger);
      init.registered = true;
      // recalcula posições quando imagens terminam de carregar
      window.addEventListener('load', () => ScrollTrigger.refresh());
    }
    scan(root); counters(root); tilt(root); parallax(root);
  }

  return { init, scan, counters, tilt, heroIntro, refresh, teardown, hasGSAP };
})();

/* =====================================================================
   CARROSSEL acessível (setas, pontos, swipe, teclado, autoplay)
   Uso: new Carousel(elemento, { autoplay: 6000 })
   Estrutura esperada:
     .carousel > .carousel__track > .carousel__slide (vários)
   ===================================================================== */
class Carousel {
  constructor(root, { autoplay = 0 } = {}) {
    this.root = root;
    this.track = root.querySelector('.carousel__track');
    this.slides = Array.from(root.querySelectorAll('.carousel__slide'));
    this.index = 0;
    this.autoplay = Utils.prefersReducedMotion() ? 0 : autoplay;
    if (!this.track || this.slides.length < 2) return;
    this.build();
    this.bind();
    this.go(0, false);
    this.play();
  }

  perView() {
    const w = this.root.clientWidth;
    const per = Number(getComputedStyle(this.root).getPropertyValue('--per-view')) || 1;
    return w > 0 ? per : 1;
  }

  maxIndex() { return Math.max(0, this.slides.length - this.perView()); }

  build() {
    const controls = document.createElement('div');
    controls.className = 'carousel__controls';
    controls.innerHTML = `
      <button type="button" class="carousel__btn" data-dir="-1" aria-label="Slide anterior"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>
      <div class="carousel__dots" role="tablist" aria-label="Escolher slide"></div>
      <button type="button" class="carousel__btn" data-dir="1" aria-label="Próximo slide"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>`;
    this.root.appendChild(controls);
    this.dots = controls.querySelector('.carousel__dots');
    this.renderDots();
    this.root.setAttribute('aria-roledescription', 'carrossel');
    this.slides.forEach((s, i) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', `${i + 1} de ${this.slides.length}`);
    });
  }

  renderDots() {
    const n = this.maxIndex() + 1;
    this.dots.innerHTML = Array.from({ length: n }, (_, i) =>
      `<button type="button" class="carousel__dot" role="tab" aria-label="Ir para o slide ${i + 1}" data-i="${i}"></button>`).join('');
  }

  bind() {
    this.root.addEventListener('click', (e) => {
      const btn = e.target.closest('.carousel__btn');
      const dot = e.target.closest('.carousel__dot');
      if (btn) { this.go(this.index + Number(btn.dataset.dir)); this.restart(); }
      if (dot) { this.go(Number(dot.dataset.i)); this.restart(); }
    });
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { this.go(this.index - 1); this.restart(); }
      if (e.key === 'ArrowRight') { this.go(this.index + 1); this.restart(); }
    });
    // swipe no celular
    let startX = null;
    this.track.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    this.track.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) { this.go(this.index + (dx < 0 ? 1 : -1)); this.restart(); }
      startX = null;
    });
    this.root.addEventListener('mouseenter', () => this.stop());
    this.root.addEventListener('mouseleave', () => this.play());
    this.root.addEventListener('focusin', () => this.stop());
    this.onResize = Utils.debounce(() => { this.renderDots(); this.go(Math.min(this.index, this.maxIndex()), false); }, 150);
    window.addEventListener('resize', this.onResize);
  }

  go(i, animate = true) {
    const max = this.maxIndex();
    this.index = i < 0 ? max : i > max ? 0 : i;
    const slideW = this.slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
    this.track.style.transition = animate ? '' : 'none';
    this.track.style.transform = `translate3d(${-this.index * (slideW + gap)}px,0,0)`;
    Array.from(this.dots.children).forEach((d, k) => d.setAttribute('aria-selected', String(k === this.index)));
    this.slides.forEach((s, k) => {
      const visible = k >= this.index && k < this.index + this.perView();
      s.setAttribute('aria-hidden', String(!visible));
      s.querySelectorAll('a, button').forEach((a) => { a.tabIndex = visible ? 0 : -1; });
    });
  }

  play() { if (this.autoplay && !this.timer) this.timer = setInterval(() => this.go(this.index + 1), this.autoplay); }
  stop() { clearInterval(this.timer); this.timer = null; }
  restart() { this.stop(); this.play(); }
}
