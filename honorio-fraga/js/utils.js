/* =====================================================================
   utils.js — funções utilitárias usadas em todo o site
   - Seletores, escape/sanitização de texto, datas
   - Armazenamento seguro (localStorage com try/catch)
   - Toasts (notificações), modal, diálogo de confirmação
   - Fallback de imagens quebradas
   ===================================================================== */
const Utils = (() => {
  'use strict';

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Segurança: escape e sanitização ----------
     Sempre que um texto vindo de dados/formulários for colocado no HTML,
     passe por escapeHTML(). Isso evita XSS (injeção de scripts).
     ⚠️ O backend também deve validar e sanitizar TUDO que receber. */
  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Remove caracteres de controle, espaços extras e limita o tamanho
  function sanitizeText(value, maxLength = 5000) {
    return String(value ?? '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .trim()
      .slice(0, maxLength);
  }

  // Aceita somente caminhos relativos do projeto, http(s) ou data:image
  function safeURL(url) {
    const u = String(url ?? '').trim();
    if (!u) return '';
    if (/^(https?:)?\/\//i.test(u) || /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(u)) return u;
    if (/^[a-z]+:/i.test(u)) return ''; // bloqueia javascript:, vbscript: etc.
    return u;
  }

  /* ---------- Caminhos de arquivos ----------
     Na prévia em arquivo único (preview/index.html) as imagens ficam
     embutidas; ASSET_MAP traduz o caminho para o conteúdo embutido. */
  function asset(path) {
    const p = safeURL(path);
    if (window.ASSET_MAP && window.ASSET_MAP[p]) return window.ASSET_MAP[p];
    return p;
  }

  /* ---------- Datas ----------
     Datas são guardadas como 'AAAA-MM-DD'. Criamos o Date no fuso local
     para evitar que o dia "volte" por causa do fuso horário. */
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const DIAS_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  function parseDate(iso) {
    if (!iso) return null;
    const [y, m, d] = String(iso).split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }

  function toISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const todayISO = () => toISO(new Date());

  function formatDate(iso, style = 'long') {
    const dt = parseDate(iso);
    if (!dt) return '—';
    if (style === 'short') return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
    if (style === 'weekday') return `${DIAS_SEMANA[dt.getDay()]}, ${dt.getDate()} de ${MESES[dt.getMonth()]}`;
    return `${dt.getDate()} de ${MESES[dt.getMonth()]} de ${dt.getFullYear()}`;
  }

  function dateParts(iso) {
    const dt = parseDate(iso);
    if (!dt) return { dia: '--', mes: '---', ano: '' };
    return { dia: String(dt.getDate()).padStart(2, '0'), mes: MESES_CURTOS[dt.getMonth()], ano: dt.getFullYear() };
  }

  /* ---------- Parâmetros da URL ----------
     Funciona no site normal (?id=3) e na prévia em arquivo único. */
  function getParam(name) {
    if (window.HF_PREVIEW && window.Router) return window.Router.params[name] ?? null;
    return new URLSearchParams(location.search).get(name);
  }

  // Navega para outra página (na prévia, troca a "rota")
  function go(url) {
    if (window.HF_PREVIEW && window.Router) { window.Router.navigate(url); return; }
    location.href = url;
  }

  /* ---------- Armazenamento local (protegido) ----------
     localStorage pode falhar (modo privado, bloqueio). Por isso sempre
     usamos try/catch. ⚠️ Nunca guarde senhas ou dados sensíveis aqui. */
  const store = {
    get(key, fallback = null) {
      try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { return false; }
    },
    remove(key) { try { localStorage.removeItem(key); } catch { /* ignora */ } }
  };

  const session = {
    get(key, fallback = null) {
      try { const raw = sessionStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
      catch { return fallback; }
    },
    set(key, value) { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* ignora */ } }
  };

  function debounce(fn, wait = 250) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  }

  // Normaliza texto para busca (sem acento, minúsculo)
  const normalize = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* ---------- Validação ---------- */
  const validators = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
    phone: (v) => v.replace(/\D/g, '').length >= 10 && v.replace(/\D/g, '').length <= 13
  };

  // Máscara simples de telefone brasileiro: (00) 00000-0000
  function maskPhone(value) {
    const d = value.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  /* ---------- Fallback de imagens ----------
     Se uma imagem não existir, é trocada por um placeholder em SVG
     com o texto "Imagem indisponível". O site continua funcionando. */
  function placeholderSVG(label = 'Imagem indisponível') {
    const text = escapeHTML(label);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#052b66"/><stop offset="1" stop-color="#186be7"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><g fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="10"><rect x="330" y="170" width="140" height="110" rx="12"/><circle cx="370" cy="205" r="14"/><path d="M340 270l45-45 30 30 20-20 25 35"/></g><text x="400" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" fill="#ffffff" fill-opacity=".85">${text}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function initImageFallback() {
    if (initImageFallback.done) return;
    initImageFallback.done = true;
    document.addEventListener('error', (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = 'true';
      img.src = placeholderSVG(img.dataset.fallbackLabel || 'Imagem indisponível');
      img.classList.add('img-fallback');
    }, true);
  }

  /* ---------- Toasts (sistema de notificações) ---------- */
  function toast(message, type = 'info', timeout = 4500) {
    let stack = qs('#toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'toast-stack';
      stack.className = 'toast-stack';
      stack.setAttribute('aria-live', 'polite');
      stack.setAttribute('aria-atomic', 'false');
      document.body.appendChild(stack);
    }
    const icons = { info: 'fa-circle-info', success: 'fa-circle-check', warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark' };
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}" aria-hidden="true"></i><p>${escapeHTML(message)}</p><button type="button" class="toast__close" aria-label="Fechar notificação"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`;
    stack.appendChild(el);
    const remove = () => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 250); };
    el.querySelector('.toast__close').addEventListener('click', remove);
    if (timeout) setTimeout(remove, timeout);
  }

  /* ---------- Modal genérico (acessível) ----------
     Modal.open({ title, html, size }) — fecha com ESC, botão ou fundo.
     O foco fica preso dentro do modal enquanto ele estiver aberto. */
  const Modal = (() => {
    let lastFocus = null;
    let current = null;

    function trap(e) {
      if (!current) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const focusables = qsa('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', current)
        .filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function open({ title = '', html = '', size = 'md', onOpen } = {}) {
      close(true);
      lastFocus = document.activeElement;
      const wrap = document.createElement('div');
      wrap.className = 'modal';
      wrap.innerHTML = `
        <div class="modal__backdrop" data-modal-close></div>
        <div class="modal__dialog modal__dialog--${size}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <header class="modal__header">
            <h2 class="modal__title" id="modal-title">${escapeHTML(title)}</h2>
            <button type="button" class="btn-icon" data-modal-close aria-label="Fechar janela"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
          </header>
          <div class="modal__body">${html}</div>
        </div>`;
      document.body.appendChild(wrap);
      document.body.classList.add('no-scroll');
      current = wrap;
      requestAnimationFrame(() => wrap.classList.add('is-open'));
      wrap.addEventListener('click', (e) => { if (e.target.closest('[data-modal-close]')) close(); });
      document.addEventListener('keydown', trap);
      const focusTarget = qs('.modal__body [autofocus]', wrap) || qs('.modal__dialog button', wrap);
      focusTarget && focusTarget.focus();
      onOpen && onOpen(qs('.modal__body', wrap));
      return wrap;
    }

    function close(immediate = false) {
      if (!current) return;
      const el = current;
      current = null;
      document.removeEventListener('keydown', trap);
      document.body.classList.remove('no-scroll');
      el.classList.remove('is-open');
      setTimeout(() => el.remove(), immediate ? 0 : 200);
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    }

    return { open, close, isOpen: () => !!current };
  })();

  /* Diálogo de confirmação próprio (em vez de window.confirm) */
  function confirmDialog(message, { confirmText = 'Confirmar', danger = false } = {}) {
    return new Promise((resolve) => {
      let answered = false;
      const done = (v) => { if (answered) return; answered = true; resolve(v); Modal.close(); };
      Modal.open({
        title: 'Confirmação',
        size: 'sm',
        html: `<p>${escapeHTML(message)}</p>
          <div class="modal__actions">
            <button type="button" class="btn btn--ghost" data-answer="no">Cancelar</button>
            <button type="button" class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-answer="yes" autofocus>${escapeHTML(confirmText)}</button>
          </div>`,
        onOpen(body) {
          body.addEventListener('click', (e) => {
            const b = e.target.closest('[data-answer]');
            if (b) done(b.dataset.answer === 'yes');
          });
          // fechar pelo X ou fundo conta como "não"
          body.closest('.modal').addEventListener('click', (e) => { if (e.target.closest('[data-modal-close]')) { if (!answered) { answered = true; resolve(false); } } });
        }
      });
    });
  }

  /* Copiar texto para a área de transferência (com fallback) */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove(); return ok;
    }
  }

  // Remove acentos e espaços para criar identificadores simples
  const slugify = (s) => normalize(s).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const isPlaceholder = (s) => /^\[.*\]$/.test(String(s ?? '').trim());

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    qs, qsa, escapeHTML, sanitizeText, safeURL, asset, parseDate, toISO, todayISO,
    formatDate, dateParts, getParam, go, store, session, debounce, normalize,
    validators, maskPhone, placeholderSVG, initImageFallback, toast, Modal,
    confirmDialog, copyText, slugify, isPlaceholder, prefersReducedMotion,
    MESES, DIAS_SEMANA
  };
})();
