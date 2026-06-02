import streamlit as st
import streamlit.components.v1 as components
import os
import time
from dotenv import load_dotenv

# Importando os agentes
from agents.triador import AgenteTriador
from agents.arqueologo import AgenteArqueologo
from agents.bibliotecario import AgenteBibliotecario
from agents.investigador import AgenteInvestigador
from agents.solucionador import AgenteSolucionador
from agents.cronista import AgenteCronista
from fpdf import FPDF
import textwrap

load_dotenv()

# ==========================================
# CONFIGURAÇÃO DE PÁGINA E CSS (UX/UI Mestre)
# ==========================================
st.set_page_config(
    page_title="NuBridge | War Room", 
    page_icon="🧠", 
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    /* Tipografia e Cores FIAP */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
    
    h1, h2, h3 { font-family: 'Outfit', sans-serif !important; }
    
    /* Estilo do Botão Principal de Alerta */
    .btn-alerta button {
        background: linear-gradient(135deg, #ED145B 0%, #C40B47 100%) !important;
        border-radius: 12px;
        border: none;
        padding: 1.5rem;
        box-shadow: 0 10px 20px rgba(237, 20, 91, 0.2);
        transition: all 0.3s ease;
        width: 100%;
    }
    .btn-alerta button * {
        color: white !important;
        font-weight: 800;
        font-size: 1.1rem;
    }
    .btn-alerta button:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 25px rgba(237, 20, 91, 0.4);
    }

    /* Human-In-The-Loop Painel */
    .human-loop-box {
        background-color: #FFF0F4;
        border-left: 6px solid #ED145B;
        padding: 2rem;
        border-radius: 0 12px 12px 0;
        margin: 2rem 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    
    /* Botões de Decisão */
    .btn-approve > button { background-color: #10B981; color: white !important; font-weight: bold; width: 100%; border-radius: 8px;}
    .btn-reject > button { background-color: #EF4444; color: white !important; font-weight: bold; width: 100%; border-radius: 8px;}
    
    /* Ocultar elementos nativos do Streamlit */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# Inicializando Estados
if "etapa" not in st.session_state:
    st.session_state.etapa = 0
if "diagnostico" not in st.session_state:
    st.session_state.diagnostico = None
if "acao" not in st.session_state:
    st.session_state.acao = None

def draw_mermaid_map(active_agent=""):
    nodes = {
        "Triador": "default", "Arqueologo": "default", "Bibliotecario": "default",
        "Investigador": "default", "Solucionador": "default", "Deploy": "default", "Cronista": "default"
    }
    if active_agent in nodes:
        nodes[active_agent] = "active"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
        <script>
            mermaid.initialize({{
                startOnLoad: true,
                theme: 'base',
                themeVariables: {{
                    fontFamily: 'Outfit, sans-serif'
                }}
            }});
        </script>
        <style>
            body {{ display: flex; justify-content: center; background-color: #FFFFFF; padding: 20px; }}
            .mermaid {{ width: 100%; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="mermaid">
        graph TD
            Triador[1. Agente Triador] --> Investigador[4. Agente Investigador]
            Arqueologo[2. Agente Arqueólogo] --> Investigador
            VectorDB[(Base Vetorial)] -.-> Bibliotecario[3. Agente Bibliotecário]
            Bibliotecario --> Investigador
            Investigador --> Solucionador[5. Agente Solucionador]
            Solucionador --> Deploy{{6. Human In The Loop}}
            Deploy --> Cronista[7. Agente Cronista]
            
            classDef default fill:#FFFFFF,stroke:#CBD5E1,stroke-width:2px,color:#1F2937,rx:8px,ry:8px;
            classDef active fill:#ED145B,stroke:#C40B47,stroke-width:4px,color:#FFFFFF,rx:8px,ry:8px;
            
            class Triador {nodes['Triador']};
            class Arqueologo {nodes['Arqueologo']};
            class Bibliotecario {nodes['Bibliotecario']};
            class Investigador {nodes['Investigador']};
            class Solucionador {nodes['Solucionador']};
            class Deploy {nodes['Deploy']};
            class Cronista {nodes['Cronista']};
        </div>
    </body>
    </html>
    """
    return html

# ==========================================
# SIDEBAR (Control Center)
# ==========================================
with st.sidebar:
    st.image("https://upload.wikimedia.org/wikipedia/commons/d/d4/Fiap-logo-novo.jpg", width=120)
    st.markdown("## ⚙️ Centro de Controle")
    st.caption("Orquestração Multiagentes V2")
    
    st.markdown("---")
    st.markdown("**Status da Infraestrutura**")
    st.markdown("🟢 **LLM Motor:** Online")
    st.caption(f"↳ Modelo: `{os.getenv('OLLAMA_MODEL', 'gemma:2b')}`")
    st.markdown("🟢 **Vector DB:** ChromaDB Pronto")
    st.markdown("🟢 **Github API:** Mock Conectado")
    st.markdown("🟢 **Datadog:** Mock Conectado")
    
    if os.getenv("LANGCHAIN_TRACING_V2") == "true":
        st.markdown("🧿 **LangSmith Tracing:** Ativado")
    
    st.markdown("---")
    st.markdown('<div class="btn-alerta">', unsafe_allow_html=True)
    if st.button("🚨 INICIAR WAR ROOM", use_container_width=True):
        st.session_state.etapa = 1
        st.rerun()
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("<br><br>", unsafe_allow_html=True)
    st.caption("Desenvolvido para MBA FIAP - 2ABL")


# ==========================================
# DASHBOARD PRINCIPAL
# ==========================================
st.title("🧠 NuBridge Dashboard")
st.markdown("<p style='font-size: 1.2rem; color: #6B7280; margin-bottom: 2rem;'>Plataforma Autônoma de Resolução de Incidentes e Imunidade de Software.</p>", unsafe_allow_html=True)

# Métricas Executivas (Sempre visíveis para impacto UX)
col1, col2, col3, col4 = st.columns(4)
with col1: st.metric(label="Tempo de Downtime", value="0m 42s", delta="-85% MTTR", delta_color="inverse")
with col2: st.metric(label="Serviços Afetados", value="1 Crítico", delta="Alto Risco", delta_color="inverse")
with col3: st.metric(label="Times Envolvidos", value="0", delta="-3 Squads", delta_color="normal")
with col4: st.metric(label="Conhecimento Vector", value="1.240 Docs", delta="+1 Novo", delta_color="normal")

st.divider()

if st.session_state.etapa == 0:
    st.info("Aguardando detecção de anomalias no sistema de telemetria... (Use o botão na barra lateral para iniciar a simulação).")
    st.stop()

# ==========================================
# FLUXO DE ORQUESTRAÇÃO (Animações de Status)
# ==========================================
if st.session_state.etapa >= 1:
    
    # Tentativa de Carregar os Agentes silenciosamente
    try:
        triador = AgenteTriador()
        arqueologo = AgenteArqueologo()
        bibliotecario = AgenteBibliotecario()
        investigador = AgenteInvestigador()
        solucionador = AgenteSolucionador()
        cronista = AgenteCronista()
    except Exception as e:
        st.error(f"❌ Erro de Conexão Ollama: Verifique se o Ollama está rodando localmente no modelo correto. Detalhe: {e}")
        st.stop()

    st.markdown("### 🤖 Execução dos Agentes (Swarm)")
    map_placeholder = st.empty()
    with map_placeholder.container():
        components.html(draw_mermaid_map(""), height=420)

    # PASSO 1: Triagem
    map_placeholder.empty()
    with map_placeholder.container():
        components.html(draw_mermaid_map("Triador"), height=420)
    with st.status("🔴 Triador: Coletando logs do Datadog...", expanded=True) as status_triador:
        st.write("Conectando ao serviço de telemetria...")
        time.sleep(1) # Simula carregamento visual
        dados_triagem = triador.analisar_logs("mocks/datadog_logs.json")
        st.write(f"**Serviço Afetado:** `{dados_triagem['service_afetado']}`")
        st.chat_message("assistant").write(dados_triagem['analise_ia'])
        status_triador.update(label="Triador: Problema Mapeado!", state="complete", expanded=False)

    # PASSO 2: Arqueologia
    map_placeholder.empty()
    with map_placeholder.container():
        components.html(draw_mermaid_map("Arqueologo"), height=420)
    with st.status("⚪ Arqueólogo: Rastreiando Github Commits...", expanded=True) as status_arq:
        st.write(f"Analisando branch main do serviço {dados_triagem['service_afetado']}...")
        time.sleep(1)
        dados_commits = arqueologo.investigar_commits("mocks/github_commits.json", dados_triagem['service_afetado'])
        st.chat_message("assistant").write(dados_commits['analise_ia'])
        status_arq.update(label="Arqueólogo: Culpado Encontrado no Git!", state="complete", expanded=False)

    # PASSO 3: RAG
    map_placeholder.empty()
    with map_placeholder.container():
        components.html(draw_mermaid_map("Bibliotecario"), height=420)
    with st.status("🟡 Bibliotecário: Busca Vetorial ChromaDB...", expanded=True) as status_bib:
        st.write("Convertendo stack trace para Embeddings e buscando similaridade...")
        time.sleep(1)
        dados_historico = bibliotecario.buscar_historico("mocks/vector_db_mock.json", dados_triagem['stack_trace'])
        st.info("📄 **Documento RAG Recuperado:**\n" + dados_historico['solucao_historica'])
        status_bib.update(label="Bibliotecário: Memória Institucional Acessada!", state="complete", expanded=False)

    # PASSO 4: Cérebro
    map_placeholder.empty()
    with map_placeholder.container():
        components.html(draw_mermaid_map("Investigador"), height=420)
    with st.status("🟣 Investigador: Analisando Causa Raiz...", expanded=True) as status_inv:
        st.write("Cruzando Logs + Commits + Histórico Vectorial via LangChain...")
        time.sleep(1)
        # SÓ chama a dedução se não estiver salvo (para não regerar ao clicar em botões)
        if st.session_state.diagnostico is None:
            st.session_state.diagnostico = investigador.deduzir_causa_raiz(dados_triagem, dados_commits, dados_historico)
        
        st.chat_message("assistant", avatar="🧠").write(st.session_state.diagnostico['causa_raiz_ia'])
        status_inv.update(label="Investigador: Causa Raiz Determinada!", state="complete", expanded=False)

    # PASSO 5: Ação
    map_placeholder.empty()
    with map_placeholder.container():
        components.html(draw_mermaid_map("Solucionador"), height=420)
    with st.status("🟢 Solucionador: Gerando Patch de Código...", expanded=True) as status_sol:
        st.write("Escrevendo código de hotfix no repositório...")
        time.sleep(1)
        if st.session_state.acao is None:
            st.session_state.acao = solucionador.criar_patch(st.session_state.diagnostico['causa_raiz_ia'], st.session_state.diagnostico['solucao_recomendada'])
        
        st.code(st.session_state.acao['patch_ia'], language="python")
        status_sol.update(label="Solucionador: Pull Request Criado!", state="complete", expanded=False)

    # ==========================================
    # GOVERNANÇA: HUMAN-IN-THE-LOOP
    # ==========================================
    if st.session_state.etapa == 1:
        map_placeholder.empty()
        with map_placeholder.container():
            components.html(draw_mermaid_map("Deploy"), height=420)
        
        st.markdown("""
        <style>
        @keyframes pulse-border {
            0% { box-shadow: 0 0 0 0 rgba(237, 20, 91, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(237, 20, 91, 0); }
            100% { box-shadow: 0 0 0 0 rgba(237, 20, 91, 0); }
        }
        .human-loop-box {
            animation: pulse-border 2s infinite;
            border: 2px solid #ED145B !important;
        }
        </style>
        <div class="human-loop-box" id="human-loop-section">
            <h2 style="color: #ED145B; margin-top: 0; font-size: 1.5rem;">⚠️ AÇÃO NECESSÁRIA: Human-in-the-Loop</h2>
            <p style="color: #1F2937; font-size: 1.1rem; margin-bottom: 15px;">
                O Agente Solucionador escreveu o patch e abriu um PR na master. Por regras de Governança (Knight Capital), o deploy automático está bloqueado. <b>A revisão de um Engenheiro é obrigatória.</b>
            </p>
            <p>
                <a href="https://github.com/luizihara/NuBridge_EntregaFinal/pull/1" target="_blank" style="background-color:#1F2937; color:white; padding:8px 16px; border-radius:6px; text-decoration:none; font-weight:bold; font-size: 0.95rem;">🔗 Revisar Código no GitHub</a>
            </p>
        </div>
        """, unsafe_allow_html=True)

        # Auto-scroll para chamar a atenção
        components.html("""
            <script>
                setTimeout(function() {
                    window.parent.document.querySelector('.human-loop-box').scrollIntoView({behavior: 'smooth', block: 'center'});
                }, 500);
            </script>
        """, height=0)

        c1, c2 = st.columns(2)
        with c1:
            st.markdown('<div class="btn-approve">', unsafe_allow_html=True)
            if st.button("✅ APROVAR DEPLOY SEGURO"):
                st.session_state.etapa = 2
                st.rerun()
            st.markdown('</div>', unsafe_allow_html=True)
        with c2:
            st.markdown('<div class="btn-reject">', unsafe_allow_html=True)
            if st.button("❌ REJEITAR PATCH E ABORTAR"):
                st.error("Deploy Abortado pelo Engenheiro.")
                st.stop()
            st.markdown('</div>', unsafe_allow_html=True)

    # ==========================================
    # FINALIZAÇÃO: CRONISTA
    # ==========================================
    if st.session_state.etapa == 2:
        map_placeholder.empty()
        with map_placeholder.container():
            components.html(draw_mermaid_map("Cronista"), height=420)
        with st.status("🔵 Cronista: Imunidade de Software e Post-Mortem...", expanded=True) as status_cro:
            st.write("Redigindo documento corporativo via LLM e publicando no Confluence...")
            time.sleep(1)
            
            if "post_mortem" not in st.session_state:
                st.session_state.post_mortem = cronista.redigir_post_mortem(st.session_state.diagnostico, st.session_state.acao)
            
            st.markdown("### 📝 Relatório Oficial Gerado")
            with st.container(border=True):
                st.markdown(st.session_state.post_mortem)
                
            status_cro.update(label="Cronista: Incidente Documentado e Fechado!", state="complete", expanded=True)
        
        # ====== GERAÇÃO DE PDF ======
        def generate_pdf(text):
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("helvetica", size=11)
            # Higienização do texto para evitar erros
            clean_text = text.encode('latin-1', 'ignore').decode('latin-1')
            clean_text = clean_text.replace('**', '').replace('### ', '').replace('## ', '').replace('`', '')
            pdf.multi_cell(w=0, h=6, text=clean_text, wrapmode="CHAR")
            return bytes(pdf.output())
            
        pdf_bytes = None
        try:
            pdf_bytes = generate_pdf(st.session_state.post_mortem)
        except Exception as e:
            st.error(f"Erro ao compilar o PDF corporativo: {e}")
        
        c1, c2 = st.columns([1, 2])
        with c1:
            if pdf_bytes:
                st.download_button(
                    label="📄 Baixar Relatório Oficial (PDF)",
                    data=pdf_bytes,
                    file_name="PostMortem_NuBridge.pdf",
                    mime="application/pdf",
                    use_container_width=True
                )
            
        st.balloons()
        st.success("🎉 INCIDENTE RESOLVIDO COM SUCESSO! A rede Multiagentes NuBridge finalizou a War Room.")
        
        # ====== COPILOTO CHAT ======
        st.markdown("---")
        st.markdown("### 💬 Copiloto da War Room")
        st.caption("O incidente foi resolvido. Faça perguntas ao Copiloto sobre o que acabou de acontecer (Ele possui todo o contexto do Post-Mortem).")
        
        try:
            from agents.copilot import AgenteCopilot
            if "copilot" not in st.session_state:
                st.session_state.copilot = AgenteCopilot()
            if "messages" not in st.session_state:
                st.session_state.messages = []
                
            for msg in st.session_state.messages:
                st.chat_message(msg["role"]).write(msg["content"])
                
            if prompt := st.chat_input("Pergunte ao copiloto: 'Qual foi o microsserviço afetado?'"):
                st.session_state.messages.append({"role": "user", "content": prompt})
                st.chat_message("user").write(prompt)
                
                resposta = st.session_state.copilot.responder_duvida(
                    contexto_post_mortem=st.session_state.post_mortem,
                    historico=st.session_state.messages,
                    pergunta=prompt
                )
                
                st.session_state.messages.append({"role": "assistant", "content": resposta})
                st.chat_message("assistant").write(resposta)
        except Exception as e:
            st.error(f"Erro ao carregar o Copiloto: {e}")
