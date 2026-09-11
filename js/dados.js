/* =========================================
   SISTEMA CENTRAL DE DADOS - ECOSCHOOL
========================================= */


/* =========================================
   DADOS DO ALUNO
========================================= */

function iniciarDadosAluno() {

    const dadosSalvos = localStorage.getItem("ecoSchoolDados");

    if (!dadosSalvos) {

        const dadosIniciais = {

            pontos: 0,

            reciclado: 0,

            coletasRealizadas: 0,

            ultimaColeta: null,

            coletas: [],

            trimestre: getTrimestreAtual()

        };

        localStorage.setItem(
            "ecoSchoolDados",
            JSON.stringify(dadosIniciais)
        );

    }

}


/* =========================================
   PEGAR TRIMESTRE ATUAL
========================================= */

function getTrimestreAtual() {

    const hoje = new Date();

    const mes = hoje.getMonth() + 1;


    if (mes >= 1 && mes <= 3) {

        return 1;

    }

    if (mes >= 4 && mes <= 6) {

        return 2;

    }

    if (mes >= 7 && mes <= 9) {

        return 3;

    }

    return 4;

}


/* =========================================
   VERIFICAR MUDANÇA DE TRIMESTRE
========================================= */

function verificarTrimestre() {

    const dados = JSON.parse(
        localStorage.getItem("ecoSchoolDados")
    );

    const trimestreAtual = getTrimestreAtual();


    if (dados.trimestre !== trimestreAtual) {

        dados.pontos = 0;

        dados.reciclado = 0;

        dados.coletasRealizadas = 0;

        dados.ultimaColeta = null;

        dados.coletas = [];

        dados.trimestre = trimestreAtual;


        localStorage.setItem(
            "ecoSchoolDados",
            JSON.stringify(dados)
        );

    }

}


/* =========================================
   PEGAR DADOS
========================================= */

function pegarDados() {

    verificarTrimestre();

    return JSON.parse(
        localStorage.getItem("ecoSchoolDados")
    );

}


/* =========================================
   SALVAR DADOS
========================================= */

function salvarDados(dados) {

    localStorage.setItem(
        "ecoSchoolDados",
        JSON.stringify(dados)
    );

}


/* =========================================
   INICIAR SISTEMA
========================================= */

iniciarDadosAluno();

verificarTrimestre();