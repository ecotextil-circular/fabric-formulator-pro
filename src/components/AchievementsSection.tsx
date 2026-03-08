import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Lock, CheckCircle2, Star, Leaf, Recycle, Award, Zap, Heart, Globe, Save, FolderOpen, Trash2, Eye } from "lucide-react";
import SectionBanner, { SECTION_BANNERS } from "@/components/SectionBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useItensSalvos } from "@/hooks/useItensSalvos";
import { toast } from "sonner";

interface Achievement {
  icon: React.ElementType;
  title: string;
  description: string;
  unlocked: boolean;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { icon: Leaf, title: "Primeiro Passo Verde", description: "Completou o checklist de diagnóstico", unlocked: false },
  { icon: Recycle, title: "Mestre da Reciclagem", description: "Calculou seus resíduos na calculadora", unlocked: false },
  { icon: Star, title: "Planejador Circular", description: "Criou seu primeiro ciclo PDCA", unlocked: false },
  { icon: Zap, title: "Produção Eficiente", description: "Reduziu mais de 20% de resíduos", unlocked: false },
  { icon: Award, title: "Ficha Técnica Pro", description: "Salvou uma ficha técnica completa", unlocked: false },
  { icon: Heart, title: "Impacto Social", description: "Planejou parceria com cooperativa", unlocked: false },
  { icon: Globe, title: "Visão Global", description: "Explorou todos os guias educativos", unlocked: false },
  { icon: Trophy, title: "Circularidade Total", description: "Completou todas as conquistas", unlocked: false },
];

const ICON_MAP: Record<string, React.ElementType> = {
  "Primeiro Passo Verde": Leaf,
  "Mestre da Reciclagem": Recycle,
  "Planejador Circular": Star,
  "Produção Eficiente": Zap,
  "Ficha Técnica Pro": Award,
  "Impacto Social": Heart,
  "Visão Global": Globe,
  "Circularidade Total": Trophy,
};

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const { items: savedItems, saveItem, removeItem, loading } = useItensSalvos("conquistas");
  const [viewItem, setViewItem] = useState<any>(null);

  const toggleAchievement = (index: number) => {
    setAchievements((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], unlocked: !next[index].unlocked };
      return next;
    });
  };

  const unlocked = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;
  const progress = Math.round((unlocked / total) * 100);

  const handleSave = async () => {
    if (unlocked === 0) {
      toast.warning("Desbloqueie pelo menos uma conquista antes de salvar.");
      return;
    }
    const titulo = `${unlocked}/${total} conquistas — ${new Date().toLocaleDateString("pt-BR")}`;
    const dados = {
      achievements: achievements.map(a => ({ title: a.title, description: a.description, unlocked: a.unlocked })),
      progress,
    };
    const result = await saveItem(titulo, dados);
    if (result) toast.success("Conquistas salvas!");
  };

  const handleLoad = (dados: any) => {
    if (dados?.achievements) {
      setAchievements(INITIAL_ACHIEVEMENTS.map((a) => {
        const saved = dados.achievements.find((s: any) => s.title === a.title);
        return saved ? { ...a, unlocked: saved.unlocked } : a;
      }));
      toast.success("Conquistas carregadas!");
    }
  };

  return (
    <section id="conquistas" className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/30 text-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Gamificação
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Conquistas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desbloqueie conquistas conforme avança na implementação da economia circular.
          </p>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="editor" className="flex-1 gap-2">
              <Trophy className="w-4 h-4" /> Conquistas
            </TabsTrigger>
            <TabsTrigger value="salvos" className="flex-1 gap-2">
              <FolderOpen className="w-4 h-4" /> Salvos ({savedItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium text-foreground mb-2">
                <span>{unlocked} de {total} conquistas</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach, i) => {
                const Icon = ach.icon;
                return (
                  <Card
                    key={i}
                    className={`glass-card p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${ach.unlocked ? "border-primary/40 bg-primary/5" : "opacity-75"}`}
                    onClick={() => toggleAchievement(i)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ach.unlocked ? "bg-primary/20" : "bg-muted"}`}>
                        {ach.unlocked ? (
                          <Icon className="w-5 h-5 text-primary" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${ach.unlocked ? "text-foreground" : "text-muted-foreground"}`}>{ach.title}</h4>
                        <p className="text-xs text-muted-foreground">{ach.description}</p>
                      </div>
                      {ach.unlocked && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave} className="flex-1 gap-2">
                <Save className="w-4 h-4" /> Salvar Conquistas
              </Button>
              <Button variant="outline" onClick={() => setAchievements(INITIAL_ACHIEVEMENTS)} className="gap-2">
                Limpar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="salvos">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando...</p>
            ) : savedItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma conquista salva ainda.</p>
            ) : (
              <div className="grid gap-4">
                {savedItems.map((item: any) => {
                  const dados = item.dados || {};
                  const unlockedCount = dados.achievements?.filter((a: any) => a.unlocked).length || 0;
                  return (
                    <Card key={item.id} className="glass-card p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-sm">{item.titulo}</h4>
                          <p className="text-xs text-muted-foreground">
                            {unlockedCount} conquistas desbloqueadas — {dados.progress || 0}%
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(viewItem?.dados?.achievements || []).map((ach: any, i: number) => {
              const Icon = ICON_MAP[ach.title] || Trophy;
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${ach.unlocked ? "bg-primary/5 border border-primary/20" : "bg-muted/50"}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${ach.unlocked ? "bg-primary/20" : "bg-muted"}`}>
                    {ach.unlocked ? <Icon className="w-4 h-4 text-primary" /> : <Lock className="w-3 h-3 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${ach.unlocked ? "text-foreground" : "text-muted-foreground"}`}>{ach.title}</p>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
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

export default AchievementsSection;
