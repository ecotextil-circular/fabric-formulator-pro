import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Lock, CheckCircle2, Star, Leaf, Recycle, Award, Zap, Heart, Globe } from "lucide-react";

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

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);

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

        {/* Progress */}
        <div className="mb-8">
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
      </div>
    </section>
  );
};

export default AchievementsSection;
