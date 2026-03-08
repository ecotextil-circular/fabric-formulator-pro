
-- Fix existing RLS policies: drop restrictive, create permissive
-- fichas_tecnicas
DROP POLICY IF EXISTS "Users can delete own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users can insert own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users can update own fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Users can view own fichas" ON public.fichas_tecnicas;

CREATE POLICY "Users can select own fichas" ON public.fichas_tecnicas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own fichas" ON public.fichas_tecnicas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own fichas" ON public.fichas_tecnicas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own fichas" ON public.fichas_tecnicas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- mapas_mentais
DROP POLICY IF EXISTS "Users can delete own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users can insert own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users can update own mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "Users can view own mapas" ON public.mapas_mentais;

CREATE POLICY "Users can select own mapas" ON public.mapas_mentais FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mapas" ON public.mapas_mentais FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mapas" ON public.mapas_mentais FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own mapas" ON public.mapas_mentais FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- planos_acao
DROP POLICY IF EXISTS "Users can delete own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users can insert own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users can update own planos" ON public.planos_acao;
DROP POLICY IF EXISTS "Users can view own planos" ON public.planos_acao;

CREATE POLICY "Users can select own planos" ON public.planos_acao FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own planos" ON public.planos_acao FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own planos" ON public.planos_acao FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own planos" ON public.planos_acao FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create generic saved items table for PDCA, Kanban, Calculator, Dashboard, Colecao
CREATE TABLE public.itens_salvos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL DEFAULT '',
  dados JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.itens_salvos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own itens" ON public.itens_salvos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own itens" ON public.itens_salvos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own itens" ON public.itens_salvos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own itens" ON public.itens_salvos FOR DELETE TO authenticated USING (auth.uid() = user_id);
