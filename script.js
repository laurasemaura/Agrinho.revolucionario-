// BANCO DE PERGUNTAS DO QUIZ (AGRO SUSTENTÁVEL)
const bancoPerguntas = [
    {
        pergunta: "Qual é a composição básica do solo?",
        opcoes: [´"apenas fragmentos de rocha e água", "minerais, matéria orgânica, água e ar"],
        correta: 1
    },
    {
        pergunta: "Qual componente do solo é proveniente da decomposição de resíduos orgânicos?:",
        opcoes: ["húmus", "silte"],
        correta: 0
    },
    {
        pergunta: "Qual tipo de solo apresenta a maior capacidade de retenção de água?",
        opcoes: ["solo arenoso", "solo argiloso"],
        correta: 1
    },
    {
        pergunta: "O que é a "porosidade" do solo?",
        opcoes: ["O espaço vazio no solo ocupado por ar e água", "A quantidade de pedras na superfície"],
        correta: 0
    },
    {
        pergunta: "Qual é a função do pH do solo na agricultura?",
        opcoes: ["Indicar a acidez ou alcalinidade, influenciando a disponibilidade de nutrientes", "Medir a temperatura interna da terra durante a noite"],
        correta:0
    },
    {
        

    }
];

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
    // Remove as classes antigas e adiciona a nova baseada na pista do jogador
    player.className = classesPistas[pistaAtual];
}

// LÓGICA DO LOOP DE MOVIMENTO E COLISÕES
function iniciarCicloObjetos() {
    // Escolhe aleatoriamente uma pista (0, 1 ou 2) para o obstáculo e recurso
    const pistaObs = Math.floor(Math.random() * 3);
    let pistaRec = Math.floor(Math.random() * 3);
    
    // Evita que os dois caiam na mesma pista ao mesmo tempo
    if (pistaObs === pistaRec) {
        pistaRec = (pistaRec + 1) % 3;
    }

    // Configura os elementos visuais na pista sorteada
    obstaculo.className = classesPistas[pistaObs] + " animar-objeto";
    recurso.className = classesPistas[pistaRec] + " animar-objeto";

    // Monitora a descida do objeto para checar impactos
    const intervaloColisao = setInterval(() => {
        if (jogoPausado) return;

        // Pega a posição vertical atual dos objetos em queda
        const topoObs = obstaculo.offsetTop;
        const topoRec = recurso.offsetTop;

        // Checa impacto com o Obstáculo (Trator) - área final da queda
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

    // Reinicia o ciclo a cada 3 segundos (tempo da animação CSS)
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
    // Escolhe uma pergunta aleatória do nosso banco
    perguntaAtualIndex = Math.floor(Math.random() * bancoPerguntas.length);
    const dadosPerg = bancoPerguntas[perguntaAtualIndex];

    // Atualiza os textos do Modal
    document.getElementById("quiz-pergunta").innerText = dadosPerg.pergunta;
    document.getElementById("op0").innerText = dadosPerg.opcoes[0];
    document.getElementById("op1").innerText = dadosPerg.opcoes[1];
    document.getElementById("feedback").innerText = "";

    // Exibe a tela do Quiz removendo a classe ocultadora
    modalQuiz.classList.remove("modal-hide");
}

function verificarResposta(opcaoEscolhida) {
    const dadosPerg = bancoPerguntas[perguntaAtualIndex];
    const feedback = document.getElementById("feedback");

    if (opcaoEscolhida === dadosPerg.correta) {
        feedback.style.color = "green";
        feedback.innerText = "Correto! O Solo ganhou nutrientes! 🌱";
        pontuacao += 10;
        scoreDisplay.innerText = pontuacao;
        
        // Praga recua se você acertar
        praga.style.bottom = "-10px";
        speedIndicator.innerText = "Normal";
    } else {
        feedback.style.color = "red";
        feedback.innerText = "Incorreto! A praga avançou!";
        ficarLentoPorBater();
    }

    // Aguarda 1.5 segundos para o jogador ler a resposta e fecha o modal
    setTimeout(() => {
        modalQuiz.addClass = modalQuiz.classList.add("modal-hide");
        // Move o objeto coletado para fora da tela antes de reiniciar
        recurso.style.top = "-100px";
        retomarObjetos();
        iniciarCicloObjetos();
    }, 10000);
}

// Efeito Visual de penalidade
function ficarLentoPorBater() {
    speedIndicator.innerText = "LENTO!";
    praga.style.bottom = "60px"; // Praga visualmente encosta no fazendeiro
}

// INICIALIZAÇÃO AUTOMÁTICA DO JOGO
iniciarCicloObjetos();