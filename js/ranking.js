// =========================================================
// ECOSCHOOL — RANKING
// =========================================================


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const rankingContent =
        document.getElementById("ranking-content");

    const abas =
        document.querySelectorAll(".ranking-tab");


    if (!rankingContent) {
        return;
    }


    // =====================================================
    // FOTO PADRÃO
    // =====================================================

    const FOTO_PADRAO =
        "https://cdn-icons-png.flaticon.com/512/847/847969.png";


    // =====================================================
    // PEGAR USUÁRIO LOGADO
    // =====================================================

    function pegarUsuario() {

        try {

            return JSON.parse(
                localStorage.getItem("user")
            ) || {};

        } catch (erro) {

            console.error(
                "Erro ao carregar usuário:",
                erro
            );

            return {};

        }

    }


    // =====================================================
    // USUÁRIO
    // =====================================================

    const usuario =
        pegarUsuario();


    const escolaAluno =
        usuario.escola || "";


    const turmaAluno =
        usuario.turma || "";


    const nomeAluno =
        usuario.nome || "";


    const fotoAluno =
        localStorage.getItem("fotoPerfil") ||
        FOTO_PADRAO;


    // =====================================================
    // DADOS DO ALUNO
    // =====================================================

    function pegarDadosAluno() {

        try {

            const dados =
                JSON.parse(
                    localStorage.getItem(
                        "ecoSchoolDados"
                    )
                ) || {};


            return {

                pontos:
                    Number(dados.pontos) || 0,

                reciclado:
                    Number(dados.reciclado) || 0,

                coletas:
                    Number(
                        dados.coletasRealizadas
                    ) || 0

            };

        } catch (erro) {

            return {

                pontos: 0,

                reciclado: 0,

                coletas: 0

            };

        }

    }


    const dadosAluno =
        pegarDadosAluno();


    // =====================================================
    // FORMATAR NÚMEROS
    // =====================================================

    function formatarNumero(numero) {

        return Number(numero).toLocaleString(
            "pt-BR"
        );

    }


    // =====================================================
    // ESCOLAS
    // =====================================================

    const escolas = [

        {
            nome: "EEEFM Geraldo Vargas Nogueira",
            cidade: "Colatina",
            pontos: 18500,
            reciclado: 9320
        },

        {
            nome: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 17900,
            reciclado: 8950
        },

        {
            nome: "EEEFM Rubens Rangel",
            cidade: "Colatina",
            pontos: 17450,
            reciclado: 8610
        },

        {
            nome: "EEEFM Professora Néa Monteiro Costa",
            cidade: "Colatina",
            pontos: 16800,
            reciclado: 8230
        },

        {
            nome: "CEEFMTI Conde de Linhares",
            cidade: "Colatina",
            pontos: 16150,
            reciclado: 7900
        },

        {
            nome: "EEEFM Águas do Rio Doce",
            cidade: "Colatina",
            pontos: 15680,
            reciclado: 7540
        },

        {
            nome: "CEEMTI Baixo Guandu",
            cidade: "Baixo Guandu",
            pontos: 15120,
            reciclado: 7210
        },

        {
            nome: "EEEFM Dr. Jones dos Santos Neves",
            cidade: "Baixo Guandu",
            pontos: 14650,
            reciclado: 6940
        },

        {
            nome: "EEEFM Sebastiana Grilo",
            cidade: "Pancas",
            pontos: 14180,
            reciclado: 6710
        },

        {
            nome: "EEEFM Araribóia",
            cidade: "Pancas",
            pontos: 13740,
            reciclado: 6480
        },

        {
            nome: "EEEFM Januário Ribeiro",
            cidade: "Pancas",
            pontos: 13290,
            reciclado: 6210
        },

        {
            nome: "EEUEF Madre Cristina",
            cidade: "Pancas",
            pontos: 12750,
            reciclado: 5940
        },

        {
            nome: "EEEFM Professor Carlos Mendes",
            cidade: "Governador Lindenberg",
            pontos: 12380,
            reciclado: 5720
        },

        {
            nome: "EEEFM Professor Santos Pinto",
            cidade: "Governador Lindenberg",
            pontos: 11950,
            reciclado: 5480
        },

        {
            nome: "EEEFM São Domingos",
            cidade: "São Domingos do Norte",
            pontos: 11580,
            reciclado: 5260
        },

        {
            nome: "EEEFM Felício Melotti",
            cidade: "São Roque do Canaã",
            pontos: 11190,
            reciclado: 5030
        },

        {
            nome: "EEEFM Padre Antônio Volkers",
            cidade: "Marilândia",
            pontos: 10850,
            reciclado: 4870
        },

        {
            nome: "EEEFM Fabiano Francisco Tomasini",
            cidade: "Itaguaçu",
            pontos: 10420,
            reciclado: 4630
        },

        {
            nome: "EEEFM Alto Jatibocas",
            cidade: "Itarana",
            pontos: 10080,
            reciclado: 4420
        },

        {
            nome: "EEEFM Profª Aleyde Cosme",
            cidade: "Itarana",
            pontos: 9740,
            reciclado: 4210
        },

        {
            nome: "EEEFM Pastor Antônio Nunes de Carvalho",
            cidade: "Alto Rio Novo",
            pontos: 9410,
            reciclado: 4050
        },

        {
            nome: "EEEFM João Bley",
            cidade: "Castelo",
            pontos: 9080,
            reciclado: 3890
        }

    ];


    // =====================================================
    // DADOS DAS TURMAS
    // =====================================================

    const turmas = [

        // HONÓRIO FRAGA

        {
            nome: "2º INFO A",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 4850
        },

        {
            nome: "2º INFO B",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 4310
        },

        {
            nome: "3º INFO A",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 3980
        },

        {
            nome: "1º INFO A",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 3520
        },


        // GERALDO VARGAS

        {
            nome: "2º ADM A",
            escola: "EEEFM Geraldo Vargas Nogueira",
            cidade: "Colatina",
            pontos: 4320
        },

        {
            nome: "1º ADM A",
            escola: "EEEFM Geraldo Vargas Nogueira",
            cidade: "Colatina",
            pontos: 3910
        },

        {
            nome: "3º ADM A",
            escola: "EEEFM Geraldo Vargas Nogueira",
            cidade: "Colatina",
            pontos: 3550
        },


        // RUBENS RANGEL

        {
            nome: "2º INFO B",
            escola: "EEEFM Rubens Rangel",
            cidade: "Colatina",
            pontos: 3410
        },

        {
            nome: "3º ADM A",
            escola: "EEEFM Rubens Rangel",
            cidade: "Colatina",
            pontos: 3180
        },


        // PROFESSORA NÉA

        {
            nome: "2º ADM B",
            escola: "EEEFM Professora Néa Monteiro Costa",
            cidade: "Colatina",
            pontos: 3710
        },

        {
            nome: "1º INFO A",
            escola: "EEEFM Professora Néa Monteiro Costa",
            cidade: "Colatina",
            pontos: 3290
        },


        // CONDE DE LINHARES

        {
            nome: "2º INFO A",
            escola: "CEEFMTI Conde de Linhares",
            cidade: "Colatina",
            pontos: 3560
        },

        {
            nome: "3º ADM A",
            escola: "CEEFMTI Conde de Linhares",
            cidade: "Colatina",
            pontos: 3010
        },


        // ÁGUAS DO RIO DOCE

        {
            nome: "1º INFO B",
            escola: "EEEFM Águas do Rio Doce",
            cidade: "Colatina",
            pontos: 3150
        },

        {
            nome: "2º ADM A",
            escola: "EEEFM Águas do Rio Doce",
            cidade: "Colatina",
            pontos: 2840
        },


        // BAIXO GUANDU

        {
            nome: "1º INFO B",
            escola: "CEEMTI Baixo Guandu",
            cidade: "Baixo Guandu",
            pontos: 3970
        },

        {
            nome: "2º ADM A",
            escola: "CEEMTI Baixo Guandu",
            cidade: "Baixo Guandu",
            pontos: 3420
        },


        // JONES DOS SANTOS NEVES

        {
            nome: "1º ADM A",
            escola: "EEEFM Dr. Jones dos Santos Neves",
            cidade: "Baixo Guandu",
            pontos: 3180
        },

        {
            nome: "2º INFO A",
            escola: "EEEFM Dr. Jones dos Santos Neves",
            cidade: "Baixo Guandu",
            pontos: 2960
        },


        // SEBASTIANA GRILO

        {
            nome: "3º ADM A",
            escola: "EEEFM Sebastiana Grilo",
            cidade: "Pancas",
            pontos: 3640
        },

        {
            nome: "2º INFO A",
            escola: "EEEFM Sebastiana Grilo",
            cidade: "Pancas",
            pontos: 3120
        },


        // ARARIBÓIA

        {
            nome: "3º INFO A",
            escola: "EEEFM Araribóia",
            cidade: "Pancas",
            pontos: 2950
        },

        {
            nome: "2º ADM A",
            escola: "EEEFM Araribóia",
            cidade: "Pancas",
            pontos: 2670
        }

    ];


    // =====================================================
    // ALUNOS
    // =====================================================

    const alunos = [

        // HONÓRIO FRAGA

        {
            nome: "Gabriel Almeida",
            escola: "EEEFM Honório Fraga",
            turma: "2º INFO A",
            pontos: 1250,
            foto: null
        },

        {
            nome: "Mariana Oliveira",
            escola: "EEEFM Honório Fraga",
            turma: "2º INFO B",
            pontos: 1180,
            foto: null
        },

        {
            nome: "Lucas Santos",
            escola: "EEEFM Honório Fraga",
            turma: "3º INFO A",
            pontos: 1090,
            foto: null
        },

        {
            nome: "Ana Beatriz",
            escola: "EEEFM Honório Fraga",
            turma: "1º INFO A",
            pontos: 1020,
            foto: null
        },


        // GERALDO VARGAS

        {
            nome: "João Pedro",
            escola: "EEEFM Geraldo Vargas Nogueira",
            turma: "2º ADM A",
            pontos: 950,
            foto: null
        },

        {
            nome: "Larissa Souza",
            escola: "EEEFM Geraldo Vargas Nogueira",
            turma: "1º ADM A",
            pontos: 880,
            foto: null
        },

        {
            nome: "Pedro Henrique",
            escola: "EEEFM Geraldo Vargas Nogueira",
            turma: "3º ADM A",
            pontos: 810,
            foto: null
        },


        // RUBENS RANGEL

        {
            nome: "Julia Martins",
            escola: "EEEFM Rubens Rangel",
            turma: "2º INFO B",
            pontos: 760,
            foto: null
        },

        {
            nome: "Matheus Costa",
            escola: "EEEFM Rubens Rangel",
            turma: "3º ADM A",
            pontos: 710,
            foto: null
        },


        // PROFESSORA NÉA

        {
            nome: "Beatriz Ferreira",
            escola: "EEEFM Professora Néa Monteiro Costa",
            turma: "2º ADM B",
            pontos: 650,
            foto: null
        },


        // BAIXO GUANDU

        {
            nome: "Rafael Oliveira",
            escola: "CEEMTI Baixo Guandu",
            turma: "1º INFO B",
            pontos: 690,
            foto: null
        },

        {
            nome: "Beatriz Lima",
            escola: "CEEMTI Baixo Guandu",
            turma: "2º ADM A",
            pontos: 640,
            foto: null
        },


        // JONES

        {
            nome: "Carlos Eduardo",
            escola: "EEEFM Dr. Jones dos Santos Neves",
            turma: "1º ADM A",
            pontos: 610,
            foto: null
        },


        // SEBASTIANA

        {
            nome: "Isabela Ferreira",
            escola: "EEEFM Sebastiana Grilo",
            turma: "3º ADM A",
            pontos: 590,
            foto: null
        },


        // ARARIBÓIA

        {
            nome: "Gustavo Alves",
            escola: "EEEFM Araribóia",
            turma: "3º INFO A",
            pontos: 560,
            foto: null
        }

    ];

// =====================================================
// ADICIONAR 350 ALUNOS FICTÍCIOS — HONÓRIO FRAGA
// =====================================================

const nomesGerados = [
    "Adriano", "Alex", "Alice", "Amanda", "André",
    "Arthur", "Beatriz", "Brenda", "Bruno", "Caio",
    "Camila", "Carolina", "Cauã", "Cecília", "Daniel",
    "Danilo", "Davi", "Diego", "Eduarda", "Eduardo",
    "Emanuel", "Enzo", "Erick", "Estevão", "Felipe",
    "Fernando", "Gabriel", "Guilherme", "Gustavo", "Heitor",
    "Henrique", "Igor", "Isabela", "Júlia", "João",
    "José", "Kauã", "Lara", "Larissa", "Laura",
    "Leonardo", "Letícia", "Lívia", "Lucas", "Luana",
    "Manoela", "Marcelo", "Mariana", "Matheus", "Miguel"
];

const sobrenomesGerados = [
    "Alves",
    "Barbosa",
    "Carvalho",
    "Costa",
    "Ferreira",
    "Oliveira",
    "Santos"
];

const turmasHonorioRanking = [
    "1V01 Informática",
    "1V02 Informática",
    "1V03 Informática",
    "1V04 Informática",
    "1V05 Informática",
    "2V01 Regular",
    "2V01 Informática",
    "2V02 Informática",
    "2V03 Informática",
    "2V04 Informática",
    "3V01 Informática",
    "3V02 Informática"
];

let contadorAlunosGerados = 0;

for (let i = 0; i < nomesGerados.length; i++) {

    for (let j = 0; j < sobrenomesGerados.length; j++) {

        if (contadorAlunosGerados >= 350) {
            break;
        }

        const nomeCompleto =
            `${nomesGerados[i]} ${sobrenomesGerados[j]}`;

        // Evita duplicar alunos que já existem na lista
        const jaExiste =
            alunos.some(
                aluno =>
                    aluno.nome.toLowerCase() ===
                    nomeCompleto.toLowerCase()
            );

        if (jaExiste) {
            continue;
        }

        const turma =
            turmasHonorioRanking[
                contadorAlunosGerados %
                turmasHonorioRanking.length
            ];

       const pontos =
    100 +
    (contadorAlunosGerados * 17) % 800;

        alunos.push({
            nome: nomeCompleto,
            escola: "EEEFM Honório Fraga",
            turma: turma,
            pontos: pontos,
            foto: null
        });

        contadorAlunosGerados++;
    }

    if (contadorAlunosGerados >= 350) {
        break;
    }
}
    // =====================================================
    // ADICIONAR O ALUNO LOGADO
    // =====================================================

    if (
        nomeAluno &&
        escolaAluno
    ) {

        const alunoExistente =
            alunos.find(
                aluno =>
                    aluno.nome.toLowerCase() ===
                    nomeAluno.toLowerCase() &&
                    aluno.escola.toLowerCase() ===
                    escolaAluno.toLowerCase()
            );


        if (alunoExistente) {

            alunoExistente.pontos =
                dadosAluno.pontos;

            alunoExistente.turma =
                turmaAluno;

            alunoExistente.foto =
                fotoAluno;

        } else {

            alunos.push({

                nome: nomeAluno,

                escola: escolaAluno,

                turma:
                    turmaAluno ||
                    "Turma não informada",

                pontos:
                    dadosAluno.pontos,

                foto:
                    fotoAluno

            });

        }

    }

// =====================================================
// ESCOLAS COM PONTOS ATUALIZADOS DO ALUNO
// =====================================================

function obterEscolasAtualizadas() {

    const dados =
        pegarDadosAluno();

    return escolas.map(function (escola) {

        if (
            escola.nome.toLowerCase() ===
            escolaAluno.toLowerCase()
        ) {

            return {
                ...escola,

                pontos:
                    escola.pontos +
                    dados.pontos,

                reciclado:
                    escola.reciclado +
                    dados.reciclado
            };
        }

        return {
            ...escola
        };
    });
}
    // =====================================================
// ATUALIZAR MINHA ESCOLA
// =====================================================

function atualizarMinhaEscola() {

    const escolasAtualizadas =
        obterEscolasAtualizadas();

    const escolaEncontrada =
        escolasAtualizadas.find(
            escola =>
                escola.nome.toLowerCase() ===
                escolaAluno.toLowerCase()
        );


    const elementoNome =
        document.getElementById("minhaEscola");


    const elementoCidade =
        document.getElementById("minhaCidade");


    const elementoPosicao =
        document.getElementById("posicaoMinhaEscola");


    const elementoPontos =
        document.getElementById("minhaEscolaPontos");


    const elementoReciclado =
        document.getElementById("minhaEscolaReciclado");


    const elementoMeusPontos =
        document.getElementById("meusPontos");


    // NOME
    if (elementoNome) {

        elementoNome.textContent =
            escolaEncontrada
                ? escolaEncontrada.nome
                : escolaAluno ||
                  "Escola não informada";
    }


    // CIDADE
    if (elementoCidade) {

        elementoCidade.innerHTML = `

            <i class="fa-solid fa-location-dot"></i>

            ${
                escolaEncontrada
                    ? escolaEncontrada.cidade
                    : "Localização não informada"
            }

            - ES
        `;
    }


    // PONTOS DA ESCOLA
    if (elementoPontos) {

        elementoPontos.textContent =
            escolaEncontrada
                ? formatarNumero(
                    escolaEncontrada.pontos
                )
                : "0";
    }


    // KG RECICLADOS
    if (elementoReciclado) {

        elementoReciclado.textContent =
            escolaEncontrada
                ? `${formatarNumero(
                    escolaEncontrada.reciclado
                )} kg`
                : "0 kg";
    }


    // PONTOS DO ALUNO
    if (elementoMeusPontos) {

        elementoMeusPontos.textContent =
            formatarNumero(
                dadosAluno.pontos
            );
    }


    // POSIÇÃO DA ESCOLA
    const rankingEscolas =
        [...escolasAtualizadas].sort(
            (a, b) =>
                b.pontos - a.pontos
        );


    const posicao =
        rankingEscolas.findIndex(
            escola =>
                escola.nome.toLowerCase() ===
                escolaAluno.toLowerCase()
        ) + 1;


    if (elementoPosicao) {

        elementoPosicao.textContent =
            posicao > 0
                ? `#${posicao}`
                : "#-";
    }
}
    // =====================================================
// RANKING ESTADUAL
// =====================================================

function gerarRankingEscolas() {

    const escolasAtualizadas =
        obterEscolasAtualizadas();


    const lista =
        [...escolasAtualizadas].sort(
            (a, b) =>
                b.pontos - a.pontos
        );


    const primeiro =
        lista[0];

    const segundo =
        lista[1];

    const terceiro =
        lista[2];


    let html = `

        <div class="ranking-section-title">

            <div>

                <span>
                    RANKING GERAL
                </span>

                <h2>
                    Escolas em destaque
                </h2>

            </div>

            <div class="ranking-section-title-icon">

                <img
                    src="./img/minhalogo.png"
                    alt="Eco School"
                >

            </div>

        </div>


        <div class="podium">

            <!-- SEGUNDO -->

            <article class="podium-card second">

                <div class="podium-place">
                    2
                </div>

                <div class="podium-medal">
                    <i class="fa-solid fa-medal"></i>
                </div>

                <h3>
                    ${segundo.nome}
                </h3>

                <small>
                    ${segundo.cidade}
                </small>

                <div class="podium-points">

                    ${formatarNumero(
                        segundo.pontos
                    )}

                    <span>
                        pontos
                    </span>

                </div>

            </article>


            <!-- PRIMEIRO -->

            <article class="podium-card first">

                <div class="podium-place">
                    1
                </div>

                <div class="podium-medal">
                    <i class="fa-solid fa-trophy"></i>
                </div>

                <h3>
                    ${primeiro.nome}
                </h3>

                <small>
                    ${primeiro.cidade}
                </small>

                <div class="podium-points">

                    ${formatarNumero(
                        primeiro.pontos
                    )}

                    <span>
                        pontos
                    </span>

                </div>

            </article>


            <!-- TERCEIRO -->

            <article class="podium-card third">

                <div class="podium-place">
                    3
                </div>

                <div class="podium-medal">
                    <i class="fa-solid fa-medal"></i>
                </div>

                <h3>
                    ${terceiro.nome}
                </h3>

                <small>
                    ${terceiro.cidade}
                </small>

                <div class="podium-points">

                    ${formatarNumero(
                        terceiro.pontos
                    )}

                    <span>
                        pontos
                    </span>

                </div>

            </article>

        </div>


        <div class="ranking-list">

    `;


    lista
        .slice(3)
        .forEach(
            (escola, index) => {

                const posicao =
                    index + 4;


                const atual =
                    escola.nome.toLowerCase() ===
                    escolaAluno.toLowerCase();


                html += `

                    <article class="
                        ranking-item
                        ${atual ? "current" : ""}
                    ">

                        <div class="rank-number">
                            ${posicao}
                        </div>


                        <div class="rank-icon">
                            <i class="fa-solid fa-school"></i>
                        </div>


                        <div class="rank-info">

                            <strong>

                                ${escola.nome}

                                ${
                                    atual
                                        ? `
                                            <span class="you-badge">
                                                SUA ESCOLA
                                            </span>
                                          `
                                        : ""
                                }

                            </strong>


                            <span>

                                ${escola.cidade}

                                •

                                ${formatarNumero(
                                    escola.reciclado
                                )}

                                kg reciclados

                            </span>

                        </div>


                        <div class="rank-points">

                            <strong>

                                ${formatarNumero(
                                    escola.pontos
                                )}

                            </strong>

                            <span>
                                pontos
                            </span>

                        </div>

                    </article>

                `;
            }
        );


    html += `

        </div>

    `;


    rankingContent.innerHTML =
        html;
}
    // =====================================================
    // RANKING DE TURMAS
    // =====================================================

   function gerarRankingTurmas() {

    const usuario =
        JSON.parse(localStorage.getItem("user")) || {};

    const escolaAluno =
        usuario.escola || "";

    // =====================================================
    // TURMAS DA EEEFM HONÓRIO FRAGA
    // =====================================================

    const turmasHonorioFraga = [
        {
            nome: "1V01 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "1V02 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "1V03 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "1V04 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "1V05 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "2V01 Regular",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "2V01 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "2V02 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "2V03 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "2V04 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "3V01 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        },
        {
            nome: "3V02 Informática",
            escola: "EEEFM Honório Fraga",
            cidade: "Colatina",
            pontos: 0
        }
    ];

    // =====================================================
    // VERIFICAR ESCOLA
    // =====================================================

    if (
        escolaAluno.toLowerCase() !==
        "EEEFM Honório Fraga".toLowerCase()
    ) {

        rankingContent.innerHTML = `
            <div class="ranking-empty">
                <i class="fa-solid fa-school"></i>

                <h3>Turmas ainda não cadastradas</h3>

                <p>
                    As turmas desta escola ainda não foram
                    cadastradas no ranking.
                </p>
            </div>
        `;

        return;
    }

    // =====================================================
    // PEGAR TURMA DO ALUNO LOGADO
    // =====================================================

    const turmaAluno =
        usuario.turma || "";

    // =====================================================
    // GERAR PONTUAÇÃO
    // =====================================================

    const turmas = turmasHonorioFraga.map(function (turma) {

        let pontos = 0;

        // A turma do aluno recebe os pontos dele
        if (
            turma.nome.toLowerCase() ===
            turmaAluno.toLowerCase()
        ) {

            const dados =
                JSON.parse(
                    localStorage.getItem("ecoSchoolDados")
                ) || {};

            pontos =
                Number(dados.pontos) || 0;
        }

        return {
            ...turma,
            pontos: pontos
        };

    });

    // =====================================================
    // ORDENAR
    // =====================================================

    turmas.sort(function (a, b) {
        return b.pontos - a.pontos;
    });

    // =====================================================
    // GERAR HTML
    // =====================================================

    let html = `
        <div class="ranking-list">
    `;

    turmas.forEach(function (turma, index) {

        const posicao = index + 1;

        const ehMinhaTurma =
            turma.nome.toLowerCase() ===
            turmaAluno.toLowerCase();

        html += `
            <article class="ranking-school-item">

                <div class="rank-number">
                    ${posicao}
                </div>

                <div class="rank-school-icon">
                    <i class="fa-solid fa-layer-group"></i>
                </div>

                <div class="rank-school-info">

                    <strong>
                        ${turma.nome}

                        ${
                            ehMinhaTurma
                                ? `
                                    <span class="voce-badge">
                                        VOCÊ
                                    </span>
                                  `
                                : ""
                        }
                    </strong>

                    <span>
                        ${turma.escola}
                        •
                        ${turma.cidade}
                    </span>

                </div>

                <div class="rank-points">

                    <strong>
                        ${formatarNumero(turma.pontos)}
                    </strong>

                    <span>
                        pontos
                    </span>

                </div>

            </article>
        `;
    });

    html += `
        </div>
    `;

    rankingContent.innerHTML = html;
}

    // =====================================================
    // RANKING DE ALUNOS
    // =====================================================

    function gerarRankingAlunos() {

        // -----------------------------------------------
        // FILTRA SOMENTE A ESCOLA
        // -----------------------------------------------

        const lista =
            alunos
                .filter(
                    aluno =>
                        aluno.escola.toLowerCase() ===
                        escolaAluno.toLowerCase()
                )
                .sort(
                    (a, b) =>
                        b.pontos - a.pontos
                );


        // -----------------------------------------------
        // NENHUM ALUNO
        // -----------------------------------------------

        if (
            !escolaAluno ||
            lista.length === 0
        ) {

            rankingContent.innerHTML = `

                <div class="ranking-empty">

                    <i class="fa-solid fa-user-group"></i>

                    <h3>
                        Nenhum aluno encontrado
                    </h3>

                    <p>
                        Não encontramos alunos cadastrados
                        para sua escola.
                    </p>

                </div>

            `;

            return;

        }


        // -----------------------------------------------
        // POSIÇÃO DO ALUNO
        // -----------------------------------------------

        const posicaoAluno =
            lista.findIndex(
                aluno =>
                    aluno.nome.toLowerCase() ===
                    nomeAluno.toLowerCase()
            ) + 1;


        let html = `

            <div class="ranking-section-title">

                <div>

                    <span>
                        RANKING DA ESCOLA
                    </span>

                    <h2>
                        Alunos — ${escolaAluno}
                    </h2>

                </div>

                <div class="ranking-section-title-icon">

                    <i class="fa-solid fa-user-group"></i>

                </div>

            </div>


            <div class="student-summary">

                <div>

                    <span>
                        SUA POSIÇÃO
                    </span>

                    <strong>
                        #${posicaoAluno > 0
                            ? posicaoAluno
                            : "-"}
                    </strong>

                </div>


                <div>

                    <span>
                        SEUS PONTOS
                    </span>

                    <strong>
                        ${formatarNumero(
                            dadosAluno.pontos
                        )}
                    </strong>

                </div>

            </div>


            <div class="ranking-list">

        `;


        lista.forEach(
            (aluno, index) => {

                const posicao =
                    index + 1;


                const atual =
                    aluno.nome.toLowerCase() ===
                    nomeAluno.toLowerCase();


                const foto =
                    aluno.foto ||
                    FOTO_PADRAO;


                html += `

                    <article class="
                        ranking-item
                        ${atual ? "current" : ""}
                    ">


                        <div class="rank-number">

                            ${posicao}

                        </div>


                        <div class="student-rank-info">

                            <img
                                class="student-photo"
                                src="${foto}"
                                alt="Foto de ${aluno.nome}"
                                onerror="this.src='${FOTO_PADRAO}'"
                            >

                        </div>


                        <div class="rank-info student-text">

                            <strong>

                                ${aluno.nome}

                                ${
                                    atual
                                        ? `<span class="you-badge">
                                            VOCÊ
                                          </span>`
                                        : ""
                                }

                            </strong>

                            <span>

                                ${aluno.turma}

                            </span>

                        </div>


                        <div class="rank-points">

                            <strong>

                                ${formatarNumero(
                                    aluno.pontos
                                )}

                            </strong>

                            <span>
                                pontos
                            </span>

                        </div>


                    </article>

                `;

            }
        );


        html += `

            </div>

        `;


        rankingContent.innerHTML =
            html;

    }


    // =====================================================
    // RESUMO DOS ALUNOS
    // =====================================================

    const studentSummaryStyle =
        document.createElement("style");


    studentSummaryStyle.textContent = `

        .student-summary {

            display: grid;

            grid-template-columns:
                repeat(2, 1fr);

            gap: 12px;

            margin-bottom: 15px;

        }


        .student-summary > div {

            padding: 16px 18px;

            border-radius: 15px;

            background:
                rgba(255,255,255,.96);

            border: 1px solid #e2e8f0;

        }


        .student-summary span {

            display: block;

            color: #64748b;

            font-size: 9px;

            font-weight: 900;

            letter-spacing: 1px;

        }


        .student-summary strong {

            display: block;

            margin-top: 4px;

            color: #08a957;

            font-size: 24px;

            font-weight: 900;

        }


        @media(max-width:600px) {

            .student-summary {

                grid-template-columns: 1fr;

            }

        }

    `;


    document.head.appendChild(
        studentSummaryStyle
    );


    // =====================================================
    // CLIQUE NAS ABAS
    // =====================================================

    abas.forEach(
        aba => {

            aba.addEventListener(
                "click",
                function () {

                    abas.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    aba.classList.add(
                        "active"
                    );


                    const tipo =
                        aba.dataset.content;


                    if (
                        tipo === "schools"
                    ) {

                        gerarRankingEscolas();

                    }


                    if (
                        tipo === "classes"
                    ) {

                        gerarRankingTurmas();

                    }


                    if (
                        tipo === "students"
                    ) {

                        gerarRankingAlunos();

                    }

                }
            );

        }
    );


    // =====================================================
    // INICIAR
    // =====================================================

    atualizarMinhaEscola();

    gerarRankingEscolas();

});