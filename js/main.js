// =========================================================
// ECOSCHOOL — CARREGAR TEMA ANTES DA PÁGINA APARECER
// =========================================================

(function () {

    const temaSalvo = localStorage.getItem("ecoSchoolTema");

    if (temaSalvo === "dark") {
        document.documentElement.classList.add("dark-mode");
    }

})();

// ============================
// CONTROLE DE LOGIN E NAVBAR
// ============================

document.addEventListener("DOMContentLoaded", function () {

    const logado = localStorage.getItem("logado") === "true";

    const navLinks = document.getElementById("navLinks");

    const linksLogado = document.querySelectorAll(".link-logado");

    const btnComecar = document.querySelector(".primary-action");


    // ============================
    // USUÁRIO LOGADO
    // ============================

    if (logado) {

        // Mostra Ranking, Coletas e Perfil
        linksLogado.forEach(function (link) {
            link.style.display = "block";
        });

        // Esconde o botão "Começar agora"
        if (btnComecar) {
            btnComecar.style.display = "none";
        }

        // Navbar volta ao formato normal
        if (navLinks) {
            navLinks.classList.remove("navbar-nao-logado");
        }

    }


    // ============================
    // USUÁRIO NÃO LOGADO
    // ============================

    else {

        // Esconde Ranking, Coletas e Perfil
        linksLogado.forEach(function (link) {
            link.style.display = "none";
        });

        // Mostra o botão "Começar agora"
        if (btnComecar) {
            btnComecar.style.display = "inline-flex";
        }

        // Centraliza somente o Início
        if (navLinks) {
            navLinks.classList.add("navbar-nao-logado");
        }

    }


    // ============================
    // BOTÃO COMEÇAR AGORA
    // ============================

    if (btnComecar) {

        btnComecar.addEventListener("click", function () {

            if (!logado) {
                window.location.href = "login.html";
            }

        });

    }

});

/* =========================================================
   ECOSCHOOL — MODO ESCURO
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    /* =====================================================
       CRIAR BOTÃO
    ===================================================== */

    const botaoTema = document.createElement("button");

    botaoTema.type = "button";
    botaoTema.className = "theme-toggle";
    botaoTema.setAttribute(
        "aria-label",
        "Alternar modo escuro"
    );

    navbar.appendChild(botaoTema);


    /* =====================================================
       ATUALIZAR ÍCONE
    ===================================================== */

    function atualizarIcone() {

        const escuro =
            document.documentElement.classList.contains("dark-mode");

        botaoTema.innerHTML = escuro
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    }


    /* =====================================================
       CARREGAR TEMA SALVO
    ===================================================== */

    const temaSalvo =
        localStorage.getItem("ecoSchoolTema");

    if (temaSalvo === "dark") {

        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");

    } else {

        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
    }


    atualizarIcone();


    /* =====================================================
       ALTERAR TEMA
    ===================================================== */

    botaoTema.addEventListener("click", function () {

        const escuro =
            !document.documentElement.classList.contains("dark-mode");

        document.documentElement.classList.toggle(
            "dark-mode",
            escuro
        );

        document.body.classList.toggle(
            "dark-mode",
            escuro
        );

        localStorage.setItem(
            "ecoSchoolTema",
            escuro ? "dark" : "light"
        );

        atualizarIcone();
    });

});