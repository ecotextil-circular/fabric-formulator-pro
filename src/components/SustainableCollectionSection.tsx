import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Save, Eraser, Eye, X, List, Trash2, Leaf, Calculator } from "lucide-react";
import { toast } from "sonner";
import { useItensSalvos } from "@/hooks/useItensSalvos";
import { useAuth } from "@/contexts/AuthContext";

const PECAS_TIPOS = ["Calça","Saia Curta","Saia Midi","Saia Longa","Blusa de Manga Longa","Blusa de Manga Curta","Bermuda","Jaqueta","Casaco","T-shirt","Cropped","Calcinha","Sutiã","Vestido","Macacão","Conjunto","Regata","Body"];
const TAMANHOS = ["PP","P","M","G","G1","G2","G3","G4","34","36","38","40","42","44","46","48","50","52","54","56","XXS","XS","S","M","L","XL","XXL","XXXL"];
const RESIDUOS_TIPOS = ["Retalhos de tecido","Fios e linhas","Sobras de malha","Aparas de couro","Resíduos de tingimento","Embalagens","Outros"];
const PALETAS = [
  { name: "Terra Natural", colors: ["#5C4033","#8B7355","#C4A35A","#D4C5A9","#C2B280","#A0826D"], desc: "Tons terrosos e naturais" },
  { name: "Verde Sustentável", colors: ["#2D5016","#3A7D44","#69B578","#A7C957","#6B8E23","#8FBC8F"], desc: "Paleta verde inspirada na natureza" },
  { name: "Oceano Consciente", colors: ["#1B4965","#2C6E8C","#3D8DAF","#5ABED6","#4A7C91","#6EADC1"], desc: "Tons de azul inspirados no oceano" },
  { name: "Deserto Minimalista", colors: ["#8B6F47","#A0826D","#C4AE97","#D5C4B0","#B8A088","#9C8B72"], desc: "Paleta neutra e minimalista" },
  { name: "Cinza Reciclado", colors: ["#6B6B6B","#808080","#A9A9A9","#2F4F4F","#C0C0C0","#D3D3D3"], desc: "Cinzas para peças atemporais" },
  { name: "Lavanda Eco", colors: ["#7B6D8D","#9B8BB4","#C8B8DB","#8E7FB0","#B0A0C8","#D8CCE8"], desc: "Tons suaves de lavanda" },
  { name: "Rosa Orgânico", colors: ["#D4A5A5","#E8B4B8","#F0C2C2","#C97B7B","#B56E6E","#A35D5D"], desc: "Rosa natural e orgânico" },
  { name: "Mostarda & Âmbar", colors: ["#D4A017","#C68E17","#B8860B","#DAA520","#E8A317","#F0C420"], desc: "Tons quentes de mostarda" },
];

const ALL_COLORS: { hex: string; name: string }[] = [
  // Brancos e Cremes
  { hex: "#FFFFFF", name: "Branco" }, { hex: "#FFFAF0", name: "Branco Floral" }, { hex: "#FFF8DC", name: "Creme Cornsilk" }, { hex: "#F5F5DC", name: "Bege" }, { hex: "#F5E6CC", name: "Creme" }, { hex: "#FAF0E6", name: "Linho" },
  // Amarelos e Dourados
  { hex: "#FFD700", name: "Ouro" }, { hex: "#F0C420", name: "Amarelo Sol" }, { hex: "#F9A825", name: "Amarelo Ouro" }, { hex: "#DAA520", name: "Ouro Velho" }, { hex: "#D4A017", name: "Mostarda" }, { hex: "#C68E17", name: "Mostarda Escura" }, { hex: "#B8860B", name: "Dourado Escuro" }, { hex: "#E8A317", name: "Âmbar" },
  // Laranjas e Pêssego
  { hex: "#FF8C00", name: "Laranja Escuro" }, { hex: "#F57C00", name: "Laranja" }, { hex: "#FF6F61", name: "Coral Vivo" }, { hex: "#FAD6A5", name: "Pêssego" }, { hex: "#FFAB91", name: "Salmão Claro" }, { hex: "#E57373", name: "Coral Rosa" },
  // Vermelhos
  { hex: "#DC143C", name: "Carmesim" }, { hex: "#8B0000", name: "Vermelho Escuro" }, { hex: "#800020", name: "Borgonha" }, { hex: "#A35D5D", name: "Terracota Rosa" }, { hex: "#C97B7B", name: "Rosa Queimado" },
  // Rosas
  { hex: "#D4A5A5", name: "Rosa Antigo" }, { hex: "#E8B4B8", name: "Rosa Claro" }, { hex: "#F0C2C2", name: "Rosa Pétala" }, { hex: "#B56E6E", name: "Rosa Seco" }, { hex: "#FFB6C1", name: "Rosa Bebê" }, { hex: "#DB7093", name: "Rosa Médio" },
  // Roxos e Lavandas
  { hex: "#4B0082", name: "Índigo" }, { hex: "#6A0DAD", name: "Roxo Escuro" }, { hex: "#7B6D8D", name: "Lavanda Escuro" }, { hex: "#9B8BB4", name: "Lavanda" }, { hex: "#C8B8DB", name: "Lavanda Claro" }, { hex: "#8E7FB0", name: "Lilás" }, { hex: "#B0A0C8", name: "Ametista" }, { hex: "#D8CCE8", name: "Lavanda Suave" },
  // Azuis
  { hex: "#000080", name: "Azul Marinho" }, { hex: "#1B4965", name: "Azul Noite" }, { hex: "#2980B9", name: "Azul Royal" }, { hex: "#5DADE2", name: "Azul Celeste" }, { hex: "#5B9BD5", name: "Azul Aço" }, { hex: "#2C6E8C", name: "Azul Petróleo" }, { hex: "#3D8DAF", name: "Azul Claro" }, { hex: "#5ABED6", name: "Azul Céu" }, { hex: "#87CEEB", name: "Azul Bebê" }, { hex: "#B0E0E6", name: "Azul Pó" },
  // Teais e Turquesas
  { hex: "#4A8C8C", name: "Teal" }, { hex: "#4A7C91", name: "Teal Escuro" }, { hex: "#6EADC1", name: "Turquesa" }, { hex: "#1B5E50", name: "Verde Petróleo" }, { hex: "#006D5B", name: "Verde Jade" },
  // Verdes
  { hex: "#2D5016", name: "Verde Floresta" }, { hex: "#3A7D44", name: "Verde Esmeralda" }, { hex: "#556B2F", name: "Verde Oliva" }, { hex: "#6B8E23", name: "Verde Lima Escuro" }, { hex: "#69B578", name: "Verde Menta" }, { hex: "#A7C957", name: "Verde Abacate" }, { hex: "#8FBC8F", name: "Verde Salvia" }, { hex: "#9CCC65", name: "Verde Claro" }, { hex: "#5D8A5E", name: "Verde Musgo" }, { hex: "#228B22", name: "Verde Floresta Vivo" },
  // Marrons
  { hex: "#5C4033", name: "Marrom Escuro" }, { hex: "#8B7355", name: "Marrom Café" }, { hex: "#8D5524", name: "Marrom Terra" }, { hex: "#D2691E", name: "Chocolate" }, { hex: "#8D6E63", name: "Marrom Rosado" }, { hex: "#A0826D", name: "Marrom Claro" }, { hex: "#C4A35A", name: "Dourado Suave" }, { hex: "#C4AE97", name: "Camelo" }, { hex: "#D4C5A9", name: "Areia" }, { hex: "#D5C4B0", name: "Bege Rosado" }, { hex: "#B8A088", name: "Areia Escura" }, { hex: "#9C8B72", name: "Taupe" }, { hex: "#C2B280", name: "Caqui" },
  // Cinzas
  { hex: "#2F4F4F", name: "Cinza Ardósia" }, { hex: "#6B6B6B", name: "Cinza Escuro" }, { hex: "#808080", name: "Cinza Médio" }, { hex: "#A9A9A9", name: "Cinza" }, { hex: "#C0C0C0", name: "Prata" }, { hex: "#D3D3D3", name: "Cinza Claro" }, { hex: "#E0E0E0", name: "Cinza Pérola" }, { hex: "#BDBDBD", name: "Cinza Neutro" },
  // Preto
  { hex: "#000000", name: "Preto" }, { hex: "#1C1C1C", name: "Preto Suave" }, { hex: "#333333", name: "Carvão" },
];

const SustainableCollectionSection = () => {
  const { user } = useAuth();
  const { items: savedItems, saveItem, removeItem } = useItensSalvos("colecao");
  const [activeTab, setActiveTab] = useState("geral");
  const [showSaved, setShowSaved] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const [nomeColecao, setNomeColecao] = useState("");
  const [temaConceito, setTemaConceito] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataTermino, setDataTermino] = useState("");
  const [status, setStatus] = useState("planejamento");
  const [responsavel, setResponsavel] = useState("");
  const [tipoResiduo, setTipoResiduo] = useState("");
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState("0");
  const [unidade, setUnidade] = useState("kg");
  const [origemResiduo, setOrigemResiduo] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");
  const [pecasSelecionadas, setPecasSelecionadas] = useState<string[]>([]);
  const [outrosTipos, setOutrosTipos] = useState("");
  const [qtdTotalPecas, setQtdTotalPecas] = useState("0");
  const [descricaoPecas, setDescricaoPecas] = useState("");
  const [tecnicasUpcycling, setTecnicasUpcycling] = useState("");
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState<string[]>([]);
  const [outrosTamanhos, setOutrosTamanhos] = useState("");
  const [materiaPrima, setMateriaPrima] = useState("0");
  const [maoDeObra, setMaoDeObra] = useState("0");
  const [equipamentos, setEquipamentos] = useState("0");
  const [marketing, setMarketing] = useState("0");
  const [precoVenda, setPrecoVenda] = useState("0");
  const [paletaCores, setPaletaCores] = useState("");
  const [referenciasVisuais, setReferenciasVisuais] = useState("");
  const [esbocosCroquis, setEsbocosCroquis] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [residuosEvitados, setResiduosEvitados] = useState("0");
  const [aguaEconomizada, setAguaEconomizada] = useState("0");
  const [co2Reduzido, setCo2Reduzido] = useState("0");
  const [respDesign, setRespDesign] = useState("");
  const [respProducao, setRespProducao] = useState("");
  const [respQualidade, setRespQualidade] = useState("");
  const [respMarketing, setRespMarketing] = useState("");

  const custoTotal = (parseFloat(materiaPrima) || 0) + (parseFloat(maoDeObra) || 0) + (parseFloat(equipamentos) || 0) + (parseFloat(marketing) || 0);
  const pv = parseFloat(precoVenda) || 0;
  const margem = pv > 0 ? ((pv - custoTotal) / pv * 100) : 0;
  const roi = custoTotal > 0 ? ((pv - custoTotal) / custoTotal * 100) : 0;
  const impactoTotal = (parseFloat(residuosEvitados) || 0) * 2.5 + (parseFloat(aguaEconomizada) || 0) * 0.01 + (parseFloat(co2Reduzido) || 0) * 5;

  const togglePeca = (p: string) => setPecasSelecionadas(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const toggleTamanho = (t: string) => setTamanhosSelecionados(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleColor = (hex: string) => {
    const colorName = COLOR_MAP[hex] || hex;
    const label = `${colorName} (${hex})`;
    setSelectedColors(prev => prev.includes(hex) ? prev.filter(x => x !== hex) : [...prev, hex]);
    setPaletaCores(prev => {
      const items = prev ? prev.split(', ').filter(Boolean) : [];
      if (items.find(i => i.includes(hex))) return items.filter(i => !i.includes(hex)).join(', ');
      return [...items, label].join(', ');
    });
  };

  const handleSave = async () => {
    if (!nomeColecao.trim()) { toast.error("Nome da coleção é obrigatório."); return; }
    const dados = {
      geral: { nomeColecao, temaConceito, dataInicio, dataTermino, status, responsavel },
      residuos: { tipoResiduo, quantidadeDisponivel, unidade, origemResiduo, caracteristicas },
      pecas: { pecasSelecionadas, outrosTipos, qtdTotalPecas, descricaoPecas, tecnicasUpcycling, tamanhosSelecionados, outrosTamanhos },
      orcamento: { materiaPrima, maoDeObra, equipamentos, marketing, precoVenda, custoTotal, margem, roi },
      design: { paletaCores, referenciasVisuais, esbocosCroquis, selectedColors },
      impacto: { residuosEvitados, aguaEconomizada, co2Reduzido, impactoTotal },
      responsaveis: { respDesign, respProducao, respQualidade, respMarketing },
    };
    const result = await saveItem(nomeColecao, dados);
    if (result) { toast.success("Coleção salva!"); handleClear(); }
  };

  const handleClear = () => {
    setNomeColecao(""); setTemaConceito(""); setDataInicio(""); setDataTermino(""); setStatus("planejamento"); setResponsavel("");
    setTipoResiduo(""); setQuantidadeDisponivel("0"); setUnidade("kg"); setOrigemResiduo(""); setCaracteristicas("");
    setPecasSelecionadas([]); setOutrosTipos(""); setQtdTotalPecas("0"); setDescricaoPecas(""); setTecnicasUpcycling(""); setTamanhosSelecionados([]); setOutrosTamanhos("");
    setMateriaPrima("0"); setMaoDeObra("0"); setEquipamentos("0"); setMarketing("0"); setPrecoVenda("0");
    setPaletaCores(""); setReferenciasVisuais(""); setEsbocosCroquis(""); setSelectedColors([]);
    setResiduosEvitados("0"); setAguaEconomizada("0"); setCo2Reduzido("0");
    setRespDesign(""); setRespProducao(""); setRespQualidade(""); setRespMarketing("");
    toast.success("Campos limpos!");
  };

  const TABS = [
    { key: "geral", label: "Geral" }, { key: "residuos", label: "Resíduos" }, { key: "pecas", label: "Peças" },
    { key: "orcamento", label: "Orçamento" }, { key: "design", label: "Design" }, { key: "impacto", label: "Impacto" },
  ];

  // Nome da coleção inline component for non-geral tabs
  const NomeColecaoField = () => (
    <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
      <Label className="text-base font-semibold">Nome da Coleção *</Label>
      <Input value={nomeColecao} onChange={e => setNomeColecao(e.target.value)} placeholder="Ex: Coleção Verão Sustentável" className="bg-background text-base mt-1" />
    </div>
  );

  return (
    <section id="colecao" className="py-16 px-4 section-gradient">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"><Sparkles className="w-4 h-4" /> Criação Sustentável</div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">Como Criar uma Coleção Sustentável</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">Passo a passo para desenvolver uma coleção com princípios de economia circular.</p>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{tab.label}</button>
          ))}
        </div>

        <Card className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
          {activeTab === "geral" && (
            <div className="space-y-6">
              <div><h3 className="text-xl font-bold font-display text-foreground mb-1">Informações Gerais</h3><p className="text-sm text-muted-foreground">Dados básicos do projeto de coleção</p></div>
              <div className="space-y-4">
                <div><Label className="text-base">Nome da Coleção *</Label><Input value={nomeColecao} onChange={e => setNomeColecao(e.target.value)} placeholder="Ex: Coleção Verão Sustentável" className="bg-background text-base" /></div>
                <div><Label className="text-base">Tema/Conceito</Label><Input value={temaConceito} onChange={e => setTemaConceito(e.target.value)} placeholder="Ex: Renascimento Sustentável" className="bg-background text-base" /></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label className="text-base">Data de Início</Label><Input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="bg-background text-base" /></div>
                  <div><Label className="text-base">Data de Término</Label><Input type="date" value={dataTermino} onChange={e => setDataTermino(e.target.value)} className="bg-background text-base" /></div>
                  <div><Label className="text-base">Status</Label>
                    <Select value={status} onValueChange={setStatus}><SelectTrigger className="bg-background text-base"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="planejamento">Planejamento</SelectItem><SelectItem value="desenvolvimento">Desenvolvimento</SelectItem><SelectItem value="producao">Produção</SelectItem><SelectItem value="finalizado">Finalizado</SelectItem></SelectContent></Select>
                  </div>
                </div>
                <div><Label className="text-base">Responsável</Label><Input value={responsavel} onChange={e => setResponsavel(e.target.value)} placeholder="Nome do responsável pelo projeto" className="bg-background text-base" /></div>
              </div>
            </div>
          )}

          {activeTab === "residuos" && (
            <div className="space-y-6">
              <NomeColecaoField />
              <div><h3 className="text-xl font-bold font-display text-foreground mb-1">Resíduos Utilizados</h3><p className="text-sm text-muted-foreground">Materiais têxteis que serão reaproveitados</p></div>
              <div className="space-y-4">
                <div><Label className="text-base">Tipo de Resíduo Têxtil</Label>
                  <Select value={tipoResiduo} onValueChange={setTipoResiduo}><SelectTrigger className="bg-background text-base"><SelectValue placeholder="Selecione o tipo de resíduo" /></SelectTrigger><SelectContent>{RESIDUOS_TIPOS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="text-base">Quantidade Disponível</Label><Input type="number" value={quantidadeDisponivel} onChange={e => setQuantidadeDisponivel(e.target.value)} className="bg-background text-base" /></div>
                  <div><Label className="text-base">Unidade</Label>
                    <Select value={unidade} onValueChange={setUnidade}><SelectTrigger className="bg-background text-base"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="kg">Quilogramas (kg)</SelectItem><SelectItem value="m">Metros (m)</SelectItem><SelectItem value="un">Unidades</SelectItem></SelectContent></Select>
                  </div>
                </div>
                <div><Label className="text-base">Origem do Resíduo</Label><Input value={origemResiduo} onChange={e => setOrigemResiduo(e.target.value)} placeholder="Ex: Produção interna, Fornecedor X" className="bg-background text-base" /></div>
                <div><Label className="text-base">Características do Material</Label><Textarea value={caracteristicas} onChange={e => setCaracteristicas(e.target.value)} placeholder="Descreva composição, cor, textura, estado de conservação..." className="bg-background text-base" /></div>
              </div>
            </div>
          )}

          {activeTab === "pecas" && (
            <div className="space-y-6">
              <NomeColecaoField />
              <div><h3 className="text-xl font-bold font-display text-foreground mb-1">Planejamento de Peças</h3><p className="text-sm text-muted-foreground">Produtos que serão criados na coleção</p></div>
              <div><Label className="text-base mb-2 block">Tipos de Peças a Serem Criadas</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PECAS_TIPOS.map(p => (
                    <button key={p} onClick={() => togglePeca(p)} className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${pecasSelecionadas.includes(p) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:border-primary/50"}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div><Label className="text-base">Outros Tipos</Label><Input value={outrosTipos} onChange={e => setOutrosTipos(e.target.value)} placeholder="Digite outros tipos separados por vírgula" className="bg-background text-base" /></div>
              <div><Label className="text-base">Quantidade Total de Peças</Label><Input type="number" value={qtdTotalPecas} onChange={e => setQtdTotalPecas(e.target.value)} className="bg-background text-base" /></div>
              <div><Label className="text-base">Descrição Detalhada das Peças</Label><Textarea value={descricaoPecas} onChange={e => setDescricaoPecas(e.target.value)} placeholder="Descreva cada tipo de peça..." className="bg-background text-base" /></div>
              <div><Label className="text-base">Técnicas de Upcycling</Label><Textarea value={tecnicasUpcycling} onChange={e => setTecnicasUpcycling(e.target.value)} placeholder="Ex: Patchwork, Bordado, Tingimento natural..." className="bg-background text-base" /></div>
              <div><Label className="text-base mb-2 block">Tamanhos Disponíveis</Label>
                <div className="grid grid-cols-6 gap-2">
                  {TAMANHOS.map(t => (
                    <button key={t} onClick={() => toggleTamanho(t)} className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${tamanhosSelecionados.includes(t) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:border-primary/50"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div><Label className="text-base">Outros Tamanhos</Label><Input value={outrosTamanhos} onChange={e => setOutrosTamanhos(e.target.value)} placeholder="Digite outros tamanhos separados por vírgula" className="bg-background text-base" /></div>
            </div>
          )}

          {activeTab === "orcamento" && (
            <div className="space-y-6">
              <NomeColecaoField />
              <div><h3 className="text-xl font-bold font-display text-foreground mb-1">Orçamento</h3><p className="text-sm text-muted-foreground">Custos e projeções financeiras</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label className="text-base">Matéria-Prima Adicional (R$)</Label><Input type="number" value={materiaPrima} onChange={e => setMateriaPrima(e.target.value)} className="bg-background text-base" /></div>
                <div><Label className="text-base">Mão de Obra (R$)</Label><Input type="number" value={maoDeObra} onChange={e => setMaoDeObra(e.target.value)} className="bg-background text-base" /></div>
                <div><Label className="text-base">Equipamentos (R$)</Label><Input type="number" value={equipamentos} onChange={e => setEquipamentos(e.target.value)} className="bg-background text-base" /></div>
                <div><Label className="text-base">Marketing (R$)</Label><Input type="number" value={marketing} onChange={e => setMarketing(e.target.value)} className="bg-background text-base" /></div>
              </div>
              <div><Label className="text-base">Preço de Venda Sugerido (R$)</Label><Input type="number" value={precoVenda} onChange={e => setPrecoVenda(e.target.value)} className="bg-background text-base" /></div>
              <Card className="p-4 rounded-xl border border-border">
                <h4 className="font-bold text-foreground mb-3 text-base">Resumo Financeiro</h4>
                <div className="space-y-2 text-base">
                  <div className="flex justify-between"><span className="text-muted-foreground">Custo Total:</span><span className="font-bold text-primary">R$ {custoTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Preço de Venda:</span><span className="font-bold text-foreground">R$ {pv.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Margem de Lucro:</span><span className="font-bold">{margem.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ROI:</span><span className="font-bold">{roi.toFixed(1)}%</span></div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "design" && (
            <div className="space-y-6">
              <NomeColecaoField />
              <div><h3 className="text-xl font-bold font-display text-foreground mb-1">Design e Desenvolvimento</h3><p className="text-sm text-muted-foreground">Informações criativas e visuais da coleção</p></div>
              <div><Label className="text-base">Paleta de Cores da Coleção</Label><Input value={paletaCores} onChange={e => setPaletaCores(e.target.value)} placeholder="Clique nas cores abaixo ou digite manualmente" className="bg-background text-base" /></div>
              <div>
                <Label className="text-base mb-2 block">Paletas Predefinidas</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PALETAS.map(p => (
                    <Card key={p.name} className="p-3 rounded-xl border border-border cursor-pointer hover:shadow-md" onClick={() => {
                      setSelectedColors(p.colors);
                      setPaletaCores(p.colors.map(c => `${COLOR_MAP[c] || c} (${c})`).join(', '));
                    }}>
                      <p className="font-semibold text-foreground text-sm mb-1 flex items-center gap-1"><Leaf className="w-3 h-3" /> {p.name}</p>
                      <div className="flex gap-1 mb-1">{p.colors.map((c, i) => <div key={i} className="w-8 h-6 rounded" style={{ backgroundColor: c }} />)}</div>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-base mb-1 block">Selecione Cores Individuais</Label>
                <p className="text-sm text-muted-foreground mb-3">Clique nas cores para selecioná-las. O nome e código da cor aparecerão automaticamente no campo acima.</p>
                <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                  {INDIVIDUAL_COLORS.map((c, i) => (
                    <button key={i} onClick={() => toggleColor(c)} className={`w-full aspect-square rounded-lg border-2 transition-all relative group ${selectedColors.includes(c) ? "border-foreground scale-110 shadow-lg" : "border-transparent hover:border-border"}`} style={{ backgroundColor: c }} title={`${COLOR_MAP[c]} (${c})`}>
                      {selectedColors.includes(c) && <div className="absolute inset-0 flex items-center justify-center"><span className="text-white text-xs font-bold drop-shadow-lg">✓</span></div>}
                    </button>
                  ))}
                </div>
                {selectedColors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedColors.map(c => (
                      <span key={c} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c }} />
                        {COLOR_MAP[c] || c} ({c})
                        <button onClick={() => toggleColor(c)} className="ml-1 text-muted-foreground hover:text-destructive">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div><Label className="text-base">Referências Visuais</Label><Textarea value={referenciasVisuais} onChange={e => setReferenciasVisuais(e.target.value)} placeholder="Descreva as inspirações visuais, moodboard..." className="bg-background text-base" /></div>
              <div><Label className="text-base">Esboços/Croquis</Label><Textarea value={esbocosCroquis} onChange={e => setEsbocosCroquis(e.target.value)} placeholder="Descreva os esboços desenvolvidos..." className="bg-background text-base" /></div>
            </div>
          )}

          {activeTab === "impacto" && (
            <div className="space-y-6">
              <NomeColecaoField />
              <div><h3 className="text-xl font-bold font-display text-foreground mb-1">Calculadora de Impacto Ambiental</h3><p className="text-sm text-muted-foreground">Estime o impacto positivo da sua coleção sustentável</p></div>
              <Card className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-foreground text-base mb-2 flex items-center gap-2"><Leaf className="w-4 h-4 text-primary" /> Como usar a calculadora</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Informe a quantidade de resíduos evitados (kg de material que seria descartado)</li>
                  <li>Informe a economia de água em comparação com produção convencional</li>
                  <li>Informe a redução estimada de CO₂ com práticas sustentáveis</li>
                  <li>O índice de impacto combina todos os fatores em uma pontuação</li>
                </ul>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label className="text-base">Resíduos Evitados (kg)</Label><Input type="number" value={residuosEvitados} onChange={e => setResiduosEvitados(e.target.value)} className="bg-background text-base" /></div>
                <div><Label className="text-base">Água Economizada (L)</Label><Input type="number" value={aguaEconomizada} onChange={e => setAguaEconomizada(e.target.value)} className="bg-background text-base" /></div>
                <div><Label className="text-base">CO₂ Reduzido (kg)</Label><Input type="number" value={co2Reduzido} onChange={e => setCo2Reduzido(e.target.value)} className="bg-background text-base" /></div>
              </div>
              <Card className="p-4 rounded-xl border border-primary/30">
                <h4 className="font-bold text-foreground mb-3 text-base">Resumo de Impacto Ambiental</h4>
                <div className="space-y-2 text-base">
                  <div className="flex justify-between"><span className="text-muted-foreground">Resíduos evitados:</span><span className="font-bold text-primary">{residuosEvitados} kg</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Água economizada:</span><span className="font-bold text-foreground">{aguaEconomizada} L</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">CO₂ reduzido:</span><span className="font-bold text-foreground">{co2Reduzido} kg</span></div>
                  <div className="flex justify-between border-t border-border pt-2"><span className="text-muted-foreground font-semibold">Índice de Impacto:</span><span className="font-bold text-primary text-lg">{impactoTotal.toFixed(1)} pts</span></div>
                </div>
              </Card>
              <div className="space-y-4">
                <h4 className="font-bold text-foreground text-base">Responsáveis por Cada Etapa</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="text-base">Design</Label><Input value={respDesign} onChange={e => setRespDesign(e.target.value)} placeholder="Responsável pelo design" className="bg-background text-base" /></div>
                  <div><Label className="text-base">Produção</Label><Input value={respProducao} onChange={e => setRespProducao(e.target.value)} placeholder="Responsável pela produção" className="bg-background text-base" /></div>
                  <div><Label className="text-base">Qualidade</Label><Input value={respQualidade} onChange={e => setRespQualidade(e.target.value)} placeholder="Responsável pela qualidade" className="bg-background text-base" /></div>
                  <div><Label className="text-base">Marketing</Label><Input value={respMarketing} onChange={e => setRespMarketing(e.target.value)} placeholder="Responsável pelo marketing" className="bg-background text-base" /></div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Save className="w-4 h-4" /> Salvar Coleção</button>
            <button onClick={handleClear} className="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Eraser className="w-4 h-4" /> Limpar Campo</button>
          </div>
        </Card>

        {user && (
          <Card className="glass-card p-6 rounded-2xl mt-6">
            <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-2 text-base font-semibold text-foreground mb-4"><List className="w-4 h-4" /> Coleções Salvas ({savedItems.length})</button>
            {showSaved && (
              <div className="space-y-3">
                {savedItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 cursor-pointer hover:shadow-md" onClick={() => setViewingItem(item)}>
                    <div>
                      <p className="font-medium text-base text-foreground">{item.titulo}</p>
                      <p className="text-sm text-muted-foreground">{item.dados?.geral?.status || 'Planejamento'} • {new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setViewingItem(item); }} className="p-1.5 text-primary hover:bg-primary/10 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={async (e) => { e.stopPropagation(); const ok = await removeItem(item.id); if (ok) toast.success("Coleção deletada!"); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {savedItems.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma coleção salva.</p>}
              </div>
            )}
          </Card>
        )}
      </div>

      {viewingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setViewingItem(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-card max-w-lg w-full max-h-[80vh] overflow-auto rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingItem(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={24} /></button>
            <h3 className="text-xl font-bold font-display text-foreground mb-4">{viewingItem.titulo}</h3>
            <div className="space-y-4 text-base">
              {viewingItem.dados?.geral && (
                <div><p className="font-semibold text-foreground mb-1">Geral</p>
                  <p className="text-sm text-muted-foreground">Tema: {viewingItem.dados.geral.temaConceito || '-'}</p>
                  <p className="text-sm text-muted-foreground">Status: {viewingItem.dados.geral.status}</p>
                  <p className="text-sm text-muted-foreground">Responsável: {viewingItem.dados.geral.responsavel || '-'}</p>
                  <p className="text-sm text-muted-foreground">Período: {viewingItem.dados.geral.dataInicio || '-'} a {viewingItem.dados.geral.dataTermino || '-'}</p>
                </div>
              )}
              {viewingItem.dados?.residuos?.tipoResiduo && (
                <div><p className="font-semibold text-foreground mb-1">Resíduos</p>
                  <p className="text-sm text-muted-foreground">Tipo: {viewingItem.dados.residuos.tipoResiduo}</p>
                  <p className="text-sm text-muted-foreground">Quantidade: {viewingItem.dados.residuos.quantidadeDisponivel} {viewingItem.dados.residuos.unidade}</p>
                  <p className="text-sm text-muted-foreground">Origem: {viewingItem.dados.residuos.origemResiduo || '-'}</p>
                </div>
              )}
              {viewingItem.dados?.pecas?.pecasSelecionadas?.length > 0 && (
                <div><p className="font-semibold text-foreground mb-1">Peças</p>
                  <p className="text-sm text-muted-foreground">{viewingItem.dados.pecas.pecasSelecionadas.join(', ')}</p>
                  <p className="text-sm text-muted-foreground">Total: {viewingItem.dados.pecas.qtdTotalPecas} peças</p>
                </div>
              )}
              {viewingItem.dados?.orcamento && (
                <div><p className="font-semibold text-foreground mb-1">Orçamento</p>
                  <p className="text-sm text-muted-foreground">Custo: R$ {viewingItem.dados.orcamento.custoTotal?.toFixed(2)} | Margem: {viewingItem.dados.orcamento.margem?.toFixed(1)}%</p>
                </div>
              )}
              {viewingItem.dados?.design?.paletaCores && (
                <div><p className="font-semibold text-foreground mb-1">Design</p>
                  <p className="text-sm text-muted-foreground">Cores: {viewingItem.dados.design.paletaCores}</p>
                </div>
              )}
              {viewingItem.dados?.impacto && (
                <div><p className="font-semibold text-foreground mb-1">Impacto Ambiental</p>
                  <p className="text-sm text-muted-foreground">Índice: {viewingItem.dados.impacto.impactoTotal?.toFixed(1)} pts</p>
                  <p className="text-sm text-muted-foreground">Resíduos: {viewingItem.dados.impacto.residuosEvitados}kg | Água: {viewingItem.dados.impacto.aguaEconomizada}L | CO₂: {viewingItem.dados.impacto.co2Reduzido}kg</p>
                </div>
              )}
              {viewingItem.dados?.responsaveis && (
                <div><p className="font-semibold text-foreground mb-1">Responsáveis</p>
                  <p className="text-sm text-muted-foreground">Design: {viewingItem.dados.responsaveis.respDesign || '-'} | Produção: {viewingItem.dados.responsaveis.respProducao || '-'}</p>
                  <p className="text-sm text-muted-foreground">Qualidade: {viewingItem.dados.responsaveis.respQualidade || '-'} | Marketing: {viewingItem.dados.responsaveis.respMarketing || '-'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SustainableCollectionSection;
