
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE

-- fichas_tecnicas
DROP POLICY IF EXISTS "Users can delete own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users can insert own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users can select own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users can update own fichas" ON public.fichas_tecnicas;

CREATE POLICY "Users select own fichas" ON public.fichas_tecnicas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own fichas" ON public.fichas_tecnicas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own fichas" ON public.fichas_tecnicas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own fichas" ON public.fichas_tecnicas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- mapas_mentais
DROP POLICY IF EXISTS "Users can delete own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users can insert own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users can select own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users can update own mapas" ON public.mapas_mentais;

CREATE POLICY "Users select own mapas" ON public.mapas_mentais FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own mapas" ON public.mapas_mentais FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own mapas" ON public.mapas_mentais FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own mapas" ON public.mapas_mentais FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- planos_acao
DROP POLICY IF EXISTS "Users can delete own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users can insert own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users can select own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users can update own planos" ON public.planos_acao;

CREATE POLICY "Users select own planos" ON public.planos_acao FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own planos" ON public.planos_acao FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own planos" ON public.planos_acao FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own planos" ON public.planos_acao FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- itens_salvos
DROP POLICY IF EXISTS "Users can delete own itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users can insert own itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users can select own itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users can update own itens" ON public.itens_salvos;

CREATE POLICY "Users select own itens" ON public.itens_salvos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own itens" ON public.itens_salvos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own itens" ON public.itens_salvos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own itens" ON public.itens_salvos FOR DELETE TO authenticated USING (auth.uid() = user_id);
