// =========================================================
// ECOSCHOOL — PERFIL
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // PEGAR DADOS DO ALUNO
    // =====================================================

    const usuario = JSON.parse(
        localStorage.getItem("user")
    );

    // Caso não exista usuário
    if (!usuario) {

        console.log("Nenhum usuário encontrado.");

        return;
    }


    // =====================================================
    // CABEÇALHO DO PERFIL
    // =====================================================

    const perfilNome =
        document.getElementById("perfilNome");

    const perfilEscola =
        document.getElementById("perfilEscola");


    if (perfilNome) {

        perfilNome.textContent =
            usuario.nome || "Nome do Aluno";

    }


    if (perfilEscola) {

        perfilEscola.textContent =
            "Aluno • " +
            (usuario.escola || "Escola");

    }


    // =====================================================
    // INFORMAÇÕES PESSOAIS
    // =====================================================

    const infoNome =
        document.getElementById("infoNome");

    const infoCpf =
        document.getElementById("infoCpf");

    const infoEscola =
        document.getElementById("infoEscola");

    const infoTurma =
        document.getElementById("infoTurma");


    if (infoNome) {

        infoNome.textContent =
            usuario.nome || "Não informado";

    }


    if (infoCpf) {

        infoCpf.textContent =
            usuario.cpf || "Não informado";

    }


    if (infoEscola) {

        infoEscola.textContent =
            usuario.escola || "Não informado";

    }


    if (infoTurma) {

        infoTurma.textContent =
            usuario.turma || "Não informado";

    }


   // =====================================================
// FOTO DE PERFIL
// =====================================================

const inputFoto =
    document.getElementById("inputFoto");

const fotoPerfil =
    document.getElementById("fotoPerfil");

const removerFoto =
    document.getElementById("removerFoto");


// Foto padrão
const FOTO_PADRAO =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";


// Foto salva
const fotoSalva =
    localStorage.getItem("fotoPerfil");


// Carregar foto
if (fotoSalva) {

    fotoPerfil.src = fotoSalva;

} else {

    fotoPerfil.src = FOTO_PADRAO;

}


// =====================================================
// ALTERAR FOTO
// =====================================================

if (inputFoto) {

    inputFoto.addEventListener("change", function () {

        const arquivo = this.files[0];

        if (!arquivo) {
            return;
        }


        if (!arquivo.type.startsWith("image/")) {

            alert("Selecione uma imagem válida.");

            this.value = "";

            return;
        }


        if (arquivo.size > 5 * 1024 * 1024) {

            alert("A imagem deve ter no máximo 5 MB.");

            this.value = "";

            return;
        }


        const leitor = new FileReader();


        leitor.onload = function (evento) {

            const imagem =
                evento.target.result;


            fotoPerfil.src =
                imagem;


            localStorage.setItem(
                "fotoPerfil",
                imagem
            );

        };


        leitor.readAsDataURL(arquivo);

    });

}


// =====================================================
// REMOVER FOTO
// =====================================================

if (removerFoto) {

    removerFoto.addEventListener("click", function () {

        const confirmar = confirm(
            "Tem certeza que deseja remover sua foto de perfil?"
        );


        if (!confirmar) {
            return;
        }


        // Apagar foto salva
        localStorage.removeItem("fotoPerfil");


        // Voltar para foto padrão
        fotoPerfil.src =
            FOTO_PADRAO;


        // Limpar input
        if (inputFoto) {
            inputFoto.value = "";
        }

    });

}
  
});


// =========================================================
// ECOSCHOOL — DADOS DAS COLETAS NO PERFIL
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const dados =
            JSON.parse(
                localStorage.getItem(
                    "ecoSchoolDados"
                )
            );


        // Caso não existam dados
        if (!dados) {

            console.log(
                "Dados do EcoSchool não encontrados."
            );

            return;

        }


        // =================================================
        // PONTOS
        // =================================================

        const perfilPontos =
            document.getElementById(
                "perfilPontos"
            );


        if (perfilPontos) {

            perfilPontos.textContent =
                dados.pontos || 0;

        }


        // =================================================
        // KG RECICLADOS
        // =================================================

        const perfilReciclado =
            document.getElementById(
                "perfilReciclado"
            );


        if (perfilReciclado) {

            perfilReciclado.textContent =
                `${dados.reciclado || 0} kg`;

        }


        // =================================================
        // COLETAS REALIZADAS
        // =================================================

        const perfilColetas =
            document.getElementById(
                "perfilColetas"
            );


        if (perfilColetas) {

            perfilColetas.textContent =
                dados.coletasRealizadas || 0;

        }


        // =================================================
        // ÚLTIMA COLETA
        // =================================================

        const perfilUltimaColeta =
            document.getElementById(
                "perfilUltimaColeta"
            );


        if (perfilUltimaColeta) {

            if (dados.ultimaColeta) {

                const data =
                    new Date(
                        dados.ultimaColeta +
                        "T00:00:00"
                    );


                perfilUltimaColeta.textContent =
                    data.toLocaleDateString(
                        "pt-BR"
                    );

            } else {

                perfilUltimaColeta.textContent =
                    "Nenhuma coleta";

            }

        }

    }
);