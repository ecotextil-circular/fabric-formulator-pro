import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, ChevronDown, ChevronUp, Leaf, Search, Factory, Clipboard, Users, Cog, BarChart3, Truck, Cpu, RefreshCw, Palette, Megaphone, Sparkles, ShieldCheck, Rocket, Calculator, TrendingUp, Target, Kanban, Shirt, Activity } from "lucide-react";

const GUIDE_SECTIONS = [
  {
    icon: Leaf,
    title: "Introdução à Economia Circular na Indústria Têxtil",
    content: `A economia circular na indústria têxtil representa uma mudança de paradigma do modelo linear "extrair-produzir-descartar" para um sistema regenerativo. Este modelo busca manter produtos, componentes e materiais em seu mais alto nível de utilidade e valor o tempo todo.

Nova Regulamentação Europeia: Proibição da Destruição de Roupas Não Vendidas

A União Europeia deu um passo histórico ao proibir a destruição de roupas e calçados não vendidos, desafiando diretamente o modelo de negócio do fast fashion. Esta medida faz parte de um pacote mais amplo de regulamentações de sustentabilidade que visa transformar a indústria têxtil europeia.

Principais pontos da regulamentação:
• Proibição da destruição: As empresas não poderão mais descartar ou incinerar produtos têxteis não vendidos
• Obrigatoriedade de reaproveitamento: Roupas excedentes devem ser doadas, recicladas ou revendidas
• Transparência na cadeia produtiva: Marcas devem divulgar informações sobre volumes de produção e destino de produtos não vendidos
• Responsabilidade atribuída ao produtor: Fabricantes são responsáveis pelo ciclo completo dos produtos
• Metas de redução de desperdício: Estabelecimento de objetivos progressivos de redução de resíduos têxteis

Impacto na indústria do fast fashion:
A medida atinge especialmente o modelo de negócio baseado em superprodução e descarte rápido. Marcas de fast fashion produzem grandes volumes e destroem o excedente para manter a exclusividade e evitar a desvalorização. Com a nova lei, esse modelo se torna inviável na Europa.

Oportunidades para empresas brasileiras:
• Antecipação de tendências: A regulamentação europeia tende a influenciar legislações globais
• Vantagem competitiva: Empresas que já adotam práticas circulares estarão à frente
• Acesso ao mercado europeu: Conformidade com as novas regras abre portas para exportação
• Inovação forçada: Necessidade de desenvolver novos modelos de negócio mais sustentáveis

Princípios fundamentais da economia circular:
• Eliminar resíduos e poluição desde o design
• Manter produtos e materiais em uso pelo maior tempo possível
• Regenerar sistemas naturais
• Projetar para durabilidade, reparo e reciclagem
• Implementar sistemas de logística reversa eficientes

Benefícios para a indústria têxtil:
• Redução de custos com matéria-prima (até 30% de economia)
• Menor impacto ambiental e pegada de carbono
• Diferenciação competitiva no mercado
• Conformidade com regulamentações ambientais crescentes
• Fortalecimento da imagem da marca e da influência
• Acesso a novos mercados e consumidores conscientes
• Redução de riscos regulatórios e multas`,
  },
  {
    icon: Search,
    title: "Diagnóstico de Oportunidades",
    content: `O primeiro passo para implementar a economia circular é realizar um diagnóstico completo dos resíduos e oportunidades na sua operação.

Como realizar o diagnóstico:
• Mapeie todos os pontos de geração de resíduos (corte, tingimento, acabamento, estoque)
• Classifique cada resíduo: reciclável, reutilizável ou rejeito
• Quantifique volumes e custos de descarte
• Identifique oportunidades de reaproveitamento interno
• Avalie parcerias potenciais para destinação externa

Ferramentas de análise:
• Análise de Pareto (80/20) para priorizar ações
• Diagrama de Ishikawa para identificar causas raiz
• Mapeamento de fluxo de valor (VSM)
• Inventário de resíduos sólidos`,
  },
  {
    icon: Clipboard,
    title: "Planejamento Estratégico",
    content: `Um planejamento estratégico bem estruturado é essencial para o sucesso da implementação da economia circular.

Componentes do planejamento:
• Visão e missão sustentável
• Metas SMART (Específicas, Mensuráveis, Atingíveis, Relevantes, Temporais)
• Indicadores de desempenho (KPIs)
• Plano de ação detalhado
• Orçamento e recursos necessários
• Cronograma de implementação

Exemplos de metas:
• Reduzir resíduos em 30% em 12 meses
• Reaproveitar 75% dos retalhos de corte
• Lançar uma coleção 100% circular por ano
• Estabelecer 5 parcerias sustentáveis`,
  },
  {
    icon: Users,
    title: "Engajamento e Cultura Organizacional",
    content: `A transformação circular só acontece com o envolvimento de toda a equipe. É fundamental criar uma cultura organizacional que valorize a sustentabilidade.

Estratégias de engajamento:
• Treinamentos regulares sobre economia circular
• Programas de incentivo para ideias sustentáveis
• Comunicação interna sobre resultados alcançados
• Liderança pelo exemplo da gestão
• Grupos de trabalho multidisciplinares
• Celebração de conquistas e marcos

Cultura de inovação sustentável:
• Espaço para experimentação e erro
• Reconhecimento de contribuições individuais
• Integração da sustentabilidade nos valores da empresa`,
  },
  {
    icon: Cog,
    title: "Implementação de Ações Circulares",
    content: `A implementação prática envolve ações concretas em cada etapa da cadeia produtiva.

Ações no design:
• Design para desmontagem e reciclagem
• Uso de materiais mono-fibra quando possível
• Redução de aviamentos não recicláveis
• Modelagem com aproveitamento máximo de tecido

Ações na produção:
• Otimização do encaixe de moldes
• Separação de resíduos por tipo e cor na origem
• Reaproveitamento de retalhos em novos produtos
• Redução do consumo de água e energia

Ações pós-produção:
• Programas de devolução de peças usadas
• Reparos e customizações para extensão de vida útil
• Parcerias com cooperativas de reciclagem`,
  },
  {
    icon: BarChart3,
    title: "Monitoramento e Melhoria Contínua",
    content: `Medir e monitorar é essencial para garantir o progresso e identificar oportunidades de melhoria.

KPIs essenciais:
• % de resíduos reaproveitados vs. descartados
• Kg de resíduos por peça produzida
• Custo de desperdício mensal
• Consumo de água por unidade
• Economia gerada pelo reaproveitamento
• Redução de emissões de CO₂

Ferramentas de monitoramento:
• Dashboard de indicadores em tempo real
• Relatórios mensais de sustentabilidade
• Auditorias internas periódicas
• Benchmarking com empresas do setor`,
  },
  {
    icon: Truck,
    title: "Logística Reversa e Cadeias Responsáveis",
    content: `A logística reversa consiste em coletar produtos pós-consumo para reaproveitamento, criando um ciclo fechado de materiais.

Modelos de logística reversa:
• Pontos de coleta em lojas próprias
• Parcerias com brechós e ONGs
• Programas de troca (desconto em nova compra)
• Coleta domiciliar para grandes volumes
• Cooperativas de catadores e recicladores

Destinação responsável:
• Reciclagem mecânica de fibras
• Reciclagem química de tecidos mistos
• Doação para projetos sociais
• Compostagem de fibras naturais`,
  },
  {
    icon: Cpu,
    title: "Tecnologias e Materiais Circulares",
    content: `Novas tecnologias estão revolucionando a capacidade da indústria têxtil de ser circular.

Tecnologias emergentes:
• Reciclagem química de poliéster e algodão
• Blockchain para rastreabilidade de materiais
• IA para otimização de corte e redução de desperdício
• Impressão 3D têxtil sob demanda
• Tingimento sem água (DyeCoo, AirDye)

Materiais circulares:
• Fibras recicladas (rPET, algodão regenerado)
• Fibras de base biológica (Tencel, modal)
• Tecidos biodegradáveis
• Materiais de fontes renováveis
• Couro vegetal e alternativas sustentáveis`,
  },
  {
    icon: RefreshCw,
    title: "Modelos de Negócio Baseados em Reuso",
    content: `Novos modelos de negócio estão surgindo baseados nos princípios da economia circular.

Modelos circulares:
• Aluguel de roupas (fashion rental)
• Assinatura de guarda-roupa
• Revenda e segunda mão certificada
• Reparo e personalização como serviço
• Upcycling sob encomenda

Vantagens competitivas:
• Novas fontes de receita
• Fidelização de clientes conscientes
• Redução de custos com matéria-prima
• Diferenciação no mercado
• Fortalecimento da imagem de marca`,
  },
  {
    icon: Palette,
    title: "Design Regenerativo",
    content: `O design regenerativo vai além da sustentabilidade — busca criar produtos que contribuam positivamente para o meio ambiente.

Princípios do design regenerativo:
• Biomimética: inspiração na natureza
• Design cradle-to-cradle (berço ao berço)
• Materiais que melhoram com o tempo
• Sistemas que regeneram ecossistemas
• Produtos como nutrientes biológicos ou técnicos

Aplicações na moda:
• Tecidos que purificam o ar
• Tingimentos com corantes naturais regenerativos
• Embalagens compostáveis que nutrem o solo
• Coleções zero desperdício
• Moda regenerativa com fibras que sequestram carbono`,
  },
  {
    icon: Megaphone,
    title: "Comunicação Sustentável e Marketing Verde",
    content: `Comunicar práticas sustentáveis de forma autêntica é fundamental para engajar consumidores e fortalecer a marca.

Estratégias de comunicação:
• Transparência radical sobre processos produtivos
• Storytelling sobre a jornada circular dos produtos
• Rastreabilidade acessível ao consumidor (QR codes)
• Relatórios de impacto ambiental públicos
• Engajamento em redes sociais com conteúdo educativo

Evite greenwashing:
• Seja específico sobre suas práticas
• Use dados e certificações verificáveis
• Reconheça desafios e áreas de melhoria
• Não exagere benefícios ambientais
• Busque certificações reconhecidas`,
  },
  {
    icon: Sparkles,
    title: "Upcycling: Transformando Resíduos em Produtos de Valor",
    content: `O upcycling transforma resíduos têxteis em produtos de maior valor agregado, criando diferenciação e exclusividade.

Técnicas de upcycling:
• Patchwork com retalhos de diferentes coleções
• Bordados e aplicações em peças com defeito
• Acessórios a partir de sobras (bolsas, tiaras, scrunchies)
• Edições limitadas redesenhadas a partir de peças antigas
• Customização artesanal com técnicas manuais

Benefícios do upcycling:
• Redução de resíduos em aterros
• Produtos exclusivos com história
• Maior valor percebido pelo consumidor
• Engajamento com comunidades criativas
• Novas linhas de receita para a empresa`,
  },
  {
    icon: ShieldCheck,
    title: "Selos e Certificações de Sustentabilidade",
    content: `Certificações ambientais validam práticas sustentáveis e abrem portas para mercados exigentes.

Principais certificações:
• GOTS (Global Organic Textile Standard) — têxteis orgânicos
• OEKO-TEX Standard 100 — segurança de substâncias químicas
• Selo Eu Reciclo — logística reversa de embalagens
• Cradle to Cradle — design circular certificado
• B Corp — empresas com impacto positivo
• Fair Trade — comércio justo

Benefícios das certificações:
• Acesso a mercados internacionais
• Conformidade com legislação (PNRS)
• Credibilidade junto a consumidores
• Diferenciação competitiva
• Proteção legal e ambiental`,
  },
];

const GuidesSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="guias" className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-olive/10 text-olive px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Conteúdo Educacional
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Guia Completo de Economia Circular Têxtil
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Conteúdo baseado nas melhores práticas da indústria têxtil sustentável
          </p>
        </div>

        {/* Intro Card */}
        <Card className="glass-card p-6 rounded-2xl mb-8 border-primary/20">
          <p className="text-sm text-muted-foreground leading-relaxed text-center">
            Este guia foi desenvolvido para ajudar empresas da indústria têxtil e moda a implementar práticas de economia circular, reduzir resíduos, cortar custos e inovar com sustentabilidade. Explore cada seção para aprender conceitos, ferramentas e estratégias práticas.
          </p>
        </Card>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {GUIDE_SECTIONS.map((section, i) => {
            const Icon = section.icon;
            const isOpen = openIndex === i;
            return (
              <Card
                key={i}
                className={`rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md ${isOpen ? 'ring-2 ring-primary/30 shadow-lg' : 'glass-card'}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground flex-1 text-sm md:text-base">{section.title}</h4>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
                {isOpen && (
                  <div className="px-4 pb-5 pl-[68px]">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* CTA Card */}
        <Card className="glass-card p-6 md:p-8 rounded-2xl mt-8 border-primary/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Rocket className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold font-display text-foreground">Comece Sua Jornada Circular</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Agora que você conhece os conceitos fundamentais da economia circular na indústria têxtil, é hora de colocar em prática! Use as ferramentas disponíveis neste aplicativo para:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
            {[
              { icon: Calculator, text: "Calcular o potencial de reaproveitamento dos seus resíduos" },
              { icon: TrendingUp, text: "Identificar as principais fontes de desperdício com a Análise de Pareto" },
              { icon: Target, text: "Planejar e executar melhorias com o Ciclo PDCA" },
              { icon: Clipboard, text: "Criar seu planejamento estratégico de sustentabilidade" },
              { icon: Kanban, text: "Gerenciar projetos com o Quadro Kanban" },
              { icon: Shirt, text: "Desenvolver coleções sustentáveis a partir de resíduos" },
              { icon: Activity, text: "Monitorar seus indicadores de sustentabilidade" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <item.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default GuidesSection;
