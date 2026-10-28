#!/usr/bin/env node
/* =====================================================================
   build-preview.js — GERA A PRÉVIA EM ARQUIVO ÚNICO (preview/index.html)
   ---------------------------------------------------------------------
   Junta TODAS as páginas, CSS, JavaScript e imagens em um único HTML,
   que pode ser aberto direto no celular (sem servidor).
   As páginas viram "rotas" (#noticias, #noticia-3, #eventos-calendario).

   Uso (na pasta honorio-fraga/):
     node tools/build-preview.js
   Opcional — versão sem <html>/<head>, usada para publicação como Artifact:
     node tools/build-preview.js --fragment caminho/saida.html

   Rode novamente sempre que alterar o site.
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const fragIdx = args.indexOf('--fragment');
const FRAGMENT = fragIdx !== -1;
const OUT = FRAGMENT ? path.resolve(args[fragIdx + 1]) : path.join(ROOT, 'preview', 'index.html');

const PAGES = ['index', 'escola', 'equipe', 'noticias', 'noticia', 'eventos', 'projetos', 'ensino', 'alunos',
  'responsaveis', 'documentos', 'contato', 'ouvidoria', 'login', 'admin', 'privacidade'];
const CSS = ['style', 'header', 'footer', 'home', 'noticias', 'eventos', 'forms', 'admin', 'responsive'];
const JS = ['data', 'utils', 'api', 'menu', 'animations', 'forms', 'galeria', 'noticias', 'eventos', 'calendario',
  'auth', 'pages', 'admin', 'hero3d', 'main'];

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.pdf': 'application/pdf' };

/* ---------- 1. Imagens e documentos -> data URI ---------- */
const assetMap = {};
for (const dir of ['assets/images', 'assets/icons', 'assets/documentos']) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)) {
    const ext = path.extname(f).toLowerCase();
    if (!MIME[ext]) continue;
    const rel = `${dir}/${f}`;
    assetMap[rel] = `data:${MIME[ext]};base64,${fs.readFileSync(path.join(abs, f)).toString('base64')}`;
  }
}
const replaceAssets = (html) => html.replace(/assets\/(images|icons|documentos)\/[A-Za-z0-9._-]+/g, (m) => assetMap[m] || m);

/* ---------- 2. Páginas -> <template> ---------- */
const templates = PAGES.map((name) => {
  const html = read(`${name}.html`);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1];
  const bodyTag = html.match(/<body([^>]*)>/)[1];
  const page = (bodyTag.match(/data-page="([^"]+)"/) || [, 'home'])[1];
  const cls = (bodyTag.match(/class="([^"]+)"/) || [, ''])[1];
  const noAlert = /data-no-alert/.test(bodyTag);
  let body = html.split(/<body[^>]*>/)[1].split('<!-- scripts -->')[0];
  body = body.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  return `<template id="tpl-${page}" data-title="${title.replace(/"/g, '&quot;')}" data-body-class="${cls}" data-no-alert="${noAlert ? 1 : 0}">${replaceAssets(body)}</template>`;
}).join('\n');

/* ---------- 3. CSS e JS ---------- */
const css = CSS.map((c) => `/* ==== css/${c}.css ==== */\n${read(`css/${c}.css`)}`).join('\n');
const js = JS.map((j) => `/* ==== js/${j}.js ==== */\n${read(`js/${j}.js`)}`).join('\n;\n');

/* ---------- 4. Roteador da prévia ---------- */
const router = `
(function () {
  'use strict';
  // PDFs viram blob: (navegadores bloqueiam abrir data: em nova aba)
  Object.keys(window.ASSET_MAP).forEach(function (k) {
    if (!/\\.pdf$/.test(k)) return;
    try {
      var b64 = window.ASSET_MAP[k].split(',')[1], bin = atob(b64), arr = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      window.ASSET_MAP[k] = URL.createObjectURL(new Blob([arr], { type: 'application/pdf' }));
    } catch (e) { /* mantém data: */ }
  });

  var app = document.getElementById('app');
  var Router = window.Router = { params: {}, anchor: null };

  // 'noticia.html?id=3#x' -> { page, query, anchor }
  function parse(href) {
    var m = /^(?:\\.\\/)?([a-z]+)\\.html(\\?[^#]*)?(?:#(.*))?$/i.exec(href || '');
    if (!m) return null;
    return { page: m[1] === 'index' ? 'home' : m[1], query: new URLSearchParams(m[2] || ''), anchor: m[3] || '' };
  }

  // Rotas usam só letras, números e hífen: #noticia-3, #eventos-calendario, #login-admin
  function toHash(r) {
    var extra = r.page === 'noticia' ? r.query.get('id') : r.page === 'login' ? r.query.get('perfil') : r.anchor;
    return r.page + (extra ? '-' + String(extra).replace(/[^A-Za-z0-9-]/g, '') : '');
  }

  function mount() {
    var h = decodeURIComponent(location.hash.slice(1));
    var i = h.indexOf('-');
    var page = i === -1 ? h : h.slice(0, i);
    var rest = i === -1 ? '' : h.slice(i + 1);
    var tpl = document.getElementById('tpl-' + page);
    if (!tpl) { page = 'home'; rest = ''; tpl = document.getElementById('tpl-home'); }
    Router.params = {};
    Router.anchor = null;
    if (page === 'noticia') Router.params.id = rest;
    else if (page === 'login' && rest) { Router.params.perfil = rest; if (rest === 'admin') Router.params.next = 'admin.html'; }
    else if (rest) Router.anchor = rest;

    App.teardown();
    app.innerHTML = tpl.innerHTML;
    document.body.dataset.page = page;
    document.body.className = tpl.dataset.bodyClass || '';
    if (tpl.dataset.noAlert === '1') document.body.setAttribute('data-no-alert', ''); else document.body.removeAttribute('data-no-alert');
    document.title = tpl.dataset.title;
    window.scrollTo(0, 0);
    Promise.resolve(App.start()).then(function () {
      if (!Router.anchor) return;
      setTimeout(function () {
        var el = document.getElementById(Router.anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
    });
  }

  Router.navigate = function (url) {
    var r = parse(url);
    if (!r) { location.href = url; return; }
    var h = toHash(r);
    if (location.hash.slice(1) === h) mount(); else location.hash = h;
  };

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (href.charAt(0) === '#') {           // âncora na mesma página
      e.preventDefault();
      var el = href.length > 1 && document.getElementById(href.slice(1));
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (el.tabIndex >= 0 || el.id === 'conteudo') el.focus({ preventScroll: true }); }
      return;
    }
    if (parse(href)) { e.preventDefault(); Router.navigate(href); }
  });

  window.addEventListener('hashchange', mount);
  mount();
})();`;

/* ---------- 5. Montagem ---------- */
const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap';
// No modo fragmento usamos o Font Awesome em JS (substitui os <i> por SVG)
const ICONS = FRAGMENT
  ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js"></script>'
  : '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">';
const THEME_INIT = "<script>try{var t=JSON.parse(localStorage.getItem('hf_theme'));if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}</script>";
const LIBS = ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'].map((u) => `<script src="${u}"></script>`).join('\n');

// Ícones SVG do Font Awesome dimensionados como a fonte
const FA_SVG_CSS = FRAGMENT ? '\n.svg-inline--fa{height:1em;width:auto;overflow:visible;vertical-align:-.125em;display:inline-block}' : '';

const headInner = `<title>EEEFM Honório Fraga</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Prévia do site institucional da EEEFM Honório Fraga — Colatina, ES.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
${ICONS}
${THEME_INIT}
<style>
${css}${FA_SVG_CSS}
</style>`;

const bodyInner = `<div id="app"></div>
${templates}
<script>window.HF_PREVIEW = true; window.ASSET_MAP = ${JSON.stringify(assetMap)};</script>
${LIBS}
<script>
${js}
</script>
<script>${router}</script>`;

const out = FRAGMENT
  ? `${headInner}\n${bodyInner}\n`
  : `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${headInner}
</head>
<body data-page="home">
<!-- PRÉVIA GERADA AUTOMATICAMENTE por tools/build-preview.js — não edite este arquivo; edite o projeto e gere de novo. -->
${bodyInner}
</body>
</html>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log(`Prévia gerada: ${path.relative(process.cwd(), OUT)} (${(out.length / 1024).toFixed(0)} KB)`);
