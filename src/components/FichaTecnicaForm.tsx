import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Download, Upload, FileText, Loader2, Eye, X, Eraser } from "lucide-react";
import { useSupabaseCrud } from "@/hooks/useSupabaseCrud";
import { useAuth } from "@/contexts/AuthContext";

const TIPOS_PECA = [
  "Blusa", "Camiseta", "Camisa", "Top", "Vestido", "Saia", "Calça",
  "Shorts", "Bermuda", "Macacão", "Jaqueta", "Biquíni", "Maiô",
  "Fitness", "Infantil", "Sunga", "Cueca", "Calcinha", "Sutiã",
  "Lingerie", "Outros"
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
  const [tecidos, setTecidos] = useState<Tecido[]>([]);
  const [aviamentos, setAviamentos] = useState<Aviamento[]>([]);
  const [acessorios, setAcessorios] = useState<string[]>([]);
  const [maquinario, setMaquinario] = useState<string[]>([]);
  const [sequenciaOperacional, setSequenciaOperacional] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingFicha, setViewingFicha] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Arquivo muito grande (máximo 5MB)'); return; }
    setDesenhoFile(file);
    setDesenhoType(file.type);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setDesenhoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      setDesenhoPreview(URL.createObjectURL(file));
    }
  };

  const handleDownloadDesenho = () => {
    if (!desenhoFile) { toast.error('Nenhum desenho para baixar'); return; }
    const url = URL.createObjectURL(desenhoFile);
    const a = document.createElement("a");
    a.href = url; a.download = desenhoFile.name; a.click();
    URL.revokeObjectURL(url);
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
    setSequenciaOperacional([]); setDesenhoFile(null); setDesenhoPreview(null);
    toast.success("Formulário limpo!");
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
                <select style={inputStyle} value={tipoPeca} onChange={e => setTipoPeca(e.target.value)}>
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
              <Upload size={16} /> Enviar Imagem ou PDF
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            {desenhoPreview && (
              <div style={{ marginTop: '14px' }}>
                {desenhoType.startsWith("image/") ? (
                  <img src={desenhoPreview} alt="Desenho" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid hsl(40,22%,85%)' }} />
                ) : (
                  <iframe src={desenhoPreview} style={{ width: '100%', height: '300px', borderRadius: '8px', border: '1px solid hsl(40,22%,85%)' }} title="PDF Preview" />
                )}
                <button type="button" onClick={handleDownloadDesenho} style={{ ...addBtnStyle, marginTop: '10px' }}>
                  <Download size={16} /> Baixar Desenho
                </button>
              </div>
            )}
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitle}>🧵 Tecidos</div>
            {tecidos.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Nome" value={t.nome} onChange={e => { const n = [...tecidos]; n[i].nome = e.target.value; setTecidos(n); }} />
                <input style={smallInputStyle} placeholder="Composição" value={t.composicao} onChange={e => { const n = [...tecidos]; n[i].composicao = e.target.value; setTecidos(n); }} />
                <input style={{ ...smallInputStyle, maxWidth: '80px' }} placeholder="Largura" value={t.largura} onChange={e => { const n = [...tecidos]; n[i].largura = e.target.value; setTecidos(n); }} />
                <input style={smallInputStyle} placeholder="Fornecedor" value={t.fornecedor} onChange={e => { const n = [...tecidos]; n[i].fornecedor = e.target.value; setTecidos(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setTecidos(tecidos.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={addBtnStyle} onClick={() => setTecidos([...tecidos, { nome: '', composicao: '', largura: '', fornecedor: '' }])}><Plus size={14} /> Adicionar Tecido</button>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitle}>🪡 Aviamentos</div>
            {aviamentos.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Tipo" value={a.tipo} onChange={e => { const n = [...aviamentos]; n[i].tipo = e.target.value; setAviamentos(n); }} />
                <input style={smallInputStyle} placeholder="Cor" value={a.cor} onChange={e => { const n = [...aviamentos]; n[i].cor = e.target.value; setAviamentos(n); }} />
                <input style={{ ...smallInputStyle, maxWidth: '80px' }} placeholder="Tamanho" value={a.tamanho} onChange={e => { const n = [...aviamentos]; n[i].tamanho = e.target.value; setAviamentos(n); }} />
                <input style={{ ...smallInputStyle, maxWidth: '80px' }} placeholder="Qtd" value={a.quantidade} onChange={e => { const n = [...aviamentos]; n[i].quantidade = e.target.value; setAviamentos(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setAviamentos(aviamentos.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={addBtnStyle} onClick={() => setAviamentos([...aviamentos, { tipo: '', cor: '', tamanho: '', quantidade: '' }])}><Plus size={14} /> Adicionar Aviamento</button>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitle}>💎 Acessórios</div>
            {acessorios.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Acessório" value={a} onChange={e => { const n = [...acessorios]; n[i] = e.target.value; setAcessorios(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setAcessorios(acessorios.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={addBtnStyle} onClick={() => setAcessorios([...acessorios, ''])}><Plus size={14} /> Adicionar Acessório</button>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitle}>⚙️ Maquinário Necessário</div>
            {maquinario.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Máquina" value={m} onChange={e => { const n = [...maquinario]; n[i] = e.target.value; setMaquinario(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setMaquinario(maquinario.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={addBtnStyle} onClick={() => setMaquinario([...maquinario, ''])}><Plus size={14} /> Adicionar Máquina</button>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitle}>📐 Sequência Operacional</div>
            {sequenciaOperacional.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', minWidth: '28px' }} className="text-muted-foreground">{i + 1}.</span>
                <input style={smallInputStyle} placeholder="Etapa de montagem" value={s} onChange={e => { const n = [...sequenciaOperacional]; n[i] = e.target.value; setSequenciaOperacional(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setSequenciaOperacional(sequenciaOperacional.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={addBtnStyle} onClick={() => setSequenciaOperacional([...sequenciaOperacional, ''])}><Plus size={14} /> Adicionar Etapa</button>
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
          </div>
        </div>
      )}
    </section>
  );
};

export default FichaTecnicaForm;
