
-- Drop all existing restrictive policies and recreate as permissive

-- === fichas_tecnicas ===
DROP POLICY IF EXISTS "allow_select_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "allow_insert_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "allow_update_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "allow_delete_fichas" ON public.fichas_tecnicas;

CREATE POLICY "allow_select_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- === itens_salvos ===
DROP POLICY IF EXISTS "allow_select_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "allow_insert_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "allow_update_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "allow_delete_itens" ON public.itens_salvos;

CREATE POLICY "allow_select_itens" ON public.itens_salvos AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_itens" ON public.itens_salvos AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_itens" ON public.itens_salvos AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_itens" ON public.itens_salvos AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- === mapas_mentais ===
DROP POLICY IF EXISTS "allow_select_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "allow_insert_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "allow_update_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "allow_delete_mapas" ON public.mapas_mentais;

CREATE POLICY "allow_select_mapas" ON public.mapas_mentais AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_mapas" ON public.mapas_mentais AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_mapas" ON public.mapas_mentais AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_mapas" ON public.mapas_mentais AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- === planos_acao ===
DROP POLICY IF EXISTS "allow_select_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "allow_insert_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "allow_update_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "allow_delete_planos" ON public.planos_acao;

CREATE POLICY "allow_select_planos" ON public.planos_acao AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_planos" ON public.planos_acao AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_planos" ON public.planos_acao AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_planos" ON public.planos_acao AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);
