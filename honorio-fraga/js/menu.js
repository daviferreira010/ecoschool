/* =====================================================================
   menu.js — HEADER, MENU MOBILE, RODAPÉ E TEMA
   ---------------------------------------------------------------------
   O header e o rodapé são gerados aqui para que o menu seja editado
   em UM ÚNICO LUGAR (array NAV_ITEMS). Cada página HTML possui apenas:
     <header id="site-header"></header>  e  <footer id="site-footer"></footer>
   ===================================================================== */
const Layout = (() => {
  'use strict';
  const { qs, qsa, escapeHTML, asset } = Utils;

  // Itens do menu principal (page = valor de data-page do <body>)
  const NAV_ITEMS = [
    { href: 'index.html', label: 'Início', pages: ['home'] },
    { href: 'escola.html', label: 'A Escola', pages: ['escola', 'equipe'] },
    { href: 'ensino.html', label: 'Ensino', pages: ['ensino'] },
    { href: 'noticias.html', label: 'Notícias', pages: ['noticias', 'noticia'] },
    { href: 'eventos.html', label: 'Eventos', pages: ['eventos'] },
    { href: 'projetos.html', label: 'Projetos', pages: ['projetos'] },
    { href: 'alunos.html', label: 'Alunos', pages: ['alunos'] },
    { href: 'responsaveis.html', label: 'Responsáveis', pages: ['responsaveis'] },
    { href: 'documentos.html', label: 'Documentos', pages: ['documentos'] },
    { href: 'contato.html', label: 'Contato', pages: ['contato', 'ouvidoria'] }
  ];

  let globalListeners = false;

  function currentPage() { return document.body.dataset.page || 'home'; }

  /* ---------------- HEADER ---------------- */
  function renderHeader() {
    const el = qs('#site-header');
    if (!el) return;
    const page = currentPage();
    const c = SITE_CONFIG;
    el.className = 'site-header';
    el.innerHTML = `
      <div class="topbar">
        <div class="container topbar__inner">
          <p class="topbar__info"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHTML(c.cidade)} – ${escapeHTML(c.estado)} <span class="topbar__sep" aria-hidden="true">·</span> <span class="topbar__network">Rede Estadual de Ensino</span></p>
          <nav class="topbar__links" aria-label="Links de serviço">
            <a href="ouvidoria.html"><i class="fa-regular fa-comments" aria-hidden="true"></i> Ouvidoria</a>
            <a href="eventos.html#calendario"><i class="fa-regular fa-calendar" aria-hidden="true"></i> Calendário</a>
            <a href="login.html"><i class="fa-regular fa-user" aria-hidden="true"></i> Entrar</a>
          </nav>
        </div>
      </div>
      <div class="navbar">
        <div class="container navbar__inner">
          <a class="brand" href="index.html" aria-label="${escapeHTML(c.nome)} — página inicial">
            <img class="brand__logo" src="${asset(c.logo)}" alt="" width="46" height="46" data-fallback-label="Logo">
            <span class="brand__text">
              <span class="brand__name">EEEFM <strong>Honório Fraga</strong></span>
              <span class="brand__place">${escapeHTML(c.cidade)} – ${escapeHTML(c.uf)}</span>
            </span>
          </a>

          <nav class="nav" id="main-nav" aria-label="Menu principal">
            <div class="nav__head">
              <span class="nav__title">Menu</span>
              <button type="button" class="btn-icon nav__close" aria-label="Fechar menu"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
            </div>
            <ul class="nav__list">
              ${NAV_ITEMS.map((item) => {
                const active = item.pages.includes(page);
                return `<li><a class="nav__link${active ? ' is-active' : ''}" href="${item.href}"${active ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
              }).join('')}
            </ul>
            <div class="nav__extra">
              <a class="btn btn--accent btn--block" href="alunos.html"><i class="fa-solid fa-user-graduate" aria-hidden="true"></i> Área do Aluno</a>
              <a class="btn btn--outline btn--block" href="responsaveis.html"><i class="fa-solid fa-people-roof" aria-hidden="true"></i> Área dos Responsáveis</a>
              <a class="nav__extra-link" href="ouvidoria.html"><i class="fa-regular fa-comments" aria-hidden="true"></i> Ouvidoria / Fale Conosco</a>
              <a class="nav__extra-link" href="login.html"><i class="fa-regular fa-user" aria-hidden="true"></i> Entrar</a>
            </div>
          </nav>

          <div class="navbar__actions">
            <button type="button" class="btn-icon theme-toggle" aria-label="Alternar tema claro ou escuro" title="Alternar tema">
              <i class="fa-solid fa-moon" aria-hidden="true"></i>
            </button>
            <a class="btn btn--accent btn--sm navbar__cta" href="alunos.html"><i class="fa-solid fa-user-graduate" aria-hidden="true"></i> Área do Aluno</a>
            <button type="button" class="nav-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </div>
      <div class="scroll-progress" aria-hidden="true"><span></span></div>`;

    // fundo escuro do menu mobile
    if (!qs('.nav-backdrop')) {
      const bd = document.createElement('div');
      bd.className = 'nav-backdrop';
      document.body.appendChild(bd);
    }
    bindMenu();
    Theme.syncIcon();
  }

  /* ---------------- MENU MOBILE ---------------- */
  function bindMenu() {
    const toggle = qs('.nav-toggle');
    const nav = qs('#main-nav');
    const close = qs('.nav__close');
    const backdrop = qs('.nav-backdrop');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
      if (open) (qs('.nav__link', nav) || nav).focus();
      else if (nav.contains(document.activeElement)) toggle.focus();
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    close && close.addEventListener('click', () => setOpen(false));
    backdrop.onclick = () => setOpen(false);
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    if (!bindMenu.escBound) {
      bindMenu.escBound = true;
      document.addEventListener('keydown', (e) => {
        const t = qs('.nav-toggle');
        if (e.key === 'Escape' && t && t.getAttribute('aria-expanded') === 'true') t.click();
      });
    }

    qs('.theme-toggle').addEventListener('click', Theme.toggle);
  }

  /* ---------------- BARRA DE COMUNICADOS URGENTES ---------------- */
  async function renderAlertBar() {
    const header = qs('#site-header');
    if (!header || document.body.dataset.noAlert !== undefined) return;
    const dismissed = Utils.session.get('hf_alert_dismissed', []);
    const urgentes = (await API.comunicadosAtivos()).filter((c) => c.nivel === 'urgente' && !dismissed.includes(c.id));
    qs('.alert-bar') && qs('.alert-bar').remove();
    if (!urgentes.length) return;
    const c = urgentes[0];
    const bar = document.createElement('div');
    bar.className = 'alert-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Comunicado urgente');
    bar.innerHTML = `<div class="container alert-bar__inner">
        <span class="alert-bar__tag"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Urgente</span>
        <p><strong>${escapeHTML(c.titulo)}</strong> <span class="alert-bar__msg">${escapeHTML(c.mensagem)}</span></p>
        <button type="button" class="btn-icon btn-icon--sm" aria-label="Dispensar comunicado"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </div>`;
    header.insertAdjacentElement('afterend', bar);
    qs('button', bar).addEventListener('click', () => {
      Utils.session.set('hf_alert_dismissed', [...dismissed, c.id]);
      bar.remove();
    });
  }

  /* ---------------- RODAPÉ ---------------- */
  function renderFooter() {
    const el = qs('#site-footer');
    if (!el) return;
    const c = SITE_CONFIG;
    const ct = c.contato;
    const redes = Object.entries(c.redes).filter(([, url]) => url);
    const redesIcon = { instagram: 'fa-instagram', facebook: 'fa-facebook-f', youtube: 'fa-youtube' };
    el.className = 'site-footer';
    el.innerHTML = `
      <div class="footer__wave" aria-hidden="true"></div>
      <div class="container footer__grid">
        <div class="footer__col footer__col--brand">
          <a class="brand brand--footer" href="index.html">
            <img class="brand__logo" src="${asset(c.logo)}" alt="" width="46" height="46" data-fallback-label="Logo">
            <span class="brand__text"><span class="brand__name">EEEFM <strong>Honório Fraga</strong></span><span class="brand__place">${escapeHTML(c.cidade)} – ${escapeHTML(c.uf)}</span></span>
          </a>
          <p class="footer__about">${escapeHTML(c.nomeCompleto)}. <strong>${escapeHTML(c.lema)}</strong> Desde ${c.fundacao}.</p>
          ${redes.length ? `<div class="footer__social">${redes.map(([k, url]) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener" aria-label="${k}"><i class="fa-brands ${redesIcon[k]}" aria-hidden="true"></i></a>`).join('')}</div>`
            : '<p class="footer__hint">Redes sociais: configure em <code>js/data.js</code>.</p>'}
        </div>
        <nav class="footer__col" aria-label="Navegação do rodapé">
          <h2 class="footer__title">Navegação</h2>
          <ul class="footer__links">
            <li><a href="index.html">Início</a></li>
            <li><a href="escola.html">A escola</a></li>
            <li><a href="equipe.html">Equipe</a></li>
            <li><a href="noticias.html">Notícias</a></li>
            <li><a href="eventos.html">Eventos</a></li>
            <li><a href="projetos.html">Projetos</a></li>
            <li><a href="privacidade.html">Privacidade</a></li>
          </ul>
        </nav>
        <nav class="footer__col" aria-label="Serviços">
          <h2 class="footer__title">Serviços</h2>
          <ul class="footer__links">
            <li><a href="alunos.html">Área do Aluno</a></li>
            <li><a href="responsaveis.html">Área dos Responsáveis</a></li>
            <li><a href="documentos.html">Documentos</a></li>
            <li><a href="eventos.html#calendario">Calendário escolar</a></li>
            <li><a href="ensino.html">Ensino</a></li>
            <li><a href="ouvidoria.html">Ouvidoria</a></li>
            <li><a href="contato.html">Contato</a></li>
          </ul>
        </nav>
        <div class="footer__col">
          <h2 class="footer__title">Contato</h2>
          <ul class="footer__contact">
            <li><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>${escapeHTML(ct.endereco)}<br>${escapeHTML(c.cidade)} – ${escapeHTML(c.estado)}</span></li>
            <li><i class="fa-solid fa-phone" aria-hidden="true"></i><span>${escapeHTML(ct.telefone)}</span></li>
            <li><i class="fa-solid fa-envelope" aria-hidden="true"></i><span>${escapeHTML(ct.email)}</span></li>
            <li><i class="fa-regular fa-clock" aria-hidden="true"></i><span>${escapeHTML(ct.horario)}</span></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="container footer__bottom-inner">
          <p>© ${c.anoCopyright} ${escapeHTML(c.nome)} · ${escapeHTML(c.cidade)} – ${escapeHTML(c.estado)}</p>
          <p class="footer__legal"><a href="privacidade.html">Política de Privacidade</a> <span aria-hidden="true">·</span> <a href="ouvidoria.html">Ouvidoria</a> <span aria-hidden="true">·</span> <a href="admin.html">Painel</a></p>
        </div>
      </div>`;
  }

  /* ---------------- BOTÃO VOLTAR AO TOPO + PROGRESSO ---------------- */
  function renderBackToTop() {
    if (qs('.back-to-top')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'back-to-top';
    b.setAttribute('aria-label', 'Voltar ao topo');
    b.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth' }));
    document.body.appendChild(b);
  }

  function onScroll() {
    const y = window.scrollY;
    const header = qs('.site-header');
    header && header.classList.toggle('is-scrolled', y > 12);
    const bar = qs('.scroll-progress span');
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? Math.min(y / h, 1) : 0})`;
    }
    const top = qs('.back-to-top');
    // na home, só aparece depois do topo em tela cheia (não cobre o carrossel)
    const stage = qs('.home-stage');
    top && top.classList.toggle('is-visible', y > Math.max(600, stage ? stage.offsetHeight - window.innerHeight * 0.5 : 0));
  }

  function init() {
    renderHeader();
    renderFooter();
    renderBackToTop();
    renderAlertBar();
    if (!globalListeners) {
      globalListeners = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      // fecha o menu ao voltar para o desktop
      window.matchMedia('(min-width: 1240px)').addEventListener('change', (e) => {
        if (e.matches) {
          const nav = qs('#main-nav');
          if (nav && nav.classList.contains('is-open')) qs('.nav-toggle').click();
        }
      });
    }
    onScroll();
  }

  return { init, NAV_ITEMS };
})();

/* =====================================================================
   TEMA CLARO / ESCURO
   Sem escolha salva, segue o sistema (prefers-color-scheme).
   A escolha do usuário fica em localStorage ('hf_theme').
   ===================================================================== */
const Theme = (() => {
  const root = document.documentElement;

  function isDark() {
    const t = root.dataset.theme;
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function syncIcon() {
    const dark = isDark();
    Utils.qsa('.theme-toggle i').forEach((i) => { i.className = `fa-solid ${dark ? 'fa-sun' : 'fa-moon'}`; });
    Utils.qsa('.theme-toggle').forEach((b) => b.setAttribute('aria-pressed', String(dark)));
  }

  function set(theme) {
    root.dataset.theme = theme;
    Utils.store.set('hf_theme', theme);
    syncIcon();
    window.dispatchEvent(new CustomEvent('hf:themechange', { detail: { theme } }));
  }

  function toggle() { set(isDark() ? 'light' : 'dark'); }

  return { isDark, set, toggle, syncIcon };
})();
