import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useItensSalvos(tipo: string) {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("itens_salvos")
        .select("*")
        .eq("user_id", user.id)
        .eq("tipo", tipo)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      console.error(`Erro ao carregar ${tipo}:`, err);
      toast.error(`Erro ao carregar ${tipo}: ${err?.message || "tente novamente"}`);
    } finally {
      setLoading(false);
    }
  }, [user, tipo]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const saveItem = async (titulo: string, dados: any) => {
    if (!user) {
      toast.error("Faça login para salvar.");
      return null;
    }
    try {
      const { data, error } = await (supabase as any)
        .from("itens_salvos")
        .insert({ user_id: user.id, tipo, titulo, dados })
        .select()
        .maybeSingle();
      if (error) throw error;

      if (data) {
        setItems((prev) => [data, ...prev]);
      } else {
        await fetchItems();
      }

      return data ?? null;
    } catch (err: any) {
      console.error(`Erro ao salvar ${tipo}:`, err);
      toast.error(`Erro ao salvar ${tipo}: ${err?.message || "tente novamente"}`);
      return null;
    }
  };

  const removeItem = async (id: string) => {
    if (!user) return false;
    try {
      const { error } = await (supabase as any)
        .from("itens_salvos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== id));
      return true;
    } catch (err: any) {
      console.error(`Erro ao deletar ${tipo}:`, err);
      toast.error(`Erro ao deletar ${tipo}: ${err?.message || "tente novamente"}`);
      return false;
    }
  };

  return { items, loading, saveItem, removeItem, fetchItems };
}
