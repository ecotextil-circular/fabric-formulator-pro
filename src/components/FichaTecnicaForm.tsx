import { useState } from "react";
import { toast } from "sonner";

// LISTA DEFINITIVA E LIMPA
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
  "Fitness",
  "Infantil", 
  "Outros"
];

const FichaTecnicaForm = () => {
  const [tipoPeca, setTipoPeca] = useState("");
  const [outroTipo, setOutroTipo] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tipoFinal = tipoPeca === "Outros" ? outroTipo : tipoPeca;
    if (!nomeProduto || !tipoFinal) {
      toast.error("Preencha o nome e o tipo da peça.");
      return;
    }
    toast.success(`Ficha de ${tipoFinal} salva!`);
  };

  return (
    <section style={{ padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: '#0f172a' }}>
          Nova Ficha Técnica
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: '600', color: '#475569' }}>Nome do Produto *</label>
            <input 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
              value={nomeProduto} 
              onChange={(e) => setNomeProduto(e.target.value)} 
              placeholder="Ex: Blusa Verão"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: '600', color: '#475569' }}>Tipo de Peça *</label>
            <select 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', width: '100%' }}
              value={tipoPeca} 
              onChange={(e) => setTipoPeca(e.target.value)}
            >
              <option value="">Selecione o tipo...</option>
              {TIPOS_PECA.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            
            {tipoPeca === "Outros" && (
              <input 
                style={{ marginTop: '10px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                placeholder="Digite o tipo da peça" 
                value={outroTipo}
                onChange={(e) => setOutroTipo(e.target.value)}
              />
            )}
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}
          >
            Salvar Ficha Técnica
          </button>
        </form>
      </div>
    </section>
  );
};

export default FichaTecnicaForm;
