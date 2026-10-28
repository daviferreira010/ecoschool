/* =====================================================================
   main.js — INICIALIZAÇÃO DO SITE
   ---------------------------------------------------------------------
   1. Monta header, rodapé e utilidades globais (menu.js)
   2. Preenche campos [data-config] com dados de SITE_CONFIG
   3. Chama a função da página atual, conforme <body data-page="...">
   ===================================================================== */
const App = (() => {
  'use strict';

  const ROUTES = {
    home: () => Pages.home(),
    escola: () => Pages.escola(),
    equipe: () => Pages.equipe(),
    noticias: () => Noticias.initList(),
    noticia: () => Noticias.initSingle(),
    eventos: () => Eventos.initPage(),
    projetos: () => Pages.projetos(),
    ensino: () => Pages.ensino(),
    alunos: () => Pages.alunos(),
    responsaveis: () => Pages.responsaveis(),
    documentos: () => Pages.documentos(),
    contato: () => Pages.contato(),
    ouvidoria: () => Pages.ouvidoria(),
    login: () => Auth.initLoginPage(),
    admin: () => Admin.init(),
    privacidade: () => {}
  };

  /* Preenche <span data-config="contato.email"></span> com SITE_CONFIG.contato.email */
  function fillConfig(root = document) {
    Utils.qsa('[data-config]', root).forEach((el) => {
      const value = el.dataset.config.split('.').reduce((o, k) => (o ? o[k] : undefined), SITE_CONFIG);
      if (value !== undefined && value !== null && value !== '') el.textContent = value;
    });
    Utils.qsa('[data-asset]', root).forEach((el) => {
      const path = el.dataset.asset;
      if (el.tagName === 'IMG') el.src = Utils.asset(path);
      else el.style.backgroundImage = `url("${Utils.asset(path)}")`;
    });
  }

  async function start() {
    Utils.initImageFallback();
    const page = document.body.dataset.page || 'home';
    if (page !== 'admin') Layout.init();
    fillConfig();
    try {
      await (ROUTES[page] || (() => {}))();
    } catch (err) {
      console.error('[App] Erro ao iniciar a página:', err);
      Utils.toast('Ocorreu um erro ao carregar parte desta página.', 'error');
    }
    if (page !== 'home') Anim.init(document);
    document.documentElement.classList.add('is-loaded');
  }

  // Usado pela prévia em arquivo único ao trocar de página
  function teardown() {
    Anim.teardown();
    if (typeof Hero3D !== 'undefined') Hero3D.destroy();
    Utils.Modal.close(true);
    if (typeof Lightbox !== 'undefined') Lightbox.close();
    document.body.classList.remove('no-scroll');
  }

  if (!window.HF_PREVIEW) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }

  return { start, teardown, fillConfig };
})();
