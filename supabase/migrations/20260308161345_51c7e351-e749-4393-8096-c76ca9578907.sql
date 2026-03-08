
-- Drop ALL existing policies and recreate as EXPLICITLY PERMISSIVE

-- fichas_tecnicas
DROP POLICY IF EXISTS "Users select own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users insert own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users update own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users delete own fichas" ON public.fichas_tecnicas;

CREATE POLICY "fichas_select" ON public.fichas_tecnicas AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "fichas_insert" ON public.fichas_tecnicas AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fichas_update" ON public.fichas_tecnicas AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fichas_delete" ON public.fichas_tecnicas AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- mapas_mentais
DROP POLICY IF EXISTS "Users select own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users insert own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users update own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users delete own mapas" ON public.mapas_mentais;

CREATE POLICY "mapas_select" ON public.mapas_mentais AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "mapas_insert" ON public.mapas_mentais AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mapas_update" ON public.mapas_mentais AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mapas_delete" ON public.mapas_mentais AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- planos_acao
DROP POLICY IF EXISTS "Users select own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users insert own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users update own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users delete own planos" ON public.planos_acao;

CREATE POLICY "planos_select" ON public.planos_acao AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "planos_insert" ON public.planos_acao AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "planos_update" ON public.planos_acao AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "planos_delete" ON public.planos_acao AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- itens_salvos
DROP POLICY IF EXISTS "Users select own itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users insert own itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users update own itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "Users delete own itens" ON public.itens_salvos;

CREATE POLICY "itens_select" ON public.itens_salvos AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "itens_insert" ON public.itens_salvos AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "itens_update" ON public.itens_salvos AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "itens_delete" ON public.itens_salvos AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);
