import json
import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings

class AgenteBibliotecario:
    def __init__(self):
        self.nome = "Bibliotecário (Busca Vetorial RAG)"
        model_name = os.getenv("OLLAMA_MODEL", "gemma:2b")
        # Usaremos o próprio modelo configurado para gerar embeddings. 
        # Em produção real, recomenda-se "nomic-embed-text".
        self.embeddings = OllamaEmbeddings(model=model_name)

    def buscar_historico(self, mock_file_path, stack_trace):
        try:
            with open(mock_file_path, 'r') as f:
                db_result = json.load(f)
            
            # Simulando o RAG na vida real usando ChromaDB
            # 1. Ingerindo o documento histórico (que faríamos no passado)
            texto_documento = f"Incidente: {db_result['title']}\nResumo: {db_result['post_mortem_summary']}\nSolução: {db_result['resolution']}"
            
            # 2. Criando o banco vetorial na memória
            vectorstore = Chroma.from_texts(
                texts=[texto_documento],
                embedding=self.embeddings,
                metadatas=[{"incident_id": db_result["incident_id"]}]
            )
            
            # 3. Fazendo a busca vetorial usando o erro atual
            resultados = vectorstore.similarity_search(stack_trace, k=1)
            
            if resultados:
                solucao = resultados[0].page_content
            else:
                solucao = db_result['resolution']
                
        except Exception as e:
            # Fallback seguro caso o OllamaEmbeddings falhe (modelo não suporte embeddings etc)
            print(f"[{self.nome}] RAG Fallback ativado. Erro no DB: {e}")
            with open(mock_file_path, 'r') as f:
                db_result = json.load(f)
            solucao = db_result['resolution']
        
        return {
            "solucao_historica": solucao
        }
