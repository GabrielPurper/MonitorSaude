// dashboard.js (igual ao anterior, mas com pequenas otimizações)
const firebaseConfig = { /* SEU CONFIG AQUI */ };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let chart, user = null, port = null;

// Protege acesso
firebase.auth().onAuthStateChanged(u => {
  if (!u) return location.href = "login.html";
  user = u;
  document.getElementById("userName").textContent = u.displayName || "Usuário";
  document.getElementById("userEmail").textContent = u.email;
  carregarHistorico();
});

// Navegação
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(x => x.classList.remove('active'));
    l.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.add('d-none'));
    document.getElementById(l.dataset.page + 'Page').classList.remove('d-none');
  });
});

// Logout
document.getElementById("logoutBtn").onclick = () => firebase.auth().signOut().then(() => location.href = "login.html");

// Gráfico
const ctx = document.getElementById('healthChart').getContext('2d');
chart = new Chart(ctx, {
  type: 'line',
  data: { labels: [], datasets: [
    { label: 'Pressão (mmHg)', data: [], borderColor: '#e74c3c', tension: 0.3, fill: false },
    { label: 'Pulso (bpm)', data: [], borderColor: '#27ae60', tension: 0.3, fill: false }
  ]},
  options: { responsive: true, maintainAspectRatio: false }
});

// Serial
document.getElementById("conectarBtn").onclick = async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    document.getElementById("espStatus").textContent = "Conectado";
    document.getElementById("espStatus").className = "status-on";
    document.getElementById("portaSerial").textContent = "USB";
    lerSerial();
  } catch (e) { alert("Erro: " + e.message); }
};

async function lerSerial() {
  const reader = port.readable.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const linha = decoder.decode(value).trim();
    if (linha.startsWith("DATA:")) {
      const [p, pul, st] = linha.split(":")[1].split(",");
      atualizarDashboard(+p, +pul, st);
      salvarHistorico(+p, +pul, st);
    }
  }
}

function atualizarDashboard(p, pul, st) {
  document.getElementById("pressao").textContent = p;
  document.getElementById("pulso").textContent = pul;
  ["Vermelho","Verde","Azul"].forEach(cor => {
    const el = document.getElementById("led" + cor);
    el.className = "led" + (st === cor.toUpperCase().slice(0, -1) ? " " + cor.toLowerCase() : "");
  });
  const t = new Date().toLocaleTimeString();
  chart.data.labels.push(t); chart.data.labels = chart.data.labels.slice(-20);
  chart.data.datasets[0].data.push(p); chart.data.datasets[0].data = chart.data.datasets[0].data.slice(-20);
  chart.data.datasets[1].data.push(pul); chart.data.datasets[1].data = chart.data.datasets[1].data.slice(-20);
  chart.update();
}

function salvarHistorico(p, pul, st) {
  db.ref(`historico/${user.uid}`).push({ pressao: p, pulso: pul, status: st, timestamp: firebase.database.ServerValue.TIMESTAMP });
}

function carregarHistorico() {
  const tbody = document.getElementById("historicoBody");
  db.ref(`historico/${user.uid}`).limitToLast(10).on('value', s => {
    tbody.innerHTML = "";
    const data = s.val();
    if (!data) { tbody.innerHTML = "<tr><td colspan='4'>Nenhum dado</td></tr>"; return; }
    Object.keys(data).reverse().forEach(k => {
      const d = data[k];
      const row = `<tr>
        <td>${new Date(d.timestamp).toLocaleString()}</td>
        <td>${d.pressao}</td>
        <td>${d.pulso}</td>
        <td><strong>${d.status}</strong></td>
      </tr>`;
      tbody.innerHTML += row;
    });
  });
}