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

// ITENS COMPRADOS NA LOJA (efeitos persistentes até reiniciar o jogo)
let bonusMudas = 0;      // pontos extras por planta coletada (Mudas Especiais)
let escudosTrator = 0;   // impactos que o Trator Novo absorve sem reiniciar o jogo

// Controla o espaço entre uma onda de itens e outra: quanto menor, mais
// ondas ficam na tela ao mesmo tempo (mais difícil). Começa em
// FATOR_INTERVALO_MAX (mais fácil) e vai diminuindo conforme o jogador
// coleta plantas, até chegar em FATOR_INTERVALO_MIN — nunca fica mais
// rápido que isso, pra não virar impossível.
const FATOR_INTERVALO_MAX = 0.55;
const FATOR_INTERVALO_MIN = 0.22;
const PLANTAS_PARA_DIFICULDADE_MAXIMA = 40; // plantas coletadas até chegar no ritmo mínimo
let fatorIntervaloOnda = FATOR_INTERVALO_MAX;

function atualizarFatorIntervalo() {
    const progresso = Math.min(plantasColetadas / PLANTAS_PARA_DIFICULDADE_MAXIMA, 1);
    fatorIntervaloOnda = FATOR_INTERVALO_MAX - (FATOR_INTERVALO_MAX - FATOR_INTERVALO_MIN) * progresso;
}

// CONTROLE DOS LOOPS
let intervaloOndaId = null;     // cria novas ondas de itens periodicamente
let intervaloColisaoId = null;  // checa colisão de TODOS os itens ativos (roda uma vez só, o jogo todo)

// Cada item que está caindo neste momento é um objeto independente aqui dentro,
// então um item nunca precisa "esperar" outro terminar nem reaproveita o
// elemento de outro — isso é o que evita os bugs de itens trocando de lugar
// ou travando no meio do caminho.
let objetosAtivos = [];

// EMOJIS DE OBSTÁCULOS
const listaObstaculos = ["🚜", "⛏️", "🪨", "🪵"];

// ELEMENTOS DO DOM
const player = document.getElementById("player");
const praga = document.getElementById("praga");
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
const lojaStatusDisplay = document.getElementById("loja-status");

function atualizarStatusLoja() {
    const partes = [];
    if (escudosTrator > 0) partes.push(`🛡️ x${escudosTrator}`);
    if (bonusMudas > 0) partes.push(`🌱 +${bonusMudas}/planta`);
    lojaStatusDisplay.innerText = partes.join("  ");
}

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

const PRAGA_BOTTOM_BASE = 80; // mesmo valor do #praga no CSS — mantém a praga acima dos controles

function atualizarEstiloPraga() {
    const deslocamentoBottom = PRAGA_BOTTOM_BASE + (errosAcumulados * 35);
    const escala = 1 + (errosAcumulados * 0.25);
    praga.style.bottom = `${deslocamentoBottom}px`;
    praga.style.transform = `scale(${escala})`;
}

// Aplica a duração atual da animação (fase 1 ou 2) na variável CSS
// usada pelos itens que caem (--duracao-animacao)
function aplicarVelocidadeAnimacao() {
    mundo.style.setProperty("--duracao-animacao", `${duracaoAnimacao}s`);
}

// Cria um item caindo (obstáculo, planta, moeda, ímã ou duplicador) como um
// elemento NOVO na tela. Por ser sempre um elemento novo — nunca reaproveitado
// — a animação de queda sempre roda do zero, sem risco de "grudar" na queda
// de um item anterior ou de não reiniciar quando a pista sorteada repete.
function criarItemCaindo(tipo, pista, emoji) {
    const el = document.createElement("div");
    el.className = `item-caindo ${classesPistas[pista]}`;
    el.innerText = emoji;

    const objeto = { el, tipo, pista, coletado: false };
    objetosAtivos.push(objeto);
    mundo.appendChild(el);

    // Quando o item chega ao fim do trajeto sem ser coletado, ele se
    // remove sozinho da tela e da lista de itens ativos.
    el.addEventListener("animationend", () => removerItem(objeto));

    return objeto;
}

function removerItem(objeto) {
    if (objeto.el.parentNode) objeto.el.parentNode.removeChild(objeto.el);
    const indice = objetosAtivos.indexOf(objeto);
    if (indice !== -1) objetosAtivos.splice(indice, 1);
}

function limparTodosOsItens() {
    objetosAtivos.forEach((objeto) => {
        if (objeto.el.parentNode) objeto.el.parentNode.removeChild(objeto.el);
    });
    objetosAtivos = [];
}

// Cria uma nova "onda": 1 obstáculo + 1 planta ou moeda, e às vezes 1 power-up,
// cada um em pistas diferentes.
function criarOnda() {
    if (jogoPausado) return;

    contadorCiclos++;

    const pistaObs = Math.floor(Math.random() * 3);
    let pistaRec = Math.floor(Math.random() * 3);
    while (pistaRec === pistaObs) pistaRec = Math.floor(Math.random() * 3);

    const obsAleatorio = listaObstaculos[Math.floor(Math.random() * listaObstaculos.length)];
    criarItemCaindo("obstaculo", pistaObs, obsAleatorio);

    // Chuva de moedas a cada 6 ondas
    if (contadorCiclos % 6 === 0) {
        criarItemCaindo("moeda", pistaRec, "🪙");
        ativarChuvaDeMoedas();
    } else {
        criarItemCaindo("planta", pistaRec, "🌱");
    }

    // Sortear aparecimento do Ímã ou Duplicador 2x, sempre na pista que
    // sobrou (a que não tem obstáculo nem recurso), para nunca cair em
    // cima de outro item.
    if (Math.random() < 0.25) {
        const pistaEsp = 3 - pistaObs - pistaRec;
        const tipoEsp = Math.random() > 0.5 ? "ima" : "duplicador";
        criarItemCaindo(tipoEsp, pistaEsp, tipoEsp === "ima" ? "🧲" : "✖️2️⃣");
    }
}

// (Re)inicia o cronômetro que cria novas ondas de itens. O intervalo entre
// ondas é uma fração da duração da queda, então mais de uma onda fica na
// tela ao mesmo tempo — é isso que dá a sensação de itens "alternando" nas
// pistas, sem precisar reaproveitar elementos (o que causava os bugs).
function definirRitmoDasOndas() {
    if (intervaloOndaId !== null) clearInterval(intervaloOndaId);
    if (jogoPausado) return;

    atualizarFatorIntervalo();
    const intervaloMs = Math.max(300, duracaoAnimacao * 1000 * fatorIntervaloOnda);
    intervaloOndaId = setInterval(criarOnda, intervaloMs);
    criarOnda(); // primeira onda sai na hora, sem esperar o intervalo inteiro
}

// Checagem de colisão: roda uma única vez, o jogo inteiro, e a cada 50ms
// verifica TODOS os itens ativos contra a posição do fazendeiro.
function iniciarChecagemDeColisao() {
    if (intervaloColisaoId !== null) return; // já está rodando

    intervaloColisaoId = setInterval(() => {
        if (jogoPausado) return;

        const zonaTopo = player.offsetTop - 20;
        const zonaBase = player.offsetTop + 40;

        // .slice() porque handlers de colisão podem remover itens da lista
        // enquanto ela está sendo percorrida.
        objetosAtivos.slice().forEach((objeto) => {
            if (objeto.coletado) return;

            const topo = objeto.el.offsetTop;
            const naZonaDeColeta = topo > zonaTopo && topo < zonaBase;
            const imaColetandoMoeda = imaAtivo && objeto.tipo === "moeda" && naZonaDeColeta;

            if (!((naZonaDeColeta && pistaAtual === objeto.pista) || imaColetandoMoeda)) return;

            objeto.coletado = true;

            switch (objeto.tipo) {
                case "obstaculo":
                    if (escudosTrator > 0) {
                        escudosTrator--;
                        atualizarStatusLoja();
                        tocarNota(200, 0.25, "square");
                        removerItem(objeto);
                    } else {
                        tocarNota(150, 0.3, "sawtooth");
                        reiniciarJogo("Você bateu no obstáculo!");
                    }
                    break;

                case "moeda":
                    tocarSomMoeda();
                    moedas += 1;
                    coinsDisplay.innerText = moedas;
                    removerItem(objeto);
                    break;

                case "planta": {
                    plantasColetadas++;
                    const pontosGanhos = (duplicadorAtivo ? 20 : 10) + bonusMudas;
                    pontuacao += pontosGanhos;
                    scoreDisplay.innerText = pontuacao;
                    atualizarRecordeSeNecessario();
                    tocarNota(523.25, 0.2);
                    removerItem(objeto);

                    if (plantasColetadas === 15) {
                        nivelAtual = 2;
                        duracaoAnimacao = 1.8;
                        aplicarVelocidadeAnimacao();
                        chao.classList.add("fase-2-chao");
                        speedIndicator.innerText = "Fase 2 (Nova Fase!)";
                        alert("🎉 Parabéns! Você avançou para a Fase 2! O solo mudou e o ritmo acelerou!");
                    }

                    // Quanto mais plantas o jogador coleta, menor fica o
                    // intervalo entre ondas — o jogo vai ficando mais
                    // corrido aos poucos, em vez de pular de dificuldade
                    // só na troca de fase.
                    definirRitmoDasOndas();

                    if (plantasColetadas % 2 === 0) {
                        pausarJogo();
                        abrirQuiz();
                    }
                    break;
                }

                case "ima":
                    ativarIma();
                    removerItem(objeto);
                    break;

                case "duplicador":
                    ativarDuplicador();
                    removerItem(objeto);
                    break;
            }
        });
    }, 50);
}

// CHUVA DE MOEDAS (efeito sonoro/visual de fundo, não mexe nos itens em si)
function ativarChuvaDeMoedas() {
    emChuvaDeMoedas = true;
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
    if (intervaloOndaId !== null) clearInterval(intervaloOndaId);
    objetosAtivos.forEach((objeto) => {
        objeto.el.style.animationPlayState = "paused";
    });
}

function retomarJogo() {
    jogoPausado = false;
    objetosAtivos.forEach((objeto) => {
        objeto.el.style.animationPlayState = "running";
    });
    definirRitmoDasOndas();
}

// REINICIAR JOGO AO ERRAR OU BATER
function reiniciarJogo(mensagem) {
    if (intervaloOndaId !== null) clearInterval(intervaloOndaId);
    limparTodosOsItens();

    alert(`${mensagem} O jogo será reiniciado!`);
    pontuacao = 0;
    moedas = 0;
    plantasColetadas = 0;
    errosAcumulados = 0;
    bonusMudas = 0;
    escudosTrator = 0;
    atualizarStatusLoja();
    nivelAtual = 1;
    duracaoAnimacao = 2.5;
    aplicarVelocidadeAnimacao();
    chao.classList.remove("fase-2-chao");
    speedIndicator.innerText = "Fase 1";
    scoreDisplay.innerText = "0";
    coinsDisplay.innerText = "0";
    atualizarEstiloPraga();
    jogoPausado = false;
    definirRitmoDasOndas();
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
            limparTodosOsItens();
            retomarJogo();
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
                limparTodosOsItens();
                retomarJogo();
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
    limparTodosOsItens();
    retomarJogo();
}

function comprarItem(item, preco) {
    if (moedas >= preco) {
        moedas -= preco;
        coinsDisplay.innerText = moedas;
        document.getElementById("shop-coins").innerText = moedas;
        tocarNota(880, 0.3);

        if (item === 'muda') {
            bonusMudas += 5;
            alert(`🌱 Mudas Especiais compradas! Cada planta agora vale +${bonusMudas} pontos extras.`);
        }
        if (item === 'fertilizante') {
            if (errosAcumulados > 0) {
                errosAcumulados--;
                atualizarEstiloPraga();
                alert("🧪 Fertilizante aplicado! A praga recuou 1 passo.");
            } else {
                alert("🧪 Fertilizante aplicado! A praga já está no ponto de partida.");
            }
        }
        if (item === 'trator') {
            escudosTrator++;
            alert(`🚜 Trator Novo pronto! Ele vai absorver o próximo impacto sem reiniciar o jogo (${escudosTrator} disponível).`);
        }

        atualizarStatusLoja();
    } else {
        alert("Moedas insuficientes!");
    }
}

// INICIAR O JOGO
atualizarEstiloPraga();
aplicarVelocidadeAnimacao();
iniciarChecagemDeColisao();
definirRitmoDasOndas();