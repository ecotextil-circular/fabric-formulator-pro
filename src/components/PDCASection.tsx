import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const PDCA_INFO = [
  {
    letter: "P",
    title: "Plan (Planejar)",
    color: "bg-primary",
    description: "Identifique o problema, analise as causas e defina metas. No contexto têxtil, planeje a redução de desperdícios, mapeie os resíduos gerados e estabeleça metas de reaproveitamento.",
    examples: ["Reduzir 20% dos resíduos de corte", "Mapear fornecedores de matéria-prima reciclada", "Definir indicadores de sustentabilidade"],
  },
  {
    letter: "D",
    title: "Do (Executar)",
    color: "bg-olive",
    description: "Coloque o plano em prática. Execute as ações definidas, capacite sua equipe e implemente as mudanças nos processos produtivos.",
    examples: ["Treinar equipe sobre corte otimizado", "Implementar coleta seletiva na fábrica", "Iniciar parcerias com cooperativas"],
  },
  {
    letter: "C",
    title: "Check (Verificar)",
    color: "bg-teal",
    description: "Monitore os resultados. Compare o desempenho atual com as metas definidas, identifique desvios e analise o que funcionou ou não.",
    examples: ["Medir kg de resíduos reaproveitados", "Comparar custos antes e depois", "Analisar feedback da equipe"],
  },
  {
    letter: "A",
    title: "Act (Agir)",
    color: "bg-accent",
    description: "Corrija e padronize. Se as metas foram atingidas, padronize as práticas. Se não, identifique as falhas e reinicie o ciclo com ajustes.",
    examples: ["Padronizar processo de reaproveitamento", "Ajustar metas para próximo ciclo", "Documentar lições aprendidas"],
  },
];

interface PDCAItem {
  id: string;
  text: string;
}

const createId = () => Math.random().toString(36).slice(2, 9);

const PDCASection = () => {
  const [expanded, setExpanded] = useState<string | null>("P");
  const [plan, setPlan] = useState<PDCAItem[]>([{ id: createId(), text: "" }]);
  const [doItems, setDoItems] = useState<PDCAItem[]>([{ id: createId(), text: "" }]);
  const [check, setCheck] = useState<PDCAItem[]>([{ id: createId(), text: "" }]);
  const [act, setAct] = useState<PDCAItem[]>([{ id: createId(), text: "" }]);
  const [projectName, setProjectName] = useState("");
  const [objective, setObjective] = useState("");

  const sections = [
    { key: "P", label: "Plan — O que planejar?", items: plan, setter: setPlan },
    { key: "D", label: "Do — O que executar?", items: doItems, setter: setDoItems },
    { key: "C", label: "Check — O que verificar?", items: check, setter: setCheck },
    { key: "A", label: "Act — O que corrigir?", items: act, setter: setAct },
  ];

  const addItem = (setter: React.Dispatch<React.SetStateAction<PDCAItem[]>>) => {
    setter((prev) => [...prev, { id: createId(), text: "" }]);
  };

  const removeItem = (setter: React.Dispatch<React.SetStateAction<PDCAItem[]>>, id: string) => {
    setter((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  };

  const updateItem = (setter: React.Dispatch<React.SetStateAction<PDCAItem[]>>, id: string, text: string) => {
    setter((prev) => prev.map((i) => (i.id === id ? { ...i, text } : i)));
  };

  const handleSave = () => {
    if (!projectName) {
      toast.error("Dê um nome ao seu projeto PDCA.");
      return;
    }
    toast.success("Ciclo PDCA salvo com sucesso!");
  };

  return (
    <section id="pdca" className="py-16 px-4 section-gradient">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <RefreshCw className="w-4 h-4" />
            Melhoria Contínua
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Ciclo PDCA
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            O PDCA é uma ferramenta de gestão usada para promover a melhoria contínua dos processos. No setor têxtil, ele ajuda a reduzir desperdícios, otimizar a produção e implementar práticas sustentáveis de forma organizada.
          </p>
        </div>

        {/* Legend / Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {PDCA_INFO.map((item) => (
            <Card
              key={item.letter}
              className="glass-card rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md"
              onClick={() => setExpanded(expanded === item.letter ? null : item.letter)}
            >
              <div className="flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-primary-foreground font-bold text-lg font-display`}>
                  {item.letter}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground font-display">{item.title}</h4>
                </div>
                {expanded === item.letter ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              {expanded === item.letter && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">Exemplos:</p>
                    {item.examples.map((ex, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {ex}</p>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* PDCA Form */}
        <Card className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
          <h3 className="text-xl font-semibold font-display text-foreground flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            Monte seu PDCA Personalizado
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Projeto *</Label>
              <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Ex: Redução de resíduos de corte" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Objetivo</Label>
              <Input value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Ex: Reduzir 30% dos resíduos até dezembro" className="bg-background" />
            </div>
          </div>

          {sections.map((sec) => (
            <div key={sec.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">{sec.label}</Label>
                <button type="button" onClick={() => addItem(sec.setter)} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-teal-light transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>
              {sec.items.map((item) => (
                <div key={item.id} className="flex gap-2">
                  <Input value={item.text} onChange={(e) => updateItem(sec.setter, item.id, e.target.value)} placeholder="Descreva a ação..." className="bg-background" />
                  {sec.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(sec.setter, item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}

          <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all">
            Salvar Ciclo PDCA
          </button>
        </Card>
      </div>
    </section>
  );
};

export default PDCASection;
