import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Info, TrendingDown, Recycle, DollarSign, Save, Eraser, Eye, X, List, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useItensSalvos } from "@/hooks/useItensSalvos";
import { useAuth } from "@/contexts/AuthContext";

const WasteCalculator = () => {
  const { user } = useAuth();
  const { items: savedItems, saveItem, removeItem } = useItensSalvos("calculadora");
  const [tecidoTotal, setTecidoTotal] = useState("");
  const [tecidoUsado, setTecidoUsado] = useState("");
  const [custoKg, setCustoKg] = useState("");
  const [pecasMes, setPecasMes] = useState("");
  const [calcName, setCalcName] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const total = parseFloat(tecidoTotal) || 0;
  const usado = parseFloat(tecidoUsado) || 0;
  const custo = parseFloat(custoKg) || 0;
  const pecas = parseFloat(pecasMes) || 1;
  const residuo = total > 0 ? total - usado : 0;
  const percentual = total > 0 ? ((residuo / total) * 100) : 0;
  const custoResiduoPeca = custo > 0 ? residuo * custo : 0;
  const custoMensal = custoResiduoPeca * pecas;
  const economiaReuso = custoMensal * 0.6;

  const handleSave = async () => {
    if (!calcName.trim()) { toast.error("Dê um nome ao cálculo."); return; }
    const result = await saveItem(calcName, { tecidoTotal, tecidoUsado, custoKg, pecasMes, residuo, percentual, custoMensal, economiaReuso });
    if (result) { toast.success("Cálculo salvo!"); handleClear(); }
  };

  const handleClear = () => {
    setCalcName(""); setTecidoTotal(""); setTecidoUsado(""); setCustoKg(""); setPecasMes("");
    toast.success("Campos limpos!");
  };

  return (
    <section id="calculadora" className="py-16 px-4 section-gradient">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"><Calculator className="w-4 h-4" /> Ferramenta Prática</div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">Calculadora de Resíduos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">Calcule o volume de resíduos têxteis e descubra quanto pode economizar.</p>
        </div>

        <Card className="glass-card p-5 rounded-xl mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Como usar:</strong></p>
              <p>1. Informe a quantidade total de tecido (em kg) usada para cortar uma peça</p>
              <p>2. Informe quanto desse tecido realmente vira peça finalizada</p>
              <p>3. Informe o custo do tecido por kg e a produção mensal</p>
              <p>4. Veja os resultados: desperdício, custo e economia potencial</p>
            </div>
          </div>
        </Card>

        <div className="mb-4">
          <Input value={calcName} onChange={(e) => setCalcName(e.target.value)} placeholder="Nome do cálculo (para salvar)..." className="bg-card max-w-xs text-base" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card p-6 rounded-2xl space-y-5">
            <h3 className="font-semibold font-display text-foreground text-base">Dados da Produção</h3>
            <div className="space-y-4">
              <div className="space-y-2"><Label className="text-base">Tecido total por peça (kg)</Label><Input type="number" step="0.01" value={tecidoTotal} onChange={(e) => setTecidoTotal(e.target.value)} placeholder="Ex: 1.5" className="bg-background text-base" /></div>
              <div className="space-y-2"><Label className="text-base">Tecido aproveitado por peça (kg)</Label><Input type="number" step="0.01" value={tecidoUsado} onChange={(e) => setTecidoUsado(e.target.value)} placeholder="Ex: 1.1" className="bg-background text-base" /></div>
              <div className="space-y-2"><Label className="text-base">Custo do tecido (R$/kg)</Label><Input type="number" step="0.01" value={custoKg} onChange={(e) => setCustoKg(e.target.value)} placeholder="Ex: 45.00" className="bg-background text-base" /></div>
              <div className="space-y-2"><Label className="text-base">Peças produzidas por mês</Label><Input type="number" value={pecasMes} onChange={(e) => setPecasMes(e.target.value)} placeholder="Ex: 500" className="bg-background text-base" /></div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="glass-card p-5 rounded-xl">
              <div className="flex items-center gap-3 mb-2"><TrendingDown className="w-5 h-5 text-destructive" /><h4 className="font-semibold text-foreground text-base">Resíduo por Peça</h4></div>
              <p className="text-3xl font-bold text-foreground font-display">{residuo.toFixed(2)} kg</p>
              <p className="text-sm text-muted-foreground">{percentual.toFixed(1)}% de desperdício</p>
              <div className="mt-3 h-3 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-destructive/70 rounded-full transition-all duration-500" style={{ width: `${Math.min(percentual, 100)}%` }} /></div>
            </Card>
            <Card className="glass-card p-5 rounded-xl">
              <div className="flex items-center gap-3 mb-2"><DollarSign className="w-5 h-5 text-accent" /><h4 className="font-semibold text-foreground text-base">Custo do Desperdício</h4></div>
              <p className="text-3xl font-bold text-foreground font-display">R$ {custoMensal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">por mês ({pecas} peças × R$ {custoResiduoPeca.toFixed(2)})</p>
            </Card>
            <Card className="glass-card p-5 rounded-xl border-primary/30">
              <div className="flex items-center gap-3 mb-2"><Recycle className="w-5 h-5 text-primary" /><h4 className="font-semibold text-foreground text-base">Economia com Reaproveitamento</h4></div>
              <p className="text-3xl font-bold text-primary font-display">R$ {economiaReuso.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">economia potencial mensal (60% de reaproveitamento)</p>
            </Card>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mt-6">
          <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Save className="w-4 h-4" /> Salvar Cálculo</button>
          <button onClick={handleClear} className="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Eraser className="w-4 h-4" /> Limpar Campo</button>
        </div>

        {user && (
          <Card className="glass-card p-6 rounded-2xl mt-6">
            <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-2 text-base font-semibold text-foreground mb-4"><List className="w-4 h-4" /> Cálculos Salvos ({savedItems.length})</button>
            {showSaved && (
              <div className="space-y-3">
                {savedItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 cursor-pointer hover:shadow-md" onClick={() => setViewingItem(item)}>
                    <div>
                      <p className="font-medium text-base text-foreground">{item.titulo}</p>
                      <p className="text-sm text-muted-foreground">Desperdício: {item.dados?.percentual?.toFixed(1)}% • {new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setViewingItem(item); }} className="p-1.5 text-primary hover:bg-primary/10 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={async (e) => { e.stopPropagation(); const ok = await removeItem(item.id); if (ok) toast.success("Cálculo deletado!"); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {savedItems.length === 0 && <p className="text-sm text-muted-foreground">Nenhum cálculo salvo ainda.</p>}
              </div>
            )}
          </Card>
        )}
      </div>

      {viewingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setViewingItem(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-card max-w-md w-full max-h-[80vh] overflow-auto rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewingItem(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={24} /></button>
            <h3 className="text-xl font-bold font-display text-foreground mb-4">{viewingItem.titulo}</h3>
            <div className="space-y-2 text-base">
              <p className="text-muted-foreground">Tecido total: <strong className="text-foreground">{viewingItem.dados?.tecidoTotal} kg</strong></p>
              <p className="text-muted-foreground">Tecido aproveitado: <strong className="text-foreground">{viewingItem.dados?.tecidoUsado} kg</strong></p>
              <p className="text-muted-foreground">Resíduo: <strong className="text-foreground">{viewingItem.dados?.residuo?.toFixed(2)} kg ({viewingItem.dados?.percentual?.toFixed(1)}%)</strong></p>
              <p className="text-muted-foreground">Custo mensal: <strong className="text-foreground">R$ {viewingItem.dados?.custoMensal?.toFixed(2)}</strong></p>
              <p className="text-muted-foreground">Economia potencial: <strong className="text-primary">R$ {viewingItem.dados?.economiaReuso?.toFixed(2)}</strong></p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WasteCalculator;
