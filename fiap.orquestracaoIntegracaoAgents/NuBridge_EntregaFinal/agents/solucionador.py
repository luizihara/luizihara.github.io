import os
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate

class AgenteSolucionador:
    def __init__(self):
        self.nome = "Solucionador (Ação Prática)"
        model_name = os.getenv("OLLAMA_MODEL", "gemma:2b")
        self.llm = ChatOllama(model=model_name, temperature=0.1)

    def criar_patch(self, causa_raiz_ia, solucao_recomendada):
        prompt = PromptTemplate.from_template(
            "Você é um engenheiro de software escrevendo uma correção de código.\n"
            "Dado este problema: {problema}\n"
            "Escreva apenas um pequeno snippet de código Python mostrando como corrigir "
            "(adicione uma verificação ou bloco try/except seguro)."
        )
        
        chain = prompt | self.llm
        resposta = chain.invoke({"problema": causa_raiz_ia})
        
        return {
            "patch_ia": resposta.content,
            "pr_url": "https://github.com/empresa/repo/pull/1043"
        }
