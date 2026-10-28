/* =====================================================================
   noticias.js — NOTÍCIAS (home, listagem com filtros e página individual)
   Os dados vêm de API.noticiasPublicadas() (js/api.js).
   Rascunhos criados no painel não aparecem no site público.
   ===================================================================== */
const Noticias = (() => {
  'use strict';
  const { qs, qsa, escapeHTML, asset, formatDate, normalize, debounce, getParam } = Utils;
  const POR_PAGINA = 6;

  const catClass = (c) => `badge--cat-${Utils.slugify(c || 'geral')}`;

  function card(n, { compact = false } = {}) {
    const url = `noticia.html?id=${encodeURIComponent(n.id)}`;
    return `
      <article class="news-card${compact ? ' news-card--compact' : ''}" data-tilt="4">
        <a class="news-card__media" href="${url}" tabindex="-1" aria-hidden="true">
          <img src="${asset(n.imagem)}" alt="" loading="lazy" width="800" height="500">
        </a>
        <div class="news-card__body">
          <div class="news-card__meta">
            <span class="badge ${catClass(n.categoria)}">${escapeHTML(n.categoria)}</span>
            <time datetime="${escapeHTML(n.data)}"><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${formatDate(n.data)}</time>
          </div>
          <h3 class="news-card__title"><a href="${url}">${escapeHTML(n.titulo)}</a></h3>
          <p class="news-card__excerpt">${escapeHTML(n.resumo)}</p>
          <a class="link-arrow" href="${url}" aria-label="Leia mais: ${escapeHTML(n.titulo)}">Leia mais <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
        </div>
      </article>`;
  }

  /* ---------- Home: últimas notícias ---------- */
  async function renderHome(container, limite = 4) {
    if (!container) return;
    const lista = (await API.noticiasPublicadas()).slice(0, limite);
    if (!lista.length) { container.innerHTML = '<p class="empty-state">Nenhuma notícia publicada ainda.</p>'; return; }
    const [principal, ...resto] = lista;
    container.innerHTML = `
      <div class="news-feature" data-reveal>
        ${card(principal)}
      </div>
      <div class="news-side" data-reveal-stagger>
        ${resto.map((n) => card(n, { compact: true })).join('')}
      </div>`;
    Anim.init(container);
  }

  /* ---------- Página de listagem ---------- */
  async function initList() {
    const grid = qs('#news-grid');
    if (!grid) return;
    const todas = await API.noticiasPublicadas();

    // Carrossel de destaques
    const destaques = todas.filter((n) => n.destaque).slice(0, 5);
    const carouselEl = qs('#news-highlights');
    if (carouselEl && destaques.length) {
      carouselEl.innerHTML = `<div class="carousel__viewport"><div class="carousel__track">
        ${destaques.map((n) => `
          <div class="carousel__slide">
            <article class="highlight">
              <img class="highlight__img" src="${asset(n.imagem)}" alt="" width="1200" height="600">
              <div class="highlight__body">
                <span class="badge badge--light">${escapeHTML(n.categoria)}</span>
                <h2 class="highlight__title"><a href="noticia.html?id=${encodeURIComponent(n.id)}">${escapeHTML(n.titulo)}</a></h2>
                <p>${escapeHTML(n.resumo)}</p>
                <time datetime="${escapeHTML(n.data)}">${formatDate(n.data)}</time>
              </div>
            </article>
          </div>`).join('')}
      </div></div>`;
      new Carousel(carouselEl, { autoplay: 7000 });
    } else if (carouselEl) carouselEl.hidden = true;

    // Filtros
    const chips = qs('#news-filters');
    const cats = [...new Set(todas.map((n) => n.categoria))];
    chips.innerHTML = ['Todas', ...cats].map((c, i) =>
      `<button type="button" class="chip${i === 0 ? ' is-active' : ''}" data-cat="${escapeHTML(c)}" aria-pressed="${i === 0}">${escapeHTML(c)}</button>`).join('');

    const search = qs('#news-search');
    const count = qs('#news-count');
    const more = qs('#news-more');
    const st = { cat: getParam('categoria') || 'Todas', q: '', page: 1 };

    function filtered() {
      const q = normalize(st.q);
      return todas.filter((n) => (st.cat === 'Todas' || n.categoria === st.cat) &&
        (!q || normalize(`${n.titulo} ${n.resumo} ${n.categoria}`).includes(q)));
    }

    function draw() {
      const list = filtered();
      const visible = list.slice(0, st.page * POR_PAGINA);
      grid.innerHTML = visible.length ? visible.map((n) => card(n)).join('')
        : `<div class="empty-state"><i class="fa-regular fa-newspaper" aria-hidden="true"></i><p>Nenhuma notícia encontrada para sua busca.</p></div>`;
      count.textContent = `${list.length} ${list.length === 1 ? 'notícia' : 'notícias'}`;
      more.hidden = visible.length >= list.length;
      Anim.tilt(grid);
    }

    qsa('.chip', chips).forEach((c) => { const on = c.dataset.cat === st.cat; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
    chips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      st.cat = chip.dataset.cat; st.page = 1;
      qsa('.chip', chips).forEach((c) => { const on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
      draw();
    });
    search.addEventListener('input', debounce(() => { st.q = search.value; st.page = 1; draw(); }, 200));
    more.addEventListener('click', () => { st.page++; draw(); });
    draw();
  }

  /* ---------- Página individual (noticia.html?id=...) ---------- */
  async function initSingle() {
    const root = qs('#article');
    if (!root) return;
    const id = getParam('id');
    const n = id ? await API.get('noticias', id) : null;

    if (!n || n.status === 'rascunho') {
      root.innerHTML = `
        <div class="empty-state empty-state--big">
          <i class="fa-regular fa-newspaper" aria-hidden="true"></i>
          <h1>Notícia não encontrada</h1>
          <p>O link pode estar incorreto ou a notícia foi removida.</p>
          <a class="btn btn--primary" href="noticias.html">Ver todas as notícias</a>
        </div>`;
      return;
    }

    document.title = `${n.titulo} | EEEFM Honório Fraga`;
    const desc = qs('meta[name="description"]');
    desc && desc.setAttribute('content', n.resumo);
    const crumb = qs('#crumb-current');
    if (crumb) crumb.textContent = n.titulo;

    const paragrafos = Array.isArray(n.conteudo) ? n.conteudo : String(n.conteudo || '').split(/\n{2,}/);
    const shareURL = location.href;

    root.innerHTML = `
      <header class="article__header" data-reveal>
        <div class="article__meta">
          <a class="badge ${catClass(n.categoria)}" href="noticias.html?categoria=${encodeURIComponent(n.categoria)}">${escapeHTML(n.categoria)}</a>
          <time datetime="${escapeHTML(n.data)}"><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${formatDate(n.data)}</time>
          <span><i class="fa-regular fa-user" aria-hidden="true"></i> ${escapeHTML(n.autor || 'Equipe da escola')}</span>
        </div>
        <h1 class="article__title">${escapeHTML(n.titulo)}</h1>
        <p class="article__lead">${escapeHTML(n.resumo)}</p>
      </header>
      <figure class="article__figure" data-reveal="zoom">
        <img src="${asset(n.imagem)}" alt="Imagem da notícia: ${escapeHTML(n.titulo)}" width="1200" height="675">
        <figcaption>Imagem ilustrativa — substitua pela foto oficial.</figcaption>
      </figure>
      <div class="article__content" data-reveal>
        ${paragrafos.map((p) => `<p>${escapeHTML(p)}</p>`).join('')}
      </div>
      <footer class="article__footer">
        <span>Compartilhar:</span>
        <a class="btn-icon" href="https://wa.me/?text=${encodeURIComponent(n.titulo + ' ' + shareURL)}" target="_blank" rel="noopener" aria-label="Compartilhar no WhatsApp"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></a>
        <a class="btn-icon" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}" target="_blank" rel="noopener" aria-label="Compartilhar no Facebook"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i></a>
        <button type="button" class="btn-icon" id="copy-link" aria-label="Copiar link da notícia"><i class="fa-solid fa-link" aria-hidden="true"></i></button>
      </footer>`;

    qs('#copy-link').addEventListener('click', async () => {
      const ok = await Utils.copyText(shareURL);
      Utils.toast(ok ? 'Link copiado.' : 'Não foi possível copiar. Copie o endereço da barra do navegador.', ok ? 'success' : 'warning');
    });

    // Notícias relacionadas
    const rel = qs('#related');
    if (rel) {
      const outras = (await API.noticiasPublicadas()).filter((x) => String(x.id) !== String(n.id));
      const mesmas = outras.filter((x) => x.categoria === n.categoria);
      const lista = [...mesmas, ...outras.filter((x) => x.categoria !== n.categoria)].slice(0, 3);
      rel.innerHTML = lista.map((x) => card(x)).join('');
    }
    Anim.init(document);
  }

  return { card, renderHome, initList, initSingle };
})();
