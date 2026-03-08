
-- Drop existing restrictive policies on fichas_tecnicas
DROP POLICY IF EXISTS "perm_select_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "perm_insert_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "perm_update_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "perm_delete_fichas" ON public.fichas_tecnicas;

-- Recreate as PERMISSIVE
CREATE POLICY "allow_select_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Also fix other tables that may have same issue (RESTRICTIVE policies)
DROP POLICY IF EXISTS "perm_select_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "perm_insert_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "perm_update_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "perm_delete_mapas" ON public.mapas_mentais;

CREATE POLICY "allow_select_mapas" ON public.mapas_mentais AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_mapas" ON public.mapas_mentais AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_mapas" ON public.mapas_mentais AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_mapas" ON public.mapas_mentais AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "perm_select_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "perm_insert_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "perm_update_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "perm_delete_itens" ON public.itens_salvos;

CREATE POLICY "allow_select_itens" ON public.itens_salvos AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_itens" ON public.itens_salvos AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_itens" ON public.itens_salvos AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_itens" ON public.itens_salvos AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "perm_select_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "perm_insert_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "perm_update_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "perm_delete_planos" ON public.planos_acao;

CREATE POLICY "allow_select_planos" ON public.planos_acao AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_planos" ON public.planos_acao AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_update_planos" ON public.planos_acao AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allow_delete_planos" ON public.planos_acao AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);
