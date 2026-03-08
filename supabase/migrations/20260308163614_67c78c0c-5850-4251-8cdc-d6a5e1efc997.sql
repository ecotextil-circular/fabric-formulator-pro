
-- Fix all RLS policies to be truly PERMISSIVE
-- Drop and recreate ALL policies on all tables

-- fichas_tecnicas
DROP POLICY IF EXISTS "fichas_select" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "fichas_insert" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "fichas_update" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "fichas_delete" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users select own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users insert own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users update own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users delete own fichas" ON public.fichas_tecnicas;

ALTER TABLE public.fichas_tecnicas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_fichas" ON public.fichas_tecnicas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_fichas" ON public.fichas_tecnicas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_fichas" ON public.fichas_tecnicas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_fichas" ON public.fichas_tecnicas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- mapas_mentais
DROP POLICY IF EXISTS "mapas_select" ON public.mapas_mentais;
DROP POLICY IF EXISTS "mapas_insert" ON public.mapas_mentais;
DROP POLICY IF EXISTS "mapas_update" ON public.mapas_mentais;
DROP POLICY IF EXISTS "mapas_delete" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users select own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users insert own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users update own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users delete own mapas" ON public.mapas_mentais;

ALTER TABLE public.mapas_mentais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_mapas" ON public.mapas_mentais FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_mapas" ON public.mapas_mentais FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_mapas" ON public.mapas_mentais FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_mapas" ON public.mapas_mentais FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- planos_acao
DROP POLICY IF EXISTS "planos_select" ON public.planos_acao;
DROP POLICY IF EXISTS "planos_insert" ON public.planos_acao;
DROP POLICY IF EXISTS "planos_update" ON public.planos_acao;
DROP POLICY IF EXISTS "planos_delete" ON public.planos_acao;
DROP POLICY IF EXISTS "Users select own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users insert own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users update own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users delete own planos" ON public.planos_acao;

ALTER TABLE public.planos_acao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_planos" ON public.planos_acao FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_planos" ON public.planos_acao FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_planos" ON public.planos_acao FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_planos" ON public.planos_acao FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- itens_salvos
DROP POLICY IF EXISTS "itens_select" ON public.itens_salvos;
DROP POLICY IF EXISTS "itens_insert" ON public.itens_salvos;
DROP POLICY IF EXISTS "itens_update" ON public.itens_salvos;
DROP POLICY IF EXISTS "itens_delete" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users select own itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users insert own itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users update own itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users delete own itens" ON public.itens_salvos;

ALTER TABLE public.itens_salvos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_itens" ON public.itens_salvos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_itens" ON public.itens_salvos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_itens" ON public.itens_salvos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_itens" ON public.itens_salvos FOR DELETE TO authenticated USING (auth.uid() = user_id);
