# Prompt e Roteiro de Geração de Vídeo por IA (NuBridge)

> **Objetivo deste documento:** Este arquivo é um "Prompt de Direção de Vídeo". Ele foi escrito para ser copiado e colado dentro de plataformas de geração de vídeo com avatares de Inteligência Artificial. Ele define as regras visuais, as cores, as ferramentas recomendadas e o texto exato (teleprompter) que o avatar deverá falar.

---

## 🛠️ Ferramentas Recomendadas para Geração do Vídeo
Para transformar este roteiro em um vídeo profissional, recomendamos a utilização de uma das seguintes ferramentas de AI Video Generation:
- **HeyGen** (Excelente para clonagem de voz e avatares realistas em apresentações corporativas).
- **Synthesia** (Muito estável, com suporte nativo excelente para a língua portuguesa e cenários executivos).
- **D-ID** (Ideal se você quiser animar uma foto estática de um rosto para fazer a apresentação).

## 🎨 Diretrizes Visuais para a IA (Design System)
Para manter o padrão do projeto e da entrega em HTML, a ferramenta de geração de vídeo deve utilizar o seguinte esquema de cores para os slides e legendas:
- **Cor de Fundo Principal:** Branco e tons de Cinza muito claro (`#FFFFFF` e `#F8F9FA`).
- **Cor de Destaque (Secundária):** Vermelho Claro / Rosa FIAP (`#ED145B` ou `#FF4D79`). Usado para destacar palavras importantes, caixas de alerta e títulos.
- **Cor da Tipografia:** Preto e Cinza Escuro (`#1F2937`), garantindo um visual limpo e alta legibilidade.
- **Formato:** O vídeo deve exibir o Avatar de IA no canto (ou metade da tela) e, na outra metade, exibir imagens do arquivo HTML (`entrega.html`) ou do fluxo do protótipo no terminal.

---

## 🎬 Roteiro Oficial (Teleprompter para a IA)

*Instrução para a plataforma de IA: O avatar deve adotar um tom executivo, seguro e técnico, com pausas breves após as vírgulas para facilitar o entendimento.*

### Ato 1: Apresentação e O Problema
**[Sugestão Visual na Tela: Exibir os nomes do grupo e o KPI de queda de sistema]**

> "Olá! Eu sou um avatar de Inteligência Artificial e estou aqui representando o grupo composto por Luiz Ihara, Filipe Fragoso, Daniel Caminha e Pedro Martins, da turma 2ABL, orientados pelo Professor Thiago Nogueira. 
> 
> Hoje vamos apresentar a nossa entrega final de Orquestração e Integração de Agentes: o projeto NuBridge.
>
> Nós escolhemos uma dor real e sangrenta nas trincheiras da engenharia de software: a famosa 'War Room' de incidentes críticos. Quando um sistema cai, a equipe entra em desespero caçando logs e tentando adivinhar o erro. Pior do que isso, o bug é resolvido na adrenalina, ninguém documenta a solução, e meses depois, a mesma falha volta a ocorrer, forçando a empresa a perder as mesmas horas preciosas investigando do zero."

### Ato 2: A Solução e as Ferramentas
**[Sugestão Visual na Tela: Exibir o Mapa de Agentes e o Fluxo de Orquestração (RAG)]**

> "A nossa solução para remover esse caos é o NuBridge: um ecossistema com múltiplos agentes colaborativos, orquestrado através de um loop RAG, ou seja, Geração Aumentada por Recuperação.
> 
> A mágica acontece porque não usamos scripts rígidos, mas sim inteligência distribuída. Nossa orquestração e o protótipo podem ser perfeitamente desenvolvidos utilizando frameworks avançados como **LangGraph**, **CrewAI** ou **AutoGen**. 
>
> Nesse fluxo, o 'Agente Triador' lê a telemetria; o 'Arqueólogo' caça mudanças recentes de código; mas o grande diferencial é o nosso 'Agente Bibliotecário', que consulta nossa base vetorial para descobrir se aquele incidente já foi resolvido pela empresa no passado. O 'Agente Investigador' cruza todos esses dados para cravar a causa raiz do problema."

### Ato 3: Governança e O Protótipo
**[Sugestão Visual na Tela: Gravação do terminal simulando a aprovação no Slack (Human-in-the-loop)]**

> "Para a execução prática do nosso protótipo, criamos um fluxo seguro. E aqui entra o ponto crucial da governança: o nosso sistema não faz deploy de código automaticamente de forma descontrolada.
>
> Inserimos um mecanismo rigoroso de 'Human-in-the-loop'. Quando o agente solucionador cria uma correção, o fluxo é paralisado. Ele envia o diagnóstico para o Slack e pede a aprovação de um humano na engenharia. O papel da equipe deixa de ser a escavação de logs e passa a ser a revisão final e aprovação. Somente após essa confirmação manual, o nosso 'Agente Cronista' documenta o Post-Mortem de forma autônoma, alimentando a nossa base vetorial e gerando imunidade de longo prazo."

### Ato 4: Riscos (Knight Capital) e Conclusão
**[Sugestão Visual na Tela: Ícones de segurança e redução do MTTR]**

> "Analisando o pior cenário possível, o nosso caso 'Knight Capital', mapeamos dois riscos críticos. O primeiro é o vazamento de dados sensíveis para os LLMs. A nossa arquitetura barra isso utilizando um Data Loss Prevention Gateway, que sanitiza os logs na nossa própria nuvem privada. O segundo risco é vetorizar 'gambiarras'; por isso, apenas soluções com aprovação explícita da liderança alimentam o cérebro do sistema.
>
> O NuBridge prova que orquestração de agentes não substitui o desenvolvedor. Ela elimina o trabalho repetitivo, reduz drasticamente o tempo médio de resolução e transforma cada incidente isolado em memória institucional.
>
> Muito obrigado pela atenção."
