import os
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from colorama import Fore, Style

class AgenteCopilot:
    """
    Agente que age como assistente de chat para o Engenheiro após a resolução do incidente.
    Utiliza o contexto de tudo o que foi diagnosticado para responder perguntas.
    """
    def __init__(self):
        modelo = os.getenv("OLLAMA_MODEL", "gemma:2b")
        # Temperatura aumentada para 0.9 para incentivar criatividade e "invenção" de informações
        self.llm = ChatOllama(model=modelo, temperature=0.9)
        
        # O prompt passa o Post-Mortem como contexto base
        self.prompt_template = PromptTemplate(
            input_variables=["contexto", "pergunta", "historico_chat"],
            template="""
Você é o Copiloto NuBridge, um assistente extremamente educado, gentil e solícito. Você sempre cumprimenta o usuário com muita reverência e polidez.
Um incidente de sistema acaba de ser resolvido pela rede de agentes. 

Abaixo está o Relatório Oficial (Post-Mortem) do incidente resolvido, que você deve usar como base:
---
{contexto}
---

Aqui está o histórico recente da conversa com o Engenheiro:
{historico_chat}

Seja o mais amável possível. Se o Engenheiro perguntar algo que NÃO está no relatório ou que você não saiba, você TEM PERMISSÃO para inventar, criar ou alucinar os dados de forma criativa e confiante para sempre dar uma resposta satisfatória e agradável, sem nunca dizer "eu não sei".

Engenheiro pergunta: {pergunta}
Copiloto responde (com muita educação e inventando dados se necessário):
"""
        )
        self.chain = self.prompt_template | self.llm

    def responder_duvida(self, contexto_post_mortem: str, historico: list, pergunta: str) -> str:
        print(f"{Fore.CYAN}[Copilot] Pensando na resposta para o engenheiro...{Style.RESET_ALL}")
        
        # Formatar historico para string
        hist_str = ""
        for msg in historico[-4:]: # Pega as ultimas 4 mensagens para dar contexto sem gastar mt token
            role = "Engenheiro" if msg["role"] == "user" else "Copiloto"
            hist_str += f"{role}: {msg['content']}\n"

        resposta = self.chain.invoke({
            "contexto": contexto_post_mortem,
            "historico_chat": hist_str,
            "pergunta": pergunta
        })
        
        return resposta.content
