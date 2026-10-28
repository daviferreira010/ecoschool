# Backend — plano de integração (ainda não implementado)

Esta pasta está reservada para o servidor do site. **Nada aqui roda ainda**: a versão atual é só frontend. Este documento descreve como ligar o site a um banco de dados sem reescrever as páginas.

## Arquitetura sugerida

```
Navegador (HTML + CSS + JS deste projeto)
        │  fetch() em JSON, via HTTPS, cookie de sessão HttpOnly
        ▼
API REST  ── Node.js (Express/Fastify) ou PHP (Laravel/Slim) ou Python (FastAPI/Django)
        │
        ▼
Banco de dados ── MySQL ou PostgreSQL
        +
Armazenamento de arquivos (imagens/PDFs) ── pasta protegida no servidor ou serviço de objetos
```

## Ponto de ligação no frontend

Todo acesso a dados passa por **`js/api.js`**:

```js
const CONFIG = {
  USE_BACKEND: true,                       // era false
  BASE_URL: 'https://SEU-DOMINIO/api'
};
```

As funções `API.list / get / create / update / remove` passam a chamar as rotas abaixo. As páginas não mudam.

## Rotas da API

| Método | Rota | Acesso |
|---|---|---|
| GET | `/api/noticias` · `/api/noticias/:id` | público (só `publicado`) |
| POST/PUT/DELETE | `/api/noticias[/:id]` | admin, editor |
| GET | `/api/eventos` (filtro `?mes=AAAA-MM`) | público |
| POST/PUT/DELETE | `/api/eventos[/:id]` | admin, editor |
| GET | `/api/projetos`, `/api/documentos`, `/api/galeria`, `/api/comunicados` | público |
| POST/PUT/DELETE | mesmos recursos | admin, editor |
| GET/POST/PUT/DELETE | `/api/usuarios` | admin |
| POST | `/api/auth/login` · `/api/auth/logout` · `GET /api/auth/me` | — |
| POST | `/api/auth/recuperar-senha` | público (com rate limit) |
| POST | `/api/contato` | público (CAPTCHA + rate limit) |
| POST | `/api/ouvidoria` | público (gera protocolo) |
| POST | `/api/uploads` | admin, editor (valida tipo/tamanho) |
| GET | `/api/alunos/:id/boletim` · `/frequencia` | o próprio aluno ou responsável vinculado |

## Tabelas sugeridas

```sql
usuarios     (id, nome, email UNIQUE, senha_hash, perfil, ativo, criado_em, ultimo_login)
noticias     (id, titulo, categoria, data, autor_id, imagem, resumo, conteudo, destaque, status, criado_em, atualizado_em)
eventos      (id, titulo, data, hora_inicio, hora_fim, local, descricao, categoria, tipo)
projetos     (id, nome, imagem, descricao, objetivo, data, periodo, participantes, area)
projeto_fotos(id, projeto_id, caminho, legenda)
documentos   (id, nome, descricao, data, tipo, categoria, arquivo)
galeria      (id, imagem, titulo, categoria)
comunicados  (id, titulo, mensagem, nivel, publico, data, ativo)
mensagens    (id, nome, email, telefone, assunto, mensagem, consentimento, ip, criado_em)
ouvidoria    (id, protocolo, nome, email, tipo, assunto, mensagem, status, resposta, criado_em)
```

Os campos seguem os objetos de `js/data.js`, então dá para importar os dados exportados pelo painel (**Configurações → Exportar JSON**).

## Segurança obrigatória

- HTTPS em tudo.
- Senhas com **bcrypt** ou **argon2**; nunca em texto puro.
- Sessão em cookie `HttpOnly; Secure; SameSite=Strict`; expiração e logout no servidor.
- **Permissões verificadas no servidor** em toda rota de escrita.
- Validação e sanitização de entrada; consultas parametrizadas (sem concatenar SQL).
- Proteção CSRF, rate limit no login e nos formulários, CAPTCHA nos públicos.
- Uploads: lista branca de tipos (JPG/PNG/WEBP/PDF), limite de tamanho, renomear arquivo, guardar fora da pasta pública quando possível.
- Credenciais do banco em variáveis de ambiente (`.env` fora do Git).
- Logs de acesso ao painel e backups automáticos.
- LGPD: coletar só o necessário, definir prazo de guarda e permitir que o titular peça acesso/exclusão.
