import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";

const CHECKLIST_ITEMS = [
  { category: "🔍 Diagnóstico", items: [
    "Identifiquei os principais pontos de desperdício (corte, tingimento, estoque)?",
    "Classifiquei os resíduos: recicláveis, reutilizáveis ou rejeitos?",
    "Mapeei o fluxo de produção da matéria-prima ao cliente final?",
    "Listei materiais que podem ser reaproveitados internamente?",
  ]},
  { category: "🎯 Planejamento", items: [
    "Estabeleci metas claras de redução de resíduos com prazos?",
    "Criei indicadores de desempenho (% de reaproveitamento)?",
    "Apliquei análise SWOT para identificar forças e fraquezas?",
  ]},
  { category: "♻️ Ações Circulares", items: [
    "Implementei logística reversa (coleta de roupas antigas)?",
    "Desenvolvi produtos com upcycling (acessórios, peças exclusivas)?",
    "Firmei parcerias com cooperativas ou projetos sociais?",
  ]},
  { category: "📊 Monitoramento", items: [
    "Estou medindo o volume de resíduos reaproveitados mensalmente?",
    "Apliquei algum sistema de gestão (PDCA, Canvas Circular)?",
    "Agendei revisões periódicas para adaptar e melhorar processos?",
  ]},
];

const ChecklistSection = () => {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const totalItems = CHECKLIST_ITEMS.reduce((a, c) => a + c.items.length, 0);
  const progress = Math.round((checked.size / totalItems) * 100);

  return (
    <section id="checklist" className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-olive/10 text-olive px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ClipboardCheck className="w-4 h-4" />
            Economia Circular
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Checklist de Sustentabilidade
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acompanhe suas ações de economia circular com base no ebook prático.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-foreground mb-2">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid gap-6">
          {CHECKLIST_ITEMS.map((group) => (
            <Card key={group.category} className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold font-display text-foreground mb-4">{group.category}</h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <label key={item} className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      checked={checked.has(item)}
                      onCheckedChange={() => toggle(item)}
                      className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className={`text-sm transition-colors ${checked.has(item) ? "text-muted-foreground line-through" : "text-foreground group-hover:text-primary"}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChecklistSection;
