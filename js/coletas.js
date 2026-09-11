/* =========================================
   ECOSCHOOL - SISTEMA DE COLETAS
========================================= */


/* =========================================
   NOME DO USUÁRIO
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const nomeUsuario =
        document.getElementById("nomeUsuario");

    if (!nomeUsuario) return;


    const perfil = JSON.parse(
        localStorage.getItem("perfilAluno")
    );


    if (perfil && perfil.nome) {

        nomeUsuario.textContent = perfil.nome;

        return;

    }


    const usuario = JSON.parse(
        localStorage.getItem("user")
    );


    if (usuario && usuario.nome) {

        nomeUsuario.textContent = usuario.nome;

    }

});


/* =========================================
   DIAS DISPONÍVEIS PARA COLETA

   ALTERE ESTES DIAS QUANDO QUISER.
========================================= */

const DIAS_COLETA = [1, 3, 14, 20, 28];

const LIMITE_COLETAS_MES = 4;


/* =========================================
   ETAPAS
========================================= */

const steps =
    document.querySelectorAll(".step");

const contents =
    document.querySelectorAll(".step-content");

let etapaAtual = 1;


/* =========================================
   MOSTRAR ETAPA
========================================= */

function mostrarEtapa(numero) {

    contents.forEach(content => {

        content.classList.remove("active");

    });


    const etapa =
        document.getElementById(`step${numero}`);


    if (etapa) {

        etapa.classList.add("active");

    }


    atualizarProgresso(numero);

    etapaAtual = numero;

}


/* =========================================
   ATUALIZAR PROGRESSO
========================================= */

function atualizarProgresso(numero) {

    steps.forEach((step, index) => {

        step.classList.remove(
            "active",
            "complete"
        );


        if (index + 1 < numero) {

            step.classList.add("complete");

            step.innerHTML = "✔";

        }


        else if (index + 1 === numero) {

            step.classList.add("active");

            step.innerHTML = index + 1;

        }


        else {

            step.innerHTML = index + 1;

        }

    });

}


/* =========================================
   PEGAR DADOS CENTRAIS
========================================= */

function pegarDadosEcoSchool() {

    let dados = JSON.parse(
        localStorage.getItem("ecoSchoolDados")
    );


    if (!dados) {

        dados = {

            pontos: 0,

            reciclado: 0,

            coletasRealizadas: 0,

            ultimaColeta: null,

            coletas: [],

            trimestre: getTrimestreAtual(),

            ano: new Date().getFullYear()

        };


        salvarDadosEcoSchool(dados);

    }


    return dados;

}


/* =========================================
   SALVAR DADOS CENTRAIS
========================================= */

function salvarDadosEcoSchool(dados) {

    localStorage.setItem(
        "ecoSchoolDados",
        JSON.stringify(dados)
    );

}


/* =========================================
   TRIMESTRE ATUAL
========================================= */

function getTrimestreAtual() {

    const mes =
        new Date().getMonth() + 1;


    if (mes <= 3) {

        return 1;

    }


    if (mes <= 6) {

        return 2;

    }


    if (mes <= 9) {

        return 3;

    }


    return 4;

}


/* =========================================
   VERIFICAR NOVO TRIMESTRE
========================================= */

function verificarTrimestre() {

    const dados =
        pegarDadosEcoSchool();

    const trimestreAtual =
        getTrimestreAtual();

    const anoAtual =
        new Date().getFullYear();


    if (
        dados.trimestre !== trimestreAtual ||
        dados.ano !== anoAtual
    ) {

        dados.pontos = 0;

        dados.reciclado = 0;

        dados.coletasRealizadas = 0;

        dados.ultimaColeta = null;

        dados.trimestre = trimestreAtual;

        dados.ano = anoAtual;


        salvarDadosEcoSchool(dados);

    }

}


/* =========================================
   PEGAR COLETAS
========================================= */

/* =========================================
   PEGAR COLETAS
========================================= */

function pegarColetas() {

    const coletasSalvas =
        localStorage.getItem(
            "ecoColetas"
        );


    /*
       Se ainda não existe nenhuma coleta,
       retorna uma lista vazia.
    */

    if (!coletasSalvas) {

        return [];

    }


    /*
       Proteção caso os dados salvos
       estejam corrompidos.
    */

    try {

        const coletas =
            JSON.parse(
                coletasSalvas
            );


        /*
           Só aceita se realmente
           for uma lista.
        */

        if (
            Array.isArray(coletas)
        ) {

            return coletas;

        }


        return [];

    }

    catch (erro) {

        console.error(
            "Erro ao carregar as coletas:",
            erro
        );

        return [];

    }

}


/* =========================================
   SALVAR LISTA DE COLETAS
========================================= */

function salvarListaColetas(coletas) {

    localStorage.setItem(
        "ecoColetas",
        JSON.stringify(coletas)
    );


    /*
       Confere se realmente salvou.
    */

    console.log(
        "Coletas salvas:",
        coletas
    );

}

/* =========================================
   CALENDÁRIO VISUAL DE COLETAS
========================================= */

let mesCalendario = new Date().getMonth();
let anoCalendario = new Date().getFullYear();

let dataSelecionada = null;

function mesPodeAgendar() {

    const hoje = new Date();

    hoje.setHours(
        0,
        0,
        0,
        0
    );


    const mesAtual =
        hoje.getMonth();

    const anoAtual =
        hoje.getFullYear();


    /*
       MÊS ATUAL
       Sempre pode agendar.
    */

    if (
        mesCalendario === mesAtual &&
        anoCalendario === anoAtual
    ) {

        return true;

    }


    /*
       CRIA O PRÓXIMO MÊS
    */

    const proximoMes =
        new Date(
            anoAtual,
            mesAtual + 1,
            1
        );


    /*
       MÊS QUE ESTÁ SENDO
       VISUALIZADO NO CALENDÁRIO
    */

    const mesVisualizado =
        new Date(
            anoCalendario,
            mesCalendario,
            1
        );


    /*
       SE NÃO FOR O PRÓXIMO MÊS,
       NÃO PODE AGENDAR.
    */

    if (
        mesVisualizado.getTime() !==
        proximoMes.getTime()
    ) {

        return false;

    }


    /*
       CALCULA QUANTOS DIAS FALTAM
       PARA COMEÇAR O PRÓXIMO MÊS
    */

    const diasParaProximoMes =
        Math.ceil(
            (
                proximoMes - hoje
            )
            /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    /*
       LIBERA O AGENDAMENTO
       QUANDO FALTAREM 5 DIAS
       OU MENOS.
    */

    return diasParaProximoMes <= 5;

}
/* =========================================
   MESES
========================================= */

const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];


/* =========================================
   RENDERIZAR CALENDÁRIO
========================================= */

function renderizarCalendario() {

    const calendarDays =
        document.getElementById("calendarDays");

    const calendarMonth =
        document.getElementById("calendarMonth");

    if (!calendarDays || !calendarMonth) return;


    calendarDays.innerHTML = "";


    calendarMonth.textContent =
        `${nomesMeses[mesCalendario]} ${anoCalendario}`;

const agendamentoLiberado = mesPodeAgendar();

    const primeiroDia =
        new Date(
            anoCalendario,
            mesCalendario,
            1
        ).getDay();


    const quantidadeDias =
        new Date(
            anoCalendario,
            mesCalendario + 1,
            0
        ).getDate();


    /*
        ESPAÇOS VAZIOS
    */

    for (let i = 0; i < primeiroDia; i++) {

        const vazio =
            document.createElement("div");

        vazio.classList.add(
            "calendar-day",
            "empty"
        );

        calendarDays.appendChild(vazio);

    }


    /*
        DATA DE HOJE
    */

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);


    /*
        COLETAS SALVAS
    */

    const coletas =
        pegarColetas();


    /*
        CRIAR DIAS
    */

    for (
        let dia = 1;
        dia <= quantidadeDias;
        dia++
    ) {

        const elemento =
            document.createElement("button");

        elemento.type = "button";

        elemento.classList.add(
            "calendar-day"
        );

        elemento.textContent = dia;


        const data =
            new Date(
                anoCalendario,
                mesCalendario,
                dia
            );

        data.setHours(0, 0, 0, 0);


        const valorData =
            formatarDataInput(data);


        /*
            DIFERENÇA EM DIAS
        */

        const diferenca =
            Math.ceil(
                (data - hoje) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        /*
            É DIA DE COLETA?
        */

        const diaPermitido =
            DIAS_COLETA.includes(dia);


        /*
            JÁ EXISTE COLETA
            NESTA DATA?

            NÃO IMPORTA SE ESTÁ:
            AGENDADA OU REALIZADA
        */

        const diaJaUtilizado =
            coletas.some(coleta => {

                return (
                    coleta.data === valorData
                );

            });


        /*
            1 - DIA COMUM
            CINZA CLARO
        */

        if (!diaPermitido) {

            elemento.classList.add(
                "unavailable"
            );

            elemento.disabled = true;

        }


        /*
            2 - DIA DE COLETA
            JÁ UTILIZADO

            CINZA ESCURO
        */

        else if (diaJaUtilizado) {

            elemento.classList.add(
                "used"
            );

            elemento.disabled = true;

            elemento.title =
                "Você já utilizou este dia para uma coleta.";

        }


        /*
            3 - DIA DE COLETA
            QUE JÁ PASSOU

            CINZA ESCURO
        */

        else if (data < hoje) {

            elemento.classList.add(
                "past"
            );

            elemento.disabled = true;

            elemento.title =
                "Este dia de coleta já passou.";

        }


        /*
            4 - FALTAM 2 DIAS
            OU MENOS

            VERMELHO
        */

        else if (diferenca <= 2) {

            elemento.classList.add(
                "closing"
            );

            elemento.disabled = true;

            elemento.title =
                "O prazo para agendar esta coleta foi encerrado.";

        }


        /*
            5 - DIA DISPONÍVEL

            VERDE
        */

        else {

    /*
       SE O MÊS ESTÁ LIBERADO,
       O DIA FICA VERDE E CLICÁVEL
    */

    if (agendamentoLiberado) {

        elemento.classList.add(
            "available"
        );


        elemento.addEventListener(
            "click",
            function () {

                selecionarDataCalendario(
                    valorData,
                    elemento
                );

            }
        );

    }


    /*
       MÊS FUTURO AINDA NÃO LIBERADO

       O DIA PODE SER VISTO,
       MAS NÃO CLICADO.
    */

    else {

        elemento.classList.add(
            "future-view"
        );

        elemento.disabled = true;

        elemento.title =
            "Este mês ainda não está liberado para agendamento.";

    }

}


        /*
            DIA SELECIONADO

            AZUL

            Só pode ficar selecionado
            se ainda estiver disponível.
        */

        if (
            dataSelecionada === valorData &&
            !elemento.disabled
        ) {

            elemento.classList.add(
                "selected"
            );

        }


        calendarDays.appendChild(
            elemento
        );

    }

}


/* =========================================
   SELECIONAR DATA
========================================= */

function selecionarDataCalendario(
    data,
    elemento
) {

    dataSelecionada = data;


    /*
       Guarda no input hidden
    */

    const inputData =
        document.getElementById("data");


    if (inputData) {

        inputData.value = data;

    }


    /*
       Remove seleção anterior
    */

    document
        .querySelectorAll(
            ".calendar-day.selected"
        )
        .forEach(dia => {

            dia.classList.remove(
                "selected"
            );

        });


    /*
       Marca o novo dia
    */

    elemento.classList.add(
        "selected"
    );


    /*
       Efeito visual
    */

    const dataObj =
        new Date(
            data + "T00:00:00"
        );


    console.log(
        "Data selecionada:",
        dataObj.toLocaleDateString("pt-BR")
    );

}


/* =========================================
   MÊS ANTERIOR
========================================= */

const prevMonth =
    document.getElementById("prevMonth");


if (prevMonth) {

    prevMonth.addEventListener(
        "click",
        function () {

            const hoje =
                new Date();

            /*
               Não permite voltar
               para meses anteriores
            */

            const mesAtual =
                hoje.getMonth();

            const anoAtual =
                hoje.getFullYear();


            if (
                anoCalendario === anoAtual &&
                mesCalendario === mesAtual
            ) {

                return;

            }


            mesCalendario--;


            if (mesCalendario < 0) {

                mesCalendario = 11;

                anoCalendario--;

            }


            renderizarCalendario();

        }
    );

}


/* =========================================
   PRÓXIMO MÊS

   REGRA:
   - Mês atual sempre disponível.
   - Próximo mês só libera quando
     faltarem 7 dias ou menos.
========================================= */

/* =========================================
   PRÓXIMO MÊS
========================================= */

const nextMonth =
    document.getElementById("nextMonth");


if (nextMonth) {

    nextMonth.addEventListener(
        "click",
        function () {


            const hoje =
                new Date();


            const proximoMes =
                new Date(
                    hoje.getFullYear(),
                    hoje.getMonth() + 1,
                    1
                );


            /*
               NÃO DEIXA IR ALÉM
               DO PRÓXIMO MÊS.

               Ou seja:

               Mês atual → Próximo mês
               Próximo mês → Para aqui
            */

            if (

                anoCalendario ===
                proximoMes.getFullYear()

                &&

                mesCalendario ===
                proximoMes.getMonth()

            ) {

                return;

            }


            /*
               AVANÇA PARA O
               PRÓXIMO MÊS
            */

            mesCalendario++;


            if (
                mesCalendario > 11
            ) {

                mesCalendario = 0;

                anoCalendario++;

            }


            /*
               DESMARCA A DATA
               ANTERIOR AO TROCAR
               DE MÊS
            */

            dataSelecionada = null;


            const inputData =
                document.getElementById("data");


            if (inputData) {

                inputData.value = "";

            }


            renderizarCalendario();

        }
    );

}

/* =========================================
   INICIALIZAR CALENDÁRIO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderizarCalendario();

    }
);


/* =========================================
   FORMATAR DATA PARA INPUT
========================================= */

function formatarDataInput(data) {

    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            data.getDate()
        ).padStart(2, "0");


    return `${ano}-${mes}-${dia}`;

}


/* =========================================
   VALIDAR DATA DE COLETA
========================================= */

function dataDisponivel(dataSelecionada) {

    if (!dataSelecionada) {

        return false;

    }


    const data =
        new Date(
            dataSelecionada + "T00:00:00"
        );


    const hoje =
        new Date();

    hoje.setHours(0, 0, 0, 0);


    const diferenca =
        Math.ceil(
            (data - hoje) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    /*
       Menos de 3 dias de antecedência.
    */

    if (diferenca <= 2) {

        return false;

    }


    /*
       Dia precisa estar
       dentro dos dias permitidos.
    */

    if (
        !DIAS_COLETA.includes(
            data.getDate()
        )
    ) {

        return false;

    }


    return true;

}


/* =========================================
   CONTAR COLETAS DO MÊS
   O aluno NÃO é obrigado a fazer 4 coletas.
   
   O limite de 4 significa apenas:
   - 0 → pode agendar
   - 1 → pode agendar
   - 2 → pode agendar
   - 3 → pode agendar
   - 4 → não pode agendar mais
========================================= */

function contarColetasDoMes(dataSelecionada) {

    if (!dataSelecionada) {
        return 0;
    }


    const data =
        new Date(
            dataSelecionada + "T00:00:00"
        );


    const mes =
        data.getMonth();

    const ano =
        data.getFullYear();


    const coletas =
        pegarColetas();


    return coletas.filter(coleta => {

        if (!coleta.data) {
            return false;
        }


        /*
           Só conta coletas que realmente
           estão agendadas ou foram realizadas.
        */

        if (
            coleta.status !== "Agendada" &&
            coleta.status !== "Realizada"
        ) {
            return false;
        }


        const dataColeta =
            new Date(
                coleta.data + "T00:00:00"
            );


        return (
            dataColeta.getMonth() === mes &&
            dataColeta.getFullYear() === ano
        );

    }).length;

}


/* =========================================
   BOTÕES DAS ETAPAS
========================================= */

const next1 =
    document.getElementById("next1");

const next2 =
    document.getElementById("next2");

const back1 =
    document.getElementById("back1");

const back2 =
    document.getElementById("back2");


if (next1) {

    next1.addEventListener(
        "click",
        () => {

            const data =
                document.getElementById("data").value;


            if (!data) {

                alert(
                    "Escolha uma data para a coleta."
                );

                return;

            }


            if (
                !dataDisponivel(data)
            ) {

                alert(
                    "Esta data não está disponível."
                );

                return;

            }


            const totalNoMes =
                contarColetasDoMes(data);


            if (
                totalNoMes >=
                LIMITE_COLETAS_MES
            ) {

                alert(
                    "Você já atingiu o limite de 4 coletas neste mês."
                );

                return;

            }


            mostrarEtapa(2);

        }
    );

}


if (next2) {

    next2.addEventListener(
        "click",
        () => {

            preencherResumo();

            mostrarEtapa(3);

        }
    );

}


if (back1) {

    back1.addEventListener(
        "click",
        () => {

            mostrarEtapa(1);

        }
    );

}


if (back2) {

    back2.addEventListener(
        "click",
        () => {

            mostrarEtapa(2);

        }
    );

}


/* =========================================
   RESUMO FINAL
========================================= */

function preencherResumo() {

    /* ESCOLA */

    const rEscola =
        document.getElementById("rEscola");

    if (rEscola) {

        rEscola.innerHTML =
            "EcoSchool";

    }


    /* DATA */

    const data =
        document.getElementById("data")?.value;


    const rData =
        document.getElementById("rData");


    if (rData) {

        if (data) {

            const novaData =
                new Date(
                    data + "T00:00:00"
                );


            rData.innerHTML =
                novaData.toLocaleDateString(
                    "pt-BR"
                );

        } else {

            rData.innerHTML =
                "Não selecionada";

        }

    }


    /* PERÍODO */

    const periodo =
        document.getElementById("periodo")?.value;


    const rPeriodo =
        document.getElementById("rPeriodo");


    if (rPeriodo) {

        rPeriodo.innerHTML =
            periodo || "Não informado";

    }


    /* MATERIAIS */

    const materiais = [];


    document
        .querySelectorAll(
            ".checkbox-grid input:checked"
        )
        .forEach(item => {

            materiais.push(
                item.value
            );

        });


    const rMateriais =
        document.getElementById("rMateriais");


    if (rMateriais) {

        rMateriais.innerHTML =
            materiais.length
                ? materiais.join(", ")
                : "Nenhum material selecionado";

    }


    /* QUANTIDADE */

    const quantidade =
        document.getElementById(
            "quantidade"
        )?.value;


    const rQuantidade =
        document.getElementById(
            "rQuantidade"
        );


    if (rQuantidade) {

        rQuantidade.innerHTML =
            quantidade || "Não informado";

    }


    /* OBSERVAÇÕES */

    const observacao =
        document.getElementById(
            "obs"
        )?.value;


    const rObs =
        document.getElementById(
            "rObs"
        );


    if (rObs) {

        rObs.innerHTML =
            observacao ||
            "Sem observações";

    }

}

/* =========================================
   CONFIRMAR AGENDAMENTO
========================================= */

const form =
    document.getElementById(
        "coletaForm"
    );


if (form) {

    form.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            salvarColeta();


            const modal =
                document.getElementById(
                    "successModal"
                );


            if (modal) {

                modal.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================
   SALVAR COLETA
========================================= */

function salvarColeta() {

    const coletas =
        pegarColetas();


    const materiais = [];


    document
        .querySelectorAll(
            ".checkbox-grid input:checked"
        )
        .forEach(item => {

            materiais.push(
                item.value
            );

        });


    const data =
        document.getElementById(
            "data"
        ).value;


    /*
       Evita salvar a mesma coleta
       duas vezes.
    */

   const coletaDuplicada =
    coletas.some(coleta => {

        return (
            coleta.data === data
        );

    });


    if (coletaDuplicada) {

        alert(
            "Já existe uma coleta agendada para esta data."
        );

        return;

    }


    const novaColeta = {

        id: Date.now(),

        data: data,

        periodo:
            document.getElementById(
                "periodo"
            ).value,

        materiais: materiais,

        quantidade:
            document.getElementById(
                "quantidade"
            ).value,

        observacao:
            document.getElementById(
                "obs"
            ).value,

        status: "Agendada"

    };


    coletas.push(
        novaColeta
    );


    salvarListaColetas(
    coletas
);


/*
    LIMPA A DATA SELECIONADA
*/

dataSelecionada = null;


const inputData =
    document.getElementById("data");

if (inputData) {

    inputData.value = "";

}


/*
    ATUALIZA O CALENDÁRIO

    O DIA QUE ACABOU DE SER
    UTILIZADO FICARÁ CINZA ESCURO.
*/

renderizarCalendario();


mostrarColetas();

}


function mostrarColetas() {

    const coletas = pegarColetas();

    const lista =
        document.getElementById(
            "listaColetas"
        );


    if (!lista) return;


    if (coletas.length === 0) {

        lista.innerHTML = `

            <div class="sem-coletas">

                <div class="sem-coletas-icon">
                    <i class="fa-solid fa-calendar-xmark"></i>
                </div>

                <div>

                    <strong>
                        Nenhuma coleta agendada
                    </strong>

                    <p>
                        Quando você agendar uma coleta,
                        ela aparecerá aqui.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    lista.innerHTML = "";


    /*
       Ordena as coletas pela data.
    */

    coletas.sort((a, b) => {

        const dataA =
            new Date(
                a.data + "T00:00:00"
            );

        const dataB =
            new Date(
                b.data + "T00:00:00"
            );


        return dataA - dataB;

    });


    coletas.forEach(coleta => {


        const data =
            new Date(
                coleta.data + "T00:00:00"
            );


        const dataFormatada =
            data.toLocaleDateString(
                "pt-BR"
            );


        const realizada =
            coleta.status === "Realizada";


        /*
           Proteção para coletas antigas
           que podem não ter todos os dados.
        */

        const periodo =
            coleta.periodo ||
            "Período não informado";


        const materiais =
            Array.isArray(coleta.materiais)
                ? coleta.materiais.join(", ")
                : "Materiais não informados";


        lista.innerHTML += `

            <div class="coleta-item">

                <div class="coleta-data">

                    <div class="coleta-data-icon">

                        <i class="fa-solid fa-calendar-day"></i>

                    </div>


                    <div class="coleta-data-info">

                        <strong>
                            ${dataFormatada}
                        </strong>

                        <span>
                            ${periodo}
                        </span>

                    </div>

                </div>


                <div class="coleta-material">

                    <i class="fa-solid fa-recycle"></i>

                    <span>
                        ${materiais}
                    </span>

                </div>


                <div class="coleta-bottom">


                    <span class="status-coleta ${
                        realizada
                            ? "status-realizada"
                            : "status-agendada"
                    }">

                        <i class="fa-solid ${
                            realizada
                                ? "fa-circle-check"
                                : "fa-clock"
                        }"></i>

                        ${
                            realizada
                                ? "Realizada"
                                : "Agendada"
                        }

                    </span>


                    ${
                        !realizada
                            ? `

                            <button
                                class="btn-confirmar-coleta"
                                onclick="realizarColeta(${coleta.id})"
                            >

                                <i class="fa-solid fa-check"></i>

                                Confirmar

                            </button>

                            `
                            : ""
                    }


                </div>

            </div>

        `;

    });

}


/* =========================================
   CALCULAR PONTOS
========================================= */

function calcularPontos(quantidade) {

    switch (quantidade) {

        case "Até 10 kg":
            return 20;

        case "10 a 20 kg":
            return 40;

        case "20 a 30 kg":
            return 75;

        case "Acima de 30 kg":
            return 100;

        default:
            return 0;

    }

}


/* =========================================
   QUANTIDADE REAL EM KG
========================================= */

function calcularKg(quantidade) {

    switch (quantidade) {

        case "Até 10 kg":
            return 10;

        case "10 a 20 kg":
            return 20;

        case "20 a 30 kg":
            return 30;

        case "Acima de 30 kg":
            return 40;

        default:
            return 0;

    }

}


/* =========================================
   REALIZAR COLETA
========================================= */

function realizarColeta(id) {

    verificarTrimestre();


    const coletas =
        pegarColetas();


    const coleta =
        coletas.find(item =>
            item.id === id
        );


    if (!coleta) return;


    /*
       Segurança:
       não permite pontuar duas vezes.
    */

    if (
        coleta.status === "Realizada"
    ) {

        return;

    }


    coleta.status =
        "Realizada";


    const pontos =
        calcularPontos(
            coleta.quantidade
        );


    const kg =
        calcularKg(
            coleta.quantidade
        );


    /*
       Atualiza os dados centrais.
    */

    const dados =
        pegarDadosEcoSchool();


    dados.pontos += pontos;

    dados.reciclado += kg;

    dados.coletasRealizadas += 1;

    dados.ultimaColeta =
        coleta.data;


    /*
       Guarda também a coleta
       dentro dos dados centrais.
    */

    dados.coletas.push({

        id: coleta.id,

        data: coleta.data,

        pontos: pontos,

        kg: kg

    });


    salvarDadosEcoSchool(
        dados
    );


    salvarListaColetas(
        coletas
    );


    /*
       Atualiza a tela.
    */

   mostrarColetas();

renderizarCalendario();

atualizarCiclo();

alert(
    `Coleta realizada! Você ganhou ${pontos} pontos.`
);

}


/* =========================================
   CICLO TRIMESTRAL
========================================= */

function atualizarCiclo() {

    verificarTrimestre();


    const agora =
        new Date();


    const trimestre =
        getTrimestreAtual();


    const ano =
        agora.getFullYear();


    const inicioMes =
        (trimestre - 1) * 3;


    const fimTrimestre =
        new Date(
            ano,
            inicioMes + 3,
            0,
            23,
            59,
            59
        );


    const diferenca =
        fimTrimestre - agora;


    const dias =
        Math.max(
            0,
            Math.floor(
                diferenca /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            )
        );


    const horas =
        Math.max(
            0,
            Math.floor(
                (
                    diferenca /
                    (
                        1000 *
                        60 *
                        60
                    )
                ) % 24
            )
        );


    const minutos =
        Math.max(
            0,
            Math.floor(
                (
                    diferenca /
                    (
                        1000 *
                        60
                    )
                ) % 60
            )
        );


    const dados =
        pegarDadosEcoSchool();


    const elementoTrimestre =
        document.getElementById(
            "mesCiclo"
        );


    if (elementoTrimestre) {

        elementoTrimestre.innerHTML =
            `${trimestre}º Trimestre / ${ano}`;

    }


    const contador =
        document.getElementById(
            "contadorCiclo"
        );


    if (contador) {

        contador.innerHTML =
            `${dias} dias ${horas}h ${minutos}min`;

    }


    const pontos =
        document.getElementById(
            "pontosCiclo"
        );


    if (pontos) {

        pontos.innerHTML =
            dados.pontos;

    }


    const coletas =
        document.getElementById(
            "coletasCiclo"
        );


    if (coletas) {

        coletas.innerHTML =
            dados.coletasRealizadas;

    }

}


/* =========================================
   FECHAR MODAL
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const modal =
            document.getElementById(
                "successModal"
            );


        const botao =
            document.getElementById(
                "closeModal"
            );


        if (!modal || !botao) return;


        botao.onclick =
            function () {

                modal.classList.remove(
                    "active"
                );


                form.reset();


                mostrarEtapa(1);


                mostrarColetas();

            };

    }
);


/* =========================================
   INICIAR SISTEMA
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        verificarTrimestre();

        mostrarEtapa(1);

        mostrarColetas();

        atualizarCiclo();


        /*
           Atualiza o contador
           a cada minuto.
        */

        setInterval(
            atualizarCiclo,
            60000
        );

    }
);