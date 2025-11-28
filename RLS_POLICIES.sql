-- Enable RLS on tables
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- POLICY: HISTORY
-- Allow users to view their own history
CREATE POLICY "Users can view own history" 
ON public.history FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to insert their own history
CREATE POLICY "Users can insert own history" 
ON public.history FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own history
CREATE POLICY "Users can delete own history" 
ON public.history FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- POLICY: EQUIPOS (Inventory)
-- Allow users to view their own equipment
CREATE POLICY "Users can view own equipment" 
ON public.equipos FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to insert their own equipment
CREATE POLICY "Users can insert own equipment" 
ON public.equipos FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own equipment
CREATE POLICY "Users can update own equipment" 
ON public.equipos FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to delete their own equipment
CREATE POLICY "Users can delete own equipment" 
ON public.equipos FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
