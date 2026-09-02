// ÁUDIO SINTETIZADO (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function tocarNota(frequencia, duracao, tipo = "sine") {
    // Evita tocar som se o contexto ainda não foi "destravado" pelo navegador
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

// TRILHA SONORA DINÂMICA
setInterval(() => {
    if (jogoPausado) return;

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
}, 800);