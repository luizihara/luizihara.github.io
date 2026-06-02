import json
import os
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate

class AgenteArqueologo:
    def __init__(self):
        self.nome = "Arqueólogo (Contexto Recente)"
        model_name = os.getenv("OLLAMA_MODEL", "gemma:2b")
        self.llm = ChatOllama(model=model_name, temperature=0.1)

    def investigar_commits(self, mock_file_path, service):
        with open(mock_file_path, 'r') as f:
            commits = json.load(f)
            
        prompt = PromptTemplate.from_template(
            "Você é um investigador de código. Analise os últimos commits abaixo referentes ao serviço '{service}' "
            "e identifique qual commit tem maior probabilidade de ter causado o erro atual.\n\n"
            "Commits: {commits}\n\n"
            "Responda APENAS com o ID do commit e uma breve justificativa do porquê ele é o suspeito."
        )
        
        chain = prompt | self.llm
        resposta = chain.invoke({
            "service": service,
            "commits": json.dumps(commits)
        })
        
        return {
            "commit_suspeito": commits[0], # Preservado para manter a estrutura
            "analise_ia": resposta.content
        }
