import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Plus, Trash2, FileText, Scissors, Shirt } from "lucide-react";
import { toast } from "sonner";

// LISTA REDUZIDA E BÁSICA
const TIPOS_PECA = [
  "Blusa", 
  "Camiseta", 
  "Camisa",
  "Top", 
  "Vestido", 
  "Saia", 
  "Calça", 
  "Shorts", 
  "Bermuda", 
  "Macacão", 
  "Jaqueta", 
  "Biquíni", 
  "Maiô", 
  "Saída de Praia", 
  "Fitness",
  "Infantil", 
  "Outros"
];

const createId = () => Math.random().toString(36).slice(2, 9);

const FichaTecnicaForm = () => {
  const [tipoPeca, setTipoPeca] = useState("");
  const [outroTipo, setOutroTipo] = useState(""); 
  const [nomeProduto, setNomeProduto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [colecao, setColecao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [desenhoFile, setDesenhoFile] = useState<File | null>(null);
  const [desenhoPreview, setDesenhoPreview] = useState<string | null>(null);
  
  const [aviamentos, setAviamentos] = useState([{ id: createId(), value: "" }]);
  const [acessorios, setAcessorios] = useState([{ id: createId(), value: "" }]);
  const [linhas, setLinhas] = useState([{ id: createId(), value: "" }]);
  const [tecidos, setTecidos] = useState([{ id: createId(), value: "" }]);
  const [maquinarios, setMaquinarios] = useState([{ id: createId(), value: "" }]);
  const [operacoes, setOperacoes] = useState([{ id: createId(), value: "" }]);

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
    const url = desenhoPreview === "pdf" ? URL.createObjectURL(desenhoFile) : desenhoPreview;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = desenhoFile.name;
    a.click();
  };

  const addField = (setter: any) => setter((prev: any) => [...prev, { id: createId(), value: "" }]);
  const removeField = (setter: any, id: string) => setter((prev: any) => prev.length > 1 ? prev.filter((f: any) => f.id !== id) : prev);
  const updateField = (setter: any, id: string, value: string) => setter((prev: any) => prev.map((f: any) => (f.id === id ? { ...f, value } : f)));

  const renderFields = (label: string, fields: any[], setter: any, placeholder: string) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-bold">{label}</Label>
        <button type="button" onClick={() => addField(setter)} className="text-xs text-primary flex items-center gap-1">
          <Plus className="w-3 h-3" /> Adicionar
        </button>
      </div>
      {fields.map((field) => (
        <div key={field.id} className="flex gap-2">
          <Input value={field.value} onChange={(e) => updateField(setter, field.id, e.target.value)} placeholder={placeholder} />
          {fields.length > 1 && (
            <button type="button" onClick={() => removeField(setter, field.id)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
          )}
        </div>
      ))}
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tipoFinal = tipoPeca === "Outros" ? outroTipo : tipoPeca;
    if (!tipoFinal || !nomeProduto) {
      toast.error("Preencha o nome do produto e o tipo de peça.");
      return;
    }
    toast.success(`Ficha de ${tipoFinal} salva com sucesso!`);
  };

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card key={tipoPeca} className="p-6 md:p-8 space-y-8 shadow-md">
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                <Shirt className="text-primary w-5 h-5" /> Dados da Peça
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nome do Produto *</Label>
                  <Input value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} placeholder="Ex: Blusa Eco" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Peça *</Label>
                  <select 
                    value={tipoPeca} 
                    onChange={(e) => setTipoPeca(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione o tipo</option>
                    {TIPOS_PECA.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {tipoPeca === "Outros" && (
                    <Input 
                      className="mt-2"
                      placeholder="Qual o tipo da peça?" 
                      value={outroTipo}
                      onChange={(e) => setOutroTipo(e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                <Scissors className="text-primary w-5 h-5" /> Detalhes de Produção
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderFields("Tecidos", tecidos, setTecidos, "Ex: Algodão Orgânico")}
                {renderFields("Acessórios", acessorios, setAcessorios, "Ex: Botão de Madeira")}
                {renderFields("Sequência Operacional", operacoes, setOperacoes, "Ex: Costura lateral")}
                {renderFields("Aviamentos", aviamentos, setAviamentos, "Ex: Zíper")}
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:opacity-90">
              Salvar Ficha Técnica
            </button>
          </Card>
        </form>
      </div>
    </section>
  );
};

export default FichaTecnicaForm;
