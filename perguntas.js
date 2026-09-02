// BANCO DE PERGUNTAS DO QUIZ
// Cada pergunta pode ter 2 ou 3 opções — o jogo se adapta automaticamente.
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

    { pergunta: "Qual tecnologia revolucionou a produtividade agrícola nos últimos anos?",
      opcoes: ["O piloto automático em tratores e colheitadeiras", "O monitoramento via satélite e drones"],
      correta: 0 },

    { pergunta: "Qual é o maior desafio para digitalizar a gestão no campo hoje?",
      opcoes: ["A resistência cultural à mudança de processos tradicionais", "A falta de internet de qualidade nas áreas rurais"],
      correta: 0 },

    { pergunta: "Quais práticas de manejo sustentável ajudam a conservar o solo?",
      opcoes: ["Uso de plantas de cobertura para retenção de umidade", "Plantio direto combinado com rotação de culturas"],
      correta: 1 },

    { pergunta: "Quais estratégias ajudam a enfrentar períodos de estiagem?",
      opcoes: ["Investimento em irrigação eficiente e reservatórios de água", "Escolha de variedades resistentes ao estresse hídrico"],
      correta: 0 },

    { pergunta: "Qual é a função do estômato nas folhas das plantas?",
      opcoes: [
        "Absorver nutrientes minerais diretamente da atmosfera.",
        "Realizar trocas gasosas e controlar a transpiração da planta.",
        "Fixar a planta ao solo e armazenar reservas de amido."
      ],
      correta: 1 },

    { pergunta: "O que é a fotossíntese nas plantas agrícolas?",
      opcoes: [
        "Processo de conversão de luz solar, água e CO2 em açúcares e oxigênio.",
        "Degradação da matéria orgânica do solo pelas raízes.",
        "Absorção de defensivos químicos através das folhas durante a noite."
      ],
      correta: 0 },

    { pergunta: "O que significa o termo \"fenologia\" de uma cultura agrícola?",
      opcoes: [
        "O estudo da composição química dos fertilizantes.",
        "O estudo dos estágios de desenvolvimento da planta ao longo do tempo.",
        "A medição do nível de umidade dos grãos no armazém."
      ],
      correta: 1 },

    { pergunta: "O que define o Manejo Integrado de Pragas (MIP)?",
      opcoes: [
        "A aplicação semanal e preventiva de defensivos químicos em toda a área.",
        "A combinação de métodos biológicos, culturais e químicos baseada no monitoramento.",
        "A eliminação total de todos os insetos presentes na lavoura."
      ],
      correta: 1 },

    { pergunta: "Qual é o principal vetor de transmissão do vírus do enfezamento no milho?",
      opcoes: [
        "Cigarrinha-do-milho (Dalbulus maidis).",
        "Lagarta-do-cartucho (Spodoptera frugiperda).",
        "Percevejo-marrom (Euschistus heros)."
      ],
      correta: 0 },

    { pergunta: "Qual é a diferença entre um fungicida sistêmico e um de contato?",
      opcoes: [
        "O sistêmico mata insetos; o de contato mata fungos.",
        "O sistêmico é absorvido e circula pela planta; o de contato protege a superfície.",
        "O sistêmico é aplicado via irrigação; o de contato é aplicado via solo."
      ],
      correta: 1 },
];