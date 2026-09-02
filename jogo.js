// CONFIGURAÇÕES E ESTADO DO JOGO
let nivelAtual = 1;
let duracaoAnimacao = 2.5;
let pistaAtual = 1;
const classesPistas = ["pos-esquerda", "pos-centro", "pos-direita"];
let pontuacao = 0;
let moedas = 0;
let plantasColetadas = 0;
let errosAcumulados = 0;
const MAX_ERROS = 3; // quantos erros o jogador pode cometer no quiz antes de reiniciar
let perguntaAtualIndex = 0;
let jogoPausado = false;

// POWER-UPS E MODOS
let duplicadorAtivo = false;
let imaAtivo = false;
let emChuvaDeMoedas = false;
let contadorCiclos = 0;

// CONTROLE DO LOOP (evita loops duplicados ao pausar/retomar)
let cicloTimeoutId = null;
let colisaoIntervalId = null;

// EMOJIS DE OBSTÁCULOS
const listaObstaculos = ["🚜", "⛏️", "🪨", "🪵"];

// ELEMENTOS DO DOM
const player = document.getElementById("player");
const praga = document.getElementById("praga");
const obstaculo = document.getElementById("obstaculo");
const recurso = document.getElementById("recurso");
const itemEspecial = document.getElementById("item-especial");
const scoreDisplay = document.getElementById("score");
const coinsDisplay = document.getElementById("coins");
const speedIndicator = document.getElementById("speed-indicator");
const modalQuiz = document.getElementById("quiz-modal");
const modalShop = document.getElementById("shop-modal");
const chao = document.getElementById("chao");
const multiplierTag = document.getElementById("multiplier-tag");
const powerupStatus = document.getElementById("powerup-status");
const mundo = document.getElementById("world");
const highscoreDisplay = document.getElementById("highscore");

// RECORDE (salvo no navegador)
let recorde = Number(localStorage.getItem("agroSurfersRecorde")) || 0;
highscoreDisplay.innerText = recorde;

function atualizarRecordeSeNecessario() {
    if (pontuacao > recorde) {
        recorde = pontuacao;
        localStorage.setItem("agroSurfersRecorde", recorde);
        highscoreDisplay.innerText = recorde;
    }
}

let perguntasRestantes = [...bancoPerguntas];

// CONTROLES DE MOVIMENTO
document.addEventListener("keydown", (e) => {
    if (jogoPausado) return;
    if (e.key === "ArrowLeft") moverEsquerda();
    if (e.key === "ArrowRight") moverDireita();
});

document.getElementById("btn-left").addEventListener("click", moverEsquerda);
document.getElementById("btn-right").addEventListener("click", moverDireita);
document.getElementById("btn-shop").addEventListener("click", abrirLoja);
document.getElementById("btn-close-shop").addEventListener("click", fecharLoja);

function moverEsquerda() {
    if (pistaAtual > 0) {
        pistaAtual--;
        atualizarPosicao();
    }
}

function moverDireita() {
    if (pistaAtual < 2) {
        pistaAtual++;
        atualizarPosicao();
    }
}

function atualizarPosicao() {
    player.className = classesPistas[pistaAtual];
    praga.className = classesPistas[pistaAtual];
}

function atualizarEstiloPraga() {
    const deslocamentoBottom = 10 + (errosAcumulados * 35);
    const escala = 1 + (errosAcumulados * 0.25);
    praga.style.bottom = `${deslocamentoBottom}px`;
    praga.style.transform = `scale(${escala})`;
}

// Aplica a duração atual da animação (fase 1 ou 2) na variável CSS
// usada por #obstaculo, #recurso e #item-especial (--duracao-animacao)
function aplicarVelocidadeAnimacao() {
    mundo.style.setProperty("--duracao-animacao", `${duracaoAnimacao}s`);
}

// LOOP DE JOGO PRINCIPAL
function iniciarCiclo() {
    if (jogoPausado) return;

    // Garante que nunca existam dois loops rodando ao mesmo tempo
    if (cicloTimeoutId !== null) clearTimeout(cicloTimeoutId);
    if (colisaoIntervalId !== null) clearInterval(colisaoIntervalId);

    contadorCiclos++;

    // Sortear pistas
    const pistaObs = Math.floor(Math.random() * 3);
    let pistaRec = Math.floor(Math.random() * 3);
    while (pistaRec === pistaObs) pistaRec = Math.floor(Math.random() * 3);

    // Definir tipo de obstáculo aleatório
    const obsAleatorio = listaObstaculos[Math.floor(Math.random() * listaObstaculos.length)];
    obstaculo.innerText = obsAleatorio;

    // Chuva de moedas a cada 6 ciclos
    if (contadorCiclos % 6 === 0) {
        ativarChuvaDeMoedas();
    } else {
        recurso.innerText = "🌱";
    }

    // Sortear aparecimento do Ímã ou Duplicador 2x
    // Usa sempre a pista que sobrou (a que não tem obstáculo nem recurso),
    // assim o item especial nunca cai em cima de outro item.
    let pistaEsp = -1;
    if (Math.random() < 0.25) {
        pistaEsp = 3 - pistaObs - pistaRec;
        itemEspecial.innerText = Math.random() > 0.5 ? "🧲" : "✖️2️⃣";
        itemEspecial.className = classesPistas[pistaEsp] + " animar-objeto";
        itemEspecial.style.display = "";
    } else {
        itemEspecial.className = "";
        itemEspecial.style.display = "none";
    }

    obstaculo.className = classesPistas[pistaObs] + " animar-objeto";
    recurso.className = classesPistas[pistaRec] + " animar-objeto";

    colisaoIntervalId = setInterval(() => {
        if (jogoPausado) return;

        const topoObs = obstaculo.offsetTop;
        const topoRec = recurso.offsetTop;
        const topoEsp = itemEspecial.offsetTop;

        // Ímã: com ele ativo, moedas são coletadas automaticamente ao passar
        // pela zona de coleta, mesmo em outra pista (sem "teleportar" o item,
        // o que antes fazia a moeda sumir/reaparecer e o jogador perder o item).
        const imaColetandoMoeda = imaAtivo && recurso.innerText === "🪙" && topoRec > 420 && topoRec < 500;

        // Colisão com Obstáculos
        if (topoObs > 420 && topoObs < 500 && pistaAtual === pistaObs) {
            tocarNota(150, 0.3, "sawtooth");
            clearInterval(colisaoIntervalId);
            reiniciarJogo("Você bateu no obstáculo!");
            return;
        }

        // Colisão com Recurso (Planta ou Moeda)
        if ((topoRec > 420 && topoRec < 500 && pistaAtual === pistaRec) || imaColetandoMoeda) {
            if (recurso.innerText === "🪙") {
                tocarSomMoeda();
                moedas += 1;
                coinsDisplay.innerText = moedas;
                redefinirPosicaoRecurso();
            } else {
                plantasColetadas++;
                const pontosGanhos = duplicadorAtivo ? 20 : 10;
                pontuacao += pontosGanhos;
                scoreDisplay.innerText = pontuacao;
                atualizarRecordeSeNecessario();
                tocarNota(523.25, 0.2);

                // Checar mudança de fase (15 plantas)
                if (plantasColetadas === 15) {
                    nivelAtual = 2;
                    duracaoAnimacao = 1.8;
                    aplicarVelocidadeAnimacao();
                    chao.classList.add("fase-2-chao");
                    speedIndicator.innerText = "Fase 2 (Nova Fase!)";
                    alert("🎉 Parabéns! Você avançou para a Fase 2! O solo mudou e o ritmo acelerou!");
                }

                redefinirPosicaoRecurso();

                // A cada 2 plantas, aparece uma pergunta do quiz
                if (plantasColetadas % 2 === 0) {
                    clearInterval(colisaoIntervalId);
                    pausarJogo();
                    abrirQuiz();
                    return;
                }
            }
        }

        // Colisão com Item Especial (Power-up)
        if (topoEsp > 420 && topoEsp < 500 && pistaAtual === pistaEsp) {
            if (itemEspecial.innerText === "🧲") {
                ativarIma();
            } else {
                ativarDuplicador();
            }
            itemEspecial.className = "";
        }

    }, 50);

    cicloTimeoutId = setTimeout(() => {
        if (!jogoPausado) iniciarCiclo();
    }, duracaoAnimacao * 1000);
}

// CHUVA DE MOEDAS
function ativarChuvaDeMoedas() {
    emChuvaDeMoedas = true;
    recurso.innerText = "🪙";
    setTimeout(() => { emChuvaDeMoedas = false; }, 3000);
}

// POWER-UPS
function ativarIma() {
    imaAtivo = true;
    powerupStatus.innerText = "🧲 Ativo!";
    tocarNota(800, 0.3);
    setTimeout(() => {
        imaAtivo = false;
        powerupStatus.innerText = "";
    }, 7000);
}

function ativarDuplicador() {
    duplicadorAtivo = true;
    multiplierTag.innerText = "(2x!)";
    tocarNota(900, 0.3);
    setTimeout(() => {
        duplicadorAtivo = false;
        multiplierTag.innerText = "";
    }, 7000);
}

// CONTROLE DO PAUSAR E RETOMAR
function pausarJogo() {
    jogoPausado = true;
    if (cicloTimeoutId !== null) clearTimeout(cicloTimeoutId);
    if (colisaoIntervalId !== null) clearInterval(colisaoIntervalId);
    obstaculo.style.animationPlayState = 'paused';
    recurso.style.animationPlayState = 'paused';
    itemEspecial.style.animationPlayState = 'paused';
}

function retomarJogo() {
    jogoPausado = false;
    obstaculo.style.animationPlayState = 'running';
    recurso.style.animationPlayState = 'running';
    itemEspecial.style.animationPlayState = 'running';
}

function redefinirPosicoes() {
    obstaculo.className = "";
    recurso.className = "";
    itemEspecial.className = "";
    itemEspecial.style.display = "none";
}

function redefinirPosicaoRecurso() {
    recurso.className = "";
}

// REINICIAR JOGO AO ERRAR OU BATER
function reiniciarJogo(mensagem) {
    if (cicloTimeoutId !== null) clearTimeout(cicloTimeoutId);
    if (colisaoIntervalId !== null) clearInterval(colisaoIntervalId);

    alert(`${mensagem} O jogo será reiniciado!`);
    pontuacao = 0;
    moedas = 0;
    plantasColetadas = 0;
    errosAcumulados = 0;
    nivelAtual = 1;
    duracaoAnimacao = 2.5;
    aplicarVelocidadeAnimacao();
    chao.classList.remove("fase-2-chao");
    speedIndicator.innerText = "Fase 1";
    scoreDisplay.innerText = "0";
    coinsDisplay.innerText = "0";
    atualizarEstiloPraga();
    redefinirPosicoes();
    jogoPausado = false;
    iniciarCiclo();
}

// SISTEMA DE QUIZ
function abrirQuiz() {
    if (perguntasRestantes.length === 0) perguntasRestantes = [...bancoPerguntas];

    perguntaAtualIndex = Math.floor(Math.random() * perguntasRestantes.length);
    const q = perguntasRestantes[perguntaAtualIndex];

    document.getElementById("quiz-pergunta").innerText = q.pergunta;

    // Suporta perguntas com 2 ou 3 opções
    const botoesOpcao = [
        document.getElementById("op0"),
        document.getElementById("op1"),
        document.getElementById("op2")
    ];

    botoesOpcao.forEach((botao, i) => {
        if (q.opcoes[i]) {
            botao.innerText = q.opcoes[i];
            botao.style.display = "block";
        } else {
            botao.style.display = "none";
        }
    });

    document.getElementById("feedback").innerText = "";
    modalQuiz.classList.remove("modal-hide");
}

function verificarResposta(opcao) {
    const q = perguntasRestantes[perguntaAtualIndex];
    const feedback = document.getElementById("feedback");

    if (opcao === q.correta) {
        tocarNota(659.25, 0.3);
        feedback.style.color = "darkgreen";
        feedback.innerText = "Correto!";

        if (errosAcumulados > 0) {
            errosAcumulados--;
            atualizarEstiloPraga();
        }

        perguntasRestantes.splice(perguntaAtualIndex, 1);

        setTimeout(() => {
            modalQuiz.classList.add("modal-hide");
            redefinirPosicoes();
            retomarJogo();
            iniciarCiclo();
        }, 800);
    } else {
        tocarNota(110, 0.4, "sine");
        errosAcumulados++;
        atualizarEstiloPraga();

        if (errosAcumulados >= MAX_ERROS) {
            modalQuiz.classList.add("modal-hide");
            reiniciarJogo("A praga te alcançou! Você errou demais.");
        } else {
            feedback.style.color = "darkred";
            feedback.innerText = `Errado! A praga se aproximou... (${errosAcumulados}/${MAX_ERROS})`;
            setTimeout(() => {
                modalQuiz.classList.add("modal-hide");
                redefinirPosicoes();
                retomarJogo();
                iniciarCiclo();
            }, 1000);
        }
    }
}

// LOJA DA FAZENDA
function abrirLoja() {
    pausarJogo();
    document.getElementById("shop-coins").innerText = moedas;
    modalShop.classList.remove("modal-hide");
}

function fecharLoja() {
    modalShop.classList.add("modal-hide");
    redefinirPosicoes();
    retomarJogo();
    iniciarCiclo();
}

function comprarItem(item, preco) {
    if (moedas >= preco) {
        moedas -= preco;
        coinsDisplay.innerText = moedas;
        document.getElementById("shop-coins").innerText = moedas;
        tocarNota(880, 0.3);

        if (item === 'muda') alert("🌱 Mudas Especiais compradas! Suas plantas dão bônus!");
        if (item === 'fertilizante') alert("🧪 Fertilizante aplicado! A praga recua 1 passo!");
        if (item === 'trator') alert("🚜 Trator novo desbloqueado!");

        if (item === 'fertilizante' && errosAcumulados > 0) {
            errosAcumulados--;
            atualizarEstiloPraga();
        }
    } else {
        alert("Moedas insuficientes!");
    }
}

// INICIAR O JOGO
itemEspecial.style.display = "none";
aplicarVelocidadeAnimacao();
iniciarCiclo();