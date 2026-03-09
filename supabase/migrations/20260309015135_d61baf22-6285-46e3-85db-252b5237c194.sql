-- Recriar todas as políticas RLS como PERMISSIVE

-- === fichas_tecnicas ===
DROP POLICY IF EXISTS "allow_select_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "allow_insert_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "allow_update_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "allow_delete_fichas" ON public.fichas_tecnicas;

CREATE POLICY "users_select_own_fichas" ON public.fichas_tecnicas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_fichas" ON public.fichas_tecnicas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_fichas" ON public.fichas_tecnicas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_own_fichas" ON public.fichas_tecnicas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- === itens_salvos ===
DROP POLICY IF EXISTS "allow_select_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "allow_insert_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "allow_update_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "allow_delete_itens" ON public.itens_salvos;

CREATE POLICY "users_select_own_itens" ON public.itens_salvos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_itens" ON public.itens_salvos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_itens" ON public.itens_salvos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_own_itens" ON public.itens_salvos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- === mapas_mentais ===
DROP POLICY IF EXISTS "allow_select_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "allow_insert_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "allow_update_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "allow_delete_mapas" ON public.mapas_mentais;

CREATE POLICY "users_select_own_mapas" ON public.mapas_mentais FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_mapas" ON public.mapas_mentais FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_mapas" ON public.mapas_mentais FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_own_mapas" ON public.mapas_mentais FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- === planos_acao ===
DROP POLICY IF EXISTS "allow_select_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "allow_insert_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "allow_update_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "allow_delete_planos" ON public.planos_acao;

CREATE POLICY "users_select_own_planos" ON public.planos_acao FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_planos" ON public.planos_acao FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_planos" ON public.planos_acao FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_own_planos" ON public.planos_acao FOR DELETE TO authenticated USING (auth.uid() = user_id);