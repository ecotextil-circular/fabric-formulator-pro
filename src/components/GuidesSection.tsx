import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, ChevronDown, ChevronUp, Leaf, Factory, Truck, Users, BarChart3, Lightbulb, Globe, ShieldCheck } from "lucide-react";

const GUIDES = [
  {
    icon: Leaf,
    title: "Economia Circular na Indústria Têxtil",
    content: "A economia circular é um modelo que elimina a ideia de 'resíduo'. No setor têxtil, isso significa redesenhar processos para que materiais circulem continuamente: tecidos são reaproveitados, retalhos viram novos produtos, e peças antigas são recicladas em fibras para novas coleções. O objetivo é fechar o ciclo de vida dos materiais, reduzindo o impacto ambiental e gerando valor econômico.",
  },
  {
    icon: Factory,
    title: "Diagnóstico de Resíduos na Produção",
    content: "O primeiro passo é mapear todos os pontos de geração de resíduos na cadeia produtiva: corte (retalhos), tingimento (efluentes), estoque (peças paradas), e acabamento (aparas). Classifique cada resíduo em reciclável, reutilizável ou rejeito. Esse mapeamento permite identificar oportunidades de redução e reaproveitamento, além de criar uma base para medir o progresso.",
  },
  {
    icon: Lightbulb,
    title: "Upcycling e Criação de Valor",
    content: "O upcycling transforma resíduos têxteis em produtos de maior valor agregado. Retalhos de tecido podem virar acessórios como bolsas, tiaras, scrunchies e patchwork. Peças com defeito podem ser redesenhadas em edições limitadas. O upcycling não apenas reduz o desperdício, mas cria diferenciação de marca e produtos exclusivos que encantam consumidores conscientes.",
  },
  {
    icon: Truck,
    title: "Logística Reversa",
    content: "A logística reversa consiste em coletar produtos pós-consumo para reaproveitamento. Na moda, isso inclui programas de devolução de roupas usadas, parcerias com brechós e cooperativas. As peças coletadas podem ser recicladas em fibras, doadas ou transformadas em novos produtos. Além de sustentável, isso fortalece o relacionamento com o cliente e a imagem da marca.",
  },
  {
    icon: Users,
    title: "Parcerias e Impacto Social",
    content: "Formar parcerias com cooperativas de reciclagem, projetos sociais e comunidades locais amplia o impacto positivo. Retalhos podem ser doados para artesãos, oficinas de costura comunitárias ou projetos de capacitação. Essas parcerias geram renda, reduzem o volume de resíduos em aterros e fortalecem a responsabilidade social da empresa.",
  },
  {
    icon: BarChart3,
    title: "Indicadores de Sustentabilidade",
    content: "Para gerenciar a sustentabilidade, é essencial medir. Indicadores como: % de resíduos reaproveitados, kg de resíduos por peça produzida, consumo de água por unidade, e custo de desperdício mensal permitem acompanhar o progresso, identificar tendências e tomar decisões baseadas em dados. Revise esses indicadores mensalmente.",
  },
  {
    icon: Globe,
    title: "Moda Sustentável e Tendências",
    content: "O consumidor moderno valoriza transparência e sustentabilidade. Tendências como moda slow, tecidos orgânicos, tingimento natural e zero waste design estão em alta. Comunicar suas práticas sustentáveis (selo verde, rastreabilidade, história do produto) agrega valor à marca e conquista um mercado em crescimento.",
  },
  {
    icon: ShieldCheck,
    title: "Legislação e Certificações",
    content: "Conheça as regulamentações ambientais do setor têxtil: Política Nacional de Resíduos Sólidos (PNRS), normas de efluentes, e certificações como GOTS (Global Organic Textile Standard), OEKO-TEX e selo Eu Reciclo. Estar em conformidade protege a empresa legalmente e abre portas para mercados que exigem certificação ambiental.",
  },
];

const GuidesSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="guias" className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-olive/10 text-olive px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Conhecimento
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Guias de Economia Circular
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explicações detalhadas sobre cada pilar da economia circular na indústria têxtil, baseadas nos ebooks.
          </p>
        </div>

        <div className="space-y-3">
          {GUIDES.map((guide, i) => {
            const Icon = guide.icon;
            const isOpen = openIndex === i;
            return (
              <Card
                key={i}
                className="glass-card rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground flex-1 text-sm md:text-base">{guide.title}</h4>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
                {isOpen && (
                  <div className="px-4 pb-4 pl-[68px]">
                    <p className="text-sm text-muted-foreground leading-relaxed">{guide.content}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;
