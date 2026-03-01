import { useState, useRef, useEffect } from "react";
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

const createId = () => Math.random().toString(36).slice(2, 9);

const FichaTecnicaForm = () => {
  const [tipoPeca, setTipoPeca] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [colecao, setColecao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [desenhoFile, setDesenhoFile] = useState<File | null>(null);
  const [desenhoPreview, setDesenhoPreview] = useState<string | null>(null);
  
  // Estados das listas
  const [aviamentos, setAviamentos] = useState([{ id: createId(), value: "" }]);
  const [acessorios, setAcessorios] = useState([{ id: createId(), value: "" }]);
  const [linhas, setLinhas] = useState([{ id: createId(), value: "" }]);
  const [tecidos, setTecidos] = useState([{ id: createId(), value: "" }]);
  const [maquinarios, setMaquinarios] = useState([{ id: createId(), value: "" }]);
  const [operacoes, setOperacoes] = useState([{ id: createId(), value: "" }]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para adicionar campos
  const addField = (setter: any) => {
    setter((prev: any) => [...prev, { id: createId(), value: "" }]);
  };

  // Função para remover campos
  const removeField = (setter: any, id: string) => {
    setter((prev: any) => prev.length > 1 ? prev.filter((f: any) => f.id !== id) : prev);
  };

  // Função para atualizar campos
  const updateField = (setter: any, id: string, value: string) => {
    setter((prev: any) => prev.map((f: any) => (f.id === id ? { ...f, value } : f)));
  };

  // Componente para renderizar os campos dinâmicos (Acessórios, Tecidos, etc)
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
          <Input 
            value={field.value} 
            onChange={(e) => updateField(setter, field.id, e.target.value)} 
            placeholder={placeholder} 
            className="bg-white"
          />
          {fields.length > 1 && (
            <button type="button" onClick={() => removeField(setter, field.id)} className="p-2 text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Ficha Técnica</h2>
          <p className="text-gray-500">Preencha os dados da sua peça sustentável</p>
        </div>

        {/* A KEY no formulário resolve o erro de removeChild */}
        <form key={tipoPeca} onSubmit={(e) => { e.preventDefault(); toast.success("Dados salvos!"); }}>
          <Card className="p-6 md:p-8 space-y-8 shadow-md">
            
            {/* Informações Básicas */}
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
                  <Select value={tipoPeca} onValueChange={setTipoPeca}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_PECA.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Detalhes Técnicos */}
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

            <div className="pt-6">
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all">
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
