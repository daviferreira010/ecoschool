/* =====================================================================
   calendario.js — CALENDÁRIO ESCOLAR MENSAL
   ---------------------------------------------------------------------
   Calendario.init(container, eventos)
   - Navegação entre meses, botão "Hoje"
   - Legenda que funciona como filtro (eventos, provas, reuniões,
     feriados, atividades)
   - Ao clicar em um dia, lista os eventos daquele dia
   FUTURO: os eventos virão de GET /api/eventos?mes=AAAA-MM
   ===================================================================== */
const Calendario = (() => {
  'use strict';
  const { escapeHTML, toISO, todayISO, formatDate, MESES } = Utils;
  const SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  function init(container, eventos) {
    if (!container) return;
    const hoje = new Date();
    const st = {
      ano: hoje.getFullYear(),
      mes: hoje.getMonth(),
      selecionado: todayISO(),
      tipos: new Set(Object.keys(TIPOS_CALENDARIO))
    };

    container.innerHTML = `
      <div class="calendar">
        <div class="calendar__main">
          <div class="calendar__toolbar">
            <button type="button" class="btn-icon" data-nav="-1" aria-label="Mês anterior"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
            <h3 class="calendar__month" aria-live="polite"></h3>
            <button type="button" class="btn-icon" data-nav="1" aria-label="Próximo mês"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
            <button type="button" class="btn btn--ghost btn--sm" data-nav="0">Hoje</button>
          </div>
          <div class="calendar__legend" role="group" aria-label="Filtrar tipos no calendário">
            ${Object.entries(TIPOS_CALENDARIO).map(([k, v]) => `
              <button type="button" class="legend-item legend-item--${k}" data-tipo="${k}" aria-pressed="true">
                <span class="legend-item__dot" aria-hidden="true"></span>${escapeHTML(v.nome)}
              </button>`).join('')}
          </div>
          <div class="calendar__grid" role="grid" aria-label="Dias do mês">
            <div class="calendar__weekdays" role="row">${SEMANA.map((d) => `<span role="columnheader">${d}</span>`).join('')}</div>
            <div class="calendar__days"></div>
          </div>
        </div>
        <aside class="calendar__panel" aria-live="polite">
          <h3 class="calendar__panel-title"></h3>
          <ul class="calendar__panel-list"></ul>
        </aside>
      </div>`;

    const monthEl = container.querySelector('.calendar__month');
    const daysEl = container.querySelector('.calendar__days');
    const panelTitle = container.querySelector('.calendar__panel-title');
    const panelList = container.querySelector('.calendar__panel-list');

    const doDia = (iso) => eventos.filter((e) => e.data === iso && st.tipos.has(e.tipo || 'evento'));

    function drawMonth() {
      monthEl.textContent = `${MESES[st.mes].charAt(0).toUpperCase() + MESES[st.mes].slice(1)} de ${st.ano}`;
      const first = new Date(st.ano, st.mes, 1);
      const diasNoMes = new Date(st.ano, st.mes + 1, 0).getDate();
      const hojeISO = todayISO();
      let html = '';
      for (let i = 0; i < first.getDay(); i++) html += '<span class="calendar__day is-empty" aria-hidden="true"></span>';
      for (let d = 1; d <= diasNoMes; d++) {
        const iso = toISO(new Date(st.ano, st.mes, d));
        const evs = doDia(iso);
        const tipos = [...new Set(evs.map((e) => e.tipo || 'evento'))];
        const label = `${d} de ${MESES[st.mes]}${evs.length ? `, ${evs.length} ${evs.length === 1 ? 'evento' : 'eventos'}` : ''}`;
        html += `<button type="button" class="calendar__day${iso === hojeISO ? ' is-today' : ''}${iso === st.selecionado ? ' is-selected' : ''}${evs.length ? ' has-events' : ''}${tipos.includes('feriado') ? ' is-holiday' : ''}" data-date="${iso}" aria-label="${label}" aria-pressed="${iso === st.selecionado}">
          <span class="calendar__num">${d}</span>
          <span class="calendar__dots" aria-hidden="true">${tipos.map((t) => `<i class="dot dot--${t}"></i>`).join('')}</span>
          ${evs[0] ? `<span class="calendar__label">${escapeHTML(evs[0].titulo.replace(/^\[DEMO\]\s*/, ''))}</span>` : ''}
        </button>`;
      }
      daysEl.innerHTML = html;
    }

    function drawPanel() {
      const evs = doDia(st.selecionado);
      const titulo = formatDate(st.selecionado, 'weekday');
      panelTitle.textContent = titulo.charAt(0).toUpperCase() + titulo.slice(1);
      if (!evs.length) {
        // mostra os próximos do mês quando o dia está vazio
        const prox = eventos.filter((e) => e.data > st.selecionado && st.tipos.has(e.tipo || 'evento')).slice(0, 3);
        panelList.innerHTML = `<li class="calendar__empty">Nenhum evento neste dia.</li>${prox.length ? `<li class="calendar__next-label">Próximos:</li>${prox.map(item).join('')}` : ''}`;
        return;
      }
      panelList.innerHTML = evs.map(item).join('');
    }

    function item(e) {
      const tipo = TIPOS_CALENDARIO[e.tipo] || TIPOS_CALENDARIO.evento;
      return `<li class="cal-item cal-item--${escapeHTML(e.tipo || 'evento')}">
        <span class="cal-item__icon"><i class="fa-solid ${tipo.icone}" aria-hidden="true"></i></span>
        <div><strong>${escapeHTML(e.titulo)}</strong>
        <small>${formatDate(e.data, 'short')} · ${escapeHTML(Eventos.horario(e))}${e.local && e.local !== '—' ? ' · ' + escapeHTML(e.local) : ''}</small>
        <small class="cal-item__type">${escapeHTML(tipo.nome)}</small></div>
      </li>`;
    }

    container.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav]');
      if (nav) {
        const n = Number(nav.dataset.nav);
        if (n === 0) { const t = new Date(); st.ano = t.getFullYear(); st.mes = t.getMonth(); st.selecionado = todayISO(); }
        else {
          const d = new Date(st.ano, st.mes + n, 1);
          st.ano = d.getFullYear(); st.mes = d.getMonth();
        }
        drawMonth(); drawPanel();
        return;
      }
      const day = e.target.closest('.calendar__day[data-date]');
      if (day) { st.selecionado = day.dataset.date; drawMonth(); drawPanel(); container.querySelector(`[data-date="${st.selecionado}"]`).focus(); return; }
      const leg = e.target.closest('[data-tipo]');
      if (leg) {
        const t = leg.dataset.tipo;
        if (st.tipos.has(t)) st.tipos.delete(t); else st.tipos.add(t);
        leg.setAttribute('aria-pressed', String(st.tipos.has(t)));
        drawMonth(); drawPanel();
      }
    });

    drawMonth(); drawPanel();
  }

  return { init };
})();
