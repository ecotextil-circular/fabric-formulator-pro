import { useState, useCallback, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Plus, Trash2, Info, GripHorizontal, Save, Eraser, Eye, X, List } from "lucide-react";
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
interface MindMap { id: string; name: string; nodes: MindNode[]; }
const createId = () => Math.random().toString(36).slice(2, 9);

const MindMapSection = () => {
  const { user } = useAuth();
  const { items: savedMaps, loading: mapsLoading, insertItem, updateItem: updateDbItem, deleteItem } = useSupabaseCrud<any>("mapas_mentais");
  const [maps, setMaps] = useState<MindMap[]>([]);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [newNodeText, setNewNodeText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [viewingMap, setViewingMap] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (savedMaps.length > 0) {
      const loadedMaps = savedMaps.map((m: any) => ({ id: m.id, name: m.titulo, nodes: (m.dados?.nodes as MindNode[]) || [] }));
      setMaps(loadedMaps);
      if (!activeMapId && loadedMaps.length > 0) setActiveMapId(loadedMaps[0].id);
    }
  }, [savedMaps]);

  const activeMap = maps.find((m) => m.id === activeMapId) || null;

  const createNewMap = async () => {
    const name = `Mapa ${maps.length + 1}`;
    if (user) {
      const result = await insertItem({ titulo: name, dados: { nodes: [] } });
      if (result) { const newMap: MindMap = { id: (result as any).id, name, nodes: [] }; setMaps((prev) => [...prev, newMap]); setActiveMapId(newMap.id); toast.success(`"${name}" criado!`); }
    } else {
      const newMap: MindMap = { id: createId(), name, nodes: [] };
      setMaps((prev) => [...prev, newMap]); setActiveMapId(newMap.id); toast.success(`"${name}" criado!`);
    }
  };

  const updateActiveMap = useCallback((updater: (map: MindMap) => MindMap) => {
    setMaps((prev) => prev.map((m) => (m.id === activeMapId ? updater(m) : m)));
  }, [activeMapId]);

  const saveCurrentMap = async () => {
    if (!activeMap || !user) return;
    await updateDbItem(activeMap.id, { titulo: activeMap.name, dados: { nodes: activeMap.nodes } });
    toast.success("Mapa salvo!");
  };

  const clearCurrentMap = () => {
    if (!activeMap) return;
    updateActiveMap((m) => ({ ...m, nodes: [] }));
    setSelectedNodeId(null); setConnectingFrom(null);
    toast.success("Mapa limpo!");
  };

  const addNode = () => {
    if (!newNodeText.trim() || !activeMap) return;
    const canvas = canvasRef.current;
    const w = canvas?.clientWidth || 600;
    const h = canvas?.clientHeight || 400;
    const node: MindNode = { id: createId(), text: newNodeText.trim(), x: 60 + Math.random() * (w - 200), y: 60 + Math.random() * (h - 150), category: selectedCategory, connections: [] };
    updateActiveMap((m) => ({ ...m, nodes: [...m.nodes, node] }));
    setNewNodeText("");
  };

  const deleteNode = () => {
    if (!selectedNodeId) return;
    updateActiveMap((m) => ({ ...m, nodes: m.nodes.filter((n) => n.id !== selectedNodeId).map((n) => ({ ...n, connections: n.connections.filter((c) => c !== selectedNodeId) })) }));
    setSelectedNodeId(null);
  };

  const startConnect = () => {
    if (!selectedNodeId) { toast.error("Selecione um nó primeiro"); return; }
    setConnectingFrom(selectedNodeId);
    toast.info("Clique em outro nó para conectar");
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (connectingFrom) {
      if (connectingFrom !== nodeId) {
        updateActiveMap((m) => ({ ...m, nodes: m.nodes.map((n) => n.id === connectingFrom && !n.connections.includes(nodeId) ? { ...n, connections: [...n.connections, nodeId] } : n) }));
        toast.success("Conexão criada!");
      }
      setConnectingFrom(null);
      return;
    }
    setSelectedNodeId(nodeId);
    const node = activeMap?.nodes.find((n) => n.id === nodeId);
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
    updateActiveMap((m) => ({ ...m, nodes: m.nodes.map((n) => (n.id === dragging.id ? { ...n, x, y } : n)) }));
  }, [dragging, updateActiveMap]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const getCategoryColor = (cat: string) => CATEGORIES.find((c) => c.name === cat)?.color || "hsl(0,0%,60%)";

  return (
    <section id="mapa-mental" className="py-16 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-2"><Brain className="w-4 h-4" /> Ferramenta Visual</div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Mapa Mental Interativo</h2>
            <p className="text-muted-foreground text-base mt-1">Organize informações sobre economia circular de forma visual</p>
          </div>
          <button onClick={createNewMap} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium text-base hover:brightness-110 transition-all shadow-md"><Plus className="w-4 h-4" /> Novo Mapa</button>
        </div>

        <Card className="glass-card p-5 rounded-xl mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-base mb-2">Como usar o Mapa Mental</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Clique em "Novo Mapa" para criar um mapa</li>
                <li>Use "Adicionar Nó" para criar tópicos</li>
                <li>Arraste os nós para reorganizá-los</li>
                <li>Selecione um nó e clique "Conectar Nó" para ligar a outro</li>
                <li>Selecione e clique "Excluir Nó" para remover</li>
              </ul>
            </div>
          </div>
        </Card>

        {maps.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {maps.map((m) => (
              <button key={m.id} onClick={() => setActiveMapId(m.id)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${m.id === activeMapId ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{m.name}</button>
            ))}
          </div>
        )}

        <Card className="glass-card rounded-2xl overflow-hidden">
          {activeMap ? (
            <>
              <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
                <Input placeholder="Texto do nó..." value={newNodeText} onChange={(e) => setNewNodeText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNode()} className="max-w-[200px] bg-background text-base" />
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                  {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <button onClick={addNode} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium hover:brightness-110"><Plus className="w-3.5 h-3.5" /> Adicionar Nó</button>
                <button onClick={startConnect} className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-3 py-2 rounded-lg text-xs font-medium"><GripHorizontal className="w-3.5 h-3.5" /> Conectar Nó</button>
                <button onClick={deleteNode} className="inline-flex items-center gap-1 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-xs font-medium"><Trash2 className="w-3.5 h-3.5" /> Excluir Nó</button>
                {connectingFrom && <span className="text-xs text-primary font-medium animate-pulse">Selecione o nó de destino...</span>}
                <div className="flex gap-2 ml-auto">
                  {user && <button onClick={saveCurrentMap} className="inline-flex items-center gap-1 bg-olive text-white px-3 py-2 rounded-lg text-xs font-medium hover:brightness-110"><Save className="w-3.5 h-3.5" /> Salvar</button>}
                  <button onClick={clearCurrentMap} className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-3 py-2 rounded-lg text-xs font-medium"><Eraser className="w-3.5 h-3.5" /> Limpar</button>
                </div>
              </div>
              <div ref={canvasRef} className="relative bg-background/50 overflow-hidden" style={{ height: 450 }} onClick={() => { setSelectedNodeId(null); setConnectingFrom(null); }}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {activeMap.nodes.map((node) => node.connections.map((targetId) => {
                    const target = activeMap.nodes.find((n) => n.id === targetId);
                    if (!target) return null;
                    return <line key={`${node.id}-${targetId}`} x1={node.x + 60} y1={node.y + 18} x2={target.x + 60} y2={target.y + 18} stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="6 3" opacity={0.5} />;
                  }))}
                </svg>
                {activeMap.nodes.map((node) => (
                  <div key={node.id} onMouseDown={(e) => handleNodeMouseDown(e, node.id)} className={`absolute px-4 py-2 rounded-xl text-white text-xs font-medium shadow-lg cursor-grab active:cursor-grabbing select-none transition-shadow ${selectedNodeId === node.id ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`} style={{ left: node.x, top: node.y, backgroundColor: getCategoryColor(node.category), minWidth: 100, maxWidth: 180, zIndex: dragging?.id === node.id ? 50 : 10 }}>
                    {node.text}
                  </div>
                ))}
                {activeMap.nodes.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <Brain className="w-12 h-12 mb-3 opacity-30" /><p className="text-sm">Adicione nós para começar</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Brain className="w-16 h-16 mb-4 opacity-20" /><p className="font-medium text-base">Nenhum mapa selecionado.</p><p className="text-sm">Clique em "Novo Mapa" para começar.</p>
            </div>
          )}
        </Card>

        <Card className="glass-card p-5 rounded-xl mt-6">
          <h4 className="font-semibold text-foreground text-base mb-3">Categorias Disponíveis</h4>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {CATEGORIES.map((c) => (
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
                  <div key={map.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 cursor-pointer hover:shadow-md" onClick={() => { setActiveMapId(map.id); setShowSaved(false); }}>
                    <div>
                      <p className="font-medium text-base text-foreground">{map.titulo}</p>
                      <p className="text-sm text-muted-foreground">{map.dados?.nodes?.length || 0} nós • {new Date(map.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setActiveMapId(map.id); setShowSaved(false); }} className="p-1.5 text-primary hover:bg-primary/10 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={async (e) => { e.stopPropagation(); const ok = await deleteItem(map.id); if (ok) { toast.success("Mapa deletado!"); setMaps(prev => prev.filter(m => m.id !== map.id)); if (activeMapId === map.id) setActiveMapId(null); } }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {savedMaps.length === 0 && <p className="text-sm text-muted-foreground">Nenhum mapa salvo.</p>}
              </div>
            )}
          </Card>
        )}
      </div>
    </section>
  );
};

export default MindMapSection;
