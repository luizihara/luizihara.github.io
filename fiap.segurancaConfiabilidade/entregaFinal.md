## Apresentação/Estudo de aplicação em Segurança e Confiabilidade em IA (2ABL)
### Professor: jose ahirton batista lopes filho
### Data: 24/05/2026

- O que deve ser apresentado?

Ao final da disciplina deverá ser apresentado o planejamento e análise de uma aplicação ou pesquisa relacionada a um problema específico que envolva o uso de Inteligência Artificial, preferencialmente com modelos de linguagem (LLMs) e/ou agentes de IA, com foco em aspectos de segurança, confiabilidade e riscos em produção.

- As equipes devem atentar para os seguintes pontos:

Contexto da aplicação – Qual problema está sendo resolvido? Quem são os usuários do sistema? Existe impacto direto em decisões, dados sensíveis ou experiência do usuário? Qual o nível de criticidade dessa aplicação?
Arquitetura da solução – Como o sistema funciona de forma geral? Utiliza apenas LLM ou envolve RAG, agentes ou integração com APIs externas? O sistema apenas responde ou também executa ações? Existe algum nível de autonomia?
Identificação de vulnerabilidades – Quais são os principais riscos associados ao sistema proposto? Exemplos incluem prompt injection, vazamento de dados sensíveis, alucinações, uso inseguro de ferramentas, excessive agency, entre outros. Para cada vulnerabilidade, explicar como ela pode ocorrer no cenário proposto e qual o impacto potencial.
Simulação de cenários de ataque – Apresentar ao menos dois exemplos de ataques ou interações problemáticas que poderiam explorar vulnerabilidades do sistema. Pode ser via prompts, fluxos ou comportamentos esperados do usuário.
Estratégias de mitigação – Quais medidas podem ser adotadas para reduzir os riscos identificados? Em qual camada essas medidas atuam (entrada, modelo, saída ou arquitetura)? Considerar também abordagens como human-in-the-loop, validação de contexto, filtros e monitoramento.
Análise crítica – Considerar os trade-offs da solução proposta. Quais riscos são mais difíceis de mitigar? Quais soluções têm maior custo ou impacto arquitetural? Ainda existem riscos mesmo após as mitigações? O sistema seria confiável o suficiente para uso em produção?

Dica: podem ser utilizados como base conceitos discutidos em aula como OWASP Top 10 para LLMs, guardrails, red teaming, monitoramento e Responsible AI.

Sugiro organizar o trabalho tendo por base os seguintes tópicos:

Introdução e Problemática;
Motivação e Objetivo;
Arquitetura da solução e funcionamento;
Análise de riscos e vulnerabilidades;
Estratégias de mitigação;
Considerações finais e análise crítica.

Avaliação:

Material escrito entregue (de preferência slides - com 8 a 10 slides tenho certeza que conseguem trazer detalhamento suficiente!, documento ou vídeo com breve apresentação);
Aderência aos pontos propostos;
Profundidade da análise e capacidade crítica;
Clareza na definição dos riscos e coerência das mitigações;
Originalidade e adequação ao contexto do curso.

Sites e recursos para pesquisa:

https://owasp.org/www-project-top-10-for-large-language-model-applications/
https://datasetsearch.research.google.com/
https://www.kaggle.com/datasets
https://github.com/langchain-ai/langchain
https://github.com/google-deepmind/agent-development-kit

Entrega do trabalho: 24/05/2026

Quaisquer dúvidas é só me contactar: profahirton.lopes@fiap.com.br

[]’s