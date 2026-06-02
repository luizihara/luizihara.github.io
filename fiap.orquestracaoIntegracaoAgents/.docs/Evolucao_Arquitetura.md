# Roadmap de Evolução: NuBridge V2 (Inteligência Real)

Este documento detalha como transformar o atual "Protótipo Mock" em um sistema multiagentes inteligente e observável, utilizando modelos rodando localmente (sem custo de API) e interfaces modernas.

---

## 1. O "Cérebro Real": Integração com Ollama Local

Para substituir os textos simulados (*hardcoded*) por raciocínio de IA autêntico, utilizaremos o **Ollama** rodando no seu próprio computador, garantindo privacidade total (os logs da empresa não vazam para a internet, mitigando o risco do "Knight Capital").

### Indicação de Modelos (Ollama)
Você mencionou a intenção de usar a família Gemma. Aqui estão as recomendações exatas de como distribuir os modelos para os nossos agentes:

- **Para o Agente Triador e Cronista (Tarefas rápidas de resumo):** 
  - Recomendação: `gemma:2b` ou `phi3`. São modelos extremamente rápidos e consomem pouquíssima memória RAM, perfeitos para extrair um "stack trace" de um log sujo.
- **Para o Agente Investigador e Solucionador (Raciocínio lógico complexo e código):** 
  - Recomendação: `llama3` (8B) ou `qwen2.5:7b` (ou `qwen2.5-coder:7b`). Como esses agentes precisam cruzar dados do banco vetorial com o git e sugerir patches de código Python/JavaScript, o modelo *Gemma 2B* pode se perder (alucinar) em lógicas complexas. O *Llama 3* ou *Qwen Coder* vão entregar uma precisão cirúrgica no código de correção.

### Como a Arquitetura vai funcionar (Código)
Usaremos a biblioteca `langchain-community` para integrar facilmente:
```python
from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage

# Inicializando o modelo Llama3 rodando localmente
llm_investigador = ChatOllama(model="llama3")

# Passando os dados reais para o modelo gerar a dedução
resposta = llm_investigador.invoke([
    HumanMessage(content=f"Log: {log_erro}. Commits: {ultimos_commits}. Qual a causa raiz?")
])
```

---

## 2. Interface Visual: Substituindo o Terminal por Streamlit

Rodar no terminal é ótimo para engenheiros, mas a apresentação executiva da War Room exige um painel bonito. Utilizaremos o **Streamlit** (uma biblioteca Python que gera sites instantaneamente) para ser nossa UI.

**O que o Streamlit vai proporcionar:**
- Um dashboard que mostra o status de cada agente piscando (🟢 Triador Ativo... 🟡 Arqueólogo buscando...).
- O passo final de **Human-in-the-loop** não será mais um `input()` texto de terminal, mas sim um alerta na tela com dois botões enormes:
  - `[✅ APROVAR DEPLOY E GERAR POST-MORTEM]`
  - `[❌ REJEITAR E DEVOLVER PARA A ENGENHARIA]`

---

## 3. Tracing e Observabilidade (LangSmith)

Um dos maiores desafios de agentes autônomos é a **Causa e Efeito** (Saber exatamente como o robô chegou àquela conclusão). A FIAP pede integração com módulos fundacionais. Vamos plugar o **LangSmith** no projeto.

**Como funciona o Tracing:**
Basta adicionar duas chaves de ambiente no `.env`:
```env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY="sua_chave_gratuita_langsmith"
```
Ao fazer isso, toda chamada que o Ollama fizer ficará registrada em um painel Web maravilhoso do LangSmith. O professor (ou seu chefe) poderá clicar no "Agente Investigador" e ver na tela:
1. Quanto tempo ele demorou pensando (Latência: 1.2s).
2. O prompt exato que foi entregue a ele.
3. Quantos *tokens* locais ele gerou.

---

## 4. Integrações Reais (API do GitHub e Pinecone/ChromaDB)

Para aposentar a nossa pasta `mocks/`, o fluxo será:
- **Github API (PyGithub):** O agente usa um Personal Access Token do Github para ler em tempo real a branch do serviço que caiu e buscar os últimos commits através da API oficial.
- **RAG Real (ChromaDB Local):** Usaremos o ChromaDB (roda 100% offline). Ao invés de ler um JSON fixo, o agente transforma a mensagem de erro em um vetor numérico (usando embeddings também locais do Ollama, como `nomic-embed-text`) e busca no banco quais incidentes antigos são matematicamente parecidos com a queda atual.

---
**Resumo do Stack Final V2:**
1. **Orquestração:** LangGraph
2. **Cérebros:** Ollama (`llama3` e `gemma:2b`)
3. **Memória RAG:** ChromaDB
4. **Governança/Tracing:** LangSmith
5. **Interface (UI):** Streamlit
