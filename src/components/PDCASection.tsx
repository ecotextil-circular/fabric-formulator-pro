import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus, Trash2, ChevronDown, ChevronUp, Save, Eraser, Eye, X, List } from "lucide-react";
import SectionBanner, { SECTION_BANNERS } from "@/components/SectionBanner";
import { toast } from "sonner";
import { useItensSalvos } from "@/hooks/useItensSalvos";
import { useAuth } from "@/contexts/AuthContext";

const PDCA_INFO = [
  { letter: "P", title: "Plan (Planejar)", color: "bg-primary", description: "Identifique o problema, analise as causas e defina metas. No contexto têxtil, planeje a redução de desperdícios, mapeie os resíduos gerados e estabeleça metas de reaproveitamento.", examples: ["Reduzir 20% dos resíduos de corte", "Mapear fornecedores de matéria-prima reciclada", "Definir indicadores de sustentabilidade"] },
  { letter: "D", title: "Do (Executar)", color: "bg-olive", description: "Coloque o plano em prática. Execute as ações definidas, capacite sua equipe e implemente as mudanças nos processos produtivos.", examples: ["Treinar equipe sobre corte otimizado", "Implementar coleta seletiva na fábrica", "Iniciar parcerias com cooperativas"] },
  { letter: "C", title: "Check (Verificar)", color: "bg-teal", description: "Monitore os resultados. Compare o desempenho atual com as metas definidas, identifique desvios e analise o que funcionou ou não.", examples: ["Medir kg de resíduos reaproveitados", "Comparar custos antes e depois", "Analisar feedback da equipe"] },
  { letter: "A", title: "Act (Agir)", color: "bg-accent", description: "Corrija e padronize. Se as metas foram atingidas, padronize as práticas. Se não, identifique as falhas e reinicie o ciclo com ajustes.", examples: ["Padronizar processo de reaproveitamento", "Ajustar metas para próximo ciclo", "Documentar lições aprendidas"] },
];

interface PDCAItem { id: string; text: string; }
const createId = () => Math.random().toString(36).slice(2, 9);

const PDCASection = () => {
  const { user } = useAuth();
  const { items: savedItems, loading, saveItem, removeItem } = useItensSalvos("pdca");
  const [expanded, setExpanded] = useState<string | null>("P");
  const [plan, setPlan] = useState<PDCAItem[]>([{ id: createId(), text: "" }]);
  const [doItems, setDoItems] = useState<PDCAItem[]>([{ id: createId(), text: "" }]);
  const [check, setCheck] = useState<PDCAItem[]>([{ id: createId(), text: "" }]);
  const [act, setAct] = useState<PDCAItem[]>([{ id: createId(), text: "" }]);
  const [projectName, setProjectName] = useState("");
  const [objective, setObjective] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const sections = [
    { key: "P", label: "Plan — O que planejar?", items: plan, setter: setPlan },
    { key: "D", label: "Do — O que executar?", items: doItems, setter: setDoItems },
    { key: "C", label: "Check — O que verificar?", items: check, setter: setCheck },
    { key: "A", label: "Act — O que corrigir?", items: act, setter: setAct },
  ];

  const addItem = (setter: React.Dispatch<React.SetStateAction<PDCAItem[]>>) => setter((prev) => [...prev, { id: createId(), text: "" }]);
  const removeItemLocal = (setter: React.Dispatch<React.SetStateAction<PDCAItem[]>>, id: string) => setter((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  const updateItem = (setter: React.Dispatch<React.SetStateAction<PDCAItem[]>>, id: string, text: string) => setter((prev) => prev.map((i) => (i.id === id ? { ...i, text } : i)));

  const handleSave = async () => {
    if (!projectName) { toast.error("Dê um nome ao seu projeto PDCA."); return; }
    const result = await saveItem(projectName, { objective, plan, doItems, check, act });
    if (result) {
      toast.success("Ciclo PDCA salvo com sucesso!");
      handleClear();
    }
  };

  const handleClear = () => {
    setProjectName(""); setObjective("");
    setPlan([{ id: createId(), text: "" }]); setDoItems([{ id: createId(), text: "" }]);
    setCheck([{ id: createId(), text: "" }]); setAct([{ id: createId(), text: "" }]);
    toast.success("Campos limpos!");
  };

  return (
    <section id="pdca" className="py-16 px-4 section-gradient">
      <div className="max-w-4xl mx-auto">
        <SectionBanner {...SECTION_BANNERS.pdca} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {PDCA_INFO.map((item) => (
            <Card key={item.letter} className="glass-card rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md" onClick={() => setExpanded(expanded === item.letter ? null : item.letter)}>
              <div className="flex items-center gap-3 p-4">
                <div className={`w-10 h-10 min-w-[40px] rounded-lg ${item.color} flex items-center justify-center text-primary-foreground font-bold text-lg font-display`}>{item.letter}</div>
                <div className="flex-1 min-w-0"><h4 className="font-semibold text-foreground font-display text-base">{item.title}</h4></div>
                {expanded === item.letter ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
              {expanded === item.letter && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">Exemplos:</p>
                    {item.examples.map((ex, i) => <p key={i} className="text-xs text-muted-foreground">• {ex}</p>)}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
          <h3 className="text-xl font-semibold font-display text-foreground flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" /> Monte seu PDCA Personalizado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="text-base">Nome do Projeto *</Label><Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Ex: Redução de resíduos de corte" className="bg-background text-base" /></div>
            <div className="space-y-2"><Label className="text-base">Objetivo</Label><Input value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Ex: Reduzir 30% dos resíduos até dezembro" className="bg-background text-base" /></div>
          </div>
          {sections.map((sec) => (
            <div key={sec.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-base">{sec.label}</Label>
                <button type="button" onClick={() => addItem(sec.setter)} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-teal-light transition-colors"><Plus className="w-3.5 h-3.5" /> Adicionar</button>
              </div>
              {sec.items.map((item) => (
                <div key={item.id} className="flex gap-2">
                  <Input value={item.text} onChange={(e) => updateItem(sec.setter, item.id, e.target.value)} placeholder="Descreva a ação..." className="bg-background text-base" />
                  {sec.items.length > 1 && <button type="button" onClick={() => removeItemLocal(sec.setter, item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
            </div>
          ))}
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Save className="w-4 h-4" /> Salvar PDCA</button>
            <button onClick={handleClear} className="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Eraser className="w-4 h-4" /> Limpar Campo</button>
          </div>
        </Card>

        {/* Saved Items */}
        {user && (
          <Card className="glass-card p-6 rounded-2xl mt-6">
            <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-2 text-base font-semibold text-foreground mb-4">
              <List className="w-4 h-4" /> PDCAs Salvos ({savedItems.length})
            </button>
            {showSaved && (
              <div className="space-y-3">
                {savedItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 cursor-pointer hover:shadow-md transition-all" onClick={() => setViewingItem(item)}>
                    <div>
                      <p className="font-medium text-base text-foreground">{item.titulo}</p>
                      <p className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setViewingItem(item); }} className="p-1.5 text-primary hover:bg-primary/10 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={async (e) => { e.stopPropagation(); const ok = await removeItem(item.id); if (ok) toast.success("PDCA deletado!"); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {savedItems.length === 0 && <p className="text-sm text-muted-foreground">Nenhum PDCA salvo ainda.</p>}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setViewingItem(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-card max-w-lg w-full max-h-[80vh] overflow-auto rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewingItem(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={24} /></button>
            <h3 className="text-xl font-bold font-display text-foreground mb-4">{viewingItem.titulo}</h3>
            {viewingItem.dados?.objective && <p className="text-base text-muted-foreground mb-4">Objetivo: {viewingItem.dados.objective}</p>}
            {[{ k: 'plan', l: 'Plan (Planejar)' }, { k: 'doItems', l: 'Do (Executar)' }, { k: 'check', l: 'Check (Verificar)' }, { k: 'act', l: 'Act (Agir)' }].map(({ k, l }) => (
              viewingItem.dados?.[k]?.length > 0 && (
                <div key={k} className="mb-3">
                  <p className="font-semibold text-foreground text-base mb-1">{l}</p>
                  {viewingItem.dados[k].map((item: any, i: number) => item.text && <p key={i} className="text-sm text-muted-foreground">• {item.text}</p>)}
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PDCASection;
