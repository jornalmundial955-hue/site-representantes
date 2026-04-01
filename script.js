import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const senhaRep = "representado.em4c";
const senhaAdmin = "fernando123321";

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

window.listarTudo = async function () {
    const querySnapshot = await getDocs(collection(db, "publicacoes"));
    let html = "";

    querySnapshot.forEach(doc => {
        let d = doc.data();
        html += `<div class="card">${d.titulo}</div>`;
    });

    document.getElementById("adminLista").innerHTML = html;
};

carregarDecisoes();
