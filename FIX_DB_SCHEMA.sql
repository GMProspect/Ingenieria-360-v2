-- 1. Agregar columna user_id a la tabla history
ALTER TABLE public.history 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Agregar columna user_id a la tabla equipos
ALTER TABLE public.equipos 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 3. Habilitar RLS (por si no se hizo)
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad (Eliminar anteriores y crear nuevas para evitar duplicados)
DROP POLICY IF EXISTS "Users can view own history" ON public.history;
DROP POLICY IF EXISTS "Users can insert own history" ON public.history;
DROP POLICY IF EXISTS "Users can delete own history" ON public.history;

CREATE POLICY "Users can view own history" ON public.history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own history" ON public.history FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own equipment" ON public.equipos;
DROP POLICY IF EXISTS "Users can insert own equipment" ON public.equipos;
DROP POLICY IF EXISTS "Users can update own equipment" ON public.equipos;
DROP POLICY IF EXISTS "Users can delete own equipment" ON public.equipos;

CREATE POLICY "Users can view own equipment" ON public.equipos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own equipment" ON public.equipos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own equipment" ON public.equipos FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own equipment" ON public.equipos FOR DELETE TO authenticated USING (auth.uid() = user_id);
