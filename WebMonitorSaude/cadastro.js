// cadastro.js — ÍCONE DE OLHO COM FONT AWESOME (CORRIGIDO)

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Erro ao carregar: ${src}`));
    document.head.appendChild(script);
  });
}

async function init() {
  try {
    await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js');

    const firebaseConfig = {
      apiKey: "AIzaSyDCB4e8wCBDpKFTWRGTLAjBEgVUbcQHQno",
      authDomain: "monitorsaude-19ead.firebaseapp.com",
      databaseURL: "https://monitorsaude-19ead-default-rtdb.firebaseio.com",
      projectId: "monitorsaude-19ead",
      storageBucket: "monitorsaude-19ead.firebasestorage.app",
      messagingSenderId: "908296773636",
      appId: "1:908296773636:web:32b4cc9f847faf01c99551"
    };

    firebase.initializeApp(firebaseConfig);
    setupCadastro();
  } catch (err) {
    console.error(err);
    mostrarErro("Erro ao conectar com o servidor.");
  }
}

function setupCadastro() {
  const form = document.getElementById("cadastroForm");
  const erroCadastro = document.getElementById("erroCadastro");

  // === ÍCONE DO OLHO: CORRIGIDO E INVERTIDO ===
  document.querySelectorAll(".password-field").forEach(field => {
    const input = field.querySelector("input");
    const icon = document.createElement("i");

    // Ícone inicia com olho RISCADO (senha oculta)
    icon.className = "fas fa-eye-slash toggle-password";
    icon.style.cursor = "pointer";
    icon.style.position = "absolute";
    icon.style.right = "12px";
    icon.style.top = "50%";
    icon.style.transform = "translateY(-50%)";
    icon.style.fontSize = "18px";
    icon.style.color = "#666";
    icon.title = "Mostrar senha"; // Acessibilidade

    field.style.position = "relative";
    field.appendChild(icon);

    // Alterna tipo do input e ícone (lógica correta)
    icon.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      // Atualiza ícone e dica de ferramenta
      if (isPassword) {
        icon.classList.replace("fa-eye-slash", "fa-eye");
        icon.title = "Ocultar senha";
      } else {
        icon.classList.replace("fa-eye", "fa-eye-slash");
        icon.title = "Mostrar senha";
      }
    });
  });

  // === SUBMISSÃO DO FORMULÁRIO ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    erroCadastro.innerHTML = "";

    const nome = document.getElementById("cadastroNome").value.trim();
    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value;
    const confirmar = document.getElementById("cadastroConfirmarSenha").value;

    if (!nome) return mostrarErro("Digite seu nome.");
    if (!email) return mostrarErro("Digite seu e-mail.");
    if (!validarSenha(senha)) return;
    if (senha !== confirmar) return mostrarErro("As senhas não coincidem.");

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
      await userCredential.user.updateProfile({ displayName: nome });
      await userCredential.user.getIdToken(true);

      window.location.href = "index.html";
    } catch (error) {
      let msg = "Erro ao cadastrar.";
      switch (error.code) {
        case "auth/email-already-in-use":
          msg = "Este e-mail já está em uso.";
          break;
        case "auth/invalid-email":
          msg = "E-mail inválido.";
          break;
        case "auth/network-request-failed":
          msg = "Sem internet.";
          break;
        case "auth/weak-password":
          msg = "A senha é muito fraca.";
          break;
      }
      mostrarErro(msg);
    }
  });

  // === VALIDAÇÃO DE SENHA ===
  function validarSenha(senha) {
    if (senha.length < 8) {
      mostrarErro("A senha deve ter pelo menos 8 caracteres.");
      return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
      mostrarErro("A senha deve conter pelo menos 1 símbolo.");
      return false;
    }
    return true;
  }

  // === EXIBE ERRO NA TELA ===
  function mostrarErro(msg) {
    erroCadastro.innerHTML = `<div class="error-box">${msg}</div>`;
  }
}

// === INICIA A APLICAÇÃO ===
init();