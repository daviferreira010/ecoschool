// ============================
// PROTEÇÃO DE PÁGINAS
// ============================

(function () {

    const logado = localStorage.getItem("logado") === "true";

    // Impede que a página protegida
    // fique disponível pelo histórico
    window.history.replaceState(null, "", window.location.href);

    // Se não estiver logado, manda para o login
    if (!logado) {

        window.location.replace("login.html");

        return;

    }

})();