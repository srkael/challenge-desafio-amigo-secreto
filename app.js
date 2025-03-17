// CAPTURAR ELEMENTOS AMIGO SECRETO
let elemAmigo = document.getElementById("amigo"); // input
let elemListaAmigos = document.getElementById("listaAmigos"); // ul
let elemResultado = document.getElementById("resultado"); // ul
let botaoSortear = document.querySelector(".button-draw"); // botão sortear/resetar

// LISTA DE ARRAYS
let arrAmigosIncluidos = [];
let arrAmigosSorteados = [];

// Limite de tentativas de embaralhamento para evitar loop infinito
const MAX_TENTATIVAS = 100;
let contador = 1;

// Estilizar o botão de sortear/resetar logo no início
function estilizarBotao() {
    // Estilização base do botão
    botaoSortear.style.display = "block";
    botaoSortear.style.width = "220px";
    botaoSortear.style.margin = "20px auto";
    botaoSortear.style.padding = "12px 20px";
    botaoSortear.style.fontSize = "16px";
    botaoSortear.style.fontWeight = "bold";
    botaoSortear.style.borderRadius = "50px";
    botaoSortear.style.cursor = "pointer";
    botaoSortear.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    botaoSortear.style.transition = "all 0.3s ease";
    botaoSortear.style.textTransform = "uppercase";
    botaoSortear.style.letterSpacing = "1px";
    botaoSortear.style.border = "none";
    botaoSortear.style.outline = "none";

    // Aplicar estilo específico baseado no texto do botão
    if (botaoSortear.textContent.includes("Sortear")) {
        // Estilo para o botão "Sortear amigo"
        botaoSortear.textContent = "🎲 Sortear amigo";
        botaoSortear.style.backgroundColor = "#4a76a8";
        botaoSortear.style.color = "white";
    } else {
        // Estilo para o botão "Resetar"
        botaoSortear.textContent = "🔄 Resetar";
        botaoSortear.style.backgroundColor = "#e74c3c";
        botaoSortear.style.color = "white";
    }

    // Adicionar efeitos hover
    botaoSortear.onmouseover = function () {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
        if (this.textContent.includes("Sortear")) {
            this.style.backgroundColor = "#3a67b2";
        } else {
            this.style.backgroundColor = "#d44637";
        }
    };

    botaoSortear.onmouseout = function () {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        if (this.textContent.includes("Sortear")) {
            this.style.backgroundColor = "#4a76a8";
        } else {
            this.style.backgroundColor = "#e74c3c";
        }
    };

    // Adicionar efeito de clique
    botaoSortear.onmousedown = function () {
        this.style.transform = "translateY(1px)";
        this.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    };

    botaoSortear.onmouseup = function () {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
    };
}

// FUNCAO ADICIONAR AMIGO - adicionar através da tecla Enter
elemAmigo.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        adicionarAmigo();
    }
});

// FUNCAO ADICIONAR AMIGO
function adicionarAmigo() {
    const nome = elemAmigo.value.trim();

    if (nome === "") {
        alert("Digite um nome válido!");
        return;
    }

    if (arrAmigosIncluidos.includes(nome.toUpperCase())) {
        alert("Esse nome já foi adicionado!");
        return;
    }

    arrAmigosIncluidos.push(nome.toUpperCase());
    atualizarLista();
    elemAmigo.value = "";
    elemAmigo.focus(); // Retorna o foco para o campo de entrada
}

function atualizarLista() {
    elemListaAmigos.innerHTML = "";

    if (arrAmigosIncluidos.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum amigo adicionado ainda";
        mensagem.style.fontStyle = "italic";
        mensagem.style.color = "#999";
        elemListaAmigos.appendChild(mensagem);
        return;
    }

    arrAmigosIncluidos.forEach((amigo, index) => {
        const li = document.createElement("li");
        li.textContent = amigo;
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        li.style.padding = "5px 0";

        const botaoRemover = document.createElement("span");
        botaoRemover.textContent = "✖";
        botaoRemover.style.marginLeft = "8px";
        botaoRemover.style.fontSize = "12px";
        botaoRemover.style.color = "red";
        botaoRemover.style.cursor = "pointer";
        botaoRemover.style.userSelect = "none";
        botaoRemover.style.fontWeight = "bold";
        botaoRemover.title = "Remover";
        botaoRemover.onclick = () => removerAmigo(index);

        li.appendChild(botaoRemover);
        elemListaAmigos.appendChild(li);
    });

    // Mostrar quantidade de amigos
    const totalAmigos = document.createElement("p");
    totalAmigos.textContent = `Total: ${arrAmigosIncluidos.length} ${arrAmigosIncluidos.length === 1 ? 'amigo' : 'amigos'}`;
    totalAmigos.style.marginTop = "10px";
    totalAmigos.style.fontWeight = "bold";
    elemListaAmigos.appendChild(totalAmigos);
}

function removerAmigo(index) {
    const nome = arrAmigosIncluidos[index];
    if (confirm(`Deseja remover ${nome} da lista?`)) {
        arrAmigosIncluidos.splice(index, 1);
        atualizarLista();
    }
}

function sortearAmigo() {
    if (arrAmigosIncluidos.length < 2) {
        alert("Adicione pelo menos 2 amigos para o sorteio!");
        return;
    }

    // Efeito visual de processamento no botão
    const textoOriginal = botaoSortear.textContent;
    botaoSortear.textContent = "Sorteando...";
    botaoSortear.style.backgroundColor = "#999";
    botaoSortear.disabled = true;
    botaoSortear.style.cursor = "wait";

    // Limpa lista de resultados
    elemResultado.innerHTML = "";

    // Usar setTimeout para criar o efeito visual de processamento
    setTimeout(() => {
        contador = 1;
        const sorteioBemSucedido = realizaSorteio();

        if (sorteioBemSucedido) {
            exibirResultado();
            botaoSortear.setAttribute("onclick", "resetarJogo()");
            botaoSortear.disabled = false;
            botaoSortear.textContent = "🔄 Resetar";
            botaoSortear.style.backgroundColor = "#e74c3c";
            botaoSortear.style.cursor = "pointer";
        } else {
            alert("Não foi possível realizar o sorteio após várias tentativas. Tente novamente ou ajuste a lista de amigos.");
            botaoSortear.textContent = textoOriginal;
            botaoSortear.style.backgroundColor = "#4a76a8";
            botaoSortear.disabled = false;
            botaoSortear.style.cursor = "pointer";
        }

        // Reaplica os efeitos hover
        estilizarBotao();
    }, 800); // Pequeno atraso para efeito visual
}

// FUNCAO PARA GERAR LISTA DE AMIGO E SEU AMIGO SECRETO
function realizaSorteio() {
    while (contador <= MAX_TENTATIVAS) {
        arrAmigosSorteados.length = 0;
        const arrAmigosEmbaralhados = arrAmigosIncluidos.slice();
        embaralhaAmigos(arrAmigosEmbaralhados);
        console.log(`Embaralhamento n: ${contador}`, arrAmigosEmbaralhados);

        let sorteioValido = true;

        // Verifica se o amigo tirou ele mesmo
        for (let i = 0; i < arrAmigosIncluidos.length; i++) {
            if (arrAmigosEmbaralhados[i] === arrAmigosIncluidos[i]) {
                sorteioValido = false;
                break;
            }
        }

        if (sorteioValido) {
            arrAmigosSorteados = [...arrAmigosEmbaralhados];
            return true;
        }

        contador++;
    }

    return false;
}

// FUNCAO PARA EMBARALHAR LISTA DE AMIGOS
function embaralhaAmigos(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function exibirResultado() {
    elemResultado.innerHTML = "";

    // Criar container com estilo melhorado para o resultado
    const resultContainer = document.createElement("div");
    resultContainer.style.backgroundColor = "#f5f5f5";
    resultContainer.style.border = "1px solid #ddd";
    resultContainer.style.borderRadius = "8px";
    resultContainer.style.padding = "15px";
    resultContainer.style.marginTop = "20px";
    resultContainer.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

    // Adicionar título com destaque
    const titulo = document.createElement("h3");
    titulo.textContent = "🎁 RESULTADO DO SORTEIO";
    titulo.style.textAlign = "center";
    titulo.style.marginBottom = "15px";
    titulo.style.padding = "10px";
    titulo.style.borderBottom = "2px solid #ddd";
    titulo.style.color = "#333";
    resultContainer.appendChild(titulo);

    // Criar uma tabela para melhor visualização dos resultados
    const tabela = document.createElement("table");
    tabela.style.width = "100%";
    tabela.style.borderCollapse = "collapse";

    // Cabeçalho da tabela
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const thPessoa = document.createElement("th");
    thPessoa.textContent = "AMIGO";
    thPessoa.style.padding = "10px";
    thPessoa.style.backgroundColor = "#e0e0e0";
    thPessoa.style.textAlign = "left";
    thPessoa.style.width = "45%";
    thPessoa.style.borderBottom = "2px solid #ccc";

    const thSeta = document.createElement("th");
    thSeta.textContent = "";
    thSeta.style.padding = "10px";
    thSeta.style.width = "10%";
    thSeta.style.backgroundColor = "#e0e0e0";
    thSeta.style.borderBottom = "2px solid #ccc";

    const thSorteado = document.createElement("th");
    thSorteado.textContent = "TIROU";
    thSorteado.style.padding = "10px";
    thSorteado.style.backgroundColor = "#e0e0e0";
    thSorteado.style.textAlign = "left";
    thSorteado.style.width = "45%";
    thSorteado.style.borderBottom = "2px solid #ccc";

    headerRow.appendChild(thPessoa);
    headerRow.appendChild(thSeta);
    headerRow.appendChild(thSorteado);
    thead.appendChild(headerRow);
    tabela.appendChild(thead);

    // Corpo da tabela
    const tbody = document.createElement("tbody");

    arrAmigosIncluidos.forEach((amigo, index) => {
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid #ddd";

        const tdPessoa = document.createElement("td");
        tdPessoa.textContent = amigo;
        tdPessoa.style.padding = "12px 10px";
        tdPessoa.style.fontWeight = "bold";

        const tdSeta = document.createElement("td");
        tdSeta.textContent = "➔";
        tdSeta.style.textAlign = "center";
        tdSeta.style.fontSize = "16px";
        tdSeta.style.color = "#555";

        const tdSorteado = document.createElement("td");
        tdSorteado.textContent = arrAmigosSorteados[index];
        tdSorteado.style.padding = "12px 10px";
        tdSorteado.style.backgroundColor = "#efefef";
        tdSorteado.style.fontWeight = "bold";

        // Alternar cores das linhas para melhor leitura
        if (index % 2 === 0) {
            tr.style.backgroundColor = "#f9f9f9";
        }

        tr.appendChild(tdPessoa);
        tr.appendChild(tdSeta);
        tr.appendChild(tdSorteado);
        tbody.appendChild(tr);
    });

    tabela.appendChild(tbody);
    resultContainer.appendChild(tabela);

    // Adicionar botão para copiar resultados
    const botaoCopiar = document.createElement("button");
    botaoCopiar.textContent = "📋 Copiar Resultados";
    botaoCopiar.style.display = "block";
    botaoCopiar.style.margin = "15px auto 5px auto";
    botaoCopiar.style.padding = "8px 15px";
    botaoCopiar.style.backgroundColor = "#4a76a8";
    botaoCopiar.style.color = "white";
    botaoCopiar.style.border = "none";
    botaoCopiar.style.borderRadius = "4px";
    botaoCopiar.style.cursor = "pointer";
    botaoCopiar.style.fontWeight = "bold";
    botaoCopiar.onclick = copiarResultados; // Passando a função diretamente
    resultContainer.appendChild(botaoCopiar);

    // Adicionar o container ao resultado
    elemResultado.appendChild(resultContainer);

    // Scroll para os resultados
    elemResultado.scrollIntoView({ behavior: "smooth" });
}

function copiarResultados() {
    let texto = "RESULTADO DO SORTEIO DE AMIGO SECRETO:\n\n";
    arrAmigosIncluidos.forEach((amigo, index) => {
        texto += `${amigo} → ${arrAmigosSorteados[index]}\n`;
    });

    navigator.clipboard.writeText(texto)
        .then(() => {
            const botao = document.querySelector("#resultado button"); // Seleciona o botão dentro do resultado
            const textoOriginal = botao.textContent;
            botao.textContent = "✅ Copiado!";
            setTimeout(() => {
                botao.textContent = textoOriginal;
            }, 2000);
        })
        .catch(err => alert("Erro ao copiar: " + err));
}

function resetarJogo() {
    if (arrAmigosIncluidos.length > 0 && !confirm("Deseja realmente resetar o jogo? Todos os amigos serão removidos.")) {
        return;
    }

    arrAmigosIncluidos = [];
    arrAmigosSorteados = [];
    elemResultado.innerHTML = "";
    elemListaAmigos.innerHTML = "";
    elemAmigo.value = "";
    elemAmigo.focus();
    botaoSortear.textContent = "Sortear amigo";
    botaoSortear.setAttribute("onclick", "sortearAmigo()");
    atualizarLista();
}

// Inicializar a lista vazia ao carregar a página
window.onload = function () {
    atualizarLista();
    elemAmigo.focus();
};