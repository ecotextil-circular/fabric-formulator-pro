import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus, Trash2, CheckCircle2, Save, Loader2, List, Eye, X, Eraser } from "lucide-react";
import SectionBanner, { SECTION_BANNERS } from "@/components/SectionBanner";
import { toast } from "sonner";
import { useSupabaseCrud } from "@/hooks/useSupabaseCrud";
import { useAuth } from "@/contexts/AuthContext";

interface ActionItem { id: string; action: string; responsible: string; deadline: string; priority: string; done: boolean; }
const createId = () => Math.random().toString(36).slice(2, 9);

const ActionPlanSection = () => {
  const { user } = useAuth();
  const { items: savedPlanos, loading: planosLoading, insertItem, deleteItem } = useSupabaseCrud<any>("planos_acao");
  const [planName, setPlanName] = useState("");
  const [items, setItems] = useState<ActionItem[]>([{ id: createId(), action: "", responsible: "", deadline: "", priority: "media", done: false }]);
  const [showSaved, setShowSaved] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const addItem = () => setItems((prev) => [...prev, { id: createId(), action: "", responsible: "", deadline: "", priority: "media", done: false }]);
  const removeItemLocal = (id: string) => setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  const updateItem = (id: string, field: keyof ActionItem, value: string | boolean) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const progress = items.length > 0 ? Math.round((items.filter((i) => i.done).length / items.length) * 100) : 0;

  const handleSave = async () => {
    if (!planName) { toast.error("Dê um nome ao seu plano de ação."); return; }
    const result = await insertItem({ titulo: planName, dados: { items, progress } });
    if (result) { toast.success("Plano de ação salvo!"); handleClear(); }
  };

  const handleClear = () => {
    setPlanName("");
    setItems([{ id: createId(), action: "", responsible: "", deadline: "", priority: "media", done: false }]);
    toast.success("Campos limpos!");
  };

  const priorityLabel = (p: string) => p === "alta" ? "🔴 Alta" : p === "media" ? "🟡 Média" : "🟢 Baixa";

  return (
    <section id="plano-acao" className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-olive/10 text-olive px-4 py-2 rounded-full text-sm font-medium mb-4"><Target className="w-4 h-4" /> Planejamento</div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">Plano de Ação Personalizado</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">Crie seu plano de ação com responsáveis, prazos e prioridades.</p>
        </div>

        <Card className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2"><Label className="text-base">Nome do Plano *</Label><Input value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="Ex: Plano de Sustentabilidade 2025" className="bg-background text-base" /></div>
            <div className="w-full md:w-48">
              <Label className="mb-2 block text-base">Progresso</Label>
              <div className="flex items-center gap-2"><div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div><span className="text-sm font-medium text-foreground">{progress}%</span></div>
            </div>
          </div>

          {items.map((item, idx) => (
            <Card key={item.id} className="bg-background/50 p-4 rounded-xl space-y-3 border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Ação {idx + 1}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => updateItem(item.id, "done", !item.done)} className={`p-1.5 rounded transition-colors ${item.done ? "text-primary" : "text-muted-foreground hover:text-primary"}`}><CheckCircle2 className="w-4 h-4" /></button>
                  {items.length > 1 && <button type="button" onClick={() => removeItemLocal(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input value={item.action} onChange={(e) => updateItem(item.id, "action", e.target.value)} placeholder="Descreva a ação" className={`bg-background text-base ${item.done ? "line-through text-muted-foreground" : ""}`} />
                <Input value={item.responsible} onChange={(e) => updateItem(item.id, "responsible", e.target.value)} placeholder="Responsável" className="bg-background text-base" />
                <Input type="date" value={item.deadline} onChange={(e) => updateItem(item.id, "deadline", e.target.value)} className="bg-background text-base" />
                <Select value={item.priority} onValueChange={(v) => updateItem(item.id, "priority", v)}>
                  <SelectTrigger className="bg-background text-base"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="alta">🔴 Alta</SelectItem><SelectItem value="media">🟡 Média</SelectItem><SelectItem value="baixa">🟢 Baixa</SelectItem></SelectContent>
                </Select>
              </div>
            </Card>
          ))}

          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-teal-light transition-colors"><Plus className="w-4 h-4" /> Adicionar Ação</button>

          <div className="flex gap-3 flex-wrap">
            <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Save className="w-4 h-4" /> Salvar Plano</button>
            <button onClick={handleClear} className="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Eraser className="w-4 h-4" /> Limpar Campo</button>
          </div>
        </Card>

        {user && (
          <Card className="glass-card p-6 rounded-2xl mt-6">
            <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-2 text-base font-semibold text-foreground mb-4"><List className="w-4 h-4" /> Planos Salvos ({savedPlanos.length})</button>
            {showSaved && (
              <div className="space-y-3">
                {planosLoading && <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Carregando...</div>}
                {savedPlanos.map((plano: any) => (
                  <div key={plano.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 cursor-pointer hover:shadow-md" onClick={() => setViewingItem(plano)}>
                    <div>
                      <p className="font-medium text-base text-foreground">{plano.titulo}</p>
                      <p className="text-sm text-muted-foreground">{plano.dados?.items?.length || 0} ações • {plano.dados?.progress || 0}% • {new Date(plano.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setViewingItem(plano); }} className="p-1.5 text-primary hover:bg-primary/10 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={async (e) => { e.stopPropagation(); const ok = await deleteItem(plano.id); if (ok) toast.success("Plano deletado!"); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {!planosLoading && savedPlanos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum plano salvo ainda.</p>}
              </div>
            )}
          </Card>
        )}
      </div>

      {viewingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setViewingItem(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-card max-w-lg w-full max-h-[80vh] overflow-auto rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewingItem(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={24} /></button>
            <h3 className="text-xl font-bold font-display text-foreground mb-2">{viewingItem.titulo}</h3>
            <p className="text-sm text-muted-foreground mb-4">Progresso: {viewingItem.dados?.progress || 0}%</p>
            {viewingItem.dados?.items?.map((item: any, i: number) => (
              <div key={i} className="mb-3 p-3 rounded-lg bg-background/50 border border-border/30">
                <p className={`text-base font-medium ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.action || 'Sem descrição'}</p>
                <div className="flex gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                  {item.responsible && <span>👤 {item.responsible}</span>}
                  {item.deadline && <span>📅 {item.deadline}</span>}
                  <span>{priorityLabel(item.priority)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ActionPlanSection;
