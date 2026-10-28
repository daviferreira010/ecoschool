/* =====================================================================
   pages.js — LÓGICA DE CADA PÁGINA
   Cada função é chamada por main.js conforme o data-page do <body>.
   ===================================================================== */
const Pages = (() => {
  'use strict';
  const { qs, qsa, escapeHTML, asset, formatDate, dateParts, normalize, debounce } = Utils;

  const nivelInfo = {
    urgente: { nome: 'Urgente', icone: 'fa-triangle-exclamation' },
    importante: { nome: 'Importante', icone: 'fa-circle-exclamation' },
    normal: { nome: 'Normal', icone: 'fa-circle-info' }
  };

  function comunicadoItem(c) {
    const n = nivelInfo[c.nivel] || nivelInfo.normal;
    return `<li class="notice-item notice-item--${escapeHTML(c.nivel)}">
      <span class="notice-item__icon"><i class="fa-solid ${n.icone}" aria-hidden="true"></i></span>
      <div class="notice-item__body">
        <div class="notice-item__meta"><span class="pill pill--${escapeHTML(c.nivel)}">${n.nome}</span><time datetime="${escapeHTML(c.data)}">${formatDate(c.data, 'short')}</time></div>
        <h3>${escapeHTML(c.titulo)}</h3>
        <p>${escapeHTML(c.mensagem)}</p>
      </div>
    </li>`;
  }

  async function renderComunicados(container, publico, limite = 0) {
    if (!container) return;
    let l = await API.comunicadosAtivos(publico);
    if (limite) l = l.slice(0, limite);
    container.innerHTML = l.length ? l.map(comunicadoItem).join('') : '<li class="empty-state">Nenhum comunicado no momento.</li>';
  }

  /* =================== HOME =================== */
  async function home() {
    // Números da escola
    const stats = qs('#stats-grid');
    if (stats) {
      stats.innerHTML = SITE_CONFIG.numeros.map((n) => `
        <li class="stat">
          <span class="stat__icon"><i class="fa-solid ${n.icone}" aria-hidden="true"></i></span>
          <span class="stat__value">${n.valor === null ? '<span class="stat__placeholder">000</span>' : `<span data-count="${Number(n.valor)}">0</span>`}<span class="stat__suffix">${escapeHTML(n.sufixo || '')}</span></span>
          <span class="stat__label">${escapeHTML(n.rotulo)}</span>
        </li>`).join('');
    }

    // Carrossel de notícias do hero ("Acontece na escola")
    const heroNews = qs('#hero-news');
    if (heroNews) {
      const lista = (await API.noticiasPublicadas()).slice(0, 5);
      if (lista.length) {
        heroNews.innerHTML = `<div class="carousel__viewport"><div class="carousel__track">${lista.map((n) => {
          const url = `noticia.html?id=${encodeURIComponent(n.id)}`;
          return `<div class="carousel__slide">
            <article class="hero-news__slide">
              <a class="hero-news__media" href="${url}" tabindex="-1" aria-hidden="true">
                <img src="${asset(n.imagem)}" alt="" width="800" height="500">
                <span class="badge badge--light">${escapeHTML(n.categoria)}</span>
              </a>
              <div class="hero-news__body">
                <time datetime="${escapeHTML(n.data)}"><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${formatDate(n.data)}</time>
                <h2 class="hero-news__title"><a href="${url}">${escapeHTML(n.titulo)}</a></h2>
                <p class="hero-news__excerpt">${escapeHTML(n.resumo)}</p>
                <a class="hero-news__more" href="${url}" aria-label="Leia mais: ${escapeHTML(n.titulo)}">Leia mais <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
              </div>
            </article>
          </div>`;
        }).join('')}</div></div>`;
        new Carousel(heroNews, { autoplay: 5500 });
      } else {
        heroNews.closest('.hero-news').hidden = true;
      }
    }

    // Cartões do hero: próximo evento e comunicado
    const stack = qs('#hero-stack');
    if (stack) {
      const [ev] = await API.proximosEventos(1);
      const [com] = await API.comunicadosAtivos();
      const d = ev ? dateParts(ev.data) : null;
      stack.innerHTML = `
        ${ev ? `<a class="hero-stack__card hero-stack__card--event" href="eventos.html">
          <span class="hero-stack__date"><b>${d.dia}</b>${d.mes}</span>
          <span><small>Próximo evento</small><strong>${escapeHTML(ev.titulo)}</strong><em>${escapeHTML(Eventos.horario(ev))}</em></span></a>` : ''}
        ${com ? `<a class="hero-stack__card hero-stack__card--notice" href="#comunicados">
          <span class="hero-stack__icon hero-stack__icon--${escapeHTML(com.nivel)}"><i class="fa-solid fa-bullhorn" aria-hidden="true"></i></span>
          <span><small>Comunicado · ${escapeHTML(nivelInfo[com.nivel]?.nome || '')}</small><strong>${escapeHTML(com.titulo)}</strong></span></a>` : ''}`;
    }

    await Promise.all([
      Noticias.renderHome(qs('#home-news'), 4),
      Eventos.renderHome(qs('#home-events'), 3),
      renderComunicados(qs('#home-comunicados'), undefined, 4),
      Galeria.render(qs('#home-gallery'), { limite: 6, filtros: false })
    ]);

    // Carrossel de projetos
    const pc = qs('#home-projects');
    if (pc) {
      const projetos = await API.list('projetos');
      pc.innerHTML = `<div class="carousel__viewport"><div class="carousel__track">${projetos.map((p) => `
        <div class="carousel__slide">
          <article class="project-card" data-tilt="5">
            <div class="project-card__media"><img src="${asset(p.imagem)}" alt="" loading="lazy" width="800" height="500"><span class="badge badge--light">${escapeHTML(p.area || 'Projeto')}</span></div>
            <div class="project-card__body">
              <h3>${escapeHTML(p.nome)}</h3>
              <p>${escapeHTML(p.descricao)}</p>
              <a class="link-arrow" href="projetos.html#projeto-${encodeURIComponent(p.id)}">Conhecer projeto <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
            </div>
          </article>
        </div>`).join('')}</div></div>`;
      new Carousel(pc, { autoplay: 6500 });
    }

    Hero3D.init(qs('#hero-3d'));
    Anim.init(document);
    Anim.heroIntro();
  }

  /* =================== A ESCOLA =================== */
  async function escola() {
    await Galeria.render(qs('#escola-galeria'), { filtros: true });
  }

  /* =================== EQUIPE =================== */
  function equipe() {
    const root = qs('#team');
    if (!root) return;
    const initials = (nome) => Utils.isPlaceholder(nome) ? '?' : nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
    root.innerHTML = EQUIPE.map((g) => `
      <section class="team-group" aria-labelledby="team-${Utils.slugify(g.grupo)}">
        <h2 class="team-group__title" id="team-${Utils.slugify(g.grupo)}">${escapeHTML(g.grupo)}</h2>
        <ul class="team-grid" data-reveal-stagger>
          ${g.membros.map((m) => `
            <li class="person" data-tilt="6">
              <div class="person__photo">${m.foto ? `<img src="${asset(m.foto)}" alt="Foto de ${escapeHTML(m.nome)}" loading="lazy" width="200" height="200">` : `<span aria-hidden="true">${escapeHTML(initials(m.nome))}</span>`}</div>
              <h3 class="person__name">${escapeHTML(m.nome)}</h3>
              <p class="person__role">${escapeHTML(m.cargo)}</p>
            </li>`).join('')}
        </ul>
      </section>`).join('');
    Anim.init(root);
  }

  /* =================== ENSINO =================== */
  function ensino() {
    const e = ENSINO;
    const set = (id, html) => { const el = qs(id); if (el) el.innerHTML = html; };
    set('#ensino-modalidades', e.modalidades.map((m) => `
      <article class="card card--feature" data-tilt="5">
        <span class="card__icon"><i class="fa-solid ${m.icone}" aria-hidden="true"></i></span>
        <h3>${escapeHTML(m.titulo)}</h3>
        <p>${escapeHTML(m.descricao)}</p>
        <span class="badge badge--soft"><i class="fa-regular fa-clock" aria-hidden="true"></i> ${escapeHTML(m.turno)}</span>
      </article>`).join(''));
    set('#ensino-cursos', e.cursos.map((c) => `<article class="card"><h3><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> ${escapeHTML(c.titulo)}</h3><p>${escapeHTML(c.descricao)}</p></article>`).join(''));
    set('#ensino-componentes', e.componentes.map((c) => `
      <article class="area-card">
        <header><span class="card__icon card__icon--sm"><i class="fa-solid ${c.icone}" aria-hidden="true"></i></span><h3>${escapeHTML(c.area)}</h3></header>
        <ul>${c.itens.map((i) => `<li>${escapeHTML(i)}</li>`).join('')}</ul>
      </article>`).join(''));
    set('#ensino-projetos', e.projetosPedagogicos.map((p, i) => `<li class="timeline__item"><span class="timeline__dot" aria-hidden="true">${i + 1}</span><div><h3>${escapeHTML(p.titulo)}</h3><p>${escapeHTML(p.descricao)}</p></div></li>`).join(''));
    set('#ensino-atividades', e.atividades.map((a) => `<li class="activity"><i class="fa-solid ${a.icone}" aria-hidden="true"></i><span>${escapeHTML(a.titulo)}</span></li>`).join(''));
    Anim.init(document);
  }

  /* =================== PROJETOS =================== */
  async function projetos() {
    const grid = qs('#projects-grid');
    if (!grid) return;
    const lista = await API.list('projetos');
    const areas = [...new Set(lista.map((p) => p.area).filter(Boolean))];
    const chips = qs('#projects-filters');
    chips.innerHTML = ['Todos', ...areas].map((a, i) => `<button type="button" class="chip${i === 0 ? ' is-active' : ''}" data-area="${escapeHTML(a)}" aria-pressed="${i === 0}">${escapeHTML(a)}</button>`).join('');

    const draw = (area) => {
      const l = lista.filter((p) => area === 'Todos' || p.area === area);
      grid.innerHTML = l.map((p) => `
        <article class="project-card" id="projeto-${escapeHTML(p.id)}" data-tilt="5">
          <div class="project-card__media"><img src="${asset(p.imagem)}" alt="" loading="lazy" width="800" height="500"><span class="badge badge--light">${escapeHTML(p.area || 'Projeto')}</span></div>
          <div class="project-card__body">
            <h2 class="project-card__title">${escapeHTML(p.nome)}</h2>
            <p>${escapeHTML(p.descricao)}</p>
            <ul class="project-card__meta">
              <li><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${formatDate(p.data)}</li>
              <li><i class="fa-solid fa-users" aria-hidden="true"></i> ${escapeHTML(p.participantes)}</li>
              <li><i class="fa-regular fa-images" aria-hidden="true"></i> ${(p.galeria || []).length} foto(s)</li>
            </ul>
            <button type="button" class="btn btn--outline btn--sm" data-project="${escapeHTML(p.id)}">Ver detalhes e galeria</button>
          </div>
        </article>`).join('') || '<p class="empty-state">Nenhum projeto cadastrado.</p>';
      Anim.tilt(grid);
    };

    chips.addEventListener('click', (e) => {
      const c = e.target.closest('.chip');
      if (!c) return;
      qsa('.chip', chips).forEach((x) => { const on = x === c; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
      draw(c.dataset.area);
    });

    grid.addEventListener('click', (e) => {
      const b = e.target.closest('[data-project]');
      if (!b) return;
      const p = lista.find((x) => String(x.id) === b.dataset.project);
      const gal = p.galeria || [];
      Utils.Modal.open({
        title: p.nome, size: 'lg',
        html: `<img class="modal__hero-img" src="${asset(p.imagem)}" alt="Imagem do projeto ${escapeHTML(p.nome)}" width="1200" height="600">
          <dl class="details">
            <div><dt>Descrição</dt><dd>${escapeHTML(p.descricao)}</dd></div>
            <div><dt>Objetivo</dt><dd>${escapeHTML(p.objetivo)}</dd></div>
            <div><dt>Data</dt><dd>${formatDate(p.data)}${p.periodo ? ` · ${escapeHTML(p.periodo)}` : ''}</dd></div>
            <div><dt>Participantes</dt><dd>${escapeHTML(p.participantes)}</dd></div>
          </dl>
          ${gal.length ? `<h3 class="modal__subtitle">Galeria</h3><ul class="mini-gallery">${gal.map((g, i) => `<li><button type="button" data-gal="${i}" aria-label="Ampliar foto ${i + 1}"><img src="${asset(g)}" alt="" loading="lazy" width="200" height="140"></button></li>`).join('')}</ul>` : ''}`,
        onOpen(body) {
          body.addEventListener('click', (ev) => {
            const g = ev.target.closest('[data-gal]');
            if (g) Lightbox.open(gal.map((src, i) => ({ src, titulo: `${p.nome} — foto ${i + 1}` })), Number(g.dataset.gal));
          });
        }
      });
    });

    draw('Todos');
    // abre direto se vier de um link projetos.html#projeto-2
    const hash = (window.Router && window.Router.anchor) || location.hash.slice(1);
    const m = /^projeto-(\d+)$/.exec(hash || '');
    if (m) { const el = qs(`#projeto-${m[1]}`); el && setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); }
  }

  /* =================== ÁREA DO ALUNO / RESPONSÁVEIS =================== */
  const DEMO_TAG = '<p class="notice notice--warning"><i class="fa-solid fa-flask" aria-hidden="true"></i> <strong>Dados fictícios.</strong> Este recurso depende de backend e de integração com o sistema oficial de notas e frequência. Nada abaixo é real.</p>';

  function boletimHTML() {
    const comps = ['Componente A', 'Componente B', 'Componente C', 'Componente D', 'Componente E'];
    const nota = (i, j) => ((i * 7 + j * 3) % 4 + 6).toFixed(1).replace('.', ',');
    return `${DEMO_TAG}<div class="table-wrap"><table class="data-table">
      <caption class="sr-only">Boletim de demonstração</caption>
      <thead><tr><th scope="col">Componente</th><th scope="col">Período 1</th><th scope="col">Período 2</th><th scope="col">Período 3</th><th scope="col">Situação</th></tr></thead>
      <tbody>${comps.map((c, i) => `<tr><th scope="row">${c}</th><td>${nota(i, 1)}</td><td>${nota(i, 2)}</td><td>—</td><td><span class="pill pill--normal">Em andamento</span></td></tr>`).join('')}</tbody>
    </table></div>`;
  }

  function frequenciaHTML() {
    const meses = ['Agosto', 'Setembro', 'Outubro'];
    const vals = [96, 92, 98];
    return `${DEMO_TAG}<ul class="freq-list">${meses.map((m, i) => `<li><span>${m}</span>
      <span class="freq-bar" role="img" aria-label="${vals[i]}% de presença (fictício)"><span style="width:${vals[i]}%"></span></span><strong>${vals[i]}%</strong></li>`).join('')}</ul>
      <p class="field__help">Em produção, a frequência virá do diário de classe oficial via API.</p>`;
  }

  function horariosHTML() {
    const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
    return `<p class="notice notice--info"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Modelo de quadro de horários. Substitua pelos horários oficiais de cada turma.</p>
      <div class="table-wrap"><table class="data-table data-table--center">
      <thead><tr><th scope="col">Aula</th>${dias.map((d) => `<th scope="col">${d}</th>`).join('')}</tr></thead>
      <tbody>${[1, 2, 3, 4, 5].map((a) => `<tr><th scope="row">${a}ª</th>${dias.map(() => '<td>[COMPONENTE]</td>').join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function materiaisHTML() {
    return `<p class="notice notice--info"><i class="fa-solid fa-server" aria-hidden="true"></i> O envio de materiais pelos professores depende do backend (upload + permissões). Abaixo, um modelo de como a lista aparecerá.</p>
      <ul class="doc-mini">${['[Material de exemplo 1]', '[Material de exemplo 2]', '[Material de exemplo 3]'].map((m) => `<li><i class="fa-regular fa-file-pdf" aria-hidden="true"></i> ${m} <span class="pill pill--off">Indisponível</span></li>`).join('')}</ul>`;
  }

  async function comunicadosHTML(publico) {
    const l = await API.comunicadosAtivos(publico);
    return `<ul class="notice-list">${l.map(comunicadoItem).join('') || '<li>Nenhum comunicado.</li>'}</ul>`;
  }

  const FEATURES = {
    boletim: { titulo: 'Boletim', html: boletimHTML },
    frequencia: { titulo: 'Frequência', html: frequenciaHTML },
    horarios: { titulo: 'Horários', html: horariosHTML },
    materiais: { titulo: 'Materiais', html: materiaisHTML },
    'comunicados-alunos': { titulo: 'Comunicados para estudantes', html: () => comunicadosHTML('alunos') },
    'comunicados-responsaveis': { titulo: 'Comunicados para responsáveis', html: () => comunicadosHTML('responsaveis') }
  };

  function bindFeatures(root) {
    root.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-feature]');
      if (!b) return;
      const f = FEATURES[b.dataset.feature];
      if (!f) return;
      Utils.Modal.open({ title: f.titulo, size: 'lg', html: await f.html() });
    });
  }

  function sessionBanner(perfil) {
    const el = qs('#session-banner');
    if (!el) return;
    const s = Auth.current();
    if (s && s.perfil === perfil) {
      el.innerHTML = `<p><i class="fa-solid fa-user-check" aria-hidden="true"></i> Olá, <strong>${escapeHTML(s.nome)}</strong>. Você está em uma sessão de demonstração.</p>
        <button type="button" class="btn btn--ghost btn--sm" id="session-logout">Sair</button>`;
      qs('#session-logout').addEventListener('click', () => { Auth.logout(); Utils.toast('Sessão encerrada.', 'info'); sessionBanner(perfil); });
    } else {
      el.innerHTML = `<p><i class="fa-solid fa-lock" aria-hidden="true"></i> Os dados pessoais (boletim, frequência) exigirão login. Nesta versão, tudo é demonstrativo.</p>
        <a class="btn btn--primary btn--sm" href="login.html?perfil=${perfil}">Entrar</a>`;
    }
  }

  async function alunos() {
    sessionBanner('aluno');
    bindFeatures(qs('#student-cards'));
    await renderComunicados(qs('#alunos-comunicados'), 'alunos');
    Anim.init(document);
  }

  async function responsaveis() {
    sessionBanner('responsavel');
    bindFeatures(qs('#parent-cards'));
    await renderComunicados(qs('#resp-comunicados'), 'responsaveis');
    const reunioes = qs('#resp-reunioes');
    if (reunioes) {
      const l = (await API.eventosOrdenados()).filter((e) => e.categoria === 'reuniao' && e.data >= Utils.todayISO());
      reunioes.innerHTML = l.length ? l.map(Eventos.card).join('') : '<p class="empty-state">Nenhuma reunião agendada.</p>';
    }
    Anim.init(document);
  }

  /* =================== DOCUMENTOS =================== */
  async function documentos() {
    const list = qs('#docs-list');
    if (!list) return;
    const docs = await API.list('documentos');
    const chips = qs('#docs-filters');
    chips.innerHTML = [['todas', 'Todas', 'fa-layer-group'], ...Object.entries(CATEGORIAS_DOCUMENTO).map(([k, v]) => [k, v.nome, v.icone])]
      .map(([k, n, ic], i) => `<button type="button" class="chip${i === 0 ? ' is-active' : ''}" data-cat="${k}" aria-pressed="${i === 0}"><i class="fa-solid ${ic}" aria-hidden="true"></i> ${escapeHTML(n)}</button>`).join('');
    const st = { cat: 'todas', q: '' };
    const search = qs('#docs-search');
    const iconFor = (t) => ({ PDF: 'fa-file-pdf', DOC: 'fa-file-word', XLS: 'fa-file-excel', Imagem: 'fa-file-image' }[t] || 'fa-file');

    function draw() {
      const q = normalize(st.q);
      const l = docs.filter((d) => (st.cat === 'todas' || d.categoria === st.cat) && (!q || normalize(`${d.nome} ${d.descricao}`).includes(q)));
      const grupos = Object.keys(CATEGORIAS_DOCUMENTO).filter((k) => l.some((d) => d.categoria === k));
      list.innerHTML = grupos.length ? grupos.map((k) => `
        <section class="doc-group" aria-labelledby="doc-g-${k}">
          <h2 class="doc-group__title" id="doc-g-${k}"><i class="fa-solid ${CATEGORIAS_DOCUMENTO[k].icone}" aria-hidden="true"></i> ${escapeHTML(CATEGORIAS_DOCUMENTO[k].nome)}</h2>
          <ul class="doc-list">
            ${l.filter((d) => d.categoria === k).map((d) => {
              const href = asset(d.arquivo);
              return `<li class="doc">
                <span class="doc__icon doc__icon--${Utils.slugify(d.tipo)}"><i class="fa-regular ${iconFor(d.tipo)}" aria-hidden="true"></i></span>
                <div class="doc__body">
                  <h3 class="doc__name">${escapeHTML(d.nome)}</h3>
                  <p class="doc__desc">${escapeHTML(d.descricao)}</p>
                  <p class="doc__meta"><span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${formatDate(d.data, 'short')}</span><span class="pill pill--off">${escapeHTML(d.tipo)}</span></p>
                </div>
                <div class="doc__actions">
                  <a class="btn btn--ghost btn--sm" href="${escapeHTML(href)}" target="_blank" rel="noopener" aria-label="Visualizar ${escapeHTML(d.nome)}"><i class="fa-regular fa-eye" aria-hidden="true"></i> Visualizar</a>
                  <a class="btn btn--primary btn--sm" href="${escapeHTML(href)}" download aria-label="Baixar ${escapeHTML(d.nome)}"><i class="fa-solid fa-download" aria-hidden="true"></i> Baixar</a>
                </div>
              </li>`;
            }).join('')}
          </ul>
        </section>`).join('')
        : '<div class="empty-state"><i class="fa-regular fa-folder-open" aria-hidden="true"></i><p>Nenhum documento encontrado.</p></div>';
      qs('#docs-count').textContent = `${l.length} ${l.length === 1 ? 'documento' : 'documentos'}`;
    }

    chips.addEventListener('click', (e) => {
      const c = e.target.closest('.chip');
      if (!c) return;
      st.cat = c.dataset.cat;
      qsa('.chip', chips).forEach((x) => { const on = x === c; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
      draw();
    });
    search.addEventListener('input', debounce(() => { st.q = search.value; draw(); }, 200));
    draw();
  }

  /* =================== CONTATO =================== */
  function contato() {
    const info = qs('#contact-info');
    const ct = SITE_CONFIG.contato;
    if (info) {
      const items = [
        ['fa-location-dot', 'Endereço', `${ct.endereco}<br>${ct.bairro} · CEP ${ct.cep}<br>${SITE_CONFIG.cidade} – ${SITE_CONFIG.estado}`, true],
        ['fa-phone', 'Telefone', ct.telefone],
        ['fa-brands fa-whatsapp', 'WhatsApp', ct.whatsapp],
        ['fa-envelope', 'E-mail', ct.email],
        ['fa-regular fa-clock', 'Horário de atendimento', ct.horario]
      ];
      info.innerHTML = items.map(([ic, t, v, raw]) => `
        <li class="contact-item">
          <span class="contact-item__icon"><i class="${ic.includes(' ') ? ic : 'fa-solid ' + ic}" aria-hidden="true"></i></span>
          <div><h3>${t}</h3><p>${raw ? v.split('<br>').map(escapeHTML).join('<br>') : escapeHTML(v)}</p></div>
          ${!raw && !Utils.isPlaceholder(v) ? `<button type="button" class="btn-icon btn-icon--sm" data-copy="${escapeHTML(v)}" aria-label="Copiar ${t}"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>` : ''}
        </li>`).join('');
      info.addEventListener('click', async (e) => {
        const b = e.target.closest('[data-copy]');
        if (b) { const ok = await Utils.copyText(b.dataset.copy); Utils.toast(ok ? 'Copiado.' : 'Não foi possível copiar.', ok ? 'success' : 'warning'); }
      });
    }

    const map = qs('#map');
    if (map && ct.mapaEmbedURL && /^https:\/\/www\.google\.com\/maps\/embed/.test(ct.mapaEmbedURL)) {
      map.innerHTML = `<iframe src="${escapeHTML(ct.mapaEmbedURL)}" title="Mapa de localização da escola" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
    }

    Forms.attach(qs('#contact-form'), { onValid: (data, form) => Forms.showBackendNotice(form, data, { titulo: 'Mensagem validada' }) });
  }

  /* =================== OUVIDORIA =================== */
  function ouvidoria() {
    Forms.attach(qs('#ouvidoria-form'), { onValid: (data, form) => Forms.showBackendNotice(form, data, { titulo: 'Manifestação validada' }) });
  }

  return { home, escola, equipe, ensino, projetos, alunos, responsaveis, documentos, contato, ouvidoria, renderComunicados };
})();
