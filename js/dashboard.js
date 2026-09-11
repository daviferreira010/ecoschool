// Verifica se está logado
const user = localStorage.getItem("user");

if (!user) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}