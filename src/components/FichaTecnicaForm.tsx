import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Download, Upload, FileText, Loader2, Eye, X, Eraser } from "lucide-react";
import SectionBanner, { SECTION_BANNERS } from "@/components/SectionBanner";
import { useSupabaseCrud } from "@/hooks/useSupabaseCrud";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const TIPOS_PECA = [
  "Blusa", "Camiseta", "Camisa", "Top", "Vestido", "Saia", "Calça",
  "Shorts", "Bermuda", "Macacão", "Jaqueta", "Biquíni", "Maiô",
  "Fitness", "Infantil", "Sunga", "Cueca", "Calcinha", "Sutiã",
  "Lingerie", "Outros"
];

const MAQUINARIO_OPCOES = [
  "Overloque", "Reta Industrial", "Colarete", "Botoneira", "Caseadeira",
  "Galoneira", "Interloque", "Prespontadeira", "Travete", "Máquina de Corte",
  "Enfestadeira", "Prensa Térmica", "Bordadeira Industrial", "Máquina de Passar",
  "Refiladeira", "Elastiqueira", "Fechadeira de Braço", "Outros"
];

const SEQUENCIA_OPCOES = [
  "Cortar tecido", "Separar peças", "Marcar piques", "Fechar ombro",
  "Fechar lateral", "Pregar manga", "Fazer barra", "Pregar gola",
  "Pregar punho", "Fazer cós", "Pregar elástico", "Pregar zíper",
  "Pregar botão", "Fazer casa de botão", "Pregar etiqueta",
  "Fazer acabamento", "Passar peça", "Embalar", "Revisão de qualidade",
  "Pregar viés", "Rebater costura", "Pespontar", "Pregar bolso",
  "Outros"
];

const TECIDO_OPCOES = [
  "Malha", "Viscolycra", "Suplex", "Cotton", "Moletom", "Ribana",
  "Helanca", "Dry Fit", "Crepe", "Cetim", "Chiffon", "Organza",
  "Tule", "Renda", "Jeans/Denim", "Sarja", "Linho", "Seda",
  "Tricoline", "Oxford", "Tactel", "Lycra", "Piquet", "Neoprene",
  "Jacquard", "Veludo", "Cambraia", "Outros"
];

const AVIAMENTO_OPCOES = [
  "Linha", "Botão", "Zíper", "Elástico", "Viés", "Fita",
  "Entretela", "Ilhós", "Rebite", "Colchete", "Velcro",
  "Cordão", "Cadarço", "Fivela", "Argola", "Regulador",
  "Etiqueta", "Tag", "Outros"
];

const ACESSORIO_OPCOES = [
  "Fivela", "Argola", "Mosquetão", "Ilhós", "Rebite", "Strass",
  "Pedraria", "Aplique", "Patch", "Bordado", "Transfer",
  "Corrente", "Pingente", "Botão Decorativo", "Outros"
];

interface Tecido { nome: string; composicao: string; largura: string; fornecedor: string; }
interface Aviamento { tipo: string; cor: string; tamanho: string; quantidade: string; }

const sectionStyle: React.CSSProperties = { marginBottom: '24px', padding: '20px', backgroundColor: 'hsl(36, 33%, 97%)', borderRadius: '10px' };
const sectionTitle: React.CSSProperties = { fontSize: '17px', fontWeight: '700', marginBottom: '14px', color: 'hsl(160, 25%, 14%)', display: 'flex', alignItems: 'center', gap: '8px' };
const inputStyle: React.CSSProperties = { padding: '10px 12px', borderRadius: '8px', border: '1px solid hsl(40, 22%, 85%)', width: '100%', fontSize: '15px' };
const smallInputStyle: React.CSSProperties = { ...inputStyle, flex: 1, minWidth: 0 };
const labelStyle: React.CSSProperties = { fontWeight: '600', color: 'hsl(160, 12%, 40%)', fontSize: '14px', marginBottom: '4px', display: 'block', overflow: 'visible', whiteSpace: 'normal', wordBreak: 'keep-all' };
const addBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: 'hsl(42, 40%, 86%)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: 'hsl(160, 12%, 40%)' };
const removeBtnStyle: React.CSSProperties = { padding: '6px', backgroundColor: 'hsl(0, 80%, 94%)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'hsl(0, 65%, 52%)', display: 'flex', alignItems: 'center' };
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer', backgroundColor: '#fff' };

const FichaTecnicaForm = () => {
  const { user } = useAuth();
  const { items: fichasDb, loading: fichasLoading, insertItem, deleteItem } = useSupabaseCrud<any>("fichas_tecnicas");

  const [tipoPeca, setTipoPeca] = useState("");
  const [outroTipo, setOutroTipo] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [colecao, setColecao] = useState("");
  const [designer, setDesigner] = useState("");
  const [dataCriacao, setDataCriacao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [desenhoFile, setDesenhoFile] = useState<File | null>(null);
  const [desenhoPreview, setDesenhoPreview] = useState<string | null>(null);
  const [desenhoType, setDesenhoType] = useState<string>("");
  const [desenhoStorageUrl, setDesenhoStorageUrl] = useState<string>("");
  const [tecidos, setTecidos] = useState<Tecido[]>([]);
  const [aviamentos, setAviamentos] = useState<Aviamento[]>([]);
  const [acessorios, setAcessorios] = useState<string[]>([]);
  const [maquinario, setMaquinario] = useState<string[]>([]);
  const [sequenciaOperacional, setSequenciaOperacional] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingFicha, setViewingFicha] = useState<any>(null);

  // Select states for adding with dropdown
  const [selMaquina, setSelMaquina] = useState("");
  const [outroMaquina, setOutroMaquina] = useState("");
  const [selSequencia, setSelSequencia] = useState("");
  const [outroSequencia, setOutroSequencia] = useState("");
  const [selTecido, setSelTecido] = useState("");
  const [outroTecido, setOutroTecido] = useState("");
  const [selAviamento, setSelAviamento] = useState("");
  const [outroAviamento, setOutroAviamento] = useState("");
  const [selAcessorio, setSelAcessorio] = useState("");
  const [outroAcessorio, setOutroAcessorio] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    if (file.size > 20 * 1024 * 1024) { toast.error('Arquivo muito grande (máximo 20MB)'); return; }

    try {
      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
      const path = `${user.id}/fichas/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("uploads").getPublicUrl(path);
      setDesenhoStorageUrl(data.publicUrl);
      setDesenhoFile(file);
      setDesenhoType(file.type);

      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        setDesenhoPreview(URL.createObjectURL(file));
      } else {
        setDesenhoPreview(null);
      }

      toast.success(`Arquivo "${file.name}" enviado com sucesso!`);
    } catch (error: any) {
      console.error("Erro no upload do desenho:", error);
      toast.error(`Erro ao enviar arquivo: ${error?.message || "tente novamente"}`);
    }
  };

  const handleDownloadDesenho = () => {
    const downloadUrl = desenhoStorageUrl || (desenhoFile ? URL.createObjectURL(desenhoFile) : "");
    if (!downloadUrl) { toast.error('Nenhum desenho para baixar'); return; }

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = desenhoFile?.name || `desenho-tecnico-${Date.now()}`;
    a.click();

    if (!desenhoStorageUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const handleDownloadFicha = () => {
    const tipoFinal = tipoPeca === "Outros" ? outroTipo : tipoPeca;
    const html = `<html><head><meta charset="utf-8"><title>Ficha Técnica - ${nomeProduto}</title>
    <style>body{font-family:Arial,sans-serif;padding:40px;color:#1e293b;max-width:800px;margin:0 auto}h1{text-align:center;color:#0f172a;border-bottom:2px solid #0ea5e9;padding-bottom:12px}h2{color:#0ea5e9;margin-top:24px;font-size:16px}table{width:100%;border-collapse:collapse;margin:8px 0}td,th{border:1px solid #cbd5e1;padding:8px;text-align:left;font-size:13px}th{background:#f1f5f9;font-weight:600}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.info-item span{font-weight:600;color:#475569}ol,ul{padding-left:20px;font-size:13px}.obs{background:#f8fafc;padding:12px;border-radius:6px;font-size:13px;white-space:pre-wrap}</style></head><body>
    <h1>Ficha Técnica</h1>
    <div class="info-grid">
      <div class="info-item"><span>Produto:</span> ${nomeProduto}</div>
      <div class="info-item"><span>Tipo:</span> ${tipoFinal}</div>
      <div class="info-item"><span>Referência:</span> ${referencia}</div>
      <div class="info-item"><span>Coleção:</span> ${colecao}</div>
      <div class="info-item"><span>Designer:</span> ${designer}</div>
      <div class="info-item"><span>Data:</span> ${dataCriacao}</div>
    </div>
    ${tecidos.length > 0 ? `<h2>Tecidos</h2><table><tr><th>Nome</th><th>Composição</th><th>Largura</th><th>Fornecedor</th></tr>${tecidos.map(t => `<tr><td>${t.nome}</td><td>${t.composicao}</td><td>${t.largura}</td><td>${t.fornecedor}</td></tr>`).join('')}</table>` : ''}
    ${aviamentos.length > 0 ? `<h2>Aviamentos</h2><table><tr><th>Tipo</th><th>Cor</th><th>Tamanho</th><th>Qtd</th></tr>${aviamentos.map(a => `<tr><td>${a.tipo}</td><td>${a.cor}</td><td>${a.tamanho}</td><td>${a.quantidade}</td></tr>`).join('')}</table>` : ''}
    ${acessorios.length > 0 ? `<h2>Acessórios</h2><ul>${acessorios.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
    ${maquinario.length > 0 ? `<h2>Maquinário</h2><ul>${maquinario.map(m => `<li>${m}</li>`).join('')}</ul>` : ''}
    ${sequenciaOperacional.length > 0 ? `<h2>Sequência Operacional</h2><ol>${sequenciaOperacional.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}
    ${observacoes ? `<h2>Observações</h2><div class="obs">${observacoes}</div>` : ''}
    </body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) { win.onload = () => { win.print(); }; }
    toast.success("Ficha técnica aberta para impressão/download!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) { toast.error("Você precisa estar autenticado"); return; }
    if (!nomeProduto.trim()) { toast.error("Nome do produto é obrigatório"); return; }
    if (!tipoPeca) { toast.error("Tipo de peça é obrigatório"); return; }

    try {
      setIsLoading(true);
      const tipoFinal = tipoPeca === "Outros" ? outroTipo : tipoPeca;
      const result = await insertItem({
        referencia_codigo: referencia || null,
        data_criacao: dataCriacao || null,
        dados: {
          nomeProduto, tipoPeca: tipoFinal, colecao, designer,
          dataCriacao, observacoes, tecidos, aviamentos, acessorios,
          maquinario, sequenciaOperacional,
          desenho_url: desenhoStorageUrl || null,
          desenho_nome: desenhoFile?.name || null,
          desenho_tipo: desenhoType || null,
        },
      });
      if (result) {
        handleLimparFormulario();
        toast.success("Ficha técnica salva com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar ficha técnica");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimparFormulario = () => {
    setNomeProduto(""); setReferencia(""); setTipoPeca(""); setOutroTipo("");
    setColecao(""); setDesigner(""); setDataCriacao(""); setObservacoes("");
    setTecidos([]); setAviamentos([]); setAcessorios([]); setMaquinario([]);
    setSequenciaOperacional([]); setDesenhoFile(null); setDesenhoPreview(null); setDesenhoType(""); setDesenhoStorageUrl("");
    setSelMaquina(""); setOutroMaquina(""); setSelSequencia(""); setOutroSequencia("");
    setSelTecido(""); setOutroTecido(""); setSelAviamento(""); setOutroAviamento("");
    setSelAcessorio(""); setOutroAcessorio("");
    toast.success("Formulário limpo!");
  };

  const addMaquina = () => {
    const val = selMaquina === "Outros" ? outroMaquina.trim() : selMaquina;
    if (!val) { toast.error("Selecione ou digite uma máquina"); return; }
    setMaquinario([...maquinario, val]);
    setSelMaquina(""); setOutroMaquina("");
  };

  const addSequencia = () => {
    const val = selSequencia === "Outros" ? outroSequencia.trim() : selSequencia;
    if (!val) { toast.error("Selecione ou digite uma etapa"); return; }
    setSequenciaOperacional([...sequenciaOperacional, val]);
    setSelSequencia(""); setOutroSequencia("");
  };

  const addTecidoFromSelect = () => {
    const nome = selTecido === "Outros" ? outroTecido.trim() : selTecido;
    if (!nome) { toast.error("Selecione ou digite um tecido"); return; }
    setTecidos([...tecidos, { nome, composicao: '', largura: '', fornecedor: '' }]);
    setSelTecido(""); setOutroTecido("");
  };

  const addAviamentoFromSelect = () => {
    const tipo = selAviamento === "Outros" ? outroAviamento.trim() : selAviamento;
    if (!tipo) { toast.error("Selecione ou digite um aviamento"); return; }
    setAviamentos([...aviamentos, { tipo, cor: '', tamanho: '', quantidade: '' }]);
    setSelAviamento(""); setOutroAviamento("");
  };

  const addAcessorioFromSelect = () => {
    const val = selAcessorio === "Outros" ? outroAcessorio.trim() : selAcessorio;
    if (!val) { toast.error("Selecione ou digite um acessório"); return; }
    setAcessorios([...acessorios, val]);
    setSelAcessorio(""); setOutroAcessorio("");
  };

  return (
    <section id="ficha-tecnica" style={{ padding: '40px 16px', minHeight: '100vh' }} className="bg-background">
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'hsl(36, 30%, 95%)', padding: '30px', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '6px', textAlign: 'center' }} className="text-foreground font-display">
          <FileText style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} size={26} />
          Nova Ficha Técnica
        </h2>
        <p style={{ textAlign: 'center', fontSize: '15px', marginBottom: '24px' }} className="text-muted-foreground">
          Preencha todos os detalhes do produto
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <div style={sectionStyle}>
            <div style={sectionTitle}>📋 Informações Básicas</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div><label style={labelStyle}>Nome do Produto *</label><input style={inputStyle} value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} placeholder="Ex: Blusa Verão" /></div>
              <div><label style={labelStyle}>Referência / Código</label><input style={inputStyle} value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Ex: REF-001" /></div>
              <div>
                <label style={labelStyle}>Tipo de Peça *</label>
                <select style={selectStyle} value={tipoPeca} onChange={e => setTipoPeca(e.target.value)}>
                  <option value="">Selecione...</option>
                  {TIPOS_PECA.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {tipoPeca === "Outros" && <input style={{ ...inputStyle, marginTop: '8px' }} placeholder="Digite o tipo" value={outroTipo} onChange={e => setOutroTipo(e.target.value)} />}
              </div>
              <div><label style={labelStyle}>Coleção</label><input style={inputStyle} value={colecao} onChange={e => setColecao(e.target.value)} placeholder="Ex: Primavera 2026" /></div>
              <div><label style={labelStyle}>Designer Responsável</label><input style={inputStyle} value={designer} onChange={e => setDesigner(e.target.value)} placeholder="Nome do designer" /></div>
              <div><label style={labelStyle}>Data de Criação</label><input style={inputStyle} type="date" value={dataCriacao} onChange={e => setDataCriacao(e.target.value)} /></div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitle}>🎨 Desenho Técnico</div>
            <label style={{ ...addBtnStyle, display: 'inline-flex', cursor: 'pointer' }}>
              <Upload size={16} /> Enviar Imagem, PDF ou MP4
              <input type="file" accept="image/*,.pdf,video/mp4" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            {desenhoPreview && (
              <div style={{ marginTop: '14px' }}>
                {desenhoType.startsWith("image/") ? (
                  <img src={desenhoPreview} alt="Desenho" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid hsl(40,22%,85%)' }} />
                ) : desenhoType === "application/pdf" ? (
                  <iframe src={desenhoPreview} style={{ width: '100%', height: '300px', borderRadius: '8px', border: '1px solid hsl(40,22%,85%)' }} title="PDF Preview" />
                ) : null}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={handleDownloadDesenho} className="bg-primary text-primary-foreground" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                    <Download size={16} /> Baixar Desenho
                  </button>
                  <button type="button" onClick={() => { setDesenhoFile(null); setDesenhoPreview(null); setDesenhoType(""); setDesenhoStorageUrl(""); }} style={{ ...removeBtnStyle, padding: '10px 14px', fontSize: '14px', gap: '6px', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={14} /> Remover
                  </button>
                </div>
              </div>
            )}
            {!desenhoPreview && desenhoStorageUrl && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button type="button" onClick={handleDownloadDesenho} className="bg-primary text-primary-foreground" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  <Download size={16} /> Baixar Arquivo Enviado
                </button>
              </div>
            )}
            {!desenhoPreview && !desenhoStorageUrl && (
              <p style={{ fontSize: '13px', marginTop: '8px' }} className="text-muted-foreground">Aceita imagens (PNG, JPEG), PDF e MP4. Máximo 20MB.</p>
            )}
          </div>

          {/* TECIDOS */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>🧵 Tecidos</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={labelStyle}>Selecionar Tecido</label>
                <select style={selectStyle} value={selTecido} onChange={e => setSelTecido(e.target.value)}>
                  <option value="">Escolha...</option>
                  {TECIDO_OPCOES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {selTecido === "Outros" && (
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={labelStyle}>Outro tecido</label>
                  <input style={inputStyle} value={outroTecido} onChange={e => setOutroTecido(e.target.value)} placeholder="Digite o tecido" />
                </div>
              )}
              <button type="button" style={addBtnStyle} onClick={addTecidoFromSelect}><Plus size={14} /> Adicionar</button>
            </div>
            {tecidos.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Nome" value={t.nome} onChange={e => { const n = [...tecidos]; n[i].nome = e.target.value; setTecidos(n); }} />
                <input style={smallInputStyle} placeholder="Composição" value={t.composicao} onChange={e => { const n = [...tecidos]; n[i].composicao = e.target.value; setTecidos(n); }} />
                <input style={{ ...smallInputStyle, maxWidth: '80px' }} placeholder="Largura" value={t.largura} onChange={e => { const n = [...tecidos]; n[i].largura = e.target.value; setTecidos(n); }} />
                <input style={smallInputStyle} placeholder="Fornecedor" value={t.fornecedor} onChange={e => { const n = [...tecidos]; n[i].fornecedor = e.target.value; setTecidos(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setTecidos(tecidos.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* AVIAMENTOS */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>🪡 Aviamentos</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={labelStyle}>Selecionar Aviamento</label>
                <select style={selectStyle} value={selAviamento} onChange={e => setSelAviamento(e.target.value)}>
                  <option value="">Escolha...</option>
                  {AVIAMENTO_OPCOES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {selAviamento === "Outros" && (
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={labelStyle}>Outro aviamento</label>
                  <input style={inputStyle} value={outroAviamento} onChange={e => setOutroAviamento(e.target.value)} placeholder="Digite o aviamento" />
                </div>
              )}
              <button type="button" style={addBtnStyle} onClick={addAviamentoFromSelect}><Plus size={14} /> Adicionar</button>
            </div>
            {aviamentos.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Tipo" value={a.tipo} onChange={e => { const n = [...aviamentos]; n[i].tipo = e.target.value; setAviamentos(n); }} />
                <input style={smallInputStyle} placeholder="Cor" value={a.cor} onChange={e => { const n = [...aviamentos]; n[i].cor = e.target.value; setAviamentos(n); }} />
                <input style={{ ...smallInputStyle, maxWidth: '80px' }} placeholder="Tamanho" value={a.tamanho} onChange={e => { const n = [...aviamentos]; n[i].tamanho = e.target.value; setAviamentos(n); }} />
                <input style={{ ...smallInputStyle, maxWidth: '80px' }} placeholder="Qtd" value={a.quantidade} onChange={e => { const n = [...aviamentos]; n[i].quantidade = e.target.value; setAviamentos(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setAviamentos(aviamentos.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* ACESSÓRIOS */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>💎 Acessórios</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={labelStyle}>Selecionar Acessório</label>
                <select style={selectStyle} value={selAcessorio} onChange={e => setSelAcessorio(e.target.value)}>
                  <option value="">Escolha...</option>
                  {ACESSORIO_OPCOES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {selAcessorio === "Outros" && (
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={labelStyle}>Outro acessório</label>
                  <input style={inputStyle} value={outroAcessorio} onChange={e => setOutroAcessorio(e.target.value)} placeholder="Digite o acessório" />
                </div>
              )}
              <button type="button" style={addBtnStyle} onClick={addAcessorioFromSelect}><Plus size={14} /> Adicionar</button>
            </div>
            {acessorios.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Acessório" value={a} onChange={e => { const n = [...acessorios]; n[i] = e.target.value; setAcessorios(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setAcessorios(acessorios.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* MAQUINÁRIO */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>⚙️ Maquinário Necessário</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={labelStyle}>Selecionar Máquina</label>
                <select style={selectStyle} value={selMaquina} onChange={e => setSelMaquina(e.target.value)}>
                  <option value="">Escolha...</option>
                  {MAQUINARIO_OPCOES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              {selMaquina === "Outros" && (
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={labelStyle}>Outra máquina</label>
                  <input style={inputStyle} value={outroMaquina} onChange={e => setOutroMaquina(e.target.value)} placeholder="Digite o nome da máquina" />
                </div>
              )}
              <button type="button" style={addBtnStyle} onClick={addMaquina}><Plus size={14} /> Adicionar</button>
            </div>
            {maquinario.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Máquina" value={m} onChange={e => { const n = [...maquinario]; n[i] = e.target.value; setMaquinario(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setMaquinario(maquinario.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* SEQUÊNCIA OPERACIONAL */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>📐 Sequência Operacional</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={labelStyle}>Selecionar Etapa</label>
                <select style={selectStyle} value={selSequencia} onChange={e => setSelSequencia(e.target.value)}>
                  <option value="">Escolha...</option>
                  {SEQUENCIA_OPCOES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {selSequencia === "Outros" && (
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={labelStyle}>Outra etapa</label>
                  <input style={inputStyle} value={outroSequencia} onChange={e => setOutroSequencia(e.target.value)} placeholder="Digite a etapa" />
                </div>
              )}
              <button type="button" style={addBtnStyle} onClick={addSequencia}><Plus size={14} /> Adicionar</button>
            </div>
            {sequenciaOperacional.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', minWidth: '28px' }} className="text-muted-foreground">{i + 1}.</span>
                <input style={smallInputStyle} placeholder="Etapa de montagem" value={s} onChange={e => { const n = [...sequenciaOperacional]; n[i] = e.target.value; setSequenciaOperacional(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setSequenciaOperacional(sequenciaOperacional.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitle}>📝 Observações Gerais</div>
            <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Observações adicionais..." />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
            <button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground" style={{ flex: 1, padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '15px', opacity: isLoading ? 0.6 : 1 }}>
              {isLoading ? 'Salvando...' : 'Salvar Ficha Técnica'}
            </button>
            <button type="button" onClick={handleDownloadFicha} style={{ flex: 1, padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className="bg-foreground text-background">
              <Download size={18} /> Baixar PDF
            </button>
            <button type="button" onClick={handleLimparFormulario} style={{ flex: 1, padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className="bg-accent text-accent-foreground">
              <Eraser size={18} /> Limpar Campo
            </button>
          </div>
        </form>

        {/* Fichas Salvas */}
        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '2px solid hsl(40,22%,85%)' }}>
          <h3 style={{ fontSize: '19px', fontWeight: 'bold', marginBottom: '16px' }} className="text-foreground font-display">
            📁 Fichas Técnicas Salvas ({fichasDb.length})
          </h3>
          {fichasLoading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Loader2 className="animate-spin inline text-primary" size={24} />
              <p className="text-muted-foreground" style={{ fontSize: '14px', marginTop: '8px' }}>Carregando fichas...</p>
            </div>
          )}
          {fichasDb.length === 0 && !fichasLoading && (
            <p className="text-muted-foreground" style={{ fontSize: '14px', textAlign: 'center', padding: '20px' }}>Nenhuma ficha salva ainda.</p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
            {fichasDb.map((ficha: any) => (
              <div key={ficha.id} style={{ padding: '14px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }} className="bg-background border border-border hover:shadow-md" onClick={() => setViewingFicha(ficha)}>
                <p style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '15px' }} className="text-foreground">{ficha.dados?.nomeProduto || 'Sem nome'}</p>
                <p className="text-muted-foreground" style={{ fontSize: '13px', marginBottom: '2px' }}>Tipo: {ficha.dados?.tipoPeca || '-'}</p>
                <p className="text-muted-foreground" style={{ fontSize: '13px', marginBottom: '2px' }}>Ref: {ficha.referencia_codigo || '-'}</p>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Salvo: {new Date(ficha.created_at).toLocaleDateString('pt-BR')}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={(e) => { e.stopPropagation(); setViewingFicha(ficha); }} style={{ ...addBtnStyle, flex: 1, justifyContent: 'center', fontSize: '12px', padding: '6px' }}>
                    <Eye size={14} /> Ver
                  </button>
                  <button onClick={async (e) => { e.stopPropagation(); const ok = await deleteItem(ficha.id); if (ok) toast.success('Ficha deletada!'); }} style={{ ...removeBtnStyle, flex: 1, justifyContent: 'center', fontSize: '12px', padding: '6px', gap: '4px' }}>
                    <Trash2 size={14} /> Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Visualização */}
      {viewingFicha && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setViewingFicha(null)}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'relative', maxWidth: '700px', width: '100%', maxHeight: '80vh', overflow: 'auto', borderRadius: '14px', padding: '30px' }} className="bg-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewingFicha(null)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer' }} className="text-muted-foreground hover:text-foreground">
              <X size={24} />
            </button>
            <h3 className="text-foreground font-display" style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>
              {viewingFicha.dados?.nomeProduto || 'Ficha Técnica'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                ['Tipo de Peça', viewingFicha.dados?.tipoPeca],
                ['Referência', viewingFicha.referencia_codigo],
                ['Coleção', viewingFicha.dados?.colecao],
                ['Designer', viewingFicha.dados?.designer],
                ['Data de Criação', viewingFicha.dados?.dataCriacao],
              ].map(([label, val]) => val && (
                <div key={label as string}>
                  <p className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: '600' }}>{label}</p>
                  <p className="text-foreground" style={{ fontSize: '15px' }}>{val as string}</p>
                </div>
              ))}
            </div>
            {viewingFicha.dados?.tecidos?.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <p className="text-foreground" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>🧵 Tecidos</p>
                {viewingFicha.dados.tecidos.map((t: any, i: number) => (
                  <p key={i} className="text-muted-foreground" style={{ fontSize: '14px' }}>• {t.nome} ({t.composicao}) - {t.largura} - {t.fornecedor}</p>
                ))}
              </div>
            )}
            {viewingFicha.dados?.aviamentos?.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <p className="text-foreground" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>🪡 Aviamentos</p>
                {viewingFicha.dados.aviamentos.map((a: any, i: number) => (
                  <p key={i} className="text-muted-foreground" style={{ fontSize: '14px' }}>• {a.tipo} - {a.cor} - {a.tamanho} (x{a.quantidade})</p>
                ))}
              </div>
            )}
            {viewingFicha.dados?.acessorios?.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <p className="text-foreground" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>💎 Acessórios</p>
                {viewingFicha.dados.acessorios.map((a: string, i: number) => <p key={i} className="text-muted-foreground" style={{ fontSize: '14px' }}>• {a}</p>)}
              </div>
            )}
            {viewingFicha.dados?.maquinario?.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <p className="text-foreground" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>⚙️ Maquinário</p>
                {viewingFicha.dados.maquinario.map((m: string, i: number) => <p key={i} className="text-muted-foreground" style={{ fontSize: '14px' }}>• {m}</p>)}
              </div>
            )}
            {viewingFicha.dados?.sequenciaOperacional?.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <p className="text-foreground" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>📐 Sequência Operacional</p>
                {viewingFicha.dados.sequenciaOperacional.map((s: string, i: number) => <p key={i} className="text-muted-foreground" style={{ fontSize: '14px' }}>{i + 1}. {s}</p>)}
              </div>
            )}
            {viewingFicha.dados?.observacoes && (
              <div>
                <p className="text-foreground" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>📝 Observações</p>
                <p className="text-muted-foreground" style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{viewingFicha.dados.observacoes}</p>
              </div>
            )}
            {viewingFicha.dados?.desenho_url && (
              <div style={{ marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = viewingFicha.dados.desenho_url;
                    a.download = viewingFicha.dados.desenho_nome || "desenho-tecnico";
                    a.click();
                  }}
                  className="bg-primary text-primary-foreground"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  <Download size={16} /> Baixar Arquivo da Ficha
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default FichaTecnicaForm;
