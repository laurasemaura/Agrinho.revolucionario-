const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

let score = 0;

// Configuração do Jogador
const player = {
    x: 100,
    y: 100,
    size: 25,
    speed: 4,
    color: "#2196F3" // Azul
};

// Configuração das Máquinas (Apenas visualização/obstáculo)
const machines = [
    { x: 200, y: 300, width: 60, height: 40, color: "#ff9800", name: "Trator" },
    { x: 550, y: 100, width: 80, height: 50, color: "#f44336", name: "Colheitadeira" }
];

// Configuração dos Solos Degradados
const soils = [
    { x: 150, y: 150, width: 70, height: 70, degraded: true },
    { x: 450, y: 320, width: 80, height: 80, degraded: true },
    { x: 600, y: 220, width: 60, height: 60, degraded: true }
];

// Controle de Teclas
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Função de colisão simples (AABB)
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.size > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.size > rect2.y;
}

// Atualiza a lógica do jogo
function update() {
    // Movimentação
    if (keys["arrowup"] || keys["w"]) player.y -= player.speed;
    if (keys["arrowdown"] || keys["s"]) player.y += player.speed;
    if (keys