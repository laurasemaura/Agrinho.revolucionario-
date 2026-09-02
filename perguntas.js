// BANCO DE PERGUNTAS DO QUIZ
// Cada pergunta pode ter 2 ou 3 opções.

const bancoPerguntas = [

    { pergunta: "Qual a composição básica do solo?",
      opcoes: [
        "Apenas pedras e areia",
        "Minerais, matéria orgânica, água e ar",
        "Somente água e matéria orgânica"
      ],
      correta: 1 },

    { pergunta: "O que é Húmus?",
      opcoes: [
        "Um tipo de agrotóxico",
        "Matéria orgânica decomposta",
        "Um mineral presente apenas em solos argilosos"
      ],
      correta: 1 },

    { pergunta: "Qual solo retém mais água?",
      opcoes: [
        "Solo Argiloso",
        "Solo Arenoso",
        "Solo Pedregoso"
      ],
      correta: 0 },

    { pergunta: "O que evita a erosão do solo?",
      opcoes: [
        "Desmatamento",
        "Retirada da cobertura vegetal",
        "Plantio em curvas de nível"
      ],
      correta: 2 },

    { pergunta: "O que é rotação de culturas?",
      opcoes: [
        "Plantar sempre a mesma coisa",
        "Alternar espécies no mesmo terreno",
        "Deixar o terreno sem cultivo durante todo o ano"
      ],
      correta: 1 },

    { pergunta: "Qual elemento é um macronutriente primário das plantas?",
      opcoes: [
        "Alumínio (Al)",
        "Potássio (K)",
        "Nitrogênio (N)"
      ],
      correta: 2 },

    { pergunta: "Qual a função da calagem no solo?",
      opcoes: [
        "Aumentar a quantidade de pragas",
        "Reduzir a acidez do solo",
        "Eliminar toda a matéria orgânica"
      ],
      correta: 1 },

    { pergunta: "O que são plantas de cobertura?",
      opcoes: [
        "Plantas ornamentais utilizadas em jardins",
        "Plantas especialmente usadas para proteger o solo",
        "Plantas utilizadas somente para alimentação animal"
      ],
      correta: 1 },

    { pergunta: "Como a irrigação por gotejamento ajuda?",
      opcoes: [
        "Molha o terreno todo sem controle",
        "Economiza água aplicando diretamente ou próximo à raiz",
        "Impede completamente a evaporação da água"
      ],
      correta: 1 },

    { pergunta: "O que caracteriza a adubação verde?",
      opcoes: [
        "Pintar as plantas de verde",
        "Usar plantas para enriquecer e melhorar o solo",
        "Utilizar somente fertilizantes químicos"
      ],
      correta: 1 },

    { pergunta: "O que é a compactação do solo?",
      opcoes: [
        "Adição de adubo natural",
        "Aumento da quantidade de água no solo",
        "Perda de porosidade que dificulta o crescimento das raízes"
      ],
      correta: 2 },

    { pergunta: "Qual inseto é considerado um polinizador vital?",
      opcoes: [
        "Lagarta",
        "Abelha",
        "Cigarrinha"
      ],
      correta: 1 },

    { pergunta: "O que é agroecologia?",
      opcoes: [
        "Produção industrial de agrotóxicos",
        "Agricultura sustentável que busca integrar produção e equilíbrio ambiental",
        "Agricultura baseada somente em máquinas"
      ],
      correta: 1 },

    { pergunta: "O que indica o pH do solo?",
      opcoes: [
        "A quantidade de pedras",
        "A quantidade de matéria orgânica",
        "O grau de acidez ou alcalinidade"
      ],
      correta: 2 },

    { pergunta: "O que faz a enxada rotativa?",
      opcoes: [
        "Corta árvores grandes",
        "Prepara e descompacta o solo agrícola",
        "Realiza somente a colheita de grãos"
      ],
      correta: 1 },

    { pergunta: "Qual tecnologia revolucionou a produtividade agrícola nos últimos anos?",
      opcoes: [
        "O monitoramento via satélite e drones",
        "O piloto automático em tratores e colheitadeiras",
        "A substituição de máquinas por ferramentas manuais"
      ],
      correta: 1 },

    { pergunta: "Qual é o maior desafio para digitalizar a gestão no campo hoje?",
      opcoes: [
        "A falta de internet de qualidade nas áreas rurais",
        "A resistência cultural à mudança de processos tradicionais",
        "A ausência de máquinas agrícolas modernas"
      ],
      correta: 1 },

    { pergunta: "Quais práticas de manejo sustentável ajudam a conservar o solo?",
      opcoes: [
        "Plantio direto combinado com rotação de culturas",
        "Uso de plantas de cobertura para retenção de umidade",
        "Retirada completa da cobertura vegetal"
      ],
      correta: 0 },

    { pergunta: "Quais estratégias ajudam a enfrentar períodos de estiagem?",
      opcoes: [
        "Escolha de variedades resistentes ao estresse hídrico",
        "Aumento do consumo de água sem planejamento",
        "Investimento em irrigação eficiente e reservatórios de água"
      ],
      correta: 0 },

    { pergunta: "Qual é a função do estômato nas folhas das plantas?",
      opcoes: [
        "Realizar trocas gasosas e controlar a transpiração da planta.",
        "Fixar a planta ao solo e armazenar reservas de amido.",
        "Absorver nutrientes minerais diretamente da atmosfera."
      ],
      correta: 0 },

    { pergunta: "O que é a fotossíntese nas plantas agrícolas?",
      opcoes: [
        "Degradação da matéria orgânica do solo pelas raízes.",
        "Absorção de defensivos químicos através das folhas durante a noite.",
        "Processo de conversão de luz solar, água e CO2 em açúcares e oxigênio."
      ],
      correta: 2 },

    { pergunta: "O que significa o termo \"fenologia\" de uma cultura agrícola?",
      opcoes: [
        "A medição do nível de umidade dos grãos no armazém.",
        "O estudo dos estágios de desenvolvimento da planta ao longo do tempo.",
        "O estudo da composição química dos fertilizantes."
      ],
      correta: 1 },

    { pergunta: "O que define o Manejo Integrado de Pragas (MIP)?",
      opcoes: [
        "A eliminação total de todos os insetos presentes na lavoura.",
        "A combinação de métodos biológicos, culturais e químicos baseada no monitoramento.",
        "A aplicação semanal e preventiva de defensivos químicos em toda a área."
      ],
      correta: 1 },

    { pergunta: "Qual é o principal vetor de transmissão do vírus do enfezamento no milho?",
      opcoes: [
        "Percevejo-marrom (Euschistus heros).",
        "Cigarrinha-do-milho (Dalbulus maidis).",
        "Lagarta-do-cartucho (Spodoptera frugiperda)."
      ],
      correta: 1 },

    { pergunta: "Qual é a diferença entre um fungicida sistêmico e um de contato?",
      opcoes: [
        "O sistêmico é aplicado via irrigação; o de contato é aplicado via solo.",
        "O sistêmico é absorvido e circula pela planta; o de contato protege a superfície.",
        "O sistêmico mata insetos; o de contato mata fungos."
      ],
      correta: 1 }

];
