// Estado do Jogo
let currentLane = 1; // 0: Esquerda, 1: Centro, 2: Direita
let score = 0;
let isPaused = false;
let isGameOver = false;
let gameInterval;
let spawnInterval;

const lanePositions = [20, 140, 260]; // Posições X em pixels para cada pista
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const container = document.getElementById('game-container');
const quizModal = document.getElementById('quiz-modal');
const gameOverScreen = document.getElementById('game-over');

// Banco de Perguntas
const questions = [
  {
    question: "O que é o Plantio Direto na agricultura sustentável?",
    options: [
      "Cultivar sem revolver o solo e mantendo a palhada",
      "Queimar a vegetação antes de plantar",
      "Plantar apenas em vasos de estufa"
    ],
    correct: 0
  },
  {
    question: "Qual a principal vantagem da Rotação de Culturas?",
    options: [
      "Aumentar o uso de agrotóxicos",
      "Preservar os nutrientes do solo e interromper ciclos de pragas",
      "Gastar mais água na irrigação"
    ],
    correct: 1
  },
  {
    question: "Qual a importância das minhocas para a qualidade do solo?",
    options: [
      "Elas comem as plantas cultivadas",
      "Elas arejam o solo e produzem húmus rico em nutrientes",
      "Elas compactam a terra impedindo a água de entrar"
    ],
    correct: 1
  },
  {
    question: "O que caracteriza a Agricultura de Precisão?",
    options: [
      "Uso de tecnologia para aplicar recursos no local e quantidade exatos",
      "Descarte de qualquer tipo de equipamento eletrônico",
      "Uso da mesma quantidade de fertilizante em toda a área"
    ],
    correct: 0
  },
  {
    question: "Como a tecnologia auxilia a sustentabilidade no campo?",
    options: [
      "Aumentando o desperdício de insumos",
      "Otimizando o uso da água e monitorando a saúde da lavoura",
      "Substituindo o solo por concreto"
    ],
    correct: 1
  }
];

let currentQuestionIndex = 0;

// Atualiza a posição inicial do jogador
function updatePlayerPosition() {
  player.style.left = lanePositions[currentLane] + 'px';
}
updatePlayerPosition();

// Controles por Teclado
document.addEventListener('keydown', (e) => {
  if (isPaused || isGameOver) return;

  if (e.key === 'ArrowLeft' && currentLane > 0) {
    currentLane--;
  } else if (e.key === 'ArrowRight' && currentLane < 2) {
    currentLane++;
  }
  updatePlayerPosition();
});

// Gerador de Obstáculos e Recursos
const activeEntities = [];

function spawnEntity() {
  if (isPaused || isGameOver) return;

  const lane = Math.floor(Math.random() * 3);
  const isResource = Math.random() > 0.5; // 50% de chance de ser recurso ou obstáculo

  const entity = document.createElement('div');
  entity.classList.add('entity');
  
  if (isResource) {
    entity.dataset.type = 'resource';
    entity.innerHTML = '🌱'; // Planta
  } else {
    entity.dataset.type = 'obstacle';
    entity.innerHTML = Math.random() > 0.5 ? '🚜' : '🐛'; // Trator ou Praga
  }

  entity.style.left = lanePositions[lane] + 'px';
  entity.style.top = '-80px';
  entity.dataset.lane = lane;
  entity.dataset.y = -80;

  container.appendChild(entity);
  activeEntities.push(entity);
}

// Loop do Jogo (Movimentação e Colisão)
function gameLoop() {
  if (isPaused || isGameOver) return;

  for (let i = activeEntities.length - 1; i >= 0; i--) {
    const entity = activeEntities[i];
    let y = parseFloat(entity.dataset.y);
    y += 4; // Velocidade de queda
    entity.dataset.y = y;
    entity.style.top = y + 'px';

    const entityLane = parseInt(entity.dataset.lane);

    // Verificação de Colisão com o Jogador (Y próximo do jogador e na mesma pista)
    if (y >= 480 && y <= 540 && entityLane === currentLane) {
      if (entity.dataset.type === 'resource') {
        // Coletou Recurso -> Pausa o jogo e abre a pergunta
        entity.remove();
        activeEntities.splice(i, 1);
        triggerQuiz();
      } else {
        // Colidiu com Obstáculo -> Game Over
        triggerGameOver();
      }
    }

    // Remove itens que saírem da tela
    if (y > 600) {
      entity.remove();
      activeEntities.splice(i, 1);
    }
  }
}

// Pausa o jogo e exibe a pergunta
function triggerQuiz() {
  isPaused = true;
  const q = questions[currentQuestionIndex];
  
  document.getElementById('question-text').innerText = q.question;
  const optionsContainer = document.getElementById('options-container');
  const feedback = document.getElementById('feedback');
  
  optionsContainer.innerHTML = '';
  feedback.innerText = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.classList.add('btn-option');
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(idx, q.correct);
    optionsContainer.appendChild(btn);
  });

  quizModal.style.display = 'flex';
}

// Checa a resposta escolhida
function checkAnswer(selectedIndex, correctIndex) {
  const feedback = document.getElementById('feedback');

  if (selectedIndex === correctIndex) {
    score += 10;
    scoreElement.innerText = score;
    feedback.style.color = '#81c784';
    feedback.innerText = 'Correto! +10 pontos';

    setTimeout(() => {
      quizModal.style.display = 'none';
      isPaused = false;
      // Avança para a próxima pergunta ou reinicia o ciclo
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    }, 1200);
  } else {
    feedback.style.color = '#e57373';
    feedback.innerText = 'Incorreto! A praga avançou...';

    setTimeout(() => {
      quizModal.style.display = 'none';
      triggerGameOver();
    }, 1500);
  }
}

// Finaliza a partida
function triggerGameOver() {
  isGameOver = true;
  document.getElementById('final-score').innerText = score;
  gameOverScreen.style.display = 'flex';
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
}

// Reinicia o jogo
function restartGame() {
  // Limpa elementos existentes
  activeEntities.forEach(e => e.remove());
  activeEntities.length = 0;

  score = 0;
  currentLane = 1;
  isPaused = false;
  isGameOver = false;
  currentQuestionIndex = 0;

  scoreElement.innerText = score;
  updatePlayerPosition();
  gameOverScreen.style.display = 'none';

  // Reinicia os loops
  gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
  spawnInterval = setInterval(spawnEntity, 1500); // Novo item a cada 1.5s
}

// Inicialização
gameInterval = setInterval(gameLoop, 1000 / 60);
spawnInterval = setInterval(spawnEntity, 1500);