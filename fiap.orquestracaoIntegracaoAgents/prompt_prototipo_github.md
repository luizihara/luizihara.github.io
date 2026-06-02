# Prompt e Especificações para o Protótipo NuBridge no GitHub

> **Objetivo deste documento:** Servir como o "Prompt Master" ou documento de requisitos detalhado para a próxima fase do projeto: o desenvolvimento do código-fonte do protótipo Multiagentes (NuBridge). Você pode copiar este texto e enviar para uma IA (como eu, no futuro) para iniciar a codificação do protótipo.

---

## 🎯 Instrução Principal para a IA
**Aja como um Engenheiro de Software Especialista em Sistemas Multiagentes (LangGraph, CrewAI ou Autogen).** Sua tarefa é construir um protótipo funcional para o projeto "NuBridge", um sistema de resolução autônoma de incidentes de TI. O protótipo não precisa integrar com os sistemas reais de produção (pode usar *mocks*), mas DEVE demonstrar de forma clara e rastreável o fluxo de colaboração entre os agentes, a passagem de contexto entre eles e a etapa obrigatória de aprovação humana (*Human-in-the-loop*).

## 🧩 Requisitos Técnicos Obrigatórios
1. **Framework Sugerido:** Python usando **LangGraph** (pois oferece excelente controle de fluxo stateful para Human-in-the-Loop) ou **CrewAI**.
2. **LLM Gateway / Integração Base:** Use a API da OpenAI (GPT-4o) ou Anthropic (Claude 3.5 Sonnet) como motor cognitivo dos agentes.
3. **Mecanismo de Controle (Human-in-the-loop):** O fluxo DEVE pausar na etapa de *Deploy* ou *Aprovação do Pull Request*. O sistema deve solicitar um *input* do usuário no terminal (ou em uma interface simples) com "[Aprovar / Rejeitar]" antes do Agente Cronista finalizar o trabalho.
4. **Mock de Dados (Simuladores):** 
   - Crie um arquivo JSON estático para simular os *Logs do Datadog* (simulando um erro de "NullPointerException no serviço de Checkout").
   - Crie uma função Mock para simular a resposta de um Vector DB (retornando um Post-Mortem falso de 6 meses atrás sobre um problema semelhante).
   - Crie um Mock da API do GitHub retornando os 3 últimos Commits (onde um deles desativou uma Feature Flag crítica).

## 🤖 Atores (Agentes) a serem Implementados
Implemente as seguintes classes/prompts de agentes e orquestre a comunicação entre eles:

1. **Agente Triador (Linha de Frente):**
   - **Input:** Arquivo JSON com os logs do incidente.
   - **Função:** Extrair o *stack trace*, identificar o microsserviço afetado e formatar o problema.
2. **Agente Arqueólogo (Contexto):**
   - **Input:** Microsserviço afetado.
   - **Função:** Consultar o mock do Git/LaunchDarkly e retornar quais PRs ou flags mudaram nas últimas 24h.
3. **Agente Bibliotecário (Busca Histórica RAG):**
   - **Input:** Stack trace formatado.
   - **Função:** Simular uma busca no Pinecone e trazer a "solução passada".
4. **Agente Investigador (Cérebro):**
   - **Input:** Relatórios do Triador, Arqueólogo e Bibliotecário.
   - **Função:** Cruzar tudo e cravar a "Causa Raiz".
5. **Agente Solucionador (Ação):**
   - **Input:** Causa raiz.
   - **Função:** Escrever o patch de código simulado e gerar o alerta para o Slack (exigindo aprovação).
6. **Agente Cronista (Memória):**
   - **Input:** Status final da aprovação.
   - **Função:** Se aprovado, redigir o *Post-Mortem* final em Markdown.

## 🛠️ Entregáveis do Repositório (Estrutura Desejada)
Por favor, gere o código e instrua a criação da seguinte estrutura de pastas:
```text
/nubridge-prototype
  ├── main.py                # Ponto de entrada (Orquestrador)
  ├── agents/                # Prompts e ferramentas de cada agente
  ├── mocks/                 # Arquivos de log e simulações JSON
  ├── requirements.txt       # Dependências
  └── README.md              # IMPORTANTÍSSIMO: Como executar, qual o fluxo principal
```

## 📝 Regras para o README.md
Ao gerar o `README.md`, garanta que ele possua:
- Uma seção "Como rodar localmente" (ex: `pip install -r requirements.txt`, `python main.py`).
- Uma explicação do Fluxo Principal.
- **Evidências de Integração:** Mostre claramente qual biblioteca multiagente foi usada e como o *tracing* / logging da IA acontece no terminal (ex: "LangSmith ativado para tracing").
