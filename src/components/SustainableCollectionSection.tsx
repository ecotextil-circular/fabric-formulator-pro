import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Save, Eraser, Eye, X, List, Trash2, Leaf, Calculator, Download, Image, FileText, Video } from "lucide-react";
import { toast } from "sonner";
import { useItensSalvos } from "@/hooks/useItensSalvos";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  { name: "Sunset Tropical", colors: ["#FF6F61","#FF8C42","#FFD166","#F4845F","#E76F51","#E9C46A"], desc: "Cores vibrantes do pôr do sol" },
  { name: "Menta & Eucalipto", colors: ["#A8DADC","#457B9D","#1D3557","#E8F5E9","#81C784","#4CAF50"], desc: "Frescor natural de menta" },
  { name: "Nude & Pele", colors: ["#E8C7A0","#D4A574","#C4956A","#B08968","#9C7A5A","#8D6748"], desc: "Tons de pele universais" },
  { name: "Terracota & Argila", colors: ["#C1440E","#D4602C","#E07C4E","#CC704B","#A05A2C","#8B4513"], desc: "Tons quentes de terracota" },
  { name: "Azul Denim", colors: ["#1A237E","#283593","#3949AB","#5C6BC0","#7986CB","#9FA8DA"], desc: "Variações de azul jeans" },
  { name: "Floresta Tropical", colors: ["#004D40","#00695C","#00897B","#26A69A","#4DB6AC","#80CBC4"], desc: "Verde tropical exuberante" },
  { name: "Pastel Suave", colors: ["#FFD3E0","#C5CAE9","#B2EBF2","#DCEDC8","#FFF9C4","#F8BBD0"], desc: "Cores pastel delicadas" },
  { name: "Vinho & Burgundy", colors: ["#4A0E0E","#6B1D1D","#8B2252","#722F37","#800020","#A52A2A"], desc: "Tons ricos de vinho" },
];

const ALL_COLORS: { hex: string; name: string }[] = [
  // Brancos e Cremes
  { hex: "#FFFFFF", name: "Branco" }, { hex: "#FFFAF0", name: "Branco Floral" }, { hex: "#FFF8DC", name: "Creme Cornsilk" }, { hex: "#F5F5DC", name: "Bege" }, { hex: "#F5E6CC", name: "Creme" }, { hex: "#FAF0E6", name: "Linho" }, { hex: "#FAEBD7", name: "Branco Antigo" }, { hex: "#FFF5EE", name: "Concha" },
  // Amarelos e Dourados
  { hex: "#FFD700", name: "Ouro" }, { hex: "#F0C420", name: "Amarelo Sol" }, { hex: "#F9A825", name: "Amarelo Ouro" }, { hex: "#DAA520", name: "Ouro Velho" }, { hex: "#D4A017", name: "Mostarda" }, { hex: "#C68E17", name: "Mostarda Escura" }, { hex: "#B8860B", name: "Dourado Escuro" }, { hex: "#E8A317", name: "Âmbar" }, { hex: "#FFF9C4", name: "Amarelo Pastel" }, { hex: "#FFE082", name: "Amarelo Claro" }, { hex: "#FFCA28", name: "Amarelo Vivo" },
  // Laranjas e Pêssego
  { hex: "#FF8C00", name: "Laranja Escuro" }, { hex: "#F57C00", name: "Laranja" }, { hex: "#FF6F61", name: "Coral Vivo" }, { hex: "#FAD6A5", name: "Pêssego" }, { hex: "#FFAB91", name: "Salmão Claro" }, { hex: "#E57373", name: "Coral Rosa" }, { hex: "#FF8C42", name: "Laranja Queimado" }, { hex: "#FFD166", name: "Mel" }, { hex: "#F4845F", name: "Laranja Suave" }, { hex: "#E76F51", name: "Laranja Terra" },
  // Vermelhos
  { hex: "#DC143C", name: "Carmesim" }, { hex: "#8B0000", name: "Vermelho Escuro" }, { hex: "#800020", name: "Borgonha" }, { hex: "#A35D5D", name: "Terracota Rosa" }, { hex: "#C97B7B", name: "Rosa Queimado" }, { hex: "#C1440E", name: "Terracota" }, { hex: "#A52A2A", name: "Marrom Avermelhado" }, { hex: "#722F37", name: "Vinho" },
  // Rosas
  { hex: "#D4A5A5", name: "Rosa Antigo" }, { hex: "#E8B4B8", name: "Rosa Claro" }, { hex: "#F0C2C2", name: "Rosa Pétala" }, { hex: "#B56E6E", name: "Rosa Seco" }, { hex: "#FFB6C1", name: "Rosa Bebê" }, { hex: "#DB7093", name: "Rosa Médio" }, { hex: "#FFD3E0", name: "Rosa Pastel" }, { hex: "#F8BBD0", name: "Rosa Suave" },
  // Roxos e Lavandas
  { hex: "#4B0082", name: "Índigo" }, { hex: "#6A0DAD", name: "Roxo Escuro" }, { hex: "#7B6D8D", name: "Lavanda Escuro" }, { hex: "#9B8BB4", name: "Lavanda" }, { hex: "#C8B8DB", name: "Lavanda Claro" }, { hex: "#8E7FB0", name: "Lilás" }, { hex: "#B0A0C8", name: "Ametista" }, { hex: "#D8CCE8", name: "Lavanda Suave" }, { hex: "#C5CAE9", name: "Lavanda Azulado" }, { hex: "#8B2252", name: "Magenta Escuro" },
  // Azuis
  { hex: "#000080", name: "Azul Marinho" }, { hex: "#1B4965", name: "Azul Noite" }, { hex: "#2980B9", name: "Azul Royal" }, { hex: "#5DADE2", name: "Azul Celeste" }, { hex: "#5B9BD5", name: "Azul Aço" }, { hex: "#2C6E8C", name: "Azul Petróleo" }, { hex: "#3D8DAF", name: "Azul Claro" }, { hex: "#5ABED6", name: "Azul Céu" }, { hex: "#87CEEB", name: "Azul Bebê" }, { hex: "#B0E0E6", name: "Azul Pó" }, { hex: "#1A237E", name: "Azul Escuro" }, { hex: "#283593", name: "Azul Índigo" }, { hex: "#3949AB", name: "Azul Safira" }, { hex: "#5C6BC0", name: "Azul Lavanda" }, { hex: "#7986CB", name: "Azul Suave" }, { hex: "#9FA8DA", name: "Azul Pastel" }, { hex: "#B2EBF2", name: "Ciano Pastel" }, { hex: "#457B9D", name: "Azul Tempestade" }, { hex: "#1D3557", name: "Azul Meia-Noite" },
  // Teais e Turquesas
  { hex: "#4A8C8C", name: "Teal" }, { hex: "#4A7C91", name: "Teal Escuro" }, { hex: "#6EADC1", name: "Turquesa" }, { hex: "#1B5E50", name: "Verde Petróleo" }, { hex: "#006D5B", name: "Verde Jade" }, { hex: "#A8DADC", name: "Turquesa Claro" }, { hex: "#80CBC4", name: "Turquesa Suave" }, { hex: "#4DB6AC", name: "Verde Água" }, { hex: "#26A69A", name: "Verde Teal" },
  // Verdes
  { hex: "#2D5016", name: "Verde Floresta" }, { hex: "#3A7D44", name: "Verde Esmeralda" }, { hex: "#556B2F", name: "Verde Oliva" }, { hex: "#6B8E23", name: "Verde Lima Escuro" }, { hex: "#69B578", name: "Verde Menta" }, { hex: "#A7C957", name: "Verde Abacate" }, { hex: "#8FBC8F", name: "Verde Salvia" }, { hex: "#9CCC65", name: "Verde Claro" }, { hex: "#5D8A5E", name: "Verde Musgo" }, { hex: "#228B22", name: "Verde Floresta Vivo" }, { hex: "#004D40", name: "Verde Escuro" }, { hex: "#00695C", name: "Verde Esmeralda Escuro" }, { hex: "#00897B", name: "Verde Mar" }, { hex: "#81C784", name: "Verde Pastel" }, { hex: "#4CAF50", name: "Verde Vivo" }, { hex: "#E8F5E9", name: "Verde Menta Claro" }, { hex: "#DCEDC8", name: "Verde Lima Pastel" },
  // Marrons e Nudes
  { hex: "#5C4033", name: "Marrom Escuro" }, { hex: "#8B7355", name: "Marrom Café" }, { hex: "#8D5524", name: "Marrom Terra" }, { hex: "#D2691E", name: "Chocolate" }, { hex: "#8D6E63", name: "Marrom Rosado" }, { hex: "#A0826D", name: "Marrom Claro" }, { hex: "#C4A35A", name: "Dourado Suave" }, { hex: "#C4AE97", name: "Camelo" }, { hex: "#D4C5A9", name: "Areia" }, { hex: "#D5C4B0", name: "Bege Rosado" }, { hex: "#B8A088", name: "Areia Escura" }, { hex: "#9C8B72", name: "Taupe" }, { hex: "#C2B280", name: "Caqui" }, { hex: "#E8C7A0", name: "Nude Claro" }, { hex: "#D4A574", name: "Nude Médio" }, { hex: "#C4956A", name: "Nude Quente" }, { hex: "#B08968", name: "Nude Escuro" }, { hex: "#9C7A5A", name: "Castanho" }, { hex: "#8D6748", name: "Café" }, { hex: "#8B4513", name: "Sela" },
  // Cinzas
  { hex: "#2F4F4F", name: "Cinza Ardósia" }, { hex: "#6B6B6B", name: "Cinza Escuro" }, { hex: "#808080", name: "Cinza Médio" }, { hex: "#A9A9A9", name: "Cinza" }, { hex: "#C0C0C0", name: "Prata" }, { hex: "#D3D3D3", name: "Cinza Claro" }, { hex: "#E0E0E0", name: "Cinza Pérola" }, { hex: "#BDBDBD", name: "Cinza Neutro" },
  // Preto
  { hex: "#000000", name: "Preto" }, { hex: "#1C1C1C", name: "Preto Suave" }, { hex: "#333333", name: "Carvão" },
];

const LIGHT_COLORS = ['#FFFFFF','#FFFAF0','#FFF8DC','#F5F5DC','#F5E6CC','#FAF0E6','#FAEBD7','#FFF5EE','#FFD700','#F0C420','#F9A825','#FAD6A5','#FFAB91','#F0C2C2','#E8B4B8','#FFB6C1','#C8B8DB','#D8CCE8','#87CEEB','#B0E0E6','#D3D3D3','#E0E0E0','#C0C0C0','#D5C4B0','#C4AE97','#A9A9A9','#BDBDBD','#9CCC65','#A7C957','#FFD3E0','#F8BBD0','#C5CAE9','#B2EBF2','#DCEDC8','#FFF9C4','#FFE082','#FFCA28','#FFD166','#A8DADC','#80CBC4','#4DB6AC','#81C784','#E8F5E9','#9FA8DA','#7986CB','#E8C7A0'];

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
  const [referenciasFiles, setReferenciasFiles] = useState<{ emoji: string; name: string; url: string }[]>([]);
  const [esbocosFiles, setEsbocosFiles] = useState<{ emoji: string; name: string; url: string }[]>([]);
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
  const getColorName = (hex: string) => ALL_COLORS.find(c => c.hex === hex)?.name || hex;
  const toggleColor = (hex: string) => {
    setSelectedColors(prev => prev.includes(hex) ? prev.filter(x => x !== hex) : [...prev, hex]);
    setPaletaCores(prev => {
      const items = prev ? prev.split(', ').filter(Boolean) : [];
      if (items.find(i => i.includes(hex))) return items.filter(i => !i.includes(hex)).join(', ');
      const colorName = getColorName(hex);
      return [...items, `${colorName} (${hex})`].join(', ');
    });
  };

  const handleDownloadField = (content: string, fieldName: string, format: string) => {
    if (!content.trim()) { toast.error("Campo vazio, nada para baixar."); return; }
    let blob: Blob;
    let ext: string;
    if (format === 'pdf') {
      const html = `<html><head><meta charset="utf-8"><title>${fieldName}</title><style>body{font-family:Arial;padding:40px;white-space:pre-wrap;}</style></head><body><h1>${fieldName}</h1><p>${content}</p></body></html>`;
      blob = new Blob([html], { type: 'text/html' });
      ext = 'html';
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) win.onload = () => win.print();
      return;
    } else if (format === 'txt') {
      blob = new Blob([`${fieldName}\n\n${content}`], { type: 'text/plain' });
      ext = 'txt';
    } else {
      blob = new Blob([`${fieldName}\n\n${content}`], { type: 'text/plain' });
      ext = 'txt';
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${fieldName.replace(/\s/g, '_')}.${ext}`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`${fieldName} baixado!`);
  };

  // Extract uploaded file entries from text (emoji name — url)
  const extractFiles = (text: string) => {
    if (!text) return [];
    const lines = text.split('\n');
    const files: { emoji: string; name: string; url: string }[] = [];
    for (const line of lines) {
      const match = line.match(/^(📄|📎|🎬)\s*(.+?)\s*—\s*(https?:\/\/.+)$/);
      if (match) {
        files.push({ emoji: match[1], name: match[2].trim(), url: match[3].trim() });
      }
    }
    return files;
  };

  const getFileIcon = (emoji: string) => {
    if (emoji === '📄') return <FileText className="w-4 h-4 text-red-500" />;
    if (emoji === '📎') return <Image className="w-4 h-4 text-blue-500" />;
    if (emoji === '🎬') return <Video className="w-4 h-4 text-purple-500" />;
    return <FileText className="w-4 h-4" />;
  };

  const getFileType = (emoji: string) => {
    if (emoji === '📄') return 'PDF';
    if (emoji === '📎') return 'Imagem';
    if (emoji === '🎬') return 'Vídeo';
    return 'Arquivo';
  };

  const removeFileFromField = (url: string, setField: (value: string | ((prev: string) => string)) => void) => {
    setField(prev => prev.split('\n').filter(line => !line.includes(url)).join('\n').trim());
  };

  const FileList = ({ content, setField }: { content: string; setField: (value: string | ((prev: string) => string)) => void }) => {
    const files = extractFiles(content);
    if (files.length === 0) return null;
    return (
      <div className="mt-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Arquivos enviados ({files.length})</p>
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border hover:shadow-sm transition-all">
            {getFileIcon(f.emoji)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
              <p className="text-xs text-muted-foreground">{getFileType(f.emoji)}</p>
            </div>
            <a href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-all" onClick={e => e.stopPropagation()}>
              <Eye className="w-3 h-3" /> Abrir
            </a>
            <a href={f.url} download className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 border border-border transition-all" onClick={e => e.stopPropagation()}>
              <Download className="w-3 h-3" /> Baixar
            </a>
            <button onClick={() => removeFileFromField(f.url, setField)} className="p-1.5 text-muted-foreground hover:text-destructive rounded transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const DownloadButtons = ({ content, fieldName }: { content: string; fieldName: string }) => (
    <div className="flex gap-2 mt-2 flex-wrap">
      <button type="button" onClick={() => handleDownloadField(content, fieldName, 'pdf')} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 border border-border transition-all">
        <FileText className="w-3 h-3" /> PDF
      </button>
      <button type="button" onClick={() => handleDownloadField(content, fieldName, 'txt')} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 border border-border transition-all">
        <Download className="w-3 h-3" /> TXT
      </button>
    </div>
  );

  const uploadAndAttachFile = async (
    file: File,
    setField: (value: string | ((prev: string) => string)) => void,
    emoji: string
  ) => {
    if (!user?.id) {
      toast.error("Faça login para enviar arquivos.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Arquivo muito grande (máximo 20MB).");
      return;
    }

    try {
      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
      const path = `${user.id}/colecao/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("uploads").getPublicUrl(path);
      setField(prev => (prev ? `${prev}\n${emoji} ${file.name} — ${data.publicUrl}` : `${emoji} ${file.name} — ${data.publicUrl}`));
      toast.success(`Arquivo "${file.name}" enviado!`);
    } catch (error: any) {
      console.error("Erro no upload de arquivo:", error);
      toast.error(`Erro ao enviar arquivo: ${error?.message || "tente novamente"}`);
    }
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

  const NomeColecaoField = () => (
    <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
      <Label className="text-base font-semibold">Nome da Coleção *</Label>
      <Input value={nomeColecao} onChange={e => setNomeColecao(e.target.value)} placeholder="Ex: Coleção Verão Sustentável" className="bg-background text-base mt-1" />
    </div>
  );

  // Selected colors display component (badges with color square + hex)
  const SelectedColorsDisplay = () => {
    if (selectedColors.length === 0) return null;
    return (
      <div className="p-3 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm font-semibold text-foreground mb-2">Cores selecionadas:</p>
        <div className="flex flex-wrap gap-2">
          {selectedColors.map(hex => (
            <div key={hex} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background border border-border shadow-sm">
              <span className="w-5 h-5 rounded border border-border/50 shrink-0" style={{ backgroundColor: hex }} />
              <span className="text-xs font-medium text-foreground">{hex}</span>
              <button onClick={() => toggleColor(hex)} className="ml-0.5 text-muted-foreground hover:text-destructive text-xs font-bold">×</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
              
              {/* Selected colors at TOP */}
              <SelectedColorsDisplay />

              <div><Label className="text-base">Paleta de Cores da Coleção</Label><Input value={paletaCores} onChange={e => setPaletaCores(e.target.value)} placeholder="Clique nas cores abaixo ou digite manualmente" className="bg-background text-base" /></div>
              
              <div>
                <Label className="text-base mb-2 block">Paletas Predefinidas</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PALETAS.map(p => (
                    <Card key={p.name} className="p-3 rounded-xl border border-border cursor-pointer hover:shadow-md" onClick={() => {
                      setSelectedColors(p.colors);
                      setPaletaCores(p.colors.map(c => `${getColorName(c)} (${c})`).join(', '));
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
                <p className="text-sm text-muted-foreground mb-3">Clique nas cores para adicioná-las à paleta.</p>
                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5">
                  {ALL_COLORS.map((c, i) => (
                    <button key={i} onClick={() => toggleColor(c.hex)} className={`w-full aspect-square rounded border-2 transition-all relative ${selectedColors.includes(c.hex) ? "border-foreground scale-110 shadow-lg z-10" : "border-transparent hover:border-border hover:scale-105"}`} style={{ backgroundColor: c.hex }} title={`${c.name} (${c.hex})`}>
                      {selectedColors.includes(c.hex) && <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-bold drop-shadow-lg" style={{ color: LIGHT_COLORS.includes(c.hex) ? '#333' : '#fff' }}>✓</span></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected colors also at BOTTOM */}
              <SelectedColorsDisplay />

              <div>
                <Label className="text-base">Referências Visuais</Label>
                <Textarea value={referenciasVisuais} onChange={e => setReferenciasVisuais(e.target.value)} placeholder="Descreva as inspirações visuais, moodboard..." className="bg-background text-base" />
                <div className="flex gap-2 mt-2 flex-wrap">
                  <DownloadButtons content={referenciasVisuais} fieldName="Referências Visuais" />
                  <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 border border-border transition-all cursor-pointer">
                    <FileText className="w-3 h-3" /> PDF
                    <input type="file" accept="application/pdf" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadAndAttachFile(file, setReferenciasVisuais, "📄");
                    }} />
                  </label>
                  <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-all cursor-pointer">
                    <Image className="w-3 h-3" /> PNG/JPEG
                    <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadAndAttachFile(file, setReferenciasVisuais, "📎");
                    }} />
                  </label>
                  <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-all cursor-pointer">
                    <Video className="w-3 h-3" /> MP4
                    <input type="file" accept="video/mp4" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadAndAttachFile(file, setReferenciasVisuais, "🎬");
                    }} />
                  </label>
                </div>
                <FileList content={referenciasVisuais} setField={setReferenciasVisuais} />
              </div>
              <div>
                <Label className="text-base">Esboços/Croquis</Label>
                <Textarea value={esbocosCroquis} onChange={e => setEsbocosCroquis(e.target.value)} placeholder="Descreva os esboços desenvolvidos..." className="bg-background text-base" />
                <div className="flex gap-2 mt-2 flex-wrap">
                  <DownloadButtons content={esbocosCroquis} fieldName="Esboços e Croquis" />
                  <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 border border-border transition-all cursor-pointer">
                    <FileText className="w-3 h-3" /> PDF
                    <input type="file" accept="application/pdf" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadAndAttachFile(file, setEsbocosCroquis, "📄");
                    }} />
                  </label>
                  <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-all cursor-pointer">
                    <Image className="w-3 h-3" /> PNG/JPEG
                    <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadAndAttachFile(file, setEsbocosCroquis, "📎");
                    }} />
                  </label>
                  <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-all cursor-pointer">
                    <Video className="w-3 h-3" /> MP4
                    <input type="file" accept="video/mp4" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadAndAttachFile(file, setEsbocosCroquis, "🎬");
                    }} />
                  </label>
                </div>
                <FileList content={esbocosCroquis} setField={setEsbocosCroquis} />
              </div>
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
              {viewingItem.dados?.design?.selectedColors?.length > 0 && (
                <div><p className="font-semibold text-foreground mb-1">Design - Cores</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {viewingItem.dados.design.selectedColors.map((hex: string) => (
                      <div key={hex} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted border border-border">
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: hex }} />
                        <span className="text-xs">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Show uploaded files from design fields */}
              {(extractFiles(viewingItem.dados?.design?.referenciasVisuais || '').length > 0 || extractFiles(viewingItem.dados?.design?.esbocosCroquis || '').length > 0) && (
                <div>
                  <p className="font-semibold text-foreground mb-2">Arquivos Enviados</p>
                  {extractFiles(viewingItem.dados?.design?.referenciasVisuais || '').map((f: any, i: number) => (
                    <a key={`ref-${i}`} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border hover:shadow-sm mb-2 transition-all">
                      {getFileIcon(f.emoji)}
                      <span className="text-sm font-medium text-foreground flex-1 truncate">{f.name}</span>
                      <span className="text-xs text-muted-foreground">Referência</span>
                      <Eye className="w-3.5 h-3.5 text-primary" />
                    </a>
                  ))}
                  {extractFiles(viewingItem.dados?.design?.esbocosCroquis || '').map((f: any, i: number) => (
                    <a key={`esb-${i}`} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border hover:shadow-sm mb-2 transition-all">
                      {getFileIcon(f.emoji)}
                      <span className="text-sm font-medium text-foreground flex-1 truncate">{f.name}</span>
                      <span className="text-xs text-muted-foreground">Esboço</span>
                      <Eye className="w-3.5 h-3.5 text-primary" />
                    </a>
                  ))}
                </div>
              )}
              {viewingItem.dados?.impacto && (
                <div><p className="font-semibold text-foreground mb-1">Impacto Ambiental</p>
                  <p className="text-sm text-muted-foreground">Índice: {viewingItem.dados.impacto.impactoTotal?.toFixed(1)} pts</p>
                </div>
              )}
              {viewingItem.dados?.responsaveis && (
                <div><p className="font-semibold text-foreground mb-1">Responsáveis</p>
                  <p className="text-sm text-muted-foreground">Design: {viewingItem.dados.responsaveis.respDesign || '-'}</p>
                  <p className="text-sm text-muted-foreground">Produção: {viewingItem.dados.responsaveis.respProducao || '-'}</p>
                  <p className="text-sm text-muted-foreground">Qualidade: {viewingItem.dados.responsaveis.respQualidade || '-'}</p>
                  <p className="text-sm text-muted-foreground">Marketing: {viewingItem.dados.responsaveis.respMarketing || '-'}</p>
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
