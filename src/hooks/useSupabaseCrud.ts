import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type TableName = "fichas_tecnicas" | "mapas_mentais" | "planos_acao";

export function useSupabaseCrud<T extends Record<string, unknown>>(table: TableName) {
  const { user } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems((data as unknown as T[]) || []);
    } catch (err: any) {
      console.error(`Erro ao carregar ${table}:`, err);
    } finally {
      setLoading(false);
    }
  }, [user, table]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const insertItem = async (item: Omit<T, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast.error("Faça login para salvar.");
      return null;
    }
    try {
      const { data, error } = await supabase
        .from(table)
        .insert({ ...item, user_id: user.id } as any)
        .select()
        .single();
      if (error) throw error;
      setItems((prev) => [data as unknown as T, ...prev]);
      return data as unknown as T;
    } catch (err: any) {
      console.error(`Erro ao inserir em ${table}:`, err);
      toast.error("Erro ao salvar no banco de dados.");
      return null;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from(table)
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) throw error;
      setItems((prev) => prev.map((i: any) => (i.id === id ? (data as T) : i)));
      return data as T;
    } catch (err: any) {
      console.error(`Erro ao atualizar ${table}:`, err);
      toast.error("Erro ao atualizar.");
      return null;
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
      setItems((prev) => prev.filter((i: any) => i.id !== id));
      return true;
    } catch (err: any) {
      console.error(`Erro ao deletar de ${table}:`, err);
      toast.error("Erro ao deletar.");
      return false;
    }
  };

  return { items, loading, fetchItems, insertItem, updateItem, deleteItem };
}
