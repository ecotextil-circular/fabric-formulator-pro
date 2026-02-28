import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Plus, Trash2, FileText, Scissors, Shirt } from "lucide-react";
import { toast } from "sonner";

const TIPOS_PECA = [
  "Blusa", "Bermuda", "Saia Longa", "Saia Curta", "Top", "Jaqueta",
  "Biquíni", "Saída de Praia", "Maiô", "Canga", "Calcinha", "Sutiã",
  "Vestido", "Calça", "Shorts", "Macacão", "Cropped", "Camisa",
  "Moletom", "Regata", "Body",
];

interface DynamicField {
  id: string;
  value: string;
}

const createId = () => Math.random().toString(36).slice(2, 9);

const FichaTecnicaForm = () => {
  const [tipoPeca, setTipoPeca] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [colecao, setColecao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [desenhoFile, setDesenhoFile] = useState<File | null>(null);
  const [desenhoPreview, setDesenhoPreview] = useState<string | null>(null);
  const [aviamentos, setAviamentos] = useState<DynamicField[]>([{ id: createId(), value: "" }]);
  const [acessorios, setAcessorios] = useState<DynamicField[]>([{ id: createId(), value: "" }]);
  const [linhas, setLinhas] = useState<DynamicField[]>([{ id: createId(), value: "" }]);
  const [tecidos, setTecidos] = useState<DynamicField[]>([{ id: createId(), value: "" }]);
  const [maquinarios, setMaquinarios] = useState<DynamicField[]>([{ id: createId(), value: "" }]);
  const [operacoes, setOperacoes] = useState<DynamicField[]>([{ id: createId(), value: "" }]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesenhoFile(file);
      if (file.type === "application/pdf") {
        setDesenhoPreview("pdf");
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => setDesenhoPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDownloadDesenho = () => {
    if (!desenhoFile) return;
    const url = desenhoPreview === "pdf"
      ? URL.createObjectURL(desenhoFile)
      : desenhoPreview;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = desenhoFile.name;
    a.click();
    if (desenhoPreview === "pdf") URL.revokeObjectURL(url);
  };

  const addField = (setter: React.Dispatch<React.SetStateAction<DynamicField[]>>) => {
    setter((prev) => [...prev, { id: createId(), value: "" }]);
  };

  const removeField = (setter: React.Dispatch<React.SetStateAction<DynamicField[]>>, id: string) => {
    setter((prev) => prev.length > 1 ? prev.filter((f) => f.id !== id) : prev);
  };

  const updateField = (setter: React.Dispatch<React.SetStateAction<DynamicField[]>>, id: string, value: string) => {
    setter((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoPeca || !nomeProduto) {
      toast.error("Preencha pelo menos o nome do produto e o tipo de peça.");
      return;
    }
    toast.success("Ficha técnica salva com sucesso!");
  };

  const renderDynamicFields = (
    label: string,
    fields: DynamicField[],
    setter: React.Dispatch<React.SetStateAction<DynamicField[]>>,
    placeholder: string
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">{label}</Label>
        <button
          type="button"
          onClick={() => addField(setter)}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-teal-light transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar
        </button>
      </div>
      {fields.map((field) => (
        <div key={field.id} className="flex gap-2">
          <Input
            value={field.value}
            onChange={(e) => updateField(setter, field.id, e.target.value)}
            placeholder={placeholder}
            className="bg-background border-border focus:ring-primary"
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => removeField(setter, field.id)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section id="ficha-tecnica" className="py-16 px-4 section-gradient">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Scissors className="w-4 h-4" />
            Formulário Completo
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Monte sua Ficha Técnica
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preencha todos os detalhes da sua peça para criar uma ficha técnica profissional e organizada.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="glass-card p-6 md:p-8 rounded-2xl shadow-lg space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold font-display text-foreground flex items-center gap-2">
                <Shirt className="w-5 h-5 text-primary" />
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto *</Label>
                  <Input id="nome" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} placeholder="Ex: Blusa Floral Sustentável" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Peça *</Label>
                  <Select value={tipoPeca} onValueChange={setTipoPeca}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_PECA.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ref">Referência</Label>
                  <Input id="ref" value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Ex: REF-2025-001" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="col">Coleção</Label>
                  <Input id="col" value={colecao} onChange={(e) => setColecao(e.target.value)} placeholder="Ex: Verão 2025" className="bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Descrição</Label>
                <Textarea id="desc" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva a peça, materiais sustentáveis utilizados..." className="bg-background min-h-[100px]" />
              </div>
            </div>

            {/* Product Drawing */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-display text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Desenho do Produto
              </h3>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-background/50 hover:border-primary/50 transition-colors">
                {desenhoPreview ? (
                  <div className="space-y-4">
                    {desenhoPreview === "pdf" ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-16 h-16 text-primary" />
                        <span className="text-sm font-medium text-foreground">{desenhoFile?.name}</span>
                      </div>
                    ) : (
                      <img src={desenhoPreview} alt="Desenho do produto" className="max-h-64 mx-auto rounded-lg shadow-md" />
                    )}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadDesenho}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:brightness-95 transition-all"
                      >
                        <Upload className="w-4 h-4" /> Trocar Arquivo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-3 mx-auto text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Upload className="w-10 h-10" />
                    <span className="font-medium">Clique para enviar o desenho do produto</span>
                    <span className="text-xs">PNG, JPG, SVG ou PDF até 10MB</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*,.pdf,application/pdf" onChange={handleFileUpload} className="hidden" />
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold font-display text-foreground flex items-center gap-2">
                <Scissors className="w-5 h-5 text-primary" />
                Detalhes Técnicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {renderDynamicFields("Tecido", tecidos, setTecidos, "Ex: Algodão orgânico 100%")}
                {renderDynamicFields("Aviamento", aviamentos, setAviamentos, "Ex: Zíper invisível 20cm")}
                {renderDynamicFields("Acessório", acessorios, setAcessorios, "Ex: Botão de madeira natural")}
                {renderDynamicFields("Linha", linhas, setLinhas, "Ex: Linha 120 poliéster reciclado")}
                {renderDynamicFields("Maquinário", maquinarios, setMaquinarios, "Ex: Máquina reta industrial")}
                {renderDynamicFields("Sequência Operacional", operacoes, setOperacoes, "Ex: Unir ombros com overlock")}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-border">
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:brightness-110 transition-all shadow-md"
              >
                Salvar Ficha Técnica
              </button>
            </div>
          </Card>
        </form>
      </div>
    </section>
  );
};

export default FichaTecnicaForm;
