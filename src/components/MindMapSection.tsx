import { useState, useCallback, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Plus, Trash2, Info, Link2, Save, Eraser, Eye, X, List } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseCrud } from "@/hooks/useSupabaseCrud";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORIES = [
  { name: "Diagnóstico", color: "hsl(160, 55%, 38%)" },
  { name: "Planejamento", color: "hsl(210, 60%, 50%)" },
  { name: "Implementação", color: "hsl(35, 80%, 55%)" },
  { name: "Monitoramento", color: "hsl(270, 50%, 55%)" },
  { name: "Parcerias", color: "hsl(330, 55%, 55%)" },
  { name: "Tecnologias", color: "hsl(190, 60%, 45%)" },
  { name: "Produtos", color: "hsl(140, 50%, 45%)" },
  { name: "Processos", color: "hsl(20, 70%, 55%)" },
];

interface MindNode { id: string; text: string; x: number; y: number; category: string; connections: string[]; }
const createId = () => Math.random().toString(36).slice(2, 9);

const MindMapSection = () => {
  const { user } = useAuth();
  const { items: savedMaps, insertItem, updateItem: updateDbItem, deleteItem } = useSupabaseCrud<any>("mapas_mentais");
  const [nodes, setNodes] = useState<MindNode[]>([]);
  const [mapName, setMapName] = useState("");
  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [newNodeText, setNewNodeText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [viewingMap, setViewingMap] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = () => {
    if (!newNodeText.trim()) { toast.error("Digite o texto do nó."); return; }
    const canvas = canvasRef.current;
    const w = canvas?.clientWidth || 600;
    const h = canvas?.clientHeight || 400;
    const node: MindNode = { id: createId(), text: newNodeText.trim(), x: 60 + Math.random() * (w - 200), y: 60 + Math.random() * (h - 150), category: selectedCategory, connections: [] };
    setNodes(prev => [...prev, node]);
    setNewNodeText("");
    toast.success("Nó adicionado!");
  };

  const deleteNode = () => {
    if (!selectedNodeId) { toast.error("Selecione um nó primeiro."); return; }
    setNodes(prev => prev.filter(n => n.id !== selectedNodeId).map(n => ({ ...n, connections: n.connections.filter(c => c !== selectedNodeId) })));
    setSelectedNodeId(null);
    setConnectingFrom(null);
    toast.success("Nó excluído!");
  };

  const startConnect = () => {
    if (!selectedNodeId) { toast.error("Selecione um nó primeiro."); return; }
    setConnectingFrom(selectedNodeId);
    toast.info("Agora clique no nó de destino para conectar.");
  };

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    // If we're in connecting mode, make the connection
    if (connectingFrom) {
      if (connectingFrom !== nodeId) {
        setNodes(prev => prev.map(n => 
          n.id === connectingFrom && !n.connections.includes(nodeId) 
            ? { ...n, connections: [...n.connections, nodeId] } 
            : n
        ));
        toast.success("Conexão criada!");
      }
      setConnectingFrom(null);
      return;
    }
    
    // Otherwise select/deselect
    setSelectedNodeId(prev => prev === nodeId ? null : nodeId);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    // Don't start drag if connecting
    if (connectingFrom) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragging({ id: nodeId, offsetX: e.clientX - rect.left - node.x, offsetY: e.clientY - rect.top - node.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(rect.width - 120, e.clientX - rect.left - dragging.offsetX));
    const y = Math.max(0, Math.min(rect.height - 40, e.clientY - rect.top - dragging.offsetY));
    setNodes(prev => prev.map(n => (n.id === dragging.id ? { ...n, x, y } : n)));
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const getCategoryColor = (cat: string) => CATEGORIES.find(c => c.name === cat)?.color || "hsl(0,0%,60%)";

  const handleSave = async () => {
    if (!mapName.trim()) { toast.error("Dê um nome ao mapa."); return; }
    if (nodes.length === 0) { toast.error("Adicione pelo menos um nó."); return; }
    if (editingMapId) {
      await updateDbItem(editingMapId, { titulo: mapName, dados: { nodes } });
      toast.success("Mapa atualizado!");
    } else {
      const result = await insertItem({ titulo: mapName, dados: { nodes } });
      if (result) toast.success("Mapa salvo!");
    }
    handleClear();
  };

  const handleClear = () => {
    setMapName(""); setNodes([]); setNewNodeText(""); setSelectedNodeId(null); setConnectingFrom(null); setEditingMapId(null);
    toast.success("Campos limpos!");
  };

  const loadMap = (map: any) => {
    setMapName(map.titulo);
    setNodes((map.dados?.nodes as MindNode[]) || []);
    setEditingMapId(map.id);
    setShowSaved(false);
    setViewingMap(null);
    toast.success("Mapa carregado para edição!");
  };

  return (
    <section id="mapa-mental" className="py-16 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"><Brain className="w-4 h-4" /> Ferramenta Visual</div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">Mapa Mental Interativo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">Organize informações sobre economia circular de forma visual</p>
        </div>

        <Card className="glass-card p-5 rounded-xl mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-base mb-2">Como usar o Mapa Mental</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Digite o nome do mapa e adicione nós com texto e categoria</li>
                <li>Arraste os nós para reorganizá-los</li>
                <li><strong>Selecionar:</strong> Clique em um nó (ficará com borda destacada)</li>
                <li><strong>Conectar:</strong> Selecione um nó → clique "Conectar Nó" → clique no nó destino</li>
                <li><strong>Excluir:</strong> Selecione um nó → clique "Excluir Nó"</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border space-y-3">
            <Input value={mapName} onChange={e => setMapName(e.target.value)} placeholder="Nome do mapa..." className="bg-background text-base max-w-xs" />
            <div className="flex flex-wrap items-center gap-2">
              <Input placeholder="Texto do nó..." value={newNodeText} onChange={e => setNewNodeText(e.target.value)} onKeyDown={e => e.key === "Enter" && addNode()} className="max-w-[200px] bg-background text-base" />
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <button onClick={addNode} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:brightness-110"><Plus className="w-3.5 h-3.5" /> Adicionar Nó</button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={startConnect} className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${connectingFrom ? "bg-primary text-primary-foreground animate-pulse" : "bg-accent text-accent-foreground"}`}>
                <Link2 className="w-3.5 h-3.5" /> Conectar Nó
              </button>
              <button onClick={deleteNode} className="inline-flex items-center gap-1 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-sm font-medium"><Trash2 className="w-3.5 h-3.5" /> Excluir Nó</button>
              {selectedNodeId && <span className="text-xs text-primary font-medium">Nó selecionado ✓</span>}
              {connectingFrom && <span className="text-xs text-primary font-medium animate-pulse">Clique no nó destino...</span>}
            </div>
          </div>

          <div ref={canvasRef} className="relative bg-background/50 overflow-hidden" style={{ height: 450 }} onClick={() => { if (!connectingFrom) { setSelectedNodeId(null); } }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map(node => node.connections.map(targetId => {
                const target = nodes.find(n => n.id === targetId);
                if (!target) return null;
                return <line key={`${node.id}-${targetId}`} x1={node.x + 60} y1={node.y + 18} x2={target.x + 60} y2={target.y + 18} stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="6 3" opacity={0.5} />;
              }))}
            </svg>
            {nodes.map(node => (
              <div
                key={node.id}
                onClick={(e) => handleNodeClick(e, node.id)}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                className={`absolute px-4 py-2 rounded-xl text-white text-xs font-medium shadow-lg select-none transition-all ${connectingFrom ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"} ${selectedNodeId === node.id ? "ring-3 ring-foreground ring-offset-2 ring-offset-background scale-105" : "hover:scale-105"}`}
                style={{ left: node.x, top: node.y, backgroundColor: getCategoryColor(node.category), minWidth: 100, maxWidth: 180, zIndex: dragging?.id === node.id ? 50 : selectedNodeId === node.id ? 40 : 10 }}
              >
                {node.text}
              </div>
            ))}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <Brain className="w-12 h-12 mb-3 opacity-30" /><p className="text-sm">Adicione nós para começar</p>
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-3 flex-wrap mt-6">
          <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Save className="w-4 h-4" /> Salvar Mapa</button>
          <button onClick={handleClear} className="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-base"><Eraser className="w-4 h-4" /> Limpar Campo</button>
        </div>

        <Card className="glass-card p-5 rounded-xl mt-6">
          <h4 className="font-semibold text-foreground text-base mb-3">Categorias Disponíveis</h4>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {CATEGORIES.map(c => (
              <div key={c.name} className="flex items-center gap-2 shrink-0"><div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} /><span className="text-sm text-muted-foreground whitespace-nowrap">{c.name}</span></div>
            ))}
          </div>
        </Card>

        {user && (
          <Card className="glass-card p-6 rounded-2xl mt-6">
            <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-2 text-base font-semibold text-foreground mb-4"><List className="w-4 h-4" /> Mapas Salvos ({savedMaps.length})</button>
            {showSaved && (
              <div className="space-y-3">
                {savedMaps.map((map: any) => (
                  <div key={map.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 cursor-pointer hover:shadow-md" onClick={() => setViewingMap(map)}>
                    <div>
                      <p className="font-medium text-base text-foreground">{map.titulo}</p>
                      <p className="text-sm text-muted-foreground">{map.dados?.nodes?.length || 0} nós • {new Date(map.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); loadMap(map); }} className="p-1.5 text-primary hover:bg-primary/10 rounded" title="Editar"><Eye className="w-4 h-4" /></button>
                      <button onClick={async (e) => { e.stopPropagation(); const ok = await deleteItem(map.id); if (ok) toast.success("Mapa deletado!"); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {savedMaps.length === 0 && <p className="text-sm text-muted-foreground">Nenhum mapa salvo.</p>}
              </div>
            )}
          </Card>
        )}
      </div>

      {viewingMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setViewingMap(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-card max-w-lg w-full max-h-[80vh] overflow-auto rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingMap(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={24} /></button>
            <h3 className="text-xl font-bold font-display text-foreground mb-4">{viewingMap.titulo}</h3>
            <div className="space-y-2">
              {(viewingMap.dados?.nodes as MindNode[] || []).map((node: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(node.category) }} />
                  <span className="text-sm text-foreground">{node.text}</span>
                  <span className="text-xs text-muted-foreground">({node.category})</span>
                </div>
              ))}
            </div>
            <button onClick={() => loadMap(viewingMap)} className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium text-sm">Carregar para Edição</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MindMapSection;
