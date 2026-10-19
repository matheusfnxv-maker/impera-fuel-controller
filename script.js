// ─── Seletores principais ──────────────────────────────
const areaSemanas = document.querySelector("#area-semanas");
const tituloResumo = document.querySelector("#titulo-resumo");
const inputPrecoGasolina = document.querySelector("#preco-gasolina");
const inputKmPorLitro = document.querySelector("#km-por-litro");
const linhasResumo = document.querySelectorAll("#corpo-resumo tr:not(#linha-total)");
const totalKmSemanaEl = document.querySelector("#total-km-semana");
const totalValorSemanaEl = document.querySelector("#total-valor-semana");
const inputNomeUsuario = document.querySelector("#nome-usuario");
const inputFuncaoUsuario = document.querySelector("#funcao-usuario");
   

const diasDaSemana = [
    "domingo", "segunda-feira", "terça-feira",
    "quarta-feira", "quinta-feira", "sexta-feira", "sábado"
];

// ─── Helpers ────────────────────────────────────────────
function formataTituloData(valorData) {
    if (!valorData) return "";
    const data = new Date(valorData + "T00:00:00");
    const nomeDia = diasDaSemana[data.getDay()];
    const dataFormatada = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
    });
    return `${nomeDia}, ${dataFormatada}`;
}

function escapaTexto(texto) {
    const div = document.createElement("div");
    div.textContent = texto || "";
    return div.innerHTML;
}

// ─── Cálculo do total de km por linha ──────────────────
areaSemanas.addEventListener("input", function (evento) {
    if (evento.target.name === "km-ida" || evento.target.name === "km-volta") {
        const linha = evento.target.closest("tr");
        const ida = Number(linha.querySelector('input[name="km-ida"]').value) || 0;
        const volta = Number(linha.querySelector('input[name="km-volta"]').value) || 0;
        const soma = ida + volta
        linha.querySelector(".total-km").textContent = soma.toFixed(2);
        calculaResumo();
    }
});

inputPrecoGasolina.addEventListener("input", calculaResumo);
inputKmPorLitro.addEventListener("input", calculaResumo);

// ─── Título da data (dia da semana + data formatada) ───
areaSemanas.addEventListener("input", function (evento) {
    if (evento.target.classList.contains("input-data")) {
        const inputData = evento.target;
        const tituloData = inputData.closest(".cabecalho-data").querySelector(".titulo-data");
        tituloData.textContent = formataTituloData(inputData.value);
        calculaResumo();
    }
});

// ─── Título da semana → reflete na sidebar (só se selecionada) ───
areaSemanas.addEventListener("input", function (evento) {
    if (evento.target.classList.contains("titulo-semana")) {
        const semana = evento.target.closest(".bloco-semana");
        if (semana.classList.contains("semana-selecionada")) {
            tituloResumo.textContent = evento.target.textContent;
        }
    }
});

// ─── Excluir linha ──────────────────────────────────────
areaSemanas.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-excluir-linha")) {
        const linha = evento.target.closest("tr");
        const tbody = linha.closest("tbody");
        const totalLinhas = tbody.querySelectorAll("tr").length;

        if (totalLinhas > 1) {
            linha.remove();
            calculaResumo();
        }
    }
});

// ─── Nova linha ─────────────────────────────────────────
areaSemanas.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-nova-linha")) {
        const tbody = evento.target.closest(".bloco-dia").querySelector("tbody");
        const primeiraLinha = tbody.querySelector("tr");
        const novaLinha = primeiraLinha.cloneNode(true);

        novaLinha.querySelectorAll("input").forEach(function (input) {
            input.value = "";
        });
        novaLinha.querySelector(".total-km").textContent = "0";

        tbody.appendChild(novaLinha);
        calculaResumo();
    }
});

// ─── Próximo dia ────────────────────────────────────────
areaSemanas.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-proximo-dia")) {
        const semana = evento.target.closest(".bloco-semana");
        const conteudoSemana = semana.querySelector(".conteudo-semana");
        const diasExistentes = semana.querySelectorAll(".bloco-dia");
        const diaModelo = diasExistentes[diasExistentes.length - 1];
        const btnProximoDia = evento.target;

        const novoDia = diaModelo.cloneNode(true);

        novoDia.querySelector(".input-data").value = "";
        novoDia.querySelector(".titulo-data").textContent = "";

        const linhasExtras = novoDia.querySelectorAll("tbody tr");
        linhasExtras.forEach(function (linha, indice) {
            if (indice > 0) {
                linha.remove();
            }
        });

        const primeiraLinha = novoDia.querySelector("tbody tr");
        primeiraLinha.querySelectorAll("input").forEach(function (input) {
            input.value = "";
        });
        primeiraLinha.querySelector(".total-km").textContent = "0";

        conteudoSemana.insertBefore(novoDia, btnProximoDia);
        calculaResumo();
    }
});

// ─── Excluir dia ────────────────────────────────────────
areaSemanas.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-excluir-dia")) {
        const dia = evento.target.closest(".bloco-dia");
        const semana = dia.closest(".bloco-semana");
        const totalDias = semana.querySelectorAll(".bloco-dia").length;

        if (totalDias > 1) {
            dia.remove();
            calculaResumo();
        }
    }
});

// ─── Excluir semana ─────────────────────────────────────
areaSemanas.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-excluir")) {
        const semana = evento.target.closest(".bloco-semana");
        const totalSemanas = document.querySelectorAll(".bloco-semana").length;

        if (totalSemanas > 1) {
            const eraSelecionada = semana.classList.contains("semana-selecionada");
            semana.remove();

            if (eraSelecionada) {
                const primeiraRestante = document.querySelector(".bloco-semana");
                primeiraRestante.classList.add("semana-selecionada");
                tituloResumo.textContent = primeiraRestante.querySelector(".titulo-semana").textContent;
            }
            calculaResumo();
        }
    }
});

// ─── Minimizar/expandir semana ──────────────────────────
areaSemanas.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-minimizar-semana")) {
        const semana = evento.target.closest(".bloco-semana");
        const conteudo = semana.querySelector(".conteudo-semana");
        conteudo.classList.toggle("escondido");
        evento.target.textContent = conteudo.classList.contains("escondido") ? "►" : "▼";
    }
});

// ─── Nova semana ────────────────────────────────────────
let contadorSemana = document.querySelectorAll(".bloco-semana").length;

const btnNovaSemana = document.querySelector("#btn-nova-semana");

btnNovaSemana.addEventListener("click", function () {
    const semanas = document.querySelectorAll(".bloco-semana");
    const semanaModelo = semanas[semanas.length - 1];
    const novaSemana = semanaModelo.cloneNode(true);

    contadorSemana++;
    novaSemana.id = `semana-${contadorSemana}`;
    novaSemana.classList.remove("semana-selecionada");
    novaSemana.querySelector(".titulo-semana").textContent = `Semana...`;

    const dias = novaSemana.querySelectorAll(".bloco-dia");
    dias.forEach(function (dia, indice) {
        if (indice > 0) dia.remove();
    });

    const diaRestante = novaSemana.querySelector(".bloco-dia");
    diaRestante.querySelector(".input-data").value = "";
    diaRestante.querySelector(".titulo-data").textContent = "";

    const linhas = diaRestante.querySelectorAll("tbody tr");
    linhas.forEach(function (linha, indice) {
        if (indice > 0) linha.remove();
    });

    const primeiraLinha = diaRestante.querySelector("tbody tr");
    primeiraLinha.querySelectorAll("input").forEach(function (input) {
        input.value = "";
    });
    primeiraLinha.querySelector(".total-km").textContent = "0";

    novaSemana.querySelector(".conteudo-semana").classList.remove("escondido");
    novaSemana.querySelector(".btn-minimizar-semana").textContent = "▼";

    areaSemanas.appendChild(novaSemana);
    calculaResumo();
    salvaDados();
});

// ─── Selecionar semana ──────────────────────────────────
areaSemanas.addEventListener("click", function (evento) {
    const semanaClicada = evento.target.closest(".bloco-semana");
    if (!semanaClicada || evento.target.tagName === "BUTTON") return;

    document.querySelectorAll(".bloco-semana").forEach(function (semana) {
        semana.classList.remove("semana-selecionada");
    });
    semanaClicada.classList.add("semana-selecionada");
    tituloResumo.textContent = semanaClicada.querySelector(".titulo-semana").textContent;
    calculaResumo();
});

// ─── Cálculo do resumo semanal (km + valor por dia) ────
function calculaResumo() {
    const semana = document.querySelector(".bloco-semana.semana-selecionada");
    if (!semana) return;

    const precoGasolina = Number(inputPrecoGasolina.value) || 0;
    const kmPorLitro = Number(inputKmPorLitro.value) || 0;
    const kmPorDia = [0, 0, 0, 0, 0, 0, 0];

    semana.querySelectorAll(".bloco-dia").forEach(function (dia) {
        const inputData = dia.querySelector(".input-data");
        if (!inputData.value) return;

        const data = new Date(inputData.value + "T00:00:00");
        const indice = (data.getDay() + 6) % 7;

        let kmDoDia = 0;
        dia.querySelectorAll(".total-km").forEach(function (celula) {
            kmDoDia += Number(celula.textContent) || 0;
        });

        kmPorDia[indice] += kmDoDia;
    });

    let totalKmSemana = 0;
    let totalValorSemana = 0;

    linhasResumo.forEach(function (linha, indice) {
        const km = kmPorDia[indice];
        const valor = kmPorLitro > 0 ? (km / kmPorLitro) * precoGasolina : 0;

        linha.querySelector(".resumo-km").textContent = `${km} km`;
        linha.querySelector(".resumo-valor").textContent = `R$${valor.toFixed(2).replace(".", ",")}`;

        totalKmSemana += km;
        totalValorSemana += valor;
    });

    totalKmSemanaEl.textContent = `${totalKmSemana} km`;
    totalValorSemanaEl.textContent = `R$${totalValorSemana.toFixed(2).replace(".", ",")}`;
}

// ─── Persistência: coleta o estado atual do app ────────
function coletaEstado() {
    const estado = {
        nomeUsuario: inputNomeUsuario.value,
        funcaoUsuario: inputFuncaoUsuario.value,    
        precoGasolina: inputPrecoGasolina.value,
        kmPorLitro: inputKmPorLitro.value,
        semanas: []
    };

    document.querySelectorAll(".bloco-semana").forEach(function (semana) {
        const semanaData = {
            titulo: semana.querySelector(".titulo-semana").textContent,
            selecionada: semana.classList.contains("semana-selecionada"),
            dias: []
        };

        semana.querySelectorAll(".bloco-dia").forEach(function (dia) {
            const diaData = {
                data: dia.querySelector(".input-data").value,
                linhas: []
            };

            dia.querySelectorAll("tbody tr").forEach(function (linha) {
                diaData.linhas.push({
                    finalidade: linha.querySelector('input[name="finalidade"]').value,
                    local: linha.querySelector('input[name="local"]').value,
                    kmIda: linha.querySelector('input[name="km-ida"]').value,
                    kmVolta: linha.querySelector('input[name="km-volta"]').value,
                    anotacoes: linha.querySelector('input[name="anotacoes"]').value
                });
            });

            semanaData.dias.push(diaData);
        });

        estado.semanas.push(semanaData);
    });

    return estado;
}

function salvaDados() {
    const estado = coletaEstado();
    localStorage.setItem("impera-fuel-controller", JSON.stringify(estado));
}

// ─── Persistência: monta o HTML a partir dos dados salvos ───
function montaLinhaHTML(linha) {
    const total = (Number(linha.kmIda) || 0) + (Number(linha.kmVolta) || 0);
    return `
        <tr>
            <td><input name="finalidade" type="text" value="${escapaTexto(linha.finalidade)}"></td>
            <td><input name="local" type="text" value="${escapaTexto(linha.local)}"></td>
            <td><input name="km-ida" type="number" value="${linha.kmIda}"></td>
            <td><input name="km-volta" type="number" value="${linha.kmVolta}"></td>
            <td class="total-km">${total}</td>
            <td><input name="anotacoes" type="text" value="${escapaTexto(linha.anotacoes)}"></td>
            <td><button class="btn-excluir-linha">X</button></td>
        </tr>
    `;
}

function montaDiaHTML(dia) {
    const linhasHTML = dia.linhas.map(montaLinhaHTML).join("");
    return `
        <div class="bloco-dia">
            <div class="cabecalho-data">
                <input type="date" class="input-data" value="${dia.data}">
                <h2 class="titulo-data">${formataTituloData(dia.data)}</h2>
                <button class="btn-excluir-dia">X</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>finalidade</th>
                        <th>local</th>
                        <th>km ida</th>
                        <th>km volta</th>
                        <th>total</th>
                        <th>anotacoes</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${linhasHTML}
                </tbody>
            </table>
            <div class="acoes-dia">
                <button class="btn-nova-linha">+ nova viagem</button>
            </div>
        </div>
    `;
}

function montaSemanaHTML(semana, indice) {
    const diasHTML = semana.dias.map(montaDiaHTML).join("");
    const classeSelecionada = semana.selecionada ? " semana-selecionada" : "";
    return `
        <section class="bloco-semana${classeSelecionada}" id="semana-${indice + 1}">
            <div class="cabecalho-semana">
                <span class="titulo-semana" contenteditable="true">${escapaTexto(semana.titulo)}</span>
                <div class="acoes-semana">
                    <button class="btn-pdf">PDF</button>
                    <button class="btn-excluir">Excluir</button>
                    <button class="btn-minimizar-semana">▼</button>
                </div>
            </div>
            <div class="conteudo-semana">
                ${diasHTML}
                <button class="btn-proximo-dia">+ novo dia</button>
            </div>
        </section>
    `;
}

function carregaDados() {
    const dadosSalvos = localStorage.getItem("impera-fuel-controller");
    if (!dadosSalvos) return;

    const estado = JSON.parse(dadosSalvos);

    inputNomeUsuario.value = estado.nomeUsuario || "";
    inputFuncaoUsuario.value = estado.funcaoUsuario || "";
    inputPrecoGasolina.value = estado.precoGasolina || "";
    inputKmPorLitro.value = estado.kmPorLitro || "";

    areaSemanas.innerHTML = estado.semanas.map(montaSemanaHTML).join("");
    contadorSemana = estado.semanas.length;

    const semanaSelecionada = document.querySelector(".bloco-semana.semana-selecionada")
        || document.querySelector(".bloco-semana");

    if (semanaSelecionada) {
        semanaSelecionada.classList.add("semana-selecionada");
        tituloResumo.textContent = semanaSelecionada.querySelector(".titulo-semana").textContent;
    }

    calculaResumo();
}

// ─── Salva automaticamente após qualquer alteração ─────
areaSemanas.addEventListener("input", salvaDados);
areaSemanas.addEventListener("click", salvaDados);
inputPrecoGasolina.addEventListener("input", salvaDados);
inputKmPorLitro.addEventListener("input", salvaDados);
inputNomeUsuario.addEventListener("input", salvaDados);
inputFuncaoUsuario.addEventListener("input", salvaDados);

// ─── Carrega os dados salvos ao abrir a página ─────────
carregaDados();

function geraPDF(semana) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nomeSemana = semana.querySelector(".titulo-semana").textContent;
    const precoGasolina = Number(inputPrecoGasolina.value) || 0;
    const kmPorLitro = Number(inputKmPorLitro.value) || 0;

    // ─── Etapa 1: coletar todos os dados primeiro ───
    const diasData = [];
    let totalKmSemana = 0;
    let totalViagens = 0;

    semana.querySelectorAll(".bloco-dia").forEach(function (dia) {
        const tituloData = dia.querySelector(".titulo-data").textContent;
        if (!tituloData) return;

        const linhas = [];
        let kmDoDia = 0;

        dia.querySelectorAll("tbody tr").forEach(function (linha) {
            const finalidade = linha.querySelector('input[name="finalidade"]').value || "-";
            const local = linha.querySelector('input[name="local"]').value || "-";
            const kmIda = Number(linha.querySelector('input[name="km-ida"]').value) || 0;
            const kmVolta = Number(linha.querySelector('input[name="km-volta"]').value) || 0;
            const totalLinha = kmIda + kmVolta;
            const anotacoes = linha.querySelector('input[name="anotacoes"]').value || "-";

            linhas.push([finalidade, local, `${kmIda} km`, `${kmVolta} km`, `${totalLinha} km`, anotacoes]);
            kmDoDia += totalLinha;
            totalViagens++;
        });

        diasData.push({ titulo: tituloData, linhas, kmDoDia });
        totalKmSemana += kmDoDia;
    });

    const totalValorSemana = kmPorLitro > 0 ? (totalKmSemana / kmPorLitro) * precoGasolina : 0;

    // ─── Etapa 2: faixa de cabeçalho ───
    doc.setFillColor(13, 31, 60);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont(undefined, "bold");
    doc.text("IMPERA FUEL CONTROLLER", 14, 14);
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text(nomeSemana, 14, 22);

    // ─── Etapa 3: identificação da pessoa (nome maior, função como subtítulo) ───
    let y = 41;
    const nomeUsuario = (inputNomeUsuario.value || "").trim();
    const funcaoUsuario = (inputFuncaoUsuario.value || "").trim();

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.setTextColor(13, 31, 60);
    if (nomeUsuario) {
        doc.text(nomeUsuario, 14, y);
    }
    y += 6;

    doc.setFontSize(9.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(74, 85, 104);
    if (funcaoUsuario) {
        doc.text(funcaoUsuario, 14, y);
    }
    y += 10;

    // ─── Etapa 4: os 3 números em destaque ───
    const cardW = 58;
    const cardX = [14, 76, 138];
    const labels = ["TOTAL RODADO", "VIAGENS", "A REEMBOLSAR"];
    const valores = [`${totalKmSemana} km`, `${totalViagens}`, `R$${totalValorSemana.toFixed(2).replace(".", ",")}`];

    valores.forEach(function (valor, i) {
        doc.setFillColor(242, 244, 248);
        doc.roundedRect(cardX[i], y, cardW, 24, 2, 2, "F");
        doc.setFillColor(245, 196, 0);
        doc.rect(cardX[i], y, cardW, 1.2, "F");

        doc.setTextColor(13, 31, 60);
        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.text(valor, cardX[i] + cardW / 2, y + 13, { align: "center" });

        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.setTextColor(74, 85, 104);
        doc.text(labels[i], cardX[i] + cardW / 2, y + 20, { align: "center" });
    });

    y += 24 + 10;

    doc.setFontSize(9);
    doc.setTextColor(74, 85, 104);
    doc.text(`Gasolina: R$${precoGasolina.toFixed(2).replace(".", ",")}/L   •   Consumo: ${kmPorLitro} km/L`, 14, y);
    y += 6;
    doc.setDrawColor(208, 215, 227);
    doc.line(14, y, 196, y);
    y += 8;

    // ─── Etapa 5: detalhe, dia por dia, em tabela ───
    diasData.forEach(function (diaInfo) {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        doc.setTextColor(26, 58, 107);
        doc.text(diaInfo.titulo.toUpperCase(), 14, y);

        doc.setFontSize(9);
        doc.setFont(undefined, "normal");
        doc.setTextColor(74, 85, 104);
        doc.text(`${diaInfo.kmDoDia} km`, 196, y, { align: "right" });

        doc.autoTable({
            startY: y + 4,
            head: [["Finalidade", "Local", "Ida", "Volta", "Total", "Anotações"]],
            body: diaInfo.linhas,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [13, 31, 60], textColor: 255 },
            margin: { left: 14, right: 14 }
        });

        y = doc.lastAutoTable.finalY + 10;
    });

    doc.save(`${nomeSemana}.pdf`);
}
areaSemanas.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-pdf")) {
        const semana = evento.target.closest(".bloco-semana");
        geraPDF(semana);
    }
});