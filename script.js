// CONFIGURAÇÕES E ESTADO DO JOGO
let nivelAtual = 1;
let duracaoAnimacao = 2.5;
let pistaAtual = 1;
const classesPistas = ["pos-esquerda", "pos-centro", "pos-direita"];
let pontuacao = 0;
let moedas = 0;
let plantasColetadas = 0;
let errosAcumulados = 0;
let perguntaAtualIndex = 0;
let jogoPausado = false;

// POWER-UPS E MODOS
let duplicadorAtivo = false;
let imaAtivo = false;
let emChuvaDeMoedas = false;
let contadorCiclos = 0;

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

// ÁUDIO SINTETIZADO (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function tocarNota(frequencia, duracao, tipo = "sine") {
    // Evita acumular sons se o áudio estiver desligado ou pausado
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = tipo;
    osc.frequency.setValueAtTime(frequencia, audioCtx.currentTime);
    
    // Suaviza a entrada e saída do som para evitar estalos agudos
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duracao);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duracao);
}

// SOM DA CHUVA DE MOEDAS
function tocarSomMoeda() {
    tocarNota(987.77, 0.08, "triangle");
    setTimeout(() => tocarNota(1318.51, 0.12, "triangle"), 80);
}

// TRILHA SONORA DINÂMICA (Ajustada para não sobrepor frequências)
setInterval(() => {
    if (!jogoPausado) {
        if (emChuvaDeMoedas) {
            tocarNota(523.25, 0.08, "sine");
            setTimeout(() => tocarNota(659.25, 0.08, "sine"), 100);
            setTimeout(() => tocarNota(783.99, 0.08, "sine"), 200);
            setTimeout(() => tocarNota(1046.50, 0.1, "sine"), 300);
        } else {
            tocarNota(261.63, 0.1, "sine");
            setTimeout(() => tocarNota(329.63, 0.1, "sine"), 200);
            setTimeout(() => tocarNota(392.00, 0.1, "sine"), 400);
        }
    }
}, 800);

// BANCO DE PERGUNTAS EXPANDIDO
const bancoPerguntas = [
    { pergunta: "Qual a composição básica do solo?", 
    opcoes: ["Minerais, matéria orgânica, água e ar", "Apenas pedras e areia"],
    correta: 0 },

    { pergunta: "O que é Húmus?",
     opcoes: ["Matéria orgânica decomposta", "Um tipo de agrotóxico"], 
     correta: 0 },

    { pergunta: "Qual solo retém mais água?", 
    opcoes: ["Solo Arenoso", "Solo Argiloso"], 
    correta: 1 },

    { pergunta: "O que evita a erosão do solo?", 
    opcoes: ["Plantio em curvas de nível", "Desmatamento"], 
    correta: 0 },

    { pergunta: "O que é rotação de culturas?", 
    opcoes: ["Alternar espécies no mesmo terreno", "Plantar sempre a mesma coisa"], 
    correta: 0 },

    { pergunta: "Qual elemento é um macronutriente primário das plantas?", 
    opcoes: ["Nitrogênio (N)", "Alumínio (Al)"], 
    correta: 0 },

    { pergunta: "Qual a função da calagem no solo?",
     opcoes: ["Reduzir a acidez do solo", "Aumentar a quantidade de pragas"], 
     correta: 0 },

    { pergunta: "O que são plantas de cobertura?", 
    opcoes: ["Especialmente usadas para proteger o solo", "Plantas ornamentais de casa"], 
    correta: 0 },

    { pergunta: "Como a irrigação por gotejamento ajuda?", 
    opcoes: ["Economiza água aplicando direto na raiz", "Molha o terreno todo sem controle"], 
    correta: 0 },

    { pergunta: "O que caracteriza a adubação verde?",
     opcoes: ["Uso de plantas para enriquecer o solo", "Pintar as plantas de verde"], 
     correta: 0 },

    { pergunta: "O que é a compactação do solo?", 
    opcoes: ["Perda de porosidade que dificulta as raízes", "Adição de adubo natural"], 
    correta: 0 },

    { pergunta: "Qual inseto é considerado um polinizador vital?", 
    opcoes: ["Abelha", "Lagarta"], 
    correta: 0 },

    { pergunta: "O que é agroecologia?", 
    opcoes: ["Agricultura sustentável sem químicos nocivos", "Produção industrial de agrotóxicos"],
    correta: 0 },

    { pergunta: "O que indica o pH do solo?", 
    opcoes: ["Grau de acidez ou alcalinidade", "A quantidade de pedras"], 
    correta: 0 },

    { pergunta: "O que faz a enxada rotativa?", 
    opcoes: ["Prepara e descompacta o solo agrícola", "Corta árvores grandes"], 
    correta: 0 },

 { pergunta: "Qual tecnologia ou maquinário revolucionou a produtividade da sua propriedade nos últimos anos?", 
opcoes: ["Prepara e descompacta o solo agrícola", "Corta árvores grandes"], 
correta: 0 },

{ pergunta: "Qual tecnologia ou maquinário revolucionou a produtividade da sua propriedade nos últimos anos?",
 opcoes:["O piloto automático nos tratores e colheitadeiras, que reduziu o pisoteio e otimizou a aplicação de insumos", 
"O monitoramento via satélite e drones, permite identificar pragas e falhas no plantio muito mais rápido."],
correta: 0},

{pergunta:"Qual é o maior desafio para digitalizar e modernizar a gestão no campo hoje?",
opcoes:[",A resistência cultural à mudança de processos tradicionais que já funcionam há gerações",
"A falta de cobertura de internet de qualidade nas áreas rurais mais afastadas"],
correta: 0},

{pergunta: "Quais práticas de manejo sustentável ou conservação do solo você adota na sua produção?",
opcoes:["O uso de plantas de cobertura para retenção de umidade e proteção contra a erosão.", 
"o plantio direto rigoroso combinado com a rotação de culturas para manter a biologia do solo ativa"],
correta: 1}

{pergunta: "Quais estratégias têm sido usadas na sua região para enfrentar as mudanças climáticas e períodos de estiagem?",
opcoes: [" Investimento em irrigação eficiente e construção de reservatórios de água na propriedade",
"Escolha de variedades e cultivares mais resistentes ao estresse hídrico"]
correta: 0}

{ pergunta: "Qual é a função do estômato nas folhas das plantas?",
opcoes: ["Absorver nutrientes minerais diretamente da atmosfera.",
"Realizar trocas gasosas e controlar a transpiração da planta.",
 "Fixar a planta ao solo e armazenar reservas de amido." ],
correta: 1}

{pergunta: "O que é a fotossíntese nas plantas agrícolas?",
opcoes: ["Processo de conversão de luz solar, água e CO2 em açúcares e oxigênio.",
 "Degradação da matéria orgânica do solo pelas raízes.",
 "Absorção de defensivos químicos através das folhas durante a noite."],
correta: 0}

{pergunta: "O que significa o termo \"fenologia\" de uma cultura agrícola?",
opcoes: ["O estudo da composição química dos fertilizantes.",
"O estudo dos estágios de desenvolvimento da planta ao longo do tempo.",
"A medição do nível de umidade dos grãos no armazém."], 
correta: 1}

{pergunta: "O que significa o termo \"fenologia\" de uma cultura agrícola?",
opcoes: ["O estudo da composição química dos fertilizantes.",
"O estudo dos estágios de desenvolvimento da planta ao longo do tempo.",
"A medição do nível de umidade dos grãos no armazém."],
correta: 1},

  {pergunta: "O que define o Manejo Integrado de Pragas (MIP)?",
opcoes: ["A aplicação semanal e preventiva de defensivos químicos em toda a área.",
"A combinação de métodos biológicos, culturais e químicos baseada no monitoramento.",
"A eliminação total de todos os insetos presentes na lavoura." ],
correta: 1 },
 
{pergunta: "Qual é o principal vetor de transmissão do vírus do enfezamento no milho?",
opcoes: ["Cigarrinha-do-milho (Dalbulus maidis).",
"Lagarta-do-cartucho (Spodoptera frugiperda).",
"Percevejo-marrom (Euschistus heros)."],
correta: 0},

  {pergunta: "Qual é a diferença entre um fungicida sistêmico e um fungicida de contato?",
    "opcoes": ["O sistêmico mata insetos; o de contato mata fungos.",
"O sistêmico é absorvido e circula pela planta; o de contato protege a superfície onde foi aplicado.",
"O sistêmico é aplicado via irrigação; o de contato é aplicado via solo."],
correta: 1},

  {pergunta: "Qual é o principal objetivo do processo de ensilagem (silagem) na pecuária?",
opcoes: ["secar seragté virar pó para consumo imediato.",
      ""Preservar a forragem úmida por meio da fermentação anaeróbica para épocas de seca.",
      "Esterilizar o capim para eliminar bactérias benéficas."
    ],
    "correta": 1}






];

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

// LOOP DE JOGO PRINCIPAL
function iniciarCiclo() {
    if (jogoPausado) return;

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
    let pistaEsp = -1;
    if (Math.random() < 0.25) {
        pistaEsp = Math.floor(Math.random() * 3);
        itemEspecial.innerText = Math.random() > 0.5 ? "🧲" : "✖️2️⃣";
        itemEspecial.className = classesPistas[pistaEsp] + " animar-objeto";
    } else {
        itemEspecial.className = "";
    }

    obstaculo.className = classesPistas[pistaObs] + " animar-objeto";
    recurso.className = classesPistas[pistaRec] + " animar-objeto";

    const checarColisao = setInterval(() => {
        if (jogoPausado) return;forragem

        const topoObs = obstaculo.offsetTop;
        const topoRec = recurso.offsetTop;
        const topoEsp = itemEspecial.offsetTop;

        // Ímã puxa moedas
        if (imaAtivo && recurso.innerText === "🪙" && topoRec > 150) {
            recurso.className = classesPistas[pistaAtual] + " animar-objeto";
        }

        // Colisão com Obstáculos
        if (topoObs > 420 && topoObs < 500 && pistaAtual === pistaObs) {
            tocarNota(150, 0.3, "sawtooth");
            clearInterval(checarColisao);
            reiniciarJogo("Você bateu no obstáculo!");
            return;
        }

        // Colisão com Recurso (Planta ou Moeda)
        if (topoRec > 420 && topoRec < 500 && pistaAtual === pistaRec) {
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
                tocarNota(523.25, 0.2);

                // Checar mudança de fase (15 plantas)
                if (plantasColetadas === 15) {
                    nivelAtual = 2;
                    duracaoAnimacao = 1.8;
                    chao.classList.add("fase-2-chao");
                    speedIndicator.innerText = "Fase 2 (Nova Fase!)";
                    alert("🎉 Parabéns! Você avançou para a Fase 2! O solo mudou e o ritmo acelerou!");
                }

                redefinirPosicaoRecurso();

                // Pergunta sim / Pergunta não (50% de chance)
                if (plantasColetadas % 2 === 0) {
                    clearInterval(checarColisao);
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

    setTimeout(() => {
        clearInterval(checarColisao);
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
}

function redefinirPosicaoRecurso() {
    recurso.className = "";
}

// REINICIAR JOGO AO ERRAR OU BATER
function reiniciarJogo(mensagem) {
    alert(`${mensagem} O jogo será reiniciado!`);
    pontuacao = 0;
    moedas = 0;
    plantasColetadas = 0;
    errosAcumulados = 0;
    nivelAtual = 1;
    duracaoAnimacao = 2.5;
    chao.classList.remove("fase-2-chao");
    speedIndicator.innerText = "Fase 1";
    scoreDisplay.innerText = "0";
    coinsDisplay.innerText = "0";
    atualizarEstiloPraga();
    redefinirPosicoes();
    iniciarCiclo();
}

// SYSTEM QUIZ
function abrirQuiz() {
    if (perguntasRestantes.length === 0) perguntasRestantes = [...bancoPerguntas];

    perguntaAtualIndex = Math.floor(Math.random() * perguntasRestantes.length);
    const q = perguntasRestantes[perguntaAtualIndex];

    document.getElementById("quiz-pergunta").innerText = q.pergunta;
    document.getElementById("op0").innerText = q.opcoes[0];
    document.getElementById("op1").innerText = q.opcoes[1];
    document.getElementById("feedback").innerText = "";

    modalQuiz.classList.remove("modal-hide");
}

function verificarResposta(opcao) {
    const q = perguntasRestantes[perguntaAtualIndex];
    
    if (opcao === q.correta) {
        tocarNota(659.25, 0.3);
        document.getElementById("feedback").style.color = "darkgreen";
        document.getElementById("feedback").innerText = "Correto!";

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
        modalQuiz.classList.add("modal-hide");
        reiniciarJogo("Você errou a pergunta!");
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
    retomarJogo();
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
iniciarCiclo();