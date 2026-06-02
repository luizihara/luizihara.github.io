import os
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate

class AgenteCronista:
    def __init__(self):
        self.nome = "Cronista (Memória Institucional)"
        model_name = os.getenv("OLLAMA_MODEL", "gemma:2b")
        self.llm = ChatOllama(model=model_name, temperature=0.3)

    def redigir_post_mortem(self, diagnostico, acao):
        prompt = PromptTemplate.from_template(
            "Escreva um Post-Mortem executivo e direto (em markdown) sobre o incidente resolvido.\n"
            "Causa Raiz Identificada: {causa}\n"
            "Correção Aplicada: {patch}\n"
            "Url do Pull Request: {pr}\n\n"
            "Gere o relatório estruturado."
        )
        
        chain = prompt | self.llm
        resposta = chain.invoke({
            "causa": diagnostico['causa_raiz_ia'],
            "patch": acao['patch_ia'],
            "pr": acao['pr_url']
        })
        
        return resposta.content
