import os
from crewai import Agent, Task, Crew, Process
from langchain_community.chat_models import ChatOllama

# Configurando o modelo Ollama que já está rodando localmente (gemma:2b)
llm = ChatOllama(model=os.getenv("OLLAMA_MODEL", "gemma:2b"))

# ==========================================
# 1. DEFINIÇÃO DOS AGENTES (O "QUEM")
# ==========================================

triador = Agent(
    role='Triador de Incidentes',
    goal='Analisar logs crus de sistema e identificar a severidade e o serviço afetado.',
    backstory='Você é um SRE nível 1 na NuBridge. Seu trabalho é ler logs ilegíveis e traduzi-los para o resto da equipe entender.',
    verbose=True,
    allow_delegation=False,
    llm=llm
)

arqueologo = Agent(
    role='Arqueólogo de Código',
    goal='Investigar os últimos commits do repositório para achar a raiz do problema apontado pelo Triador.',
    backstory='Você é um engenheiro sênior obcecado por encontrar bugs em commits recentes. Você cruza dados de erro com o histórico do Git.',
    verbose=True,
    allow_delegation=False,
    llm=llm
)

solucionador = Agent(
    role='Engenheiro Solucionador',
    goal='Escrever um patch de correção e abrir um Pull Request baseado na análise do Arqueólogo.',
    backstory='Você é um desenvolvedor focado em mitigar o problema o mais rápido possível e propor a alteração de código.',
    verbose=True,
    allow_delegation=False,
    llm=llm
)

cronista = Agent(
    role='Cronista de Post-Mortem',
    goal='Escrever o relatório oficial executivo do incidente.',
    backstory='Você é o responsável pela Governança de TI. Você pega o histórico de tudo o que os outros agentes fizeram e transforma em um Post-Mortem executivo.',
    verbose=True,
    allow_delegation=False,
    llm=llm
)

# ==========================================
# 2. DEFINIÇÃO DAS TAREFAS (O "O QUE")
# ==========================================

log_bruto = "{ 'timestamp': '2024-06-01T14:32:00Z', 'level': 'FATAL', 'service': 'payment-gateway', 'error': 'NullPointerException on calculateFee()' }"

task1 = Task(
    description=f'Leia este log de erro de produção e resuma o que está acontecendo: {log_bruto}',
    expected_output='Um breve parágrafo explicando qual serviço caiu e a severidade.',
    agent=triador
)

task2 = Task(
    description='Com base no erro do gateway de pagamento, procure nos últimos commits quem alterou a função calculateFee() e o que foi feito.',
    expected_output='O nome do autor do commit culpado e a alteração que causou o bug.',
    agent=arqueologo
)

task3 = Task(
    description='Escreva o código em Python ou Java corrigindo o NullPointerException encontrado pelo Arqueólogo e simule a criação de um PR.',
    expected_output='Um bloco de código de correção (patch).',
    agent=solucionador
)

task4 = Task(
    description='Escreva um documento de Post-Mortem resumindo o incidente, a causa raiz e a correção aplicada. Use markdown.',
    expected_output='Um documento em Markdown estruturado.',
    agent=cronista
)

# ==========================================
# 3. ORQUESTRAÇÃO DO CREW (A "WAR ROOM")
# ==========================================

war_room = Crew(
    agents=[triador, arqueologo, solucionador, cronista],
    tasks=[task1, task2, task3, task4],
    process=Process.sequential, # Passa a bola de um para o outro em ordem
    verbose=True # Log super detalhado no terminal
)

if __name__ == "__main__":
    print("🚀 INICIANDO A WAR ROOM ALTERNATIVA (CREW AI) 🚀")
    print("==================================================")
    resultado_final = war_room.kickoff()
    
    print("\n==================================================")
    print("✅ INCIDENTE RESOLVIDO! RELATÓRIO FINAL DO CRONISTA:")
    print("==================================================")
    print(resultado_final)
