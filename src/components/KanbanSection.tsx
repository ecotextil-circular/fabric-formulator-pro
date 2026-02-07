import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Columns3, Plus, Trash2, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";

interface KanbanTask {
  id: string;
  text: string;
  column: "todo" | "doing" | "done";
}

const createId = () => Math.random().toString(36).slice(2, 9);

const COLUMNS = [
  { key: "todo" as const, title: "📋 A Fazer", color: "border-t-accent" },
  { key: "doing" as const, title: "🔄 Fazendo", color: "border-t-primary" },
  { key: "done" as const, title: "✅ Feito", color: "border-t-olive" },
];

const KanbanSection = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) {
      toast.error("Digite uma tarefa.");
      return;
    }
    setTasks((prev) => [...prev, { id: createId(), text: newTask.trim(), column: "todo" }]);
    setNewTask("");
    toast.success("Tarefa adicionada!");
  };

  const moveTask = (id: string, to: "todo" | "doing" | "done") => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, column: to } : t)));
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const nextColumn = (col: "todo" | "doing" | "done") => {
    if (col === "todo") return "doing";
    if (col === "doing") return "done";
    return null;
  };

  return (
    <section id="kanban" className="py-16 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-olive/10 text-olive px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Columns3 className="w-4 h-4" />
            Gestão Visual
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Quadro Kanban
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            O Kanban é um método visual de gestão de tarefas que organiza o fluxo de trabalho em colunas. Ele ajuda a visualizar o progresso, identificar gargalos e manter a equipe alinhada.
          </p>
        </div>

        {/* Explanation Card */}
        <Card className="glass-card p-5 rounded-xl mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Como usar:</strong> Adicione tarefas relacionadas à sustentabilidade da sua produção. Mova-as entre as colunas conforme o progresso.</p>
              <p>• <strong>A Fazer:</strong> tarefas planejadas • <strong>Fazendo:</strong> em execução • <strong>Feito:</strong> concluídas</p>
            </div>
          </div>
        </Card>

        {/* Add Task */}
        <div className="flex gap-3 mb-8">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Ex: Separar resíduos de corte para reciclagem..."
            className="bg-card"
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg font-medium hover:brightness-110 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <Card key={col.key} className={`glass-card rounded-xl border-t-4 ${col.color} p-4 min-h-[200px]`}>
              <h4 className="font-semibold font-display text-foreground mb-4">{col.title}</h4>
              <div className="space-y-2">
                {tasks
                  .filter((t) => t.column === col.key)
                  .map((task) => (
                    <div key={task.id} className="bg-background rounded-lg p-3 flex items-center justify-between gap-2 shadow-sm border border-border/50">
                      <span className="text-sm text-foreground flex-1">{task.text}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {nextColumn(col.key) && (
                          <button onClick={() => moveTask(task.id, nextColumn(col.key)!)} className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors" title="Mover">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => removeTask(task.id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded transition-colors" title="Remover">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                {tasks.filter((t) => t.column === col.key).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">Nenhuma tarefa</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KanbanSection;
