# Projeto NuBridge V2 - Entrega Final (Com LangChain e Ollama)

**Disciplina:** Orquestração e Integração de Agentes (FIAP)  
**Turma:** 2ABL  
**Alunos:** Luiz Ihara, Filipe Fragoso, Daniel Caminha, Pedro Martins  

## 🎯 Sobre o Projeto (Versão 2.0)
Esta é a versão evoluída do protótipo NuBridge. Diferente de um simulador hardcoded, **este sistema possui "Cérebro Real"**.
Substituímos todos os prints estáticos pela inteligência do modelo LLM do **Ollama** orquestrado nativamente pelo **LangChain**. Substituímos a tela preta do terminal por um dashboard interativo no **Streamlit**. Implementamos RAG (Busca Vetorial) usando o **ChromaDB**.

## 🚀 Como Executar

### Pré-requisitos
1. **Ollama:** Você DEVE ter o Ollama instalado no seu computador (`https://ollama.com/`).
2. **Modelo:** Baixe o modelo configurado rodando no seu terminal:
   ```bash
   ollama pull gemma:2b
   # ou ollama pull llama3
   ```
*(Nota: O modelo padrão no código é o `gemma:2b`. Você pode trocar no arquivo `.env` para `llama3` se quiser respostas mais inteligentes).*

### Passos de Execução
1. Abra o terminal na pasta `NuBridge_EntregaFinal`:
   ```bash
   cd NuBridge_EntregaFinal
   ```
2. Crie e ative o ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Instale as dependências (Langchain, Streamlit, Chroma):
   ```bash
   pip install -r requirements.txt
   ```
4. Execute o dashboard Streamlit:
   ```bash
   streamlit run app.py
   ```

## 🧠 Arquitetura Inteligente
O fluxo agora ocorre em tempo real:
1. O **Triador** lê o log JSON bruto e pede pro Ollama gerar um resumo.
2. O **Arqueólogo** olha a lista de commits em JSON e deduz sozinho quem é o culpado.
3. O **Bibliotecário** pega o erro, gera um vetor na memória via ChromaDB e cruza com a documentação passada.
4. O **Investigador** junta tudo via LLM.
5. O **Solucionador** cria código Python real (Patch).
6. **Governança (Human-in-the-Loop):** O Streamlit congela. Um botão verde e um vermelho aparecem. Se aprovado, o **Cronista** usa o LLM para fazer o Post-Mortem.

## 🔭 Tracing com LangSmith (Opcional)
Se quiser ver "como a IA pensou", crie uma conta no [LangSmith](https://smith.langchain.com/), renomeie o `.env.example` para `.env` e preencha a sua `LANGCHAIN_API_KEY`. Descomente as variáveis.
O dashboard da LangChain rastreará latência, tokens e o prompt de todos os 6 agentes!

## 🤖 Bônus: Orquestração com CrewAI (Prova de Conceito)
O projeto principal foi construído com LangChain nativo + Streamlit para oferecer 100% de controle sobre a Governança Visual (Human-in-the-Loop) e a geração de relatórios corporativos.
Como um adicional acadêmico (**Prova de Conceito**), criamos uma implementação alternativa da mesma orquestração utilizando o framework de enxame **CrewAI**.

Para visualizar os agentes "conversando" e passando o bastão em tempo real no terminal (isolado da interface web):
1. Instale o pacote: `pip install crewai`
2. Execute o script da PoC:
   ```bash
   python crewai/main_crewai.py
   ```
*(Aviso SRE: O script do CrewAI foi mantido de forma totalmente isolada para garantir a estabilidade do dashboard principal do Streamlit. Algumas versões do framework CrewAI exigem **Python 3.10+** devido ao uso nativo de tipagem `type | None`, o que pode gerar erros no Python 3.9).*
