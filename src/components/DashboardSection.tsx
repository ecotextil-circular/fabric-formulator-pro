import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingUp, Recycle, Droplets, Zap, Save, Eraser, Eye, X, List, Trash2 } from "lucide-react";
import SectionBanner, { SECTION_BANNERS } from "@/components/SectionBanner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { toast } from "sonner";
import { useItensSalvos } from "@/hooks/useItensSalvos";
import { useAuth } from "@/contexts/AuthContext";

const COLORS = ["hsl(168,42%,32%)", "hsl(72,30%,42%)", "hsl(50,45%,75%)", "hsl(350,30%,72%)", "hsl(30,40%,82%)"];

const DashboardSection = () => {
  const { user } = useAuth();
  const { items: savedItems, saveItem, removeItem } = useItensSalvos("dashboard");
  const [dashName, setDashName] = useState("");
  const [residuoGerado, setResiduoGerado] = useState("120");
  const [residuoReaproveitado, setResiduoReaproveitado] = useState("72");
  const [aguaUsada, setAguaUsada] = useState("500");
  const [energiaUsada, setEnergiaUsada] = useState("300");
  const [pecasProduzidas, setPecasProduzidas] = useState("1000");
  const [showSaved, setShowSaved] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const gerado = parseFloat(residuoGerado) || 0;
  const reaproveitado = parseFloat(residuoReaproveitado) || 0;
  const agua = parseFloat(aguaUsada) || 0;
  const energia = parseFloat(energiaUsada) || 0;
  const pecas = parseFloat(pecasProduzidas) || 1;
  const taxaReaproveitamento = gerado > 0 ? ((reaproveitado / gerado) * 100) : 0;
  const residuoPorPeca = gerado / pecas;

  const barData = [
    { name: "Gerado", value: gerado, fill: COLORS[3] },
    { name: "Reaproveitado", value: reaproveitado, fill: COLORS[0] },
    { name: "Descartado", value: gerado - reaproveitado, fill: COLORS[4] },
  ];
  const pieData = [
    { name: "Reaproveitado", value: reaproveitado },
    { name: "Descartado", value: Math.max(gerado - reaproveitado, 0) },
  ];
  const monthlyData = [
    { mes: "Jan", residuo: gerado * 0.8, reaprov: reaproveitado * 0.6 },
    { mes: "Fev", residuo: gerado * 0.9, reaprov: reaproveitado * 0.7 },
    { mes: "Mar", residuo: gerado * 0.95, reaprov: reaproveitado * 0.8 },
    { mes: "Abr", residuo: gerado, reaprov: reaproveitado * 0.85 },
    { mes: "Mai", residuo: gerado * 1.05, reaprov: reaproveitado * 0.9 },
    { mes: "Jun", residuo: gerado * 0.9, reaprov: reaproveitado },
  ];

  const handleSave = async () => {
    if (!dashName.trim()) { toast.error("Dê um nome ao dashboard."); return; }
    const result = await saveItem(dashName, { residuoGerado, residuoReaproveitado, aguaUsada, energiaUsada, pecasProduzidas, taxaReaproveitamento, residuoPorPeca });
    if (result) { toast.success("Dashboard salvo!"); handleClear(); }
  };

  const handleClear = () => {
    setDashName(""); setResiduoGerado("120"); setResiduoReaproveitado("72");
    setAguaUsada("500"); setEnergiaUsada("300"); setPecasProduzidas("1000");
    toast.success("Campos limpos!");
  };

  return (
    <section id="dashboard" className="py-16 px-4 section-gradient">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"><BarChart3 className="w-4 h-4" /> Visão Geral</div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">Dashboard Interativo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">Insira dados da produção e visualize gráficos sobre sustentabilidade e resíduos.</p>
        </div>

        <div className="mb-4">
          <Input value={dashName} onChange={(e) => setDashName(e.target.value)} placeholder="Nome do dashboard (para salvar)..." className="bg-card max-w-xs text-base" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Resíduo gerado (kg)", val: residuoGerado, set: setResiduoGerado, icon: TrendingUp },
            { label: "Reaproveitado (kg)", val: residuoReaproveitado, set: setResiduoReaproveitado, icon: Recycle },
            { label: "Água (L)", val: aguaUsada, set: setAguaUsada, icon: Droplets },
            { label: "Energia (kWh)", val: energiaUsada, set: setEnergiaUsada, icon: Zap },
            { label: "Peças/mês", val: pecasProduzidas, set: setPecasProduzidas, icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="glass-card p-3 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1.5"><Icon className="w-3.5 h-3.5 text-primary" /><Label className="text-xs">{item.label}</Label></div>
                <Input type="number" value={item.val} onChange={(e) => item.set(e.target.value)} className="bg-background h-8 text-sm" />
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card p-5 rounded-xl text-center">
            <p className="text-sm text-muted-foreground mb-1">Taxa de Reaproveitamento</p>
            <p className="text-3xl font-bold text-primary font-display">{taxaReaproveitamento.toFixed(1)}%</p>
          </Card>
          <Card className="glass-card p-5 rounded-xl text-center">
            <p className="text-sm text-muted-foreground mb-1">Resíduo por Peça</p>
            <p className="text-3xl font-bold text-foreground font-display">{residuoPorPeca.toFixed(2)} kg</p>
          </Card>
          <Card className="glass-card p-5 rounded-xl text-center col-span-2 md:col-span-1">
            <p className="text-sm text-muted-foreground mb-1">Água por Peça</p>
            <p className="text-3xl font-bold text-foreground font-display">{(agua / pecas).toFixed(1)} L</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="glass-card p-5 rounded-xl">
            <h4 className="font-semibold font-display text-foreground mb-4 text-base">Resíduos (kg)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(40,20%,87%)" /><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="value" radius={[6, 6, 0, 0]}>{barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}</Bar></BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="glass-card p-5 rounded-xl">
            <h4 className="font-semibold font-display text-foreground mb-4 text-base">Distribuição</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </Card>
          <Card className="glass-card p-5 rounded-xl md:col-span-2">
            <h4 className="font-semibold font-display text-foreground mb-4 text-base">Evolução Mensal (projeção)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(40,20%,87%)" /><XAxis dataKey="mes" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="residuo" stroke={COLORS[3]} strokeWidth={2} name="Resíduo" dot={{ r: 4 }} /><Line type="monotone" dataKey="reaprov" stroke={COLORS[0]} strokeWidth={2} name="Reaproveitado" dot={{ r: 4 }} /></LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Save className="w-4 h-4" /> Salvar Dashboard</button>
          <button onClick={handleClear} className="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Eraser className="w-4 h-4" /> Limpar Campo</button>
        </div>

        {user && (
          <Card className="glass-card p-6 rounded-2xl mt-6">
            <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-2 text-base font-semibold text-foreground mb-4"><List className="w-4 h-4" /> Dashboards Salvos ({savedItems.length})</button>
            {showSaved && (
              <div className="space-y-3">
                {savedItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 cursor-pointer hover:shadow-md" onClick={() => setViewingItem(item)}>
                    <div>
                      <p className="font-medium text-base text-foreground">{item.titulo}</p>
                      <p className="text-sm text-muted-foreground">Taxa: {item.dados?.taxaReaproveitamento?.toFixed(1)}% • {new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setViewingItem(item); }} className="p-1.5 text-primary hover:bg-primary/10 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={async (e) => { e.stopPropagation(); const ok = await removeItem(item.id); if (ok) toast.success("Dashboard deletado!"); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {savedItems.length === 0 && <p className="text-sm text-muted-foreground">Nenhum dashboard salvo.</p>}
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
              <p className="text-muted-foreground">Resíduo gerado: <strong className="text-foreground">{viewingItem.dados?.residuoGerado} kg</strong></p>
              <p className="text-muted-foreground">Reaproveitado: <strong className="text-foreground">{viewingItem.dados?.residuoReaproveitado} kg</strong></p>
              <p className="text-muted-foreground">Taxa: <strong className="text-primary">{viewingItem.dados?.taxaReaproveitamento?.toFixed(1)}%</strong></p>
              <p className="text-muted-foreground">Água: <strong className="text-foreground">{viewingItem.dados?.aguaUsada} L</strong></p>
              <p className="text-muted-foreground">Energia: <strong className="text-foreground">{viewingItem.dados?.energiaUsada} kWh</strong></p>
              <p className="text-muted-foreground">Peças/mês: <strong className="text-foreground">{viewingItem.dados?.pecasProduzidas}</strong></p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardSection;
