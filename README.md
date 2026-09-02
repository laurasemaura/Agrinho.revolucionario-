🌱 Agro Surfers

Um jogo educativo sobre agricultura e manejo do solo que combina corrida infinita, desafios de conhecimento, coleta de recursos e power-ups.

🎮 Sobre o jogo

Agro Surfers é um jogo web desenvolvido em HTML, CSS e JavaScript, com uma proposta de unir diversão e aprendizado sobre o universo agrícola.

O jogador controla um personagem que percorre três pistas, desviando de obstáculos e coletando recursos. Durante a partida, perguntas relacionadas à agricultura, solo, plantas, sustentabilidade e tecnologia no campo aparecem como desafios.

Quanto mais o jogador avança, maior fica o desafio!

✨ Funcionalidades
🏃 Movimentação em três pistas
🚜 Obstáculos aleatórios
🌱 Coleta de plantas
🪙 Sistema de moedas
🧲 Power-up Ímã
✖️2️⃣ Power-up de pontuação em dobro
🪙 Chuva de moedas
🧠 Quiz educativo sobre agricultura
🚜 Loja da Fazenda
📈 Sistema de fases
⚡ Aumento da velocidade conforme o jogador progride
🔊 Efeitos sonoros gerados pela Web Audio API
📱 Controles por teclado e botões na tela
🎨 Cenário com perspectiva 3D simulada
🌾 Temática voltada ao agronegócio e sustentabilidade
🕹️ Como jogar

O personagem ocupa uma das três pistas disponíveis:

┌─────────┬─────────┬─────────┐
│ Esquerda│ Centro  │ Direita │
└─────────┴─────────┴─────────┘


Use os controles para mudar de pista e interagir com os objetos que aparecem.

Controles
Ação	Teclado	Tela
Mover para esquerda	←	◀
Mover para direita	→	▶
Abrir loja	—	🛒
🎯 Objetivo

O objetivo principal é conseguir a maior pontuação possível enquanto:

coleta 🌱 plantas;
coleta 🪙 moedas;
evita 🚜⛏️🪨🪵 obstáculos;
responde corretamente às perguntas;
utiliza os power-ups de maneira estratégica;
compra itens na Loja da Fazenda;
avança para novas fases.
🧠 Sistema de perguntas

A cada duas plantas coletadas, o jogador pode receber uma pergunta do quiz.

As perguntas abordam temas como:

composição e propriedades do solo;
húmus;
retenção de água;
erosão;
rotação de culturas;
nutrientes das plantas;
calagem;
plantas de cobertura;
irrigação;
adubação verde;
compactação do solo;
polinização;
agroecologia;
pH do solo;
máquinas agrícolas;
agricultura digital;
manejo sustentável;
mudanças climáticas;
fisiologia vegetal;
fotossíntese;
fenologia;
Manejo Integrado de Pragas (MIP);
doenças do milho;
fungicidas.
❌ Resposta errada

Se o jogador errar uma pergunta, o jogo é reiniciado.

✅ Resposta correta

Ao acertar:

o jogador continua a partida;
uma pergunta é removida temporariamente do sorteio;
a praga pode recuar;
o jogo é retomado.

Quando todas as perguntas forem utilizadas, o banco é recarregado.

🐛 Sistema da praga

A praga representa uma ameaça progressiva ao jogador.

O sistema utiliza a variável errosAcumulados para controlar sua posição e tamanho.

Quanto maior o número de erros, mais próxima e maior fica a praga.

Responder corretamente ou utilizar determinados itens da loja pode fazer a praga recuar.

⭐ Pontuação

A coleta de uma planta normalmente concede:

+10 pontos


Quando o power-up ✖️2️⃣ está ativo:

+20 pontos


As moedas são contabilizadas separadamente da pontuação.

🪙 Moedas

As moedas podem ser obtidas durante a partida.

A cada 6 ciclos, uma chuva de moedas pode ser ativada durante alguns segundos.

As moedas podem ser utilizadas na Loja da Fazenda.

⚡ Power-ups
🧲 Ímã

O ímã permanece ativo por 7 segundos.

Durante esse período, ele pode atrair moedas para a pista do jogador.

✖️2️⃣ Duplicador

O duplicador também permanece ativo por 7 segundos.

Enquanto estiver ativo:

Planta normal = +10 pontos
Planta com duplicador = +20 pontos

🚜 Loja da Fazenda

A loja pode ser aberta pelo botão 🛒.

Item	Preço	Efeito
🌱 Mudas Especiais	30 🪙	Item relacionado a bônus de plantas
🧪 Fertilizante Turbo	50 🪙	Faz a praga recuar 1 passo
🚜 Trator Novo	100 🪙	Desbloqueia o trator

Observação: algumas descrições de itens já estão presentes na interface, mas parte desses efeitos ainda pode ser expandida na lógica do jogo.

📈 Sistema de fases

O jogo começa na:

🌱 Fase 1
Velocidade padrão;
Solo verde;
Ciclo de objetos de aproximadamente 2,5 segundos.

Depois de coletar 15 plantas, o jogador avança para a:

🌾 Fase 2
O cenário muda de aparência;
O chão fica mais rápido;
O ciclo passa para aproximadamente 1,8 segundo;
O nível de dificuldade aumenta.
🔊 Áudio

O jogo utiliza a Web Audio API para gerar sons diretamente no navegador.

Os efeitos incluem:

coleta de moedas;
coleta de plantas;
respostas corretas;
respostas incorretas;
ativação de power-ups;
trilha sonora dinâmica;
sons diferentes durante a chuva de moedas.

Não é necessário utilizar arquivos de áudio externos para os efeitos implementados atualmente.

🛠️ Tecnologias utilizadas
HTML5 — estrutura da aplicação;
CSS3 — interface, animações e perspectiva;
JavaScript — lógica do jogo;
DOM API — interação com elementos da página;
Web Audio API — geração dos efeitos sonoros;
CSS Animations — movimentação dos objetos e do cenário.
📁 Estrutura do projeto

Uma estrutura recomendada para o projeto é:

agro-surfers/
│
├── index.html
├── style.css
├── script.js
└── README.md

index.html

Responsável pela estrutura do jogo, incluindo:

HUD;
cenário;
personagem;
obstáculos;
recursos;
controles;
quiz;
loja.
style.css

Responsável por:

identidade visual;
posicionamento;
animações;
pistas;
cenário;
modais;
botões;
efeitos da Fase 2.
script.js

Contém a lógica principal do jogo:

movimentação;
colisões;
pontuação;
moedas;
perguntas;
power-ups;
loja;
fases;
áudio;
reinicialização.
▶️ Como executar

Por ser um projeto baseado em HTML, CSS e JavaScript puro, não é necessário instalar dependências.

1. Clone o repositório
git clone URL_DO_REPOSITORIO

2. Entre na pasta
cd agro-surfers

3. Abra o jogo

Abra o arquivo:

index.html


em um navegador moderno.

Também é possível utilizar uma extensão como Live Server no Visual Studio Code para executar o projeto durante o desenvolvimento.

🌐 Compatibilidade

O jogo foi desenvolvido para funcionar em navegadores modernos com suporte a:

HTML5;
CSS3;
JavaScript ES6+;
Web Audio API.

É recomendado utilizar versões recentes de:

Google Chrome;
Microsoft Edge;
Mozilla Firefox;
Safari.
📚 Objetivo educacional

Além do entretenimento, o Agro Surfers busca estimular o aprendizado de conceitos relacionados à agricultura.

Através da mecânica de quiz, o jogador entra em contato com temas de:

Solo → Plantas → Manejo → Sustentabilidade → Tecnologia → Agronegócio

A proposta é transformar conteúdos técnicos em uma experiência interativa e acessível.

🚀 Possíveis melhorias

Algumas ideias para futuras versões:

🏆 ranking de jogadores;
💾 salvamento do progresso;
👤 sistema de perfis;
🌎 novos mapas e regiões agrícolas;
🌽 novos tipos de culturas;
👨‍🌾 personagens personalizáveis;
🎒 inventário;
🏪 expansão da Loja da Fazenda;
📊 sistema de estatísticas;
🥇 conquistas e troféus;
🎵 trilha sonora mais elaborada;
📱 melhorias para dispositivos móveis;
🌐 multiplayer;
☁️ armazenamento de progresso na nuvem;
🧠 banco de perguntas maior e organizado por dificuldade.
⚠️ Observações sobre o código

O código fornecido contém alguns pontos que precisam ser corrigidos antes de uma versão de produção.

Por exemplo, existem objetos no bancoPerguntas que não estão separados corretamente por vírgulas, o que pode gerar erro de sintaxe no JavaScript.

Também existem referências aparentemente acidentais, como:

if (jogoPausado) return;forragem


Esse trecho deve ser corrigido para:

if (jogoPausado) return;


Além disso, algumas perguntas possuem três alternativas, enquanto o HTML disponibiliza apenas dois botões (op0 e op1). Para suportar todas as perguntas, seria necessário criar dinamicamente as opções ou adicionar um terceiro botão.

📄 Licença

Este projeto pode ser disponibilizado sob a licença de sua escolha.

Exemplo:

MIT License


Caso o projeto seja publicado no GitHub, recomenda-se adicionar um arquivo LICENSE contendo os termos completos da licença escolhida.

🌱 Agro Surfers

Jogue. Aprenda. Cultive conhecimento. 🚜🌱

Transformando conhecimento sobre o campo em diversão.