## Trabalho Final Implemetando AI Agents
### Professor: felipe gustavo silva teodoro
### Data: 07/05/2026

---

### Exercício 1: Prático - LangFlow (Assistente de Análise de Propostas B2B)

**Arquitetura Desenvolvida:**
O fluxo foi construído utilizando o encadeamento (PromptChain) com os seguintes passos:
1. **Extrator**: (`gpt-4o-mini`, JSON Mode) Extrai dados brutos da RFP.
2. **Qualificador**: (`gpt-4o-mini`, JSON Mode) Analisa a RFP estruturada e qualifica o lead.
3. **Gerador**: (`gpt-4o`, JSON Mode) Rascunha a proposta baseada nas dores e no budget.
4. **Validador (Bônus)**: Avalia a proposta em relação às necessidades B2B, garantindo a qualidade.

**Artefatos Entregues:**
- [ ] [`Exercicio1_Fluxo.json`](#) (Arquivo Exportado do LangFlow)
- [ ] Imagem do fluxo (print das conexões): 
  ![Print do Langflow](#)
- [ ] Saída do Caso de Teste "TechParts Indústria" detalhada abaixo:

```json
// Cole aqui a saída gerada no teste //
```

---

### Exercício 2: Prático - AI Agent com Tools (Ações e FIIs)

**Arquitetura Desenvolvida:**
A arquitetura do agente se baseia no padrão `Agent + Tool` do Langflow 1.7. 
Foi utilizada uma instrução de sistema que mapeia ativamente as URLs de destino baseado no input do usuário:
- `/acoes/[ticker]`
- `/fundos-imobiliarios/[ticker]`
O agente aciona uma ferramenta de extração para vasculhar a tela e formatar a resposta.

**Artefatos Entregues:**
- [ ] [`Exercicio2_Fluxo.json`](#) (Arquivo Exportado do LangFlow)
- [ ] Imagem do fluxo 1 (Ação PETR4): ![](#)
- [ ] Imagem do fluxo 2 (FII HGLG11): ![](#)
- [ ] Imagem do fluxo 3 (Comparação): ![](#)

**Respostas das Reflexões (Teoria):**
1. **Limitações do Web Scraping:** Risco de mudança no layout DOM (`Status Invest`), seletor quebrado ou bloqueio Anti-Bot (Erro 403) devido a falta de User-Agent real ou Headless Browser.
2. **Ticker Inválido:** O Agente avalia o retorno (erro 404/Página Vazia do Scraping) de forma semântica e gera a amigável resposta "Ticker Inválido na B3" ao invés de quebrar a cadeia.
3. **Dados Históricos:** Scraping web visual só traz a fotografia estática (dados do dia atual gravados na box). Histórico requer acesso a gráficos via API especializada (ex: AlphaVantage).
4. **Escalar para Múltiplos Usuários:** Substituir Scraper por APIs B2B oficiais + Banco de Dados (Redis Redis) para cache das consultas mais quentes.

---

### Exercício 3: Trabalho Final - Storytelling e Arquitetura Banco NovaEra

**Resumo da Solução:**
Desenvolvemos uma proposta de inovação criando o projeto de expansão do Banco fictício "NovaEra" combatendo o churn de clientes. Projetamos um Super-App suportado por 3 agentes assíncronos e hiperespecializados:
1. **Finn:** Agente Financeiro alimentado por OCR de boletos.
2. **InvestIA:** Assessor de Investimento que avalia risco e busca papéis vivos na B3.
3. **GuiaNova:** Assistente Ominichannel SAC com memória retentiva (CRM).

**Artefato Entregue:**
Para apresentar todo o raciocínio, métricas de sucesso, jornada de negócio e os **Diagramas Arquiteturais**, veja o documento detalhado abaixo:
- [x] [Ver Documento do Trabalho Final (Arquitetura e Capítulos 1 a 8)](Exercicio3_TrabalhoFinal.md)