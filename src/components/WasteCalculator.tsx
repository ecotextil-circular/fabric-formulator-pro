import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Info, TrendingDown, Recycle, DollarSign } from "lucide-react";

const WasteCalculator = () => {
  const [tecidoTotal, setTecidoTotal] = useState("");
  const [tecidoUsado, setTecidoUsado] = useState("");
  const [custoKg, setCustoKg] = useState("");
  const [pecasMes, setPecasMes] = useState("");

  const total = parseFloat(tecidoTotal) || 0;
  const usado = parseFloat(tecidoUsado) || 0;
  const custo = parseFloat(custoKg) || 0;
  const pecas = parseFloat(pecasMes) || 1;

  const residuo = total > 0 ? total - usado : 0;
  const percentual = total > 0 ? ((residuo / total) * 100) : 0;
  const custoResiduoPeca = custo > 0 ? residuo * custo : 0;
  const custoMensal = custoResiduoPeca * pecas;
  const economiaReuso = custoMensal * 0.6; // 60% can be reused

  return (
    <section id="calculadora" className="py-16 px-4 section-gradient">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Ferramenta Prática
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Calculadora de Resíduos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calcule o volume de resíduos têxteis da sua produção e descubra quanto pode economizar com práticas de economia circular.
          </p>
        </div>

        {/* How to use */}
        <Card className="glass-card p-5 rounded-xl mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Como usar:</strong></p>
              <p>1. Informe a quantidade total de tecido (em kg) usada para cortar uma peça</p>
              <p>2. Informe quanto desse tecido realmente vira peça finalizada</p>
              <p>3. Informe o custo do tecido por kg e a produção mensal</p>
              <p>4. Veja os resultados: percentual de desperdício, custo do resíduo e potencial de economia com reaproveitamento</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="glass-card p-6 rounded-2xl space-y-5">
            <h3 className="font-semibold font-display text-foreground">Dados da Produção</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tecido total por peça (kg)</Label>
                <Input type="number" step="0.01" value={tecidoTotal} onChange={(e) => setTecidoTotal(e.target.value)} placeholder="Ex: 1.5" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label>Tecido aproveitado por peça (kg)</Label>
                <Input type="number" step="0.01" value={tecidoUsado} onChange={(e) => setTecidoUsado(e.target.value)} placeholder="Ex: 1.1" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label>Custo do tecido (R$/kg)</Label>
                <Input type="number" step="0.01" value={custoKg} onChange={(e) => setCustoKg(e.target.value)} placeholder="Ex: 45.00" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label>Peças produzidas por mês</Label>
                <Input type="number" value={pecasMes} onChange={(e) => setPecasMes(e.target.value)} placeholder="Ex: 500" className="bg-background" />
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            <Card className="glass-card p-5 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 text-destructive" />
                <h4 className="font-semibold text-foreground">Resíduo por Peça</h4>
              </div>
              <p className="text-3xl font-bold text-foreground font-display">{residuo.toFixed(2)} kg</p>
              <p className="text-sm text-muted-foreground">{percentual.toFixed(1)}% de desperdício</p>
              <div className="mt-3 h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-destructive/70 rounded-full transition-all duration-500" style={{ width: `${Math.min(percentual, 100)}%` }} />
              </div>
            </Card>

            <Card className="glass-card p-5 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-accent" />
                <h4 className="font-semibold text-foreground">Custo do Desperdício</h4>
              </div>
              <p className="text-3xl font-bold text-foreground font-display">R$ {custoMensal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">por mês ({pecas} peças × R$ {custoResiduoPeca.toFixed(2)})</p>
            </Card>

            <Card className="glass-card p-5 rounded-xl border-primary/30">
              <div className="flex items-center gap-3 mb-2">
                <Recycle className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Economia com Reaproveitamento</h4>
              </div>
              <p className="text-3xl font-bold text-primary font-display">R$ {economiaReuso.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">economia potencial mensal (60% de reaproveitamento)</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WasteCalculator;
