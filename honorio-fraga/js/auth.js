/* =====================================================================
   auth.js — LOGIN DEMONSTRATIVO
   ---------------------------------------------------------------------
   ⚠️⚠️  ATENÇÃO: ISTO NÃO É UM SISTEMA DE SEGURANÇA.  ⚠️⚠️
   Esta versão usa localStorage apenas para SIMULAR um login, para que
   seja possível navegar pela Área do Aluno, Responsáveis e Painel.
   Qualquer pessoa pode abrir o DevTools e alterar o localStorage.
   Nenhuma senha é verificada nem armazenada.

   O QUE IMPLEMENTAR ANTES DE IR PARA PRODUÇÃO:
   1. BACKEND: rota POST /api/auth/login que recebe e-mail e senha via HTTPS.
   2. BANCO DE DADOS: tabela "usuarios" (id, nome, email, senha_hash,
      perfil, ativo, criado_em, ultimo_login).
   3. HASH DE SENHA: bcrypt ou argon2 (nunca guardar senha em texto puro,
      nunca usar MD5/SHA1 sozinhos).
   4. SESSÃO/TOKEN: cookie de sessão HttpOnly + Secure + SameSite=Strict
      (ou JWT de curta duração com refresh token guardado em cookie
      HttpOnly). Nunca guardar token sensível no localStorage.
   5. CONTROLE DE PERMISSÕES: o SERVIDOR verifica o perfil (admin,
      editor, aluno, responsavel) em toda rota protegida.
   6. Proteções extras: limite de tentativas (rate limit), bloqueio
      temporário, recuperação de senha por e-mail com token de uso
      único, registro de acessos (logs) e 2FA para administradores.
   ===================================================================== */
const Auth = (() => {
  'use strict';
  const KEY = 'hf_demo_session';
  const DURACAO_MS = 8 * 60 * 60 * 1000; // 8 horas (demonstração)

  const PERFIS = {
    aluno: { nome: 'Estudante', destino: 'alunos.html' },
    responsavel: { nome: 'Responsável', destino: 'responsaveis.html' },
    admin: { nome: 'Administrador', destino: 'admin.html' }
  };

  function current() {
    const s = Utils.store.get(KEY, null);
    if (!s || !s.expira || Date.now() > s.expira) return null;
    return s;
  }

  /* Simula o login. Em produção, substitua por:
       const res = await fetch('/api/auth/login', { method:'POST', credentials:'include',
         headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, senha }) });
     e NÃO guarde a senha em lugar nenhum do frontend. */
  async function login({ email, perfil }) {
    const nome = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const sessao = { nome: `${nome} (demo)`, email, perfil, expira: Date.now() + DURACAO_MS, demo: true };
    Utils.store.set(KEY, sessao);
    return sessao;
  }

  function logout() { Utils.store.remove(KEY); }

  /* Proteção de página NO NAVEGADOR — apenas visual/demonstrativa.
     A proteção real deve ser feita no servidor. */
  function require(perfis) {
    const s = current();
    if (!s || (perfis && !perfis.includes(s.perfil))) return null;
    return s;
  }

  /* ---------- Página login.html ---------- */
  function initLoginPage() {
    const form = Utils.qs('#login-form');
    if (!form) return;
    const params = Utils.getParam('perfil');
    const select = Utils.qs('#login-perfil');
    if (params && PERFIS[params]) select.value = params;

    const s = current();
    const status = Utils.qs('#login-status');
    if (s && status) {
      status.hidden = false;
      status.innerHTML = `<p><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Sessão de demonstração ativa: <strong>${Utils.escapeHTML(s.nome)}</strong> (${Utils.escapeHTML(PERFIS[s.perfil]?.nome || s.perfil)}).</p>
        <div class="login-status__actions"><a class="btn btn--primary btn--sm" href="${PERFIS[s.perfil]?.destino || 'index.html'}">Continuar</a>
        <button type="button" class="btn btn--ghost btn--sm" id="logout-btn">Sair</button></div>`;
      Utils.qs('#logout-btn').addEventListener('click', () => { logout(); status.hidden = true; Utils.toast('Você saiu da sessão de demonstração.', 'info'); });
    }

    // mostrar/ocultar senha
    const toggle = Utils.qs('#toggle-password');
    const pass = Utils.qs('#login-senha');
    toggle && toggle.addEventListener('click', () => {
      const show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(show));
      toggle.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      toggle.innerHTML = `<i class="fa-regular ${show ? 'fa-eye-slash' : 'fa-eye'}" aria-hidden="true"></i>`;
    });

    Forms.attach(form, {
      async onValid(data) {
        const btn = form.querySelector('[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Entrando...';
        // A senha digitada é descartada aqui: nada é salvo.
        pass.value = '';
        const sessao = await login({ email: data.email, perfil: data.perfil });
        Utils.toast(`Login de demonstração como ${PERFIS[sessao.perfil].nome}.`, 'success');
        const next = Utils.getParam('next');
        const destino = next && /^[a-z]+\.html$/.test(next) ? next : PERFIS[sessao.perfil].destino;
        setTimeout(() => Utils.go(destino), 600);
      }
    });

    Utils.qs('#forgot-link').addEventListener('click', (e) => {
      e.preventDefault();
      Utils.Modal.open({
        title: 'Recuperar senha',
        html: `<p>A recuperação de senha <strong>depende do backend</strong> e ainda não está disponível nesta versão.</p>
          <p>Em produção, o fluxo será: informar o e-mail → o servidor envia um link com token de uso único e validade curta → o usuário cria uma nova senha.</p>
          <p>Enquanto isso, procure a secretaria da escola.</p>
          <div class="modal__actions"><a class="btn btn--primary" href="contato.html">Ver contatos da escola</a></div>`
      });
    });
  }

  return { current, login, logout, require, initLoginPage, PERFIS };
})();
