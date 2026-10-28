/* =====================================================================
   api.js — CAMADA DE DADOS (ponto único de acesso aos dados)
   ---------------------------------------------------------------------
   Todas as páginas pedem dados por aqui: API.list('noticias'),
   API.get('noticias', 3), API.create(...), API.update(...), API.remove(...).

   HOJE (versão frontend):
     - Os dados iniciais vêm de js/data.js.
     - Alterações feitas no painel ficam no localStorage DO NAVEGADOR
       de quem editou (só para demonstração; outros visitantes não veem).

   FUTURO (com backend):
     1. Mude CONFIG.USE_BACKEND para true.
     2. Ajuste CONFIG.BASE_URL (ex.: 'https://www.suaescola.es.gov.br/api').
     3. Implemente no servidor as rotas REST abaixo:
          GET    /api/:recurso            -> lista
          GET    /api/:recurso/:id        -> item
          POST   /api/:recurso            -> cria   (requer login/permissão)
          PUT    /api/:recurso/:id        -> atualiza (requer login/permissão)
          DELETE /api/:recurso/:id        -> exclui (requer login/permissão)
     4. O token de sessão deve ir em cookie HttpOnly + Secure (preferível)
        ou no cabeçalho Authorization. NUNCA confie apenas no frontend:
        o servidor deve validar permissões em TODA requisição de escrita.
   ===================================================================== */
const API = (() => {
  'use strict';

  const CONFIG = {
    USE_BACKEND: false,
    BASE_URL: '/api',
    STORAGE_PREFIX: 'hf_db_v1_'
  };

  // Dados iniciais (demonstração) — vindos de js/data.js
  const SEEDS = {
    noticias: typeof NOTICIAS !== 'undefined' ? NOTICIAS : [],
    eventos: typeof EVENTOS !== 'undefined' ? EVENTOS : [],
    projetos: typeof PROJETOS !== 'undefined' ? PROJETOS : [],
    documentos: typeof DOCUMENTOS !== 'undefined' ? DOCUMENTOS : [],
    comunicados: typeof COMUNICADOS !== 'undefined' ? COMUNICADOS : [],
    galeria: typeof GALERIA !== 'undefined' ? GALERIA : [],
    usuarios: typeof USUARIOS !== 'undefined' ? USUARIOS : []
  };

  const clone = (v) => JSON.parse(JSON.stringify(v));

  /* ---------- modo local (demonstração) ---------- */
  function readLocal(resource) {
    const saved = Utils.store.get(CONFIG.STORAGE_PREFIX + resource, null);
    return Array.isArray(saved) ? saved : clone(SEEDS[resource] || []);
  }

  function writeLocal(resource, list) {
    const ok = Utils.store.set(CONFIG.STORAGE_PREFIX + resource, list);
    if (!ok) throw new Error('Não foi possível salvar no navegador (armazenamento cheio ou bloqueado).');
  }

  /* ---------- modo backend (futuro) ---------- */
  async function request(path, options = {}) {
    const res = await fetch(CONFIG.BASE_URL + path, {
      credentials: 'include', // envia o cookie de sessão
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      ...options
    });
    if (!res.ok) throw new Error(`Erro ${res.status} ao acessar ${path}`);
    return res.status === 204 ? null : res.json();
  }

  /* ---------- API pública ---------- */
  async function list(resource) {
    if (CONFIG.USE_BACKEND) return request(`/${resource}`);
    return readLocal(resource);
  }

  async function get(resource, id) {
    if (CONFIG.USE_BACKEND) return request(`/${resource}/${encodeURIComponent(id)}`);
    return readLocal(resource).find((item) => String(item.id) === String(id)) || null;
  }

  async function create(resource, data) {
    if (CONFIG.USE_BACKEND) return request(`/${resource}`, { method: 'POST', body: JSON.stringify(data) });
    const items = readLocal(resource);
    const nextId = items.reduce((max, i) => Math.max(max, Number(i.id) || 0), 0) + 1;
    const item = { ...data, id: nextId };
    items.unshift(item);
    writeLocal(resource, items);
    return item;
  }

  async function update(resource, id, data) {
    if (CONFIG.USE_BACKEND) return request(`/${resource}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
    const items = readLocal(resource);
    const idx = items.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) throw new Error('Item não encontrado.');
    items[idx] = { ...items[idx], ...data, id: items[idx].id };
    writeLocal(resource, items);
    return items[idx];
  }

  async function remove(resource, id) {
    if (CONFIG.USE_BACKEND) return request(`/${resource}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    writeLocal(resource, readLocal(resource).filter((i) => String(i.id) !== String(id)));
    return true;
  }

  // Restaura os dados de demonstração (apaga alterações locais)
  function reset(resource) {
    const keys = resource ? [resource] : Object.keys(SEEDS);
    keys.forEach((k) => Utils.store.remove(CONFIG.STORAGE_PREFIX + k));
  }

  // Exporta tudo em JSON (útil para migrar ao banco de dados)
  async function exportAll() {
    const out = {};
    for (const k of Object.keys(SEEDS)) out[k] = await list(k);
    return out;
  }

  /* ---------- Atalhos usados pelo site público ---------- */
  const helpers = {
    // Somente notícias publicadas, da mais recente para a mais antiga
    async noticiasPublicadas() {
      const items = await list('noticias');
      return items.filter((n) => n.status !== 'rascunho').sort((a, b) => String(b.data).localeCompare(String(a.data)));
    },
    async eventosOrdenados() {
      const items = await list('eventos');
      return items.sort((a, b) => (a.data + (a.horaInicio || '')).localeCompare(b.data + (b.horaInicio || '')));
    },
    async proximosEventos(limite = 3) {
      const hoje = Utils.todayISO();
      return (await helpers.eventosOrdenados()).filter((e) => e.data >= hoje).slice(0, limite);
    },
    // publico: 'alunos' | 'responsaveis' | undefined (todos)
    async comunicadosAtivos(publico) {
      const ordem = { urgente: 0, importante: 1, normal: 2 };
      const items = await list('comunicados');
      return items
        .filter((c) => c.ativo !== false)
        .filter((c) => !publico || c.publico === 'todos' || c.publico === publico)
        .sort((a, b) => (ordem[a.nivel] - ordem[b.nivel]) || String(b.data).localeCompare(String(a.data)));
    }
  };

  return { CONFIG, list, get, create, update, remove, reset, exportAll, ...helpers };
})();
