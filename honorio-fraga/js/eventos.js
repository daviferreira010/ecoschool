/* =====================================================================
   eventos.js — EVENTOS ESCOLARES (home + página de eventos)
   Categorias: CATEGORIAS_EVENTO (js/data.js)
   ===================================================================== */
const Eventos = (() => {
  'use strict';
  const { qs, qsa, escapeHTML, dateParts, formatDate, normalize, debounce, todayISO } = Utils;

  const catInfo = (c) => CATEGORIAS_EVENTO[c] || { nome: 'Evento', icone: 'fa-calendar' };

  function horario(e) {
    if (!e.horaInicio) return 'Dia inteiro';
    return e.horaFim ? `${e.horaInicio} – ${e.horaFim}` : e.horaInicio;
  }

  function card(e) {
    const d = dateParts(e.data);
    const cat = catInfo(e.categoria);
    const past = e.data < todayISO();
    return `
      <article class="event-card event-card--${escapeHTML(e.categoria)}${past ? ' is-past' : ''}">
        <div class="event-card__date" aria-hidden="true">
          <span class="event-card__day">${d.dia}</span>
          <span class="event-card__month">${d.mes}</span>
        </div>
        <div class="event-card__body">
          <span class="badge badge--event-${escapeHTML(e.categoria)}"><i class="fa-solid ${cat.icone}" aria-hidden="true"></i> ${escapeHTML(cat.nome)}</span>
          <h3 class="event-card__title">${escapeHTML(e.titulo)}</h3>
          <ul class="event-card__info">
            <li><i class="fa-regular fa-calendar" aria-hidden="true"></i> <time datetime="${escapeHTML(e.data)}">${formatDate(e.data, 'weekday')}</time></li>
            <li><i class="fa-regular fa-clock" aria-hidden="true"></i> ${escapeHTML(horario(e))}</li>
            <li><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHTML(e.local || '—')}</li>
          </ul>
          <p class="event-card__desc">${escapeHTML(e.descricao)}</p>
          ${past ? '<span class="event-card__past">Realizado</span>' : `<button type="button" class="link-arrow" data-ics="${escapeHTML(e.id)}">Adicionar à agenda <i class="fa-regular fa-calendar-plus" aria-hidden="true"></i></button>`}
        </div>
      </article>`;
  }

  /* Gera um arquivo .ics (abre no Google Agenda, Outlook, celular) */
  function downloadICS(e) {
    const pad = (s) => String(s).replace(/[-:]/g, '');
    const dt = pad(e.data);
    const start = e.horaInicio ? `DTSTART:${dt}T${pad(e.horaInicio)}00` : `DTSTART;VALUE=DATE:${dt}`;
    const end = e.horaFim ? `DTEND:${dt}T${pad(e.horaFim)}00` : '';
    const esc = (s) => String(s || '').replace(/[\\;,]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//EEEFM Honorio Fraga//Site//PT-BR', 'BEGIN:VEVENT',
      `UID:evento-${e.id}@honoriofraga`, start, end, `SUMMARY:${esc(e.titulo)}`, `LOCATION:${esc(e.local)}`,
      `DESCRIPTION:${esc(e.descricao)}`, 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = `evento-${Utils.slugify(e.titulo)}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    Utils.toast('Arquivo de agenda (.ics) gerado. Abra-o para adicionar ao seu calendário.', 'success');
  }

  function bindICS(container, eventos) {
    container.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-ics]');
      if (!b) return;
      const e = eventos.find((x) => String(x.id) === b.dataset.ics);
      e && downloadICS(e);
    });
  }

  /* ---------- Home: próximos eventos ---------- */
  async function renderHome(container, limite = 3) {
    if (!container) return;
    const lista = await API.proximosEventos(limite);
    container.innerHTML = lista.length ? lista.map(card).join('') : '<p class="empty-state">Nenhum evento programado.</p>';
    container.setAttribute('data-reveal-stagger', '');
    bindICS(container, lista);
    Anim.init(container.parentElement);
  }

  /* ---------- Página de eventos ---------- */
  async function initPage() {
    const list = qs('#events-list');
    if (!list) return;
    const eventos = await API.eventosOrdenados();
    const chips = qs('#events-filters');
    chips.innerHTML = [['todas', 'Todas'], ...Object.entries(CATEGORIAS_EVENTO).map(([k, v]) => [k, v.nome])]
      .map(([k, v], i) => `<button type="button" class="chip${i === 0 ? ' is-active' : ''}" data-cat="${k}" aria-pressed="${i === 0}">${escapeHTML(v)}</button>`).join('');

    const st = { cat: 'todas', periodo: 'proximos', q: '' };
    const search = qs('#events-search');
    const periodo = qs('#events-period');
    const count = qs('#events-count');

    function draw() {
      const hoje = todayISO();
      const q = normalize(st.q);
      let l = eventos.filter((e) => (st.cat === 'todas' || e.categoria === st.cat) &&
        (st.periodo === 'todos' || (st.periodo === 'proximos' ? e.data >= hoje : e.data < hoje)) &&
        (!q || normalize(`${e.titulo} ${e.descricao} ${e.local}`).includes(q)));
      if (st.periodo === 'realizados') l = l.slice().reverse();
      list.innerHTML = l.length ? l.map(card).join('') : `<div class="empty-state"><i class="fa-regular fa-calendar-xmark" aria-hidden="true"></i><p>Nenhum evento encontrado com esses filtros.</p></div>`;
      count.textContent = `${l.length} ${l.length === 1 ? 'evento' : 'eventos'}`;
    }

    chips.addEventListener('click', (e) => {
      const c = e.target.closest('.chip');
      if (!c) return;
      st.cat = c.dataset.cat;
      qsa('.chip', chips).forEach((x) => { const on = x === c; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
      draw();
    });
    search.addEventListener('input', debounce(() => { st.q = search.value; draw(); }, 200));
    periodo.addEventListener('change', () => { st.periodo = periodo.value; draw(); });
    bindICS(list, eventos);
    draw();

    // Abas Lista / Calendário
    Tabs.init(qs('#events-tabs'));
    if (location.hash === '#calendario' || (window.Router && window.Router.anchor === 'calendario')) Tabs.select(qs('#events-tabs'), 'tab-calendario');
    Calendario.init(qs('#calendar'), eventos);
  }

  return { card, renderHome, initPage, horario, catInfo };
})();

/* =====================================================================
   ABAS acessíveis (role="tablist") — usadas em várias páginas
   Estrutura: [role=tablist] > [role=tab][aria-controls=painel]
   ===================================================================== */
const Tabs = (() => {
  function select(root, tabId) {
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    tabs.forEach((t) => {
      const on = t.id === tabId;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (typeof Anim !== 'undefined') Anim.refresh();
  }

  function init(root) {
    if (!root || root.dataset.tabsReady) return;
    root.dataset.tabsReady = 'true';
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    root.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t) select(root, t.id); });
    root.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); tabs[n].focus(); select(root, tabs[n].id); }
    });
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    current && select(root, current.id);
  }

  return { init, select };
})();
