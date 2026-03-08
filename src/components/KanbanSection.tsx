import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Columns3, Plus, Trash2, ArrowRight, Info, Save, Eraser, Eye, X, List } from "lucide-react";
import { toast } from "sonner";
import { useItensSalvos } from "@/hooks/useItensSalvos";
import { useAuth } from "@/contexts/AuthContext";

interface KanbanTask { id: string; text: string; column: "todo" | "doing" | "done"; }
const createId = () => Math.random().toString(36).slice(2, 9);

const COLUMNS = [
  { key: "todo" as const, title: "📋 A Fazer", color: "border-t-accent" },
  { key: "doing" as const, title: "🔄 Fazendo", color: "border-t-primary" },
  { key: "done" as const, title: "✅ Feito", color: "border-t-olive" },
];

const KanbanSection = () => {
  const { user } = useAuth();
  const { items: savedItems, saveItem, removeItem } = useItensSalvos("kanban");
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [columnInputs, setColumnInputs] = useState<Record<string, string>>({ todo: "", doing: "", done: "" });
  const [boardName, setBoardName] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const addTaskToColumn = (column: "todo" | "doing" | "done") => {
    const text = columnInputs[column]?.trim();
    if (!text) { toast.error("Digite uma tarefa."); return; }
    setTasks((prev) => [...prev, { id: createId(), text, column }]);
    setColumnInputs((prev) => ({ ...prev, [column]: "" }));
    toast.success("Tarefa adicionada!");
  };

  const moveTask = (id: string, to: "todo" | "doing" | "done") => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, column: to } : t)));
  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const nextColumn = (col: "todo" | "doing" | "done") => col === "todo" ? "doing" : col === "doing" ? "done" : null;

  const handleSave = async () => {
    if (!boardName.trim()) { toast.error("Dê um nome ao quadro."); return; }
    if (tasks.length === 0) { toast.error("Adicione pelo menos uma tarefa."); return; }
    const result = await saveItem(boardName, { tasks });
    if (result) { toast.success("Quadro Kanban salvo!"); handleClear(); }
  };

  const handleClear = () => {
    setBoardName(""); setTasks([]); setColumnInputs({ todo: "", doing: "", done: "" });
    toast.success("Campos limpos!");
  };

  return (
    <section id="kanban" className="py-16 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-olive/10 text-olive px-4 py-2 rounded-full text-sm font-medium mb-4"><Columns3 className="w-4 h-4" /> Gestão Visual</div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">Quadro Kanban</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">O Kanban organiza o fluxo de trabalho em colunas para visualizar o progresso e identificar gargalos.</p>
        </div>

        <Card className="glass-card p-5 rounded-xl mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Como usar:</strong> Digite tarefas diretamente em cada coluna e clique em "+" para adicionar.</p>
              <p>• <strong>A Fazer:</strong> planejadas • <strong>Fazendo:</strong> em execução • <strong>Feito:</strong> concluídas</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-3 mb-6">
          <Input value={boardName} onChange={(e) => setBoardName(e.target.value)} placeholder="Nome do quadro..." className="bg-card max-w-xs text-base" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {COLUMNS.map((col) => (
            <Card key={col.key} className={`glass-card rounded-xl border-t-4 ${col.color} p-4 min-h-[200px]`}>
              <h4 className="font-semibold font-display text-foreground mb-3 text-base">{col.title}</h4>
              
              {/* Input para adicionar tarefa diretamente na coluna */}
              <div className="flex gap-2 mb-3">
                <Input
                  value={columnInputs[col.key]}
                  onChange={(e) => setColumnInputs(prev => ({ ...prev, [col.key]: e.target.value }))}
                  placeholder="Digitar tarefa..."
                  className="bg-background text-sm"
                  onKeyDown={(e) => e.key === "Enter" && addTaskToColumn(col.key)}
                />
                <button onClick={() => addTaskToColumn(col.key)} className="p-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all shrink-0" title="Adicionar"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="space-y-2">
                {tasks.filter((t) => t.column === col.key).map((task) => (
                  <div key={task.id} className="bg-background rounded-lg p-3 flex items-center justify-between gap-2 shadow-sm border border-border/50">
                    <span className="text-sm text-foreground flex-1">{task.text}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {nextColumn(col.key) && <button onClick={() => moveTask(task.id, nextColumn(col.key)!)} className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors" title="Mover"><ArrowRight className="w-3.5 h-3.5" /></button>}
                      <button onClick={() => removeTask(task.id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded transition-colors" title="Remover"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {tasks.filter((t) => t.column === col.key).length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Nenhuma tarefa</p>}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Save className="w-4 h-4" /> Salvar Quadro</button>
          <button onClick={handleClear} className="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Eraser className="w-4 h-4" /> Limpar Campo</button>
        </div>

        {user && (
          <Card className="glass-card p-6 rounded-2xl mt-6">
            <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-2 text-base font-semibold text-foreground mb-4"><List className="w-4 h-4" /> Quadros Salvos ({savedItems.length})</button>
            {showSaved && (
              <div className="space-y-3">
                {savedItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 cursor-pointer hover:shadow-md" onClick={() => setViewingItem(item)}>
                    <div>
                      <p className="font-medium text-base text-foreground">{item.titulo}</p>
                      <p className="text-sm text-muted-foreground">{item.dados?.tasks?.length || 0} tarefas • {new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setViewingItem(item); }} className="p-1.5 text-primary hover:bg-primary/10 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={async (e) => { e.stopPropagation(); const ok = await removeItem(item.id); if (ok) toast.success("Quadro deletado!"); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {savedItems.length === 0 && <p className="text-sm text-muted-foreground">Nenhum quadro salvo ainda.</p>}
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
            <h3 className="text-xl font-bold font-display text-foreground mb-4">{viewingItem.titulo}</h3>
            {COLUMNS.map(col => {
              const colTasks = viewingItem.dados?.tasks?.filter((t: any) => t.column === col.key) || [];
              return colTasks.length > 0 && (
                <div key={col.key} className="mb-4">
                  <p className="font-semibold text-foreground text-base mb-2">{col.title}</p>
                  {colTasks.map((t: any, i: number) => <p key={i} className="text-sm text-muted-foreground ml-2">• {t.text}</p>)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default KanbanSection;
