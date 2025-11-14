// login.js — Login FORÇADO com e-mail e senha (SEM REDIRECIONAMENTO AUTOMÁTICO)

const firebaseConfig = {
  apiKey: "AIzaSyDCB4e8wCBDpKFTWRGTLAjBEgVUbcQHQno",
  authDomain: "monitorsaude-19ead.firebaseapp.com",
  databaseURL: "https://monitorsaude-19ead-default-rtdb.firebaseio.com",
  projectId: "monitorsaude-19ead",
  storageBucket: "monitorsaude-19ead.firebasestorage.app",
  messagingSenderId: "908296773636",
  appId: "1:908296773636:web:32b4cc9f847faf01c99551"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Elementos
const form = document.getElementById("loginForm");
const erroLogin = document.getElementById("erroLogin");

// === ÍCONE DE OLHO (mantido) ===
const senhaField = document.querySelector(".password-field");
if (senhaField) {
  const input = senhaField.querySelector("input");
  const icon = document.createElement("i");

  icon.className = "fas fa-eye-slash";
  icon.style.cssText = `
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    font-size: 18px; color: #666; cursor: pointer;
  `;
  icon.title = "Mostrar senha";

  senhaField.style.position = "relative";
  senhaField.appendChild(icon);

  icon.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    icon.classList.replace(isPassword ? "fa-eye-slash" : "fa-eye", isPassword ? "fa-eye" : "fa-eye-slash");
    icon.title = isPassword ? "Ocultar senha" : "Mostrar senha";
  });
}

// === LOGIN COM E-MAIL E SENHA (SÓ QUANDO CLICAR EM "ENTRAR") ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  erroLogin.innerHTML = "";

  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value;

  if (!email || !senha) {
    return mostrarErro("Preencha e-mail e senha.");
  }

  try {
    // TENTA FAZER LOGIN
    await firebase.auth().signInWithEmailAndPassword(email, senha);
    
    // REDIRECIONA PARA index.html (DASHBOARD)
    window.location.href = "index.html";
  } catch (error) {
    let msg = "Erro ao fazer login.";
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        msg = "E-mail ou senha incorretos.";
        break;
      case "auth/invalid-email":
        msg = "E-mail inválido.";
        break;
      case "auth/network-request-failed":
        msg = "Sem internet.";
        break;
      case "auth/too-many-requests":
        msg = "Muitas tentativas. Tente mais tarde.";
        break;
    }
    mostrarErro(msg);
  }
});

// FUNÇÃO PARA MOSTRAR ERRO
function mostrarErro(msg) {
  erroLogin.innerHTML = `<div class="error-box">${msg}</div>`;
}