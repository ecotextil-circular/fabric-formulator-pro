import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Download, Upload, FileText } from "lucide-react";

const TIPOS_PECA = [
  "Blusa", "Camiseta", "Camisa", "Top", "Vestido", "Saia", "Calça",
  "Shorts", "Bermuda", "Macacão", "Jaqueta", "Biquíni", "Maiô",
  "Fitness", "Infantil", "Sunga", "Cueca", "Calcinha", "Sutiã",
  "Lingerie", "Outros"
];

interface Tecido {
  nome: string;
  composicao: string;
  largura: string;
  fornecedor: string;
}

interface Aviamento {
  tipo: string;
  cor: string;
  tamanho: string;
  quantidade: string;
}

interface FichaTecnica {
  id: string;
  nomeProduto: string;
  referencia: string;
  tipoPeca: string;
  outroTipo: string;
  colecao: string;
  designer: string;
  dataCriacao: string;
  observacoes: string;
  tecidos: Tecido[];
  aviamentos: Aviamento[];
  acessorios: string[];
  maquinario: string[];
  sequenciaOperacional: string[];
  dataSalvamento: string;
}

const sectionStyle: React.CSSProperties = {
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: '#f1f5f9',
  borderRadius: '10px',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '700',
  marginBottom: '14px',
  color: '#334155',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  width: '100%',
  fontSize: '14px',
};

const smallInputStyle: React.CSSProperties = {
  ...inputStyle,
  flex: 1,
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontWeight: '600',
  color: '#475569',
  fontSize: '13px',
  marginBottom: '4px',
  display: 'block',
  overflow: 'visible',
  whiteSpace: 'normal',
  wordBreak: 'keep-all',
};

const addBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  backgroundColor: '#e2e8f0',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  color: '#475569',
};

const removeBtnStyle: React.CSSProperties = {
  padding: '6px',
  backgroundColor: '#fee2e2',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  color: '#ef4444',
  display: 'flex',
  alignItems: 'center',
};

const FichaTecnicaForm = () => {
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
  const [fichas, setFichas] = useState<FichaTecnica[]>([]);

  // Carregar fichas do localStorage ao montar
  useEffect(() => {
    try {
      const fichasSalvas = localStorage.getItem('fichas_tecnicas');
      if (fichasSalvas) {
        setFichas(JSON.parse(fichasSalvas));
      }
    } catch (error) {
      console.error('Erro ao carregar fichas:', error);
      toast.error('Erro ao carregar fichas salvas');
    }
  }, []);

  // Salvar fichas no localStorage sempre que mudarem
  useEffect(() => {
    try {
      localStorage.setItem('fichas_tecnicas', JSON.stringify(fichas));
    } catch (error) {
      console.error('Erro ao salvar fichas:', error);
    }
  }, [fichas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande (máximo 5MB)');
        return;
      }

      setDesenhoFile(file);
      setDesenhoType(file.type);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => setDesenhoPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setDesenhoPreview(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload do arquivo');
    }
  };

  const handleDownloadDesenho = () => {
    try {
      if (!desenhoFile) {
        toast.error('Nenhum desenho para baixar');
        return;
      }
      const url = URL.createObjectURL(desenhoFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = desenhoFile.name;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Desenho baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar desenho:', error);
      toast.error('Erro ao baixar desenho');
    }
  };

  const handleDownloadFicha = () => {
    try {
      const tipoFinal = tipoPeca === "Outros" ? outroTipo : tipoPeca;
      const html = `
        <html><head><meta charset="utf-8"><title>Ficha Técnica - ${nomeProduto}</title>
        <style>
          body{font-family:Arial,sans-serif;padding:40px;color:#1e293b;max-width:800px;margin:0 auto}
          h1{text-align:center;color:#0f172a;border-bottom:2px solid #0ea5e9;padding-bottom:12px}
          h2{color:#0ea5e9;margin-top:24px;font-size:16px;border-bottom:1px solid #e2e8f0;padding-bottom:6px}
          table{width:100%;border-collapse:collapse;margin:8px 0}
          td,th{border:1px solid #cbd5e1;padding:8px;text-align:left;font-size:13px}
          th{background:#f1f5f9;font-weight:600}
          .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}
          .info-item span{font-weight:600;color:#475569}
          ol,ul{padding-left:20px;font-size:13px}
          .obs{background:#f8fafc;padding:12px;border-radius:6px;font-size:13px;white-space:pre-wrap}
        </style></head><body>
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
      if (win) {
        win.onload = () => { win.print(); };
      }
      toast.success("Ficha técnica aberta para impressão/download!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    }
  };

  const validarFormulario = (): boolean => {
    if (!nomeProduto.trim()) {
      toast.error("Nome do produto é obrigatório");
      return false;
    }
    if (!tipoPeca) {
      toast.error("Tipo de peça é obrigatório");
      return false;
    }
    if (tipoPeca === "Outros" && !outroTipo.trim()) {
      toast.error("Especifique o tipo de peça");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setIsLoading(true);

      const tipoFinal = tipoPeca === "Outros" ? outroTipo : tipoPeca;

      const novaFicha: FichaTecnica = {
        id: Date.now().toString(),
        nomeProduto,
        referencia,
        tipoPeca: tipoFinal,
        outroTipo,
        colecao,
        designer,
        dataCriacao,
        observacoes,
        tecidos,
        aviamentos,
        acessorios,
        maquinario,
        sequenciaOperacional,
        dataSalvamento: new Date().toLocaleString('pt-BR'),
      };

      setFichas([...fichas, novaFicha]);

      // Limpar formulário
      setNomeProduto("");
      setReferencia("");
      setTipoPeca("");
      setOutroTipo("");
      setColecao("");
      setDesigner("");
      setDataCriacao("");
      setObservacoes("");
      setTecidos([]);
      setAviamentos([]);
      setAcessorios([]);
      setMaquinario([]);
      setSequenciaOperacional([]);
      setDesenhoFile(null);
      setDesenhoPreview(null);

      toast.success(`Ficha de "${nomeProduto}" (${tipoFinal}) salva com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar ficha:', error);
      toast.error('Erro ao salvar ficha técnica');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimparFormulario = () => {
    setNomeProduto("");
    setReferencia("");
    setTipoPeca("");
    setOutroTipo("");
    setColecao("");
    setDesigner("");
    setDataCriacao("");
    setObservacoes("");
    setTecidos([]);
    setAviamentos([]);
    setAcessorios([]);
    setMaquinario([]);
    setSequenciaOperacional([]);
    setDesenhoFile(null);
    setDesenhoPreview(null);
    toast.success("Formulário limpo!");
  };

  return (
    <section id="ficha-tecnica" style={{ padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '6px', textAlign: 'center', color: '#0f172a' }}>
          <FileText style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} size={26} />
          Nova Ficha Técnica
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
          Preencha todos os detalhes do produto
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Informações Básicas */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>📋 Informações Básicas</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome do Produto *</label>
                <input style={inputStyle} value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} placeholder="Ex: Blusa Verão" />
              </div>
              <div>
                <label style={labelStyle}>Referência / Código</label>
                <input style={inputStyle} value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Ex: REF-001" />
              </div>
              <div>
                <label style={labelStyle}>Tipo de Peça *</label>
                <select style={inputStyle} value={tipoPeca} onChange={e => setTipoPeca(e.target.value)}>
                  <option value="">Selecione...</option>
                  {TIPOS_PECA.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {tipoPeca === "Outros" && (
                  <input style={{ ...inputStyle, marginTop: '8px' }} placeholder="Digite o tipo" value={outroTipo} onChange={e => setOutroTipo(e.target.value)} />
                )}
              </div>
              <div>
                <label style={labelStyle}>Coleção</label>
                <input style={inputStyle} value={colecao} onChange={e => setColecao(e.target.value)} placeholder="Ex: Primavera 2026" />
              </div>
              <div>
                <label style={labelStyle}>Designer Responsável</label>
                <input style={inputStyle} value={designer} onChange={e => setDesigner(e.target.value)} placeholder="Nome do designer" />
              </div>
              <div>
                <label style={labelStyle}>Data de Criação</label>
                <input style={inputStyle} type="date" value={dataCriacao} onChange={e => setDataCriacao(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Desenho Técnico */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>🎨 Desenho Técnico</div>
            <label style={{ ...addBtnStyle, display: 'inline-flex', cursor: 'pointer' }}>
              <Upload size={16} /> Enviar Imagem ou PDF
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            {desenhoPreview && (
              <div style={{ marginTop: '14px' }}>
                {desenhoType.startsWith("image/") ? (
                  <img src={desenhoPreview} alt="Desenho" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                ) : (
                  <iframe src={desenhoPreview} style={{ width: '100%', height: '300px', borderRadius: '8px', border: '1px solid #e2e8f0' }} title="PDF Preview" />
                )}
                <button type="button" onClick={handleDownloadDesenho} style={{ ...addBtnStyle, marginTop: '10px', backgroundColor: '#dbeafe', color: '#2563eb' }}>
                  <Download size={16} /> Baixar Desenho
                </button>
              </div>
            )}
          </div>

          {/* Tecidos */}
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
            <button type="button" style={addBtnStyle} onClick={() => setTecidos([...tecidos, { nome: '', composicao: '', largura: '', fornecedor: '' }])}>
              <Plus size={14} /> Adicionar Tecido
            </button>
          </div>

          {/* Aviamentos */}
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
            <button type="button" style={addBtnStyle} onClick={() => setAviamentos([...aviamentos, { tipo: '', cor: '', tamanho: '', quantidade: '' }])}>
              <Plus size={14} /> Adicionar Aviamento
            </button>
          </div>

          {/* Acessórios */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>💎 Acessórios</div>
            {acessorios.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Acessório" value={a} onChange={e => { const n = [...acessorios]; n[i] = e.target.value; setAcessorios(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setAcessorios(acessorios.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={addBtnStyle} onClick={() => setAcessorios([...acessorios, ''])}>
              <Plus size={14} /> Adicionar Acessório
            </button>
          </div>

          {/* Maquinário */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>⚙️ Maquinário Necessário</div>
            {maquinario.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={smallInputStyle} placeholder="Máquina" value={m} onChange={e => { const n = [...maquinario]; n[i] = e.target.value; setMaquinario(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setMaquinario(maquinario.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={addBtnStyle} onClick={() => setMaquinario([...maquinario, ''])}>
              <Plus size={14} /> Adicionar Máquina
            </button>
          </div>

          {/* Sequência Operacional */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>📐 Sequência Operacional</div>
            {sequenciaOperacional.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '700', color: '#94a3b8', fontSize: '13px', minWidth: '28px' }}>{i + 1}.</span>
                <input style={smallInputStyle} placeholder="Etapa de montagem" value={s} onChange={e => { const n = [...sequenciaOperacional]; n[i] = e.target.value; setSequenciaOperacional(n); }} />
                <button type="button" style={removeBtnStyle} onClick={() => setSequenciaOperacional(sequenciaOperacional.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={addBtnStyle} onClick={() => setSequenciaOperacional([...sequenciaOperacional, ''])}>
              <Plus size={14} /> Adicionar Etapa
            </button>
          </div>

          {/* Observações */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>📝 Observações Gerais</div>
            <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Observações adicionais..." />
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
            <button type="submit" disabled={isLoading} style={{ flex: 1, backgroundColor: isLoading ? '#94a3b8' : '#0ea5e9', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '15px' }}>
              {isLoading ? 'Salvando...' : 'Salvar Ficha Técnica'}
            </button>
            <button type="button" onClick={handleDownloadFicha} style={{ flex: 1, backgroundColor: '#0f172a', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Download size={18} /> Baixar PDF
            </button>
            <button type="button" onClick={handleLimparFormulario} style={{ flex: 1, backgroundColor: '#f97316', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
              Limpar Formulário
            </button>
          </div>
        </form>

        {/* Lista de Fichas Salvas */}
        {fichas.length > 0 && (
          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '2px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#0f172a' }}>
              Fichas Técnicas Salvas ({fichas.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
              {fichas.map((ficha) => (
                <div key={ficha.id} style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <p style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>{ficha.nomeProduto}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Tipo: {ficha.tipoPeca}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Salvo em: {ficha.dataSalvamento}</p>
                  <button
                    onClick={() => {
                      const fichasAtualizadas = fichas.filter(f => f.id !== ficha.id);
                      setFichas(fichasAtualizadas);
                      toast.success('Ficha deletada!');
                    }}
                    style={{ ...removeBtnStyle, width: '100%', justifyContent: 'center' }}
                  >
                    <Trash2 size={14} /> Deletar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FichaTecnicaForm;
