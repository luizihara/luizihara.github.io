# Mega-Prompt: Barraquinha Digital (Vibe Coding)

Este arquivo contém um prompt extremamente detalhado (Mega-Prompt), estruturado para você copiar e colar em qualquer IA de geração de código (Lovable, Claude, ChatGPT, v0, etc.) com o objetivo de gerar a aplicação "Barraquinha Digital" com qualidade máxima (nota 11).

---

## Copie o texto abaixo:

**Você é um Desenvolvedor Front-end Sênior e UI/UX Designer Especialista.**

Sua missão é criar uma aplicação web completa e funcional chamada **"Barraquinha Digital VIP Beach"**, contida em **um único arquivo `index.html`** (com CSS e JS embutidos no mesmo arquivo). Não haverá backend (banco de dados ou API real), tudo deve funcionar no lado do cliente gerenciando o estado via JavaScript puro (utilizando obrigatoriamente `localStorage` para manter os dados salvos caso a página seja atualizada).

A aplicação deve ter um design **espetacular, moderno e de cair o queixo**, utilizando conceitos de *Glassmorphism* (fundo translúcido com desfoque de fundo), paleta de cores vibrante (remetendo a praia, sol e mar, como gradientes de laranja/pêssego e azul/ciano), sombras suaves, animações de transição (*micro-interactions*) e tipografia moderna (importe o Google Font 'Outfit' ou 'Inter'). A interface deve ser rigorosamente **Mobile-First**, pois será usada por clientes na areia da praia sob a luz forte do sol (é imprescindível ter alto contraste e botões grandes).

### Funcionalidades Obrigatórias a Implementar:

1. **Cardápio (Menu):**
   - Mínimo de 10 itens divididos em 3 categorias (Ex: Bebidas, Porções, Lanches).
   - Cada item deve ter Nome, Descrição Curta e Preço visível imediatamente, sem precisar de cliques extras.
   - Botões circulares e grandes de [+] e [-] para o usuário adicionar quantidades ao pedido de forma fácil.

2. **Fluxo Completo de Pedido:**
   - Um carrinho de compras flutuante (FAB) visível e uma tela de checkout clara.
   - O cliente deve obrigatoriamente informar sua localização em dois campos (Ex: Um select com "Guarda-sol", "Cadeira" ou "Tenda" e um input numérico para o número). **Faça uma validação rígida**: não permita concluir sem preencher o número.
   - Ao confirmar, gere automaticamente um número de pedido (ex: `PED-1004`) e limpe o carrinho.

3. **Painel da Barraca (Modo Admin):**
   - Uma tela protegendo a operação, que lista todos os pedidos ativos em **ordem cronológica** (do mais antigo na fila para o mais novo).
   - Cada card de pedido deve exibir de forma muito legível: Número do pedido, Localização do cliente, Itens solicitados com quantidades, Horário e Status atual.
   - Botões coloridos para o atendente avançar o status do pedido em um fluxo lógico: "Recebido" -> "Em Preparo" -> "Pronto" -> "Entregue".
   - Pedidos no status "Entregues" devem ficar visualmente distintos (ex: menor opacidade ou cinza) para não poluir a atenção do atendente.

4. **Acompanhamento pelo Cliente:**
   - Tela dedicada onde o cliente digita o número do seu pedido (ex: PED-1004) e clica em buscar.
   - Ao achar, deve exibir uma **Timeline (Linha do Tempo) visual** bastante elegante indicando os passos e destacando em qual etapa o pedido se encontra no momento.

5. **Tela de Teste de API (Simulador Técnico):**
   - Um campo de texto para digitar o número do pedido e um botão "GET".
   - Crie um simulador de rede: aplique um *delay* (ex: `setTimeout` de 600ms) exibindo um spinner de carregamento elegante.
   - Após o delay, mostre visualmente o código HTTP (`200 OK` em verde se existir, `404 Not Found` em vermelho se não existir) e imprima o retorno no formato JSON perfeitamente identado (`<pre>`).

6. **Dados de Exemplo Pré-carregados (Essencial):**
   - Ao abrir a aplicação pela primeira vez em um navegador zerado, injete 3 pedidos fictícios no sistema com status variados: um "recebido", um "em-preparo" e um "entregue", para que o painel admin não fique vazio na primeira visualização.

### Funcionalidades Opcionais Diferenciais (Para nota máxima):

1. **Filtro no Painel Admin:** Um `<select>` no topo do painel para o atendente filtrar a visualização entre "Apenas Ativos" e "Todos os Pedidos" (histórico).
2. **Cards de Estatísticas (Dashboard):** No topo do Painel Admin, mostre 3 "cards" com contadores dinâmicos em tempo real: Quantidade de pedidos "Na Fila", "Em Preparo" e "Prontos".
3. **Cancelamento de Pedido:** O cliente pode cancelar seu próprio pedido na tela de acompanhamento, **apenas** enquanto o status for "recebido". Ao mudar para preparo, o botão de cancelar deve desaparecer por motivos lógicos.
4. **Proteção Anti-Spam:** Validação de regra de negócio: bloqueie um novo pedido e avise o usuário caso a mesma localização (ex: Guarda-sol 10) tenha feito um pedido há menos de 2 minutos.

### Estrutura e Engenharia (Single Page Application Fake):

- O arquivo HTML deve conter uma navegação fixa no topo (Header) simulando um app, com os links/botões: "Início", "Cardápio", "Acompanhar", "Painel (Barraca)", e "API".
- Use Vanilla JavaScript para ocultar/mostrar as divs (`<section>`) correspondentes a cada tela sem recarregar a página da web, aplicando uma transição CSS de `fade-in` e leve slide-up.
- Desenvolva um sistema global de **Toasts** (notificações flutuantes com animação de entrada que duram 3 segundos no topo ou rodapé da tela) para exibir feedbacks interativos (ex: "Pedido enviado com sucesso!", "Status atualizado para Pronto", "Preencha a localização!").

Escreva o código impecavelmente, sem truncar nada, gerando um único artefato final. A usabilidade deve ser perfeita. Surpreenda-me.
