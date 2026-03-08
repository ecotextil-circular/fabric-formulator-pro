import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Save, FolderOpen, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useItensSalvos } from "@/hooks/useItensSalvos";
import { toast } from "sonner";

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
  const { items: savedItems, saveItem, removeItem, loading } = useItensSalvos("checklist");
  const [viewItem, setViewItem] = useState<any>(null);

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const totalItems = CHECKLIST_ITEMS.reduce((a, c) => a + c.items.length, 0);
  const progress = Math.round((checked.size / totalItems) * 100);

  const handleSave = async () => {
    if (checked.size === 0) {
      toast.warning("Marque pelo menos um item antes de salvar.");
      return;
    }
    const titulo = `Checklist ${progress}% — ${new Date().toLocaleDateString("pt-BR")}`;
    const dados = { checkedItems: Array.from(checked), progress };
    const result = await saveItem(titulo, dados);
    if (result) {
      toast.success("Checklist salvo com sucesso!");
    }
  };

  const handleLoad = (dados: any) => {
    if (dados?.checkedItems) {
      setChecked(new Set(dados.checkedItems));
      toast.success("Checklist carregado!");
    }
  };

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

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="editor" className="flex-1 gap-2">
              <ClipboardCheck className="w-4 h-4" /> Checklist
            </TabsTrigger>
            <TabsTrigger value="salvos" className="flex-1 gap-2">
              <FolderOpen className="w-4 h-4" /> Salvos ({savedItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            {/* Progress */}
            <div className="mb-6">
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

            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave} className="flex-1 gap-2">
                <Save className="w-4 h-4" /> Salvar Checklist
              </Button>
              <Button variant="outline" onClick={() => setChecked(new Set())} className="gap-2">
                Limpar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="salvos">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando...</p>
            ) : savedItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum checklist salvo ainda.</p>
            ) : (
              <div className="grid gap-4">
                {savedItems.map((item: any) => {
                  const dados = item.dados || {};
                  return (
                    <Card key={item.id} className="glass-card p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-sm">{item.titulo}</h4>
                          <p className="text-xs text-muted-foreground">
                            {dados.checkedItems?.length || 0} itens marcados — {dados.progress || 0}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setViewItem(item)} className="gap-1">
                            <Eye className="w-3 h-3" /> Ver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleLoad(dados)} className="gap-1">
                            <FolderOpen className="w-3 h-3" /> Carregar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={async () => {
                            const ok = await removeItem(item.id);
                            if (ok) toast.success("Removido!");
                          }} className="gap-1">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de visualização */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewItem?.titulo}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {CHECKLIST_ITEMS.map((group) => {
              const checkedItems = new Set(viewItem?.dados?.checkedItems || []);
              const groupChecked = group.items.filter(i => checkedItems.has(i));
              if (groupChecked.length === 0) return null;
              return (
                <div key={group.category}>
                  <h4 className="font-semibold text-foreground text-sm mb-2">{group.category}</h4>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        {checkedItems.has(item) ? (
                          <span className="text-primary">✓</span>
                        ) : (
                          <span className="text-muted-foreground">○</span>
                        )}
                        <span className={checkedItems.has(item) ? "text-foreground" : "text-muted-foreground"}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ChecklistSection;
