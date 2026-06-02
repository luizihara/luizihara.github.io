import json
import os
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate

class AgenteTriador:
    def __init__(self):
        self.nome = "Triador (Linha de Frente)"
        model_name = os.getenv("OLLAMA_MODEL", "gemma:2b")
        self.llm = ChatOllama(model=model_name, temperature=0.1)

    def analisar_logs(self, mock_file_path):
        with open(mock_file_path, 'r') as f:
            log_data = json.load(f)
            
        prompt = PromptTemplate.from_template(
            "Você é um engenheiro de SRE. Analise o seguinte log de erro JSON e responda APENAS com um resumo contendo:\n"
            "1. Serviço Afetado\n2. Mensagem de Erro\n3. Nível de Criticidade\n\nLog: {log}"
        )
        
        chain = prompt | self.llm
        resposta = chain.invoke({"log": json.dumps(log_data)})
        
        return {
            "service_afetado": log_data.get("service"),
            "stack_trace": log_data.get("stack_trace"),
            "analise_ia": resposta.content
        }
