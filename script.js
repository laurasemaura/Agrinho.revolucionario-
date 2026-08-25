// BANCO DE PERGUNTAS DO QUIZ (AGRO SUSTENTÁVEL)
const bancoPerguntas = [
    {
        pergunta: "Qual é a composição básica do solo?",
        opcoes: ["Apenas fragmentos de rocha e água", "Minerais, matéria orgânica, água e ar"],
        correta: 1
    },
    {
        pergunta: "Qual componente do solo é proveniente da decomposição de resíduos orgânicos?",
        opcoes: ["Húmus", "Silte"],
        correta: 0
    },
    {
        pergunta: "Qual tipo de solo apresenta a maior capacidade de retenção de água?",
        opcoes: ["Solo arenoso", "Solo argiloso"],
        correta: 1
    },
    {
        pergunta: "O que é a 'porosidade' do solo?",
        opcoes: ["O espaço vazio no solo ocupado por ar e água", "A quantidade de pedras na superfície"],
        correta: 0
    },
    {
        pergunta: "Qual é a função do pH do solo na agricultura?",
        opcoes: ["Indicar a acidez ou alcalinidade, influenciando a disponibilidade de nutrientes", "Medir a temperatura interna da terra durante a noite"],
        correta: 0
    },
    {
        pergunta: "Qual prática ajuda a evitar a erosão do solo?",
        opcoes: ["Plantio em curvas de nível e cobertura vegetal", "Desmatamento e queimada"],
        correta: 0
    },
    {
        pergunta: "O que é a rotação de culturas?",
        opcoes: ["Alternar diferentes espécies vegetais na mesma área ao longo do tempo", "Plantar a mesma cultura todos os anos na mesma terra"],
        correta: 0
    },
    {
        pergunta: "Qual é a principal vantagem da adubação verde?",
        opcoes: ["Aumentar a matéria orgânica e enriquecer o solo com nutrientes", "Eliminar completamente a necessidade de irrigar a lavoura"],
        correta: 0
    },
    {
        pergunta: "O que caracteriza o Sistema de Plantio Direto (SPD)?",
        opcoes: ["Revolvimento frequente da terra com arado", "Cultivo sobre a palhada sem revolver o solo"],
        correta: 1
    },
    {
        pergunta: "Qual o benefício da presença de minhocas no solo agrícola?",
        opcoes: ["Elas constroem galerias que melhoram a aeração e a drenagem de água", "Elas se alimentam de raízes saudáveis matando a planta"],
        correta: 0
    },
    {
        pergunta: "O que é o Manejo Integrado de Pragas (MIP)?",
        opcoes: ["Conjunto de técnicas para controlar pragas respeitando o ambiente", "Uso diário e preventivo de defensivos químicos sintéticos"],
        correta: 0
    },
    {
        pergunta: "Qual o objetivo do uso de barreiras vegetais (quebra-ventos) na lavoura?",
        opcoes: ["Proteger o solo e as plantas contra rajadas fortes de vento e erosão", "Impedir a passagem da luz do sol até as culturas"],
        correta: 0
    },
    {
        pergunta: "A compostagem é um processo de transformação de qual tipo de resíduo?",
        opcoes: ["Resíduos orgânicos como restos de alimentos e folhas", "Metais e vidros descartados"],
        correta: 0
    },
    {
        pergunta: "O que acontece com o solo em um processo severo de salinização?",
        opcoes: ["Ocorre o acúmulo excessivo de sais, prejudicando o desenvolvimento das raízes", "O solo fica mais fértil e absorve o dobro de fertilizante"],
        correta: 0
    },
    {
        pergunta: "Qual macro-nutriente é essencial para o crescimento inicial e raízes forte das plantas?",
        opcoes: ["Fósforo (P)", "Plástico"],
        correta: 0
    },
    {
        pergunta: "Qual a função da cobertura morta (mulching) na superfície do solo?",
        opcoes: ["Manter a umidade e proteger o solo contra o impacto direto da chuva", "Impedir que a água penetre na terra durante as irrigações"],
        correta: 0
    },
    {
        pergunta: "Qual destas fontes de água para irrigação é mais sustentável?",
        opcoes: ["Captação e reaproveitamento de água da chuva", "Esgoto doméstico sem tratamento"],
        correta: 0
    },
    {
        pergunta: "Qual técnica ajuda na fixação biológica de nitrogênio no solo?",
        opcoes: ["Uso de bactérias simbiontes associadas a leguminosas", "Aplicação de calagem durante tempestades"],
        correta: 0
    },
    {
        pergunta: "Qual o impacto do descompactamento adequado do solo?",
        opcoes: ["Facilita o enraizamento das plantas e melhora a infiltração de água", "Aumenta o risco de deslizamentos nas lavouras plenas"],
        correta: 0
    },
    {
        pergunta: "O que define a Agroecologia?",
        opcoes: ["A integração de princípios ecológicos ao ecossistema produtivo agrícola", "A substituição total de tratores por trabalho manual exclusivo"],
        correta: 0
    }
];

// Controle de perguntas não repetidas
let perguntasRestantes = [...bancoPerguntas];

// VARIÁVEIS DE CONTROLE DO ESTADO DO JOGO
let pistaAtual = 1; // 0 = Esquerda, 1 = Centro, 2 = Direita
const classesPistas = ["pos-esquerda", "pos-centro", "pos-direita"];

let pontuacao = 0;
let perguntaAtualIndex = 0;
let jogoPausado = false;

// MAPEAMENTO DOS ELEMENTOS HTML
const player = document.getElementById("player");
const obstaculo = document.getElementById("obstaculo");
const recurso = document.getElementById("recurso");
const praga = document.getElementById("praga");
const scoreDisplay = document.getElementById("score");
const speedIndicator = document.getElementById("speed-indicator");
const modalQuiz = document.getElementById("quiz-modal");

// CONTROLE POR TECLADO (COMPUTADOR)
document.addEventListener("keydown", (event) => {
    if (jogoPausado) return;
    if (event.key === "ArrowLeft") moverEsquerda();
    if (event.key === "ArrowRight") moverDireita();
});

// CONTROLE POR BOTÕES (CELULAR)
document.getElementById("btn-left").addEventListener("click", moverEsquerda);
document.getElementById("btn-right").addEventListener("click", moverDireita);

function moverEsquerda() {
    if (pistaAtual > 0) {
        pistaAtual--;
        atualizarPosicaoJogador();
    }
}

function moverDireita() {
    if (pistaAtual < 2) {
        pistaAtual++;
        atualizarPosicaoJogador();
    }
}

function atualizarPosicaoJogador() {
    player.className = classesPistas[pistaAtual];
}

// LÓGICA DO LOOP DE MOVIMENTO E COLISÕES
function iniciarCicloObjetos() {
    if (jogoPausado) return;

    const pistaObs = Math.floor(Math.random() * 3);
    let pistaRec = Math.floor(Math.random() * 3);
    
    if (pistaObs === pistaRec) {
        pistaRec = (pistaRec + 1) % 3;
    }

    obstaculo.className = classesPistas[pistaObs] + " animar-objeto";
    recurso.className = classesPistas[pistaRec] + " animar-objeto";

    const intervaloColisao = setInterval(() => {
        if (jogoPausado) return;

        const topoObs = obstaculo.offsetTop;
        const topoRec = recurso.offsetTop;

        // Checa impacto com o Obstáculo
        if (topoObs > 380 && topoObs < 430 && pistaAtual === pistaObs) {
            ficarLentoPorBater();
        }

        // Checa coleta do Recurso (Semente/Planta)
        if (topoRec > 380 && topoRec < 430 && pistaAtual === pistaRec) {
            clearInterval(intervaloColisao);
            pausarObjetos();
            abrirQuiz();
        }
    }, 100);

    setTimeout(() => {
        clearInterval(intervaloColisao);
        if (!jogoPausado) iniciarCicloObjetos();
    }, 3000);
}

function pausarObjetos() {
    jogoPausado = true;
    obstaculo.style.animationPlayState = 'paused';
    recurso.style.animationPlayState = 'paused';
}

function retomarObjetos() {
    jogoPausado = false;
    obstaculo.style.animationPlayState = 'running';
    recurso.style.animationPlayState = 'running';
}

// SISTEMA DE INTERAÇÃO: QUIZ INTERATIVO
function abrirQuiz() {
    // Garante que o banco seja reiniciado se todas as perguntas forem respondidas
    if (perguntasRestantes.length === 0) {
        perguntasRestantes = [...bancoPerguntas];
    }

    // Sorteia uma pergunta sem repetir imediatamente
    const indexSorteado = Math.floor(Math.random() * perguntasRestantes.length);
    const dadosPerg = perguntasRestantes[indexSorteado];
    perguntaAtualIndex = indexSorteado;

    // Atualiza os textos do Modal
    document.getElementById("quiz-pergunta").innerText = dadosPerg.pergunta;
    document.getElementById("op0").innerText = dadosPerg.opcoes[0];
    document.getElementById("op1").innerText = dadosPerg.opcoes[1];
    document.getElementById("feedback").innerText = "";

    // Exibe o modal
    modalQuiz.classList.remove("modal-hide");
}

function verificarResposta(opcaoEscolhida) {
    const dadosPerg = perguntasRestantes[perguntaAtualIndex];
    const feedback = document.getElementById("feedback");

    if (opcaoEscolhida === dadosPerg.correta) {
        feedback.style.color = "green";
        feedback.innerText = "Correto! O Solo ganhou nutrientes! 🌱";
        pontuacao += 10;
        scoreDisplay.innerText = pontuacao;
        
        praga.style.bottom = "-10px";
        speedIndicator.innerText = "Normal";
    } else {
        feedback.style.color = "red";
        feedback.innerText = "Incorreto! A praga avançou!";
        ficarLentoPorBater();
    }

    // Remove a pergunta respondida para não repetir durante a partida
    perguntasRestantes.splice(perguntaAtualIndex, 1);

    // Aguarda 1.5 segundos para leitura antes de fechar o modal e continuar o jogo
    setTimeout(() => {
        modalQuiz.classList.add("modal-hide");
        recurso.style.top = "-100px";
        retomarObjetos();
        iniciarCicloObjetos();
    }, 1500);
}

// Efeito Visual de penalidade
function ficarLentoPorBater() {
    speedIndicator.innerText = "LENTO!";
    praga.style.bottom = "60px";
}

// INICIALIZAÇÃO AUTOMÁTICA DO JOGO
iniciarCicloObjetos();
function verificarResposta(opcaoEscolhida) {
    const dadosPerg = perguntasRestantes[perguntaAtualIndex];
    const feedback = document.getElementById("feedback");

    document.getElementById("op0").disabled = true;
    document.getElementById("op1").disabled = true;

    if (opcaoEscolhida === dadosPerg.correta) {
        feedback.style.color = "green";
        feedback.innerText = "Correto! O Solo ganhou nutrientes! 🌱";
        pontuacao += 10;
        scoreDisplay.innerText = pontuacao;
        
        // Dispara o efeito visual da chuvinha de moedas
        criarChuvaDeMoedas();

        praga.style.bottom = "-10px";
        speedIndicator.innerText = "Normal";
    } else {
        feedback.style.color = "red";
        feedback.innerText = "Incorreto! A praga avançou!";
        ficarLentoPorBater();
    }

    perguntasRestantes.splice(perguntaAtualIndex, 1);

    setTimeout(() => {
        modalQuiz.classList.add("modal-hide");

        document.getElementById("op0").disabled = false;
        document.getElementById("op1").disabled = false;

        recurso.className = "";
        obstaculo.className = "";
        recurso.style.top = "";
        obstaculo.style.top = "";

        retomarObjetos();
        iniciarCicloObjetos();
    }, 1200);
}

// FUNÇÃO PARA CRIAR A CHUVINHA DE MOEDAS
function criarChuvaDeMoedas() {
    const quantidadeMoedas = 15; // Quantidade de moedas caindo

    for (let i = 0; i < quantidadeMoedas; i++) {
        const moeda = document.createElement("div");
        moeda.classList.add("moeda-chuva");
        moeda.innerText = "🪙";

        // Posição horizontal aleatória pela tela
        moeda.style.left = Math.random() * 100 + "vw";
        // Atraso aleatório para parecer uma chuva contínua
        moeda.style.animationDelay = Math.random() * 0.5 + "s";

        document.body.appendChild(moeda);

        // Remove do HTML após o término da animação
        setTimeout(() => {
            moeda.remove();
        }, 1800);
    }
}