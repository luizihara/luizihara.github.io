import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT = "/Users/ihara/Workspace/luizihara.github.io/fiap.estrategias-setoriais-de-implementacao/aula-2/AgroTech-Vale-Verde-Estrategia-IA.pptx";
const TMP = "/Users/ihara/Workspace/luizihara.github.io/tmp/agrotech-ppt-build";
const C = { paper:"#F1F3EB", white:"#FBFCF8", ink:"#122722", muted:"#60706A", line:"#CBD4C6", green:"#2E6F50", lime:"#C9E75C", navy:"#163B4B", orange:"#E96E4C", pale:"#E5EEDC", paleBlue:"#C7E0DA" };
const source = "[Sources]\n- Estudo de Caso - AgroTech (1).pdf (arquivo fornecido pelo usuário).\n- Recomendações e priorização: análise original a partir do enunciado.";

async function save(path, blob) { await fs.writeFile(path, new Uint8Array(await blob.arrayBuffer())); }
function rect(slide, x, y, w, h, fill, radius = 0, line = "none") {
  return slide.shapes.add({ geometry: radius ? "roundRect" : "rect", position:{left:x,top:y,width:w,height:h}, fill, line:{style:"solid",fill:line,width:line==="none"?0:1}, borderRadius:radius||undefined });
}
function text(slide, value, x, y, w, h, style = {}, name) {
  const s = slide.shapes.add({ geometry:"textbox", name, position:{left:x,top:y,width:w,height:h}, fill:"none", line:{style:"solid",fill:"none",width:0} });
  s.text = value;
  s.text.style = { typeface: style.typeface || "Aptos", fontSize: style.size || 18, color: style.color || C.ink, bold: style.bold || false, italic: style.italic || false, lineSpacing: style.lineSpacing || 1.1, alignment: style.align || "left", verticalAlignment: style.valign || "top", insets:{top:0,right:0,bottom:0,left:0}, autoFit:"shrinkText" };
  return s;
}
function line(slide, x, y, w, color, thickness = 1) {
  return slide.shapes.add({ geometry:"line", position:{left:x,top:y,width:w,height:0}, fill:"none", line:{style:"solid",fill:color,width:thickness} });
}
function chrome(slide, kicker, page, dark = false) {
  line(slide,72,38,1136,dark?"#6B887D":C.line,1);
  text(slide,kicker.toUpperCase(),72,54,520,18,{size:10,color:dark?C.lime:C.green,bold:true,typeface:"Aptos Mono"}, "kicker");
  text(slide,page,1134,660,74,16,{size:10,color:dark?"#B7C8C0":C.muted,bold:true,align:"right",typeface:"Aptos Mono"}, "page");
}
function notes(slide, extra = "") { slide.speakerNotes.textFrame.setText(`${source}\n${extra}`); slide.speakerNotes.setVisible(true); }
function addBullet(slide, n, value, x, y, w, dark = false) {
  text(slide,n,x,y,28,20,{size:11,color:dark?C.lime:C.orange,bold:true,typeface:"Aptos Mono"});
  text(slide,value,x+42,y-3,w-42,42,{size:15,color:dark?"#DCE8E2":C.ink,lineSpacing:1.15});
  line(slide,x,y+48,w,dark?"#46685B":C.line,1);
}

async function main() {
  const p = Presentation.create({slideSize:{width:1280,height:720}});

  // 01 — cover
  { const s=p.slides.add(); s.background.fill=C.paper;
    rect(s,0,0,1280,720,{type:"gradient",gradientKind:"linear",angleDeg:0,stops:[{offset:0,color:C.paper},{offset:100000,color:"#C5DED2"}]});
    // subdued editable topographic motif
    for(let i=0;i<7;i++){ const e=s.shapes.add({geometry:"ellipse",position:{left:770-i*33,top:88+i*17,width:430+i*66,height:365+i*46},fill:"none",line:{style:"solid",fill:"#2E6F50/35",width:1.2}}); e.rotation=-11; }
    text(s,"FIAP MBA TECH · ESTRATÉGIAS SETORIAIS DE IMPLEMENTAÇÃO",72,71,560,18,{size:10,color:C.green,bold:true,typeface:"Aptos Mono"});
    text(s,"Colher eficiência.",72,220,850,98,{size:70,color:C.ink,bold:true,typeface:"Georgia",lineSpacing:.9}, "title");
    text(s,"Cultivar inteligência.",72,302,850,98,{size:70,color:C.green,bold:true,italic:true,typeface:"Georgia",lineSpacing:.9});
    text(s,"AgroTech Vale Verde: entre a excelência operacional e uma transformação orientada por Inteligência Artificial.",72,432,590,68,{size:21,color:"#4D625A",lineSpacing:1.22});
    text(s,"ANÁLISE ESTRATÉGICA · ESTUDO DE CASO · 2026",72,587,500,18,{size:10,color:"#4E645B",bold:true,typeface:"Aptos Mono"});
    text(s,"01 / 09",1134,660,74,16,{size:10,color:C.muted,bold:true,align:"right",typeface:"Aptos Mono"}); notes(s,"Capa. Abra com o dilema: manter eficiência comprovada ou criar capacidade de IA.");
  }

  // 02 — company context
  { const s=p.slides.add(); s.background.fill=C.paper; chrome(s,"O contexto da empresa","02 / 09");
    text(s,"Uma operação sólida\nem um mercado que\nmudou de ritmo.",72,136,650,250,{size:61,color:C.ink,bold:true,typeface:"Georgia",lineSpacing:.92}, "title");
    line(s,72,465,1136,C.line,1);
    text(s,"VALE VERDE EM 2025",72,495,210,18,{size:12,color:C.ink,bold:true,typeface:"Georgia"});
    text(s,"Player relevante de soja e milho no Centro-Oeste.",72,522,230,40,{size:13,color:C.muted,lineSpacing:1.15});
    const metrics=[["85 mil","hectares cultivados"],["R$ 480 mi","receita anual"],["12%","EBITDA médio"]];
    metrics.forEach(([v,l],i)=>{const x=366+i*275; if(i) line(s,x-24,488,1,C.line,78); text(s,v,x,495,225,54,{size:42,color:C.green,bold:true,typeface:"Georgia",lineSpacing:.9});text(s,l,x,555,185,32,{size:13,color:C.muted,lineSpacing:1.15});});
    notes(s,"Apresente os dados que mostram uma empresa operacionalmente robusta, antes de discutir a transformação.");
  }

  // 03 — sector
  { const s=p.slides.add(); s.background.fill=C.paper; chrome(s,"Questão 1 · Setor e competição","03 / 09");
    text(s,"MATURIDADE DIGITAL DO AGRONEGÓCIO",72,155,340,18,{size:10,color:C.green,bold:true,typeface:"Aptos Mono"});
    text(s,"3,1",72,202,360,130,{size:108,color:C.orange,bold:true,typeface:"Georgia",lineSpacing:.78});
    text(s,"em uma escala de 1 a 6.\nA média brasileira é 3,7.",72,348,340,64,{size:20,color:C.muted,lineSpacing:1.25});
    text(s,"A baixa maturidade é uma fragilidade - e uma janela de vantagem para quem aprende primeiro.",572,157,570,156,{size:52,color:C.green,bold:true,typeface:"Georgia",lineSpacing:.94}, "title");
    addBullet(s,"01","Clima, solo, produção e logística oferecem alto potencial preditivo.",572,370,570);
    addBullet(s,"02","Conectividade, integração e governança ainda limitam a captura de valor.",572,440,570);
    addBullet(s,"03","Rastreabilidade ESG torna capacidade analítica um requisito de mercado.",572,510,570);
    notes(s,"Explique que a IA é especialmente valiosa no agronegócio porque as decisões se repetem e geram dados em escala.");
  }

  // 04 — porter
  { const s=p.slides.add(); s.background.fill=C.paper; chrome(s,"Questão 1 · 5 Forças de Porter","04 / 09");
    text(s,"IA redesenha as forças\nque definem a competição.",72,106,790,120,{size:55,color:C.ink,bold:true,typeface:"Georgia",lineSpacing:.92}, "title");
    const forces=[["01","Rivalidade","Algoritmos reduzem custo por hectare e aceleram a resposta.","COMPETIÇÃO AUMENTA",C.orange],["02","Entrantes","Dados proprietários tornam-se uma barreira difícil de copiar.","BARREIRA AUMENTA",C.green],["03","Fornecedores","Previsão e otimização fortalecem negociação de insumos e fretes.","PODER REDUZ",C.green],["04","Compradores","Rastreabilidade e ESG aumentam a exigência de mercados externos.","PRESSÃO AUMENTA",C.orange],["05","Substitutos","A IA diferencia o produtor previsível e confiável.","EFEITO INDIRETO",C.green]];
    forces.forEach((f,i)=>{const x=72+i*227;rect(s,x,294,210,284,C.white,0,C.line);text(s,f[0],x+18,315,44,18,{size:10,color:C.orange,bold:true,typeface:"Aptos Mono"});text(s,f[1],x+18,366,165,38,{size:23,color:C.ink,bold:true,typeface:"Georgia",lineSpacing:.95});text(s,f[2],x+18,420,168,84,{size:12,color:C.muted,lineSpacing:1.2});text(s,f[3],x+18,540,165,16,{size:8,color:f[4],bold:true,typeface:"Aptos Mono"});});
    notes(s,"Use esta leitura para mostrar como cada força é afetada pela IA. Não trate IA como um fim tecnológico.");
  }

  // 05 — diagnosis
  { const s=p.slides.add(); s.background.fill=C.paper; chrome(s,"Questão 2 · Diagnóstico organizacional","05 / 09");
    rect(s,72,136,365,440,C.navy,0,"none");text(s,"MATURIDADE ATUAL",106,170,220,18,{size:10,color:C.lime,bold:true,typeface:"Aptos Mono"});text(s,"Nível 1\nExploração",106,238,302,146,{size:50,color:"#FFFFFF",bold:true,typeface:"Georgia",lineSpacing:.9});text(s,"Pilotos existem, mas não foram incorporados à rotina produtiva nem ligados ao resultado financeiro.",106,463,245,68,{size:13,color:"#C3D4CD",lineSpacing:1.2});
    text(s,"O problema não é o modelo. É o sistema.",510,145,625,94,{size:54,color:C.ink,bold:true,typeface:"Georgia",lineSpacing:.94}, "title");
    const gaps=[["Dados","Coleta parcial no campo e baixa integração entre ERP, clima, produção e logística."],["Governança","Sem padrão de qualidade, responsável definido ou rastreabilidade consistente."],["Cultura","Decisão baseada na experiência; baixa prática de experimentação controlada."],["Liderança","Perfil conservador protege a operação, mas reduz apetite a testes sem retorno visível."]];
    gaps.forEach((g,i)=>{const x=510+(i%2)*325,y=315+Math.floor(i/2)*145;line(s,x,y,258,C.green,2);text(s,g[0],x,y+16,250,28,{size:22,color:C.ink,bold:true,typeface:"Georgia"});text(s,g[1],x,y+56,255,67,{size:12,color:C.muted,lineSpacing:1.18});});
    notes(s,"Defenda a classificação Nível 1: a tecnologia foi experimentada, mas não há escala, processo ou governança.");
  }

  // 06 — priority
  { const s=p.slides.add(); s.background.fill=C.paper; chrome(s,"Questão 3 · Priorização","06 / 09");
    text(s,"COMEÇAR ONDE O VALOR É VISÍVEL",72,138,390,18,{size:10,color:C.green,bold:true,typeface:"Aptos Mono"});
    text(s,"A prioridade combina impacto financeiro, dados disponíveis e uma decisão operacional concreta.",72,186,386,154,{size:45,color:C.green,bold:true,typeface:"Georgia",lineSpacing:.95}, "title");
    text(s,"A logística representa 22% do custo operacional: é o melhor ponto de partida para provar valor rapidamente.",72,372,350,72,{size:15,color:C.muted,lineSpacing:1.2});
    const priority=[["01","Otimização logística","Rotas, janelas e alocação de transporte.","IMPACTO ALTO · COMPLEXIDADE BAIXA"],["02","Previsão de produtividade","Risco climático e produtividade por talhão.","IMPACTO ALTO · COMPLEXIDADE MÉDIA"],["03","Aplicação de precisão","Avançar após consolidar dados e processo.","IMPACTO ALTO · COMPLEXIDADE ALTA"]];
    priority.forEach((a,i)=>{const y=138+i*153;line(s,550,y,650,C.line,1);text(s,a[0],550,y+34,65,44,{size:38,color:C.orange,bold:true,typeface:"Georgia"});text(s,a[1],636,y+32,315,30,{size:25,color:C.ink,bold:true,typeface:"Georgia"});text(s,a[2],636,y+74,340,24,{size:13,color:C.muted});text(s,a[3],987,y+49,195,28,{size:9,color:C.green,bold:true,typeface:"Aptos Mono",align:"right"});}); line(s,550,596,650,C.line,1);
    notes(s,"Recomende iniciar pela logística e manter previsão de produtividade como segundo piloto. Evite ampliar o portfólio antes de provar valor.");
  }

  // 07 — risks
  { const s=p.slides.add(); s.background.fill=C.ink; chrome(s,"Questão 3 · Riscos que devem ser geridos","07 / 09",true);
    text(s,"Escalar sem controle\nreproduz o problema.",72,138,660,124,{size:57,color:"#F5F8F1",bold:true,typeface:"Georgia",lineSpacing:.9}, "title");
    text(s,"O risco não é testar IA. É transformar uma prova técnica em decisão operacional sem qualidade, donos e critérios.",782,157,364,89,{size:17,color:"#C2D2CB",lineSpacing:1.2});
    const risks=[["01 / DADO","Baixa qualidade","Resposta: catálogo + padrão + dono."],["02 / PROCESSO","“Pilot Purgatory”","Resposta: KPI + responsável + rotina."],["03 / TECNOLOGIA","Dependência","Resposta: arquitetura e dados sob controle."],["04 / DECISÃO","Viés e exceção","Resposta: humano no circuito."]];
    risks.forEach((r,i)=>{const x=72+i*284;line(s,x,404,250,"#46685B",1);text(s,r[0],x,430,210,18,{size:10,color:C.lime,bold:true,typeface:"Aptos Mono"});text(s,r[1],x,477,218,38,{size:25,color:"#F5F8F1",bold:true,typeface:"Georgia"});text(s,r[2],x,543,222,42,{size:12,color:"#AFC5BB",lineSpacing:1.16});});
    notes(s,"Mostre que cada risco tem uma resposta de gestão. A empresa não deve esperar risco zero.");
  }

  // 08 — roadmap
  { const s=p.slides.add(); s.background.fill=C.paper; chrome(s,"Questão 4 · Roadmap de implementação","08 / 09");
    text(s,"ESTRATÉGIA RECOMENDADA · EXPANSÃO GRADUAL",72,116,490,18,{size:10,color:C.green,bold:true,typeface:"Aptos Mono"});
    text(s,"Diagnosticar. Priorizar.\nPilotar. Escalar.",72,154,785,102,{size:54,color:C.ink,bold:true,typeface:"Georgia",lineSpacing:.9}, "title");
    const phases=[["0 - 90 DIAS","Diagnosticar","Inventário e qualidade dos dados\nDonos e regras de uso\nBaseline de custo e perda"],["3 - 6 MESES","Priorizar","Business case de logística\nPrevisão por talhão\nKPIs aprovados"],["6 - 12 MESES","Pilotar","Humano no circuito\nGrupo de comparação\nAcurácia e ganho financeiro"],["12+ MESES","Escalar","Integração campo-ERP-logística\nComponentes reutilizáveis\nCapacitação contínua"]];
    phases.forEach((p1,i)=>{const x=72+i*284;line(s,x,356,250,C.line,1);text(s,p1[0],x,382,230,18,{size:10,color:C.green,bold:true,typeface:"Aptos Mono"});text(s,p1[1],x,432,230,38,{size:28,color:C.ink,bold:true,typeface:"Georgia"});text(s,p1[2],x,490,233,78,{size:13,color:C.muted,lineSpacing:1.36});});
    notes(s,"Apresente a sequência como portas de decisão: não escalar até que a fase anterior prove seus critérios.");
  }

  // 09 — close
  { const s=p.slides.add(); s.background.fill=C.lime; line(s,72,38,1136,"#769D47",1);
    text(s,"CONCLUSÃO",72,54,170,18,{size:10,color:"#28583F",bold:true,typeface:"Aptos Mono"});
    text(s,"A Vale Verde não precisa apostar tudo na IA.",72,171,1060,85,{size:58,color:C.ink,bold:true,typeface:"Georgia",lineSpacing:.92}, "title");
    text(s,"Precisa escalar o que prova valor.",72,252,1010,80,{size:58,color:C.green,bold:true,italic:true,typeface:"Georgia",lineSpacing:.92});
    line(s,72,522,1136,"#769D47",1);
    text(s,"Uma ambição moderada, governada por valor e integrada à operação transforma o perfil conservador da liderança em disciplina de execução.",72,549,520,58,{size:15,color:"#42594F",lineSpacing:1.18});
    text(s,"AGROTECH VALE VERDE · IA COMO CAPACIDADE ESTRATÉGICA",758,570,450,20,{size:10,color:"#355D48",bold:true,typeface:"Aptos Mono",align:"right"});
    text(s,"09 / 09",1134,660,74,16,{size:10,color:"#315E45",bold:true,align:"right",typeface:"Aptos Mono"}); notes(s,"Feche reforçando que a estratégia é seletiva e orientada a valor, não uma aposta tecnológica.");
  }

  for (const [i, slide] of p.slides.items.entries()) {
    await save(`${TMP}/slide-${String(i+1).padStart(2,"0")}.png`, await p.export({slide,format:"png",scale:1}));
    await fs.writeFile(`${TMP}/slide-${String(i+1).padStart(2,"0")}.layout.json`, await (await slide.export({format:"layout"})).text());
  }
  await save(`${TMP}/deck-montage.webp`, await p.export({format:"webp",montage:true,scale:1}));
  const pptx = await PresentationFile.exportPptx(p);
  await pptx.save(OUT);
}
main().catch(err=>{console.error(err);process.exitCode=1});
