/* =====================================================================
   admin.js — PAINEL ADMINISTRATIVO (demonstrativo)
   ---------------------------------------------------------------------
   - Dashboard com indicadores e gráficos simples
   - Cadastro (criar, editar, excluir) de notícias, eventos, projetos,
     documentos, galeria, comunicados e usuários
   - Notícias: "Salvar rascunho" e "Publicar"

   ⚠️ NESTA VERSÃO tudo é salvo no localStorage do navegador de quem
      está editando. Isso serve SOMENTE para demonstração.
   EM PRODUÇÃO:
     - Os dados vão para o banco de dados via API (js/api.js já está
       preparado: basta ativar CONFIG.USE_BACKEND).
     - O acesso ao painel é validado NO SERVIDOR (sessão + perfil).
     - Upload de imagens/PDFs é feito pelo backend, que valida tipo,
       tamanho e salva o arquivo em local seguro.
   ===================================================================== */
const Admin = (() => {
  'use strict';
  const { qs, qsa, escapeHTML, formatDate, todayISO, asset, normalize, debounce } = Utils;

  /* ---------- Opções de selects ---------- */
  const opt = (obj) => Object.entries(obj).map(([value, v]) => ({ value, label: typeof v === 'string' ? v : v.nome }));
  const NIVEIS = [{ value: 'normal', label: 'Normal' }, { value: 'importante', label: 'Importante' }, { value: 'urgente', label: 'Urgente' }];
  const PUBLICOS = [{ value: 'todos', label: 'Todos' }, { value: 'alunos', label: 'Alunos' }, { value: 'responsaveis', label: 'Responsáveis' }];

  /* ---------- Definição de cada cadastro (schema) ----------
     Para adicionar um campo, inclua um objeto em "fields".
     Tipos: text, email, textarea, select, date, time, checkbox, image, list */
  const SCHEMAS = {
    noticias: {
      titulo: 'Notícias', singular: 'notícia', icone: 'fa-newspaper', status: true,
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', required: true, max: 160 },
        { name: 'categoria', label: 'Categoria', type: 'select', options: () => CATEGORIAS_NOTICIA.map((c) => ({ value: c, label: c })), required: true },
        { name: 'data', label: 'Data', type: 'date', required: true, default: todayISO },
        { name: 'autor', label: 'Autor', type: 'text', max: 100 },
        { name: 'imagem', label: 'Imagem', type: 'image', full: true },
        { name: 'resumo', label: 'Resumo', type: 'textarea', required: true, max: 300, rows: 2, full: true },
        { name: 'conteudo', label: 'Conteúdo (separe parágrafos com uma linha em branco)', type: 'textarea', required: true, max: 20000, rows: 8, full: true, paragraphs: true },
        { name: 'destaque', label: 'Mostrar no carrossel de destaques', type: 'checkbox' }
      ],
      columns: ['titulo', 'categoria', 'data', 'status']
    },
    eventos: {
      titulo: 'Eventos', singular: 'evento', icone: 'fa-calendar-days',
      fields: [
        { name: 'titulo', label: 'Nome do evento', type: 'text', required: true, max: 160, full: true },
        { name: 'data', label: 'Data', type: 'date', required: true, default: todayISO },
        { name: 'local', label: 'Local', type: 'text', max: 120 },
        { name: 'horaInicio', label: 'Horário de início', type: 'time' },
        { name: 'horaFim', label: 'Horário de término', type: 'time' },
        { name: 'categoria', label: 'Categoria', type: 'select', options: () => opt(CATEGORIAS_EVENTO), required: true },
        { name: 'tipo', label: 'Tipo no calendário', type: 'select', options: () => opt(TIPOS_CALENDARIO), required: true },
        { name: 'descricao', label: 'Descrição', type: 'textarea', max: 1000, rows: 3, full: true }
      ],
      columns: ['titulo', 'data', 'categoria', 'tipo']
    },
    projetos: {
      titulo: 'Projetos', singular: 'projeto', icone: 'fa-lightbulb',
      fields: [
        { name: 'nome', label: 'Nome do projeto', type: 'text', required: true, max: 160, full: true },
        { name: 'imagem', label: 'Foto principal', type: 'image', full: true },
        { name: 'descricao', label: 'Descrição', type: 'textarea', required: true, max: 1500, rows: 3, full: true },
        { name: 'objetivo', label: 'Objetivo', type: 'textarea', max: 800, rows: 2, full: true },
        { name: 'data', label: 'Data de início', type: 'date', default: todayISO },
        { name: 'periodo', label: 'Período', type: 'text', max: 80 },
        { name: 'participantes', label: 'Participantes', type: 'text', max: 200 },
        { name: 'area', label: 'Área', type: 'text', max: 80 },
        { name: 'galeria', label: 'Galeria (um caminho de imagem por linha)', type: 'list', full: true }
      ],
      columns: ['nome', 'area', 'data']
    },
    documentos: {
      titulo: 'Documentos', singular: 'documento', icone: 'fa-file-lines',
      fields: [
        { name: 'nome', label: 'Nome', type: 'text', required: true, max: 160, full: true },
        { name: 'descricao', label: 'Descrição', type: 'textarea', max: 500, rows: 2, full: true },
        { name: 'categoria', label: 'Categoria', type: 'select', options: () => opt(CATEGORIAS_DOCUMENTO), required: true },
        { name: 'tipo', label: 'Tipo', type: 'select', options: () => ['PDF', 'DOC', 'XLS', 'Imagem', 'Outro'].map((v) => ({ value: v, label: v })) },
        { name: 'data', label: 'Data', type: 'date', default: todayISO },
        { name: 'arquivo', label: 'Caminho do arquivo (ex.: assets/documentos/arquivo.pdf)', type: 'text', required: true, max: 300, full: true,
          help: 'O envio (upload) real de arquivos depende do backend. Por enquanto, copie o PDF para assets/documentos/ e informe o caminho.' }
      ],
      columns: ['nome', 'categoria', 'data', 'tipo']
    },
    galeria: {
      titulo: 'Galeria', singular: 'foto', icone: 'fa-images',
      fields: [
        { name: 'imagem', label: 'Imagem', type: 'image', required: true, full: true },
        { name: 'titulo', label: 'Legenda / descrição (texto alternativo)', type: 'text', required: true, max: 160, full: true },
        { name: 'categoria', label: 'Categoria', type: 'select', options: () => opt(CATEGORIAS_GALERIA), required: true }
      ],
      columns: ['imagem', 'titulo', 'categoria']
    },
    comunicados: {
      titulo: 'Comunicados', singular: 'comunicado', icone: 'fa-bullhorn',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', required: true, max: 160, full: true },
        { name: 'mensagem', label: 'Mensagem', type: 'textarea', required: true, max: 1000, rows: 3, full: true },
        { name: 'nivel', label: 'Nível', type: 'select', options: () => NIVEIS, required: true },
        { name: 'publico', label: 'Público', type: 'select', options: () => PUBLICOS, required: true },
        { name: 'data', label: 'Data', type: 'date', default: todayISO },
        { name: 'ativo', label: 'Comunicado ativo (visível no site)', type: 'checkbox', default: () => true }
      ],
      columns: ['titulo', 'nivel', 'publico', 'data', 'ativo']
    },
    usuarios: {
      titulo: 'Usuários', singular: 'usuário', icone: 'fa-users',
      note: 'Senhas NÃO são gerenciadas aqui. Em produção, o cadastro e a troca de senha acontecem no backend, com hash (bcrypt/argon2) e convite por e-mail.',
      fields: [
        { name: 'nome', label: 'Nome', type: 'text', required: true, max: 120 },
        { name: 'email', label: 'E-mail', type: 'email', required: true, max: 160 },
        { name: 'perfil', label: 'Perfil', type: 'select', options: () => [{ value: 'admin', label: 'Administrador' }, { value: 'editor', label: 'Editor' }], required: true },
        { name: 'ativo', label: 'Usuário ativo', type: 'checkbox', default: () => true }
      ],
      columns: ['nome', 'email', 'perfil', 'ativo']
    }
  };

  const SECTIONS = [
    { id: 'dashboard', label: 'Dashboard', icone: 'fa-gauge-high' },
    { id: 'noticias', label: 'Notícias', icone: 'fa-newspaper' },
    { id: 'eventos', label: 'Eventos', icone: 'fa-calendar-days' },
    { id: 'projetos', label: 'Projetos', icone: 'fa-lightbulb' },
    { id: 'documentos', label: 'Documentos', icone: 'fa-file-lines' },
    { id: 'galeria', label: 'Galeria', icone: 'fa-images' },
    { id: 'comunicados', label: 'Comunicados', icone: 'fa-bullhorn' },
    { id: 'usuarios', label: 'Usuários', icone: 'fa-users' },
    { id: 'configuracoes', label: 'Configurações', icone: 'fa-gear' }
  ];

  let content, sessao;

  /* ---------- Registro de atividades (demo) ---------- */
  function log(acao) {
    const l = Utils.store.get('hf_admin_log', []);
    l.unshift({ acao, quando: new Date().toISOString(), por: sessao?.nome || '—' });
    Utils.store.set('hf_admin_log', l.slice(0, 20));
  }

  /* ---------- Formatação de células ---------- */
  function cell(resource, col, item) {
    const v = item[col];
    switch (col) {
      case 'data': return `<time datetime="${escapeHTML(v)}">${formatDate(v, 'short')}</time>`;
      case 'status': return v === 'rascunho' ? '<span class="pill pill--draft">Rascunho</span>' : '<span class="pill pill--ok">Publicado</span>';
      case 'ativo': return v === false ? '<span class="pill pill--off">Inativo</span>' : '<span class="pill pill--ok">Ativo</span>';
      case 'nivel': return `<span class="pill pill--${escapeHTML(v)}">${escapeHTML((NIVEIS.find((n) => n.value === v) || {}).label || v)}</span>`;
      case 'imagem': return `<img class="admin-thumb" src="${asset(v)}" alt="" width="64" height="44">`;
      case 'categoria':
        if (resource === 'eventos') return escapeHTML(CATEGORIAS_EVENTO[v]?.nome || v);
        if (resource === 'documentos') return escapeHTML(CATEGORIAS_DOCUMENTO[v]?.nome || v);
        if (resource === 'galeria') return escapeHTML(CATEGORIAS_GALERIA[v] || v);
        return escapeHTML(v);
      case 'tipo': return escapeHTML(TIPOS_CALENDARIO[v]?.nome || v);
      case 'publico': return escapeHTML((PUBLICOS.find((p) => p.value === v) || {}).label || v);
      case 'perfil': return v === 'admin' ? 'Administrador' : 'Editor';
      default: return escapeHTML(v ?? '');
    }
  }

  const colLabel = (resource, col) => (SCHEMAS[resource].fields.find((f) => f.name === col) || {}).label?.split(' (')[0] || (col === 'status' ? 'Status' : col);

  /* =================== DASHBOARD =================== */
  async function renderDashboard() {
    const [noticias, eventos, documentos, usuarios, comunicados] = await Promise.all(
      ['noticias', 'eventos', 'documentos', 'usuarios', 'comunicados'].map((r) => API.list(r)));
    const hoje = todayISO();
    const publicadas = noticias.filter((n) => n.status !== 'rascunho');
    const rascunhos = noticias.length - publicadas.length;
    const proximos = eventos.filter((e) => e.data >= hoje);
    const comAtivos = comunicados.filter((c) => c.ativo !== false);
    const urgentes = comAtivos.filter((c) => c.nivel === 'urgente').length;
    const usuAtivos = usuarios.filter((u) => u.ativo !== false).length;

    const kpis = [
      { label: 'Notícias publicadas', valor: publicadas.length, sub: `${rascunhos} rascunho(s)`, icone: 'fa-newspaper', go: 'noticias', tone: 'blue' },
      { label: 'Próximos eventos', valor: proximos.length, sub: `${eventos.length} no total`, icone: 'fa-calendar-days', go: 'eventos', tone: 'green' },
      { label: 'Documentos', valor: documentos.length, sub: `${Object.keys(CATEGORIAS_DOCUMENTO).length} categorias`, icone: 'fa-file-lines', go: 'documentos', tone: 'blue' },
      { label: 'Usuários ativos', valor: usuAtivos, sub: `${usuarios.length} cadastrados`, icone: 'fa-users', go: 'usuarios', tone: 'green' },
      { label: 'Comunicados ativos', valor: comAtivos.length, sub: urgentes ? `${urgentes} urgente(s)` : 'nenhum urgente', icone: 'fa-bullhorn', go: 'comunicados', tone: urgentes ? 'red' : 'amber' }
    ];

    // Notícias por categoria
    const porCat = CATEGORIAS_NOTICIA.map((c) => ({ label: c, v: publicadas.filter((n) => n.categoria === c).length }));
    const maxCat = Math.max(1, ...porCat.map((c) => c.v));

    // Eventos nos próximos 6 meses
    const meses = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return { label: Utils.MESES[d.getMonth()].slice(0, 3), v: eventos.filter((e) => e.data.startsWith(key)).length };
    });
    const maxMes = Math.max(1, ...meses.map((m) => m.v));
    const logs = Utils.store.get('hf_admin_log', []);

    content.innerHTML = `
      <section class="kpi-grid" aria-label="Indicadores">
        ${kpis.map((k) => `
          <button type="button" class="kpi kpi--${k.tone}" data-go="${k.go}">
            <span class="kpi__icon"><i class="fa-solid ${k.icone}" aria-hidden="true"></i></span>
            <span class="kpi__value">${k.valor}</span>
            <span class="kpi__label">${k.label}</span>
            <span class="kpi__sub">${k.sub}</span>
          </button>`).join('')}
      </section>

      <div class="admin-grid">
        <section class="panel">
          <header class="panel__head"><h2>Notícias publicadas por categoria</h2></header>
          <ul class="hbars">
            ${porCat.map((c) => `<li><span class="hbars__label">${escapeHTML(c.label)}</span>
              <span class="hbars__track"><span class="hbars__fill" style="width:${(c.v / maxCat) * 100}%"></span></span>
              <span class="hbars__value">${c.v}</span></li>`).join('')}
          </ul>
        </section>
        <section class="panel">
          <header class="panel__head"><h2>Eventos nos próximos 6 meses</h2></header>
          <div class="vbars" role="img" aria-label="${meses.map((m) => `${m.label}: ${m.v}`).join(', ')}">
            ${meses.map((m) => `<div class="vbars__col"><span class="vbars__value">${m.v}</span>
              <span class="vbars__bar" style="height:${Math.max(4, (m.v / maxMes) * 100)}%"></span>
              <span class="vbars__label">${m.label}</span></div>`).join('')}
          </div>
        </section>
        <section class="panel">
          <header class="panel__head"><h2>Comunicados ativos</h2><button type="button" class="btn btn--ghost btn--sm" data-go="comunicados">Gerenciar</button></header>
          <ul class="admin-list">
            ${comAtivos.slice(0, 5).map((c) => `<li><span class="pill pill--${escapeHTML(c.nivel)}">${escapeHTML(c.nivel)}</span> <span>${escapeHTML(c.titulo)}</span></li>`).join('') || '<li>Nenhum comunicado ativo.</li>'}
          </ul>
        </section>
        <section class="panel">
          <header class="panel__head"><h2>Atividade recente</h2></header>
          <ul class="admin-list admin-list--log">
            ${logs.slice(0, 6).map((l) => `<li><i class="fa-regular fa-clock" aria-hidden="true"></i> <span>${escapeHTML(l.acao)}</span> <small>${new Date(l.quando).toLocaleString('pt-BR')}</small></li>`).join('') || '<li>Nenhuma alteração feita ainda neste navegador.</li>'}
          </ul>
        </section>
      </div>

      <section class="panel">
        <header class="panel__head"><h2>Últimas notícias</h2><button type="button" class="btn btn--primary btn--sm" data-new="noticias"><i class="fa-solid fa-plus" aria-hidden="true"></i> Nova notícia</button></header>
        ${table('noticias', noticias.slice().sort((a, b) => String(b.data).localeCompare(String(a.data))).slice(0, 5))}
      </section>`;
  }

  /* =================== TABELA + CRUD =================== */
  function table(resource, items) {
    const s = SCHEMAS[resource];
    if (!items.length) return `<div class="empty-state"><i class="fa-regular fa-folder-open" aria-hidden="true"></i><p>Nenhum(a) ${s.singular} cadastrado(a).</p></div>`;
    return `<div class="table-wrap"><table class="admin-table">
      <thead><tr>${s.columns.map((c) => `<th scope="col">${escapeHTML(colLabel(resource, c))}</th>`).join('')}<th scope="col" class="admin-table__actions">Ações</th></tr></thead>
      <tbody>${items.map((it) => `<tr>
        ${s.columns.map((c, i) => `<td data-label="${escapeHTML(colLabel(resource, c))}"${i === 0 ? ' class="admin-table__main"' : ''}>${cell(resource, c, it)}</td>`).join('')}
        <td class="admin-table__actions">
          ${s.status ? `<button type="button" class="btn-icon btn-icon--sm" data-toggle-status="${it.id}" data-resource="${resource}" aria-label="${it.status === 'rascunho' ? 'Publicar' : 'Mover para rascunho'}: ${escapeHTML(it.titulo)}" title="${it.status === 'rascunho' ? 'Publicar' : 'Despublicar'}"><i class="fa-solid ${it.status === 'rascunho' ? 'fa-upload' : 'fa-eye-slash'}" aria-hidden="true"></i></button>` : ''}
          <button type="button" class="btn-icon btn-icon--sm" data-edit="${it.id}" data-resource="${resource}" aria-label="Editar" title="Editar"><i class="fa-solid fa-pen" aria-hidden="true"></i></button>
          <button type="button" class="btn-icon btn-icon--sm btn-icon--danger" data-delete="${it.id}" data-resource="${resource}" aria-label="Excluir" title="Excluir"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>
        </td></tr>`).join('')}
      </tbody></table></div>`;
  }

  async function renderResource(resource) {
    const s = SCHEMAS[resource];
    const items = await API.list(resource);
    content.innerHTML = `
      <section class="panel">
        <header class="panel__head panel__head--tools">
          <div class="admin-search">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <label class="sr-only" for="admin-search">Buscar em ${s.titulo}</label>
            <input type="search" id="admin-search" placeholder="Buscar ${s.titulo.toLowerCase()}..." autocomplete="off">
          </div>
          ${s.status ? `<label class="sr-only" for="admin-status">Filtrar por status</label>
            <select id="admin-status" class="select-sm"><option value="">Todos os status</option><option value="publicado">Publicados</option><option value="rascunho">Rascunhos</option></select>` : ''}
          <button type="button" class="btn btn--primary" data-new="${resource}"><i class="fa-solid fa-plus" aria-hidden="true"></i> Adicionar ${s.singular}</button>
        </header>
        ${s.note ? `<p class="notice notice--info"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> ${escapeHTML(s.note)}</p>` : ''}
        <div id="admin-table">${table(resource, items)}</div>
        <p class="admin-count" id="admin-count">${items.length} registro(s)</p>
      </section>`;

    const search = qs('#admin-search');
    const status = qs('#admin-status');
    const refilter = () => {
      const q = normalize(search.value);
      const f = items.filter((it) => (!q || normalize(Object.values(it).join(' ')).includes(q)) && (!status || !status.value || (status.value === 'rascunho' ? it.status === 'rascunho' : it.status !== 'rascunho')));
      qs('#admin-table').innerHTML = table(resource, f);
      qs('#admin-count').textContent = `${f.length} de ${items.length} registro(s)`;
    };
    search.addEventListener('input', debounce(refilter, 150));
    status && status.addEventListener('change', refilter);
  }

  /* ---------- Formulário (modal) ---------- */
  function fieldHTML(f, item) {
    const id = `f-${f.name}`;
    let v = item ? item[f.name] : (typeof f.default === 'function' ? f.default() : f.default);
    if (f.paragraphs && Array.isArray(v)) v = v.join('\n\n');
    if (f.type === 'list' && Array.isArray(v)) v = v.join('\n');
    v = v ?? '';
    const req = f.required ? ' required' : '';
    const max = f.max ? ` maxlength="${f.max}"` : '';
    const help = f.help ? `<p class="field__help" id="${id}-help">${escapeHTML(f.help)}</p>` : '';
    const desc = f.help ? ` aria-describedby="${id}-help"` : '';
    const label = `<label class="field__label" for="${id}">${escapeHTML(f.label)}${f.required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>`;
    const cls = `field${f.full ? ' field--full' : ''}`;

    switch (f.type) {
      case 'textarea':
      case 'list':
        return `<div class="${cls}">${label}<textarea id="${id}" name="${f.name}" rows="${f.rows || 4}"${req}${max}${desc}>${escapeHTML(v)}</textarea>${help}</div>`;
      case 'select':
        return `<div class="${cls}">${label}<select id="${id}" name="${f.name}"${req}${desc}>
          <option value="">Selecione...</option>
          ${f.options().map((o) => `<option value="${escapeHTML(o.value)}"${String(o.value) === String(v) ? ' selected' : ''}>${escapeHTML(o.label)}</option>`).join('')}
        </select>${help}</div>`;
      case 'checkbox':
        return `<div class="check field--full"><input type="checkbox" id="${id}" name="${f.name}"${v === true || v === 'true' ? ' checked' : ''}><label for="${id}">${escapeHTML(f.label)}</label></div>`;
      case 'image':
        return `<div class="${cls} field-image">${label}
          <div class="field-image__row">
            <img class="field-image__preview" src="${v ? asset(v) : Utils.placeholderSVG('Sem imagem')}" alt="Pré-visualização" width="160" height="100">
            <div class="field-image__inputs">
              <input type="text" id="${id}" name="${f.name}" value="${escapeHTML(String(v).startsWith('data:') ? '' : v)}" placeholder="assets/images/arquivo.jpg"${String(v).startsWith('data:') ? '' : req} maxlength="300" aria-describedby="${id}-help">
              <input type="hidden" name="${f.name}__data" value="${String(v).startsWith('data:') ? escapeHTML(v) : ''}">
              <label class="btn btn--ghost btn--sm field-image__upload"><i class="fa-solid fa-upload" aria-hidden="true"></i> Escolher do computador
                <input type="file" accept="image/png,image/jpeg,image/webp" class="sr-only" data-image-input="${f.name}"></label>
              <p class="field__help" id="${id}-help">Informe o caminho da imagem em assets/images/ ou escolha um arquivo (demo: fica salvo apenas neste navegador, reduzido para no máx. 1200px).</p>
            </div>
          </div></div>`;
      default:
        return `<div class="${cls}">${label}<input type="${f.type}" id="${id}" name="${f.name}" value="${escapeHTML(v)}"${req}${max}${desc}${f.type === 'email' ? ' autocomplete="off"' : ''}>${help}</div>`;
    }
  }

  // Reduz a imagem escolhida (canvas) para não lotar o localStorage
  function compressImage(file, maxW = 1200, quality = 0.78) {
    return new Promise((resolve, reject) => {
      if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { reject(new Error('Formato não suportado. Use JPG, PNG ou WEBP.')); return; }
      if (file.size > 8 * 1024 * 1024) { reject(new Error('Arquivo muito grande (máximo 8 MB).')); return; }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxW / img.width);
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('Imagem inválida.'));
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function openForm(resource, id = null) {
    const s = SCHEMAS[resource];
    const item = id ? await API.get(resource, id) : null;
    const isNews = !!s.status;
    Utils.Modal.open({
      title: `${item ? 'Editar' : 'Adicionar'} ${s.singular}`,
      size: 'lg',
      html: `<form class="form admin-form" id="admin-form" novalidate>
        <div class="form-grid">${s.fields.map((f) => fieldHTML(f, item)).join('')}</div>
        <p class="form-note"><i class="fa-solid fa-database" aria-hidden="true"></i> Demonstração: os dados ficam salvos somente neste navegador. Em produção, serão gravados no banco de dados.</p>
        <div class="modal__actions">
          <button type="button" class="btn btn--ghost" data-modal-close>Cancelar</button>
          ${isNews ? `<button type="submit" class="btn btn--outline" data-action="rascunho"><i class="fa-regular fa-floppy-disk" aria-hidden="true"></i> Salvar rascunho</button>
            <button type="submit" class="btn btn--primary" data-action="publicado"><i class="fa-solid fa-upload" aria-hidden="true"></i> Publicar</button>`
            : '<button type="submit" class="btn btn--primary" data-action="salvar"><i class="fa-regular fa-floppy-disk" aria-hidden="true"></i> Salvar</button>'}
        </div>
      </form>`,
      onOpen(body) {
        const form = qs('#admin-form', body);
        form.addEventListener('click', (e) => { const b = e.target.closest('[data-action]'); if (b) form.dataset.action = b.dataset.action; });

        // upload de imagem com pré-visualização
        qsa('[data-image-input]', form).forEach((input) => {
          input.addEventListener('change', async () => {
            const file = input.files[0];
            if (!file) return;
            try {
              const data = await compressImage(file);
              const wrap = input.closest('.field-image');
              qs(`[name="${input.dataset.imageInput}__data"]`, wrap).value = data;
              qs('.field-image__preview', wrap).src = data;
              const text = qs(`[name="${input.dataset.imageInput}"]`, wrap);
              text.value = ''; text.removeAttribute('required'); text.placeholder = `Arquivo selecionado: ${file.name}`;
              Forms.validateField(text);
            } catch (err) { Utils.toast(err.message, 'error'); }
          });
        });
        qsa('.field-image input[type="text"]', form).forEach((t) => {
          t.addEventListener('change', () => { if (t.value) { qs('.field-image__preview', t.closest('.field-image')).src = asset(t.value); qs(`[name="${t.name}__data"]`, form).value = ''; } });
        });

        Forms.attach(form, {
          async onValid(raw) {
            const data = {};
            s.fields.forEach((f) => {
              let v = raw[f.name];
              if (f.type === 'checkbox') v = !!v;
              if (f.type === 'image') v = raw[`${f.name}__data`] || v;
              if (f.paragraphs) v = String(v).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
              if (f.type === 'list') v = String(v).split('\n').map((p) => p.trim()).filter(Boolean);
              data[f.name] = v;
            });
            if (isNews) data.status = form.dataset.action === 'rascunho' ? 'rascunho' : 'publicado';
            try {
              if (item) await API.update(resource, item.id, data);
              else await API.create(resource, data);
              const nome = data.titulo || data.nome || s.singular;
              log(`${item ? 'Editou' : 'Criou'} ${s.singular}: ${nome}${isNews ? ` (${data.status})` : ''}`);
              Utils.Modal.close();
              Utils.toast(isNews ? (data.status === 'publicado' ? 'Notícia publicada.' : 'Rascunho salvo.') : `${s.singular.charAt(0).toUpperCase() + s.singular.slice(1)} salvo(a).`, 'success');
              show(currentSection);
            } catch (err) { Utils.toast(err.message, 'error'); }
          }
        });
      }
    });
  }

  async function removeItem(resource, id) {
    const s = SCHEMAS[resource];
    const item = await API.get(resource, id);
    if (!item) return;
    const ok = await Utils.confirmDialog(`Excluir ${s.singular} "${item.titulo || item.nome}"? Esta ação não pode ser desfeita.`, { confirmText: 'Excluir', danger: true });
    if (!ok) return;
    await API.remove(resource, id);
    log(`Excluiu ${s.singular}: ${item.titulo || item.nome}`);
    Utils.toast('Registro excluído.', 'success');
    show(currentSection);
  }

  async function toggleStatus(resource, id) {
    const item = await API.get(resource, id);
    if (!item) return;
    const status = item.status === 'rascunho' ? 'publicado' : 'rascunho';
    await API.update(resource, id, { status });
    log(`${status === 'publicado' ? 'Publicou' : 'Despublicou'}: ${item.titulo}`);
    Utils.toast(status === 'publicado' ? 'Notícia publicada.' : 'Notícia movida para rascunhos.', 'success');
    show(currentSection);
  }

  /* =================== CONFIGURAÇÕES =================== */
  function renderConfig() {
    const c = SITE_CONFIG;
    content.innerHTML = `
      <div class="admin-grid">
        <section class="panel">
          <header class="panel__head"><h2>Aparência</h2></header>
          <p>Tema do painel e do site neste navegador.</p>
          <div class="btn-row">
            <button type="button" class="btn btn--ghost" data-theme-set="light"><i class="fa-solid fa-sun" aria-hidden="true"></i> Claro</button>
            <button type="button" class="btn btn--ghost" data-theme-set="dark"><i class="fa-solid fa-moon" aria-hidden="true"></i> Escuro</button>
          </div>
          <p class="field__help">As cores da identidade visual ficam em <code>css/style.css</code> (variáveis no início do arquivo).</p>
        </section>
        <section class="panel">
          <header class="panel__head"><h2>Dados da escola</h2></header>
          <dl class="config-list">
            <div><dt>Nome</dt><dd>${escapeHTML(c.nome)}</dd></div>
            <div><dt>Endereço</dt><dd>${escapeHTML(c.contato.endereco)}</dd></div>
            <div><dt>Telefone</dt><dd>${escapeHTML(c.contato.telefone)}</dd></div>
            <div><dt>E-mail</dt><dd>${escapeHTML(c.contato.email)}</dd></div>
          </dl>
          <p class="field__help">Edite esses dados em <code>js/data.js</code> (objeto <code>SITE_CONFIG</code>). Com backend, esta tela poderá salvá-los no banco.</p>
        </section>
        <section class="panel">
          <header class="panel__head"><h2>Dados de demonstração</h2></header>
          <p>Exporte tudo o que foi cadastrado neste navegador (JSON) ou restaure os dados originais de <code>js/data.js</code>.</p>
          <div class="btn-row">
            <button type="button" class="btn btn--outline" id="export-json"><i class="fa-solid fa-file-export" aria-hidden="true"></i> Exportar JSON</button>
            <button type="button" class="btn btn--danger" id="reset-data"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Restaurar dados originais</button>
          </div>
        </section>
        <section class="panel">
          <header class="panel__head"><h2>Integração (backend)</h2></header>
          <dl class="config-list">
            <div><dt>Modo</dt><dd>${API.CONFIG.USE_BACKEND ? 'API conectada' : 'Local (demonstração)'}</dd></div>
            <div><dt>URL da API</dt><dd><code>${escapeHTML(API.CONFIG.BASE_URL)}</code></dd></div>
          </dl>
          <p class="field__help">Para conectar ao banco de dados, configure <code>js/api.js</code> e siga <code>backend/README.md</code>.</p>
        </section>
      </div>
      <section class="panel">
        <header class="panel__head"><h2>Checklist antes de publicar em produção</h2></header>
        <ul class="checklist">
          <li>HTTPS ativo em todo o site (certificado válido).</li>
          <li>Login real no servidor com senhas em hash (bcrypt/argon2).</li>
          <li>Sessão em cookie HttpOnly + Secure + SameSite.</li>
          <li>Permissões (admin/editor) verificadas no backend em toda rota de escrita.</li>
          <li>Validação e sanitização de todos os dados recebidos no servidor.</li>
          <li>Proteção contra CSRF, limite de tentativas de login e CAPTCHA nos formulários.</li>
          <li>Upload de arquivos com verificação de tipo, tamanho e antivírus.</li>
          <li>Política de privacidade revisada e autorizações de uso de imagem (LGPD/ECA).</li>
          <li>Backups automáticos do banco de dados.</li>
          <li>Remover o login demonstrativo (js/auth.js) e os dados fictícios (js/data.js).</li>
        </ul>
      </section>`;

    content.querySelectorAll('[data-theme-set]').forEach((b) => b.addEventListener('click', () => Theme.set(b.dataset.themeSet)));
    qs('#export-json').addEventListener('click', async () => {
      const data = await API.exportAll();
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url; a.download = `honorio-fraga-dados-${todayISO()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      Utils.toast('Arquivo JSON gerado.', 'success');
    });
    qs('#reset-data').addEventListener('click', async () => {
      const ok = await Utils.confirmDialog('Restaurar os dados de demonstração? Tudo o que foi criado ou editado neste navegador será apagado.', { confirmText: 'Restaurar', danger: true });
      if (!ok) return;
      API.reset();
      Utils.store.remove('hf_admin_log');
      Utils.toast('Dados de demonstração restaurados.', 'success');
    });
  }

  /* =================== NAVEGAÇÃO =================== */
  let currentSection = 'dashboard';

  function show(section) {
    if (!SECTIONS.find((s) => s.id === section)) section = 'dashboard';
    currentSection = section;
    Utils.session.set('hf_admin_section', section);
    const meta = SECTIONS.find((s) => s.id === section);
    qs('#admin-title').textContent = meta.label;
    qsa('.admin-nav__btn').forEach((b) => {
      const on = b.dataset.section === section;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    qs('#admin-sidebar').classList.remove('is-open');
    qs('.admin-backdrop')?.classList.remove('is-open');
    if (section === 'dashboard') renderDashboard();
    else if (section === 'configuracoes') renderConfig();
    else renderResource(section);
  }

  function renderGuard() {
    qs('#admin-app').hidden = true;
    const g = qs('#admin-guard');
    g.hidden = false;
    g.innerHTML = `
      <div class="guard">
        <span class="guard__icon"><i class="fa-solid fa-lock" aria-hidden="true"></i></span>
        <h1>Acesso restrito</h1>
        <p>O painel administrativo é exclusivo para a equipe autorizada da escola.</p>
        <p class="notice notice--warning"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Nesta versão de demonstração, entre com o perfil <strong>Administrador</strong> na página de login (qualquer e-mail válido e senha com 6+ caracteres). Em produção o acesso será validado pelo servidor.</p>
        <div class="btn-row btn-row--center">
          <a class="btn btn--primary" href="login.html?perfil=admin&next=admin.html"><i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i> Entrar como administrador</a>
          <a class="btn btn--ghost" href="index.html">Voltar ao site</a>
        </div>
      </div>`;
  }

  function init() {
    content = qs('#admin-content');
    if (!content) return;

    // ⚠️ Verificação apenas no navegador (demonstração). Em produção, o
    // servidor deve recusar o acesso às rotas do painel sem sessão válida.
    sessao = Auth.require(['admin']);
    if (!sessao) { renderGuard(); return; }

    qs('#admin-app').hidden = false;
    qs('#admin-guard').hidden = true;
    qs('#admin-user').textContent = sessao.nome;

    const nav = qs('#admin-nav');
    nav.innerHTML = SECTIONS.map((s) => `<li><button type="button" class="admin-nav__btn" data-section="${s.id}"><i class="fa-solid ${s.icone}" aria-hidden="true"></i><span>${s.label}</span></button></li>`).join('');

    nav.addEventListener('click', (e) => { const b = e.target.closest('[data-section]'); if (b) show(b.dataset.section); });
    qs('#admin-menu-toggle').addEventListener('click', () => {
      qs('#admin-sidebar').classList.toggle('is-open');
      qs('.admin-backdrop').classList.toggle('is-open');
    });
    qs('.admin-backdrop').addEventListener('click', () => { qs('#admin-sidebar').classList.remove('is-open'); qs('.admin-backdrop').classList.remove('is-open'); });
    qs('#admin-logout').addEventListener('click', () => { Auth.logout(); Utils.toast('Sessão encerrada.', 'info'); setTimeout(() => Utils.go('login.html'), 400); });
    qs('#admin-theme').addEventListener('click', Theme.toggle);

    content.addEventListener('click', (e) => {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.go) show(t.dataset.go);
      else if (t.dataset.new) openForm(t.dataset.new);
      else if (t.dataset.edit) openForm(t.dataset.resource, t.dataset.edit);
      else if (t.dataset.delete) removeItem(t.dataset.resource, t.dataset.delete);
      else if (t.dataset.toggleStatus) toggleStatus(t.dataset.resource, t.dataset.toggleStatus);
    });

    show(Utils.session.get('hf_admin_section', 'dashboard'));
    Theme.syncIcon();
  }

  return { init };
})();
