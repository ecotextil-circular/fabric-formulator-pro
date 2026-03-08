import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useSupabaseCrud<T extends Record<string, unknown>>(table: string) {
  const { user } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from(table)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems((data as unknown as T[]) || []);
    } catch (err: any) {
      console.error(`Erro ao carregar ${table}:`, err);
      toast.error(`Erro ao carregar dados: ${err?.message || "tente novamente"}`);
    } finally {
      setLoading(false);
    }
  }, [user, table]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const insertItem = async (item: Record<string, unknown>) => {
    if (!user) {
      toast.error("Faça login para salvar.");
      return null;
    }
    try {
      const { data, error } = await (supabase as any)
        .from(table)
        .insert({ ...item, user_id: user.id })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setItems((prev) => [data as unknown as T, ...prev]);
      } else {
        await fetchItems();
      }

      return (data as unknown as T) ?? null;
    } catch (err: any) {
      console.error(`Erro ao inserir em ${table}:`, err);
      toast.error(`Erro ao salvar no banco: ${err?.message || "tente novamente"}`);
      return null;
    }
  };

  const updateItem = async (id: string, updates: Record<string, unknown>) => {
    if (!user) return null;
    try {
      const { data, error } = await (supabase as any)
        .from(table)
        .update({ ...updates })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setItems((prev) => prev.map((i: any) => (i.id === id ? (data as unknown as T) : i)));
      } else {
        await fetchItems();
      }
      return (data as unknown as T) ?? null;
    } catch (err: any) {
      console.error(`Erro ao atualizar ${table}:`, err);
      toast.error(`Erro ao atualizar: ${err?.message || "tente novamente"}`);
      return null;
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return false;
    try {
      const { error } = await (supabase as any)
        .from(table)
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
      setItems((prev) => prev.filter((i: any) => i.id !== id));
      return true;
    } catch (err: any) {
      console.error(`Erro ao deletar de ${table}:`, err);
      toast.error(`Erro ao deletar: ${err?.message || "tente novamente"}`);
      return false;
    }
  };

  return { items, loading, fetchItems, insertItem, updateItem, deleteItem };
}
