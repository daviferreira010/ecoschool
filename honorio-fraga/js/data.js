/* =====================================================================
   data.js — DADOS DO SITE (configuração + conteúdo demonstrativo)
   ---------------------------------------------------------------------
   ⚠️  TODO O CONTEÚDO ABAIXO MARCADO COMO "DEMONSTRAÇÃO" É FICTÍCIO.
   Ele existe apenas para visualizar o sistema funcionando.
   Antes de publicar o site, substitua pelos dados oficiais da escola.

   - Textos entre [COLCHETES] são campos a preencher pela instituição.
   - Nenhum número, nome, endereço, telefone ou data oficial foi inventado.
   - No futuro, estes arrays serão substituídos por respostas da API
     (veja js/api.js e backend/README.md). O restante do site não
     precisará mudar, porque todas as páginas leem os dados pela API.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. CONFIGURAÇÃO GERAL DA ESCOLA
   --------------------------------------------------------------------- */
const SITE_CONFIG = {
  nome: 'EEEFM Honório Fraga',
  nomeCompleto: 'Escola Estadual de Ensino Fundamental e Médio Honório Fraga',
  cidade: 'Colatina',
  uf: 'ES',
  estado: 'Espírito Santo',
  slogan: 'Educação que transforma, conhecimento que abre caminhos.',
  // Lema e ano de fundação conforme o logotipo oficial da escola
  lema: 'Educando para o mundo!',
  fundacao: 1962,
  anoCopyright: 2026,

  // Caminhos de imagens institucionais (substitua os arquivos mantendo o nome)
  logo: 'assets/images/logo.png',
  fotoPrincipal: 'assets/images/escola.jpg',

  // CONTATO — preencha com os dados oficiais
  contato: {
    endereco: '[INSERIR ENDEREÇO OFICIAL]',
    bairro: '[INSERIR BAIRRO]',
    cep: '[INSERIR CEP]',
    telefone: '[INSERIR TELEFONE]',
    whatsapp: '[INSERIR WHATSAPP]',
    email: '[INSERIR E-MAIL]',
    horario: '[INSERIR HORÁRIO DE ATENDIMENTO]',
    // Cole aqui o link de incorporação do Google Maps (iframe "src").
    // Ex.: 'https://www.google.com/maps/embed?pb=...'
    mapaEmbedURL: '',
    // Link "Abrir no Google Maps" (opcional)
    mapaLinkURL: ''
  },

  // REDES SOCIAIS — deixe vazio ('') para ocultar o ícone
  redes: {
    instagram: '',
    facebook: '',
    youtube: ''
  },

  // Responsável pelo tratamento de dados / encarregado (LGPD)
  lgpd: {
    controlador: '[INSERIR NOME DO CONTROLADOR — ex.: órgão/secretaria responsável]',
    encarregado: '[INSERIR NOME DO ENCARREGADO PELO TRATAMENTO DE DADOS]',
    emailEncarregado: '[INSERIR E-MAIL DO ENCARREGADO]',
    atualizadoEm: '[INSERIR DATA DA ÚLTIMA ATUALIZAÇÃO]'
  },

  /* NÚMEROS DA ESCOLA
     valor: null  -> exibe "000" (placeholder, ainda não informado)
     valor: 850   -> exibe o número com animação de contagem
     ⚠️ Informe apenas números oficiais. */
  numeros: [
    { icone: 'fa-user-graduate', rotulo: 'Alunos', valor: null, sufixo: '+' },
    { icone: 'fa-chalkboard-user', rotulo: 'Professores', valor: null, sufixo: '' },
    { icone: 'fa-people-group', rotulo: 'Turmas', valor: null, sufixo: '' },
    { icone: 'fa-lightbulb', rotulo: 'Projetos', valor: null, sufixo: '' },
    // Calculado a partir do ano de fundação (1962, conforme o logotipo)
    { icone: 'fa-calendar-check', rotulo: 'Anos de atuação', valor: new Date().getFullYear() - 1962, sufixo: '' }
  ]
};

/* ---------------------------------------------------------------------
   2. CATEGORIAS (usadas em filtros, cores e ícones)
   --------------------------------------------------------------------- */
const CATEGORIAS_NOTICIA = ['Institucional', 'Pedagógico', 'Eventos', 'Projetos', 'Esportes', 'Cultura', 'Comunicados'];

const CATEGORIAS_EVENTO = {
  academico:  { nome: 'Acadêmico',  icone: 'fa-book-open' },
  esportivo:  { nome: 'Esportivo',  icone: 'fa-futbol' },
  cultural:   { nome: 'Cultural',   icone: 'fa-masks-theater' },
  reuniao:    { nome: 'Reunião',    icone: 'fa-people-arrows' },
  comunicado: { nome: 'Comunicado', icone: 'fa-bullhorn' },
  projeto:    { nome: 'Projeto',    icone: 'fa-lightbulb' }
};

// Tipos que aparecem no calendário escolar (cores definidas em css/eventos.css)
const TIPOS_CALENDARIO = {
  evento:    { nome: 'Evento',     icone: 'fa-star' },
  prova:     { nome: 'Prova / Avaliação', icone: 'fa-file-pen' },
  reuniao:   { nome: 'Reunião',    icone: 'fa-people-arrows' },
  feriado:   { nome: 'Feriado',    icone: 'fa-umbrella-beach' },
  atividade: { nome: 'Atividade escolar', icone: 'fa-pencil' }
};

const CATEGORIAS_DOCUMENTO = {
  escolares:   { nome: 'Documentos escolares', icone: 'fa-folder-open' },
  calendario:  { nome: 'Calendário',           icone: 'fa-calendar-days' },
  regimento:   { nome: 'Regimento',            icone: 'fa-scale-balanced' },
  projetos:    { nome: 'Projetos',             icone: 'fa-lightbulb' },
  formularios: { nome: 'Formulários',          icone: 'fa-file-signature' },
  comunicados: { nome: 'Comunicados',          icone: 'fa-bullhorn' }
};

const CATEGORIAS_GALERIA = {
  escola: 'Escola', eventos: 'Eventos', projetos: 'Projetos', alunos: 'Alunos', atividades: 'Atividades'
};

/* ---------------------------------------------------------------------
   3. NOTÍCIAS — DEMONSTRAÇÃO (substituir)
   status: 'publicado' | 'rascunho'
   conteudo: array de parágrafos (texto simples; o site escapa o HTML)
   --------------------------------------------------------------------- */
const NOTICIAS = [
  {
    id: 1,
    titulo: '[DEMONSTRAÇÃO] Início das inscrições para a Feira de Ciências',
    categoria: 'Projetos',
    data: '2026-10-26',
    autor: 'Equipe de Comunicação (exemplo)',
    imagem: 'assets/images/noticia-1.jpg',
    resumo: 'Notícia fictícia para demonstrar o layout. Estudantes podem inscrever seus trabalhos até a data definida pela coordenação.',
    conteudo: [
      'Este é um texto de demonstração. Ele mostra como uma notícia completa aparece no portal da escola, com título, imagem, categoria, data e autor.',
      'Substitua este conteúdo pela notícia oficial. No painel administrativo (admin.html) é possível criar, editar, publicar e excluir notícias nesta versão demonstrativa.',
      'Quando o backend for implementado, as notícias passarão a ser salvas em banco de dados e aparecerão para todos os visitantes.'
    ],
    destaque: true,
    status: 'publicado'
  },
  {
    id: 2,
    titulo: '[DEMONSTRAÇÃO] Reunião de pais e responsáveis do período letivo',
    categoria: 'Comunicados',
    data: '2026-10-21',
    autor: 'Coordenação Pedagógica (exemplo)',
    imagem: 'assets/images/noticia-2.jpg',
    resumo: 'Exemplo de comunicado em formato de notícia. Data, horário e pauta devem ser informados pela escola.',
    conteudo: [
      'Texto ilustrativo. Informe aqui a data, o horário, o local e a pauta da reunião com as famílias.',
      'Recomenda-se publicar também um comunicado no sistema de comunicados, para que ele apareça na Área dos Responsáveis.'
    ],
    destaque: true,
    status: 'publicado'
  },
  {
    id: 3,
    titulo: '[DEMONSTRAÇÃO] Jogos interclasse movimentam a escola',
    categoria: 'Esportes',
    data: '2026-10-14',
    autor: 'Equipe de Educação Física (exemplo)',
    imagem: 'assets/images/noticia-3.jpg',
    resumo: 'Modelo de notícia esportiva. Use este espaço para registrar torneios, resultados e participação dos estudantes.',
    conteudo: [
      'Conteúdo fictício para demonstração do layout de notícias esportivas.',
      'Ao publicar fotos de estudantes, verifique a autorização de uso de imagem assinada pelos responsáveis (LGPD e ECA).'
    ],
    destaque: false,
    status: 'publicado'
  },
  {
    id: 4,
    titulo: '[DEMONSTRAÇÃO] Biblioteca recebe novos títulos para empréstimo',
    categoria: 'Pedagógico',
    data: '2026-10-07',
    autor: 'Biblioteca (exemplo)',
    imagem: 'assets/images/noticia-4.jpg',
    resumo: 'Notícia de exemplo sobre o acervo da biblioteca escolar. Substitua pelo texto oficial.',
    conteudo: [
      'Texto de exemplo. Descreva aqui as novidades do acervo, o horário de funcionamento da biblioteca e as regras de empréstimo.'
    ],
    destaque: false,
    status: 'publicado'
  },
  {
    id: 5,
    titulo: '[DEMONSTRAÇÃO] Mostra cultural reúne apresentações dos estudantes',
    categoria: 'Cultura',
    data: '2026-09-30',
    autor: 'Equipe de Comunicação (exemplo)',
    imagem: 'assets/images/noticia-5.jpg',
    resumo: 'Exemplo de cobertura de evento cultural, com galeria de fotos e relato da atividade.',
    conteudo: [
      'Conteúdo fictício. Relate aqui como foi o evento, quem participou e quais foram os destaques.'
    ],
    destaque: false,
    status: 'publicado'
  },
  {
    id: 6,
    titulo: '[DEMONSTRAÇÃO] Orientações sobre o uso do uniforme escolar',
    categoria: 'Institucional',
    data: '2026-09-22',
    autor: 'Direção (exemplo)',
    imagem: 'assets/images/noticia-6.jpg',
    resumo: 'Modelo de notícia institucional. Informe as orientações oficiais definidas pela escola.',
    conteudo: [
      'Texto de demonstração para notícias institucionais.'
    ],
    destaque: false,
    status: 'publicado'
  }
];

/* ---------------------------------------------------------------------
   4. EVENTOS E CALENDÁRIO — DEMONSTRAÇÃO (substituir)
   categoria: chave de CATEGORIAS_EVENTO
   tipo: chave de TIPOS_CALENDARIO (cor no calendário)
   Feriados nacionais listados devem ser conferidos com o calendário
   oficial da rede estadual antes da publicação.
   --------------------------------------------------------------------- */
const EVENTOS = [
  { id: 1, titulo: 'Feriado — Finados', data: '2026-11-02', horaInicio: '', horaFim: '', local: '—', descricao: 'Feriado nacional. Confirme no calendário oficial da rede estadual.', categoria: 'comunicado', tipo: 'feriado' },
  { id: 2, titulo: '[DEMO] Reunião de pais e responsáveis', data: '2026-11-05', horaInicio: '18:30', horaFim: '20:00', local: '[INSERIR LOCAL]', descricao: 'Evento fictício para demonstração. Pauta e horário oficiais a definir.', categoria: 'reuniao', tipo: 'reuniao' },
  { id: 3, titulo: '[DEMO] Avaliações do período — 1ª semana', data: '2026-11-09', horaInicio: '07:00', horaFim: '11:30', local: 'Salas de aula', descricao: 'Exemplo de período de avaliações. Cronograma por turma a ser divulgado.', categoria: 'academico', tipo: 'prova' },
  { id: 4, titulo: '[DEMO] Avaliações do período — 2ª semana', data: '2026-11-16', horaInicio: '07:00', horaFim: '11:30', local: 'Salas de aula', descricao: 'Exemplo de período de avaliações.', categoria: 'academico', tipo: 'prova' },
  { id: 5, titulo: 'Feriado — Proclamação da República', data: '2026-11-15', horaInicio: '', horaFim: '', local: '—', descricao: 'Feriado nacional. Confirme no calendário oficial.', categoria: 'comunicado', tipo: 'feriado' },
  { id: 6, titulo: 'Feriado — Dia da Consciência Negra', data: '2026-11-20', horaInicio: '', horaFim: '', local: '—', descricao: 'Feriado nacional. Confirme no calendário oficial.', categoria: 'comunicado', tipo: 'feriado' },
  { id: 7, titulo: '[DEMO] Feira de Ciências', data: '2026-11-25', horaInicio: '08:00', horaFim: '16:00', local: '[INSERIR LOCAL]', descricao: 'Evento fictício para demonstrar a exibição de eventos de projeto.', categoria: 'projeto', tipo: 'evento' },
  { id: 8, titulo: '[DEMO] Torneio interclasse — finais', data: '2026-11-27', horaInicio: '13:00', horaFim: '17:00', local: 'Quadra (exemplo)', descricao: 'Exemplo de evento esportivo.', categoria: 'esportivo', tipo: 'evento' },
  { id: 9, titulo: '[DEMO] Conselho de Classe', data: '2026-12-03', horaInicio: '13:30', horaFim: '17:30', local: '[INSERIR LOCAL]', descricao: 'Exemplo de reunião pedagógica interna.', categoria: 'reuniao', tipo: 'reuniao' },
  { id: 10, titulo: '[DEMO] Mostra cultural de encerramento', data: '2026-12-10', horaInicio: '19:00', horaFim: '21:00', local: '[INSERIR LOCAL]', descricao: 'Exemplo de evento cultural aberto à comunidade.', categoria: 'cultural', tipo: 'evento' },
  { id: 11, titulo: '[DEMO] Entrega de resultados finais', data: '2026-12-15', horaInicio: '08:00', horaFim: '12:00', local: 'Secretaria (exemplo)', descricao: 'Exemplo de atividade escolar.', categoria: 'academico', tipo: 'atividade' },
  { id: 12, titulo: 'Feriado — Natal', data: '2026-12-25', horaInicio: '', horaFim: '', local: '—', descricao: 'Feriado nacional.', categoria: 'comunicado', tipo: 'feriado' },
  { id: 13, titulo: '[DEMO] Mostra de projetos de leitura', data: '2026-10-16', horaInicio: '09:00', horaFim: '11:00', local: 'Biblioteca (exemplo)', descricao: 'Exemplo de evento já realizado.', categoria: 'projeto', tipo: 'atividade' }
];

/* ---------------------------------------------------------------------
   5. PROJETOS — DEMONSTRAÇÃO (substituir)
   --------------------------------------------------------------------- */
const PROJETOS = [
  {
    id: 1,
    nome: '[EXEMPLO] Projeto de Leitura',
    imagem: 'assets/images/projeto-1.jpg',
    descricao: 'Descrição fictícia de um projeto de incentivo à leitura. Substitua pelo projeto real desenvolvido pela escola.',
    objetivo: '[DESCREVER O OBJETIVO DO PROJETO]',
    data: '2026-03-01',
    periodo: '[INSERIR PERÍODO]',
    participantes: '[INSERIR TURMAS / PARTICIPANTES]',
    area: 'Linguagens',
    galeria: ['assets/images/galeria-1.jpg', 'assets/images/galeria-2.jpg', 'assets/images/galeria-3.jpg']
  },
  {
    id: 2,
    nome: '[EXEMPLO] Feira de Ciências',
    imagem: 'assets/images/projeto-2.jpg',
    descricao: 'Modelo de apresentação de projeto científico com estudantes. Texto demonstrativo.',
    objetivo: '[DESCREVER O OBJETIVO DO PROJETO]',
    data: '2026-08-10',
    periodo: '[INSERIR PERÍODO]',
    participantes: '[INSERIR TURMAS / PARTICIPANTES]',
    area: 'Ciências da Natureza',
    galeria: ['assets/images/galeria-4.jpg', 'assets/images/galeria-5.jpg']
  },
  {
    id: 3,
    nome: '[EXEMPLO] Horta e Sustentabilidade',
    imagem: 'assets/images/projeto-3.jpg',
    descricao: 'Exemplo de projeto ambiental. Substitua pelas informações oficiais.',
    objetivo: '[DESCREVER O OBJETIVO DO PROJETO]',
    data: '2026-04-15',
    periodo: '[INSERIR PERÍODO]',
    participantes: '[INSERIR TURMAS / PARTICIPANTES]',
    area: 'Meio ambiente',
    galeria: ['assets/images/galeria-6.jpg', 'assets/images/galeria-7.jpg']
  },
  {
    id: 4,
    nome: '[EXEMPLO] Tecnologia e Programação',
    imagem: 'assets/images/projeto-4.jpg',
    descricao: 'Modelo de projeto de tecnologia com estudantes. Conteúdo demonstrativo.',
    objetivo: '[DESCREVER O OBJETIVO DO PROJETO]',
    data: '2026-05-20',
    periodo: '[INSERIR PERÍODO]',
    participantes: '[INSERIR TURMAS / PARTICIPANTES]',
    area: 'Tecnologia',
    galeria: ['assets/images/galeria-8.jpg', 'assets/images/galeria-9.jpg']
  }
];

/* ---------------------------------------------------------------------
   6. DOCUMENTOS — DEMONSTRAÇÃO (substituir)
   Coloque os PDFs em assets/documentos/ e ajuste o campo "arquivo".
   Todos apontam para um PDF de exemplo enquanto não houver arquivos oficiais.
   --------------------------------------------------------------------- */
const DOCUMENTOS = [
  { id: 1, nome: '[EXEMPLO] Calendário escolar', descricao: 'Calendário letivo do ano. Substitua pelo arquivo oficial.', data: '2026-02-01', tipo: 'PDF', categoria: 'calendario', arquivo: 'assets/documentos/documento-exemplo.pdf' },
  { id: 2, nome: '[EXEMPLO] Regimento escolar', descricao: 'Normas de funcionamento da escola.', data: '2026-02-01', tipo: 'PDF', categoria: 'regimento', arquivo: 'assets/documentos/documento-exemplo.pdf' },
  { id: 3, nome: '[EXEMPLO] Lista de materiais', descricao: 'Materiais solicitados por etapa de ensino.', data: '2026-01-20', tipo: 'PDF', categoria: 'escolares', arquivo: 'assets/documentos/documento-exemplo.pdf' },
  { id: 4, nome: '[EXEMPLO] Requerimento de declaração', descricao: 'Formulário para solicitar declarações na secretaria.', data: '2026-03-05', tipo: 'PDF', categoria: 'formularios', arquivo: 'assets/documentos/documento-exemplo.pdf' },
  { id: 5, nome: '[EXEMPLO] Autorização de uso de imagem', descricao: 'Termo para os responsáveis autorizarem fotos e vídeos.', data: '2026-02-10', tipo: 'PDF', categoria: 'formularios', arquivo: 'assets/documentos/documento-exemplo.pdf' },
  { id: 6, nome: '[EXEMPLO] Projeto Político-Pedagógico', descricao: 'Documento que orienta a proposta pedagógica da escola.', data: '2026-02-15', tipo: 'PDF', categoria: 'projetos', arquivo: 'assets/documentos/documento-exemplo.pdf' },
  { id: 7, nome: '[EXEMPLO] Comunicado — reunião de responsáveis', descricao: 'Comunicado oficial em PDF.', data: '2026-10-20', tipo: 'PDF', categoria: 'comunicados', arquivo: 'assets/documentos/documento-exemplo.pdf' },
  { id: 8, nome: '[EXEMPLO] Ficha de atualização cadastral', descricao: 'Atualização de dados de contato dos responsáveis.', data: '2026-02-01', tipo: 'PDF', categoria: 'escolares', arquivo: 'assets/documentos/documento-exemplo.pdf' }
];

/* ---------------------------------------------------------------------
   7. COMUNICADOS — DEMONSTRAÇÃO (substituir)
   nivel: 'normal' | 'importante' | 'urgente'
   publico: 'todos' | 'alunos' | 'responsaveis'
   --------------------------------------------------------------------- */
const COMUNICADOS = [
  { id: 1, titulo: '[DEMO] Reunião de pais e responsáveis', mensagem: 'Exemplo de comunicado. Informe aqui data, horário e local oficiais.', nivel: 'importante', data: '2026-10-27', publico: 'responsaveis', ativo: true },
  { id: 2, titulo: '[DEMO] Alteração no horário de saída', mensagem: 'Exemplo de comunicado urgente exibido no topo do site.', nivel: 'urgente', data: '2026-10-28', publico: 'todos', ativo: true },
  { id: 3, titulo: '[DEMO] Prazo para entrega de trabalhos', mensagem: 'Exemplo de comunicado para estudantes.', nivel: 'normal', data: '2026-10-24', publico: 'alunos', ativo: true },
  { id: 4, titulo: '[DEMO] Atualização de cadastro', mensagem: 'Exemplo: responsáveis devem manter telefone e e-mail atualizados na secretaria.', nivel: 'normal', data: '2026-10-18', publico: 'responsaveis', ativo: true }
];

/* ---------------------------------------------------------------------
   8. GALERIA — IMAGENS ILUSTRATIVAS (substituir por fotos oficiais)
   Antes de publicar fotos de estudantes, confira as autorizações de uso
   de imagem assinadas pelos responsáveis.
   --------------------------------------------------------------------- */
const GALERIA = [
  { id: 1, imagem: 'assets/images/galeria-1.jpg', titulo: 'Imagem ilustrativa 1', categoria: 'escola' },
  { id: 2, imagem: 'assets/images/galeria-2.jpg', titulo: 'Imagem ilustrativa 2', categoria: 'eventos' },
  { id: 3, imagem: 'assets/images/galeria-3.jpg', titulo: 'Imagem ilustrativa 3', categoria: 'projetos' },
  { id: 4, imagem: 'assets/images/galeria-4.jpg', titulo: 'Imagem ilustrativa 4', categoria: 'atividades' },
  { id: 5, imagem: 'assets/images/galeria-5.jpg', titulo: 'Imagem ilustrativa 5', categoria: 'alunos' },
  { id: 6, imagem: 'assets/images/galeria-6.jpg', titulo: 'Imagem ilustrativa 6', categoria: 'projetos' },
  { id: 7, imagem: 'assets/images/galeria-7.jpg', titulo: 'Imagem ilustrativa 7', categoria: 'escola' },
  { id: 8, imagem: 'assets/images/galeria-8.jpg', titulo: 'Imagem ilustrativa 8', categoria: 'eventos' },
  { id: 9, imagem: 'assets/images/galeria-9.jpg', titulo: 'Imagem ilustrativa 9', categoria: 'atividades' }
];

/* ---------------------------------------------------------------------
   9. EQUIPE — CAMPOS A PREENCHER (não inventar nomes)
   foto: caminho opcional (ex.: 'assets/images/equipe/nome.jpg')
   --------------------------------------------------------------------- */
const EQUIPE = [
  { grupo: 'Direção', membros: [
    { nome: '[NOME DO(A) DIRETOR(A)]', cargo: 'Diretor(a) escolar', foto: '' }
  ]},
  { grupo: 'Coordenação e Pedagogia', membros: [
    { nome: '[NOME]', cargo: 'Coordenador(a) pedagógico(a)', foto: '' },
    { nome: '[NOME]', cargo: 'Pedagogo(a)', foto: '' },
    { nome: '[NOME]', cargo: 'Coordenador(a) de turno', foto: '' }
  ]},
  { grupo: 'Secretaria e Apoio', membros: [
    { nome: '[NOME]', cargo: 'Secretário(a) escolar', foto: '' },
    { nome: '[NOME]', cargo: 'Bibliotecário(a)', foto: '' }
  ]},
  { grupo: 'Professores', membros: [
    { nome: '[NOME]', cargo: '[COMPONENTE CURRICULAR]', foto: '' },
    { nome: '[NOME]', cargo: '[COMPONENTE CURRICULAR]', foto: '' },
    { nome: '[NOME]', cargo: '[COMPONENTE CURRICULAR]', foto: '' },
    { nome: '[NOME]', cargo: '[COMPONENTE CURRICULAR]', foto: '' }
  ]}
];

/* ---------------------------------------------------------------------
   10. ENSINO — CONFIGURÁVEL (confirmar com a secretaria da escola)
   A sigla EEEFM indica "Ensino Fundamental e Médio", mas as etapas,
   turnos e cursos efetivamente ofertados devem ser confirmados.
   --------------------------------------------------------------------- */
const ENSINO = {
  modalidades: [
    { icone: 'fa-school', titulo: '[ETAPA DE ENSINO 1]', descricao: '[DESCREVER — ex.: anos/séries ofertados, turno e duração]', turno: '[TURNO]' },
    { icone: 'fa-graduation-cap', titulo: '[ETAPA DE ENSINO 2]', descricao: '[DESCREVER — ex.: anos/séries ofertados, turno e duração]', turno: '[TURNO]' },
    { icone: 'fa-moon', titulo: '[OUTRA MODALIDADE, SE HOUVER]', descricao: '[DESCREVER OU REMOVER ESTE ITEM]', turno: '[TURNO]' }
  ],
  cursos: [
    { titulo: '[NOME DO CURSO / ITINERÁRIO]', descricao: '[DESCREVER O CURSO, SE A ESCOLA OFERTAR]' },
    { titulo: '[NOME DO CURSO / ITINERÁRIO]', descricao: '[DESCREVER O CURSO, SE A ESCOLA OFERTAR]' }
  ],
  // Áreas do conhecimento previstas na BNCC (referência nacional).
  // Ajuste os componentes conforme a matriz curricular da escola.
  componentes: [
    { area: 'Linguagens', icone: 'fa-language', itens: ['[COMPONENTE]', '[COMPONENTE]', '[COMPONENTE]'] },
    { area: 'Matemática', icone: 'fa-square-root-variable', itens: ['[COMPONENTE]'] },
    { area: 'Ciências da Natureza', icone: 'fa-flask', itens: ['[COMPONENTE]', '[COMPONENTE]'] },
    { area: 'Ciências Humanas', icone: 'fa-earth-americas', itens: ['[COMPONENTE]', '[COMPONENTE]'] }
  ],
  projetosPedagogicos: [
    { titulo: '[PROJETO PEDAGÓGICO]', descricao: '[DESCREVER]' },
    { titulo: '[PROJETO PEDAGÓGICO]', descricao: '[DESCREVER]' },
    { titulo: '[PROJETO PEDAGÓGICO]', descricao: '[DESCREVER]' }
  ],
  atividades: [
    { icone: 'fa-futbol', titulo: '[ATIVIDADE ESPORTIVA]' },
    { icone: 'fa-music', titulo: '[ATIVIDADE ARTÍSTICA]' },
    { icone: 'fa-microscope', titulo: '[ATIVIDADE CIENTÍFICA]' },
    { icone: 'fa-book', titulo: '[REFORÇO / MONITORIA]' }
  ]
};

/* ---------------------------------------------------------------------
   11. USUÁRIOS DO PAINEL — DEMONSTRAÇÃO
   ⚠️ Não há senhas aqui. Senhas NUNCA devem ficar no frontend.
   Em produção os usuários ficam no banco de dados, com senha em hash
   (bcrypt/argon2) e permissões verificadas no servidor.
   --------------------------------------------------------------------- */
const USUARIOS = [
  { id: 1, nome: 'Administrador (demo)', email: 'admin@exemplo.local', perfil: 'admin', ativo: true },
  { id: 2, nome: 'Editor de notícias (demo)', email: 'editor@exemplo.local', perfil: 'editor', ativo: true },
  { id: 3, nome: 'Secretaria (demo)', email: 'secretaria@exemplo.local', perfil: 'editor', ativo: false }
];
