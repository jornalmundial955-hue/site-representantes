// IMPORTS FIREBASE (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CONFIG FIREBASE
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

// CONTROLE DE SESSÃO
let isAdmin = false;

// LOGIN
window.login = function () {
    let senha = prompt("Digite a senha:");

    if (senha === senhaRep) {
        localStorage.setItem("admin", "false");
        window.location.href = "painel.html";
    } else if (senha === senhaAdmin) {
        localStorage.setItem("admin", "true");
        window.location.href = "admin.html";
    } else {
        alert("Senha incorreta");
    }
};

// VERIFICAR SE É ADMIN
function verificarAdmin() {
    return localStorage.getItem("admin") === "true";
}

// PUBLICAR DOCUMENTO
window.publicar = async function (admin) {
    let tipo = document.getElementById("tipo").value;
    let titulo = document.getElementById("titulo").value;
    let texto = document.getElementById("texto").value;

    if (!titulo || !texto) {
        alert("Preencha todos os campos");
        return;
    }

    await addDoc(collection(db, "publicacoes"), {
        tipo: tipo,
        titulo: titulo,
        texto: texto,
        data: new Date().toLocaleString(),
        admin: admin
    });

    alert("Documento publicado com sucesso");
};

// EXCLUIR (APENAS ADMIN)
window.excluir = async function (id) {
    if (!verificarAdmin()) {
        alert("Apenas a administração pode excluir documentos.");
        return;
    }

    let confirmar = confirm("Deseja realmente excluir este documento?");
    if (!confirmar) return;

    await deleteDoc(doc(db, "publicacoes", id));

    alert("Documento excluído com sucesso");
    location.reload();
};

// CARREGAR DOCUMENTOS (ESTILO DECLARATIO)
window.carregar = async function (tipo) {
    const querySnapshot = await getDocs(collection(db, "publicacoes"));

    let html = `<h2 style="text-align:center;">${tipo.toUpperCase()}</h2>`;

    querySnapshot.forEach(documento => {
        let d = documento.data();
        let id = documento.id;

        if (d.tipo === tipo || (tipo === "decisoes" && d.admin)) {

            let botaoExcluir = verificarAdmin()
                ? `<br><br><button onclick="excluir('${id}')">Excluir</button>`
                : "";

            html += `
            <div class="documento">
                <h2>${d.titulo}</h2>

                <p>${d.texto}</p>

                <small>${d.data}</small>

                ${botaoExcluir}
            </div>
            `;
        }
    });

    document.getElementById("conteudo").innerHTML = html;
};

// CARREGAR PÁGINA INICIAL
async function carregarInicio() {
    const querySnapshot = await getDocs(collection(db, "publicacoes"));

    let html = "";

    querySnapshot.forEach(documento => {
        let d = documento.data();

        if (d.admin) {
            html += `
            <div class="card">
                <h3>${d.titulo}</h3>
                <p>${d.texto.substring(0, 150)}...</p>
                <small>${d.data}</small>
            </div>
            `;
        }
    });

    let lista = document.getElementById("lista");
    if (lista) lista.innerHTML = html;
}

// INICIAR
carregarInicio();
