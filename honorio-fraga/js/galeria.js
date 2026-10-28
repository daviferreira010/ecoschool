/* =====================================================================
   galeria.js — GALERIA DE FOTOS + LIGHTBOX
   ---------------------------------------------------------------------
   Lightbox.open(listaDeImagens, indiceInicial)
     listaDeImagens: [{ src, titulo }]
   Galeria.render(container, { limite, filtros })
   As fotos ficam em assets/images/ e são cadastradas em js/data.js (GALERIA).
   ===================================================================== */
const Lightbox = (() => {
  'use strict';
  const { escapeHTML, asset } = Utils;
  let el = null, items = [], index = 0, lastFocus = null;

  function build() {
    el = document.createElement('div');
    el.className = 'lightbox';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Visualizador de imagens');
    el.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Fechar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Imagem anterior"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
      <figure class="lightbox__figure">
        <img class="lightbox__img" alt="">
        <figcaption class="lightbox__caption"></figcaption>
      </figure>
      <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Próxima imagem"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>`;
    document.body.appendChild(el);
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.closest('.lightbox__close')) close();
      if (e.target.closest('.lightbox__nav--prev')) show(index - 1);
      if (e.target.closest('.lightbox__nav--next')) show(index + 1);
    });
    let sx = null;
    el.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    el.addEventListener('pointerup', (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50) show(index + (e.clientX < sx ? 1 : -1)); sx = null; });
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'Tab') { // mantém o foco dentro do lightbox
      const f = Array.from(el.querySelectorAll('button')).filter((b) => b.offsetParent !== null);
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  }

  function show(i) {
    index = (i + items.length) % items.length;
    const it = items[index];
    const img = el.querySelector('.lightbox__img');
    delete img.dataset.fallbackApplied;
    img.src = asset(it.src);
    img.alt = it.titulo || 'Imagem da galeria';
    el.querySelector('.lightbox__caption').innerHTML = `${escapeHTML(it.titulo || '')} <span>${index + 1} / ${items.length}</span>`;
    el.querySelectorAll('.lightbox__nav').forEach((b) => { b.hidden = items.length < 2; });
  }

  function open(list, start = 0) {
    if (!list || !list.length) return;
    if (!el || !document.body.contains(el)) build();
    items = list;
    lastFocus = document.activeElement;
    show(start);
    el.classList.add('is-open');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', onKey);
    el.querySelector('.lightbox__close').focus();
  }

  function close() {
    if (!el) return;
    el.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKey);
    lastFocus && lastFocus.focus();
  }

  return { open, close };
})();

const Galeria = (() => {
  'use strict';
  const { escapeHTML, asset, qsa } = Utils;

  async function render(container, { limite = 0, filtros = true } = {}) {
    if (!container) return;
    let fotos = await API.list('galeria');
    if (limite) fotos = fotos.slice(0, limite);

    const cats = [...new Set(fotos.map((f) => f.categoria))];
    container.innerHTML = `
      ${filtros && cats.length > 1 ? `<div class="chips" role="group" aria-label="Filtrar fotos por categoria">
        <button type="button" class="chip is-active" data-filter="todas" aria-pressed="true">Todas</button>
        ${cats.map((c) => `<button type="button" class="chip" data-filter="${escapeHTML(c)}" aria-pressed="false">${escapeHTML(CATEGORIAS_GALERIA[c] || c)}</button>`).join('')}
      </div>` : ''}
      <ul class="gallery-grid" data-reveal-stagger>
        ${fotos.map((f, i) => `
          <li class="gallery-item" data-cat="${escapeHTML(f.categoria)}">
            <button type="button" class="gallery-item__btn" data-index="${i}" aria-label="Ampliar: ${escapeHTML(f.titulo)}">
              <img src="${asset(f.imagem)}" alt="${escapeHTML(f.titulo)}" loading="lazy" width="800" height="600">
              <span class="gallery-item__overlay"><i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i><span>${escapeHTML(CATEGORIAS_GALERIA[f.categoria] || '')}</span></span>
            </button>
          </li>`).join('')}
      </ul>
      ${fotos.length ? '' : '<p class="empty-state">Nenhuma foto cadastrada ainda.</p>'}`;

    let visiveis = fotos;
    container.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip) {
        const f = chip.dataset.filter;
        qsa('.chip', container).forEach((c) => { const on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
        qsa('.gallery-item', container).forEach((li) => { li.hidden = f !== 'todas' && li.dataset.cat !== f; });
        visiveis = fotos.filter((ft) => f === 'todas' || ft.categoria === f);
        return;
      }
      const btn = e.target.closest('.gallery-item__btn');
      if (btn) {
        const foto = fotos[Number(btn.dataset.index)];
        Lightbox.open(visiveis.map((v) => ({ src: v.imagem, titulo: v.titulo })), visiveis.indexOf(foto));
      }
    });
    Anim.init(container);
  }

  return { render };
})();
