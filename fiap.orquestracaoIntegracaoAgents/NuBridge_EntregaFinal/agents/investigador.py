import os
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate

class AgenteInvestigador:
    def __init__(self):
        self.nome = "Investigador (Cérebro Lógico)"
        model_name = os.getenv("OLLAMA_MODEL", "gemma:2b")
        self.llm = ChatOllama(model=model_name, temperature=0.2)

    def deduzir_causa_raiz(self, dados_triador, dados_arqueologo, dados_bibliotecario):
        prompt = PromptTemplate.from_template(
            "Você é um arquiteto de software responsável por debugar um incidente crítico (War Room).\n"
            "Cruze as seguintes informações que sua equipe coletou:\n"
            "1. Análise da Telemetria: {triador}\n"
            "2. Commits Suspeitos (Git): {arqueologo}\n"
            "3. Histórico de Problemas Parecidos (RAG): {bibliotecario}\n\n"
            "Gere a conclusão final: Qual é a exata CAUSA RAIZ desse incidente e o que deve ser feito para corrigir?"
        )
        
        chain = prompt | self.llm
        resposta = chain.invoke({
            "triador": dados_triador['analise_ia'],
            "arqueologo": dados_arqueologo['analise_ia'],
            "bibliotecario": dados_bibliotecario['solucao_historica']
        })
        
        return {
            "causa_raiz_ia": resposta.content,
            "solucao_recomendada": dados_bibliotecario['solucao_historica']
        }
