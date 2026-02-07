import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingUp, Recycle, Droplets, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["hsl(168,42%,32%)", "hsl(72,30%,42%)", "hsl(50,45%,75%)", "hsl(350,30%,72%)", "hsl(30,40%,82%)"];

const DashboardSection = () => {
  const [residuoGerado, setResiduoGerado] = useState("120");
  const [residuoReaproveitado, setResiduoReaproveitado] = useState("72");
  const [aguaUsada, setAguaUsada] = useState("500");
  const [energiaUsada, setEnergiaUsada] = useState("300");
  const [pecasProduzidas, setPecasProduzidas] = useState("1000");

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

  return (
    <section id="dashboard" className="py-16 px-4 section-gradient">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Dashboard Interativo
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insira os dados da sua produção e visualize gráficos intuitivos sobre sustentabilidade e resíduos.
          </p>
        </div>

        {/* Input Cards */}
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
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <Label className="text-xs">{item.label}</Label>
                </div>
                <Input type="number" value={item.val} onChange={(e) => item.set(e.target.value)} className="bg-background h-8 text-sm" />
              </Card>
            );
          })}
        </div>

        {/* KPI Cards */}
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

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card p-5 rounded-xl">
            <h4 className="font-semibold font-display text-foreground mb-4">Resíduos (kg)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,20%,87%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card p-5 rounded-xl">
            <h4 className="font-semibold font-display text-foreground mb-4">Distribuição</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card p-5 rounded-xl md:col-span-2">
            <h4 className="font-semibold font-display text-foreground mb-4">Evolução Mensal (projeção)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,20%,87%)" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="residuo" stroke={COLORS[3]} strokeWidth={2} name="Resíduo" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="reaprov" stroke={COLORS[0]} strokeWidth={2} name="Reaproveitado" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
