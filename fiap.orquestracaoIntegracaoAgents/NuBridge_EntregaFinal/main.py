import os
import sys
import time
from colorama import init, Fore, Style
from dotenv import load_dotenv

# Importando os agentes
from agents.triador import AgenteTriador
from agents.arqueologo import AgenteArqueologo
from agents.bibliotecario import AgenteBibliotecario
from agents.investigador import AgenteInvestigador
from agents.solucionador import AgenteSolucionador
from agents.cronista import AgenteCronista

# Inicializa o colorama e carrega env
init()
load_dotenv()

def print_header():
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{' '*18}PROJETO NUBRIDGE")
    print(f"{' '*12}Orquestração e Integração de Agentes")
    print(f"{'='*60}{Style.RESET_ALL}\n")

def simular_atraso(segundos=1.5):
    time.sleep(segundos)

def main():
    print_header()
    
    # 1. Instanciar agentes
    triador = AgenteTriador()
    arqueologo = AgenteArqueologo()
    bibliotecario = AgenteBibliotecario()
    investigador = AgenteInvestigador()
    solucionador = AgenteSolucionador()
    cronista = AgenteCronista()

    # 2. Caminhos para os arquivos mock
    mock_logs = os.path.join("mocks", "datadog_logs.json")
    mock_commits = os.path.join("mocks", "github_commits.json")
    mock_vectordb = os.path.join("mocks", "vector_db_mock.json")

    # Passo 1: Triagem
    dados_triagem = triador.analisar_logs(mock_logs)
    simular_atraso()

    # Passo 2: Investigação em Paralelo (Arqueólogo e Bibliotecário)
    dados_commits = arqueologo.investigar_commits(mock_commits, dados_triagem['service_afetado'])
    simular_atraso()
    
    dados_historico = bibliotecario.buscar_historico(mock_vectordb, dados_triagem['stack_trace'])
    simular_atraso()

    # Passo 3: Cruzamento (Cérebro Lógico)
    diagnostico = investigador.deduzir_causa_raiz(dados_triagem, dados_commits, dados_historico)
    simular_atraso()

    # Passo 4: Solucionador cria o PR
    acao = solucionador.criar_patch(diagnostico['causa_raiz'], diagnostico['solucao_recomendada'])
    print(Fore.LIGHTBLACK_EX + acao['patch'] + Style.RESET_ALL)
    simular_atraso()

    # Passo 5: HUMAN-IN-THE-LOOP (Mecanismo de Controle Obrigatório)
    print(f"\n{Fore.YELLOW}{'!'*60}")
    print(f"⚠️  HUMAN-IN-THE-LOOP: APROVAÇÃO OBRIGATÓRIA ⚠️")
    print(f"O Agente Solucionador gerou a correção. Você é o Engenheiro de Plantão.")
    resposta = input(f"Deseja aprovar e dar merge no PR {acao['pr_url']}? (S/N): {Style.RESET_ALL}").strip().upper()

    if resposta == 'S':
        simular_atraso(1)
        # Passo 6: Post-Mortem (Cronista)
        cronista.redigir_post_mortem(diagnostico, acao)
    else:
        print(f"\n{Fore.RED}[Sistema] Aprovação negada. O deploy foi abortado e os agentes foram suspensos. Voltando para investigação manual.{Style.RESET_ALL}\n")
        sys.exit(0)

if __name__ == "__main__":
    main()
