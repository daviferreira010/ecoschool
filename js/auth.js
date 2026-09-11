document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            login();
        });
    }

    // ============================
    // FORMATAÇÃO DO CPF
    // ============================

    const cpfInput = document.getElementById("cpf");

    if (cpfInput) {

        cpfInput.addEventListener("input", function () {

            let valor = this.value
                .replace(/\D/g, "")
                .slice(0, 11);

            if (valor.length > 9) {

                valor = valor.replace(
                    /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
                    "$1.$2.$3-$4"
                );

            } else if (valor.length > 6) {

                valor = valor.replace(
                    /(\d{3})(\d{3})(\d{1,3})/,
                    "$1.$2.$3"
                );

            } else if (valor.length > 3) {

                valor = valor.replace(
                    /(\d{3})(\d{1,3})/,
                    "$1.$2"
                );
            }

            this.value = valor;

        });
    }

    // ============================
    // CARREGAR ESCOLAS
    // ============================

    carregarEscolas();

    // ============================
    // ESCOLA → TURMAS
    // ============================

    const escola = document.getElementById("escola");

    if (escola) {
        escola.addEventListener("change", atualizarTurmas);
    }

});

// ============================
// LOGIN
// ============================

document
    .getElementById("loginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        login();

    });


function login() {

    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

    const senha =
        document
            .getElementById("senha")
            .value;


    // ============================
    // VERIFICAR CAMPOS
    // ============================

    if (!email || !senha) {

        mostrarMensagem(
            "Preencha todos os campos.",
            "erro"
        );

        return;
    }


    // ============================
    // VERIFICAR E-MAIL INSTITUCIONAL
    // ============================

    if (!email.endsWith("@aluno.edu.es.gov.br")) {

        mostrarMensagem(
            "Utilize seu e-mail institucional @aluno.edu.es.gov.br.",
            "erro"
        );

        return;
    }


    // ============================
    // PEGAR CONTA SALVA
    // ============================

    const usuario =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!usuario) {

        mostrarMensagem(
            "Você ainda não possui uma conta. Clique em Cadastrar agora.",
            "erro"
        );

        return;
    }


    // ============================
    // CONFERIR LOGIN
    // ============================

    if (
        email === usuario.email &&
        senha === usuario.senha
    ) {

        // Marca que o usuário está logado
        localStorage.setItem(
            "logado",
            "true"
        );


        mostrarMensagem(
            "Login realizado com sucesso! 🌱",
            "sucesso"
        );


        // Vai para a página inicial
        setTimeout(function() {

            window.location.href =
                "index.html";

        }, 1000);


    } else {

        mostrarMensagem(
            "E-mail ou senha incorretos.",
            "erro"
        );

    }

}

// ============================
// MOSTRAR SENHA
// ============================

function mostrarSenha() {

    const senha =
        document.getElementById("senha");


    if (!senha) return;


    if (senha.type === "password") {

        senha.type = "text";

    } else {

        senha.type = "password";

    }

}


// ============================
// ABRIR CADASTRO
// ============================

function abrirCadastro() {

    document
        .getElementById("modalCadastro")
        .classList.add("active");


    document
        .getElementById("etapa1")
        .classList.remove("hidden");


    document
        .getElementById("etapa2")
        .classList.add("hidden");


    document
        .getElementById("etapa3")
        .classList.add("hidden");


    limparMensagensCadastro();

}


// ============================
// FECHAR CADASTRO
// ============================

function fecharCadastro() {

    document
        .getElementById("modalCadastro")
        .classList.remove("active");

}


// ============================
// ETAPA 2
// ============================

function abrirEtapa2() {

    document
        .getElementById("etapa1")
        .classList.add("hidden");


    document
        .getElementById("etapa2")
        .classList.remove("hidden");

}


function voltarEtapa1() {

    document
        .getElementById("etapa2")
        .classList.add("hidden");


    document
        .getElementById("etapa1")
        .classList.remove("hidden");

}


// ============================
// ETAPA 3
// ============================

function abrirEtapa3() {

    const nome =
        document
            .getElementById("nome")
            .value
            .trim();


    const cpf =
        document
            .getElementById("cpf")
            .value
            .trim();


    const dataNascimento =
        document
            .getElementById("dataNascimento")
            .value;


    if (!nome || !cpf || !dataNascimento) {

        alert(
            "Preencha todos os dados."
        );

        return;

    }


    // ============================
    // VALIDAR NOME
    // ============================

    if (nome.length < 5) {

        alert(
            "Digite seu nome completo."
        );

        return;

    }


    // ============================
    // VALIDAR CPF
    // ============================

    if (!validarCPF(cpf)) {

        alert(
            "CPF inválido."
        );

        return;

    }


    // ============================
    // VERIFICAR CPF DUPLICADO
    // ============================

    const usuarioExistente =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (
        usuarioExistente &&
        usuarioExistente.cpf === cpf
    ) {

        alert(
            "Este CPF já possui uma conta cadastrada."
        );

        return;

    }


    // ============================
    // VALIDAR DATA
    // ============================

    const data =
        new Date(dataNascimento);


    const hoje =
        new Date();


    if (isNaN(data.getTime())) {

        alert(
            "Digite uma data de nascimento válida."
        );

        return;

    }


    if (data > hoje) {

        alert(
            "A data de nascimento não pode ser no futuro."
        );

        return;

    }


    let idade =
        hoje.getFullYear() -
        data.getFullYear();


    const mes =
        hoje.getMonth() -
        data.getMonth();


    if (
        mes < 0 ||
        (
            mes === 0 &&
            hoje.getDate() < data.getDate()
        )
    ) {

        idade--;

    }


    if (idade < 10) {

        alert(
            "O aluno deve ter pelo menos 10 anos."
        );

        return;

    }


    if (idade > 100) {

        alert(
            "Digite uma data de nascimento válida."
        );

        return;

    }


    // ============================
    // IR PARA ETAPA 3
    // ============================

    document
        .getElementById("etapa2")
        .classList.add("hidden");


    document
        .getElementById("etapa3")
        .classList.remove("hidden");

}


// ============================
// ESCOLAS E TURMAS
// ============================

const escolasTurmas = {

   "EEEFM Honório Fraga": [
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
],

    "EEEFM Geraldo Vargas Nogueira": [
        "1º Ano A",
        "1º Ano B",
        "2º Ano A",
        "2º Ano B",
        "3º Ano A",
        "3º Ano B"
    ],

    "EEEFM Rubens Rangel": [
        "1º Ano A",
        "1º Ano B",
        "2º Ano A",
        "2º Ano B",
        "3º Ano A",
        "3º Ano B"
    ],

    "EEEFM Aristóbulo Barbosa Leão": [
        "1º Ano A",
        "1º Ano B",
        "2º Ano A",
        "3º Ano A"
    ],

    "EEEFM Conde de Linhares": [
        "1º Ano A",
        "2º Ano A",
        "3º Ano A"
    ]

};
// ============================
// CARREGAR ESCOLAS NO SELECT
// ============================

function carregarEscolas() {

    const escola = document.getElementById("escola");

    if (!escola) return;

    escola.innerHTML = `
        <option value="">Selecione sua escola</option>
    `;

    Object.keys(escolasTurmas).forEach(function(nomeEscola) {

        const option = document.createElement("option");

        option.value = nomeEscola;
        option.textContent = nomeEscola;

        escola.appendChild(option);
    });
}
// ============================
// ATUALIZAR TURMAS
// ============================

function atualizarTurmas() {

    const escola =
        document.getElementById("escola");


    const turma =
        document.getElementById("turma");


    if (!escola || !turma) return;


    turma.innerHTML =
        '<option value="">Selecione sua turma</option>';


    const lista =
        escolasTurmas[escola.value];


    if (!lista) return;


    lista.forEach(function (nomeTurma) {

        const option =
            document.createElement("option");


        option.value =
            nomeTurma;


        option.textContent =
            nomeTurma;


        turma.appendChild(option);

    });

}


// ============================
// CRIAR CONTA
// ============================

function criarConta() {

    const nome =
        document
            .getElementById("nome")
            .value
            .trim();


    const cpf =
        document
            .getElementById("cpf")
            .value
            .trim();


    const dataNascimento =
        document
            .getElementById("dataNascimento")
            .value;


    const email =
        document
            .getElementById("cadastroEmail")
            .value
            .trim()
            .toLowerCase();


    const senha =
        document
            .getElementById("novaSenha")
            .value;


    const confirmar =
        document
            .getElementById("confirmarSenha")
            .value;


    const escola =
        document
            .getElementById("escola")
            .value;


    const turma =
        document
            .getElementById("turma")
            .value;


    const mensagem =
        document
            .getElementById("mensagemCadastro");


    mensagem.innerText = "";


    // ============================
    // CAMPOS OBRIGATÓRIOS
    // ============================

    if (
        !nome ||
        !cpf ||
        !dataNascimento ||
        !email ||
        !senha ||
        !confirmar ||
        !escola ||
        !turma
    ) {

        mensagem.innerText =
            "Preencha todos os campos.";

        return;

    }


    // ============================
    // E-MAIL
    // ============================

    if (!validarEmail(email)) {

        mensagem.innerText =
            "Digite um e-mail institucional válido.";

        return;

    }


    // ============================
    // VERIFICAR E-MAIL DUPLICADO
    // ============================

    const usuarioExistente =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (
        usuarioExistente &&
        usuarioExistente.email.toLowerCase() === email
    ) {

        mensagem.innerText =
            "Este e-mail já possui uma conta cadastrada.";

        return;

    }


    // ============================
    // SENHA
    // ============================

    if (senha.length < 8) {

        mensagem.innerText =
            "A senha precisa ter pelo menos 8 caracteres.";

        return;

    }


    if (senha !== confirmar) {

        mensagem.innerText =
            "As senhas não são iguais.";

        return;

    }


    // ============================
    // CRIAR USUÁRIO
    // ============================

    const usuario = {

        nome: nome,

        cpf: cpf,

        dataNascimento: dataNascimento,

        email: email,

        senha: senha,

        escola: escola,

        turma: turma

    };


    localStorage.setItem(
        "user",
        JSON.stringify(usuario)
    );


    localStorage.setItem(
        "logado",
        "false"
    );


    mensagem.style.color =
        "#008f4f";


    mensagem.innerText =
        "Conta criada com sucesso! 🌱";


    setTimeout(function () {

        fecharCadastro();


        document
            .getElementById("email")
            .value = email;


        document
            .getElementById("senha")
            .value = "";


    }, 1200);

}


// ============================
// VALIDAR CPF
// ============================

function validarCPF(cpf) {

    cpf =
        cpf.replace(/\D/g, "");


    if (cpf.length !== 11) {

        return false;

    }


    if (/^(\d)\1+$/.test(cpf)) {

        return false;

    }


    let soma = 0;


    for (let i = 0; i < 9; i++) {

        soma +=
            parseInt(cpf.charAt(i)) *
            (10 - i);

    }


    let resto =
        (soma * 10) % 11;


    if (resto === 10) {

        resto = 0;

    }


    if (
        resto !==
        parseInt(cpf.charAt(9))
    ) {

        return false;

    }


    soma = 0;


    for (let i = 0; i < 10; i++) {

        soma +=
            parseInt(cpf.charAt(i)) *
            (11 - i);

    }


    resto =
        (soma * 10) % 11;


    if (resto === 10) {

        resto = 0;

    }


    return (
        resto ===
        parseInt(cpf.charAt(10))
    );

}


// ============================
// VALIDAR E-MAIL
// ============================

function validarEmail(email) {

    const formato =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!formato.test(email)) {

        return false;

    }


    // Domínios institucionais permitidos.
    // Você pode alterar essa lista depois.

    const dominiosPermitidos = [

        "edu.br",
        "es.gov.br"

    ];


    const dominio =
        email
            .split("@")[1]
            .toLowerCase();


    return dominiosPermitidos.some(
        function (dominioPermitido) {

            return dominio.endsWith(
                "." + dominioPermitido
            ) ||
            dominio === dominioPermitido;

        }
    );

}


// ============================
// ESQUECI SENHA
// ============================

function esqueciSenha() {

    const usuario =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!usuario) {

        alert(
            "Nenhuma conta cadastrada."
        );

        return;

    }


    alert(
        "A recuperação de senha ainda será implementada."
    );

}




// ============================
// GOOGLE
// ============================

function loginGoogle() {

    alert(
        "O login com Google será implementado posteriormente."
    );

}


// ============================
// MENSAGEM
// ============================

function mostrarMensagem(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "mensagem"
        );


    if (!mensagem) return;


    mensagem.innerText =
        texto;


    mensagem.style.display =
        "block";


    if (tipo === "erro") {

        mensagem.style.color =
            "#c0392b";

    } else {

        mensagem.style.color =
            "#008f4f";

    }

}


// ============================
// LIMPAR MENSAGENS
// ============================

function limparMensagensCadastro() {

    const mensagem =
        document.getElementById(
            "mensagemCadastro"
        );


    if (mensagem) {

        mensagem.innerText = "";

    }

}
function logout() {

    localStorage.removeItem("logado");

    window.location.href = "login.html";

}

// ============================
// SAIR DA CONTA
// ============================

function logout() {

    localStorage.removeItem("logado");

    window.location.href = "login.html";

}