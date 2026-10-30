# EEEFM Honório Fraga — Site institucional

Site institucional da **EEEFM Honório Fraga** (Colatina – Espírito Santo), feito em **HTML, CSS e JavaScript puro**, com animações em **GSAP** e cena 3D em **Three.js**.

> ⚠️ **Conteúdo demonstrativo.** Notícias, eventos, projetos, documentos e números são **fictícios** e estão marcados como `[DEMONSTRAÇÃO]`, `[EXEMPLO]` ou `[INSERIR ...]`. Nenhum dado oficial (endereço, telefone, e-mail, nomes, números, datas) foi inventado. Substitua tudo antes de publicar.

---

## 1. Como abrir

### No computador (VS Code)
1. Abra a pasta `honorio-fraga/` no VS Code (**Arquivo → Abrir pasta**).
2. Dê dois cliques em `index.html`, ou use a extensão **Live Server** (botão direito → *Open with Live Server*).
3. O site funciona abrindo o arquivo direto, sem servidor.

> Com internet, o site carrega fontes, ícones, GSAP e Three.js por CDN. Sem internet ele continua funcionando, só que sem as animações e a cena 3D.

### No celular (prévia)
O arquivo **`preview/index.html`** é uma versão completa do site em **um único arquivo** (todas as páginas, estilos, scripts e imagens embutidos).

1. Envie `preview/index.html` para o celular (WhatsApp, e-mail, Google Drive, cabo USB…).
2. Abra o arquivo no navegador do celular (Chrome, Safari, Firefox).
   - Android: abra pelo app **Arquivos** → toque no arquivo → escolha o Chrome.
   - iPhone: salve em **Arquivos** → toque no arquivo (abre no visualizador) → compartilhar → abrir no Safari.
3. Navegue normalmente: as páginas viram rotas como `#noticias`, `#noticia-3`, `#eventos-calendario`.

Para gerar a prévia de novo depois de editar o site (precisa do [Node.js](https://nodejs.org)):

```bash
cd honorio-fraga
node tools/build-preview.js
```

---

## 2. Estrutura do projeto

```
honorio-fraga/
├── index.html            Página inicial (hero 3D, acessos rápidos, notícias, eventos…)
├── escola.html           A escola (história, missão, estrutura, galeria)
├── equipe.html           Equipe escolar
├── noticias.html         Lista de notícias (busca, filtros, destaques)
├── noticia.html          Notícia individual  → noticia.html?id=1
├── eventos.html          Eventos + calendário escolar (abas)
├── projetos.html         Projetos (cards, detalhes, galeria)
├── ensino.html           Etapas de ensino, cursos, componentes
├── alunos.html           Área do Aluno
├── responsaveis.html     Área dos Responsáveis
├── documentos.html       Documentos oficiais (visualizar/baixar)
├── contato.html          Contato + formulário + espaço para mapa
├── ouvidoria.html        Ouvidoria / Fale Conosco
├── login.html            Login (DEMONSTRATIVO)
├── admin.html            Painel administrativo (DEMONSTRATIVO)
├── privacidade.html      Política de Privacidade (LGPD)
│
├── css/
│   ├── style.css         Cores (variáveis), tipografia, botões, cards, modal…
│   ├── header.css        Topo e menu (hambúrguer no celular)
│   ├── footer.css        Rodapé
│   ├── home.css          Página inicial
│   ├── noticias.css      Notícias, equipe, ensino, documentos, áreas
│   ├── eventos.css       Eventos e calendário
│   ├── forms.css         Formulários, contato, ouvidoria, login
│   ├── admin.css         Painel administrativo
│   └── responsive.css    Ajustes por tamanho de tela
│
├── js/
│   ├── data.js           ⭐ DADOS DO SITE (configuração + conteúdo demo)
│   ├── api.js            ⭐ Camada de dados (ponto de ligação com o backend)
│   ├── utils.js          Funções gerais (escape, datas, modal, toasts…)
│   ├── menu.js           Header, menu mobile, rodapé, tema claro/escuro
│   ├── animations.js     GSAP/ScrollTrigger, inclinação 3D, carrossel
│   ├── hero3d.js         Cena 3D do topo (Three.js)
│   ├── forms.js          Validação de formulários
│   ├── noticias.js       Notícias
│   ├── eventos.js        Eventos e abas
│   ├── calendario.js     Calendário mensal
│   ├── galeria.js        Galeria e lightbox
│   ├── pages.js          Lógica das demais páginas
│   ├── auth.js           Login demonstrativo
│   ├── admin.js          Painel administrativo
│   └── main.js           Inicialização
│
├── assets/
│   ├── images/           Logo oficial, fundo do topo e fotos (placeholders "IMAGEM ILUSTRATIVA")
│   ├── icons/            Favicon e ícones
│   └── documentos/       PDFs (há um documento-exemplo.pdf)
│
├── backend/README.md     Plano para o backend e banco de dados
├── preview/index.html    Prévia em arquivo único (gerada)
└── tools/build-preview.js  Gera a prévia
```

Cada página HTML tem `<body data-page="...">`. O arquivo `js/main.js` usa esse valor para chamar a função certa. Header e rodapé são gerados por `js/menu.js` — **o menu é editado em um só lugar** (`NAV_ITEMS`).

---

## 3. Onde editar cada coisa

| O que | Onde |
|---|---|
| Nome, endereço, telefone, e-mail, horário, redes sociais | `js/data.js` → `SITE_CONFIG` |
| Números da escola (alunos, turmas…) | `js/data.js` → `SITE_CONFIG.numeros` (`valor: null` mostra "000") |
| Notícias, eventos, projetos, documentos, comunicados, galeria | `js/data.js` (arrays) — ou pelo painel |
| Equipe | `js/data.js` → `EQUIPE` |
| Etapas de ensino e cursos | `js/data.js` → `ENSINO` |
| Dados da LGPD (controlador, encarregado) | `js/data.js` → `SITE_CONFIG.lgpd` |
| Mapa do Google | `js/data.js` → `SITE_CONFIG.contato.mapaEmbedURL` |
| Cores do site (paleta de azuis `#dce3fe` → `#010f2e`) | `css/style.css` → início do arquivo: `--azul-50` … `--azul-900` |
| Itens do menu | `js/menu.js` → `NAV_ITEMS` |
| Textos fixos (história, missão…) | nos próprios arquivos `.html` (procure por `[INSERIR`) |

### Imagens
- Coloque as fotos em `assets/images/`.
- **Foto principal:** substitua `assets/images/escola.jpg` mantendo o mesmo nome (sugestão: 1600×900 px, JPG até ~300 KB).
- **Logotipo:** `assets/images/logo.png` (logo oficial, recortada em círculo com fundo transparente).
- **Fundo do topo:** `assets/images/hero-fundo.jpg` (imagem fixa nas cores da logo; pode ser trocada).
- Se uma imagem não existir, o site mostra automaticamente um placeholder "Imagem indisponível" (fallback em `js/utils.js`).
- Publique fotos de estudantes **somente com autorização dos responsáveis** (LGPD/ECA).

### Documentos
- Coloque os PDFs em `assets/documentos/`.
- Cadastre cada um em `js/data.js` → `DOCUMENTOS` (campo `arquivo: 'assets/documentos/nome.pdf'`).

### Mapa
No Google Maps: **Compartilhar → Incorporar um mapa → copiar o `src` do iframe** e colar em `mapaEmbedURL`.

---

## 4. Funcionalidades

- Menu hambúrguer, header fixo, barra de progresso, botão "voltar ao topo"
- Tema claro/escuro (segue o sistema; botão no topo)
- Topo da home em duas telas cheias sobre um fundo azul fixo: (1) identidade visual da escola (logo envolto por um globo 3D, nome, lema "Educando para o mundo!") e (2) carrossel "Acontece na escola" em tela cheia com as 5 notícias mais recentes (barra de progresso, pausar, setas, swipe e teclado); animações com GSAP/ScrollTrigger
- Cards com inclinação 3D no mouse, carrossel acessível (setas, pontos, swipe, teclado)
- Notícias com busca, filtros, destaques e página individual (`noticia.html?id=`)
- Eventos com filtros, "adicionar à agenda" (.ics) e calendário mensal com legenda/filtro
- Galeria com lightbox (teclado e swipe)
- Comunicados com níveis **Normal / Importante / Urgente** (urgentes aparecem no topo do site)
- Formulários com validação, máscara de telefone, contador de caracteres, anti-spam (honeypot) e aviso LGPD
- Login demonstrativo e painel com dashboard, gráficos e CRUD (criar, editar, excluir, publicar, rascunho)
- Acessibilidade: HTML semântico, `alt`, `aria-*`, foco visível, navegação por teclado, "pular para o conteúdo", respeito a "reduzir movimento"
- SEO: `title`, `description`, Open Graph, favicon

---

## 5. O que depende de backend (ainda NÃO funciona de verdade)

| Recurso | Situação atual |
|---|---|
| Envio de contato e ouvidoria | Só valida e mostra aviso de que **não foi enviado** |
| Login | Simulado com `localStorage` — **não é seguro** |
| Painel administrativo | Salva no `localStorage` **do navegador de quem editou** |
| Boletim, frequência, materiais | Dados fictícios |
| Upload de imagens/PDFs | Caminho manual (ou imagem reduzida salva no navegador) |
| Recuperação de senha | Mostra explicação |

Veja **`backend/README.md`** para a arquitetura sugerida e as rotas da API. A troca é feita em **`js/api.js`** (`CONFIG.USE_BACKEND = true`) sem mudar as páginas.

---

## 6. Segurança — antes de colocar em produção

- [ ] Hospedar com **HTTPS** (certificado válido) e redirecionar HTTP → HTTPS.
- [ ] Implementar login real no **servidor**, com senha em **hash** (bcrypt/argon2).
- [ ] Sessão em cookie **HttpOnly + Secure + SameSite** (nunca token sensível no `localStorage`).
- [ ] **Controle de permissões no backend** (admin, editor, aluno, responsável) em toda rota de escrita.
- [ ] Validar e **sanitizar** no servidor tudo o que chega dos formulários.
- [ ] Proteção contra CSRF, limite de tentativas (rate limit) e CAPTCHA nos formulários públicos.
- [ ] Nunca colocar senhas, chaves de API ou credenciais no JavaScript ou no repositório.
- [ ] Restringir `admin.html` no servidor (não basta esconder por JavaScript).
- [ ] Revisar a Política de Privacidade e as autorizações de uso de imagem (LGPD).
- [ ] Remover `js/auth.js` demonstrativo e os dados fictícios de `js/data.js`.
- [ ] Configurar backups do banco de dados.
- [ ] Opcional: cabeçalhos de segurança (Content-Security-Policy, X-Content-Type-Options, Referrer-Policy).

---

## 7. Como publicar

**Somente o site (sem backend)** — qualquer hospedagem de arquivos estáticos:
- GitHub Pages, Netlify, Vercel ou a hospedagem da instituição.
- Envie o conteúdo da pasta `honorio-fraga/` (a pasta `preview/` e `tools/` são opcionais).
- Ajuste as tags Open Graph (`og:image`) para URLs absolutas do domínio.

**Com backend** — ver `backend/README.md` (servidor Node.js/PHP/Python + MySQL/PostgreSQL). O frontend continua sendo estes mesmos arquivos.

---

## 8. Bibliotecas usadas (via CDN)

| Biblioteca | Uso | Obrigatória? |
|---|---|---|
| [GSAP 3.12.5](https://gsap.com) + ScrollTrigger | animações de entrada, contadores, parallax | Não (há fallback) |
| [Three.js r128](https://threejs.org) | cena 3D do hero (só na home) | Não |
| [Font Awesome 6.5.1](https://fontawesome.com) | ícones | Recomendada |
| Google Fonts (Bricolage Grotesque, Figtree, IBM Plex Mono) | tipografia | Não (há fontes de reserva) |

Não há React, Vue, Angular, nem Bootstrap.
