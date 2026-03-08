
-- Drop ALL existing policies and recreate as PERMISSIVE explicitly

-- fichas_tecnicas
DROP POLICY IF EXISTS "allow_select_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "allow_insert_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "allow_update_fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "allow_delete_fichas" ON public.fichas_tecnicas;

CREATE POLICY "perm_select_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "perm_insert_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perm_update_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perm_delete_fichas" ON public.fichas_tecnicas AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- mapas_mentais
DROP POLICY IF EXISTS "allow_select_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "allow_insert_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "allow_update_mapas" ON public.mapas_mentais;
DROP POLICY IF EXISTS "allow_delete_mapas" ON public.mapas_mentais;

CREATE POLICY "perm_select_mapas" ON public.mapas_mentais AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "perm_insert_mapas" ON public.mapas_mentais AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perm_update_mapas" ON public.mapas_mentais AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perm_delete_mapas" ON public.mapas_mentais AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- planos_acao
DROP POLICY IF EXISTS "allow_select_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "allow_insert_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "allow_update_planos" ON public.planos_acao;
DROP POLICY IF EXISTS "allow_delete_planos" ON public.planos_acao;

CREATE POLICY "perm_select_planos" ON public.planos_acao AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "perm_insert_planos" ON public.planos_acao AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perm_update_planos" ON public.planos_acao AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perm_delete_planos" ON public.planos_acao AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- itens_salvos
DROP POLICY IF EXISTS "allow_select_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "allow_insert_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "allow_update_itens" ON public.itens_salvos;
DROP POLICY IF EXISTS "allow_delete_itens" ON public.itens_salvos;

CREATE POLICY "perm_select_itens" ON public.itens_salvos AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "perm_insert_itens" ON public.itens_salvos AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perm_update_itens" ON public.itens_salvos AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perm_delete_itens" ON public.itens_salvos AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "auth_upload" ON storage.objects AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "auth_select" ON storage.objects AS PERMISSIVE FOR SELECT TO authenticated USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "auth_delete" ON storage.objects AS PERMISSIVE FOR DELETE TO authenticated USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "public_read" ON storage.objects AS PERMISSIVE FOR SELECT TO anon USING (bucket_id = 'uploads');
