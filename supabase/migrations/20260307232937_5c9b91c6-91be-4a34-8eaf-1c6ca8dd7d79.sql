
-- Create fichas_tecnicas table
CREATE TABLE public.fichas_tecnicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referencia_codigo TEXT,
  data_criacao DATE,
  dados JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mapas_mentais table
CREATE TABLE public.mapas_mentais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL DEFAULT '',
  dados JSONB NOT NULL DEFAULT '{}'::jsonb,
  imagem_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create planos_acao table
CREATE TABLE public.planos_acao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL DEFAULT '',
  dados JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fichas_tecnicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapas_mentais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_acao ENABLE ROW LEVEL SECURITY;

-- RLS policies for fichas_tecnicas
CREATE POLICY "Users can view own fichas" ON public.fichas_tecnicas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own fichas" ON public.fichas_tecnicas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own fichas" ON public.fichas_tecnicas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own fichas" ON public.fichas_tecnicas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS policies for mapas_mentais
CREATE POLICY "Users can view own mapas" ON public.mapas_mentais FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mapas" ON public.mapas_mentais FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mapas" ON public.mapas_mentais FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own mapas" ON public.mapas_mentais FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS policies for planos_acao
CREATE POLICY "Users can view own planos" ON public.planos_acao FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own planos" ON public.planos_acao FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own planos" ON public.planos_acao FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own planos" ON public.planos_acao FOR DELETE TO authenticated USING (auth.uid() = user_id);
