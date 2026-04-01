// IMPORTS CORRETOS VIA CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SEU CONFIG (AJUSTADO)
const firebaseConfig = {
  apiKey: "AIzaSyA0SLOCqvZlTKyQv3fAdQA-RRt1FfWUBAw",
  authDomain: "representantes-escola.firebaseapp.com",
  projectId: "representantes-escola",
  storageBucket: "representantes-escola.firebasestorage.app",
  messagingSenderId: "984120464045",
  appId: "1:984120464045:web:e1689fbda9eb466c8fac24"
};

// INICIALIZAÇÃO
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// SENHAS
const senhaRep = "representado.em4c";
const senhaAdmin = "fernando123321";

// LOGIN
window.login = function () {
    let senha = prompt("Senha:");

    if (senha === senhaRep) {
        window.location.href = "painel.html";
    } else if (senha === senhaAdmin) {
        window.location.href = "admin.html";
    } else {
        alert("Senha incorreta");
    }
};

// PUBLICAR
window.publicar = async function (admin) {
    let tipo = document.getElementById("tipo").value;
    let titulo = document.getElementById("titulo").value;
    let texto = document.getElementById("texto").value;

    await addDoc(collection(db, "publicacoes"), {
        tipo,
        titulo,
        texto,
        data: new Date().toLocaleString(),
        admin
    });

    alert("Publicado com sucesso");
};

// CARREGAR SEÇÕES
window.carregarSecao = async function (tipo) {
    const querySnapshot = await getDocs(collection(db, "publicacoes"));
    let html = `<h2>${tipo.toUpperCase()}</h2>`;

    querySnapshot.forEach(doc => {
        let d = doc.data();

        if (d.tipo === tipo || (tipo === "decisoes" && d.admin)) {
            html += `
            <div class="card">
                <h3>${d.titulo}</h3>
                <p>${d.texto}</p>
                <small>${d.data}</small>
            </div>
            `;
        }
    });

    document.getElementById("conteudo").innerHTML = html;
};

// CARREGAR DECISÕES INICIAIS
async function carregarDecisoes() {
    const querySnapshot = await getDocs(collection(db, "publicacoes"));
    let html = "";

    querySnapshot.forEach(doc => {
        let d = doc.data();
        if (d.admin) {
            html += `
            <div class="card">
                <h3>${d.titulo}</h3>
                <p>${d.texto}</p>
                <small>${d.data}</small>
            </div>
            `;
        }
    });

    let el = document.getElementById("decisoes");
    if (el) el.innerHTML = html;
}

carregarDecisoes();
